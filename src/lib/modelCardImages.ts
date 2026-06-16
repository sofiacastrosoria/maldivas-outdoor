import type { Product } from "@/types";
import {
  getUrlsWithPrefix,
  isRealManifestImage,
  withManifestVersion,
} from "@/lib/imageManifest";

const FABRIC_IDS = new Set(["negro", "gris", "beige", "blanco"]);

/** Tamaños permitidos en sliders de tarjeta de reposeras (solo estándar/simple). */
const REPOSERA_CARD_SIZE_SEGMENTS = new Set(["simple", "estandar"]);

function filterReposeraCardVariants(
  product: Product,
  variants: ModelCardVariant[]
): ModelCardVariant[] {
  if (product.category !== "reposeras") return variants;
  return variants.filter((v) => REPOSERA_CARD_SIZE_SEGMENTS.has(v.size));
}

export interface ModelCardVariant {
  url: string;
  structure: string;
  fabric: string;
  size: string;
}

function withVersion(url: string, filename: string): string {
  return withManifestVersion(url);
}

function typePrefix(product: Product): string | null {
  if (product.category === "reposeras") return "reposera";
  if (product.category === "living") return "living";
  if (product.category === "comedor") return "comedor";
  if (product.category === "mesas") return "mesa";
  return null;
}

/** Canonical folder for model-card images (strict isolation per model) */
export function getModelCardDirPrefix(product: Product): string | null {
  if (product.category === "mesas") {
    return `/images/mesas/${product.slug}/`;
  }
  if (
    product.category === "reposeras" ||
    product.category === "living" ||
    product.category === "comedor"
  ) {
    return `/images/${product.category}/${product.slug}/`;
  }
  return null;
}

function parseVariantFilename(
  filename: string,
  product: Product,
  prefix: string
): Pick<ModelCardVariant, "structure" | "fabric" | "size"> | null {
  const base = filename.replace(/\.(jpe?g|png|webp)$/i, "");
  const head = `${prefix}-${product.slug}-`;
  if (!base.startsWith(head)) return null;

  const rest = base.slice(head.length);
  const parts = rest.split("-");
  if (parts.length < 3) return null;

  const fabric = parts[parts.length - 1];
  if (!FABRIC_IDS.has(fabric)) return null;

  const size = parts[0];
  const structure = parts.slice(1, -1).join("-");
  if (!structure) return null;

  return { size, structure, fabric };
}

function parseMesaGalleryFile(
  filename: string,
  url: string
): ModelCardVariant | null {
  if (!/^[1-4]\.(jpe?g|png|webp)$/i.test(filename)) return null;
  return {
    url,
    size: filename,
    structure: filename,
    fabric: "",
  };
}

function manifestSaysReal(filename: string, url: string): boolean {
  return isRealManifestImage(url.split("?")[0], filename);
}

function probeImageDimensions(
  url: string
): Promise<{ ok: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({
        ok: true,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    img.onerror = () => resolve({ ok: false, width: 0, height: 0 });
    img.src = url;
  });
}

/** Real photo if manifest size is large enough OR loaded image has product-photo dimensions */
async function isRealUploadedImage(url: string, filename: string): Promise<boolean> {
  if (manifestSaysReal(filename, url)) return true;

  const { ok, width, height } = await probeImageDimensions(url);
  if (!ok) return false;
  return width >= 400 && height >= 280;
}

/**
 * All candidate URLs for one model folder (uses manifest.urls — avoids files-map collisions e.g. mesas/1.jpg).
 */
export function listModelCardCandidateUrls(product: Product): string[] {
  const dirPrefix = getModelCardDirPrefix(product);
  if (!dirPrefix) return [];
  return getUrlsWithPrefix(dirPrefix);
}

/**
 * Discover real images for model cards — sync pass from manifest metadata.
 */
export function getModelCardVariants(product: Product): ModelCardVariant[] {
  const prefix = typePrefix(product);
  const dirPrefix = getModelCardDirPrefix(product);
  if (!prefix || !dirPrefix) return [];

  const variants: ModelCardVariant[] = [];
  const seen = new Set<string>();

  for (const url of getUrlsWithPrefix(dirPrefix)) {
    const filename = url.split("/").pop() ?? "";
    if (!filename || seen.has(url)) continue;

    if (!manifestSaysReal(filename, url)) continue;

    let variant: ModelCardVariant | null = null;

    if (product.category === "mesas") {
      variant = parseMesaGalleryFile(filename, withVersion(url, filename));
    } else {
      const parsed = parseVariantFilename(filename, product, prefix);
      if (parsed) {
        variant = {
          url: withVersion(url, filename),
          ...parsed,
        };
      }
    }

    if (variant) {
      seen.add(url);
      variants.push(variant);
    }
  }

  return filterReposeraCardVariants(product, variants);
}

/**
 * Discover real images for model cards — manifest first (instant), probe only if empty.
 */
export async function discoverModelCardVariants(
  product: Product
): Promise<ModelCardVariant[]> {
  const fromManifest = getModelCardVariants(product);
  if (fromManifest.length > 0) return fromManifest;

  const prefix = typePrefix(product);
  const dirPrefix = getModelCardDirPrefix(product);
  if (!prefix || !dirPrefix) return [];

  const variants: ModelCardVariant[] = [];
  const seen = new Set<string>();
  const candidates = listModelCardCandidateUrls(product);

  for (const url of candidates) {
    const filename = url.split("/").pop() ?? "";
    if (!filename) continue;

    const real = await isRealUploadedImage(url, filename);
    if (!real) continue;

    let variant: ModelCardVariant | null = null;

    if (product.category === "mesas") {
      variant = parseMesaGalleryFile(filename, withVersion(url, filename));
    } else {
      const parsed = parseVariantFilename(filename, product, prefix);
      if (parsed) {
        variant = {
          url: withVersion(url, filename),
          ...parsed,
        };
      }
    }

    if (variant && !seen.has(variant.url)) {
      seen.add(variant.url);
      variants.push(variant);
    }
  }

  return filterReposeraCardVariants(product, variants);
}

/** Prefer a different structure and/or fabric than the current slide */
export function pickNextVariantIndex(
  pool: ModelCardVariant[],
  currentIndex: number
): number {
  if (pool.length === 0) return 0;
  if (pool.length === 1) return 0;

  const current = pool[currentIndex];
  const diverse = pool
    .map((v, i) => ({ v, i }))
    .filter(
      ({ v, i }) =>
        i !== currentIndex &&
        (v.structure !== current.structure || v.fabric !== current.fabric)
    );

  if (diverse.length > 0) {
    return diverse[Math.floor(Math.random() * diverse.length)].i;
  }

  let next = currentIndex;
  while (next === currentIndex) {
    next = Math.floor(Math.random() * pool.length);
  }
  return next;
}

export function pickInitialVariantIndex(pool: ModelCardVariant[]): number {
  if (pool.length === 0) return 0;
  return Math.floor(Math.random() * pool.length);
}

import type { Product, ProductConfig } from "@/types";
import type { SliderCategory } from "@/data/editorialSliders";
import imageManifest from "../../public/images/manifest.json";
import {
  buildImageFilename,
  buildImagePath,
  buildTableImagePath,
  defaultProductConfig,
  getImageFolder,
  isTableProduct,
  type TableImageIndex,
} from "@/lib/images";

type Manifest = {
  generatedAt: string;
  files: Record<
    string,
    {
      url: string;
      mtimeMs: number;
      size: number;
    }
  >;
  urls: string[];
};

const manifest = imageManifest as Manifest;

function unique(paths: (string | undefined)[]): string[] {
  return [...new Set(paths.filter(Boolean) as string[])];
}

function getManifestEntryByUrl(url: string) {
  for (const entry of Object.values(manifest.files)) {
    if (entry.url === url) return entry;
  }
  const filename = url.split("/").pop() ?? "";
  const entry = manifest.files[filename];
  return entry?.url === url ? entry : undefined;
}

function withVersion(url: string | undefined, filename?: string): string | undefined {
  if (!url) return undefined;
  const entry = getManifestEntryByUrl(url);
  if (!entry?.mtimeMs) {
    const name = filename ?? url.split("/").pop() ?? "";
    const byName = manifest.files[name];
    if (!byName?.mtimeMs || byName.url !== url) return url;
    const v = Math.round(byName.mtimeMs);
    return url.includes("?") ? `${url}&v=${v}` : `${url}?v=${v}`;
  }
  const v = Math.round(entry.mtimeMs);
  return url.includes("?") ? `${url}&v=${v}` : `${url}?v=${v}`;
}

/** Prefer configurator folders over slider fallbacks when the same filename exists twice */
function urlPriority(url: string): number {
  if (/^\/images\/(reposeras|living|comedor)\/[^/]+\/[^/]+\.(jpe?g|png|webp)$/i.test(url)) {
    return 0;
  }
  if (/^\/images\/mesas\/[^/]+\/[123]\.(jpe?g|png|webp)$/i.test(url)) return 0;
  if (url.includes("/model-sliders/")) return 1;
  if (url.includes("/sliders/")) return 2;
  return 3;
}

/** Lookup best real file path by filename (scanned from disk) */
export function getUrlByFilename(filename: string): string | undefined {
  return withVersion(manifest.files[filename]?.url, filename);
}

/** All discovered image URLs */
export function getAllImageUrls(): string[] {
  return manifest.urls ?? [];
}

function extractProductSlugFromFilename(filename: string): string | null {
  const base = filename.replace(/^\d+-/, "");
  const match = base.match(/(?:reposera|living|mesa|comedor)-([a-z0-9]+)-/i);
  return match?.[1]?.toLowerCase() ?? null;
}

function findFuzzyImageForEditorial(
  category: SliderCategory,
  file: string
): string | undefined {
  const slug = extractProductSlugFromFilename(file);
  if (!slug) return undefined;

  const categoryPrefix =
    category === "reposeras"
      ? "reposera"
      : category === "living"
        ? "living"
        : "comedor";

  const inCategorySliders = manifest.urls.filter((url) => {
    const name = url.split("/").pop()?.toLowerCase() ?? "";
    return (
      url.includes("/sliders/") &&
      name.includes(slug) &&
      name.includes(categoryPrefix)
    );
  });

  if (inCategorySliders.length > 0) {
    return inCategorySliders.sort(
      (a, b) => urlPriority(a) - urlPriority(b)
    )[0];
  }

  const configuratorMatch = manifest.urls.find((url) => {
    const name = url.split("/").pop()?.toLowerCase() ?? "";
    return name.includes(`${categoryPrefix}-${slug}-`);
  });

  return configuratorMatch;
}

/**
 * Ordered candidates: manifest match first, then canonical path, then common fallbacks.
 */
export function getConfiguratorCandidates(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string[] {
  if (isTableProduct(product)) {
    const canonical = buildTableImagePath(product, tableIndex);
    // Resolve only by full slug path — never by global filename (1.jpg, 2.jpg, 3.jpg).
    return unique([withVersion(canonical) ?? canonical]);
  }

  const cfg = config ?? defaultProductConfig(product);
  const filename = buildImageFilename(product, cfg);
  const folder = getImageFolder(product);
  const canonical = buildImagePath(product, cfg);

  return unique([
    getUrlByFilename(filename),
    withVersion(canonical, filename),
    `/images/${folder}/${filename}`,
    `/images/sliders/${filename}`,
    `/images/sliders/${folder}/${filename}`,
    `/images/${folder}/${product.slug}/${filename}`,
    `/images/model-sliders/${folder}/${product.slug}/${filename}`,
  ]);
}

/** Best resolved URL for configurator (first candidate) */
export function resolveConfiguratorImage(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  return getConfiguratorCandidates(product, config, tableIndex)[0];
}

/** Canonical placeholder path (real file on disk) */
export function fallbackPlaceholder(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  if (isTableProduct(product)) {
    const url = buildTableImagePath(product, tableIndex);
    return withVersion(url) ?? url;
  }
  const cfg = config ?? defaultProductConfig(product);
  const filename = buildImageFilename(product, cfg);
  const folder = getImageFolder(product);
  // Placeholder generator writes into /images/{folder}/{slug}/{filename}.jpg
  const url = `/images/${folder}/${product.slug}/${filename}`;
  return withVersion(url, filename) ?? url;
}

/** Public API: resolve real variant image or placeholder */
export function resolveVariantImage(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  const candidates = getConfiguratorCandidates(product, config, tableIndex);
  const best = candidates[0];
  return best ?? fallbackPlaceholder(product, config, tableIndex);
}

/** Resolve editorial/category slider src by filename */
export function resolveEditorialSlideSrc(
  category: SliderCategory,
  file: string
): string {
  const exact = getUrlByFilename(file);
  if (exact) return exact;

  const fuzzy = findFuzzyImageForEditorial(category, file);
  if (fuzzy) return withVersion(fuzzy, file) ?? fuzzy;

  return withVersion(`/images/sliders/${category}/${file}`, file) ?? `/images/sliders/${category}/${file}`;
}

/** Resolve editorial/model slider src by filename */
export function resolveSliderImage(
  preferredPath: string,
  filename?: string
): string {
  const name = filename ?? preferredPath.split("/").pop() ?? "";
  return getUrlByFilename(name) ?? withVersion(preferredPath, name) ?? preferredPath;
}

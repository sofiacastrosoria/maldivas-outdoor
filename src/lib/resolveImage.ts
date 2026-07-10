import type { Product, ProductConfig } from "@/types";
import type { SliderCategory } from "@/data/editorialSliders";
import {
  buildProductImageUrlCandidates,
  getImageManifest,
  getUrlByFilename,
  resolveBestProductImageUrl,
  toNextImageSrc,
  withManifestVersion,
} from "@/lib/imageManifest";
import {
  buildImageFilename,
  buildImagePath,
  buildTableImagePath,
  defaultProductConfig,
  getImageFolder,
  getMesaStoneImageIndex,
  getMesaStructureImageIndex,
  isTableProduct,
  usesMesaStoneImages,
  usesMesasStructureImages,
  type TableImageIndex,
} from "@/lib/images";
import {
  buildComedorImageFilename,
  buildComedorImagePath,
  usesComedorVariantImages,
} from "@/lib/comedorImages";

const manifest = getImageManifest();

function unique(paths: string[]): string[] {
  return [...new Set(paths)];
}

function expandProductCandidates(...canonicalUrls: string[]): string[] {
  // Strip ?v= — Next.js Image optimizer returns 400 for local paths with query strings
  return unique(
    canonicalUrls
      .flatMap((url) => buildProductImageUrlCandidates(url))
      .map((url) => toNextImageSrc(url))
  );
}

/** Prefer configurator folders over slider fallbacks when the same filename exists twice */
function urlPriority(url: string): number {
  if (/^\/images\/(reposeras|living|comedor)\/[^/]+\/[^/]+\.(jpe?g|png|webp)$/i.test(url)) {
    return 0;
  }
  if (/^\/images\/mesas\/[^/]+\/[1-4]\.(jpe?g|png|webp)$/i.test(url)) return 0;
  if (url.includes("/model-sliders/")) return 1;
  if (url.includes("/sliders/")) return 2;
  return 3;
}

/** Lookup best real file path by filename (scanned from disk) */
export { getUrlByFilename, getProductImageUrlByBasename } from "@/lib/imageManifest";

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
 * Ordered candidates: manifest JPG actual; PNG solo si existe; sin rutas 404.
 */
export function getConfiguratorCandidates(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string[] {
  if (usesMesasStructureImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    const index = getMesaStructureImageIndex(product, cfg);
    return expandProductCandidates(buildTableImagePath(product, index));
  }

  if (usesMesaStoneImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    const index = getMesaStoneImageIndex(product, cfg);
    return expandProductCandidates(buildTableImagePath(product, index));
  }

  if (usesComedorVariantImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    const canonical = buildComedorImagePath(product, cfg);
    return expandProductCandidates(canonical);
  }

  if (isTableProduct(product)) {
    return expandProductCandidates(buildTableImagePath(product, tableIndex));
  }

  const cfg = config ?? defaultProductConfig(product);
  const filename = buildImageFilename(product, cfg);
  const folder = getImageFolder(product);
  const canonical = buildImagePath(product, cfg);

  return expandProductCandidates(
    canonical,
    `/images/${folder}/${filename}`,
    `/images/${folder}/${product.slug}/${filename}`
  );
}

/** Best resolved URL for configurator (first existing file) */
export function resolveConfiguratorImage(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  const candidates = getConfiguratorCandidates(product, config, tableIndex);
  return candidates[0] ?? fallbackPlaceholder(product, config, tableIndex);
}

/** Canonical placeholder path (real file on disk) */
export function fallbackPlaceholder(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  if (usesMesasStructureImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    const url = buildTableImagePath(
      product,
      getMesaStructureImageIndex(product, cfg)
    );
    return toNextImageSrc(resolveBestProductImageUrl(url));
  }

  if (usesMesaStoneImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    const url = buildTableImagePath(
      product,
      getMesaStoneImageIndex(product, cfg)
    );
    return toNextImageSrc(resolveBestProductImageUrl(url));
  }

  if (usesComedorVariantImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    const url = buildComedorImagePath(product, cfg);
    return toNextImageSrc(resolveBestProductImageUrl(url));
  }

  if (isTableProduct(product)) {
    const url = buildTableImagePath(product, tableIndex);
    return toNextImageSrc(resolveBestProductImageUrl(url));
  }

  const cfg = config ?? defaultProductConfig(product);
  const folder = getImageFolder(product);
  const url = `/images/${folder}/${product.slug}/${buildImageFilename(product, cfg)}`;
  return toNextImageSrc(resolveBestProductImageUrl(url));
}

/** Public API: resolve real variant image or placeholder */
export function resolveVariantImage(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  return resolveConfiguratorImage(product, config, tableIndex);
}

/** Resolve editorial/category slider src by filename */
export function resolveEditorialSlideSrc(
  category: SliderCategory,
  file: string
): string {
  const exact = getUrlByFilename(file);
  if (exact) return exact;

  const fuzzy = findFuzzyImageForEditorial(category, file);
  if (fuzzy) return withManifestVersion(fuzzy) ?? fuzzy;

  return withManifestVersion(`/images/sliders/${category}/${file}`) ?? `/images/sliders/${category}/${file}`;
}

/** Resolve editorial/model slider src by filename */
export function resolveSliderImage(
  preferredPath: string,
  filename?: string
): string {
  const name = filename ?? preferredPath.split("/").pop() ?? "";
  return getUrlByFilename(name) ?? withManifestVersion(preferredPath) ?? preferredPath;
}

/** Formato canónico de imágenes de producto */
export const PRODUCT_IMAGE_EXTENSION = "jpg" as const;

/** Orden al resolver: JPG primero */
export const PRODUCT_IMAGE_FALLBACK_EXTENSIONS = [
  "jpg",
  "jpeg",
  "webp",
  "png",
] as const;

export type ProductImageExtension =
  (typeof PRODUCT_IMAGE_FALLBACK_EXTENSIONS)[number];

const IMAGE_EXT_RE = /\.(jpe?g|png|webp)$/i;

/** Rutas bajo /images/ que corresponden a fotos de producto (no editorial ni institucional) */
const PRODUCT_IMAGE_PATH_RE =
  /^\/images\/(reposeras|living|comedor|mesas)\/[^/]+\/[^/]+\.(png|jpe?g|webp)$/i;

const PRODUCT_TABLE_IMAGE_PATH_RE =
  /^\/images\/mesas\/[^/]+\/[1-4]\.(png|jpe?g|webp)$/i;

export function stripImageExtension(filename: string): string {
  return filename.replace(IMAGE_EXT_RE, "");
}

/** Nombre de archivo canónico (.jpg) */
export function toProductFilename(filenameOrBasename: string): string {
  return `${stripImageExtension(filenameOrBasename)}.${PRODUCT_IMAGE_EXTENSION}`;
}

/** Variantes de nombre para fallback (JPG → JPEG → WebP → PNG) */
export function productImageFilenameVariants(
  filenameOrBasename: string
): string[] {
  const base = stripImageExtension(filenameOrBasename);
  return PRODUCT_IMAGE_FALLBACK_EXTENSIONS.map((ext) => `${base}.${ext}`);
}

export function isProductImageUrl(url: string): boolean {
  const pathname = url.split("?")[0];
  return (
    PRODUCT_IMAGE_PATH_RE.test(pathname) ||
    PRODUCT_TABLE_IMAGE_PATH_RE.test(pathname)
  );
}

/** Sustituye extensión por .jpg en una URL de producto */
export function toProductJpgUrl(url: string): string {
  const [pathname, query] = url.split("?");
  if (!IMAGE_EXT_RE.test(pathname)) return url;
  const next = pathname.replace(IMAGE_EXT_RE, `.${PRODUCT_IMAGE_EXTENSION}`);
  return query ? `${next}?${query}` : next;
}

import type { SliderCategory } from "@/data/editorialSliders";
import {
  productImageFilenameVariants,
  stripImageExtension,
  toProductFilename,
  type ProductImageExtension,
} from "@/lib/productImageFormat";
import imageManifest from "../../public/images/manifest.json";

export type ManifestEntry = {
  url: string;
  mtimeMs: number;
  size: number;
};

export type ImageManifest = {
  generatedAt: string;
  files: Record<string, ManifestEntry>;
  urls: string[];
};

const manifest = imageManifest as ImageManifest;

/** Generated black placeholders are ~8–9 KB; real uploads are much larger */
export const PLACEHOLDER_MAX_BYTES = 12_000;

/** URL → entry (built once) */
const urlIndex = new Map<string, ManifestEntry>();
for (const entry of Object.values(manifest.files)) {
  if (!urlIndex.has(entry.url)) urlIndex.set(entry.url, entry);
}

/** Prefix → urls[] (built once) */
const prefixIndex = new Map<string, string[]>();
for (const url of manifest.urls) {
  const parts = url.split("/");
  for (let i = 3; i < parts.length; i++) {
    const prefix = parts.slice(0, i).join("/") + "/";
    const list = prefixIndex.get(prefix);
    if (list) list.push(url);
    else prefixIndex.set(prefix, [url]);
  }
}

export function getImageManifest(): ImageManifest {
  return manifest;
}

export function getManifestEntryByUrl(url: string): ManifestEntry | undefined {
  const pathname = url.split("?")[0];
  return urlIndex.get(pathname) ?? urlIndex.get(url);
}

export function manifestUrlExists(url: string): boolean {
  const pathname = url.split("?")[0];
  return manifest.urls.includes(pathname) || urlIndex.has(pathname);
}

export function getUrlsWithPrefix(prefix: string): string[] {
  return prefixIndex.get(prefix) ?? manifest.urls.filter((u) => u.startsWith(prefix));
}

export function withManifestVersion(url: string): string {
  const pathname = url.split("?")[0];
  const filename = pathname.split("/").pop() ?? "";
  const entry =
    getManifestEntryByUrl(pathname) ??
    (manifest.files[filename]?.url === pathname ? manifest.files[filename] : undefined);
  if (!entry?.mtimeMs) return url;
  const v = Math.round(entry.mtimeMs);
  return url.includes("?") ? `${url}&v=${v}` : `${url}?v=${v}`;
}

export function getUrlByFilename(filename: string): string | undefined {
  const entry = manifest.files[filename];
  if (!entry) return undefined;
  return withManifestVersion(entry.url);
}

/**
 * Resuelve URL de producto en manifest con preferencia JPG.
 */
export function getProductImageUrlByBasename(
  basename: string
): string | undefined {
  for (const filename of productImageFilenameVariants(basename)) {
    const url = getUrlByFilename(filename);
    if (url) return url;
  }
  return undefined;
}

const RESOLVE_EXT_ORDER: ProductImageExtension[] = [
  "jpg",
  "jpeg",
  "webp",
  "png",
];

function urlInDirectory(dir: string, base: string, ext: string): string {
  return `${dir}${base}.${ext}`;
}

/**
 * Candidatos sin 404: solo rutas presentes en manifest, con preferencia JPG.
 */
export function buildProductImageUrlCandidates(canonicalUrl: string): string[] {
  const pathname = canonicalUrl.split("?")[0];
  const slash = pathname.lastIndexOf("/");
  const dir = pathname.slice(0, slash + 1);
  const basename = pathname.slice(slash + 1);
  const base = stripImageExtension(basename);

  const results: string[] = [];
  const seen = new Set<string>();

  const add = (url?: string) => {
    if (!url) return;
    const key = url.split("?")[0];
    if (seen.has(key)) return;
    seen.add(key);
    results.push(withManifestVersion(key));
  };

  // 1. Rutas exactas en manifest (por carpeta — evita colisión mesas/1.jpg)
  for (const ext of RESOLVE_EXT_ORDER) {
    const fullPath = urlInDirectory(dir, base, ext);
    if (manifestUrlExists(fullPath)) add(fullPath);
  }

  // 2. Lookup global por nombre (variantes con nombre único)
  for (const ext of RESOLVE_EXT_ORDER) {
    const fname = `${base}.${ext}`;
    const fromManifest = getUrlByFilename(fname);
    if (fromManifest && fromManifest.split("?")[0].startsWith(dir)) {
      add(fromManifest);
    }
  }

  // 3. Sin manifest: solo JPG/JPEG legado (nunca .png fantasma)
  if (results.length === 0) {
    add(urlInDirectory(dir, base, "jpg"));
    add(urlInDirectory(dir, base, "jpeg"));
  }

  return results;
}

/** Mejor URL disponible con preferencia JPG */
export function resolveBestProductImageUrl(canonicalUrl: string): string {
  const pathname = canonicalUrl.split("?")[0];
  const slash = pathname.lastIndexOf("/");
  const dir = pathname.slice(0, slash + 1);
  const basename = pathname.slice(slash + 1);
  const jpgUrl = `${dir}${toProductFilename(basename)}`;

  const candidates = buildProductImageUrlCandidates(jpgUrl);
  if (candidates[0]) return candidates[0];

  return jpgUrl;
}

/** Alias: nombre canónico */
export { toProductFilename };

export function editorialSlideFileExists(
  category: SliderCategory,
  file: string
): boolean {
  const entry = manifest.files[file];
  if (!entry) return false;
  return entry.url === `/images/sliders/${category}/${file}`;
}

export function isRealManifestImage(url: string, filename: string): boolean {
  const entry = getManifestEntryByUrl(url);
  if (!entry || entry.url !== url.split("?")[0]) {
    const byName = manifest.files[filename];
    if (!byName || byName.url !== url.split("?")[0]) return false;
    return byName.size > PLACEHOLDER_MAX_BYTES;
  }
  return entry.size > PLACEHOLDER_MAX_BYTES;
}

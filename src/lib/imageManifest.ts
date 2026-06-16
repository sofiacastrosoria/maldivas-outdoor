import type { SliderCategory } from "@/data/editorialSliders";
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

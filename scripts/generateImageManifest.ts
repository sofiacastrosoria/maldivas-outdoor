import fs from "node:fs";
import path from "node:path";

type ManifestEntry = {
  url: string;
  mtimeMs: number;
  size: number;
};

type Manifest = {
  generatedAt: string;
  files: Record<string, ManifestEntry>;
  urls: string[];
};

const ROOT = process.cwd();
const IMAGES_ROOT = path.join(ROOT, "public", "images");
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

function urlPriority(url: string): number {
  // Canonical locations first
  if (
    /^\/images\/(reposeras|living|comedor)\/[^/]+\/[^/]+\.(jpe?g|png|webp)$/i.test(
      url
    )
  ) {
    return 0;
  }
  if (/^\/images\/mesas\/[^/]+\/[123]\.(jpe?g|png|webp)$/i.test(url)) return 0;
  if (url.includes("/model-sliders/")) return 1;
  if (url.includes("/sliders/")) return 2;
  return 3;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function scanImages(): Manifest {
  const files: Record<string, ManifestEntry> = {};
  const urls: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!IMAGE_EXTENSIONS.test(entry.name)) continue;

      const stat = fs.statSync(full);
      const rel = path.relative(IMAGES_ROOT, full).replace(/\\/g, "/");
      const url = `/images/${rel}`;
      urls.push(url);

      const manifestEntry: ManifestEntry = {
        url,
        mtimeMs: stat.mtimeMs,
        size: stat.size,
      };

      const existing = files[entry.name];
      if (!existing || urlPriority(url) < urlPriority(existing.url)) {
        files[entry.name] = manifestEntry;
      } else if (existing.url === url && manifestEntry.mtimeMs > existing.mtimeMs) {
        // same URL, keep freshest metadata
        files[entry.name] = manifestEntry;
      }
    }
  }

  walk(IMAGES_ROOT);

  return {
    generatedAt: new Date().toISOString(),
    files,
    urls: [...new Set(urls)].sort(),
  };
}

function main() {
  ensureDir(IMAGES_ROOT);
  const manifest = scanImages();
  const outPath = path.join(IMAGES_ROOT, "manifest.json");
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
  // eslint-disable-next-line no-console
  console.log(`OK: manifest generated (${Object.keys(manifest.files).length} files indexed)`);
}

main();


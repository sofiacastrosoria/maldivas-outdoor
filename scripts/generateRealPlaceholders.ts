import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

import { products } from "../src/data/products";
import { buildImageFilename } from "../src/lib/images";
import { collectComedorImageFilenames } from "../src/lib/comedorImages";
import type { Product } from "../src/types";
import { categoryEditorialSlides, type SliderCategory } from "../src/data/editorialSliders";

const ROOT = process.cwd();
const PUBLIC_IMAGES = path.join(ROOT, "public", "images");

const PLACEHOLDER_WIDTH = 1920;
const PLACEHOLDER_HEIGHT = 1280;

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function exists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function subtleTextSvg(text: string) {
  // Very subtle center text; safe to remove if you want pure black.
  const fontSize = 36;
  const opacity = 0.12;
  return Buffer.from(
    `<svg width="${PLACEHOLDER_WIDTH}" height="${PLACEHOLDER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000000"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial"
        font-size="${fontSize}" fill="#FFFFFF" opacity="${opacity}" letter-spacing="2">
        ${text}
      </text>
    </svg>`
  );
}

async function writePlaceholderJpg(filePath: string, label: string) {
  ensureDir(path.dirname(filePath));
  if (exists(filePath)) return false;

  const base = sharp({
    create: {
      width: PLACEHOLDER_WIDTH,
      height: PLACEHOLDER_HEIGHT,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  });

  const svg = subtleTextSvg(label);
  await base
    .composite([{ input: svg, blend: "over" }])
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(filePath);

  return true;
}

function getImageDirForProduct(product: Product): string {
  if (product.category === "reposeras") return path.join(PUBLIC_IMAGES, "reposeras", product.slug);
  if (product.category === "living") return path.join(PUBLIC_IMAGES, "living", product.slug);
  if (product.category === "comedor") return path.join(PUBLIC_IMAGES, "comedor", product.slug);
  if (product.category === "mesas") return path.join(PUBLIC_IMAGES, "mesas", product.slug);
  return path.join(PUBLIC_IMAGES, product.category, product.slug);
}

function isVariantProduct(product: Product): boolean {
  return product.category === "reposeras" || product.category === "living";
}

function isComedorVariantProduct(product: Product): boolean {
  return product.category === "comedor" && product.comedorVariantImages === true;
}

function isTableProduct(product: Product): boolean {
  return product.category === "mesas";
}

function collectExpectedVariantFilenames(): Map<string, Set<string>> {
  const byDir = new Map<string, Set<string>>();

  for (const product of products) {
    if (!isVariantProduct(product)) continue;

    const baseDir = getImageDirForProduct(product);
    if (!byDir.has(baseDir)) byDir.set(baseDir, new Set());

    for (const size of product.sizes) {
      for (const structure of product.structures) {
        for (const fabric of product.fabrics) {
          const filename = buildImageFilename(product, {
            sizeId: size.id,
            structureId: structure.id,
            fabricId: fabric.id,
          });
          byDir.get(baseDir)!.add(filename);
        }
      }
    }
  }

  for (const product of products) {
    if (!isComedorVariantProduct(product)) continue;
    const baseDir = getImageDirForProduct(product);
    if (!byDir.has(baseDir)) byDir.set(baseDir, new Set());
    for (const filename of collectComedorImageFilenames(product)) {
      byDir.get(baseDir)!.add(filename);
    }
  }

  return byDir;
}

function pruneObsoleteVariantPlaceholders(): number {
  const expected = collectExpectedVariantFilenames();
  let removed = 0;

  for (const [dir, filenames] of expected) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      if (!/\.jpe?g$/i.test(entry)) continue;
      if (filenames.has(entry)) continue;
      fs.unlinkSync(path.join(dir, entry));
      removed++;
    }
  }

  return removed;
}

async function generateVariantPlaceholders() {
  let created = 0;
  for (const product of products) {
    if (!isVariantProduct(product)) continue;

    const baseDir = getImageDirForProduct(product);
    ensureDir(baseDir);

    for (const size of product.sizes) {
      for (const structure of product.structures) {
        for (const fabric of product.fabrics) {
          const filename = buildImageFilename(product, {
            sizeId: size.id,
            structureId: structure.id,
            fabricId: fabric.id,
          });
          const full = path.join(baseDir, filename);
          // Use generic label; keep it subtle and stable.
          // You can switch to empty string for pure black.
          // eslint-disable-next-line no-await-in-loop
          const did = await writePlaceholderJpg(full, "IMAGE PLACEHOLDER");
          if (did) created++;
        }
      }
    }
  }
  return created;
}

async function generateComedorVariantPlaceholders() {
  let created = 0;
  for (const product of products) {
    if (!isComedorVariantProduct(product)) continue;

    const baseDir = getImageDirForProduct(product);
    ensureDir(baseDir);

    for (const filename of collectComedorImageFilenames(product)) {
      const full = path.join(baseDir, filename);
      // eslint-disable-next-line no-await-in-loop
      const did = await writePlaceholderJpg(full, "IMAGE PLACEHOLDER");
      if (did) created++;
    }
  }
  return created;
}

async function generateTablePlaceholders() {
  let created = 0;
  for (const product of products) {
    if (!isTableProduct(product)) continue;

    const baseDir = getImageDirForProduct(product);
    ensureDir(baseDir);
    for (const idx of [1, 2, 3]) {
      const full = path.join(baseDir, `${idx}.jpg`);
      // eslint-disable-next-line no-await-in-loop
      const did = await writePlaceholderJpg(full, "IMAGE PLACEHOLDER");
      if (did) created++;
    }
  }
  return created;
}

async function generateMesasStructurePlaceholders() {
  let created = 0;
  for (const product of products) {
    if (!product.mesaImageByStructure) continue;

    const baseDir = getImageDirForProduct(product);
    ensureDir(baseDir);
    const indexes = new Set(
      Object.values(product.mesaImageByStructure).filter(
        (v): v is 1 | 2 | 3 | 4 => v === 1 || v === 2 || v === 3 || v === 4
      )
    );

    for (const idx of indexes) {
      const full = path.join(baseDir, `${idx}.jpg`);
      // eslint-disable-next-line no-await-in-loop
      const did = await writePlaceholderJpg(full, "IMAGE PLACEHOLDER");
      if (did) created++;
    }
  }
  return created;
}

async function generateEditorialSliderPlaceholders() {
  let created = 0;
  const categories: SliderCategory[] = ["reposeras", "living", "comedor"];
  for (const category of categories) {
    const baseDir = path.join(PUBLIC_IMAGES, "sliders", category);
    ensureDir(baseDir);
    for (const slide of categoryEditorialSlides[category]) {
      const full = path.join(baseDir, slide.file);
      // eslint-disable-next-line no-await-in-loop
      const did = await writePlaceholderJpg(full, "IMAGE PLACEHOLDER");
      if (did) created++;
    }
  }
  return created;
}

async function generateModelSliderPlaceholders() {
  // Create 3 placeholders per model by default (1.jpg,2.jpg,3.jpg)
  let created = 0;
  const categories: Array<{ category: "reposeras" | "living" | "comedor"; slugs: string[] }> = [
    { category: "reposeras", slugs: products.filter((p) => p.category === "reposeras").map((p) => p.slug) },
    { category: "living", slugs: products.filter((p) => p.category === "living").map((p) => p.slug) },
    { category: "comedor", slugs: products.filter((p) => p.category === "comedor").map((p) => p.slug) },
  ];

  for (const { category, slugs } of categories) {
    for (const slug of slugs) {
      const baseDir = path.join(PUBLIC_IMAGES, "model-sliders", category, slug);
      ensureDir(baseDir);
      for (const idx of [1, 2, 3]) {
        const full = path.join(baseDir, `${idx}.jpg`);
        // eslint-disable-next-line no-await-in-loop
        const did = await writePlaceholderJpg(full, "IMAGE PLACEHOLDER");
        if (did) created++;
      }
    }
  }

  return created;
}

async function generateMarketingPlaceholders() {
  let created = 0;

  for (let i = 1; i <= 4; i++) {
    const full = path.join(PUBLIC_IMAGES, "about", `about-${i}.jpg`);
    // eslint-disable-next-line no-await-in-loop
    const did = await writePlaceholderJpg(full, "ABOUT IMAGE");
    if (did) created++;
  }

  for (let i = 1; i <= 4; i++) {
    const full = path.join(PUBLIC_IMAGES, "materiales", `material-${i}.jpg`);
    // eslint-disable-next-line no-await-in-loop
    const did = await writePlaceholderJpg(full, "MATERIAL IMAGE");
    if (did) created++;
  }

  const showroom = path.join(PUBLIC_IMAGES, "contacto", "local-showroom.jpg");
  if (await writePlaceholderJpg(showroom, "SHOWROOM IMAGE")) created++;

  return created;
}

async function main() {
  ensureDir(PUBLIC_IMAGES);

  const removedVariant = pruneObsoleteVariantPlaceholders();
  const createdVariant = await generateVariantPlaceholders();
  const createdComedor = await generateComedorVariantPlaceholders();
  const createdTables = await generateTablePlaceholders();
  const createdMesasStructure = await generateMesasStructurePlaceholders();
  const createdEditorial = await generateEditorialSliderPlaceholders();
  const createdModelSliders = await generateModelSliderPlaceholders();
  const createdMarketing = await generateMarketingPlaceholders();

  // eslint-disable-next-line no-console
  console.log(
    `OK: placeholders (removed=${removedVariant}, variants=${createdVariant}, comedor=${createdComedor}, tables=${createdTables}, mesasStructure=${createdMesasStructure}, editorial=${createdEditorial}, modelSliders=${createdModelSliders}, marketing=${createdMarketing})`
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});


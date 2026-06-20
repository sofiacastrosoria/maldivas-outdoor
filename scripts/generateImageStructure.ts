import fs from "node:fs";
import path from "node:path";

type Category = "reposeras" | "living" | "comedor";

interface VariantModel {
  typePrefix: "reposera" | "living";
  category: "reposeras" | "living";
  slug: string;
  sizes: string[];
  structures: string[];
  fabrics: string[];
}

const ROOT = process.cwd();
const IMAGES_ROOT = path.join(ROOT, "public", "images");

const SIZE_SEGMENT: Record<string, string> = {
  small: "simple",
  large: "doble",
  "1-cuerpo": "1cuerpo",
  "4-cuerpos": "4cuerpos",
  custom: "custom",
};

const STRUCTURE_SEGMENT: Record<string, string> = {
  "simil-madera-blanco": "similmaderablanco",
  "simil-madera-marron": "similmaderamarron",
  "anodizado-negro": "anodizadonegro",
  "anodizado-peltre": "anodizadopeltre",
  "greige-pintado": "greige",
  "negro-pintado": "negropintado",
  "blanco-pintado": "blancopintado",
  "anodizado-natural": "anodizadonatural",
  estandar: "estandar",
};

const FABRICS = ["negro", "gris", "beige", "blanco"];

const variantModels: VariantModel[] = [
  {
    typePrefix: "reposera",
    category: "reposeras",
    slug: "fendi",
    sizes: ["small", "large"],
    structures: [
      "simil-madera-blanco",
      "simil-madera-marron",
      "anodizado-negro",
      "anodizado-peltre",
      "greige-pintado",
    ],
    fabrics: FABRICS,
  },
  {
    typePrefix: "reposera",
    category: "reposeras",
    slug: "skorphio",
    sizes: ["small", "large"],
    structures: [
      "simil-madera-blanco",
      "simil-madera-marron",
      "anodizado-negro",
      "anodizado-peltre",
      "greige-pintado",
    ],
    fabrics: FABRICS,
  },
  {
    typePrefix: "reposera",
    category: "reposeras",
    slug: "malaga",
    sizes: ["small", "large"],
    structures: ["negro-pintado", "anodizado-peltre", "anodizado-negro"],
    fabrics: FABRICS,
  },
  {
    typePrefix: "reposera",
    category: "reposeras",
    slug: "mdq",
    sizes: ["small", "large"],
    structures: ["negro-pintado", "anodizado-natural"],
    fabrics: FABRICS,
  },
  {
    typePrefix: "reposera",
    category: "reposeras",
    slug: "baros",
    sizes: ["small"],
    structures: ["anodizado-natural"],
    fabrics: FABRICS,
  },
  {
    typePrefix: "living",
    category: "living",
    slug: "fendi",
    sizes: ["1-cuerpo", "4-cuerpos"],
    structures: [
      "simil-madera-blanco",
      "simil-madera-marron",
      "anodizado-negro",
      "anodizado-peltre",
      "greige-pintado",
      "negro-pintado",
    ],
    fabrics: FABRICS,
  },
  {
    typePrefix: "living",
    category: "living",
    slug: "skorphio",
    sizes: ["1-cuerpo", "4-cuerpos"],
    structures: [
      "simil-madera-blanco",
      "simil-madera-marron",
      "negro-pintado",
      "blanco-pintado",
    ],
    fabrics: FABRICS,
  },
  {
    typePrefix: "living",
    category: "living",
    slug: "malaga",
    sizes: ["1-cuerpo", "4-cuerpos"],
    structures: ["negro-pintado", "anodizado-peltre", "anodizado-negro"],
    fabrics: FABRICS,
  },
  {
    typePrefix: "living",
    category: "living",
    slug: "maldivas",
    sizes: ["1-cuerpo", "4-cuerpos"],
    structures: ["negro-pintado", "anodizado-peltre", "anodizado-negro"],
    fabrics: FABRICS,
  },
  {
    typePrefix: "living",
    category: "living",
    slug: "milos",
    sizes: ["1-cuerpo", "4-cuerpos"],
    structures: [
      "negro-pintado",
      "greige-pintado",
      "blanco-pintado",
      "anodizado-peltre",
      "anodizado-negro",
    ],
    fabrics: FABRICS,
  },
];

const tableModels = ["fendi", "skorphio", "malaga", "milos"];
const categorySliderCategories: Category[] = ["reposeras", "living", "comedor"];
const modelSliderMap = {
  reposeras: ["fendi", "skorphio", "malaga", "mdq", "baros"],
  living: ["fendi", "skorphio", "malaga", "maldivas", "milos"],
  comedor: ["marbella", "skorphio"],
} as const;

const toUpper = (value: string) => value.toUpperCase();

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function ensureFile(filePath: string, content = "") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
}

function variantFilename(
  typePrefix: "reposera" | "living",
  slug: string,
  sizeId: string,
  structureId: string,
  fabricId: string
) {
  const size = SIZE_SEGMENT[sizeId] ?? sizeId.replace(/-/g, "");
  const structure =
    STRUCTURE_SEGMENT[structureId] ?? structureId.replace(/-/g, "");
  return `${typePrefix}-${slug}-${size}-${structure}-${fabricId}.png`;
}

function generateVariantList(model: VariantModel): string[] {
  const names: string[] = [];
  for (const size of model.sizes) {
    for (const structure of model.structures) {
      for (const fabric of model.fabrics) {
        names.push(
          variantFilename(model.typePrefix, model.slug, size, structure, fabric)
        );
      }
    }
  }
  return names;
}

export function generateImageReferenceFile() {
  const lines: string[] = [];
  lines.push("# IMAGE REFERENCE");
  lines.push("");
  lines.push(
    "Lista auto-generada de nombres exactos para copiar/renombrar imágenes."
  );
  lines.push("");

  lines.push("# REPOSERAS");
  lines.push("");
  for (const model of variantModels.filter((m) => m.category === "reposeras")) {
    lines.push(`## ${toUpper(model.slug)}`);
    lines.push("");
    for (const fileName of generateVariantList(model)) {
      lines.push(fileName);
    }
    lines.push("");
  }

  lines.push("# LIVING");
  lines.push("");
  for (const model of variantModels.filter((m) => m.category === "living")) {
    lines.push(`## ${toUpper(model.slug)}`);
    lines.push("");
    for (const fileName of generateVariantList(model)) {
      lines.push(fileName);
    }
    lines.push("");
  }

  lines.push("# MESAS (MANUAL)");
  lines.push("");
  for (const model of tableModels) {
    lines.push(`## ${toUpper(model)}`);
    lines.push("");
    lines.push("1.png");
    lines.push("2.png");
    lines.push("3.png");
    lines.push("");
  }

  lines.push("# CATEGORY SLIDERS");
  lines.push("");
  for (const category of categorySliderCategories) {
    lines.push(`## ${toUpper(category)}`);
    lines.push("");
    for (let i = 1; i <= 8; i++) {
      lines.push(`slider-${String(i).padStart(2, "0")}.jpg`);
    }
    lines.push("");
  }

  lines.push("# MODEL SLIDERS");
  lines.push("");
  for (const [category, models] of Object.entries(modelSliderMap)) {
    lines.push(`## ${toUpper(category)}`);
    lines.push("");
    for (const model of models) {
      lines.push(`### ${toUpper(model)}`);
      lines.push("");
      for (let i = 1; i <= 8; i++) {
        lines.push(`${i}.png`);
      }
      lines.push("");
    }
  }

  const referencePath = path.join(IMAGES_ROOT, "IMAGE_REFERENCE.md");
  fs.writeFileSync(referencePath, `${lines.join("\n").trim()}\n`);
}

export function generateImageStructure() {
  ensureDir(IMAGES_ROOT);

  // Variant folders per model slug
  ensureDir(path.join(IMAGES_ROOT, "reposeras"));
  ensureDir(path.join(IMAGES_ROOT, "living"));
  ensureDir(path.join(IMAGES_ROOT, "comedor"));
  for (const model of variantModels) {
    const dir = path.join(IMAGES_ROOT, model.category, model.slug);
    ensureDir(dir);
    ensureFile(path.join(dir, ".gitkeep"));
  }

  // Table manual galleries
  ensureDir(path.join(IMAGES_ROOT, "mesas"));
  for (const model of tableModels) {
    const modelDir = path.join(IMAGES_ROOT, "mesas", model);
    ensureDir(modelDir);
    ensureFile(path.join(modelDir, ".gitkeep"));
  }

  // Category sliders
  for (const category of categorySliderCategories) {
    const dir = path.join(IMAGES_ROOT, "sliders", category);
    ensureDir(dir);
    ensureFile(path.join(dir, ".gitkeep"));
  }

  // Model sliders
  for (const [category, models] of Object.entries(modelSliderMap)) {
    for (const model of models) {
      const dir = path.join(IMAGES_ROOT, "model-sliders", category, model);
      ensureDir(dir);
      ensureFile(path.join(dir, ".gitkeep"));
    }
  }
}

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

function urlPriority(url: string): number {
  if (/^\/images\/(reposeras|living|comedor|mesas)\/[^/]+\.(jpe?g|png|webp)$/i.test(url)) {
    return 0;
  }
  if (url.includes("/model-sliders/")) return 1;
  if (url.includes("/sliders/")) return 2;
  return 3;
}

function scanImageFiles(): { files: Record<string, string>; urls: string[] } {
  const files: Record<string, string> = {};
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
      const rel = path.relative(IMAGES_ROOT, full).replace(/\\/g, "/");
      const url = `/images/${rel}`;
      urls.push(url);
      const existing = files[entry.name];
      if (!existing || urlPriority(url) < urlPriority(existing)) {
        files[entry.name] = url;
      }
    }
  }

  walk(IMAGES_ROOT);
  return { files, urls: [...new Set(urls)] };
}

export function generateImageManifestFile() {
  const { files, urls } = scanImageFiles();
  const manifest = {
    generatedAt: new Date().toISOString(),
    files,
    urls,
  };
  const manifestPath = path.join(IMAGES_ROOT, "manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function main() {
  generateImageStructure();
  generateImageReferenceFile();
  generateImageManifestFile();
  // eslint-disable-next-line no-console
  console.log("OK: structure + IMAGE_REFERENCE.md + manifest.json generated");
}

main();


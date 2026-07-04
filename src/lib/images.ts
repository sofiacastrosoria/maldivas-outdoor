import type { Product, ProductConfig } from "@/types";
import { getCheapestProductConfig } from "@/lib/pricing";

/* ─── Size segments in filenames ─── */
const SIZE_COMPACT: Record<string, string> = {
  small: "simple",
  large: "doble",
  "1-cuerpo": "1cuerpo",
  "4-cuerpos": "4cuerpos",
  custom: "custom",
};

/* ─── Structure segments (no hyphens) ─── */
const STRUCTURE_COMPACT: Record<string, string> = {
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

export type TableImageIndex = 1 | 2 | 3 | 4;

export function isTableProduct(product: Product): boolean {
  return (
    product.customizableSize === true &&
    product.fabrics.length === 0 &&
    product.category === "mesas"
  );
}

/** Mesas con imágenes en /images/mesas/{slug}/N.jpg según modelo de piedra */
export function usesMesaStoneImages(product: Product): boolean {
  return (
    product.category === "mesas" &&
    product.mesaImageByStone != null &&
    Object.keys(product.mesaImageByStone).length > 0
  );
}

export function getMesaStoneImageIndex(
  product: Product,
  config: Pick<ProductConfig, "stoneModel">
): TableImageIndex {
  const mapped = config.stoneModel
    ? product.mesaImageByStone?.[config.stoneModel]
    : undefined;
  return mapped ?? 1;
}

/** Mesas con imágenes en /images/mesas/{slug}/N.jpg según estructura */
export function usesMesasStructureImages(product: Product): boolean {
  return (
    product.category === "mesas" &&
    product.mesaImageByStructure != null &&
    Object.keys(product.mesaImageByStructure).length > 0
  );
}

export function getMesaStructureImageIndex(
  product: Product,
  config: Pick<ProductConfig, "structureId">
): TableImageIndex {
  const mapped = product.mesaImageByStructure?.[config.structureId];
  return mapped ?? 1;
}

/** Physical folder under /public/images/ */
export function getImageFolder(product: Product): string {
  // Configurator images for mesas/comedor live in /images/mesas/{slug}/
  if (product.category === "mesas") return "living";
  if (product.category === "reposeras") return "reposeras";
  if (product.category === "living") return "living";
  if (product.category === "comedor") return "comedor";
  return product.category;
}

/** Prefix in filename: reposera, living, mesa, comedor */
export function getCategoryPrefix(product: Product): string {
  if (product.category === "reposeras") return "reposera";
  if (product.category === "living") return "living";
  if (product.category === "mesas") return "mesa";
  if (product.category === "comedor") return "comedor";
  return product.category;
}

export function sizeToCompact(sizeId: string): string {
  return SIZE_COMPACT[sizeId] ?? sizeId.replace(/-/g, "");
}

export function structureToCompact(structureId: string): string {
  return STRUCTURE_COMPACT[structureId] ?? structureId.replace(/-/g, "");
}

/**
 * Builds filename:
 * reposera-fendi-simple-similmaderamarron-negro.jpg
 * living-fendi-1cuerpo-similmaderamarron-negro.jpg
 */
export function buildImageFilename(
  product: Product,
  config: Pick<ProductConfig, "sizeId" | "structureId" | "fabricId">
): string {
  const prefix = getCategoryPrefix(product);
  const size = sizeToCompact(config.sizeId);
  const structure = structureToCompact(config.structureId);
  const fabric = config.fabricId || "negro";
  return `${prefix}-${product.slug}-${size}-${structure}-${fabric}.jpg`;
}

export function buildTableFilename(
  product: Product,
  index: TableImageIndex
): string {
  return `${index}.jpg`;
}

/** Full public URL for configurator images */
export function buildImagePath(
  product: Product,
  config: Pick<ProductConfig, "sizeId" | "structureId" | "fabricId">
): string {
  const folder = getImageFolder(product);
  const filename = buildImageFilename(product, config);
  return `/images/${folder}/${filename}`;
}

export function buildTableImagePath(
  product: Product,
  index: TableImageIndex = 1
): string {
  return `/images/mesas/${product.slug}/${buildTableFilename(product, index)}`;
}

/** @alias — prefer resolveConfiguratorImage from @/lib/resolveImage for real files */
export function dynamicImageResolver(
  product: Product,
  config?: ProductConfig,
  tableIndex: TableImageIndex = 1
): string {
  if (usesMesasStructureImages(product)) {
    const cfg = config ?? defaultProductConfig(product);
    return buildTableImagePath(
      product,
      getMesaStructureImageIndex(product, cfg)
    );
  }
  if (isTableProduct(product)) {
    return buildTableImagePath(product, tableIndex);
  }
  const cfg = config ?? defaultProductConfig(product);
  return buildImagePath(product, cfg);
}

export function defaultProductConfig(product: Product): ProductConfig {
  return getCheapestProductConfig(product);
}

export const TABLE_IMAGE_INDEXES: TableImageIndex[] = [1, 2, 3];

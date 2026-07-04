import type { Product, ProductConfig } from "@/types";

/** Medida fija de referencia para imágenes del configurador (independiente de la medida elegida) */
const COMEDOR_IMAGE_REFERENCE_SIZE: Record<string, string> = {
  skorphio: "270",
  marbella: "260",
};

const STRUCTURE_SEGMENT: Record<string, string> = {
  "negro-pintado": "negro-pintado",
  "greige-pintado": "greige-pintado",
  "simil-madera-marron": "simil-madera-marron",
  "simil-madera-blanco": "simil-madera-blanco",
};

export function usesComedorVariantImages(product: Product): boolean {
  return product.category === "comedor" && product.comedorVariantImages === true;
}

function structureSegment(structureId: string): string {
  return STRUCTURE_SEGMENT[structureId] ?? structureId;
}

function referenceSizeId(product: Product): string {
  return COMEDOR_IMAGE_REFERENCE_SIZE[product.slug] ?? product.sizes[0]?.id ?? "";
}

export function buildComedorImageFilename(
  product: Product,
  config: Pick<ProductConfig, "structureId">
): string {
  const segment = structureSegment(config.structureId);
  const sizeId = referenceSizeId(product);
  if (product.slug === "skorphio") {
    return `skorphio-comedor-${segment}-${sizeId}.jpg`;
  }
  return `marbella-${segment}-${sizeId}.jpg`;
}

export function buildComedorImagePath(
  product: Product,
  config: Pick<ProductConfig, "structureId">
): string {
  return `/images/comedor/${product.slug}/${buildComedorImageFilename(product, config)}`;
}

export function collectComedorImageFilenames(product: Product): string[] {
  if (!usesComedorVariantImages(product)) return [];
  return product.structures.map((structure) =>
    buildComedorImageFilename(product, { structureId: structure.id })
  );
}

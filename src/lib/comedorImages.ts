import type { Product, ProductConfig } from "@/types";

const SKORPHIO_STRUCTURE_SEGMENT: Record<string, string> = {
  "anodizado-negro": "anodizado-negro-lijado",
  "anodizado-peltre": "anodizado-peltre-lijado",
  "negro-pintado": "negro-pintado",
  "greige-pintado": "greige-pintado",
  "simil-madera-marron": "simil-madera-marron",
  "simil-madera-blanco": "simil-madera-blanco",
};

const MARBELLA_STRUCTURE_SEGMENT: Record<string, string> = {
  "anodizado-negro": "anodizado-negro",
  "anodizado-peltre": "anodizado-peltre",
  "negro-pintado": "negro-pintado",
  "greige-pintado": "greige-pintado",
  "simil-madera-marron": "simil-madera-marron",
  "simil-madera-blanco": "simil-madera-blanco",
};

export function usesComedorVariantImages(product: Product): boolean {
  return product.category === "comedor" && product.comedorVariantImages === true;
}

function structureSegment(product: Product, structureId: string): string {
  const map =
    product.slug === "skorphio"
      ? SKORPHIO_STRUCTURE_SEGMENT
      : MARBELLA_STRUCTURE_SEGMENT;
  return map[structureId] ?? structureId;
}

export function buildComedorImageFilename(
  product: Product,
  config: Pick<ProductConfig, "structureId" | "sizeId">
): string {
  const segment = structureSegment(product, config.structureId);
  if (product.slug === "skorphio") {
    return `skorphio-comedor-${segment}-${config.sizeId}.jpg`;
  }
  return `marbella-${segment}-${config.sizeId}.jpg`;
}

export function buildComedorImagePath(
  product: Product,
  config: Pick<ProductConfig, "structureId" | "sizeId">
): string {
  return `/images/comedor/${product.slug}/${buildComedorImageFilename(product, config)}`;
}

export function collectComedorImageFilenames(product: Product): string[] {
  const names: string[] = [];
  for (const structure of product.structures) {
    for (const size of product.sizes) {
      names.push(
        buildComedorImageFilename(product, {
          structureId: structure.id,
          sizeId: size.id,
        })
      );
    }
  }
  return names;
}

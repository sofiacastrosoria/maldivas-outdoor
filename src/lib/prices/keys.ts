import type { Product, ProductConfig } from "@/types";
import type { VariantLookupInput } from "@/lib/prices/types";

export function buildVariantKey(input: VariantLookupInput): string {
  return [
    input.productId,
    input.sizeId || "",
    input.structureId || "",
    input.fabricId || "",
    input.stoneId || "",
  ].join("::");
}

export function stoneIdFromConfig(product: Product, config: ProductConfig): string {
  if (product.mesaStoneModels?.length) return config.stoneModel || "";
  if (product.slug === "marbella" && product.category === "comedor") {
    return config.stoneModel || config.stoneBrand || "";
  }
  if (product.stoneBrands?.length) return config.stoneBrand || "";
  return config.stoneModel || config.stoneBrand || "";
}

export function lookupInputFromConfig(
  product: Product,
  config: ProductConfig
): VariantLookupInput {
  return {
    productId: product.id,
    sizeId: config.sizeId || "",
    structureId: config.structureId || "",
    fabricId: product.fabrics.length > 0 ? config.fabricTypeId || "bliss" : "",
    stoneId: stoneIdFromConfig(product, config),
  };
}

export function isQuoteFabricType(fabricTypeId?: string | null): boolean {
  return fabricTypeId === "sunbrella";
}

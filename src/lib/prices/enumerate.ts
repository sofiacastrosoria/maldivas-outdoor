import { products } from "@/data/products";
import { ALL_STONE_MODELS, getAvailableStoneModels, STONE_BRAND_LABELS } from "@/data/comedorStone";
import { getMesaSkorphioStoneById } from "@/data/mesaSkorphioStone";
import { getProductTypeLabel } from "@/lib/productDisplay";
import { getLegacyPublishedListPrice } from "@/lib/prices/legacy";
import { FABRIC_TYPE_OPTIONS, type FabricTypeId } from "@/lib/premiumSwatches";
import { buildVariantKey } from "@/lib/prices/keys";
import type { PriceVariantRow } from "@/lib/prices/types";
import type { Product, ProductConfig } from "@/types";

const TELA_IDS: FabricTypeId[] = ["bliss", "sunbrella", "agora"];

function telaIds(product: Product): string[] {
  return product.fabrics.length > 0 ? [...TELA_IDS] : [""];
}

function telaLabel(telaId: string): string {
  if (!telaId) return "—";
  return FABRIC_TYPE_OPTIONS.find((opt) => opt.id === telaId)?.label ?? telaId;
}

function stoneIds(product: Product, sizeId: string): string[] {
  if (product.slug === "marbella" && product.category === "comedor") {
    const models = getAvailableStoneModels(sizeId);
    return models.length > 0 ? models.map((m) => m.id) : [""];
  }
  if (product.mesaStoneModels?.length) {
    return product.mesaStoneModels.map((m) => m.id);
  }
  if (product.stoneBrands?.length) {
    return product.stoneBrands.map((b) => b.id);
  }
  return [""];
}

function stoneLabel(product: Product, stoneId: string): string {
  if (!stoneId) return "—";
  const model = ALL_STONE_MODELS.find((m) => m.id === stoneId);
  if (model) {
    return `${STONE_BRAND_LABELS[model.brand]} · ${model.label}`;
  }
  const skorphio = getMesaSkorphioStoneById(stoneId);
  if (skorphio) {
    return `${STONE_BRAND_LABELS[skorphio.brand]} · ${skorphio.label}`;
  }
  const brand = product.stoneBrands?.find((b) => b.id === stoneId);
  return brand?.label ?? stoneId;
}

function configFor(
  product: Product,
  sizeId: string,
  structureId: string,
  telaId: string,
  stoneId: string
): ProductConfig {
  const marbellaModel =
    product.slug === "marbella" ? getAvailableStoneModels(sizeId).find((m) => m.id === stoneId) : undefined;
  const skorphioStone =
    product.category === "mesas" && product.slug === "skorphio"
      ? getMesaSkorphioStoneById(stoneId)
      : undefined;

  return {
    sizeId,
    structureId,
    fabricId: product.fabrics[0]?.id ?? "negro",
    fabricTypeId: telaId ? (telaId as FabricTypeId) : undefined,
    stoneBrand:
      marbellaModel?.brand ??
      skorphioStone?.brand ??
      (product.stoneBrands?.some((b) => b.id === stoneId) ? stoneId : product.stoneBrands?.[0]?.id),
    stoneModel: marbellaModel?.id ?? skorphioStone?.id ?? (product.mesaStoneModels ? stoneId : ""),
    customDimensions: "",
    customNotes: "",
  };
}

export function enumerateCommercialVariants(
  catalog: Product[] = products
): PriceVariantRow[] {
  const rows: PriceVariantRow[] = [];

  for (const product of catalog) {
    const collection = product.name;
    const productName = `${getProductTypeLabel(product)} ${product.name}`;

    for (const size of product.sizes) {
      for (const structure of product.structures) {
        for (const telaId of telaIds(product)) {
          for (const stoneId of stoneIds(product, size.id)) {
            const config = configFor(
              product,
              size.id,
              structure.id,
              telaId,
              stoneId
            );
            const published = getLegacyPublishedListPrice(product, config);
            const isQuoteTela = telaId === "agora" || telaId === "sunbrella";
            const quote = isQuoteTela || published === null;

            rows.push({
              variant_key: buildVariantKey({
                productId: product.id,
                sizeId: size.id,
                structureId: structure.id,
                fabricId: telaId,
                stoneId,
              }),
              product_id: product.id,
              product_name: productName,
              collection,
              category: product.category,
              size_id: size.id,
              size_label: size.dimensions || size.label,
              structure_id: structure.id,
              structure_label: structure.label,
              fabric_id: telaId,
              fabric_label: telaLabel(telaId),
              stone_id: stoneId,
              stone_label: stoneLabel(product, stoneId),
              list_price: quote ? 0 : published ?? 0,
              price_status: quote ? "quote" : "priced",
            });
          }
        }
      }
    }
  }

  return rows;
}

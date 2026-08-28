import {
  getAvailableStoneModels,
  getStoneModelById,
  STONE_BRAND_LABELS,
} from "@/data/comedorStone";
import { getMesaSkorphioStoneById } from "@/data/mesaSkorphioStone";
import { getDiscountRates, percentToMultiplier } from "@/lib/discounts/runtime";
import { findPriceVariant, isQuoteSelection } from "@/lib/prices/catalog";
import { isVariantHidden, isVariantSoldOut } from "@/lib/catalog/availability";
import { getLegacyPublishedListPrice } from "@/lib/prices/legacy";
import { getCommercialFabricLabel } from "@/lib/fabrics/commercial";
import { FABRIC_DISPLAY_LABELS } from "@/lib/premiumSwatches";
import type { Product, ProductConfig, CartItem } from "@/types";

export interface PriceBreakdown {
  list: number;
  cash: number;
  transfer: number;
  cashPercent: number;
  transferPercent: number;
}

export interface CartItemPricing extends PriceBreakdown {
  quantity: number;
  savingsTransfer: number;
  savingsCash: number;
  lineList: number;
  lineTransfer: number;
  lineCash: number;
  lineSavingsTransfer: number;
  lineSavingsCash: number;
}

export interface CartTotals {
  list: number;
  transfer: number;
  cash: number;
  savingsTransfer: number;
  savingsCash: number;
  cashPercent: number | null;
  transferPercent: number | null;
}

/** Precio de lista vigente (Supabase). No aplica −2% ni +10% extra: ya está publicado. */
export function getListPrice(
  product: Product,
  config: ProductConfig
): number | null {
  if (isQuoteSelection(product, config)) return null;
  if (isVariantHidden(product, config)) return null;

  const row = findPriceVariant(product, config);
  if (row) {
    if (row.price_status === "quote") return null;
    return row.list_price;
  }

  return getLegacyPublishedListPrice(product, config);
}

export function buildPriceBreakdown(
  list: number,
  productId?: string | null
): PriceBreakdown {
  const rates = getDiscountRates(productId);
  return {
    list,
    cash: Math.round(list * percentToMultiplier(rates.cashPercent)),
    transfer: Math.round(list * percentToMultiplier(rates.transferPercent)),
    cashPercent: rates.cashPercent,
    transferPercent: rates.transferPercent,
  };
}

export function calculateCartItemPricing(
  listUnitPrice: number,
  quantity: number,
  productId?: string | null
): CartItemPricing {
  const unit = buildPriceBreakdown(listUnitPrice, productId);
  const savingsTransfer = unit.list - unit.transfer;
  const savingsCash = unit.list - unit.cash;

  return {
    ...unit,
    quantity,
    savingsTransfer,
    savingsCash,
    lineList: unit.list * quantity,
    lineTransfer: unit.transfer * quantity,
    lineCash: unit.cash * quantity,
    lineSavingsTransfer: savingsTransfer * quantity,
    lineSavingsCash: savingsCash * quantity,
  };
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  let list = 0;
  let transfer = 0;
  let cash = 0;

  for (const item of items) {
    const pricing = calculateCartItemPricing(
      item.unitPrice,
      item.quantity,
      item.productId
    );
    list += pricing.lineList;
    transfer += pricing.lineTransfer;
    cash += pricing.lineCash;
  }

  const cashPercents = new Set(
    items.map((item) => getDiscountRates(item.productId).cashPercent)
  );
  const transferPercents = new Set(
    items.map((item) => getDiscountRates(item.productId).transferPercent)
  );

  return {
    list,
    transfer,
    cash,
    savingsTransfer: list - transfer,
    savingsCash: list - cash,
    cashPercent: cashPercents.size === 1 ? [...cashPercents][0] : null,
    transferPercent: transferPercents.size === 1 ? [...transferPercents][0] : null,
  };
}

export function calculatePriceBreakdown(
  product: Product,
  config: ProductConfig
): PriceBreakdown | null {
  const list = getListPrice(product, config);
  if (list === null) return null;
  return buildPriceBreakdown(list, product.id);
}

/** Precio de lista según tamaño y estructura (sin tela). */
export function calculatePrice(
  product: Product,
  config: ProductConfig
): number | null {
  return getListPrice(product, config);
}

/** Todas las combinaciones que impactan el precio de lista */
function enumeratePriceConfigs(product: Product): ProductConfig[] {
  const fabricId = product.fabrics[0]?.id ?? "negro";
  const configs: ProductConfig[] = [];

  for (const size of product.sizes) {
    for (const structure of product.structures) {
      if (product.slug === "marbella" && product.comedorVariantImages) {
        for (const model of getAvailableStoneModels(size.id)) {
          configs.push({
            sizeId: size.id,
            structureId: structure.id,
            fabricId,
            fabricTypeId: product.fabrics.length > 0 ? "bliss" : undefined,
            stoneBrand: model.brand,
            stoneModel: model.id,
            customDimensions: "",
            customNotes: "",
          });
        }
      } else if (product.mesaStoneModels?.length) {
        for (const stone of product.mesaStoneModels) {
          configs.push({
            sizeId: size.id,
            structureId: structure.id,
            fabricId,
            fabricTypeId: product.fabrics.length > 0 ? "bliss" : undefined,
            stoneBrand: stone.brand,
            stoneModel: stone.id,
            customDimensions: "",
            customNotes: "",
          });
        }
      } else {
        configs.push({
          sizeId: size.id,
          structureId: structure.id,
          fabricId,
          fabricTypeId: product.fabrics.length > 0 ? "bliss" : undefined,
          stoneBrand: product.stoneBrands?.[0]?.id,
          stoneModel: "",
          customDimensions: "",
          customNotes: "",
        });
      }
    }
  }

  return configs;
}

/** Preferencia al desempatar estructuras con el mismo precio de lista */
const STRUCTURE_TIE_BREAK_ORDER = [
  "negro-pintado",
  "greige-pintado",
  "anodizado-negro",
  "anodizado-peltre",
  "simil-madera-marron",
  "simil-madera-blanco",
] as const;

const structureTieBreakIndex = new Map<string, number>(
  STRUCTURE_TIE_BREAK_ORDER.map((id, index) => [id, index])
);

function structureTieBreakRank(structureId: string): number {
  return structureTieBreakIndex.get(structureId) ?? STRUCTURE_TIE_BREAK_ORDER.length;
}

function isPreferredCheapestConfig(
  candidate: ProductConfig,
  candidatePrice: number,
  current: ProductConfig,
  currentPrice: number
): boolean {
  if (candidatePrice < currentPrice) return true;
  if (candidatePrice > currentPrice) return false;
  return (
    structureTieBreakRank(candidate.structureId) <
    structureTieBreakRank(current.structureId)
  );
}

/** Configuración inicial: variante de menor precio de lista publicado */
export function getCheapestProductConfig(product: Product): ProductConfig {
  let best: ProductConfig | null = null;
  let bestPrice = Infinity;

  for (const cfg of enumeratePriceConfigs(product)) {
    if (isVariantHidden(product, cfg) || isVariantSoldOut(product, cfg)) continue;
    const price = getListPrice(product, cfg);
    if (price === null) continue;
    if (best === null || isPreferredCheapestConfig(cfg, price, best, bestPrice)) {
      bestPrice = price;
      best = cfg;
    }
  }

  if (best) {
    return {
      ...best,
      fabricTypeId: product.fabrics.length > 0 ? "bliss" : undefined,
    };
  }

  return {
    sizeId: product.sizes[0]?.id ?? "custom",
    structureId: product.structures[0]?.id ?? "estandar",
    fabricId: product.fabrics[0]?.id ?? "negro",
    fabricTypeId: product.fabrics.length > 0 ? "bliss" : undefined,
    stoneBrand: product.stoneBrands?.[0]?.id,
    stoneModel: "",
    customDimensions: "",
    customNotes: "",
  };
}

export function getMinimumListPrice(product: Product): number | null {
  let min = Infinity;

  for (const cfg of enumeratePriceConfigs(product)) {
    const list = getListPrice(product, cfg);
    if (list !== null && list < min) min = list;
  }

  return min === Infinity ? null : min;
}

/** Menor precio en efectivo (lista × 0.70) entre todas las variantes de tamaño y estructura. */
export function getMinimumCashPrice(product: Product): number | null {
  let min = Infinity;

  for (const cfg of enumeratePriceConfigs(product)) {
    const list = getListPrice(product, cfg);
    if (list !== null) {
      const cash = buildPriceBreakdown(list, product.id).cash;
      if (cash < min) min = cash;
    }
  }

  return min === Infinity ? null : min;
}

export function formatPrice(amount: number): string {
  const formatted = amount.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `$ ${formatted}`;
}

export function buildConfigSummary(
  product: Product,
  config: ProductConfig
): string[] {
  const lines: string[] = [];
  const size = product.sizes.find((s) => s.id === config.sizeId);
  const structure = product.structures.find((s) => s.id === config.structureId);
  const fabric = product.fabrics.find((f) => f.id === config.fabricId);

  if (size) {
    if (product.fixedMeasure || product.comedorVariantImages) {
      lines.push(`Medida: ${size.dimensions}`);
    } else {
      lines.push(`Tamaño: ${size.label} (${size.dimensions})`);
    }
  }
  if (structure) lines.push(`Estructura: ${structure.label}`);
  if (fabric) {
    lines.push(`Color: ${FABRIC_DISPLAY_LABELS[fabric.id] ?? fabric.label}`);
    lines.push(
      `Tapizado: ${getCommercialFabricLabel(config.fabricTypeId ?? "bliss")}`
    );
  }
  if (config.customDimensions)
    lines.push(`Medida personalizada: ${config.customDimensions}`);

  if (product.slug === "marbella" && config.stoneModel) {
    const model = getStoneModelById(config.stoneModel);
    if (model) {
      lines.push(
        `Piedra: ${STONE_BRAND_LABELS[model.brand]} — ${model.label}`
      );
    }
  } else if (
    product.slug === "skorphio" &&
    product.category === "mesas" &&
    config.stoneModel
  ) {
    const model = getMesaSkorphioStoneById(config.stoneModel);
    if (model) {
      lines.push(
        `Piedra: ${STONE_BRAND_LABELS[model.brand as keyof typeof STONE_BRAND_LABELS]} — ${model.label}`
      );
    }
  } else if (config.stoneBrand) {
    const brand = product.stoneBrands?.find((b) => b.id === config.stoneBrand);
    if (brand) lines.push(`Piedra: ${brand.label}`);
    if (config.stoneModel) lines.push(`Modelo: ${config.stoneModel}`);
  }

  if (config.customNotes) lines.push(`Notas: ${config.customNotes}`);

  return lines;
}

import {
  CASH_MULTIPLIER,
  COMEDOR_LIST_PRICES,
  LIST_PRICE_ADJUSTMENT,
  MESA_LIST_PRICES,
  REPOSERA_LIST_PRICES,
  SILLON_LIST_PRICES,
  TRANSFER_MULTIPLIER,
  type ComedorStoneBrandKey,
  type ReposeraSizeKey,
  type SillonSizeKey,
  type StructurePriceKey,
} from "@/data/pricing";
import {
  getStoneModelById,
  resolveMarbellaStoneBrand,
  STONE_BRAND_LABELS,
} from "@/data/comedorStone";
import { getMesaSkorphioStoneById } from "@/data/mesaSkorphioStone";
import type { Product, ProductConfig, CartItem } from "@/types";

const STRUCTURE_ID_TO_KEY: Record<string, StructurePriceKey> = {
  "simil-madera-marron": "similMaderaMarron",
  "simil-madera-blanco": "similMaderaBlanco",
  "anodizado-negro": "anodizadoNegroLijado",
  "anodizado-peltre": "anodizadoPeltreLijado",
  "anodizado-natural": "anodizadoNatural",
  "greige-pintado": "greigePintado",
  "negro-pintado": "negroPintado",
  "blanco-pintado": "blancoPintado",
};

const REPOSERA_SIZE_ID_TO_KEY: Record<string, ReposeraSizeKey> = {
  small: "estandar",
  large: "doble",
};

const SILLON_SIZE_ID_TO_KEY: Record<string, SillonSizeKey> = {
  "1-cuerpo": "1cuerpo",
  "4-cuerpos": "4cuerpos",
};

export interface PriceBreakdown {
  list: number;
  cash: number;
  transfer: number;
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
}

function toStructureKey(structureId: string): StructurePriceKey | null {
  return STRUCTURE_ID_TO_KEY[structureId] ?? null;
}

function getReposeraListPrice(
  slug: string,
  structureId: string,
  sizeId: string
): number | null {
  const structureKey = toStructureKey(structureId);
  const sizeKey = REPOSERA_SIZE_ID_TO_KEY[sizeId];
  if (!structureKey || !sizeKey) return null;

  return REPOSERA_LIST_PRICES[slug]?.[structureKey]?.[sizeKey] ?? null;
}

function getSillonListPrice(
  slug: string,
  structureId: string,
  sizeId: string
): number | null {
  const structureKey = toStructureKey(structureId);
  const sizeKey = SILLON_SIZE_ID_TO_KEY[sizeId];
  if (!structureKey || !sizeKey) return null;

  return SILLON_LIST_PRICES[slug]?.[structureKey]?.[sizeKey] ?? null;
}

function getMesaListPrice(slug: string, structureId: string): number | null {
  if (slug === "skorphio") return 3_747_600;
  const structureKey = toStructureKey(structureId);
  if (!structureKey) return null;
  return MESA_LIST_PRICES[slug]?.[structureKey] ?? null;
}

function getComedorListPrice(
  slug: string,
  structureId: string,
  sizeId: string,
  stoneBrand?: string
): number | null {
  const structureKey = toStructureKey(structureId);
  if (!structureKey) return null;

  const entry = COMEDOR_LIST_PRICES[slug]?.[structureKey]?.[sizeId];
  if (entry === undefined) return null;
  if (typeof entry === "number") return entry;

  const brand = resolveMarbellaStoneBrand(sizeId, stoneBrand);
  if (!brand) return null;
  return entry[brand as ComedorStoneBrandKey] ?? null;
}

/** Precio de lista publicado: valor del catálogo × 0.98 */
function applyListPriceAdjustment(catalogListPrice: number): number {
  return Math.round(catalogListPrice * LIST_PRICE_ADJUSTMENT);
}

export function getListPrice(
  product: Product,
  config: ProductConfig
): number | null {
  let catalogList: number | null = null;

  if (product.category === "reposeras") {
    catalogList = getReposeraListPrice(
      product.slug,
      config.structureId,
      config.sizeId
    );
  } else if (product.category === "living" && product.subcategory === "sillones") {
    catalogList = getSillonListPrice(
      product.slug,
      config.structureId,
      config.sizeId
    );
  } else if (product.category === "mesas") {
    catalogList = getMesaListPrice(product.slug, config.structureId);
  } else if (product.category === "comedor") {
    catalogList = getComedorListPrice(
      product.slug,
      config.structureId,
      config.sizeId,
      config.stoneBrand
    );
  }

  if (catalogList === null) return null;
  return applyListPriceAdjustment(catalogList);
}

export function buildPriceBreakdown(list: number): PriceBreakdown {
  return {
    list,
    cash: Math.round(list * CASH_MULTIPLIER),
    transfer: Math.round(list * TRANSFER_MULTIPLIER),
  };
}

export function calculateCartItemPricing(
  listUnitPrice: number,
  quantity: number
): CartItemPricing {
  const unit = buildPriceBreakdown(listUnitPrice);
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
    const pricing = calculateCartItemPricing(item.unitPrice, item.quantity);
    list += pricing.lineList;
    transfer += pricing.lineTransfer;
    cash += pricing.lineCash;
  }

  return {
    list,
    transfer,
    cash,
    savingsTransfer: list - transfer,
    savingsCash: list - cash,
  };
}

export function calculatePriceBreakdown(
  product: Product,
  config: ProductConfig
): PriceBreakdown | null {
  const list = getListPrice(product, config);
  if (list === null) return null;
  return buildPriceBreakdown(list);
}

/** Precio de lista según tamaño y estructura (sin tela). */
export function calculatePrice(
  product: Product,
  config: ProductConfig
): number | null {
  return getListPrice(product, config);
}

export function getMinimumListPrice(product: Product): number | null {
  let min = Infinity;

  for (const structure of product.structures) {
    for (const size of product.sizes) {
      const brands =
        product.slug === "marbella" && size.id === "200"
          ? (["infinity", "dekton"] as const)
          : ([undefined] as const);

      for (const brand of brands) {
        const list = getListPrice(product, {
          structureId: structure.id,
          sizeId: size.id,
          fabricId: product.fabrics[0]?.id ?? "",
          stoneBrand: brand,
        });
        if (list !== null && list < min) min = list;
      }
    }
  }

  return min === Infinity ? null : min;
}

/** Menor precio en efectivo (lista × 0.70) entre todas las variantes de tamaño y estructura. */
export function getMinimumCashPrice(product: Product): number | null {
  let min = Infinity;

  for (const structure of product.structures) {
    for (const size of product.sizes) {
      const brands =
        product.slug === "marbella" && size.id === "200"
          ? (["infinity", "dekton"] as const)
          : ([undefined] as const);

      for (const brand of brands) {
        const list = getListPrice(product, {
          structureId: structure.id,
          sizeId: size.id,
          fabricId: product.fabrics[0]?.id ?? "",
          stoneBrand: brand,
        });
        if (list !== null) {
          const cash = buildPriceBreakdown(list).cash;
          if (cash < min) min = cash;
        }
      }
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
  if (fabric) lines.push(`Tapizado: ${fabric.label}`);
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

import {
  CASH_MULTIPLIER,
  MESA_LIST_PRICES,
  REPOSERA_LIST_PRICES,
  SILLON_LIST_PRICES,
  TRANSFER_MULTIPLIER,
  type ReposeraSizeKey,
  type SillonSizeKey,
  type StructurePriceKey,
} from "@/data/pricing";
import type { Product, ProductConfig } from "@/types";

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
  const structureKey = toStructureKey(structureId);
  if (!structureKey) return null;
  return MESA_LIST_PRICES[slug]?.[structureKey] ?? null;
}

export function getListPrice(
  product: Product,
  config: ProductConfig
): number | null {
  if (product.category === "reposeras") {
    return getReposeraListPrice(product.slug, config.structureId, config.sizeId);
  }

  if (product.category === "living" && product.subcategory === "sillones") {
    return getSillonListPrice(product.slug, config.structureId, config.sizeId);
  }

  if (product.category === "mesas") {
    return getMesaListPrice(product.slug, config.structureId);
  }

  return null;
}

export function buildPriceBreakdown(list: number): PriceBreakdown {
  return {
    list,
    cash: Math.round(list * CASH_MULTIPLIER),
    transfer: Math.round(list * TRANSFER_MULTIPLIER),
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
      const list = getListPrice(product, {
        structureId: structure.id,
        sizeId: size.id,
        fabricId: product.fabrics[0]?.id ?? "",
      });
      if (list !== null && list < min) min = list;
    }
  }

  return min === Infinity ? null : min;
}

/** Menor precio en efectivo (lista × 0.70) entre todas las variantes de tamaño y estructura. */
export function getMinimumCashPrice(product: Product): number | null {
  let min = Infinity;

  for (const structure of product.structures) {
    for (const size of product.sizes) {
      const list = getListPrice(product, {
        structureId: structure.id,
        sizeId: size.id,
        fabricId: product.fabrics[0]?.id ?? "",
      });
      if (list !== null) {
        const cash = buildPriceBreakdown(list).cash;
        if (cash < min) min = cash;
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
    if (product.fixedMeasure) {
      lines.push(`Medida: ${size.dimensions}`);
    } else {
      lines.push(`Tamaño: ${size.label} (${size.dimensions})`);
    }
  }
  if (structure) lines.push(`Estructura: ${structure.label}`);
  if (fabric) lines.push(`Tapizado: ${fabric.label}`);
  if (config.customDimensions)
    lines.push(`Medida personalizada: ${config.customDimensions}`);
  if (config.stoneBrand) {
    const brand = product.stoneBrands?.find((b) => b.id === config.stoneBrand);
    if (brand) lines.push(`Piedra: ${brand.label}`);
  }
  if (config.stoneModel) lines.push(`Modelo: ${config.stoneModel}`);
  if (config.customNotes) lines.push(`Notas: ${config.customNotes}`);

  return lines;
}

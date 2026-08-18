import {
  COMEDOR_LIST_PRICES,
  COMEDOR_LIST_PRICE_INCREASE,
  LIST_PRICE_ADJUSTMENT,
  MESA_LIST_PRICES,
  REPOSERA_LIST_PRICES,
  SILLON_LIST_PRICES,
  type ComedorStoneBrandKey,
  type ReposeraSizeKey,
  type SillonSizeKey,
  type StructurePriceKey,
} from "@/data/pricing";
import { resolveMarbellaStoneBrand } from "@/data/comedorStone";
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

/**
 * Precio de lista publicado del catálogo histórico (×0.98, comedor ×1.10×0.98).
 * Solo se usa para migrar y como fallback si Supabase no está disponible.
 */
export function getLegacyPublishedListPrice(
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

  if (product.category === "comedor") {
    return Math.round(
      catalogList * COMEDOR_LIST_PRICE_INCREASE * LIST_PRICE_ADJUSTMENT
    );
  }

  return Math.round(catalogList * LIST_PRICE_ADJUSTMENT);
}

import {
  COMMERCIAL_FABRIC_OPTIONS,
  DEPRECATED_COMMERCIAL_FABRIC_IDS,
  getCommercialFabricLabel,
  isActiveCommercialFabricId,
} from "@/lib/fabrics/commercial";
import type { PriceVariantRow } from "@/lib/prices/types";

/** Colores de tapizado legacy guardados por error como fabric_id. */
export const LEGACY_COLOR_FABRIC_IDS = new Set(["negro", "gris", "beige", "blanco"]);

export const FABRIC_FILTER_OPTIONS = COMMERCIAL_FABRIC_OPTIONS;

export function isAdminPriceVariantRow(row: PriceVariantRow): boolean {
  if (LEGACY_COLOR_FABRIC_IDS.has(row.fabric_id)) return false;
  if (DEPRECATED_COMMERCIAL_FABRIC_IDS.has(row.fabric_id)) return false;
  if (!row.fabric_id) return true;
  return isActiveCommercialFabricId(row.fabric_id);
}

export function normalizeAdminPriceVariant(row: PriceVariantRow): PriceVariantRow {
  if (!row.fabric_id) return row;
  return {
    ...row,
    fabric_label: getCommercialFabricLabel(row.fabric_id),
  };
}

export function filterAdminPriceVariants(rows: PriceVariantRow[]): PriceVariantRow[] {
  return rows.filter(isAdminPriceVariantRow).map(normalizeAdminPriceVariant);
}

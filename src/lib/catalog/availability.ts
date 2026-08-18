import type { Product, ProductConfig } from "@/types";
import { lookupInputFromConfig, buildVariantKey } from "@/lib/prices/keys";
import { getPriceVariantRows } from "@/lib/prices/catalog";
import type { CatalogStatus } from "@/lib/catalog/types";

export interface VariantAvailabilityRow {
  variant_key: string;
  status: CatalogStatus;
}

let availabilityByKey = new Map<string, CatalogStatus>();

export function setRuntimeAvailability(rows: VariantAvailabilityRow[] | null): void {
  const next = new Map<string, CatalogStatus>();
  for (const row of rows ?? []) {
    next.set(row.variant_key, row.status);
  }
  availabilityByKey = next;
}

export function getAvailabilityByKey(variantKey: string): CatalogStatus {
  return availabilityByKey.get(variantKey) ?? "active";
}

export function getVariantAvailability(
  product: Product,
  config: ProductConfig
): CatalogStatus {
  const key = buildVariantKey(lookupInputFromConfig(product, config));
  return getAvailabilityByKey(key);
}

export function isVariantHidden(product: Product, config: ProductConfig): boolean {
  return getVariantAvailability(product, config) === "hidden";
}

export function isVariantSoldOut(product: Product, config: ProductConfig): boolean {
  return getVariantAvailability(product, config) === "sold_out";
}

export function isProductFullyHidden(productId: string): boolean {
  const rows = getPriceVariantRows().filter((row) => row.product_id === productId);
  if (rows.length === 0) return false;
  return rows.every((row) => getAvailabilityByKey(row.variant_key) === "hidden");
}

export function isProductFullySoldOut(productId: string): boolean {
  const rows = getPriceVariantRows().filter(
    (row) =>
      row.product_id === productId && getAvailabilityByKey(row.variant_key) !== "hidden"
  );
  if (rows.length === 0) return false;
  return rows.every((row) => getAvailabilityByKey(row.variant_key) === "sold_out");
}

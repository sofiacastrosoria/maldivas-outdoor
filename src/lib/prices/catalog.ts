import type { Product, ProductConfig } from "@/types";
import { enumerateCommercialVariants } from "@/lib/prices/enumerate";
import {
  buildVariantKey,
  isQuoteFabricType,
  lookupInputFromConfig,
} from "@/lib/prices/keys";
import type { PriceVariantRow } from "@/lib/prices/types";

let runtimeCatalog: Map<string, PriceVariantRow> | null = null;

function seedMap(): Map<string, PriceVariantRow> {
  const map = new Map<string, PriceVariantRow>();
  for (const row of enumerateCommercialVariants()) {
    map.set(row.variant_key, row);
  }
  return map;
}

let seedCache: Map<string, PriceVariantRow> | null = null;

function fallbackCatalog(): Map<string, PriceVariantRow> {
  if (!seedCache) seedCache = seedMap();
  return seedCache;
}

export function setRuntimePriceCatalog(rows: PriceVariantRow[] | null): void {
  if (!rows || rows.length === 0) {
    runtimeCatalog = null;
    return;
  }
  const map = new Map<string, PriceVariantRow>();
  for (const row of rows) {
    map.set(row.variant_key, row);
  }
  runtimeCatalog = map;
}

export function getRuntimePriceCatalog(): Map<string, PriceVariantRow> {
  return runtimeCatalog ?? fallbackCatalog();
}

export function getPriceVariantRows(): PriceVariantRow[] {
  return [...getRuntimePriceCatalog().values()];
}

export function findPriceVariant(
  product: Product,
  config: ProductConfig
): PriceVariantRow | undefined {
  const key = buildVariantKey(lookupInputFromConfig(product, config));
  return getRuntimePriceCatalog().get(key);
}

export function isQuoteSelection(
  product: Product,
  config: ProductConfig
): boolean {
  const row = findPriceVariant(product, config);
  if (row) return row.price_status === "quote";
  if (product.fabrics.length > 0 && isQuoteFabricType(config.fabricTypeId)) {
    return true;
  }
  return false;
}

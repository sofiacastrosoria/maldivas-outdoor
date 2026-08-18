import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { DEFAULT_DISCOUNT_RATES, type DiscountRates, type ProductDiscountRow } from "@/lib/discounts/types";
import { setRuntimeDiscounts } from "@/lib/discounts/runtime";
import { setRuntimeCatalog } from "@/lib/catalog/runtime";
import { setRuntimeAvailability, type VariantAvailabilityRow } from "@/lib/catalog/availability";
import type { CatalogProductRow, ProductStatusRow } from "@/lib/catalog/types";

async function fetchDiscountBundle(): Promise<{
  global: DiscountRates;
  overrides: ProductDiscountRow[];
}> {
  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return { global: { ...DEFAULT_DISCOUNT_RATES }, overrides: [] };
  }

  const [{ data: settings }, { data: overrides }] = await Promise.all([
    supabase
      .from("discount_settings")
      .select("cash_percent, transfer_percent")
      .eq("id", "global")
      .maybeSingle(),
    supabase.from("product_discounts").select("product_id, cash_percent, transfer_percent"),
  ]);

  return {
    global: settings
      ? {
          cashPercent: Number(settings.cash_percent),
          transferPercent: Number(settings.transfer_percent),
        }
      : { ...DEFAULT_DISCOUNT_RATES },
    overrides: (overrides ?? []) as ProductDiscountRow[],
  };
}

async function fetchCatalogBundle(): Promise<{
  statuses: ProductStatusRow[];
  customs: CatalogProductRow[];
  availability: VariantAvailabilityRow[];
}> {
  const supabase = createSupabasePublicClient();
  if (!supabase) return { statuses: [], customs: [], availability: [] };

  const [{ data: statuses }, { data: customs }, { data: availability }] = await Promise.all([
    supabase.from("product_status").select("product_id, status"),
    supabase
      .from("catalog_products")
      .select(
        "id, category, collection, name, slug, description, image_url, list_price, status, created_at, updated_at"
      ),
    supabase.from("variant_availability").select("variant_key, status"),
  ]);

  return {
    statuses: (statuses ?? []) as ProductStatusRow[],
    customs: (customs ?? []) as CatalogProductRow[],
    availability: (availability ?? []) as VariantAvailabilityRow[],
  };
}

export const getCachedDiscountBundle = unstable_cache(
  fetchDiscountBundle,
  ["store-discounts"],
  { revalidate: 30, tags: ["store-discounts"] }
);

export const getCachedCatalogBundle = unstable_cache(
  fetchCatalogBundle,
  ["store-catalog"],
  { revalidate: 30, tags: ["store-catalog"] }
);

export async function loadServerStore(): Promise<void> {
  const [discounts, catalog] = await Promise.all([
    getCachedDiscountBundle(),
    getCachedCatalogBundle(),
  ]);
  setRuntimeDiscounts(discounts.global, discounts.overrides);
  setRuntimeCatalog(catalog.statuses, catalog.customs);
  setRuntimeAvailability(catalog.availability);
}

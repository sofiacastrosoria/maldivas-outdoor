import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { enumerateCommercialVariants } from "@/lib/prices/enumerate";
import { setRuntimePriceCatalog } from "@/lib/prices/catalog";
import type { PriceVariantRow } from "@/lib/prices/types";

async function fetchPriceCatalog(): Promise<PriceVariantRow[]> {
  const seed = enumerateCommercialVariants();
  const supabase = createSupabasePublicClient();
  if (!supabase) return seed;

  const { data, error } = await supabase
    .from("price_variants")
    .select(
      "id, variant_key, product_id, product_name, collection, category, size_id, size_label, structure_id, structure_label, fabric_id, fabric_label, stone_id, stone_label, list_price, price_status, updated_at"
    );

  if (error || !data?.length) return seed;
  return data as PriceVariantRow[];
}

export const getCachedPriceCatalog = unstable_cache(
  fetchPriceCatalog,
  ["price-variants"],
  { revalidate: 30, tags: ["price-variants"] }
);

export async function loadServerPriceCatalog(): Promise<PriceVariantRow[]> {
  const rows = await getCachedPriceCatalog();
  setRuntimePriceCatalog(rows);
  return rows;
}

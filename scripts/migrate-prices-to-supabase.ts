/**
 * Migración controlada de precios actuales → Supabase.
 *
 * Uso:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate-prices-to-supabase.ts
 *
 * La service role solo se usa en este script, nunca en el frontend.
 */
import { createClient } from "@supabase/supabase-js";
import { enumerateCommercialVariants } from "../src/lib/prices/enumerate";
import { getLegacyPublishedListPrice } from "../src/lib/prices/legacy";
import { products } from "../src/data/products";
import { lookupInputFromConfig } from "../src/lib/prices/keys";
import { buildVariantKey } from "../src/lib/prices/keys";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const rows = enumerateCommercialVariants();
  const priced = rows.filter((r) => r.price_status === "priced");
  const quoted = rows.filter((r) => r.price_status === "quote");

  console.log(`Variantes a migrar: ${rows.length}`);
  console.log(`  priced: ${priced.length}`);
  console.log(`  quote: ${quoted.length}`);

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const chunkSize = 200;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize).map((row) => ({
      variant_key: row.variant_key,
      product_id: row.product_id,
      product_name: row.product_name,
      collection: row.collection,
      category: row.category,
      size_id: row.size_id,
      size_label: row.size_label,
      structure_id: row.structure_id,
      structure_label: row.structure_label,
      fabric_id: row.fabric_id,
      fabric_label: row.fabric_label,
      stone_id: row.stone_id,
      stone_label: row.stone_label,
      list_price: row.list_price,
      price_status: row.price_status,
    }));
    const { error } = await supabase.from("price_variants").upsert(chunk, {
      onConflict: "variant_key",
      ignoreDuplicates: true,
    });
    if (error) {
      console.error("Error upsert", error.message);
      process.exit(1);
    }
    console.log(`Upsert ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }

  const { count, error: countError } = await supabase
    .from("price_variants")
    .select("*", { count: "exact", head: true });
  if (countError) {
    console.error(countError.message);
    process.exit(1);
  }

  let mismatches = 0;
  for (const product of products) {
    for (const size of product.sizes) {
      for (const structure of product.structures) {
        const fabricId = product.fabrics[0]?.id ?? "";
        const config = {
          sizeId: size.id,
          structureId: structure.id,
          fabricId: fabricId || "negro",
          fabricTypeId: product.fabrics.length ? "bliss" as const : undefined,
          stoneBrand: product.stoneBrands?.[0]?.id,
          stoneModel: "",
        };
        const legacy = getLegacyPublishedListPrice(product, config);
        const key = buildVariantKey(lookupInputFromConfig(product, config));
        const migrated = rows.find((r) => r.variant_key === key);
        if (legacy !== null && migrated && migrated.list_price !== legacy) {
          mismatches += 1;
          console.warn("Mismatch", key, legacy, migrated.list_price);
        }
      }
    }
  }

  console.log(`Filas en Supabase: ${count}`);
  console.log(`Mismatches muestra (config base): ${mismatches}`);
  if (count !== rows.length) {
    console.warn("La cantidad en Supabase no coincide con el enumerado local.");
  } else {
    console.log("OK: cantidad de variantes coincide.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

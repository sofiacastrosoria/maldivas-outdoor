/**
 * Migra telas comerciales en Supabase a las 2 opciones vigentes.
 *
 * Uso:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate-fabrics-commercial.ts
 */
import { createClient } from "@supabase/supabase-js";
import { enumerateCommercialVariants } from "../src/lib/prices/enumerate";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const blissLabel = "Sunbrella Canvas - Agora - Linetex";
  const natteLabel = "Sunbrella Natte";

  const { error: blissError } = await supabase
    .from("price_variants")
    .update({ fabric_label: blissLabel })
    .eq("fabric_id", "bliss");
  if (blissError) {
    console.error("bliss update", blissError.message);
    process.exit(1);
  }

  const { error: sunbrellaError } = await supabase
    .from("price_variants")
    .update({
      fabric_label: natteLabel,
      price_status: "quote",
      list_price: 0,
    })
    .eq("fabric_id", "sunbrella");
  if (sunbrellaError) {
    console.error("sunbrella update", sunbrellaError.message);
    process.exit(1);
  }

  const { data: agoraRows, error: agoraSelectError } = await supabase
    .from("price_variants")
    .select("id, variant_key, product_id, size_id, structure_id, stone_id")
    .eq("fabric_id", "agora");
  if (agoraSelectError) {
    console.error("agora select", agoraSelectError.message);
    process.exit(1);
  }

  const { data: blissRows, error: blissSelectError } = await supabase
    .from("price_variants")
    .select("product_id, size_id, structure_id, stone_id")
    .eq("fabric_id", "bliss");
  if (blissSelectError) {
    console.error("bliss select", blissSelectError.message);
    process.exit(1);
  }

  const blissKeys = new Set(
    (blissRows ?? []).map(
      (r) => `${r.product_id}::${r.size_id}::${r.structure_id}::${r.stone_id}`
    )
  );

  const agoraToDelete = (agoraRows ?? []).filter((row) =>
    blissKeys.has(`${row.product_id}::${row.size_id}::${row.structure_id}::${row.stone_id}`)
  );
  const agoraOrphans = (agoraRows ?? []).filter(
    (row) =>
      !blissKeys.has(
        `${row.product_id}::${row.size_id}::${row.structure_id}::${row.stone_id}`
      )
  );

  const deleteKeys = [...agoraToDelete, ...agoraOrphans].map((r) => r.variant_key);
  if (deleteKeys.length > 0) {
    const { error: availError } = await supabase
      .from("variant_availability")
      .delete()
      .in("variant_key", deleteKeys);
    if (availError) {
      console.error("variant_availability delete", availError.message);
      process.exit(1);
    }

    const deleteIds = [...agoraToDelete, ...agoraOrphans].map((r) => r.id);
    const { error: deleteError } = await supabase
      .from("price_variants")
      .delete()
      .in("id", deleteIds);
    if (deleteError) {
      console.error("agora delete", deleteError.message);
      process.exit(1);
    }
  }

  const expected = enumerateCommercialVariants();
  const chunkSize = 200;
  for (let i = 0; i < expected.length; i += chunkSize) {
    const chunk = expected.slice(i, i + chunkSize).map((row) => ({
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
    });
    if (error) {
      console.error("upsert enumerate", error.message);
      process.exit(1);
    }
  }

  const { count, error: countError } = await supabase
    .from("price_variants")
    .select("*", { count: "exact", head: true })
    .in("fabric_id", ["agora"]);
  if (countError) {
    console.error(countError.message);
    process.exit(1);
  }

  console.log("Migración de telas completada.");
  console.log(`  Ágora eliminadas: ${deleteKeys.length}`);
  console.log(`  Ágora restantes: ${count ?? 0}`);
  console.log(`  Variantes enumeradas: ${expected.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

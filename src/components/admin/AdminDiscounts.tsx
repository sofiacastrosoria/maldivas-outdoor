"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products as seedProducts } from "@/data/products";
import { getCollectionName } from "@/lib/catalog/runtime";
import { getCategoryLabel } from "@/lib/catalog/href";
import { DEFAULT_DISCOUNT_RATES } from "@/lib/discounts/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ProductDiscountRow {
  product_id: string;
  cash_percent: number;
  transfer_percent: number;
}

function parsePercent(raw: string): number | null {
  const cleaned = raw.trim().replace("%", "").replace(",", ".");
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0 || value > 100) return null;
  return value;
}

export function AdminDiscounts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalCash, setGlobalCash] = useState("30");
  const [globalTransfer, setGlobalTransfer] = useState("15");
  const [overrides, setOverrides] = useState<Map<string, ProductDiscountRow>>(new Map());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkCash, setBulkCash] = useState("30");
  const [bulkTransfer, setBulkTransfer] = useState("15");
  const [drafts, setDrafts] = useState<Record<string, { cash: string; transfer: string }>>({});
  const [customNames, setCustomNames] = useState<
    { id: string; name: string; category: string; collection: string }[]
  >([]);
  const [saving, setSaving] = useState(false);

  const catalog = useMemo(() => {
    const seed = seedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      collection: getCollectionName(product),
    }));
    return [...seed, ...customNames];
  }, [customNames]);

  const load = useCallback(async () => {
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const [{ data: settings, error: settingsError }, { data: rows, error: rowsError }, { data: customs }] =
        await Promise.all([
          supabase
            .from("discount_settings")
            .select("cash_percent, transfer_percent")
            .eq("id", "global")
            .maybeSingle(),
          supabase.from("product_discounts").select("product_id, cash_percent, transfer_percent"),
          supabase.from("catalog_products").select("id, name, category, collection"),
        ]);
      if (settingsError) throw settingsError;
      if (rowsError) throw rowsError;

      setGlobalCash(String(settings?.cash_percent ?? DEFAULT_DISCOUNT_RATES.cashPercent));
      setGlobalTransfer(String(settings?.transfer_percent ?? DEFAULT_DISCOUNT_RATES.transferPercent));
      setOverrides(
        new Map(
          ((rows ?? []) as ProductDiscountRow[]).map((row) => [row.product_id, row])
        )
      );
      setCustomNames(
        (customs ?? []).map((row) => ({
          id: `custom:${row.id}`,
          name: String(row.name),
          category: String(row.category),
          collection: String(row.collection || row.name),
        }))
      );
      setDrafts({});
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los descuentos. ¿Corriste el SQL 003 en Supabase?"
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const refreshSite = async () => {
    router.refresh();
    await fetch("/api/admin/revalidate", { method: "POST" });
  };

  const saveGlobal = async () => {
    const cash = parsePercent(globalCash);
    const transfer = parsePercent(globalTransfer);
    if (cash == null || transfer == null) {
      setError("Los descuentos globales tienen que ser números entre 0 y 100.");
      return;
    }
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.from("discount_settings").upsert({
      id: "global",
      cash_percent: cash,
      transfer_percent: transfer,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
    await refreshSite();
  };

  const saveOverride = async (productId: string, cashRaw: string, transferRaw: string) => {
    const cash = parsePercent(cashRaw);
    const transfer = parsePercent(transferRaw);
    if (cash == null || transfer == null) {
      setError("Los descuentos del producto tienen que ser números entre 0 y 100.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error: upsertError } = await supabase.from("product_discounts").upsert({
      product_id: productId,
      cash_percent: cash,
      transfer_percent: transfer,
      updated_at: new Date().toISOString(),
    });
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    await load();
    await refreshSite();
  };

  const clearOverride = async (productId: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase
      .from("product_discounts")
      .delete()
      .eq("product_id", productId);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await load();
    await refreshSite();
  };

  const applyBulk = async () => {
    const cash = parsePercent(bulkCash);
    const transfer = parsePercent(bulkTransfer);
    if (cash == null || transfer == null || selected.size === 0) return;
    const supabase = createSupabaseBrowserClient();
    const rows = [...selected].map((product_id) => ({
      product_id,
      cash_percent: cash,
      transfer_percent: transfer,
      updated_at: new Date().toISOString(),
    }));
    const { error: upsertError } = await supabase.from("product_discounts").upsert(rows);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSelected(new Set());
    await load();
    await refreshSite();
  };

  const globalCashN = parsePercent(globalCash) ?? DEFAULT_DISCOUNT_RATES.cashPercent;
  const globalTransferN = parsePercent(globalTransfer) ?? DEFAULT_DISCOUNT_RATES.transferPercent;

  return (
    <div className="px-4 py-8 md:px-8">
      <header className="mb-8">
        <p className="text-[10px] tracking-[0.25em] uppercase text-matte-black/40">
          Panel
        </p>
        <h1 className="mt-2 text-3xl font-extralight tracking-tight">Descuentos</h1>
        <p className="mt-2 max-w-2xl text-sm font-light text-matte-black/55">
          El porcentaje se descuenta del precio de lista. Podés cambiarlo para toda la
          página o dejar un valor distinto en productos seleccionados.
        </p>
      </header>

      {error ? (
        <p className="mb-4 border border-red-200 bg-white px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-matte-black/50">Cargando descuentos…</p>
      ) : (
        <>
          <section className="mb-8 rounded-xl border border-stone/20 bg-white p-5">
            <h2 className="text-lg font-light">Toda la página</h2>
            <p className="mt-1 text-sm font-light text-matte-black/55">
              Aplica a todos los productos que no tengan un descuento propio.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 max-w-xl">
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] uppercase text-matte-black/40">
                  % efectivo
                </span>
                <input
                  value={globalCash}
                  onChange={(e) => setGlobalCash(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm outline-none focus:border-matte-black"
                />
              </label>
              <label className="block">
                <span className="text-[10px] tracking-[0.2em] uppercase text-matte-black/40">
                  % transferencia
                </span>
                <input
                  value={globalTransfer}
                  onChange={(e) => setGlobalTransfer(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm outline-none focus:border-matte-black"
                />
              </label>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveGlobal()}
              className="mt-5 rounded-lg bg-matte-black px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white disabled:opacity-40"
            >
              Guardar descuentos globales
            </button>
          </section>

          <section className="mb-4 flex flex-col gap-3 rounded-lg border border-stone/20 bg-white px-4 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-light text-matte-black/60">
                {selected.size} productos seleccionados
              </p>
              <p className="mt-1 text-xs text-matte-black/45">
                Se guarda un descuento propio en cada uno. Después se puede volver al global.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.12em] text-matte-black/40">
                  Efectivo
                </span>
                <input
                  value={bulkCash}
                  onChange={(e) => setBulkCash(e.target.value)}
                  className="mt-1 w-24 rounded-lg border border-premium-border px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.12em] text-matte-black/40">
                  Transferencia
                </span>
                <input
                  value={bulkTransfer}
                  onChange={(e) => setBulkTransfer(e.target.value)}
                  className="mt-1 w-24 rounded-lg border border-premium-border px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={() => void applyBulk()}
                className="rounded-lg bg-matte-black px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white disabled:opacity-40"
              >
                Aplicar a seleccionados
              </button>
            </div>
          </section>

          <div className="overflow-x-auto border border-stone/20 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand/30 text-[10px] uppercase tracking-[0.12em] text-matte-black/50">
                <tr>
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={catalog.length > 0 && catalog.every((p) => selected.has(p.id))}
                      onChange={() => {
                        if (catalog.every((p) => selected.has(p.id))) setSelected(new Set());
                        else setSelected(new Set(catalog.map((p) => p.id)));
                      }}
                    />
                  </th>
                  <th className="px-3 py-3">Producto</th>
                  <th className="px-3 py-3">Colección</th>
                  <th className="px-3 py-3">Categoría</th>
                  <th className="px-3 py-3">Origen</th>
                  <th className="px-3 py-3">% efectivo</th>
                  <th className="px-3 py-3">% transferencia</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {catalog.map((product) => {
                  const override = overrides.get(product.id);
                  const draft = drafts[product.id] ?? {
                    cash: String(override?.cash_percent ?? globalCashN),
                    transfer: String(override?.transfer_percent ?? globalTransferN),
                  };
                  return (
                    <tr key={product.id} className="border-t border-stone/15">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(product.id)}
                          onChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(product.id)) next.delete(product.id);
                              else next.add(product.id);
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="px-3 py-3 font-light">{product.name}</td>
                      <td className="px-3 py-3">{product.collection}</td>
                      <td className="px-3 py-3">{getCategoryLabel(product.category)}</td>
                      <td className="px-3 py-3 text-xs uppercase tracking-[0.12em] text-matte-black/45">
                        {override ? "Propio" : "Global"}
                      </td>
                      <td className="px-3 py-3">
                        <input
                          value={draft.cash}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [product.id]: { ...draft, cash: e.target.value },
                            }))
                          }
                          className="w-20 rounded border border-transparent px-2 py-1 hover:border-stone/30 focus:border-matte-black outline-none"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <input
                          value={draft.transfer}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [product.id]: { ...draft, transfer: e.target.value },
                            }))
                          }
                          className="w-20 rounded border border-transparent px-2 py-1 hover:border-stone/30 focus:border-matte-black outline-none"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => void saveOverride(product.id, draft.cash, draft.transfer)}
                            className="text-[10px] uppercase tracking-[0.12em] text-matte-black/50 hover:text-matte-black"
                          >
                            Guardar
                          </button>
                          {override ? (
                            <button
                              type="button"
                              onClick={() => void clearOverride(product.id)}
                              className="text-[10px] uppercase tracking-[0.12em] text-matte-black/50 hover:text-matte-black"
                            >
                              Usar global
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

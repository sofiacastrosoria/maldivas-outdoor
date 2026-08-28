"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/pricing";
import { getCommercialFabricLabel } from "@/lib/fabrics/commercial";
import {
  FABRIC_FILTER_OPTIONS,
  filterAdminPriceVariants,
} from "@/lib/admin/priceVariants";
import type { PriceChangeLogRow, PriceVariantRow } from "@/lib/prices/types";

function parsePercent(raw: string): number | null {
  const cleaned = raw.trim().replace("%", "").replace(",", ".");
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value === 0) return null;
  return value;
}

function applyPercent(price: number, percent: number): number {
  return Math.max(0, Math.round(price * (1 + percent / 100)));
}

export function AdminDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<PriceVariantRow[]>([]);
  const [logs, setLogs] = useState<PriceChangeLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [structure, setStructure] = useState("");
  const [fabric, setFabric] = useState("");
  const [stone, setStone] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [percentInput, setPercentInput] = useState("+5%");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [bulkNotice, setBulkNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: variants, error: variantsError } = await supabase
        .from("price_variants")
        .select("*")
        .order("product_name")
        .order("size_label")
        .order("structure_label");
      if (variantsError) {
        setError(variantsError.message);
        setLoading(false);
        return;
      }
      setRows(filterAdminPriceVariants((variants ?? []) as PriceVariantRow[]));
      setDrafts({});

      const { data: history } = await supabase
        .from("price_change_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(80);
      setLogs((history ?? []) as PriceChangeLogRow[]);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el panel");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (category && row.category !== category) return false;
      if (collection && row.collection !== collection) return false;
      if (structure && row.structure_id !== structure) return false;
      if (fabric && row.fabric_id !== fabric) return false;
      if (stone && row.stone_id !== stone) return false;
      if (!q) return true;
      return [
        row.product_name,
        row.collection,
        row.size_label,
        row.structure_label,
        row.fabric_label,
        row.stone_label,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, search, category, collection, structure, fabric, stone]);

  const options = useMemo(() => {
    const uniq = (pick: (row: PriceVariantRow) => string) =>
      [...new Set(rows.map(pick).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return {
      categories: uniq((r) => r.category),
      collections: uniq((r) => r.collection),
      structures: rows.map((r) => ({ id: r.structure_id, label: r.structure_label })),
      fabrics: FABRIC_FILTER_OPTIONS.map((opt) => ({
        id: opt.id,
        label: opt.label,
      })),
      stones: rows.map((r) => ({ id: r.stone_id, label: r.stone_label })),
    };
  }, [rows]);

  const uniquePairs = (items: { id: string; label: string }[]) => {
    const map = new Map<string, string>();
    for (const item of items) {
      if (!item.id) continue;
      if (!map.has(item.id)) map.set(item.id, item.label);
    }
    return [...map.entries()];
  };

  const selectedRows = filtered.filter((row) => selected.has(row.id || row.variant_key));
  const pricedSelectedRows = selectedRows.filter((row) => row.price_status === "priced");
  const quoteSelectedRows = selectedRows.filter((row) => row.price_status === "quote");
  const percent = parsePercent(percentInput);

  const toggleAll = () => {
    if (filtered.every((row) => selected.has(row.id || row.variant_key))) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filtered.map((row) => row.id || row.variant_key)));
  };

  const saveRow = async (
    row: PriceVariantRow,
    patch: Partial<Pick<PriceVariantRow, "list_price" | "price_status">>
  ) => {
    if (!row.id) return;
    setSavingId(row.id);
    const supabase = createSupabaseBrowserClient();
    const label = getCommercialFabricLabel(row.fabric_id);
    const update: Partial<Pick<PriceVariantRow, "list_price" | "price_status">> & {
      fabric_label: string;
    } = { ...patch, fabric_label: label };
    if (patch.price_status === "quote") {
      update.list_price = 0;
    }
    const { error: updateError } = await supabase
      .from("price_variants")
      .update(update)
      .eq("id", row.id);
    setSavingId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
    router.refresh();
    await fetch("/api/admin/revalidate", { method: "POST" });
  };

  const applyBulk = async () => {
    if (percent === null || pricedSelectedRows.length === 0) return;
    const ids = pricedSelectedRows.map((row) => row.id).filter(Boolean) as string[];
    const supabase = createSupabaseBrowserClient();
    const { error: rpcError } = await supabase.rpc("apply_percent_to_variants", {
      p_ids: ids,
      p_percent: percent,
    });
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    if (quoteSelectedRows.length > 0) {
      setBulkNotice(
        `${quoteSelectedRows.length} variante(s) A cotizar fueron omitidas del cambio masivo.`
      );
    } else {
      setBulkNotice("");
    }
    setConfirmOpen(false);
    setSelected(new Set());
    await load();
    router.refresh();
    await fetch("/api/admin/revalidate", { method: "POST" });
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-matte-black/40">
            Panel
          </p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">
            Precios y variantes
          </h1>
          <p className="mt-2 max-w-xl text-sm font-light text-matte-black/55">
            Cada fila es una combinación comercial independiente. Los descuentos de
            transferencia y efectivo se calculan sobre el precio de lista.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowLog((v) => !v)}
          className="rounded-lg border border-matte-black/20 px-4 py-2 text-[11px] uppercase tracking-[0.16em]"
        >
          {showLog ? "Variantes" : "Historial"}
        </button>
      </header>

      {bulkNotice ? (
        <p className="mb-4 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {bulkNotice}
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 border border-red-200 bg-white px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {showLog ? (
        <section className="overflow-x-auto border border-stone/20 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-sand/30 text-[10px] uppercase tracking-[0.12em] text-matte-black/50">
              <tr>
                <th className="px-3 py-3">Fecha</th>
                <th className="px-3 py-3">Producto</th>
                <th className="px-3 py-3">Anterior</th>
                <th className="px-3 py-3">Nuevo</th>
                <th className="px-3 py-3">%</th>
                <th className="px-3 py-3">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-stone/15">
                  <td className="px-3 py-3 whitespace-nowrap text-xs">
                    {new Date(log.created_at).toLocaleString("es-AR")}
                  </td>
                  <td className="px-3 py-3">{log.product_name}</td>
                  <td className="px-3 py-3">{formatPrice(log.old_list_price ?? 0)}</td>
                  <td className="px-3 py-3">{formatPrice(log.new_list_price ?? 0)}</td>
                  <td className="px-3 py-3">
                    {log.percent_applied != null ? `${log.percent_applied}%` : "—"}
                  </td>
                  <td className="px-3 py-3 text-xs">{log.changed_by_email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto…"
              className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm outline-none focus:border-matte-black md:col-span-2"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm">
              <option value="">Categoría</option>
              {options.categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={collection} onChange={(e) => setCollection(e.target.value)} className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm">
              <option value="">Colección</option>
              {options.collections.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={structure} onChange={(e) => setStructure(e.target.value)} className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm">
              <option value="">Estructura</option>
              {uniquePairs(options.structures).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <select value={fabric} onChange={(e) => setFabric(e.target.value)} className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm">
              <option value="">Tela</option>
              {uniquePairs(options.fabrics).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
            <select value={stone} onChange={(e) => setStone(e.target.value)} className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm">
              <option value="">Piedra</option>
              {uniquePairs(options.stones).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-stone/20 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-light text-matte-black/60">
              {selectedRows.length} seleccionadas · {filtered.length} visibles · {rows.length} total
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={percentInput}
                onChange={(e) => setPercentInput(e.target.value)}
                placeholder="+5% o -5%"
                className="w-28 rounded-lg border border-premium-border px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={pricedSelectedRows.length === 0 || percent === null}
                onClick={() => setConfirmOpen(true)}
                className="rounded-lg bg-matte-black px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white disabled:opacity-40"
              >
                Aplicar cambio masivo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-stone/20 bg-white">
            {loading ? (
              <p className="px-4 py-8 text-sm text-matte-black/50">Cargando variantes…</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-sand/30 text-[10px] uppercase tracking-[0.12em] text-matte-black/50">
                  <tr>
                    <th className="px-3 py-3">
                      <input type="checkbox" checked={filtered.length > 0 && filtered.every((r) => selected.has(r.id || r.variant_key))} onChange={toggleAll} />
                    </th>
                    <th className="px-3 py-3">Producto</th>
                    <th className="px-3 py-3">Colección</th>
                    <th className="px-3 py-3">Medida</th>
                    <th className="px-3 py-3">Estructura</th>
                    <th className="px-3 py-3">Tela</th>
                    <th className="px-3 py-3">Piedra</th>
                    <th className="px-3 py-3">Precio de lista</th>
                    <th className="px-3 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => {
                    const key = row.id || row.variant_key;
                    const drafted = drafts[key] ?? String(row.list_price);
                    return (
                      <tr key={key} className="border-t border-stone/15 align-top">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(key)}
                            onChange={() => {
                              setSelected((prev) => {
                                const next = new Set(prev);
                                if (next.has(key)) next.delete(key);
                                else next.add(key);
                                return next;
                              });
                            }}
                          />
                        </td>
                        <td className="px-3 py-3 font-light">{row.product_name}</td>
                        <td className="px-3 py-3">{row.collection}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{row.size_label}</td>
                        <td className="px-3 py-3">{row.structure_label}</td>
                        <td className="px-3 py-3">
                          {getCommercialFabricLabel(row.fabric_id)}
                        </td>
                        <td className="px-3 py-3">{row.stone_label}</td>
                        <td className="px-3 py-3">
                          {row.price_status === "quote" ? (
                            <span className="text-sm font-light">A cotizar</span>
                          ) : (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const next = Number(drafted);
                                if (!Number.isFinite(next) || next < 0 || !row.id) return;
                                void saveRow(row, { list_price: Math.round(next) });
                              }}
                              className="flex items-center gap-2"
                            >
                              <input
                                value={drafted}
                                onChange={(e) =>
                                  setDrafts((d) => ({ ...d, [key]: e.target.value }))
                                }
                                className="w-28 rounded border border-transparent px-2 py-1 tabular-nums hover:border-stone/30 focus:border-matte-black outline-none"
                              />
                              <button
                                type="submit"
                                disabled={savingId === row.id}
                                className="text-[10px] uppercase tracking-[0.12em] text-matte-black/50 hover:text-matte-black"
                              >
                                Guardar
                              </button>
                            </form>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <select
                            value={row.price_status}
                            onChange={(e) =>
                              void saveRow(row, {
                                price_status: e.target.value as PriceVariantRow["price_status"],
                              })
                            }
                            className="rounded border border-premium-border bg-white px-2 py-1 text-xs"
                          >
                            <option value="priced">Precio normal</option>
                            <option value="quote">A cotizar</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {confirmOpen && percent !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-matte-black/50 px-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6">
            <h2 className="text-xl font-light">Confirmar cambio masivo</h2>
            <p className="mt-3 text-sm font-light text-matte-black/70">
              {pricedSelectedRows.length} variantes con precio · {percent > 0 ? "+" : ""}
              {percent}%
            </p>
            {quoteSelectedRows.length > 0 ? (
              <p className="mt-2 text-sm text-amber-800">
                {quoteSelectedRows.length} variante(s) A cotizar serán omitidas.
              </p>
            ) : null}
            <ul className="mt-4 max-h-64 space-y-2 overflow-auto text-sm">
              {pricedSelectedRows.slice(0, 12).map((row) => (
                <li key={row.variant_key} className="flex justify-between gap-4 border-b border-stone/10 py-2">
                  <span className="font-light">
                    {row.product_name} · {row.structure_label}
                  </span>
                  <span className="tabular-nums">
                    {formatPrice(row.list_price)} → {formatPrice(applyPercent(row.list_price, percent))}
                  </span>
                </li>
              ))}
              {pricedSelectedRows.length > 12 ? (
                <li className="text-matte-black/50">y {pricedSelectedRows.length - 12} más…</li>
              ) : null}
            </ul>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmOpen(false)} className="px-4 py-2 text-xs uppercase tracking-[0.16em]">
                Cancelar
              </button>
              <button type="button" onClick={() => void applyBulk()} className="rounded-lg bg-matte-black px-4 py-2 text-xs uppercase tracking-[0.16em] text-white">
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

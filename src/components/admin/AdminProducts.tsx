"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategoryLabel, slugify } from "@/lib/catalog/href";
import { CORE_CATEGORY_OPTIONS, customProductId, type CatalogStatus } from "@/lib/catalog/types";
import { isSafeHttpsUrl } from "@/lib/admin/safeUrl";
import { FABRIC_TYPE_OPTIONS } from "@/lib/premiumSwatches";
import type { PriceVariantRow } from "@/lib/prices/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const LEGACY_COLOR_FABRIC_IDS = new Set(["negro", "gris", "beige", "blanco"]);
const TELA_ORDER = FABRIC_TYPE_OPTIONS.map((opt) => opt.id);

const STATUS_LABEL: Record<CatalogStatus, string> = {
  active: "Visible",
  sold_out: "Agotado",
  hidden: "Oculto",
};

export function AdminProducts() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<PriceVariantRow[]>([]);
  const [availability, setAvailability] = useState<Record<string, CatalogStatus>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [structure, setStructure] = useState("");
  const [fabric, setFabric] = useState("");
  const [stone, setStone] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    category: "living",
    customCategory: "",
    collection: "",
    name: "",
    description: "",
    imageUrl: "",
    listPrice: "",
  });

  const load = useCallback(async () => {
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const [{ data: variants, error: variantsError }, { data: availabilityRows, error: availabilityError }] =
        await Promise.all([
          supabase
            .from("price_variants")
            .select("*")
            .order("product_name")
            .order("size_label")
            .order("structure_label"),
          supabase.from("variant_availability").select("variant_key, status"),
        ]);
      if (variantsError) throw variantsError;
      if (availabilityError) throw availabilityError;

      setRows(
        ((variants ?? []) as PriceVariantRow[]).filter(
          (row) => !LEGACY_COLOR_FABRIC_IDS.has(row.fabric_id)
        )
      );
      const next: Record<string, CatalogStatus> = {};
      for (const row of availabilityRows ?? []) {
        next[String(row.variant_key)] = row.status as CatalogStatus;
      }
      setAvailability(next);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el catálogo. ¿Corriste el SQL 004 en Supabase?"
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const statusOf = (key: string): CatalogStatus => availability[key] ?? "active";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (category && row.category !== category) return false;
      if (collection && row.collection !== collection) return false;
      if (structure && row.structure_id !== structure) return false;
      if (fabric && row.fabric_id !== fabric) return false;
      if (stone && row.stone_id !== stone) return false;
      if (statusFilter && statusOf(row.variant_key) !== statusFilter) return false;
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
  }, [rows, search, category, collection, structure, fabric, stone, statusFilter, availability]);

  const options = useMemo(() => {
    const uniq = (pick: (row: PriceVariantRow) => string) =>
      [...new Set(rows.map(pick).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    return {
      categories: uniq((r) => r.category),
      collections: uniq((r) => r.collection),
      structures: rows.map((r) => ({ id: r.structure_id, label: r.structure_label })),
      fabrics: rows
        .filter((r) => r.fabric_id)
        .map((r) => ({ id: r.fabric_id, label: r.fabric_label }))
        .sort((a, b) => {
          const ai = TELA_ORDER.indexOf(a.id as (typeof TELA_ORDER)[number]);
          const bi = TELA_ORDER.indexOf(b.id as (typeof TELA_ORDER)[number]);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        }),
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

  const refreshSite = async () => {
    router.refresh();
    await fetch("/api/admin/revalidate", { method: "POST" });
  };

  const setStatuses = async (keys: string[], status: CatalogStatus) => {
    if (keys.length === 0) return;
    const supabase = createSupabaseBrowserClient();
    const payload = keys.map((variant_key) => ({
      variant_key,
      status,
      updated_at: new Date().toISOString(),
    }));
    const { error: upsertError } = await supabase.from("variant_availability").upsert(payload);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSelected(new Set());
    await load();
    await refreshSite();
  };

  const addProduct = async (e: FormEvent) => {
    e.preventDefault();
    const categoryId = form.customCategory.trim()
      ? slugify(form.customCategory)
      : form.category;
    const name = form.name.trim();
    const collectionName = form.collection.trim() || name;
    if (!name || !categoryId) {
      setError("Completá categoría y nombre.");
      return;
    }
    const slug = slugify(name);
    if (!slug) {
      setError("El nombre no se pudo convertir en una URL válida.");
      return;
    }
    const listPrice = form.listPrice.trim()
      ? Number(form.listPrice.replace(/\./g, "").replace(",", "."))
      : null;
    if (form.listPrice.trim() && (!Number.isFinite(listPrice) || (listPrice ?? 0) < 0)) {
      setError("El precio de lista no es válido.");
      return;
    }

    const imageUrl = form.imageUrl.trim();
    if (imageUrl && !isSafeHttpsUrl(imageUrl)) {
      setError("La URL de imagen tiene que empezar con https://");
      return;
    }

    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error: insertError } = await supabase
      .from("catalog_products")
      .insert({
        category: categoryId,
        collection: collectionName,
        name,
        slug,
        description: form.description.trim(),
        image_url: imageUrl,
        list_price: listPrice,
        status: "active",
      })
      .select("id")
      .single();
    if (insertError || !data) {
      setSaving(false);
      setError(insertError?.message || "No se pudo crear el producto.");
      return;
    }

    const productId = customProductId(String(data.id));
    if (listPrice && listPrice > 0) {
      const { error: priceError } = await supabase.from("price_variants").insert({
        variant_key: [productId, "estandar", "estandar", "", ""].join("::"),
        product_id: productId,
        product_name: name,
        collection: collectionName,
        category: categoryId,
        size_id: "estandar",
        size_label: "Estándar",
        structure_id: "estandar",
        structure_label: "Estándar",
        fabric_id: "",
        fabric_label: "—",
        stone_id: "",
        stone_label: "—",
        list_price: Math.round(listPrice),
        price_status: "priced",
      });
      if (priceError) {
        setSaving(false);
        setError(priceError.message);
        return;
      }
    }

    setSaving(false);
    setFormOpen(false);
    setForm({
      category: "living",
      customCategory: "",
      collection: "",
      name: "",
      description: "",
      imageUrl: "",
      listPrice: "",
    });
    await load();
    await refreshSite();
  };

  const toggleAll = () => {
    if (filtered.every((row) => selected.has(row.variant_key))) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(filtered.map((row) => row.variant_key)));
  };

  return (
    <div className="px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-matte-black/40">
            Panel
          </p>
          <h1 className="mt-2 text-3xl font-extralight tracking-tight">Productos</h1>
          <p className="mt-2 max-w-2xl text-sm font-light text-matte-black/55">
            Cada fila es la misma combinación que en Precios. Agotado deja de venderse;
            Oculto desaparece de la web.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="rounded-lg bg-matte-black px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white"
        >
          Agregar producto
        </button>
      </header>

      {error ? (
        <p className="mb-4 border border-red-200 bg-white px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-matte-black/50">Cargando combinaciones…</p>
      ) : (
        <>
          <div className="mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-7">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto…"
              className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm outline-none focus:border-matte-black md:col-span-2"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-premium-border bg-white px-3 py-2.5 text-sm">
              <option value="">Categoría</option>
              {options.categories.map((c) => (
                <option key={c} value={c}>{getCategoryLabel(c)}</option>
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
              <option value="">Tapizado</option>
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
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-light text-matte-black/60">
                {selected.size} seleccionadas · {filtered.length} visibles · {rows.length} total
              </p>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-premium-border px-3 py-2 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="active">Visible</option>
                <option value="sold_out">Agotado</option>
                <option value="hidden">Oculto</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={() => void setStatuses([...selected], "sold_out")}
                className="rounded-lg border border-matte-black/20 px-3 py-2 text-[11px] uppercase tracking-[0.16em] disabled:opacity-40"
              >
                Agotado
              </button>
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={() => void setStatuses([...selected], "hidden")}
                className="rounded-lg border border-matte-black/20 px-3 py-2 text-[11px] uppercase tracking-[0.16em] disabled:opacity-40"
              >
                Ocultar
              </button>
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={() => void setStatuses([...selected], "active")}
                className="rounded-lg bg-matte-black px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white disabled:opacity-40"
              >
                Visible
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-stone/20 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-sand/30 text-[10px] uppercase tracking-[0.12em] text-matte-black/50">
                <tr>
                  <th className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every((r) => selected.has(r.variant_key))}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-3 py-3">Producto</th>
                  <th className="px-3 py-3">Colección</th>
                  <th className="px-3 py-3">Medida</th>
                  <th className="px-3 py-3">Estructura</th>
                  <th className="px-3 py-3">Tapizado</th>
                  <th className="px-3 py-3">Piedra</th>
                  <th className="px-3 py-3">Estado</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const status = statusOf(row.variant_key);
                  return (
                    <tr key={row.variant_key} className="border-t border-stone/15">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(row.variant_key)}
                          onChange={() => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (next.has(row.variant_key)) next.delete(row.variant_key);
                              else next.add(row.variant_key);
                              return next;
                            });
                          }}
                        />
                      </td>
                      <td className="px-3 py-3 font-light">{row.product_name}</td>
                      <td className="px-3 py-3">{row.collection}</td>
                      <td className="px-3 py-3 whitespace-nowrap">{row.size_label}</td>
                      <td className="px-3 py-3">{row.structure_label}</td>
                      <td className="px-3 py-3">{row.fabric_label}</td>
                      <td className="px-3 py-3">{row.stone_label}</td>
                      <td className="px-3 py-3 text-xs uppercase tracking-[0.12em] text-matte-black/50">
                        {STATUS_LABEL[status]}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void setStatuses(
                                [row.variant_key],
                                status === "sold_out" ? "active" : "sold_out"
                              )
                            }
                            className="text-[10px] uppercase tracking-[0.12em] text-matte-black/50 hover:text-matte-black"
                          >
                            {status === "sold_out" ? "Disponible" : "Agotado"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void setStatuses(
                                [row.variant_key],
                                status === "hidden" ? "active" : "hidden"
                              )
                            }
                            className="text-[10px] uppercase tracking-[0.12em] text-matte-black/50 hover:text-matte-black"
                          >
                            {status === "hidden" ? "Mostrar" : "Ocultar"}
                          </button>
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

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-matte-black/50 px-4">
          <form
            onSubmit={(e) => void addProduct(e)}
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6"
          >
            <h2 className="text-xl font-light">Agregar producto</h2>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  Categoría
                </span>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                >
                  {CORE_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  O nueva categoría
                </span>
                <input
                  value={form.customCategory}
                  onChange={(e) => setForm((f) => ({ ...f, customCategory: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  Colección
                </span>
                <input
                  list="admin-collections"
                  value={form.collection}
                  onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                />
                <datalist id="admin-collections">
                  {options.collections.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  Nombre
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  Descripción
                </span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  URL de imagen
                </span>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.16em] text-matte-black/40">
                  Precio de lista (opcional)
                </span>
                <input
                  value={form.listPrice}
                  onChange={(e) => setForm((f) => ({ ...f, listPrice: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-premium-border px-3 py-2.5 text-sm"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 text-xs uppercase tracking-[0.16em]">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-matte-black px-4 py-2 text-xs uppercase tracking-[0.16em] text-white disabled:opacity-40"
              >
                {saving ? "Guardando…" : "Publicar"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

import type { Product } from "@/types";

const CATEGORY_CRUMBS: Record<
  Product["category"],
  { label: string; href: string }
> = {
  reposeras: { label: "Reposeras", href: "/productos/reposeras" },
  living: { label: "Living", href: "/productos/living" },
  mesas: { label: "Living", href: "/productos/living" },
  comedor: { label: "Comedor", href: "/productos/comedor" },
};

export function getCategoryBreadcrumb(product: Product) {
  return (
    CATEGORY_CRUMBS[product.category as keyof typeof CATEGORY_CRUMBS] ?? {
      label: product.category.charAt(0).toUpperCase() + product.category.slice(1),
      href: `/productos/${product.category}`,
    }
  );
}

export function getProductTypeLabel(product: Product): string {
  if (product.category === "reposeras") return "Reposera";
  if (product.category === "mesas") return "Mesa de living";
  if (product.category === "comedor") return "Mesa de comedor";
  if (product.category === "living") return "Sillón";
  if (product.category === "alfombras") return "Alfombra";
  return "Producto";
}

/** Orden visual estructuras: menor a mayor precio de lista */
const STRUCTURE_DISPLAY_ORDER = [
  "negro-pintado",
  "greige-pintado",
  "blanco-pintado",
  "anodizado-natural",
  "anodizado-negro",
  "anodizado-peltre",
  "simil-madera-marron",
  "simil-madera-blanco",
] as const;

const structureOrderIndex = new Map<string, number>(
  STRUCTURE_DISPLAY_ORDER.map((id, index) => [id, index])
);

export function sortStructuresForDisplay<T extends { id: string }>(
  structures: T[]
): T[] {
  return [...structures].sort((a, b) => {
    const orderA = structureOrderIndex.get(a.id) ?? STRUCTURE_DISPLAY_ORDER.length;
    const orderB = structureOrderIndex.get(b.id) ?? STRUCTURE_DISPLAY_ORDER.length;
    return orderA - orderB;
  });
}

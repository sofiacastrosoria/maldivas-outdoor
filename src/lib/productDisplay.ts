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
  return CATEGORY_CRUMBS[product.category];
}

export function getProductTypeLabel(product: Product): string {
  if (product.category === "reposeras") return "Reposera";
  if (product.category === "mesas") return "Mesa de living";
  if (product.category === "comedor") return "Mesa de comedor";
  return "Sillón";
}

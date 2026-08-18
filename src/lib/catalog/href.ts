import type { Product } from "@/types";

export function getProductHref(product: Product): string {
  switch (product.category) {
    case "reposeras":
      return `/productos/reposeras/${product.slug}`;
    case "living":
      return `/productos/living/${product.slug}`;
    case "mesas":
      return `/productos/living/mesas/${product.slug}`;
    case "comedor":
      return `/productos/comedor/${product.slug}`;
    default:
      return `/productos/${product.category}/${product.slug}`;
  }
}

export function getCategoryHref(category: string): string {
  if (category === "mesas" || category === "living") return "/productos/living";
  if (category === "reposeras") return "/productos/reposeras";
  if (category === "comedor") return "/productos/comedor";
  return `/productos/${category}`;
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "reposeras":
      return "Reposeras";
    case "living":
      return "Sillones";
    case "mesas":
      return "Mesas de living";
    case "comedor":
      return "Comedor";
    case "alfombras":
      return "Alfombras";
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

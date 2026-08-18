export type CatalogStatus = "active" | "sold_out" | "hidden";

export interface ProductStatusRow {
  product_id: string;
  status: CatalogStatus;
  updated_at?: string;
}

export interface CatalogProductRow {
  id: string;
  category: string;
  collection: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  list_price: number | null;
  status: CatalogStatus;
  created_at?: string;
  updated_at?: string;
}

export const CORE_CATEGORY_OPTIONS = [
  { id: "reposeras", label: "Reposeras" },
  { id: "living", label: "Sillones" },
  { id: "mesas", label: "Mesas de living" },
  { id: "comedor", label: "Comedor" },
  { id: "alfombras", label: "Alfombras" },
] as const;

export function customProductId(rowId: string): string {
  return `custom:${rowId}`;
}

export function isCustomProductId(productId: string): boolean {
  return productId.startsWith("custom:");
}

export function catalogRowIdFromProductId(productId: string): string | null {
  if (!isCustomProductId(productId)) return null;
  return productId.slice("custom:".length);
}

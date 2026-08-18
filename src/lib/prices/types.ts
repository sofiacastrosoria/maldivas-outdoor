export type PriceStatus = "priced" | "quote";

export interface PriceVariantRow {
  id?: string;
  variant_key: string;
  product_id: string;
  product_name: string;
  collection: string;
  category: string;
  size_id: string;
  size_label: string;
  structure_id: string;
  structure_label: string;
  fabric_id: string;
  fabric_label: string;
  stone_id: string;
  stone_label: string;
  list_price: number;
  price_status: PriceStatus;
  updated_at?: string;
}

export interface PriceChangeLogRow {
  id: string;
  variant_id: string | null;
  variant_key: string;
  product_id: string;
  product_name: string | null;
  old_list_price: number | null;
  new_list_price: number | null;
  old_price_status: string | null;
  new_price_status: string | null;
  percent_applied: number | null;
  changed_by: string | null;
  changed_by_email: string | null;
  created_at: string;
}

export interface VariantLookupInput {
  productId: string;
  sizeId: string;
  structureId: string;
  fabricId?: string;
  stoneId?: string;
}

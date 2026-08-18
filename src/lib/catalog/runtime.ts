import { products as seedProducts } from "@/data/products";
import {
  customProductId,
  type CatalogProductRow,
  type CatalogStatus,
  type ProductStatusRow,
} from "@/lib/catalog/types";
import { isProductFullyHidden, isProductFullySoldOut } from "@/lib/catalog/availability";
import type { Product } from "@/types";

let statusById = new Map<string, CatalogStatus>();
let customRows: CatalogProductRow[] = [];

export function setRuntimeCatalog(
  statuses: ProductStatusRow[] | null,
  customs: CatalogProductRow[] | null
): void {
  const next = new Map<string, CatalogStatus>();
  for (const row of statuses ?? []) {
    next.set(row.product_id, row.status);
  }
  statusById = next;
  customRows = customs ?? [];
}

function toCustomProduct(row: CatalogProductRow): Product {
  const image = row.image_url || "/images/placeholder.png";
  return {
    id: customProductId(row.id),
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    description: row.description,
    image,
    gallery: [image],
    sizes: [{ id: "estandar", label: "Estándar", dimensions: "" }],
    structures: [{ id: "estandar", label: "Estándar" }],
    fabrics: [],
    soldOut: row.status === "sold_out",
    adminManaged: true,
    collection: row.collection,
  };
}

export function getCollectionName(product: Product): string {
  return product.collection || product.name;
}

export function getMergedProducts(options?: { includeHidden?: boolean }): Product[] {
  const includeHidden = options?.includeHidden ?? false;

  const seeded = seedProducts.flatMap((product) => {
    const status = statusById.get(product.id) ?? "active";
    if (!includeHidden && status === "hidden") return [];
    if (!includeHidden && isProductFullyHidden(product.id)) return [];
    return [
      {
        ...product,
        soldOut: status === "sold_out" || isProductFullySoldOut(product.id),
        collection: getCollectionName(product),
      },
    ];
  });

  const custom = customRows.flatMap((row) => {
    if (!includeHidden && row.status === "hidden") return [];
    return [toCustomProduct(row)];
  });

  return [...seeded, ...custom];
}

export function getPublicProducts(): Product[] {
  return getMergedProducts({ includeHidden: false });
}

export function getPublicProductsByCategory(category: string): Product[] {
  return getPublicProducts().filter((product) => product.category === category);
}

export function getPublicProductBySlug(
  category: string,
  slug: string
): Product | undefined {
  return getPublicProducts().find(
    (product) => product.category === category && product.slug === slug
  );
}

export function getExtraPublicCategories(): string[] {
  const core = new Set(["reposeras", "living", "mesas", "comedor"]);
  return [
    ...new Set(
      getPublicProducts()
        .map((product) => product.category)
        .filter((category) => !core.has(category))
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));
}

export function getProductStatus(productId: string): CatalogStatus {
  const custom = customRows.find((row) => customProductId(row.id) === productId);
  if (custom) return custom.status;
  return statusById.get(productId) ?? "active";
}

export function getCustomCatalogRows(): CatalogProductRow[] {
  return customRows;
}

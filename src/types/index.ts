export type FabricColor = "negro" | "gris" | "beige" | "blanco";

export interface ProductOption {
  id: string;
  label: string;
  priceModifier?: number;
  onRequest?: boolean;
}

export interface ProductSize {
  id: string;
  label: string;
  dimensions: string;
  priceModifier?: number;
}

export interface ProductConfig {
  sizeId: string;
  structureId: string;
  fabricId: string;
  customNotes?: string;
  stoneBrand?: string;
  stoneModel?: string;
  customDimensions?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  slug: string;
  image: string;
  config: ProductConfig;
  configSummary: string[];
  unitPrice: number;
  quantity: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "reposeras" | "living" | "mesas" | "comedor";
  subcategory?: string;
  description: string;
  image: string;
  gallery: string[];
  sizes: ProductSize[];
  structures: ProductOption[];
  fabrics: ProductOption[];
  stoneBrands?: ProductOption[];
  customizableSize?: boolean;
  /** Medida fija: muestra dimensiones sin selector de tamaño */
  fixedMeasure?: boolean;
  /** Mapeo estructura → índice de imagen en /images/mesas/{slug}/N.jpg */
  mesaImageByStructure?: Partial<Record<string, 1 | 2 | 3 | 4>>;
}

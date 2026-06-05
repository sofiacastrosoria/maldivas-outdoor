import type { Product, ProductConfig } from "@/types";

const FABRIC_MODIFIERS: Record<string, number> = {
  negro: 0,
  gris: 0,
  beige: 15,
  blanco: 25,
};

const STRUCTURE_MODIFIERS: Record<string, number> = {
  "simil-madera-blanco": 0,
  "simil-madera-marron": 0,
  "anodizado-negro": 80,
  "anodizado-peltre": 80,
  "greige-pintado": 40,
  "negro-pintado": 30,
  "blanco-pintado": 35,
  "anodizado-natural": 50,
};

const SIZE_MODIFIERS: Record<string, number> = {
  small: 0,
  large: 120,
  "1-cuerpo": 0,
  "4-cuerpos": 420,
};

export function calculatePrice(
  product: Product,
  config: ProductConfig
): number {
  let price = product.basePrice;

  const size = product.sizes.find((s) => s.id === config.sizeId);
  if (size?.priceModifier) price += size.priceModifier;
  else if (SIZE_MODIFIERS[config.sizeId]) price += SIZE_MODIFIERS[config.sizeId];

  const structure = product.structures.find((s) => s.id === config.structureId);
  if (structure?.priceModifier) price += structure.priceModifier;
  else if (STRUCTURE_MODIFIERS[config.structureId])
    price += STRUCTURE_MODIFIERS[config.structureId];

  if (config.fabricId && FABRIC_MODIFIERS[config.fabricId] !== undefined) {
    price += FABRIC_MODIFIERS[config.fabricId];
  }

  if (config.stoneBrand === "infinity") price += 200;
  if (config.stoneBrand === "dekton") price += 250;
  if (config.stoneBrand === "pura-prima") price += 180;
  if (config.customDimensions) price += 150;

  return price;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildConfigSummary(
  product: Product,
  config: ProductConfig
): string[] {
  const lines: string[] = [];
  const size = product.sizes.find((s) => s.id === config.sizeId);
  const structure = product.structures.find((s) => s.id === config.structureId);
  const fabric = product.fabrics.find((f) => f.id === config.fabricId);

  if (size) lines.push(`Tamaño: ${size.label} (${size.dimensions})`);
  if (structure) lines.push(`Estructura: ${structure.label}`);
  if (fabric) lines.push(`Tapizado: ${fabric.label}`);
  if (config.customDimensions)
    lines.push(`Medida personalizada: ${config.customDimensions}`);
  if (config.stoneBrand) {
    const brand = product.stoneBrands?.find((b) => b.id === config.stoneBrand);
    if (brand) lines.push(`Piedra: ${brand.label}`);
  }
  if (config.stoneModel) lines.push(`Modelo: ${config.stoneModel}`);
  if (config.customNotes) lines.push(`Notas: ${config.customNotes}`);

  return lines;
}

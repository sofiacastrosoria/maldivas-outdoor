export type StoneBrandId = "infinity" | "dekton";

export interface StoneModelOption {
  id: string;
  brand: StoneBrandId;
  label: string;
}

export const DEKTON_STONE_MODELS: StoneModelOption[] = [
  { id: "dekton-aura", brand: "dekton", label: "Aura" },
  { id: "dekton-opera", brand: "dekton", label: "Opera" },
  { id: "dekton-vera", brand: "dekton", label: "Vera" },
];

export const INFINITY_STONE_MODELS: StoneModelOption[] = [
  { id: "infinity-atlantis-grey", brand: "infinity", label: "Atlantis Grey" },
  { id: "infinity-calacatta-oro", brand: "infinity", label: "Calacatta Oro" },
  { id: "infinity-andromeda", brand: "infinity", label: "Andromeda" },
  { id: "infinity-travertino-chiaro", brand: "infinity", label: "Travertino Chiaro" },
  { id: "infinity-defense", brand: "infinity", label: "Defense" },
  { id: "infinity-pietra-grey", brand: "infinity", label: "Pietra Grey" },
  { id: "infinity-laurent", brand: "infinity", label: "Laurent" },
  { id: "infinity-calacatta-hermitage", brand: "infinity", label: "Calacatta Hermitage" },
  { id: "infinity-chianca-di-ostuni", brand: "infinity", label: "Chianca Di Ostuni" },
  { id: "infinity-royal-peacock", brand: "infinity", label: "Royal Peacock" },
  { id: "infinity-tundra-select", brand: "infinity", label: "Tundra Select" },
  { id: "infinity-sahara-noir", brand: "infinity", label: "Sahara Noir" },
];

export const ALL_STONE_MODELS: StoneModelOption[] = [
  ...DEKTON_STONE_MODELS,
  ...INFINITY_STONE_MODELS,
];

/** Marcas disponibles según medida Marbella */
export const MARBELLA_STONE_BRANDS_BY_SIZE: Record<string, StoneBrandId[]> = {
  "278": ["infinity"],
  "260": ["dekton"],
  "200": ["infinity", "dekton"],
};

export const STONE_BRAND_LABELS: Record<StoneBrandId, string> = {
  infinity: "Infinity",
  dekton: "Dekton",
};

export function getStoneModelById(id: string): StoneModelOption | undefined {
  return ALL_STONE_MODELS.find((m) => m.id === id);
}

export function getAvailableStoneBrands(sizeId: string): StoneBrandId[] {
  return MARBELLA_STONE_BRANDS_BY_SIZE[sizeId] ?? [];
}

export function getAvailableStoneModels(sizeId: string): StoneModelOption[] {
  const brands = new Set(getAvailableStoneBrands(sizeId));
  return ALL_STONE_MODELS.filter((m) => brands.has(m.brand));
}

export function resolveMarbellaStoneBrand(
  sizeId: string,
  stoneBrand?: string
): StoneBrandId | null {
  const available = getAvailableStoneBrands(sizeId);
  if (available.length === 0) return null;
  if (available.length === 1) return available[0];
  if (stoneBrand === "infinity" || stoneBrand === "dekton") {
    return available.includes(stoneBrand) ? stoneBrand : null;
  }
  return null;
}

export function defaultMarbellaStoneModel(sizeId: string): {
  stoneBrand: StoneBrandId;
  stoneModel: string;
} {
  const models = getAvailableStoneModels(sizeId);
  const first = models[0];
  return {
    stoneBrand: first?.brand ?? getAvailableStoneBrands(sizeId)[0] ?? "infinity",
    stoneModel: first?.id ?? "",
  };
}

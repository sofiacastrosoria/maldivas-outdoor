/**
 * Fuente única de verdad para marcas/tipos de tela comercial.
 * Admin, configurador, precios y carrito deben usar estas definiciones.
 */

export const COMMERCIAL_FABRIC_OPTIONS = [
  { id: "bliss", label: "Sunbrella Canvas - Agora - Linetex" },
  { id: "sunbrella", label: "Sunbrella Natte" },
] as const;

export type CommercialFabricId = (typeof COMMERCIAL_FABRIC_OPTIONS)[number]["id"];

/** IDs de tela comercial que ya no deben aparecer como opción independiente. */
export const DEPRECATED_COMMERCIAL_FABRIC_IDS = new Set(["agora"]);

export const COMMERCIAL_FABRIC_ID_SET = new Set<string>(
  COMMERCIAL_FABRIC_OPTIONS.map((opt) => opt.id)
);

export function getCommercialFabricLabel(fabricId: string): string {
  const match = COMMERCIAL_FABRIC_OPTIONS.find((opt) => opt.id === fabricId);
  return match?.label ?? fabricId;
}

export function isCommercialFabricQuote(fabricId: string): boolean {
  return fabricId === "sunbrella";
}

export function isActiveCommercialFabricId(fabricId: string): boolean {
  return COMMERCIAL_FABRIC_ID_SET.has(fabricId);
}

export function commercialFabricPriceStatus(
  fabricId: string
): "priced" | "quote" {
  return isCommercialFabricQuote(fabricId) ? "quote" : "priced";
}

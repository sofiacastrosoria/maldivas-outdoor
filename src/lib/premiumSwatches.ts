/** Visual swatches for premium configurator — UI only, ids unchanged */

export interface SwatchStyle {
  background: string;
  border?: string;
  ring?: string;
}

export const STRUCTURE_SWATCHES: Record<string, SwatchStyle> = {
  "negro-pintado": { background: "#1A1A1A" },
  "blanco-pintado": { background: "#FFFFFF", border: "#D9D4CC" },
  "greige-pintado": { background: "#B8B0A4" },
  "anodizado-natural": {
    background: "linear-gradient(145deg, #E4E0D8 0%, #B0AAA0 100%)",
  },
  "anodizado-negro": {
    background: "linear-gradient(145deg, #4A4A4A 0%, #2A2A2A 100%)",
  },
  "anodizado-peltre": {
    background: "linear-gradient(145deg, #8A8A8A 0%, #5C5C5C 100%)",
  },
  "simil-madera-blanco": { background: "#E8E0D4", border: "#D9D4CC" },
  "simil-madera-marron": { background: "#8B7355" },
  estandar: { background: "#D9D4CC" },
};

export const FABRIC_SWATCHES: Record<string, SwatchStyle> = {
  negro: { background: "#1A1A1A" },
  gris: { background: "#6B6B6B" },
  beige: { background: "#C4B8A8" },
  blanco: { background: "#F5F3EE", border: "#D9D4CC" },
};

/** Premium display labels for fabrics (ids unchanged) */
export const FABRIC_DISPLAY_LABELS: Record<string, string> = {
  negro: "Negro",
  gris: "Grafito",
  beige: "Arena",
  blanco: "Blanco",
};

export const FABRIC_TYPE_OPTIONS = [
  { id: "bliss", label: "Bliss Premium" },
  { id: "sunbrella", label: "Sunbrella Premium" },
  { id: "agora", label: "Ágora Premium" },
] as const;

export type FabricTypeId = (typeof FABRIC_TYPE_OPTIONS)[number]["id"];

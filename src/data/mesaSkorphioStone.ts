import type { StoneBrandId } from "@/data/comedorStone";

/** Opciones de piedra exclusivas de Mesa Skorphio — no listadas en Materiales */
export interface MesaSkorphioStoneOption {
  id: string;
  brand: StoneBrandId;
  label: string;
}

export const MESA_SKORPHIO_STONE_MODELS: MesaSkorphioStoneOption[] = [
  {
    id: "infinity-travertino-chiaro",
    brand: "infinity",
    label: "Travertino Chiaro",
  },
  {
    id: "infinity-laurent",
    brand: "infinity",
    label: "Laurent",
  },
  {
    id: "skorphio-white-macaubas",
    brand: "infinity",
    label: "White Macaubas",
  },
];

export function getMesaSkorphioStoneById(
  id: string
): MesaSkorphioStoneOption | undefined {
  return MESA_SKORPHIO_STONE_MODELS.find((m) => m.id === id);
}

/**
 * ÚNICO archivo editable para precios de lista — Maldivas Outdoor
 *
 * Modificá solo los valores numéricos de lista.
 * Efectivo (×0.70) y transferencia (×0.85) se calculan automáticamente.
 */

export const CASH_MULTIPLIER = 0.7;
export const TRANSFER_MULTIPLIER = 0.85;

export type StructurePriceKey =
  | "similMaderaMarron"
  | "similMaderaBlanco"
  | "anodizadoNegroLijado"
  | "anodizadoPeltreLijado"
  | "anodizadoNatural"
  | "greigePintado"
  | "negroPintado"
  | "blancoPintado";

export type ReposeraSizeKey = "estandar" | "doble";
export type SillonSizeKey = "1cuerpo" | "4cuerpos";

type ReposeraStructurePrices = Partial<
  Record<StructurePriceKey, Partial<Record<ReposeraSizeKey, number>>>
>;

type SillonStructurePrices = Partial<
  Record<StructurePriceKey, Partial<Record<SillonSizeKey, number>>>
>;

type MesaStructurePrices = Partial<Record<StructurePriceKey, number>>;

/** Precios de lista — Reposeras */
export const REPOSERA_LIST_PRICES: Record<string, ReposeraStructurePrices> = {
  fendi: {
    similMaderaMarron: { estandar: 2_344_000, doble: 4_077_000 },
    similMaderaBlanco: { estandar: 2_344_000, doble: 4_077_000 },
    anodizadoNegroLijado: { estandar: 2_193_300, doble: 3_861_000 },
    anodizadoPeltreLijado: { estandar: 2_193_300, doble: 3_861_000 },
    greigePintado: { estandar: 2_102_000, doble: 3_791_000 },
    negroPintado: { estandar: 2_102_000, doble: 3_791_000 },
  },
  skorphio: {
    similMaderaMarron: { estandar: 2_218_000, doble: 3_919_000 },
    similMaderaBlanco: { estandar: 2_218_000, doble: 3_919_000 },
    anodizadoNegroLijado: { estandar: 2_158_000, doble: 3_870_000 },
    anodizadoPeltreLijado: { estandar: 2_158_000, doble: 3_870_000 },
    greigePintado: { estandar: 2_072_500, doble: 3_455_000 },
    negroPintado: { estandar: 2_072_500, doble: 3_455_000 },
  },
  malaga: {
    anodizadoNegroLijado: { estandar: 2_093_000, doble: 3_657_000 },
    anodizadoPeltreLijado: { estandar: 2_093_000, doble: 3_657_000 },
    negroPintado: { estandar: 1_955_200, doble: 3_414_100 },
  },
  mdq: {
    negroPintado: { estandar: 1_887_000, doble: 3_281_000 },
    anodizadoNatural: { estandar: 1_887_000, doble: 3_281_000 },
  },
  baros: {
    anodizadoNatural: { estandar: 1_898_300 },
  },
};

/** Precios de lista — Mesas de Living (medida fija por modelo) */
export const MESA_LIST_PRICES: Record<string, MesaStructurePrices> = {
  fendi: {
    similMaderaMarron: 2_990_200,
    similMaderaBlanco: 2_990_200,
    anodizadoNegroLijado: 2_703_900,
    negroPintado: 2_546_000,
  },
};

/** Precios de lista — Sillones (Juegos de Living) */
export const SILLON_LIST_PRICES: Record<string, SillonStructurePrices> = {
  fendi: {
    similMaderaMarron: { "1cuerpo": 2_218_100, "4cuerpos": 4_291_000 },
    similMaderaBlanco: { "1cuerpo": 2_218_100, "4cuerpos": 4_291_000 },
    anodizadoNegroLijado: { "1cuerpo": 2_151_400, "4cuerpos": 4_143_300 },
    anodizadoPeltreLijado: { "1cuerpo": 2_151_400, "4cuerpos": 4_143_300 },
    greigePintado: { "1cuerpo": 1_981_700, "4cuerpos": 3_860_000 },
    negroPintado: { "1cuerpo": 1_981_700, "4cuerpos": 3_860_000 },
  },
  skorphio: {
    negroPintado: { "1cuerpo": 2_054_000, "4cuerpos": 4_008_400 },
    blancoPintado: { "1cuerpo": 2_054_000, "4cuerpos": 4_008_400 },
    similMaderaMarron: { "1cuerpo": 2_363_500, "4cuerpos": 4_395_600 },
    similMaderaBlanco: { "1cuerpo": 2_363_500, "4cuerpos": 4_395_600 },
  },
  malaga: {
    negroPintado: { "1cuerpo": 1_942_000, "4cuerpos": 3_677_000 },
    anodizadoNegroLijado: { "1cuerpo": 2_135_000, "4cuerpos": 3_955_500 },
    anodizadoPeltreLijado: { "1cuerpo": 2_135_000, "4cuerpos": 3_955_500 },
  },
  maldivas: {
    negroPintado: { "1cuerpo": 1_942_000, "4cuerpos": 3_677_000 },
    anodizadoNegroLijado: { "1cuerpo": 2_135_000, "4cuerpos": 3_955_500 },
    anodizadoPeltreLijado: { "1cuerpo": 2_135_000, "4cuerpos": 3_955_500 },
  },
  milos: {
    negroPintado: { "1cuerpo": 1_516_500, "4cuerpos": 2_992_000 },
    greigePintado: { "1cuerpo": 1_516_500, "4cuerpos": 2_992_000 },
    blancoPintado: { "1cuerpo": 1_516_500, "4cuerpos": 2_992_000 },
    anodizadoNegroLijado: { "1cuerpo": 1_638_500, "4cuerpos": 3_173_800 },
    anodizadoPeltreLijado: { "1cuerpo": 1_638_500, "4cuerpos": 3_173_800 },
  },
};

export type ComedorStoneBrandKey = "infinity" | "dekton";

type ComedorMeasurePrice =
  | number
  | Partial<Record<ComedorStoneBrandKey, number>>;

type ComedorStructurePrices = Partial<
  Record<StructurePriceKey, Partial<Record<string, ComedorMeasurePrice>>>
>;

/** Precios de lista — Comedor (medida + estructura; Marbella 200×100 también por marca) */
export const COMEDOR_LIST_PRICES: Record<string, ComedorStructurePrices> = {
  skorphio: {
    negroPintado: {
      "300": 3_175_000,
      "270": 2_952_400,
      "200": 2_157_500,
    },
    greigePintado: {
      "300": 3_175_000,
      "270": 2_952_400,
      "200": 2_157_500,
    },
    anodizadoNegroLijado: {
      "300": 3_929_000,
      "270": 3_648_200,
      "200": 2_642_500,
    },
    anodizadoPeltreLijado: {
      "300": 3_929_000,
      "270": 3_648_200,
      "200": 2_642_500,
    },
    similMaderaMarron: {
      "300": 4_652_000,
      "270": 4_221_000,
      "200": 2_995_000,
    },
    similMaderaBlanco: {
      "300": 4_652_000,
      "270": 4_221_000,
      "200": 2_995_000,
    },
  },
  marbella: {
    negroPintado: {
      "278": 3_847_900,
      "260": 4_030_600,
      "200": { infinity: 3_199_600, dekton: 3_497_400 },
    },
    greigePintado: {
      "278": 3_847_900,
      "260": 4_030_600,
      "200": { infinity: 3_199_600, dekton: 3_497_400 },
    },
    anodizadoNegroLijado: {
      "278": 4_257_000,
      "260": 4_418_400,
      "200": { infinity: 3_522_500, dekton: 3_820_200 },
    },
    anodizadoPeltreLijado: {
      "278": 4_257_000,
      "260": 4_418_400,
      "200": { infinity: 3_522_500, dekton: 3_820_200 },
    },
    similMaderaMarron: {
      "278": 4_325_000,
      "260": 4_482_051,
      "200": { infinity: 3_592_000, dekton: 3_824_000 },
    },
    similMaderaBlanco: {
      "278": 4_325_000,
      "260": 4_482_051,
      "200": { infinity: 3_592_000, dekton: 3_824_000 },
    },
  },
};

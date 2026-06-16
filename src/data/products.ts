import type { Product, ProductOption, ProductSize } from "@/types";

const FABRICS: ProductOption[] = [
  { id: "negro", label: "Negro" },
  { id: "gris", label: "Gris" },
  { id: "beige", label: "Beige" },
  { id: "blanco", label: "Blanco" },
];

const STRUCTURE_FENDI: ProductOption[] = [
  { id: "simil-madera-blanco", label: "Símil madera blanco" },
  { id: "simil-madera-marron", label: "Símil madera marrón" },
  { id: "anodizado-negro", label: "Anodizado negro lijado", onRequest: true },
  { id: "anodizado-peltre", label: "Anodizado peltre lijado", onRequest: true },
  { id: "greige-pintado", label: "Greige pintado" },
  { id: "negro-pintado", label: "Negro pintado" },
];

const STRUCTURE_SKORPHIO: ProductOption[] = [
  { id: "simil-madera-blanco", label: "Símil madera blanco" },
  { id: "simil-madera-marron", label: "Símil madera marrón" },
  { id: "negro-pintado", label: "Negro pintado" },
  { id: "blanco-pintado", label: "Blanco pintado" },
];

const STRUCTURE_MALDIVAS: ProductOption[] = [
  { id: "negro-pintado", label: "Negro pintado" },
  { id: "anodizado-peltre", label: "Anodizado peltre lijado", onRequest: true },
  { id: "anodizado-negro", label: "Anodizado negro lijado", onRequest: true },
];

const STRUCTURE_MILOS: ProductOption[] = [
  { id: "negro-pintado", label: "Negro pintado" },
  { id: "greige-pintado", label: "Greige pintado" },
  { id: "blanco-pintado", label: "Blanco pintado" },
  { id: "anodizado-peltre", label: "Anodizado peltre lijado", onRequest: true },
  { id: "anodizado-negro", label: "Anodizado negro lijado", onRequest: true },
];

const STRUCTURE_MALAGA: ProductOption[] = [
  { id: "negro-pintado", label: "Negro pintado" },
  { id: "anodizado-peltre", label: "Anodizado peltre lijado", onRequest: true },
  { id: "anodizado-negro", label: "Anodizado negro lijado", onRequest: true },
];

const STRUCTURE_MDQ: ProductOption[] = [
  { id: "negro-pintado", label: "Negro pintado" },
  { id: "anodizado-natural", label: "Anodizado natural" },
];

const STRUCTURE_BAROS: ProductOption[] = [
  { id: "anodizado-natural", label: "Anodizado natural" },
];

const STRUCTURE_MESA_FENDI: ProductOption[] = [
  { id: "simil-madera-marron", label: "Símil Madera Marrón" },
  { id: "simil-madera-blanco", label: "Símil Madera Blanco" },
  { id: "anodizado-negro", label: "Anodizado Negro Lijado", onRequest: true },
  { id: "negro-pintado", label: "Negro Pintado" },
];

const MESA_FENDI_MEASURE: ProductSize[] = [
  { id: "fixed", label: "Medida", dimensions: "160 × 80 × 38 cm" },
];

const REPOSERA_SIZES: ProductSize[] = [
  { id: "small", label: "Estándar", dimensions: "200 × 75 × 37 cm" },
  { id: "large", label: "Doble", dimensions: "200 × 140 × 37 cm" },
];

const REPOSERA_SIZES_SKORPHIO: ProductSize[] = [
  { id: "small", label: "Estándar", dimensions: "200 × 75 × 27 cm" },
  { id: "large", label: "Doble", dimensions: "200 × 140 × 27 cm" },
];

const REPOSERA_SIZES_MDQ: ProductSize[] = [
  { id: "small", label: "Estándar", dimensions: "195 × 75 × 35 cm" },
  { id: "large", label: "Doble", dimensions: "195 × 140 × 35 cm" },
];

const REPOSERA_SIZES_BAROS: ProductSize[] = [
  { id: "small", label: "Estándar", dimensions: "200 × 75 × 37 cm" },
];

const SOFA_SIZES_FENDI: ProductSize[] = [
  { id: "1-cuerpo", label: "1 cuerpo", dimensions: "92 × 85 × 72 cm" },
  { id: "4-cuerpos", label: "4 cuerpos", dimensions: "221 × 85 × 72 cm" },
];

const SOFA_SIZES_SKORPHIO: ProductSize[] = [
  { id: "1-cuerpo", label: "1 cuerpo", dimensions: "100 × 85 × 72 cm" },
  { id: "4-cuerpos", label: "4 cuerpos", dimensions: "228 × 85 × 72 cm" },
];

const SOFA_SIZES_MALAGA: ProductSize[] = [
  { id: "1-cuerpo", label: "1 cuerpo", dimensions: "90 × 90 × 72 cm" },
  { id: "4-cuerpos", label: "4 cuerpos", dimensions: "218 × 90 × 72 cm" },
];

const SOFA_SIZES_MILOS: ProductSize[] = [
  { id: "1-cuerpo", label: "1 cuerpo", dimensions: "85 × 85 × 72 cm" },
  { id: "4-cuerpos", label: "4 cuerpos", dimensions: "213 × 85 × 72 cm" },
];

const STONE_BRANDS: ProductOption[] = [
  { id: "infinity", label: "Infinity" },
  { id: "dekton", label: "Dekton" },
  { id: "pura-prima", label: "Pura Prima" },
];

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1920&q=85&auto=format&fit=crop`;

export const products: Product[] = [
  // REPOSERAS
  {
    id: "reposera-fendi",
    slug: "fendi",
    name: "Fendi",
    category: "reposeras",
    description:
      "Reposera de líneas puras y presencia escultórica. Aluminio de alta tecnología con terminaciones premium y tapizado europeo.",
    image: IMG("1586023491125-6d1c25decf40"),
    gallery: [IMG("1586023491125-6d1c25decf40"), IMG("1600210492493-0946911123ea")],
    sizes: REPOSERA_SIZES,
    structures: STRUCTURE_FENDI,
    fabrics: FABRICS,
  },
  {
    id: "reposera-skorphio",
    slug: "skorphio",
    name: "Skorphio",
    category: "reposeras",
    description:
      "Perfil bajo y silueta aerodinámica. Diseño contemporáneo para espacios que exigen elegancia sin compromiso.",
    image: IMG("1600585154340-be6161a56a0c"),
    gallery: [IMG("1600585154340-be6161a56a0c"), IMG("1600607687939-7d7cf2f06603")],
    sizes: REPOSERA_SIZES_SKORPHIO,
    structures: STRUCTURE_FENDI,
    fabrics: FABRICS,
  },
  {
    id: "reposera-malaga",
    slug: "malaga",
    name: "Málaga",
    category: "reposeras",
    description:
      "Geometría precisa y acabados en negro mate. La reposera que define el carácter de cualquier terraza boutique.",
    image: IMG("1600607687644-c7171b424245"),
    gallery: [IMG("1600607687644-c7171b424245"), IMG("1600566752355-4b89be3f8397")],
    sizes: REPOSERA_SIZES,
    structures: STRUCTURE_MALAGA,
    fabrics: FABRICS,
  },
  {
    id: "reposera-mdq",
    slug: "mdq",
    name: "MDQ",
    category: "reposeras",
    description:
      "Inspirada en la costa atlántica. Proporciones refinadas y paleta neutra para ambientes de arquitectura contemporánea.",
    image: IMG("1600566753086-00f18fb6b3ea"),
    gallery: [IMG("1600566753086-00f18fb6b3ea"), IMG("1600210492486-0946911123ea")],
    sizes: REPOSERA_SIZES_MDQ,
    structures: STRUCTURE_MDQ,
    fabrics: FABRICS,
  },
  {
    id: "reposera-baros",
    slug: "baros",
    name: "Baros",
    category: "reposeras",
    description:
      "Anodizado natural y líneas orgánicas. La pieza que conecta el interior con el paisaje exterior.",
    image: IMG("1600047509807-ba8f99d2fe7f"),
    gallery: [IMG("1600047509807-ba8f99d2fe7f"), IMG("1600585154526-990dced4db0d")],
    sizes: REPOSERA_SIZES_BAROS,
    structures: STRUCTURE_BAROS,
    fabrics: FABRICS,
  },
  // SILLONES LIVING
  {
    id: "sillon-fendi",
    slug: "fendi",
    name: "Fendi",
    category: "living",
    subcategory: "sillones",
    description:
      "Sillón modular de presencia arquitectónica. Confort boutique con estructura en aluminio y tapizado premium.",
    image: IMG("1555041469-a586c81e7bc9"),
    gallery: [IMG("1555041469-a586c81e7bc9"), IMG("1616486338812-3dadae4b4f40")],
    sizes: SOFA_SIZES_FENDI,
    structures: STRUCTURE_FENDI,
    fabrics: FABRICS,
  },
  {
    id: "sillon-skorphio",
    slug: "skorphio",
    name: "Skorphio",
    category: "living",
    subcategory: "sillones",
    description:
      "Volúmenes generosos y respaldo envolvente. El centro gravitacional de su living exterior.",
    image: IMG("1616486338812-3dadae4b4f40"),
    gallery: [IMG("1616486338812-3dadae4b4f40"), IMG("1586023491125-6d1c25decf40")],
    sizes: SOFA_SIZES_SKORPHIO,
    structures: STRUCTURE_SKORPHIO,
    fabrics: FABRICS,
  },
  {
    id: "sillon-malaga",
    slug: "malaga",
    name: "Málaga",
    category: "living",
    subcategory: "sillones",
    description:
      "Forma cuadrada y presencia sólida. Diseño atemporal para espacios de alto diseño.",
    image: IMG("1600210492486-0946911123ea"),
    gallery: [IMG("1600210492486-0946911123ea"), IMG("1600566752355-4b89be3f8397")],
    sizes: SOFA_SIZES_MALAGA,
    structures: STRUCTURE_MALAGA,
    fabrics: FABRICS,
  },
  {
    id: "sillon-maldivas",
    slug: "maldivas",
    name: "Maldivas",
    category: "living",
    subcategory: "sillones",
    description:
      "La esencia de la marca en un sillón. Paleta neutra y proporciones que invitan a permanecer.",
    image: IMG("1600607687939-7d7cf2f06603"),
    gallery: [IMG("1600607687939-7d7cf2f06603"), IMG("1600047509807-ba8f99d2fe7f")],
    sizes: SOFA_SIZES_MALAGA,
    structures: STRUCTURE_MALDIVAS,
    fabrics: FABRICS,
  },
  {
    id: "sillon-milos",
    slug: "milos",
    name: "Milos",
    category: "living",
    subcategory: "sillones",
    description:
      "Compacto y refinado. Ideal para terrazas íntimas donde cada centímetro cuenta.",
    image: IMG("1600585154526-990dced4db0d"),
    gallery: [IMG("1600585154526-990dced4db0d"), IMG("1600566753086-00f18fb6b3ea")],
    sizes: SOFA_SIZES_MILOS,
    structures: STRUCTURE_MILOS,
    fabrics: FABRICS,
  },
  // MESAS LIVING
  {
    id: "mesa-fendi",
    slug: "fendi",
    name: "Mesa Fendi",
    category: "mesas",
    subcategory: "mesas",
    description:
      "Mesa de living con top en piedra sinterizada. Base en aluminio con terminación premium.",
    image: IMG("1615874958453-9e7f6e9bb168"),
    gallery: [IMG("1615874958453-9e7f6e9bb168")],
    sizes: MESA_FENDI_MEASURE,
    structures: STRUCTURE_MESA_FENDI,
    fabrics: [],
    fixedMeasure: true,
    mesaImageByStructure: {
      "simil-madera-marron": 1,
      "anodizado-negro": 2,
      "simil-madera-blanco": 3,
      "negro-pintado": 4,
    },
  },
  {
    id: "mesa-skorphio",
    slug: "skorphio",
    name: "Mesa Skorphio",
    category: "mesas",
    subcategory: "mesas",
    description: "Superficie en piedra sinterizada de alta resistencia. Diseño minimalista.",
    image: IMG("1600585154340-be6161a56a0c"),
    gallery: [IMG("1600585154340-be6161a56a0c")],
    sizes: [{ id: "custom", label: "Personalizable", dimensions: "A medida" }],
    structures: [{ id: "estandar", label: "Estructura estándar" }],
    fabrics: [],
    stoneBrands: STONE_BRANDS,
    customizableSize: true,
  },
  {
    id: "mesa-malaga",
    slug: "malaga",
    name: "Mesa Málaga",
    category: "mesas",
    subcategory: "mesas",
    description: "Mesa de centro con presencia escultórica y top en piedra premium.",
    image: IMG("1600566752355-4b89be3f8397"),
    gallery: [IMG("1600566752355-4b89be3f8397")],
    sizes: [{ id: "custom", label: "Personalizable", dimensions: "A medida" }],
    structures: [{ id: "estandar", label: "Estructura estándar" }],
    fabrics: [],
    stoneBrands: STONE_BRANDS,
    customizableSize: true,
  },
  {
    id: "mesa-milos",
    slug: "milos",
    name: "Mesa Milos",
    category: "mesas",
    subcategory: "mesas",
    description: "Formato compacto con acabados de lujo silencioso.",
    image: IMG("1600047509807-ba8f99d2fe7f"),
    gallery: [IMG("1600047509807-ba8f99d2fe7f")],
    sizes: [{ id: "custom", label: "Personalizable", dimensions: "A medida" }],
    structures: [{ id: "estandar", label: "Estructura estándar" }],
    fabrics: [],
    stoneBrands: STONE_BRANDS,
    customizableSize: true,
  },
  // COMEDOR
  {
    id: "comedor-marbella",
    slug: "marbella",
    name: "Marbella",
    category: "comedor",
    description:
      "Mesa de comedor exterior con top en piedra sinterizada. Medida personalizable y marcas premium.",
    image: IMG("1615874958453-9e7f6e9bb168"),
    gallery: [IMG("1615874958453-9e7f6e9bb168"), IMG("1600566752355-4b89be3f8397")],
    sizes: [{ id: "custom", label: "Personalizable", dimensions: "A medida" }],
    structures: [{ id: "estandar", label: "Estructura estándar" }],
    fabrics: [],
    stoneBrands: STONE_BRANDS,
    customizableSize: true,
  },
];

export function getProductBySlug(
  category: string,
  slug: string
): Product | undefined {
  return products.find((p) => p.category === category && p.slug === slug);
}

export function getProductsByCategory(category: Product["category"]): Product[] {
  return products.filter((p) => p.category === category);
}

export const categoryCards = [
  {
    slug: "reposeras",
    title: "Reposeras",
    subtitle: "Descanso escultórico",
    image: IMG("1586023491125-6d1c25decf40"),
    href: "/productos/reposeras",
  },
  {
    slug: "living",
    title: "Juegos de Living",
    subtitle: "Arquitectura para convivir",
    image: IMG("1555041469-a586c81e7bc9"),
    href: "/productos/living",
  },
  {
    slug: "comedor",
    title: "Comedor",
    subtitle: "Mesa como protagonista",
    image: IMG("1615874958453-9e7f6e9bb168"),
    href: "/productos/comedor",
  },
];

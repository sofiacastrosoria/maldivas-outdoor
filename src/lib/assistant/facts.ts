import { products } from "@/data/products";
import type { Product } from "@/types";

export const SHOWROOM = {
  street: "Luis Jose de Tejeda 4286",
  neighborhood: "Cerro de las Rosas",
  city: "Córdoba Capital",
  full: "Luis Jose de Tejeda 4286, Cerro de las Rosas, Córdoba Capital",
} as const;

/** Misma URL que Contacto y footer */
export const SHOWROOM_MAP_URL =
  "https://maps.app.goo.gl/RiJrTenL5BaVdtEE7?g_st=ic";

export const COMPANY = {
  name: "Maldivas Outdoor",
  location: "Córdoba, Argentina",
  philosophy: "lujo silencioso y diseño atemporal",
  tagline: "Lujo silencioso. Diseño atemporal.",
  manufacturing:
    "somos fabricantes: diseñamos y producimos cada pieza con aluminio Aluar, telas outdoor premium y terminaciones de alto nivel",
  approach:
    "cada proyecto se aborda con asesoramiento personalizado para galerías, terrazas, quinchos y espacios exteriores exigentes",
  inspiration:
    "una estética inspirada en hoteles boutique y arquitectura contemporánea, con piezas pensadas para permanecer en el tiempo",
} as const;

export const FABRIC_SLUGS = ["sunbrella", "agora", "bliss"] as const;
export type FabricSlug = (typeof FABRIC_SLUGS)[number];

export const COLLECTION_SLUGS = [
  "fendi",
  "skorphio",
  "malaga",
  "maldivas",
  "milos",
  "mdq",
  "baros",
  "marbella",
] as const;

export type CollectionSlug = (typeof COLLECTION_SLUGS)[number];

/** Rasgos distintivos por colección — para comparaciones y recomendaciones */
export const COLLECTION_TRAITS: Record<CollectionSlug, string> = {
  fendi: "líneas puras, presencia escultórica y terminaciones premium",
  skorphio: "perfil contemporáneo, silueta aerodinámica y diseño minimalista",
  malaga: "geometría precisa, acabados en negro mate y carácter boutique",
  maldivas: "la esencia de la marca, paleta neutra y proporciones acogedoras",
  milos: "formato compacto, refinamiento silencioso y escala íntima",
  mdq: "proporciones atlánticas, paleta neutra y estética contemporánea",
  baros: "anodizado natural, líneas orgánicas y conexión con el paisaje",
  marbella: "presencia arquitectónica, piedra sinterizada y comedor exterior",
};

export const FABRIC_BRANDS = {
  sunbrella: {
    name: "Sunbrella",
    traits: "referencia mundial en telas acrílicas outdoor, alta resistencia UV y excelente estabilidad de color",
  },
  agora: {
    name: "Agora",
    traits: "alta performance para uso intensivo, gran resistencia al sol y fácil mantenimiento",
  },
  bliss: {
    name: "Bliss",
    traits: "confort, resistencia y estética refinada para proyectos exigentes",
  },
} as const;

export const STRUCTURE_FACTS = {
  anodizado: {
    label: "Aluminio anodizado",
    traits: "tratamiento superficial que aumenta resistencia y aporta una estética sofisticada",
    variants: ["anodizado negro lijado", "anodizado peltre lijado", "anodizado natural"],
  },
  pintado: {
    label: "Aluminio pintado",
    traits: "terminación uniforme y contemporánea, ideal para proyectos actuales",
    variants: ["negro pintado", "greige pintado", "blanco pintado"],
  },
  "simil-madera": {
    label: "Símil madera",
    traits: "calidez visual con la durabilidad del aluminio",
    variants: ["símil madera blanco", "símil madera marrón"],
  },
} as const;

export const LOGISTICS = {
  shipping:
    "realizamos envíos a distintas ciudades de Argentina mediante transportes especializados, con embalaje protector",
  timeline:
    "el plazo de fabricación depende del modelo, la configuración y la época del año; se confirma al momento del pedido",
  warranty:
    "todos los productos cuentan con garantía contra defectos de fabricación",
  payment:
    "aceptamos distintos medios de pago; las promociones vigentes se consultan al confirmar la compra",
  cashDiscount:
    "en la web figura 30% OFF por pago contado en efectivo sobre el precio estimativo publicado",
  priceDisclaimer:
    "los precios son estimativos y pueden variar según configuración, terminaciones y actualizaciones de costos",
} as const;

export const CATEGORY_OVERVIEW: Record<
  "reposeras" | "living" | "mesas" | "comedor",
  { label: string; collections: string; summary: string }
> = {
  reposeras: {
    label: "Reposeras",
    collections: "Fendi, Skorphio, Málaga, MDQ y Baros",
    summary:
      "descanso escultórico con personalización de tamaño, estructura y tapizado",
  },
  living: {
    label: "Juegos de Living",
    collections: "Fendi, Skorphio, Málaga, Maldivas y Milos",
    summary:
      "sillones modulares en 1 o 4 cuerpos, con estructura y tapizado a elección",
  },
  mesas: {
    label: "Mesas de Living",
    collections: "Fendi, Skorphio, Málaga y Milos",
    summary:
      "tops en piedra sinterizada con medida y marca de piedra personalizables",
  },
  comedor: {
    label: "Comedor",
    collections: "Skorphio y Marbella",
    summary:
      "mesas de comedor exterior con piedra sinterizada, medidas curadas y terminaciones premium",
  },
};

export function getProductCatalog(): Product[] {
  return products;
}

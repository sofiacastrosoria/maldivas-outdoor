/** Contenido editable — páginas Conocer Materiales */

export interface MaterialItem {
  id: string;
  title: string;
  description: string;
  /** Ruta bajo /public — asignar ruta real cuando exista la imagen definitiva */
  image?: string;
}

export interface MaterialFabricItem extends MaterialItem {
  hasColorPalette?: boolean;
}

// ─── Aluminio ────────────────────────────────────────────────────────────────

export const aluminioCategories: MaterialItem[] = [
  {
    id: "simil-madera",
    title: "Aluminio Símil Madera",
    description:
      "Terminación que evoca la calidez de la madera con la resistencia del aluminio. Ideal para proyectos que buscan textura natural sin comprometer durabilidad.",
    image: "/images/materiales/aluminio/aluminio-simil-madera.jpg",
  },
  {
    id: "pintado",
    title: "Aluminio Pintado",
    description:
      "Acabados termolacados en paleta curada para exteriores. Superficie uniforme, estable al sol y de mantenimiento sencillo.",
    image: "/images/materiales/aluminio/aluminio-pintado.jpg",
  },
  {
    id: "anodizado",
    title: "Aluminio Anodizado",
    description:
      "Tratamiento anodizado de alta tecnología que realza la textura del metal y garantiza resistencia superior a la intemperie.",
    image: "/images/materiales/aluminio/aluminio-anodizado.jpg",
  },
];

// ─── Telas ───────────────────────────────────────────────────────────────────

export const telasBrands: MaterialFabricItem[] = [
  {
    id: "sunbrella",
    title: "Sunbrella",
    description:
      "Textil acrílico premium de origen europeo. Referencia en solidez de color y desempeño outdoor.",
    image: "/images/materiales/telas/sunbrella.jpg",
    hasColorPalette: true,
  },
  {
    id: "agora",
    title: "Ágora",
    description:
      "Tejidos técnicos con estética contemporánea y excelente comportamiento frente a la exposición solar.",
    image: "/images/materiales/telas/agora.jpg",
    hasColorPalette: true,
  },
  {
    id: "bliss",
    title: "Bliss",
    description:
      "Propuesta textil de alta gama para ambientaciones exteriores con tacto refinado y gran estabilidad cromática.",
    image: "/images/materiales/telas/bliss.jpg",
    hasColorPalette: true,
  },
];

// ─── Goma Espuma ─────────────────────────────────────────────────────────────

export const gomaEspumaBrand = "PIERO";

export const gomaEspumaOptions: MaterialItem[] = [
  {
    id: "26k",
    title: "26K",
    description:
      "Densidad equilibrada para asientos de uso frecuente. Confort estable y recuperación progresiva.",
    image: "/images/materiales/goma-espuma/piero-26k.jpg",
  },
  {
    id: "27k",
    title: "27K",
    description:
      "Mayor soporte estructural con sensación de confort premium. Recomendada para piezas de descanso prolongado.",
    image: "/images/materiales/goma-espuma/piero-27k.jpg",
  },
  {
    id: "29k",
    title: "29K",
    description:
      "Máxima firmeza y respuesta en asientos de alta exigencia. Ideal para configuraciones de uso intensivo.",
    image: "/images/materiales/goma-espuma/piero-29k.jpg",
  },
];

// ─── Piedras — Dekton ────────────────────────────────────────────────────────

export const piedrasDekton: MaterialItem[] = [
  {
    id: "aura",
    title: "Aura",
    description: "Superficie Dekton de carácter mineral y presencia sobria.",
    image: "/images/materiales/piedras/dekton/dekton-aura.jpg",
  },
  {
    id: "opera",
    title: "Ópera",
    description: "Acabado Dekton con profundidad cromática y elegancia atemporal.",
    image: "/images/materiales/piedras/dekton/dekton-opera.jpg",
  },
  {
    id: "vera",
    title: "Vera",
    description: "Tono Dekton versátil para mesas de comedor y living exterior.",
    image: "/images/materiales/piedras/dekton/dekton-vera.jpg",
  },
];

// ─── Piedras — Infinity ──────────────────────────────────────────────────────

export const piedrasInfinity: MaterialItem[] = [
  {
    id: "atlantis-grey",
    title: "Atlantis Grey",
    description: "Gris mineral con textura equilibrada.",
    image: "/images/materiales/piedras/infinity/infinity-atlantis-grey.jpg",
  },
  {
    id: "calacatta-oro",
    title: "Calacatta Oro",
    description: "Veta clásica con calidez dorada sutil.",
    image: "/images/materiales/piedras/infinity/infinity-calacatta-oro.jpg",
  },
  {
    id: "andromeda",
    title: "Andromeda",
    description: "Contraste dramático de alto impacto visual.",
    image: "/images/materiales/piedras/infinity/infinity-andromeda.jpg",
  },
  {
    id: "travertino-chiaro",
    title: "Travertino Chiaro",
    description: "Inspiración pétrea en tonos claros.",
    image: "/images/materiales/piedras/infinity/infinity-travertino-chiaro.jpg",
  },
  {
    id: "defense",
    title: "Defense",
    description: "Superficie técnica de carácter urbano.",
    image: "/images/materiales/piedras/infinity/infinity-defense.jpg",
  },
  {
    id: "pietra-grey",
    title: "Pietra Grey",
    description: "Gris profundo con lectura arquitectónica.",
    image: "/images/materiales/piedras/infinity/infinity-pietra-grey.jpg",
  },
  {
    id: "laurent",
    title: "Laurent",
    description: "Negro veteado de presencia escultórica.",
    image: "/images/materiales/piedras/infinity/infinity-laurent.jpg",
  },
  {
    id: "calacatta-hermitage",
    title: "Calacatta Hermitage",
    description: "Mármol reinterpretado en piedra sinterizada.",
    image: "/images/materiales/piedras/infinity/infinity-calacatta-hermitage.jpg",
  },
  {
    id: "chianca-di-ostuni",
    title: "Chianca di Ostuni",
    description: "Calidez mediterránea en superficie clara.",
    image: "/images/materiales/piedras/infinity/infinity-chianca-di-ostuni.jpg",
  },
  {
    id: "royal-peacock",
    title: "Royal Peacock",
    description: "Profundidad cromática con carácter distintivo.",
    image: "/images/materiales/piedras/infinity/infinity-royal-peacock.jpg",
  },
  {
    id: "tundra-select",
    title: "Tundra Select",
    description: "Neutro sofisticado para composiciones amplias.",
    image: "/images/materiales/piedras/infinity/infinity-tundra-select.jpg",
  },
  {
    id: "sahara-noir",
    title: "Sahara Noir",
    description: "Negro intenso con veta dorada mineral.",
    image: "/images/materiales/piedras/infinity/infinity-sahara-noir.jpg",
  },
];

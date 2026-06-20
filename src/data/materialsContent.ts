/** Contenido editable — páginas Conocer Materiales */

export interface MaterialItem {
  id: string;
  title: string;
  description: string;
  /** Ruta bajo /public — vacío = placeholder visual */
  image?: string;
}

export interface MaterialFabricItem extends MaterialItem {
  hasColorPalette?: boolean;
}

export const aluminioCategories: MaterialItem[] = [
  {
    id: "simil-madera",
    title: "Aluminio Símil Madera",
    description:
      "Terminación que evoca la calidez de la madera con la resistencia del aluminio. Ideal para proyectos que buscan textura natural sin comprometer durabilidad.",
  },
  {
    id: "pintado",
    title: "Aluminio Pintado",
    description:
      "Acabados termolacados en paleta curada para exteriores. Superficie uniforme, estable al sol y de mantenimiento sencillo.",
  },
  {
    id: "anodizado",
    title: "Aluminio Anodizado",
    description:
      "Tratamiento anodizado de alta tecnología que realza la textura del metal y garantiza resistencia superior a la intemperie.",
  },
];

export const telasBrands: MaterialFabricItem[] = [
  {
    id: "sunbrella",
    title: "Sunbrella",
    description:
      "Textil acrílico premium de origen europeo. Referencia en solidez de color y desempeño outdoor.",
    hasColorPalette: true,
  },
  {
    id: "agora",
    title: "Ágora",
    description:
      "Tejidos técnicos con estética contemporánea y excelente comportamiento frente a la exposición solar.",
    hasColorPalette: true,
  },
  {
    id: "bliss",
    title: "Bliss",
    description:
      "Propuesta textil de alta gama para ambientaciones exteriores con tacto refinado y gran estabilidad cromática.",
    hasColorPalette: true,
  },
];

export const gomaEspumaBrand = "PIERO";

export const gomaEspumaOptions: MaterialItem[] = [
  {
    id: "26k",
    title: "26K",
    description:
      "Densidad equilibrada para asientos de uso frecuente. Confort estable y recuperación progresiva.",
  },
  {
    id: "27k",
    title: "27K",
    description:
      "Mayor soporte estructural con sensación de confort premium. Recomendada para piezas de descanso prolongado.",
  },
  {
    id: "29k",
    title: "29K",
    description:
      "Máxima firmeza y respuesta en asientos de alta exigencia. Ideal para configuraciones de uso intensivo.",
  },
];

export const piedrasDekton: MaterialItem[] = [
  {
    id: "aura",
    title: "Aura",
    description: "Superficie Dekton de carácter mineral y presencia sobria.",
  },
  {
    id: "opera",
    title: "Ópera",
    description: "Acabado Dekton con profundidad cromática y elegancia atemporal.",
  },
  {
    id: "vera",
    title: "Vera",
    description: "Tono Dekton versátil para mesas de comedor y living exterior.",
  },
];

export const piedrasInfinity: MaterialItem[] = [
  { id: "atlantis-grey", title: "Atlantis Grey", description: "Gris mineral con textura equilibrada." },
  { id: "calacatta-oro", title: "Calacatta Oro", description: "Veta clásica con calidez dorada sutil." },
  { id: "andromeda", title: "Andromeda", description: "Contraste dramático de alto impacto visual." },
  { id: "travertino-chiaro", title: "Travertino Chiaro", description: "Inspiración pétrea en tonos claros." },
  { id: "defense", title: "Defense", description: "Superficie técnica de carácter urbano." },
  { id: "pietra-grey", title: "Pietra Grey", description: "Gris profundo con lectura arquitectónica." },
  { id: "laurent", title: "Laurent", description: "Negro veteado de presencia escultórica." },
  { id: "calacatta-hermitage", title: "Calacatta Hermitage", description: "Mármol reinterpretado en piedra sinterizada." },
  { id: "chianca-di-ostuni", title: "Chianca di Ostuni", description: "Calidez mediterránea en superficie clara." },
  { id: "royal-peacock", title: "Royal Peacock", description: "Profundidad cromática con carácter distintivo." },
  { id: "tundra-select", title: "Tundra Select", description: "Neutro sofisticado para composiciones amplias." },
  { id: "sahara-noir", title: "Sahara Noir", description: "Negro intenso con veta dorada mineral." },
];

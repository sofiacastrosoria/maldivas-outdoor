import { normalize } from "@/lib/assistant/analyze";

export type TopicId =
  | "oxidation"
  | "outdoor_permanent"
  | "fabric_recommend"
  | "fabric_fade"
  | "fabric_outdoor_vs_common"
  | "fabric_clean"
  | "fabric_waterproof"
  | "rain_cushions"
  | "painted_vs_anodized"
  | "factory"
  | "made_to_order"
  | "customization"
  | "integral_project"
  | "kids_pets"
  | "pool"
  | "heat_sun"
  | "lifespan"
  | "why_premium"
  | "why_maldivas"
  | "removable_covers"
  | "combine_collections"
  | "choose_model";

const TOPIC_RULES: { id: TopicId; patterns: RegExp[]; weight: number }[] = [
  {
    id: "oxidation",
    weight: 10,
    patterns: [
      /\boxid/,
      /\bherrumb/,
      /\bcorrosion/,
      /\bse\s+oxidan\b/,
      /\boxidan\b/,
      /\boxida\b/,
    ],
  },
  {
    id: "outdoor_permanent",
    weight: 10,
    patterns: [
      /\btodo\s+el\s+ano\b/,
      /\btodo\s+el\s+anio\b/,
      /\bafuera\s+todo\b/,
      /\bdejarlos?\s+afuera\b/,
      /\bdejarlo\s+afuera\b/,
      /\bpermanecer\s+al\s+exterior\b/,
      /\bexterior\s+permanente\b/,
      /\btodo\s+el\s+tiempo\s+afuera\b/,
      /\binvierno\b.*\bafuera\b/,
    ],
  },
  {
    id: "fabric_recommend",
    weight: 10,
    patterns: [
      /\b(recomenda|recomendas|recomiend|sugeris|sugiere|aconseja)\b.*\b(tela|tapizado)\b/,
      /\b(que|cual)\s+tela\b/,
      /\bque\s+tapizado\b/,
      /\bcual\s+tapizado\b/,
      /\bme\s+recomendas\b/,
    ],
  },
  {
    id: "fabric_fade",
    weight: 8,
    patterns: [/\bdestiñ/, /\bdestin/, /\bpierden\s+color\b/, /\bse\s+destiñ/],
  },
  {
    id: "fabric_outdoor_vs_common",
    weight: 8,
    patterns: [
      /\bdiferencia\b.*\btela\b/,
      /\btela\s+comun\b/,
      /\btela\s+outdoor\b/,
    ],
  },
  {
    id: "fabric_clean",
    weight: 8,
    patterns: [
      /\bcomo\s+limp/,
      /\blimpiar\s+(las\s+)?telas\b/,
      /\blimpieza\s+de\s+tela\b/,
    ],
  },
  {
    id: "fabric_waterproof",
    weight: 8,
    patterns: [/\bimpermeable/, /\bhidrorepel/],
  },
  {
    id: "rain_cushions",
    weight: 8,
    patterns: [
      /\ballmohadon/,
      /\blluvia\b/,
      /\bdebajo\s+de\s+la\s+lluvia\b/,
    ],
  },
  {
    id: "painted_vs_anodized",
    weight: 9,
    patterns: [
      /\bdiferencia\b.*\b(anodizado|pintado)\b/,
      /\banodizado\b.*\bpintado\b/,
      /\bpintado\b.*\banodizado\b/,
    ],
  },
  {
    id: "factory",
    weight: 7,
    patterns: [/\bfabrican\b/, /\bfabricacion\b/, /\bfabricamos\b/, /\bson\s+fabricantes\b/],
  },
  {
    id: "made_to_order",
    weight: 7,
    patterns: [
      /\ba\s+pedido\b/,
      /\bse\s+fabrican\b/,
      /\bhechos?\s+a\s+medida\b/,
    ],
  },
  {
    id: "customization",
    weight: 7,
    patterns: [
      /\bpersonaliz/,
      /\bcombinacion\s+especial\b/,
      /\bcolores\s+y\s+terminaciones\b/,
    ],
  },
  {
    id: "integral_project",
    weight: 8,
    patterns: [
      /\bproyecto\s+integral\b/,
      /\bgaleria\b/,
      /\bquincho\b/,
      /\bterraza\b.*\b(proyecto|integral|completo)\b/,
    ],
  },
  {
    id: "kids_pets",
    weight: 8,
    patterns: [/\bniños\b/, /\bninos\b/, /\bmascotas\b/, /\bperros\b/, /\bgatos\b/],
  },
  {
    id: "pool",
    weight: 8,
    patterns: [/\bpiscina\b/, /\bjunto\s+a\s+la\s+piscina\b/],
  },
  {
    id: "heat_sun",
    weight: 7,
    patterns: [/\bse\s+calient/, /\btemperatura\b.*\bsol\b/],
  },
  {
    id: "lifespan",
    weight: 7,
    patterns: [/\bvida\s+util\b/, /\bcuanto\s+duran\b/, /\bcuanto\s+tiempo\s+duran\b/],
  },
  {
    id: "why_premium",
    weight: 7,
    patterns: [
      /\bpor\s+que\s+.*\bpremium\b/,
      /\bvalor\s+diferente\b/,
      /\bmuebles\s+convencionales\b/,
    ],
  },
  {
    id: "why_maldivas",
    weight: 7,
    patterns: [
      /\bpor\s+que\s+elegir\b/,
      /\bpor\s+que\s+maldivas\b/,
      /\bque\s+hace\s+diferente\b/,
    ],
  },
  {
    id: "removable_covers",
    weight: 8,
    patterns: [/\bfundas\b/, /\bdesmontable/],
  },
  {
    id: "combine_collections",
    weight: 7,
    patterns: [
      /\bcombinar\b.*\b(reposera|living|comedor)\b/,
      /\bmisma\s+linea\b/,
    ],
  },
  {
    id: "choose_model",
    weight: 8,
    patterns: [
      /\bque\s+modelo\s+elegir\b/,
      /\bcual\s+modelo\s+elegir\b/,
      /\bque\s+coleccion\b/,
      /\bcual\s+coleccion\b/,
      /\bgaleria\s+familiar\b/,
    ],
  },
];

export function matchTopic(text: string): TopicId | null {
  const n = normalize(text);
  let best: { id: TopicId; score: number } | null = null;

  for (const rule of TOPIC_RULES) {
    let score = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(n)) score += rule.weight;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id: rule.id, score };
    }
  }

  return best && best.score >= 6 ? best.id : null;
}

/** Loose commercial fallback when no intent matched */
export function matchWebsiteHint(text: string): boolean {
  const n = normalize(text);
  return /\b(web|sitio|pagina|carrito|personaliz|naveg|coleccion|ampliar|asistente|cambiar\s+tela|cambiar\s+estructura)\b/.test(
    n
  );
}

export function matchLooseCommercialHint(text: string): string | null {
  const n = normalize(text);

  if (matchWebsiteHint(text)) {
    return null;
  }

  if (/\b(mueble|muebles|terraza|galeria|quincho|jardin|patio|exterior)\b/.test(n)) {
    return "En Maldivas Outdoor diseñamos reposeras, living, mesas y comedores para exteriores exigentes. Contame el espacio que tenés en mente y te oriento sobre colecciones y configuraciones.";
  }

  if (/\b(calidad|premium|lujo|diseno|diseño|fabricacion|garantia|plazo|mantenimiento|limpieza|piscina|uv|tela|telas)\b/.test(n)) {
    return "Trabajamos con fabricación propia, aluminio de alta calidad, telas outdoor premium y terminaciones para uso exterior permanente. Contame qué aspecto te interesa y te oriento con más detalle.";
  }

  return null;
}

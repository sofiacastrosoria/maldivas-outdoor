import { products } from "@/data/products";
import type { Product } from "@/types";
import {
  COLLECTION_SLUGS,
  FABRIC_SLUGS,
  type CollectionSlug,
  type FabricSlug,
} from "@/lib/assistant/facts";
import type { AssistantIntent, ConversationContext } from "@/lib/assistant/types";

const SLUG_SET = new Set<string>(COLLECTION_SLUGS);
const FABRIC_SET = new Set<string>(FABRIC_SLUGS);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const INTENT_RULES: { intent: AssistantIntent; patterns: RegExp[]; weight: number }[] = [
  {
    intent: "website",
    weight: 12,
    patterns: [
      /\bcomo\s+uso\s+la\s+web\b/,
      /\bcomo\s+funciona\s+la\s+web\b/,
      /\bcomo\s+naveg/,
      /\bnavegar\s+productos\b/,
      /\bcomo\s+entro\b/,
      /\bentrar\s+a\s+una\s+coleccion\b/,
      /\bver\s+coleccion\b/,
      /\bcomo\s+personaliz/,
      /\bcomo\s+cambio\b/,
      /\bcambiar\s+(la\s+)?tela\b/,
      /\bcambiar\s+(la\s+)?estructura\b/,
      /\bampliar\b.*\bimagen\b/,
      /\bampliar\s+imagen\b/,
      /\bagregar\s+al\s+carrito\b/,
      /\bcomo\s+uso\s+el\s+asistente\b/,
      /\bcomo\s+funciona\s+el\s+asistente\b/,
      /\bsolicitar\s+asesoramiento\b/,
      /\bcomo\s+comprar\s+en\s+la\s+web\b/,
    ],
  },
  {
    intent: "quote",
    weight: 12,
    patterns: [
      /\bquiero\s+una\s+cotizacion\b/,
      /\bsolicitar\s+cotizacion\b/,
      /\bnecesito\s+presupuesto\b/,
      /\bquiero\s+presupuesto\b/,
      /\bpedir\s+cotizacion\b/,
      /\bnecesito\s+cotizacion\b/,
    ],
  },
  {
    intent: "buy",
    weight: 11,
    patterns: [
      /\bquiero\s+comprar\b/,
      /\bcomprar\s+muebles\b/,
      /\bquiero\s+un\s+mueble\b/,
      /\bquiero\s+comprar\s+muebles\b/,
    ],
  },
  {
    intent: "advisor",
    weight: 11,
    patterns: [
      /\bhablar\s+con\s+(un\s+)?asesor\b/,
      /\bque\s+me\s+contact/,
      /\bcontacten(me)?\b/,
      /\bcontactar(me)?\b/,
      /\bcomunicarme\b/,
      /\bnecesito\s+asesoramiento\b/,
      /\bquiero\s+asesoramiento\b/,
      /\bnecesito\s+ayuda\b/,
      /\bquiero\s+ayuda\b/,
      /\bhablar\s+con\s+alguien\b/,
      /\bhablar\s+con\s+ustedes\b/,
      /\bhablar\s+con\s+el\s+equipo\b/,
    ],
  },
  {
    intent: "company",
    weight: 8,
    patterns: [
      /\bmaldivas\s+outdoor\b/,
      /\bfilosofia\b/,
      /\bquienes\s+son\b/,
      /\bsobre\s+ustedes\b/,
      /\bsobre\s+la\s+marca\b/,
      /\bempresa\b/,
      /\blujo\s+silencioso\b/,
      /\bdiseño\s+atemporal\b/,
      /\bproyecto\s+integral\b/,
    ],
  },
  {
    intent: "showroom",
    weight: 10,
    patterns: [
      /\bdonde\s+(puedo\s+)?ver\b/,
      /\bver\s+(los\s+)?muebles\b/,
      /\bconocer\s+(los\s+)?muebles\b/,
      /\bshowroom\b/,
      /\bvisitar\b/,
      /\bvisita\b/,
      /\bubicacion\b/,
      /\bdireccion\b/,
      /\bcomo\s+llegar\b/,
      /\bver\s+en\s+persona\b/,
      /\bver\s+los\s+productos\b/,
      /\bdonde\s+estan\b/,
      /\bdonde\s+queda\b/,
      /\bubicados\b/,
      /\bpuedo\s+visitarlos\b/,
    ],
  },
  {
    intent: "outdoor_use",
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
    ],
  },
  {
    intent: "oxidation",
    weight: 10,
    patterns: [
      /\boxid/,
      /\bherrumb/,
      /\bcorrosion/,
      /\bse\s+oxidan\b/,
      /\boxidan\b/,
    ],
  },
  {
    intent: "compare",
    weight: 9,
    patterns: [
      /\bdiferencia(s)?\s+entre\b/,
      /\bcompar(ar|acion|ación)\b/,
      /\bcual\s+es\s+mejor\b/,
      /\bvs\b/,
      /\bentre\s+\w+\s+y\s+\w+/,
    ],
  },
  {
    intent: "price",
    weight: 8,
    patterns: [
      /\bcuanto\s+(cuesta|sale|vale|es|esta)\b/,
      /\bprecio\b/,
      /\bvalor\b/,
      /\bcosto\b/,
      /\bcuanto\s+sale\b/,
    ],
  },
  {
    intent: "configuration",
    weight: 7,
    patterns: [
      /\bpersonaliz(ar|acion|ación)\b/,
      /\bconfigur(ar|acion|ación)\b/,
      /\bopciones\s+disponibles\b/,
      /\bque\s+puedo\s+elegir\b/,
      /\bmedida(s)?\s+personaliz/,
      /\btamaños?\b/,
      /\btapizado(s)?\b/,
      /\bestructura(s)?\b/,
      /\bpiedra\b/,
    ],
  },
  {
    intent: "fabric_recommendation",
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
    intent: "fabrics",
    weight: 7,
    patterns: [
      /\bsunbrella\b/,
      /\bagora\b/,
      /\bbliss\b/,
      /\btela(s)?\b/,
      /\btapizado(s)?\b/,
      /\bfunda(s)?\b/,
      /\blimpi(ar|eza)\s+(la\s+)?tela\b/,
      /\bmuestra(s)?\s+de\s+tela\b/,
    ],
  },
  {
    intent: "structures",
    weight: 7,
    patterns: [
      /\banodizado\b/,
      /\bpintado\b/,
      /\bsimil\s+madera\b/,
      /\bestructura(s)?\b/,
      /\baluminio\b/,
    ],
  },
  {
    intent: "materials",
    weight: 6,
    patterns: [
      /\bmateriales?\b/,
      /\baluar\b/,
      /\bgoma\s+espuma\b/,
      /\bpiero\s+soft\b/,
      /\bimpermeable\b/,
      /\bexterior\b/,
      /\bintemperie\b/,
      /\bpiscina\b/,
      /\blluvia\b/,
      /\buv\b/,
      /\bsol\b/,
    ],
  },
  {
    intent: "shipping",
    weight: 7,
    patterns: [
      /\benvio(s)?\b/,
      /\benvian\b/,
      /\bentrega\b/,
      /\bllega\b/,
      /\btransporte\b/,
      /\btodo\s+el\s+pais\b/,
    ],
  },
  {
    intent: "timeline",
    weight: 7,
    patterns: [
      /\bplazo\b/,
      /\btiempo(s)?\s+de\s+fabricacion\b/,
      /\bcuanto\s+tarda\b/,
      /\bcuando\s+llega\b/,
      /\bdemora\b/,
    ],
  },
  {
    intent: "payment",
    weight: 7,
    patterns: [
      /\bpago(s)?\b/,
      /\bforma(s)?\s+de\s+pago\b/,
      /\bcontado\b/,
      /\bdescuento\b/,
      /\b30\s*%/,
      /\btransferencia\b/,
      /\btarjeta\b/,
    ],
  },
  {
    intent: "warranty",
    weight: 7,
    patterns: [
      /\bgarantia\b/,
      /\bgarantiz/,
    ],
  },
  {
    intent: "purchase",
    weight: 6,
    patterns: [
      /\bcompr(ar|a)\b/,
      /\bwhatsapp\b/,
      /\bpedido\b/,
      /\bcomo\s+compro\b/,
      /\bcomo\s+comprar\b/,
      /\bproceso\s+de\s+compra\b/,
    ],
  },
  {
    intent: "maintenance",
    weight: 6,
    patterns: [
      /\bmantenimiento\b/,
      /\blimpi(ar|eza)\b/,
      /\bcuidado\b/,
      /\bvida\s+util\b/,
    ],
  },
  {
    intent: "samples",
    weight: 7,
    patterns: [/\bmuestra(s)?\b/],
  },
  {
    intent: "category_overview",
    weight: 5,
    patterns: [
      /\breposera(s)?\b/,
      /\bliving\b/,
      /\bsillon(es)?\b/,
      /\bmesa(s)?\b/,
      /\bcomedor\b/,
      /\bcoleccion(es)?\b/,
      /\bmodelo(s)?\b/,
      /\bque\s+productos\b/,
      /\bque\s+tienen\b/,
    ],
  },
  {
    intent: "product_info",
    weight: 4,
    patterns: [
      /\bque\s+es\b/,
      /\bcontame\b/,
      /\binformacion\b/,
      /\bdescrib/,
      /\brecomenda(s)?\b/,
    ],
  },
  {
    intent: "greeting",
    weight: 3,
    patterns: [
      /^(hola|buenas|buen\s+dia|buenas\s+tardes|buenas\s+noches)\b/,
      /\bsaludos\b/,
    ],
  },
  {
    intent: "help",
    weight: 4,
    patterns: [
      /\bayuda\b/,
      /\bque\s+podes\b/,
      /\bcomo\s+funciona\b/,
      /\bcomo\s+uso\b/,
    ],
  },
];

const FOLLOW_UP_PRICE =
  /^(y\s+)?(el\s+)?(precio|cuanto\s+(cuesta|sale|vale)|valor|costo)\b/;

const CATEGORY_HINTS: { pattern: RegExp; category: Product["category"] }[] = [
  { pattern: /\b(reposera|reposeras)\b/, category: "reposeras" },
  { pattern: /\b(mesa|mesas)\s+(de\s+)?(comedor|comedores)\b/, category: "comedor" },
  { pattern: /\b(comedor|comedores)\b/, category: "comedor" },
  { pattern: /\bmarbella\b/, category: "comedor" },
  { pattern: /\b(mesa|mesas)\s+(de\s+)?living\b/, category: "mesas" },
  { pattern: /\bmesa\s+living\b/, category: "mesas" },
  { pattern: /\b(mesa|mesas)\b/, category: "mesas" },
  { pattern: /\b(living|sillon|sillones|juego)\b/, category: "living" },
];

function detectCategoryHint(text: string): Product["category"] | undefined {
  const n = normalize(text);
  for (const { pattern, category } of CATEGORY_HINTS) {
    if (pattern.test(n)) return category;
  }
  return undefined;
}

function slugInText(text: string, slug: string): boolean {
  const n = normalize(text);
  const s = normalize(slug);
  return new RegExp(`\\b${s}\\b`).test(n);
}

export function extractSlugs(text: string): CollectionSlug[] {
  const found: CollectionSlug[] = [];
  for (const slug of COLLECTION_SLUGS) {
    if (slugInText(text, slug)) found.push(slug);
  }
  return found;
}

export function extractFabricComparison(text: string): [FabricSlug, FabricSlug] | null {
  const n = normalize(text);
  const found = FABRIC_SLUGS.filter((s) => slugInText(n, s));
  if (found.length >= 2) return [found[0], found[1]];
  const entre = n.match(/\bentre\s+(\w+)\s+y\s+(\w+)\b/);
  if (entre) {
    const a = entre[1] as FabricSlug;
    const b = entre[2] as FabricSlug;
    if (FABRIC_SET.has(a) && FABRIC_SET.has(b)) return [a, b];
  }
  return null;
}

export function isStructureComparison(text: string): boolean {
  const n = normalize(text);
  return (
    /\b(anodizado|pintado|simil\s+madera)\b/.test(n) &&
    (/\bdiferencia/.test(n) || /\bcompar/.test(n) || /\bentre\b/.test(n) || /\bvs\b/.test(n))
  );
}

export function extractComparisonSlugs(text: string): CollectionSlug[] {
  const n = normalize(text);
  const entre = n.match(/\bentre\s+(\w+)\s+y\s+(\w+)\b/);
  if (entre) {
    const a = entre[1] as CollectionSlug;
    const b = entre[2] as CollectionSlug;
    if (SLUG_SET.has(a) && SLUG_SET.has(b)) return [a, b];
  }
  return extractSlugs(text).slice(0, 2);
}

export function resolveProducts(
  text: string,
  categoryHint?: Product["category"]
): Product[] {
  const slugs = extractSlugs(text);
  if (slugs.length === 0) return [];

  const hint = categoryHint ?? detectCategoryHint(text);
  const matches: Product[] = [];

  for (const slug of slugs) {
    const candidates = products.filter((p) => p.slug === slug);
    if (candidates.length === 0) continue;

    if (hint) {
      const filtered = candidates.filter((p) => p.category === hint);
      matches.push(...(filtered.length ? filtered : candidates));
    } else if (candidates.length === 1) {
      matches.push(candidates[0]);
    } else {
      const n = normalize(text);
      if (/\bmesa\b/.test(n)) {
        const mesa =
          candidates.find((p) => p.category === "mesas" || p.category === "comedor") ??
          candidates[0];
        matches.push(mesa);
      } else if (/\b(reposera|reposeras)\b/.test(n)) {
        matches.push(
          candidates.find((p) => p.category === "reposeras") ?? candidates[0]
        );
      } else if (/\b(living|sillon|sillones)\b/.test(n)) {
        matches.push(
          candidates.find((p) => p.category === "living") ?? candidates[0]
        );
      } else {
        matches.push(candidates[0]);
      }
    }
  }

  const seen = new Set<string>();
  return matches.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

function scoreIntents(text: string): Map<AssistantIntent, number> {
  const n = normalize(text);
  const scores = new Map<AssistantIntent, number>();

  for (const rule of INTENT_RULES) {
    let ruleScore = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(n)) ruleScore += rule.weight;
    }
    if (ruleScore > 0) {
      scores.set(rule.intent, (scores.get(rule.intent) ?? 0) + ruleScore);
    }
  }

  if (extractSlugs(text).length > 0) {
    scores.set("product_info", (scores.get("product_info") ?? 0) + 3);
  }

  return scores;
}

function pickIntent(
  scores: Map<AssistantIntent, number>,
  text: string,
  context: ConversationContext,
  isFollowUp: boolean
): AssistantIntent {
  if (isFollowUp && context.lastProductId) return "price";

  const n = normalize(text);

  if ((scores.get("website") ?? 0) >= 10) return "website";
  if ((scores.get("quote") ?? 0) >= 11) return "quote";
  if ((scores.get("buy") ?? 0) >= 11) return "buy";
  if ((scores.get("advisor") ?? 0) >= 11) return "advisor";

  const compareSlugs = extractComparisonSlugs(text);
  if (compareSlugs.length >= 2 && (scores.get("compare") ?? 0) > 0) {
    return "compare";
  }

  if ((scores.get("showroom") ?? 0) >= 10) return "showroom";
  if ((scores.get("oxidation") ?? 0) >= 10) return "oxidation";
  if ((scores.get("outdoor_use") ?? 0) >= 10) return "outdoor_use";
  if ((scores.get("fabric_recommendation") ?? 0) >= 10) {
    return "fabric_recommendation";
  }

  let best: AssistantIntent = "unknown";
  let bestScore = 0;
  for (const [intent, score] of scores) {
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (bestScore < 3) {
    if (extractSlugs(text).length > 0) return "product_info";
    return "unknown";
  }

  if (best === "category_overview" && extractSlugs(text).length > 0) {
    return "product_info";
  }

  if (best === "fabrics" && /\bestructura/.test(n)) {
    if ((scores.get("structures") ?? 0) >= (scores.get("fabrics") ?? 0)) {
      return "structures";
    }
  }

  if (best === "fabrics" && (scores.get("fabric_recommendation") ?? 0) > 0) {
    return "fabric_recommendation";
  }

  return best;
}

export function parseQuery(
  text: string,
  context: ConversationContext
): {
  intent: AssistantIntent;
  products: Product[];
  compareSlugs: CollectionSlug[];
  categoryHint?: Product["category"];
  isFollowUp: boolean;
} {
  const raw = text.trim();
  const n = normalize(raw);
  const isFollowUp = FOLLOW_UP_PRICE.test(n);

  const categoryHint = detectCategoryHint(raw);
  const productsFound = resolveProducts(raw, categoryHint);
  const compareSlugs = extractComparisonSlugs(raw);
  const scores = scoreIntents(raw);
  const intent = pickIntent(scores, raw, context, isFollowUp);

  let resolvedProducts = productsFound;
  if (isFollowUp && context.lastProductId) {
    const fromContext = products.find((p) => p.id === context.lastProductId);
    if (fromContext) resolvedProducts = [fromContext];
  } else if (resolvedProducts.length === 0 && context.lastProductId) {
    const fromContext = products.find((p) => p.id === context.lastProductId);
    if (
      fromContext &&
      ["price", "configuration", "product_info"].includes(intent)
    ) {
      resolvedProducts = [fromContext];
    }
  }

  return {
    intent,
    products: resolvedProducts,
    compareSlugs,
    categoryHint,
    isFollowUp,
  };
}

import {
  ASSISTANT_ESCALATION_MESSAGE,
  DEFAULT_SUGGESTIONS,
} from "@/data/knowledge-base";
import { resolveActions } from "@/lib/assistant/actions";
import {
  parseQuery,
  extractFabricComparison,
  isStructureComparison,
} from "@/lib/assistant/analyze";
import {
  matchLooseCommercialHint,
  matchTopic,
  matchWebsiteHint,
} from "@/lib/assistant/topicMatcher";
import type { CollectionSlug } from "@/lib/assistant/facts";
import {
  respondCategoryOverview,
  respondCompare,
  respondCompareFabrics,
  respondCompareStructures,
  respondConfiguration,
  respondCompany,
  respondAdvisor,
  respondBuy,
  respondFabrics,
  respondFabricRecommendation,
  respondGreeting,
  respondHelp,
  respondMaintenance,
  respondMaterials,
  respondOxidation,
  respondOutdoorPermanent,
  respondPayment,
  respondPrice,
  respondProductInfo,
  respondPurchase,
  respondQuote,
  respondSamples,
  respondShipping,
  respondShowroom,
  respondStructures,
  respondTimeline,
  respondTopic,
  respondWarranty,
  respondWebsite,
  suggestionsForIntent,
} from "@/lib/assistant/respond";
import type {
  AssistantIntent,
  AssistantReply,
  ConversationContext,
} from "@/lib/assistant/types";

function detectCategoryFromText(text: string) {
  const n = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/\b(reposera|reposeras)\b/.test(n)) return "reposeras" as const;
  if (/\b(comedor|comedores|marbella)\b/.test(n)) return "comedor" as const;
  if (/\b(mesa|mesas)\b/.test(n)) return "mesas" as const;
  if (/\b(living|sillon|sillones)\b/.test(n)) return "living" as const;
  return undefined;
}

function updateContext(
  prev: ConversationContext,
  productId?: string,
  category?: ConversationContext["lastCategory"],
  slugs?: string[]
): ConversationContext {
  return {
    lastProductId: productId ?? prev.lastProductId,
    lastCategory: category ?? prev.lastCategory,
    lastSlugs: slugs ?? prev.lastSlugs,
  };
}

function resolveIntentAnswer(
  intent: AssistantIntent,
  trimmed: string,
  query: ReturnType<typeof parseQuery>,
  product: ReturnType<typeof parseQuery>["products"][0]
): { answer: string; effectiveIntent: AssistantIntent } {
  switch (intent) {
    case "greeting":
      return { answer: respondGreeting(), effectiveIntent: intent };
    case "help":
      return { answer: respondHelp(), effectiveIntent: intent };
    case "website":
      return { answer: respondWebsite(), effectiveIntent: intent };
    case "company":
      return { answer: respondCompany(), effectiveIntent: intent };
    case "advisor":
      return { answer: respondAdvisor(), effectiveIntent: intent };
    case "quote":
      return { answer: respondQuote(), effectiveIntent: intent };
    case "buy":
      return { answer: respondBuy(), effectiveIntent: intent };
    case "showroom":
      return {
        answer: respondShowroom(trimmed),
        effectiveIntent: intent,
      };
    case "oxidation":
      return { answer: respondOxidation(), effectiveIntent: intent };
    case "outdoor_use":
      return { answer: respondOutdoorPermanent(), effectiveIntent: intent };
    case "fabric_recommendation":
      return {
        answer: respondFabricRecommendation(),
        effectiveIntent: intent,
      };
    case "price":
      if (product) {
        return { answer: respondPrice(product), effectiveIntent: intent };
      }
      return {
        answer:
          "Indicame el modelo que te interesa —reposera Fendi, living Maldivas, mesa Marbella— y te comparto el precio estimativo actualizado.",
        effectiveIntent: intent,
      };
    case "product_info":
      if (product) {
        return { answer: respondProductInfo(product), effectiveIntent: intent };
      }
      {
        const cat = query.categoryHint ?? detectCategoryFromText(trimmed);
        if (cat) {
          return {
            answer: respondCategoryOverview(cat),
            effectiveIntent: intent,
          };
        }
      }
      return {
        answer:
          "Tenemos reposeras, juegos de living, mesas de living y comedor. ¿Sobre qué colección querés que te oriente?",
        effectiveIntent: intent,
      };
    case "category_overview": {
      const cat = query.categoryHint ?? detectCategoryFromText(trimmed);
      if (cat) {
        return {
          answer: respondCategoryOverview(cat),
          effectiveIntent: intent,
        };
      }
      return {
        answer:
          "Nuestra propuesta se organiza en Reposeras, Juegos de Living y Comedor. Cada línea tiene colecciones con personalización propia. ¿Cuál te gustaría explorar?",
        effectiveIntent: intent,
      };
    }
    case "compare": {
      const fabricPair = extractFabricComparison(trimmed);
      if (fabricPair) {
        return {
          answer: respondCompareFabrics(fabricPair[0], fabricPair[1]),
          effectiveIntent: intent,
        };
      }
      if (isStructureComparison(trimmed)) {
        return {
          answer: respondCompareStructures(),
          effectiveIntent: intent,
        };
      }
      const [a, b] = query.compareSlugs;
      if (a && b) {
        const comparison = respondCompare(
          a as CollectionSlug,
          b as CollectionSlug,
          query.categoryHint
        );
        return {
          answer:
            comparison ??
            "Puedo comparar colecciones como Fendi y Skorphio, o Málaga y Maldivas. Decime en qué categoría te interesa —reposeras, living, mesas o comedor— y te explico las diferencias.",
          effectiveIntent: intent,
        };
      }
      return {
        answer:
          "Para comparar, mencioná dos colecciones —por ejemplo: «¿Cuál es la diferencia entre Fendi y Skorphio?» o «Málaga vs Maldivas».",
        effectiveIntent: intent,
      };
    }
    case "configuration":
      return {
        answer: respondConfiguration(product),
        effectiveIntent: intent,
      };
    case "fabrics":
      return { answer: respondFabrics(), effectiveIntent: intent };
    case "structures":
      return { answer: respondStructures(), effectiveIntent: intent };
    case "materials":
      return { answer: respondMaterials(), effectiveIntent: intent };
    case "shipping":
      return { answer: respondShipping(), effectiveIntent: intent };
    case "timeline":
      return { answer: respondTimeline(), effectiveIntent: intent };
    case "payment":
      return { answer: respondPayment(), effectiveIntent: intent };
    case "warranty":
      return { answer: respondWarranty(), effectiveIntent: intent };
    case "purchase":
      return { answer: respondPurchase(), effectiveIntent: intent };
    case "maintenance":
      return { answer: respondMaintenance(), effectiveIntent: intent };
    case "samples":
      return { answer: respondSamples(), effectiveIntent: intent };
    default:
      return { answer: "", effectiveIntent: "unknown" };
  }
}

export function getAssistantReply(
  input: string,
  context: ConversationContext = {}
): AssistantReply {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      answer:
        "Contame qué necesitás saber: productos, precios, materiales, envíos o cómo personalizar tu mueble.",
      suggestions: DEFAULT_SUGGESTIONS,
      escalated: false,
      actions: [],
      context,
    };
  }

  const query = parseQuery(trimmed, context);
  const product = query.products[0];

  let { answer, effectiveIntent } = resolveIntentAnswer(
    query.intent,
    trimmed,
    query,
    product
  );

  if (!answer && query.intent === "unknown") {
    const topic = matchTopic(trimmed);
    if (topic) {
      answer = respondTopic(topic);
      effectiveIntent = "help";
    } else if (matchWebsiteHint(trimmed)) {
      answer = respondWebsite();
      effectiveIntent = "website";
    } else {
      const hint = matchLooseCommercialHint(trimmed);
      if (hint) {
        answer = hint;
        effectiveIntent = "help";
      }
    }
  }

  if (!answer && matchWebsiteHint(trimmed)) {
    answer = respondWebsite();
    effectiveIntent = "website";
  }

  const escalated = !answer;
  if (escalated) {
    answer = ASSISTANT_ESCALATION_MESSAGE;
  }

  const actions = resolveActions(effectiveIntent, trimmed, escalated);

  const nextContext = updateContext(
    context,
    product?.id,
    product?.category ?? query.categoryHint,
    query.compareSlugs.length
      ? query.compareSlugs
      : product
        ? [product.slug]
        : undefined
  );

  const resolvedIntent = escalated ? "unknown" : effectiveIntent;

  return {
    answer,
    suggestions: escalated
      ? []
      : suggestionsForIntent(resolvedIntent, product),
    escalated,
    actions,
    context: nextContext,
  };
}

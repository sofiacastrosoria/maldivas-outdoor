import {
  ASSISTANT_ESCALATION_MESSAGE,
  DEFAULT_SUGGESTIONS,
} from "@/data/knowledge-base";
import { parseQuery, extractFabricComparison, isStructureComparison } from "@/lib/assistant/analyze";
import type { CollectionSlug } from "@/lib/assistant/facts";
import {
  respondCategoryOverview,
  respondCompare,
  respondCompareFabrics,
  respondCompareStructures,
  respondConfiguration,
  respondCompany,
  respondFabrics,
  respondGreeting,
  respondHelp,
  respondMaintenance,
  respondMaterials,
  respondPayment,
  respondPrice,
  respondProductInfo,
  respondPurchase,
  respondSamples,
  respondShipping,
  respondShowroom,
  respondStructures,
  respondTimeline,
  respondWarranty,
  suggestionsForIntent,
} from "@/lib/assistant/respond";
import type {
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
      context,
    };
  }

  const query = parseQuery(trimmed, context);
  const product = query.products[0];
  let answer = "";
  let escalated = false;

  switch (query.intent) {
    case "greeting":
      answer = respondGreeting();
      break;
    case "help":
      answer = respondHelp();
      break;
    case "company":
      answer = respondCompany();
      break;
    case "showroom":
      answer = respondShowroom();
      break;
    case "price":
      if (product) {
        answer = respondPrice(product);
      } else if (query.compareSlugs.length === 1) {
        const resolved = query.products[0];
        answer = resolved
          ? respondPrice(resolved)
          : "Indicame qué producto te interesa —por ejemplo, reposera Fendi o living Maldivas— y te informo el precio estimativo vigente.";
      } else {
        answer =
          "Indicame el modelo que te interesa —reposera, sillón o mesa— y te comparto el precio estimativo actualizado desde nuestro configurador.";
      }
      break;
    case "product_info":
      if (product) {
        answer = respondProductInfo(product);
      } else {
        const cat = query.categoryHint ?? detectCategoryFromText(trimmed);
        if (cat) answer = respondCategoryOverview(cat);
        else
          answer =
            "Tenemos reposeras, juegos de living, mesas de living y comedor. ¿Sobre qué colección querés que te cuente?";
      }
      break;
    case "category_overview": {
      const cat = query.categoryHint ?? detectCategoryFromText(trimmed);
      if (cat) answer = respondCategoryOverview(cat);
      else
        answer =
          "Nuestra propuesta se organiza en Reposeras, Juegos de Living y Comedor. Cada línea tiene colecciones con personalización propia. ¿Cuál te gustaría explorar?";
      break;
    }
    case "compare": {
      const fabricPair = extractFabricComparison(trimmed);
      if (fabricPair) {
        answer = respondCompareFabrics(fabricPair[0], fabricPair[1]);
        break;
      }
      if (isStructureComparison(trimmed)) {
        answer = respondCompareStructures();
        break;
      }
      const [a, b] = query.compareSlugs;
      if (a && b) {
        const comparison = respondCompare(a, b, query.categoryHint);
        answer =
          comparison ??
          "Puedo comparar colecciones como Fendi y Skorphio, o Málaga y Maldivas. Decime qué dos modelos querés contrastar y, si podés, en qué categoría (reposeras, living, mesas o comedor).";
      } else {
        answer =
          "Para comparar, mencioná dos colecciones —por ejemplo: «¿Cuál es la diferencia entre Fendi y Skorphio?» o «Málaga vs Maldivas».";
      }
      break;
    }
    case "configuration":
      answer = respondConfiguration(product);
      break;
    case "fabrics":
      answer = respondFabrics();
      break;
    case "structures":
      answer = respondStructures();
      break;
    case "materials":
      answer = respondMaterials();
      break;
    case "shipping":
      answer = respondShipping();
      break;
    case "timeline":
      answer = respondTimeline();
      break;
    case "payment":
      answer = respondPayment();
      break;
    case "warranty":
      answer = respondWarranty();
      break;
    case "purchase":
      answer = respondPurchase();
      break;
    case "maintenance":
      answer = respondMaintenance();
      break;
    case "samples":
      answer = respondSamples();
      break;
    default:
      escalated = true;
      answer = ASSISTANT_ESCALATION_MESSAGE;
  }

  if (!answer) {
    escalated = true;
    answer = ASSISTANT_ESCALATION_MESSAGE;
  }

  const nextContext = updateContext(
    context,
    product?.id,
    product?.category ?? query.categoryHint,
    query.compareSlugs.length
      ? (query.compareSlugs as string[])
      : product
        ? [product.slug]
        : undefined
  );

  return {
    answer,
    suggestions: escalated
      ? []
      : suggestionsForIntent(query.intent, product),
    escalated,
    context: nextContext,
  };
}

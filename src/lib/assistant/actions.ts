import { normalize } from "@/lib/assistant/analyze";
import { SHOWROOM_MAP_URL } from "@/lib/assistant/facts";
import type { AssistantAction, AssistantIntent } from "@/lib/assistant/types";
import {
  ASSISTANT_QUOTE_WHATSAPP_MESSAGE,
  ASSISTANT_SHOWROOM_WHATSAPP_MESSAGE,
  ASSISTANT_WHATSAPP_MESSAGE,
} from "@/data/knowledge-base";

const PRODUCTS_HREF = "/productos";

export function resolveActions(
  intent: AssistantIntent,
  text: string,
  escalated: boolean
): AssistantAction[] {
  if (escalated) {
    return [
      {
        type: "advisor",
        label: "Hablar con un asesor",
        whatsappMessage: ASSISTANT_WHATSAPP_MESSAGE,
      },
    ];
  }

  const n = normalize(text);

  if (
    intent === "quote" ||
    (intent === "advisor" && /\b(cotizacion|presupuesto)\b/.test(n))
  ) {
    return [
      {
        type: "quote",
        label: "Solicitar cotización",
        whatsappMessage: ASSISTANT_QUOTE_WHATSAPP_MESSAGE,
      },
    ];
  }

  if (
    intent === "buy" ||
    (intent === "purchase" && /\bquiero\s+comprar\b/.test(n))
  ) {
    return [{ type: "products", label: "Ver productos", href: PRODUCTS_HREF }];
  }

  if (intent === "advisor") {
    return [
      {
        type: "advisor",
        label: "Hablar con un asesor",
        whatsappMessage: ASSISTANT_WHATSAPP_MESSAGE,
      },
    ];
  }

  if (intent === "showroom") {
    const locationOnly =
      /\b(donde\s+estan|donde\s+queda|ubicacion|direccion|como\s+llegar)\b/.test(
        n
      ) &&
      !/\b(visitar|visita|ver\s+(los\s+)?muebles|showroom|puedo\s+visitar)\b/.test(
        n
      );

    if (locationOnly) {
      return [
        {
          type: "directions",
          label: "Cómo llegar",
          href: SHOWROOM_MAP_URL,
        },
      ];
    }

    return [
      {
        type: "advisor",
        label: "Hablar con un asesor",
        whatsappMessage: ASSISTANT_SHOWROOM_WHATSAPP_MESSAGE,
      },
      {
        type: "directions",
        label: "Cómo llegar",
        href: SHOWROOM_MAP_URL,
      },
    ];
  }

  if (intent === "purchase") {
    return [{ type: "products", label: "Ver productos", href: PRODUCTS_HREF }];
  }

  return [];
}

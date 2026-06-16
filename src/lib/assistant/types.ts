import type { Product } from "@/types";

export interface ConversationContext {
  lastProductId?: string;
  lastCategory?: Product["category"];
  lastSlugs?: string[];
}

export type AssistantIntent =
  | "greeting"
  | "company"
  | "advisor"
  | "quote"
  | "buy"
  | "showroom"
  | "website"
  | "price"
  | "product_info"
  | "category_overview"
  | "compare"
  | "configuration"
  | "materials"
  | "fabrics"
  | "fabric_recommendation"
  | "structures"
  | "oxidation"
  | "outdoor_use"
  | "shipping"
  | "payment"
  | "warranty"
  | "timeline"
  | "purchase"
  | "maintenance"
  | "samples"
  | "help"
  | "unknown";

export type AssistantAction =
  | {
      type: "advisor";
      label: "Hablar con un asesor";
      whatsappMessage: string;
    }
  | {
      type: "quote";
      label: "Solicitar cotización";
      whatsappMessage: string;
    }
  | { type: "directions"; label: "Cómo llegar"; href: string }
  | { type: "products"; label: "Ver productos"; href: string };

export interface ParsedQuery {
  intent: AssistantIntent;
  products: Product[];
  compareSlugs: string[];
  categoryHint?: Product["category"];
  isFollowUp: boolean;
  raw: string;
}

export interface AssistantReply {
  answer: string;
  suggestions: string[];
  /** True only when no related information exists */
  escalated: boolean;
  actions: AssistantAction[];
  context: ConversationContext;
}

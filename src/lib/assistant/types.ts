import type { Product } from "@/types";

export interface ConversationContext {
  lastProductId?: string;
  lastCategory?: Product["category"];
  lastSlugs?: string[];
}

export type AssistantIntent =
  | "greeting"
  | "company"
  | "showroom"
  | "price"
  | "product_info"
  | "category_overview"
  | "compare"
  | "configuration"
  | "materials"
  | "fabrics"
  | "structures"
  | "shipping"
  | "payment"
  | "warranty"
  | "timeline"
  | "purchase"
  | "maintenance"
  | "samples"
  | "help"
  | "unknown";

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
  escalated: boolean;
  context: ConversationContext;
}

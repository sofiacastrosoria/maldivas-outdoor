import {
  ASSISTANT_ESCALATION_MESSAGE,
  DEFAULT_SUGGESTIONS,
  knowledgeEntries,
  type KnowledgeEntry,
} from "@/data/knowledge-base";

export interface AssistantReply {
  answer: string;
  suggestions: string[];
  escalated: boolean;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,]/g, " ")
    .trim();
}

function scoreEntry(input: string, entry: KnowledgeEntry): number {
  let score = 0;
  const normInput = normalize(input);

  for (const topic of entry.topics) {
    const normTopic = normalize(topic);
    if (normTopic.length < 3) continue;
    if (normInput.includes(normTopic)) {
      score += normTopic.length >= 6 ? 4 : 2;
    }
  }

  if (entry.question) {
    const qWords = normalize(entry.question)
      .split(/\s+/)
      .filter((w) => w.length > 4);
    for (const word of qWords) {
      if (normInput.includes(word)) score += 1;
    }
  }

  return score;
}

export function getAssistantReply(input: string): AssistantReply {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      answer:
        "Contame qué necesitás saber: productos, materiales, envíos o cómo personalizar tu mueble.",
      suggestions: DEFAULT_SUGGESTIONS,
      escalated: false,
    };
  }

  let best: { entry: KnowledgeEntry; score: number } | null = null;

  for (const entry of knowledgeEntries) {
    const score = scoreEntry(trimmed, entry);
    if (!best || score > best.score) {
      best = { entry, score };
    }
  }

  const MIN_SCORE = 2;
  if (!best || best.score < MIN_SCORE) {
    return {
      answer: ASSISTANT_ESCALATION_MESSAGE,
      suggestions: [],
      escalated: true,
    };
  }

  return {
    answer: best.entry.answer,
    suggestions: best.entry.suggestions ?? DEFAULT_SUGGESTIONS.slice(0, 2),
    escalated: false,
  };
}

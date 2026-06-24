import {
  INFINITY_STONES_CATALOG,
  MESA_SKORPHIO_LIVING,
  MESA_SKORPHIO_RESPONSES,
} from "@/data/knowledge-base";
import { products } from "@/data/products";
import { normalize } from "@/lib/assistant/analyze";
import type { Product } from "@/types";

const MESA_SKORPHIO_ID = "mesa-skorphio";

function getMesaSkorphioProduct(): Product | undefined {
  return products.find((p) => p.id === MESA_SKORPHIO_ID);
}

function isMesaSkorphioContext(text: string, product?: Product): boolean {
  const n = normalize(text);
  if (product?.id === MESA_SKORPHIO_ID) return true;
  return /\bskorphio\b/.test(n) && /\bmesa(s)?\b/.test(n);
}

function isWhiteMacaubasQuestion(text: string): boolean {
  const n = normalize(text);
  return (
    /\bwhite\s+macaubas\b/.test(n) &&
    /\b(que\s+es|que\s+significa|informacion|contame|explicame)\b/.test(n)
  );
}

function isInfinityStonesQuestion(text: string): boolean {
  const n = normalize(text);
  if (/\bskorphio\b/.test(n) && /\b(piedra|piedras)\b/.test(n)) return false;
  return /\binfinity\b/.test(n) && /\b(piedra|piedras)\b/.test(n);
}

function isMesaSkorphioStonesQuestion(text: string): boolean {
  const n = normalize(text);
  return (
    /\b(piedra|piedras)\b/.test(n) &&
    (/\bskorphio\b/.test(n) ||
      /\b(que\s+tiene|opciones|disponible|configur)\b/.test(n))
  );
}

function isMeasureQuestion(text: string): boolean {
  const n = normalize(text);
  return /\b(medida|medidas|dimension|dimensiones|tamano|tamanos)\b/.test(n);
}

function isPriceQuestion(text: string): boolean {
  const n = normalize(text);
  return /\b(precio|cuanto\s+(cuesta|sale|vale)|valor|costo)\b/.test(n);
}

export function respondInfinityStones(): string {
  const list = INFINITY_STONES_CATALOG.join(", ");
  return `En la sección Conocer Piedras trabajamos con superficies Infinity: ${list}. White Macaubas es exclusiva de la mesa Skorphio y no figura en ese catálogo general.`;
}

export function respondMesaSkorphioPaymentBenefits(): string {
  const { listPrice, transferDiscountPercent, cashDiscountPercent } =
    MESA_SKORPHIO_LIVING;
  const transfer = Math.round(listPrice * (1 - transferDiscountPercent / 100));
  const cash = Math.round(listPrice * (1 - cashDiscountPercent / 100));
  const fmt = (n: number) =>
    n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  return `Para la mesa de living Skorphio, el precio de lista es ${fmt(listPrice)}. Con transferencia bancaria (${transferDiscountPercent}% OFF): ${fmt(transfer)}. En efectivo (${cashDiscountPercent}% OFF): ${fmt(cash)}.`;
}

/**
 * Respuestas de alta prioridad basadas en la knowledge base del producto.
 * Devuelve null si la consulta no coincide con un patrón conocido.
 */
export function matchProductKnowledge(
  text: string,
  product?: Product
): string | null {
  const mesaSkorphio = product ?? getMesaSkorphioProduct();
  const inSkorphioContext = isMesaSkorphioContext(text, product);

  if (isWhiteMacaubasQuestion(text)) {
    return MESA_SKORPHIO_RESPONSES.whiteMacaubas;
  }

  if (isInfinityStonesQuestion(text)) {
    return respondInfinityStones();
  }

  if (!inSkorphioContext) return null;

  if (isMesaSkorphioStonesQuestion(text)) {
    return MESA_SKORPHIO_RESPONSES.stones;
  }

  if (isMeasureQuestion(text)) {
    return MESA_SKORPHIO_RESPONSES.measure;
  }

  if (isPriceQuestion(text)) {
    return MESA_SKORPHIO_RESPONSES.price;
  }

  if (
    /\b(transferencia|efectivo|descuento|beneficio)\b/.test(normalize(text)) &&
    mesaSkorphio
  ) {
    return respondMesaSkorphioPaymentBenefits();
  }

  return null;
}

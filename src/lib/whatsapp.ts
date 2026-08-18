import type { CartItem } from "@/types";
import { calculateCartItemPricing, calculateCartTotals, formatPrice } from "@/lib/pricing";

/** WhatsApp: +54 9 3516 81-2006 */
export const WHATSAPP_NUMBER = "5493516812006";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string): void {
  const url = buildWhatsAppUrl(message);
  window.open(url, "_blank", "noopener,noreferrer");
}

function getConfigValue(
  summary: string[],
  keys: string[]
): string | undefined {
  for (const line of summary) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (keys.some((k) => key.includes(k.toLowerCase()))) {
      return value || undefined;
    }
  }
  return undefined;
}

function formatCartItemBlock(item: CartItem): string {
  const size =
    getConfigValue(item.configSummary, ["tamaño", "tamano", "medida"]) ??
    "—";
  const structure =
    getConfigValue(item.configSummary, ["estructura"]) ?? "—";
  const color = getConfigValue(item.configSummary, ["color"]);
  const fabric =
    getConfigValue(item.configSummary, ["tapizado", "tela"]) ?? "—";
  const stoneBrand = getConfigValue(item.configSummary, ["piedra"]);
  const stoneModel = item.configSummary
    .find((l) => l.toLowerCase().startsWith("modelo:"))
    ?.split(":")[1]
    ?.trim();
  const stone =
    [stoneBrand, stoneModel].filter(Boolean).join(" — ") || "—";

  const pricing = calculateCartItemPricing(
    item.unitPrice,
    item.quantity,
    item.productId
  );

  const lines = [
    `• ${item.productName}`,
    `- Tamaño: ${size}`,
    `- Estructura: ${structure}`,
    ...(color ? [`- Color: ${color}`] : []),
    `- Tapizado: ${fabric}`,
    `- Piedra: ${stone}`,
    `- Cantidad: ${item.quantity}`,
    `- Precio de lista: ${formatPrice(pricing.lineList)}`,
    `- Precio transferencia (${pricing.transferPercent}% OFF): ${formatPrice(pricing.lineTransfer)}`,
    `- Precio efectivo (${pricing.cashPercent}% OFF): ${formatPrice(pricing.lineCash)}`,
  ];

  const extra = item.configSummary.filter((line) => {
    const lower = line.toLowerCase();
    return (
      !lower.startsWith("tamaño") &&
      !lower.startsWith("tamano") &&
      !lower.startsWith("estructura") &&
      !lower.startsWith("tapizado") &&
      !lower.startsWith("tela") &&
      !lower.startsWith("color") &&
      !lower.startsWith("piedra") &&
      !lower.startsWith("modelo:") &&
      !lower.startsWith("medida personalizada")
    );
  });

  if (extra.length > 0) {
    extra.forEach((line) => lines.push(`- ${line}`));
  }

  const customSize = getConfigValue(item.configSummary, [
    "medida personalizada",
  ]);
  if (customSize) {
    lines[1] = `- Tamaño: ${customSize}`;
  }

  return lines.join("\n");
}

export function generateCartWhatsAppMessage(items: CartItem[]): string {
  const productBlocks = items.map(formatCartItemBlock).join("\n\n");
  const totals = calculateCartTotals(items);

  return [
    "Hola Maldivas Outdoor.",
    "Quiero solicitar una cotización.",
    "",
    "Productos seleccionados:",
    "",
    productBlocks,
    "",
    "RESUMEN:",
    `Subtotal lista: ${formatPrice(totals.list)}`,
    `Subtotal transferencia${totals.transferPercent != null ? ` (${totals.transferPercent}% OFF)` : ""}: ${formatPrice(totals.transfer)}`,
    `Subtotal efectivo${totals.cashPercent != null ? ` (${totals.cashPercent}% OFF)` : ""}: ${formatPrice(totals.cash)}`,
    "",
    "Muchas gracias.",
  ].join("\n");
}

/** @deprecated Use generateCartWhatsAppMessage */
export function generateWhatsAppMessage(
  items: CartItem[],
  _total?: number
): string {
  return generateCartWhatsAppMessage(items);
}

export function cartToWhatsApp(items: CartItem[]): void {
  openWhatsApp(generateCartWhatsAppMessage(items));
}

const CONTACT_DEFAULT_PREFIX =
  "Hola, podrían enviarme más información acerca de";

export function generateContactWhatsAppMessage(userText: string): string {
  const trimmed = userText.trim();
  if (!trimmed || trimmed === CONTACT_DEFAULT_PREFIX.trim()) {
    return CONTACT_DEFAULT_PREFIX;
  }
  if (trimmed.startsWith(CONTACT_DEFAULT_PREFIX)) {
    return trimmed;
  }
  return `${CONTACT_DEFAULT_PREFIX} ${trimmed}`;
}

export function contactToWhatsApp(userText: string): void {
  openWhatsApp(generateContactWhatsAppMessage(userText));
}

export const CONTACT_MESSAGE_DEFAULT = `${CONTACT_DEFAULT_PREFIX} `;

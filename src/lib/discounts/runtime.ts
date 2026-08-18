import {
  DEFAULT_DISCOUNT_RATES,
  type DiscountRates,
  type ProductDiscountRow,
} from "@/lib/discounts/types";

let globalRates: DiscountRates = { ...DEFAULT_DISCOUNT_RATES };
let productRates = new Map<string, DiscountRates>();

export function setRuntimeDiscounts(
  global: DiscountRates | null,
  overrides: ProductDiscountRow[] | null
): void {
  globalRates = global ? { ...global } : { ...DEFAULT_DISCOUNT_RATES };
  const next = new Map<string, DiscountRates>();
  for (const row of overrides ?? []) {
    next.set(row.product_id, {
      cashPercent: Number(row.cash_percent),
      transferPercent: Number(row.transfer_percent),
    });
  }
  productRates = next;
}

export function getGlobalDiscountRates(): DiscountRates {
  return globalRates;
}

export function getDiscountRates(productId?: string | null): DiscountRates {
  if (productId && productRates.has(productId)) {
    return productRates.get(productId)!;
  }
  return globalRates;
}

export function percentToMultiplier(percent: number): number {
  const safe = Number.isFinite(percent) ? percent : 0;
  return Math.max(0, 1 - safe / 100);
}

export function formatDiscountLabel(percent: number | null | undefined): string {
  if (percent == null || !Number.isFinite(percent) || percent <= 0) {
    return "";
  }
  const pretty = Number.isInteger(percent) ? String(percent) : String(percent);
  return `${pretty}% OFF`;
}

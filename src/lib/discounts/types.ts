export interface DiscountRates {
  cashPercent: number;
  transferPercent: number;
}

export interface DiscountSettingsRow {
  id: string;
  cash_percent: number;
  transfer_percent: number;
  updated_at?: string;
}

export interface ProductDiscountRow {
  product_id: string;
  cash_percent: number;
  transfer_percent: number;
  updated_at?: string;
}

export const DEFAULT_DISCOUNT_RATES: DiscountRates = {
  cashPercent: 30,
  transferPercent: 15,
};

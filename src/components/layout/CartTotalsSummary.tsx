import { calculateCartTotals, formatPrice, type CartTotals } from "@/lib/pricing";
import type { CartItem } from "@/types";

interface CartTotalsSummaryProps {
  items: CartItem[];
}

/** Resumen compacto (referencia; el carrito usa CartDrawerBreakdown). */
export function CartTotalsDetail({ totals }: { totals: CartTotals }) {
  return <CartDrawerBreakdown totals={totals} />;
}

export function CartDrawerBreakdown({ totals }: { totals: CartTotals }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[9px] tracking-[0.2em] uppercase text-premium-gray mb-1">
          Precio lista
        </p>
        <p className="text-sm font-light text-matte-black tabular-nums">
          {formatPrice(totals.list)}
        </p>
      </div>

      <div className="border-t border-stone/10 pt-4">
        <p className="text-[9px] tracking-[0.2em] uppercase text-matte-black/70 mb-1">
          Transferencia{totals.transferPercent != null ? ` · ${totals.transferPercent}%` : ""}
        </p>
        <p className="text-sm font-light text-matte-black tabular-nums">
          {formatPrice(totals.transfer)}
        </p>
        <p className="text-[10px] text-premium-gold mt-1">
          Ahorrás {formatPrice(totals.savingsTransfer)}
        </p>
      </div>

      <div className="border-t border-stone/10 pt-4">
        <p className="text-[9px] tracking-[0.2em] uppercase text-matte-black mb-1">
          Efectivo{totals.cashPercent != null ? ` · ${totals.cashPercent}%` : ""}
        </p>
        <p className="text-base font-light text-matte-black tracking-tight tabular-nums">
          {formatPrice(totals.cash)}
        </p>
        <p className="text-[10px] text-premium-gold mt-1">
          Ahorrás {formatPrice(totals.savingsCash)}
        </p>
      </div>

      <div className="border-t border-stone/10 pt-4">
        <p className="text-[9px] tracking-[0.2em] uppercase text-matte-black/60 mb-1">
          Ahorro total
        </p>
        <p className="text-xs text-matte-black/55 leading-relaxed">
          Transferencia:{" "}
          <span className="text-premium-gold tabular-nums">
            {formatPrice(totals.savingsTransfer)}
          </span>
        </p>
        <p className="text-xs text-matte-black/55 leading-relaxed mt-0.5">
          Efectivo:{" "}
          <span className="text-premium-gold tabular-nums">
            {formatPrice(totals.savingsCash)}
          </span>
        </p>
      </div>
    </div>
  );
}

export function CartTotalsSummary({ items }: CartTotalsSummaryProps) {
  const totals = calculateCartTotals(items);
  return <CartDrawerBreakdown totals={totals} />;
}

export function useCartTotals(items: CartItem[]): CartTotals {
  return calculateCartTotals(items);
}

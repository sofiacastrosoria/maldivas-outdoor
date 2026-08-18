"use client";

import { formatDiscountLabel, getGlobalDiscountRates } from "@/lib/discounts/runtime";

interface ProductImageContainerProps {
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

/** Height follows the image — no fixed aspect, no dark fill */
const shellClass = "relative w-full block";

export function ProductImageContainer({
  children,
  onClick,
  clickable = false,
}: ProductImageContainerProps) {
  if (!clickable) {
    return <div className={shellClass}>{children}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${shellClass} cursor-zoom-in text-left`}
      aria-label="Ampliar imagen"
    >
      {children}
    </button>
  );
}

export function PremiumImageFooter() {
  const rates = getGlobalDiscountRates();
  return (
    <div className="mt-5 space-y-1.5 border-t border-stone/20 pt-4">
      <p className="text-[11px] tracking-wide text-matte-black/45">
        Los precios son estimativos y pueden variar.
      </p>
      <p className="text-[11px] tracking-wide text-matte-black/65">
        {formatDiscountLabel(rates.cashPercent) || "Precio"} contado efectivo
      </p>
    </div>
  );
}

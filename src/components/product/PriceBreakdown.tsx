import { formatPrice, type PriceBreakdown as PriceBreakdownType } from "@/lib/pricing";

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  compact?: boolean;
}

export function PriceBreakdown({ breakdown, compact = false }: PriceBreakdownProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div>
          <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
            Precio de Lista
          </p>
          <p className="text-base font-light text-matte-black/65 mt-0.5">
            {formatPrice(breakdown.list)}
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
            Precio en Efectivo
          </p>
          <p className="text-2xl font-light text-matte-black tracking-tight mt-0.5">
            {formatPrice(breakdown.cash)}
          </p>
          <p className="text-xs text-premium-gold tracking-wide mt-0.5">
            30% OFF en efectivo
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
            Precio en Transferencia
          </p>
          <p className="text-lg font-light text-matte-black/80 mt-0.5">
            {formatPrice(breakdown.transfer)}
          </p>
          <p className="text-[10px] text-premium-gray mt-0.5">
            15% OFF en transferencia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
          Precio de Lista
        </p>
        <p className="text-lg md:text-xl font-light text-matte-black/65 tracking-tight mt-1">
          {formatPrice(breakdown.list)}
        </p>
      </div>
      <div>
        <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
          Precio en Efectivo
        </p>
        <p className="text-3xl md:text-4xl font-light text-matte-black tracking-tight mt-1">
          {formatPrice(breakdown.cash)}
        </p>
        <p className="text-xs text-premium-gold tracking-wide mt-1">
          30% OFF en efectivo
        </p>
      </div>
      <div>
        <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
          Precio en Transferencia
        </p>
        <p className="text-xl md:text-2xl font-light text-matte-black/80 tracking-tight mt-1">
          {formatPrice(breakdown.transfer)}
        </p>
        <p className="text-[10px] text-premium-gray mt-1">
          15% OFF en transferencia
        </p>
      </div>
    </div>
  );
}

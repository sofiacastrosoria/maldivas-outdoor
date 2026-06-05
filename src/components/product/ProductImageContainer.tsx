"use client";

interface ProductImageContainerProps {
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

const shellClass =
  "relative w-full overflow-hidden rounded-none bg-sand/10 min-h-[45vh] sm:min-h-[50vh] lg:max-h-[78vh] lg:aspect-[506/391] lg:min-h-0";

export function ProductImageContainer({
  children,
  onClick,
  clickable = false,
}: ProductImageContainerProps) {
  const inner = (
    <div className="absolute inset-0 flex items-center justify-center">
      {children}
    </div>
  );

  if (!clickable) {
    return <div className={shellClass}>{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${shellClass} block w-full cursor-zoom-in text-left`}
      aria-label="Ampliar imagen"
    >
      {inner}
    </button>
  );
}

export function PremiumImageFooter() {
  return (
    <div className="mt-5 space-y-1.5 border-t border-stone/20 pt-4">
      <p className="text-[11px] tracking-wide text-matte-black/45">
        Los precios son estimativos y pueden variar.
      </p>
      <p className="text-[11px] tracking-wide text-matte-black/65">
        30% OFF contado efectivo
      </p>
    </div>
  );
}

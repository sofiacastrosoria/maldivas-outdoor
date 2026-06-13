const BENEFITS = [
  "Envíos a todo el país",
  "Fabricación propia",
  "Materiales premium",
] as const;

export function ProductBenefits() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      {BENEFITS.map((text) => (
        <li
          key={text}
          className="flex items-center gap-2.5 text-[12px] text-premium-gray tracking-wide"
        >
          <span
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-premium-gold/40 text-premium-gold text-[10px]"
            aria-hidden
          >
            ✓
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
}

/** Reservado para futura paleta de colores — sin datos cargados */
export function MaterialColorPaletteSlot({ brand }: { brand: string }) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-premium-border/50 bg-ivory px-4 py-5">
      <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-3">
        Paleta de colores
      </p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`${brand}-swatch-${i}`}
            className="h-7 w-7 rounded-full border border-premium-border/40 bg-sand/20"
            aria-hidden
          />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-matte-black/35">
        Estructura preparada para cargar colores de {brand}.
      </p>
    </div>
  );
}

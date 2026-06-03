"use client";

/**
 * Desktop (md+): 55fr / 45fr side-by-side with 40px gap.
 * Uses fr (not %) so gap never forces the second column to wrap below.
 * Mobile: single column unchanged.
 */
export function ProductConfiguratorContainer({
  image,
  panel,
}: {
  image: React.ReactNode;
  panel: React.ReactNode;
}) {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-10 md:grid-cols-[55fr_45fr] md:gap-10">
      <aside
        className="min-w-0 md:sticky md:top-[100px] md:h-fit md:self-start"
        aria-label="Vista del producto"
      >
        {image}
      </aside>

      <div
        className="min-w-0 md:max-h-[calc(100vh-100px)] md:overflow-y-auto md:overscroll-contain md:pr-1"
        aria-label="Personalización del producto"
      >
        {panel}
      </div>
    </div>
  );
}

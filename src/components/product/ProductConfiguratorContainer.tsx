"use client";

/**
 * Desktop: two independent columns (55/45). Image left stays sticky; options scroll alone.
 * Mobile: stacked (image top, options below).
 */
export function ProductConfiguratorContainer({
  imagePanel,
  optionsPanel,
}: {
  imagePanel: React.ReactNode;
  optionsPanel: React.ReactNode;
}) {
  return (
    <div className="product-configurator-grid w-full grid grid-cols-1 gap-10 min-[1024px]:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] min-[1024px]:items-start min-[1024px]:gap-10">
      <aside
        className="product-configurator-image-panel min-w-0 w-full min-[1024px]:sticky min-[1024px]:top-[100px] min-[1024px]:h-fit min-[1024px]:self-start"
        aria-label="Vista del producto"
      >
        {imagePanel}
      </aside>

      <div
        className="product-configurator-options-panel min-w-0 w-full min-[1024px]:max-h-[calc(100vh-100px)] min-[1024px]:overflow-y-auto min-[1024px]:overscroll-contain min-[1024px]:pr-2"
        aria-label="Personalización del producto"
      >
        {optionsPanel}
      </div>
    </div>
  );
}

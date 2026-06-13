"use client";

import { useState, useEffect } from "react";
import { Playfair_Display } from "next/font/google";
import type { Product } from "@/types";
import { formatPrice, buildConfigSummary, calculatePrice } from "@/lib/pricing";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
import { getProductTypeLabel } from "@/lib/productDisplay";
import type { FabricTypeId } from "@/lib/premiumSwatches";
import { resolveVariantImage } from "@/lib/resolveImage";
import { openWhatsApp } from "@/lib/whatsapp";
import { useVariantConfig } from "@/hooks/useVariantConfig";
import { useCart } from "@/context/CartContext";
import { PremiumBreadcrumb } from "./PremiumBreadcrumb";
import { ConfiguratorImage } from "./ConfiguratorImage";
import { VariantThumbnails } from "./VariantThumbnails";
import { VariantSelector } from "./VariantSelector";
import { FullscreenImageModal } from "./FullscreenImageModal";
import { ProductBenefits } from "./ProductBenefits";
import { ProductAccordions } from "./ProductAccordions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
});

interface ProductDetailProps {
  product: Product;
  backHref: string;
  backLabel: string;
}

function buildQuoteMessage(
  product: Product,
  config: ReturnType<typeof useVariantConfig>["config"],
  price: number
): string {
  const summary = buildConfigSummary(product, config);
  return [
    "Hola Maldivas Outdoor.",
    `Quiero solicitar una cotización para ${product.name}.`,
    "",
    ...summary.map((line) => `- ${line}`),
    "",
    `Precio estimado: ${formatPrice(price)}`,
    "",
    "Muchas gracias.",
  ].join("\n");
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { config, updateConfig } = useVariantConfig(product);
  const { addItem } = useCart();
  const [tableIndex, setTableIndex] = useState<TableImageIndex>(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [fabricType, setFabricType] = useState<FabricTypeId>("sunbrella");
  const isTable = isTableProduct(product);

  const price = calculatePrice(product, config);
  const selectedSize = product.sizes.find((s) => s.id === config.sizeId);
  const displayDimensions =
    config.customDimensions || selectedSize?.dimensions || "";

  const handleAddToCart = () => {
    const summary = buildConfigSummary(product, config);
    const image = resolveVariantImage(product, config, tableIndex);
    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      slug: product.slug,
      image,
      config,
      configSummary: summary,
      unitPrice: price,
    });
  };

  const handleQuote = () => {
    openWhatsApp(buildQuoteMessage(product, config, price));
  };

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={`${playfair.variable} fixed left-0 right-0 bottom-0 flex flex-col overflow-hidden bg-ivory z-30`}
      style={{ top: "var(--header-vh)" }}
    >
      {/* —— Foto fija 33% — nunca hace scroll —— */}
      <section
        className="flex-shrink-0 flex flex-col border-b border-premium-border bg-ivory px-4 sm:px-6 md:px-10"
        style={{
          height: "var(--config-image-vh)",
          minHeight: "140px",
          maxHeight: "min(33dvh, 300px)",
        }}
        aria-label="Vista del producto"
      >
        <div className="flex-1 min-h-0 py-2 flex items-center justify-center">
          <ConfiguratorImage
            product={product}
            config={config}
            tableIndex={tableIndex}
            alt={product.name}
            priority
            compact
            onClick={() => setZoomOpen(true)}
          />
        </div>
        <VariantThumbnails
          product={product}
          config={config}
          tableIndex={tableIndex}
          onConfigChange={updateConfig}
          onTableIndexChange={setTableIndex}
        />
      </section>

      {/* —— Panel personalización 60% — único scroll —— */}
      <section
        className="flex-shrink-0 overflow-y-auto overscroll-y-contain min-h-0"
        style={{ height: "var(--config-panel-vh)" }}
        aria-label="Personalización del producto"
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-10 py-5 md:py-6 space-y-5">
          <header className="space-y-1.5">
            <PremiumBreadcrumb product={product} />
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-matte-black uppercase">
              {product.name}
            </h1>
            <p className="text-xs text-premium-gray tracking-wide">
              {getProductTypeLabel(product)}
            </p>
            {displayDimensions && (
              <p className="text-xs text-matte-black/80 tracking-wide">
                {displayDimensions}
              </p>
            )}
          </header>

          <h2 className="font-serif text-xl md:text-2xl text-matte-black tracking-tight pt-1">
            Personalizá tu producto
          </h2>

          <VariantSelector
            product={product}
            config={config}
            onChange={updateConfig}
            fabricType={fabricType}
            onFabricTypeChange={setFabricType}
          />

          <section className="pt-4 border-t border-premium-border space-y-1.5">
            <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
              Precio estimativo
            </p>
            <p className="text-3xl md:text-4xl font-light text-matte-black tracking-tight">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-premium-gold tracking-wide">
              30% OFF contado efectivo
            </p>
            <p className="text-[10px] text-premium-gray">
              Los precios son estimativos y pueden variar.
            </p>
          </section>

          <section className="space-y-2.5">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full rounded-lg bg-matte-black text-white py-3.5 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-all duration-500"
            >
              Agregar al carrito
            </button>
            <button
              type="button"
              onClick={handleQuote}
              className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-matte-black bg-white text-matte-black py-3.5 text-xs tracking-luxury uppercase hover:bg-matte-black/[0.03] transition-all duration-500"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Solicitar cotización
            </button>
          </section>

          <ProductBenefits />
          <ProductAccordions product={product} />
          <div className="h-6" aria-hidden />
        </div>
      </section>

      <FullscreenImageModal
        isOpen={zoomOpen}
        src={resolveVariantImage(
          product,
          config,
          isTable ? tableIndex : undefined
        )}
        alt={product.name}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  );
}

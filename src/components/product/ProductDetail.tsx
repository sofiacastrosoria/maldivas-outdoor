"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import type { Product } from "@/types";
import { formatPrice, buildConfigSummary, calculatePriceBreakdown } from "@/lib/pricing";
import { PriceBreakdown } from "./PriceBreakdown";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
import { getProductTypeLabel } from "@/lib/productDisplay";
import type { FabricTypeId } from "@/lib/premiumSwatches";
import { resolveVariantImage } from "@/lib/resolveImage";
import { toNextImageSrc } from "@/lib/imageManifest";
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
import {
  usesComedorVariantImages,
} from "@/lib/comedorImages";

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

/** Degradado inferior ~2.5% — solo reposeras y living (no mesas ni comedor) */
const CONFIGURATOR_IMAGE_FADE =
  "linear-gradient(to bottom, rgba(248,246,242,0) 0%, rgba(248,246,242,1) 100%)";

function showConfiguratorImageFade(category: Product["category"]): boolean {
  return category === "reposeras" || category === "living";
}

function ConfiguratorImageBottomFade({ product }: { product: Product }) {
  if (!showConfiguratorImageFade(product.category)) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1]"
      style={{
        height: "2.5%",
        background: CONFIGURATOR_IMAGE_FADE,
      }}
      aria-hidden
    />
  );
}

function buildQuoteMessage(
  product: Product,
  config: ReturnType<typeof useVariantConfig>["config"],
  breakdown: NonNullable<ReturnType<typeof calculatePriceBreakdown>>
): string {
  const summary = buildConfigSummary(product, config);
  return [
    "Hola Maldivas Outdoor.",
    `Quiero solicitar una cotización para ${product.name}.`,
    "",
    ...summary.map((line) => `- ${line}`),
    "",
    `Precio de lista: ${formatPrice(breakdown.list)}`,
    `Precio en efectivo (30% OFF): ${formatPrice(breakdown.cash)}`,
    `Precio en transferencia (15% OFF): ${formatPrice(breakdown.transfer)}`,
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
  const isLegacyTableGallery = isTableProduct(product);
  const isComedorConfigurator = usesComedorVariantImages(product);

  const priceBreakdown = calculatePriceBreakdown(product, config);
  const selectedSize = product.sizes.find((s) => s.id === config.sizeId);
  const displayDimensions =
    config.customDimensions || selectedSize?.dimensions || "";

  const handleAddToCart = () => {
    if (!priceBreakdown) return;
    const summary = buildConfigSummary(product, config);
    const image = resolveVariantImage(
      product,
      config,
      isLegacyTableGallery ? tableIndex : undefined
    );
    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      slug: product.slug,
      image,
      config,
      configSummary: summary,
      unitPrice: priceBreakdown.list,
    });
  };

  const handleQuote = () => {
    if (!priceBreakdown) return;
    openWhatsApp(buildQuoteMessage(product, config, priceBreakdown));
  };

  // Lock page scroll only on mobile — desktop uses normal page flow
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches
    )
      return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  // Resolved image for desktop direct rendering
  const desktopImageSrc = resolveVariantImage(
    product,
    config,
    isLegacyTableGallery ? tableIndex : undefined
  );

  // Shared configurator content (used in both layouts)
  const configuratorContent = (
    <div className="space-y-5">
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

      <section className="pt-4 border-t border-premium-border">
        {priceBreakdown ? (
          <PriceBreakdown breakdown={priceBreakdown} />
        ) : (
          <div className="space-y-1.5">
            <p className="text-[10px] tracking-luxury uppercase text-premium-gray">
              Precio
            </p>
            <p className="text-xl font-light text-matte-black tracking-tight">
              Consultar precio
            </p>
            <p className="text-[10px] text-premium-gray">
              Coordiná con nuestro equipo para una cotización personalizada.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-2.5">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!priceBreakdown}
          className="w-full rounded-lg bg-matte-black text-white py-3.5 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-all duration-500 disabled:opacity-40 disabled:hover:bg-matte-black"
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
  );

  return (
    <>
      {/* ═══════════════════════════════════════════
          MOBILE — panel fijo viewport (sin cambios)
          ═══════════════════════════════════════════ */}
      <div
        className={`${playfair.variable} md:hidden fixed left-0 right-0 bottom-0 flex flex-col overflow-hidden bg-ivory z-30`}
        style={{ top: "var(--header-vh)" }}
      >
        {/* Imagen fija */}
        <section
          className="configurator-gallery-surface relative z-10 flex flex-shrink-0 flex-col overflow-hidden bg-ivory px-0 pt-0 pb-0 sm:px-4 sm:pt-2 sm:pb-2"
          style={
            isComedorConfigurator
              ? undefined
              : {
                  height: "var(--config-image-vh)",
                  minHeight: "168px",
                  maxHeight: "min(42dvh, 380px)",
                }
          }
          aria-label="Vista del producto"
        >
          <div
            className={
              isComedorConfigurator
                ? "configurator-gallery-surface relative w-full overflow-hidden bg-ivory"
                : "configurator-gallery-surface relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-ivory"
            }
          >
            <ConfiguratorImage
              product={product}
              config={config}
              tableIndex={isLegacyTableGallery ? tableIndex : undefined}
              alt={product.name}
              priority
              compact
              onClick={() => setZoomOpen(true)}
            />
            <ConfiguratorImageBottomFade product={product} />
          </div>
          <VariantThumbnails
            product={product}
            config={config}
            tableIndex={tableIndex}
            onConfigChange={updateConfig}
            onTableIndexChange={setTableIndex}
          />
        </section>

        {/* Panel personalización */}
        <section
          className="flex-shrink-0 overflow-y-auto overscroll-y-contain min-h-0 bg-ivory"
          style={{ height: "var(--config-panel-vh)" }}
          aria-label="Personalización del producto"
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-6 py-5 space-y-5">
            {configuratorContent}
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP — página normal, scroll libre, composición premium
          ═══════════════════════════════════════════════════════ */}
      <div
        className={`${playfair.variable} hidden md:block bg-ivory`}
        aria-label="Página de producto"
      >
        {/* Zona imagen: centrada, aire lateral, proporción preservada */}
        <div className="bg-ivory px-10 pt-8 pb-4 lg:px-20 xl:px-28">
          <div className="mx-auto max-w-[1120px]">
            {isComedorConfigurator ? (
              <ConfiguratorImage
                product={product}
                config={config}
                alt={product.name}
                priority
                onClick={() => setZoomOpen(true)}
              />
            ) : (
              <div
                className="relative w-full aspect-[2/1] cursor-zoom-in overflow-hidden rounded-2xl"
                onClick={() => setZoomOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Ampliar imagen"
                onKeyDown={(e) => e.key === "Enter" && setZoomOpen(true)}
              >
                <Image
                  key={toNextImageSrc(desktopImageSrc)}
                  src={toNextImageSrc(desktopImageSrc)}
                  alt={product.name}
                  fill
                  className="object-contain transition-opacity duration-500"
                  sizes="(min-width: 1280px) 1120px, (min-width: 1024px) calc(100vw - 10rem), calc(100vw - 5rem)"
                  priority
                />
                <ConfiguratorImageBottomFade product={product} />
              </div>
            )}

            {/* Miniaturas: centradas, ligeramente más grandes en desktop */}
            <VariantThumbnails
              product={product}
              config={config}
              tableIndex={tableIndex}
              onConfigChange={updateConfig}
              onTableIndexChange={setTableIndex}
            />
          </div>
        </div>

        {/* Divider editorial */}
        <div className="mx-auto max-w-[640px] border-t border-premium-border/50 my-10 px-4" />

        {/* Configurador: columna estrecha y centrada */}
        <div className="mx-auto max-w-[640px] px-6 pb-24 lg:px-0">
          {configuratorContent}
        </div>
      </div>

      {/* Modal zoom — compartido entre mobile y desktop */}
      <FullscreenImageModal
        isOpen={zoomOpen}
        src={desktopImageSrc}
        alt={product.name}
        onClose={() => setZoomOpen(false)}
      />
    </>
  );
}

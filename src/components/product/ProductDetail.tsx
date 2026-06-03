"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice, buildConfigSummary, calculatePrice } from "@/lib/pricing";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
import { resolveVariantImage } from "@/lib/resolveImage";
import { useVariantConfig } from "@/hooks/useVariantConfig";
import { useCart } from "@/context/CartContext";
import { DynamicProductImage } from "./DynamicProductImage";
import { VariantSelector } from "./VariantSelector";
import { FullscreenImageModal } from "./FullscreenImageModal";
import { ManualTableGallery } from "./ManualTableGallery";
import {
  PremiumImageFooter,
  ProductImageContainer,
} from "./ProductImageContainer";

interface ProductDetailProps {
  product: Product;
  backHref: string;
  backLabel: string;
}

function ProductImagePanel({
  product,
  config,
  isTable,
  tableIndex,
  onTableImageChange,
  onZoom,
}: {
  product: Product;
  config: ReturnType<typeof useVariantConfig>["config"];
  isTable: boolean;
  tableIndex: TableImageIndex;
  onTableImageChange: (idx: TableImageIndex) => void;
  onZoom: () => void;
}) {
  if (isTable) {
    return (
      <>
        <ManualTableGallery
          product={product}
          onImageChange={onTableImageChange}
        />
        <PremiumImageFooter />
      </>
    );
  }

  return (
    <>
      <ProductImageContainer clickable onClick={onZoom}>
        <DynamicProductImage
          product={product}
          config={config}
          alt={product.name}
          priority
          sizes="(max-width:1024px) 100vw, 55vw"
          imageClassName="object-contain object-center"
        />
      </ProductImageContainer>
      <PremiumImageFooter />
    </>
  );
}

function ProductCustomizationPanel({
  product,
  config,
  onConfigChange,
  onAddToCart,
}: {
  product: Product;
  config: ReturnType<typeof useVariantConfig>["config"];
  onConfigChange: ReturnType<typeof useVariantConfig>["updateConfig"];
  onAddToCart: () => void;
}) {
  return (
    <>
      <p className="text-[10px] tracking-luxury uppercase text-matte-black/40">
        {product.category}
      </p>
      <h1 className="text-4xl md:text-5xl font-extralight tracking-tight mt-2">
        {product.name}
      </h1>
      <p className="text-2xl font-light mt-6 text-matte-black/80">
        desde {formatPrice(product.basePrice)}
      </p>
      <p className="text-sm text-matte-black/55 leading-relaxed mt-6 max-w-md">
        {product.description}
      </p>

      <div className="mt-10 pt-10 border-t border-stone/15">
        <VariantSelector
          product={product}
          config={config}
          onChange={onConfigChange}
        />
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        className="w-full mt-10 bg-matte-black text-white py-4 text-xs tracking-luxury uppercase hover:bg-matte-black/90 transition-colors duration-500"
      >
        Agregar al carrito
      </button>
    </>
  );
}

export function ProductDetail({
  product,
  backHref,
  backLabel,
}: ProductDetailProps) {
  const { config, updateConfig } = useVariantConfig(product);
  const { addItem } = useCart();
  const [tableIndex, setTableIndex] = useState<TableImageIndex>(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const isTable = isTableProduct(product);

  const handleAddToCart = () => {
    const summary = buildConfigSummary(product, config);
    const price = calculatePrice(product, config);
    const image = resolveVariantImage(product, config, tableIndex);
    if (process.env.NEXT_PUBLIC_IMAGE_DEBUG === "1") {
      console.log("Searching image:", image);
    }
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

  const imagePanel = (
    <ProductImagePanel
      product={product}
      config={config}
      isTable={isTable}
      tableIndex={tableIndex}
      onTableImageChange={setTableIndex}
      onZoom={() => setZoomOpen(true)}
    />
  );

  const customizationPanel = (
    <ProductCustomizationPanel
      product={product}
      config={config}
      onConfigChange={updateConfig}
      onAddToCart={handleAddToCart}
    />
  );

  return (
    <div className="pt-24 pb-32">
      <div className="px-6 md:px-12 mb-8">
        <Link
          href={backHref}
          className="text-xs tracking-wide text-matte-black/40 hover:text-matte-black transition-colors"
        >
          ← {backLabel}
        </Link>
      </div>

      <div
        className="grid grid-cols-[55%_45%] gap-10 items-start min-h-screen px-6 md:px-12 w-full"
        style={{ display: "grid", gridTemplateColumns: "55% 45%" }}
      >
        <div className="sticky top-24 self-start h-fit min-w-0">
          {imagePanel}
        </div>

        <div className="min-w-0">
          {customizationPanel}
        </div>
      </div>

      {!isTable && (
        <FullscreenImageModal
          isOpen={zoomOpen}
          src={resolveVariantImage(product, config)}
          alt={product.name}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
}

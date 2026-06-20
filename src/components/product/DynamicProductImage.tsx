"use client";

import { useState, useEffect, useMemo } from "react";
import type { Product, ProductConfig } from "@/types";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import { fallbackPlaceholder, getConfiguratorCandidates } from "@/lib/resolveImage";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface DynamicProductImageProps {
  product: Product;
  config?: ProductConfig;
  tableIndex?: TableImageIndex;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Cap height in fixed hero (e.g. "42vh") — keeps photo in viewport */
  imageMaxHeight?: string;
}

export function DynamicProductImage({
  product,
  config,
  tableIndex = 1,
  alt,
  sizes = IMAGE_SIZES.configurator,
  priority = false,
  className = "",
  imageMaxHeight,
}: DynamicProductImageProps) {
  const candidates = useMemo(
    () => getConfiguratorCandidates(product, config, tableIndex),
    [product, config, tableIndex]
  );

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const diskPlaceholder = useMemo(
    () => fallbackPlaceholder(product, config, tableIndex),
    [product, config, tableIndex]
  );
  const src = candidates[candidateIndex] ?? candidates[0] ?? diskPlaceholder;

  const candidatesKey = useMemo(() => candidates.join("|"), [candidates]);
  useEffect(() => {
    setCandidateIndex(0);
    setFailed(false);
  }, [candidatesKey]);

  const handleError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((i) => i + 1);
      return;
    }
    if (src !== diskPlaceholder) {
      setCandidateIndex(0);
      setFailed(false);
      return;
    }
    setFailed(true);
  };

  const imageAlt =
    alt ??
    (isTableProduct(product)
      ? `${product.name} — ${tableIndex}`
      : `${product.name} — ${config?.sizeId ?? ""} ${config?.structureId ?? ""} ${config?.fabricId ?? ""}`.trim());

  if (failed || !src) {
    return (
      <div className={`relative w-full min-h-[200px] ${className}`}>
        <ImagePlaceholder />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`} aria-hidden={false}>
      <IntrinsicImage
        key={src}
        src={src}
        alt={imageAlt}
        sizes={sizes}
        priority={priority}
        className="configurator-product-float"
        onError={handleError}
        style={imageMaxHeight ? { maxHeight: imageMaxHeight } : undefined}
      />
    </div>
  );
}

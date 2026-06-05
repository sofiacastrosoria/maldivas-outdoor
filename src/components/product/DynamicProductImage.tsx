"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type { Product, ProductConfig } from "@/types";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
import { IMAGE_CONTAIN } from "@/lib/responsiveImage";
import { fallbackPlaceholder, getConfiguratorCandidates } from "@/lib/resolveImage";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface DynamicProductImageProps {
  product: Product;
  config?: ProductConfig;
  tableIndex?: TableImageIndex;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

export function DynamicProductImage({
  product,
  config,
  tableIndex = 1,
  alt,
  sizes = "50vw",
  priority = false,
  className = "",
  imageClassName = IMAGE_CONTAIN,
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

  useEffect(() => {
    if (src) {
      console.log("Image rendered:", src);
    }
  }, [src]);

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

  const imageClass = `${imageClassName} z-10`;

  return (
    <div
      className={`relative w-full lg:absolute lg:inset-0 z-0 overflow-hidden flex items-center justify-center ${className}`}
      aria-hidden={false}
    >
      {!failed && src ? (
        <>
          <Image
            key={`${src}-mobile`}
            src={src}
            alt={imageAlt}
            width={1200}
            height={900}
            sizes={sizes}
            priority={priority}
            className={`w-full h-auto max-h-[80vh] ${imageClass} lg:hidden`}
            style={{ width: "100%", height: "auto" }}
            onError={handleError}
            unoptimized
          />
          <Image
            key={`${src}-desktop`}
            src={src}
            alt={imageAlt}
            fill
            sizes={sizes}
            priority={priority}
            className={`hidden lg:block ${imageClass} opacity-100 visible`}
            style={{ opacity: 1, visibility: "visible" }}
            onError={handleError}
            unoptimized
          />
        </>
      ) : (
        <div className="absolute inset-0 z-0">
          <ImagePlaceholder />
        </div>
      )}
    </div>
  );
}

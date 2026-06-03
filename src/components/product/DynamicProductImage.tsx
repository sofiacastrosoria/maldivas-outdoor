"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type { Product, ProductConfig } from "@/types";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
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
  imageClassName = "object-contain",
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

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden={false}
    >
      {!failed && src ? (
        <Image
          key={src}
          src={src}
          alt={imageAlt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${imageClassName} object-center opacity-100 visible z-10`}
          style={{ opacity: 1, visibility: "visible" }}
          onError={handleError}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 z-0">
          <ImagePlaceholder />
        </div>
      )}
    </div>
  );
}

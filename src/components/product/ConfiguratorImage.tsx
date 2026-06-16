"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import type { Product, ProductConfig } from "@/types";
import { isTableProduct, type TableImageIndex } from "@/lib/images";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import {
  fallbackPlaceholder,
  getConfiguratorCandidates,
} from "@/lib/resolveImage";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface ConfiguratorImageProps {
  product: Product;
  config?: ProductConfig;
  tableIndex?: TableImageIndex;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  /** Fills parent height (33vh zone) instead of standalone aspect box */
  compact?: boolean;
}

export function ConfiguratorImage({
  product,
  config,
  tableIndex = 1,
  alt,
  onClick,
  priority = false,
  compact = false,
}: ConfiguratorImageProps) {
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
      : `${product.name} — configuración`);

  const shell = (
    <div
      className={`relative w-full overflow-hidden bg-white border border-premium-border rounded-lg ${
        compact
          ? "h-full min-h-0 max-h-full mx-auto max-w-3xl"
          : "aspect-[7/5] rounded-xl shadow-[0_2px_24px_-8px_rgba(26,26,26,0.06)]"
      }`}
    >
      {!failed && src ? (
        <Image
          key={src}
          src={src}
          alt={imageAlt}
          fill
          sizes={IMAGE_SIZES.configurator}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-contain object-center"
          onError={handleError}
        />
      ) : (
        <ImagePlaceholder />
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`block w-full cursor-zoom-in text-left ${compact ? "h-full" : ""}`}
        aria-label="Ampliar imagen"
      >
        {shell}
      </button>
    );
  }

  return shell;
}

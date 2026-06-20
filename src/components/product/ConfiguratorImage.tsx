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
import {
  INTRINSIC_HEIGHT,
  INTRINSIC_WIDTH,
} from "@/components/ui/IntrinsicImage";
import { IMAGE_BORDER_RADIUS } from "@/lib/imageStyles";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface ConfiguratorImageProps {
  product: Product;
  config?: ProductConfig;
  tableIndex?: TableImageIndex;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  /** Fills parent height (gallery zone) instead of standalone aspect box */
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
      className={`configurator-gallery-surface relative mx-auto overflow-visible ${
        compact
          ? "flex h-full min-h-0 w-full max-w-none items-center justify-center"
          : "aspect-[7/5] w-full max-w-4xl"
      }`}
    >
      <div className="configurator-gallery-surface flex h-full max-h-full w-full items-center justify-center overflow-hidden">
        <div className="configurator-gallery-surface configurator-product-scale flex w-full items-center justify-center">
          {!failed && src ? (
            <div className="configurator-product-float w-full">
              <Image
                key={src}
                src={src}
                alt={imageAlt}
                width={INTRINSIC_WIDTH}
                height={INTRINSIC_HEIGHT}
                sizes={IMAGE_SIZES.configurator}
                priority={priority}
                loading={priority ? undefined : "lazy"}
                className={`configurator-product-image block h-auto w-full ${IMAGE_BORDER_RADIUS}`}
                style={{ width: "100%", height: "auto" }}
                onError={handleError}
              />
            </div>
          ) : (
            <ImagePlaceholder surface className="h-full min-h-[120px] w-full" />
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`configurator-gallery-surface block w-full cursor-zoom-in text-left ${
          compact ? "h-full" : ""
        }`}
        aria-label="Ampliar imagen"
      >
        {shell}
      </button>
    );
  }

  return shell;
}

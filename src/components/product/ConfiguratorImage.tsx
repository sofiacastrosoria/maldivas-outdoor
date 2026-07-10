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
import {
  COMEDOR_CONFIGURATOR_ASPECT_CLASS,
  COMEDOR_IMAGE_HEIGHT,
  COMEDOR_IMAGE_WIDTH,
  usesComedorVariantImages,
} from "@/lib/comedorImages";
import { toNextImageSrc } from "@/lib/imageManifest";
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

  const isComedorConfigurator = usesComedorVariantImages(product);
  const imageWidth = isComedorConfigurator ? COMEDOR_IMAGE_WIDTH : INTRINSIC_WIDTH;
  const imageHeight = isComedorConfigurator ? COMEDOR_IMAGE_HEIGHT : INTRINSIC_HEIGHT;

  const shellAspectClass = isComedorConfigurator
    ? COMEDOR_CONFIGURATOR_ASPECT_CLASS
    : "aspect-[7/5]";

  const shell = (
    <div
      className={`configurator-gallery-surface relative mx-auto overflow-hidden rounded-2xl ${
        compact
          ? isComedorConfigurator
            ? `${shellAspectClass} w-full max-w-none`
            : "flex h-full min-h-0 w-full max-w-none items-center justify-center"
          : `${shellAspectClass} w-full max-w-4xl`
      }`}
    >
      <div
        className={`configurator-gallery-surface flex w-full items-center justify-center overflow-hidden ${
          compact && !isComedorConfigurator ? "h-full max-h-full" : ""
        }`}
      >
        <div className="configurator-gallery-surface configurator-product-scale flex w-full items-center justify-center">
          {!failed && src ? (
            <div className="configurator-product-float w-full">
              <Image
                key={toNextImageSrc(src)}
                src={toNextImageSrc(src)}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                sizes={IMAGE_SIZES.configurator}
                priority={priority}
                loading={priority ? undefined : "lazy"}
                className="configurator-product-image block h-auto w-full"
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
          compact && !isComedorConfigurator ? "h-full" : ""
        }`}
        aria-label="Ampliar imagen"
      >
        {shell}
      </button>
    );
  }

  return shell;
}

"use client";

import Image from "next/image";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import { COVER_RADIUS } from "@/lib/imageStyles";

/** Formato visual uniforme de portadas — 1400 × 1000 */
export { COVER_RADIUS };
export const PRODUCT_COVER_WIDTH = 1400;
export const PRODUCT_COVER_HEIGHT = 1000;
export const PRODUCT_COVER_ASPECT_CLASS = "aspect-[7/5]" as const;

/** Fuente esperada: 1500 × 900 — más ancha que 7:5 → recorte solo lateral vía cover + center */
export const PRODUCT_COVER_SOURCE_WIDTH = 1500;
export const PRODUCT_COVER_SOURCE_HEIGHT = 900;

interface PremiumProductCoverProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  onError?: () => void;
}

/**
 * Portada premium homogénea para tarjetas de producto.
 * Encuadre 1400×1000 con recorte horizontal simétrico (object-cover + object-center).
 */
export function PremiumProductCover({
  src,
  alt,
  sizes = IMAGE_SIZES.card,
  priority = false,
  className = "",
  onError,
}: PremiumProductCoverProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-ivory ${COVER_RADIUS} ${PRODUCT_COVER_ASPECT_CLASS} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover object-center"
        onError={onError}
      />
    </div>
  );
}

export function PremiumProductCoverSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`w-full animate-pulse bg-sand/15 ${COVER_RADIUS} ${PRODUCT_COVER_ASPECT_CLASS} ${className}`}
      aria-hidden
    />
  );
}

export function PremiumProductCoverPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex w-full items-end bg-sand/10 p-4 md:p-5 ${COVER_RADIUS} ${PRODUCT_COVER_ASPECT_CLASS} ${className}`}
    >
      <p className="text-sm md:text-base font-extralight tracking-tight text-matte-black/80">
        {label}
      </p>
    </div>
  );
}

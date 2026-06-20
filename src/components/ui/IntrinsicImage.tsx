"use client";

import Image from "next/image";
import { IMAGE_BORDER_RADIUS } from "@/lib/imageStyles";

/** 7:5 horizontal — sizing hint for Next.js; real aspect comes from the file */
export const INTRINSIC_WIDTH = 1400;
export const INTRINSIC_HEIGHT = 1000;

interface IntrinsicImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** false solo para excepciones explícitas (ej. hero HOME showroom) */
  rounded?: boolean;
  onError?: () => void;
  onLoad?: () => void;
}

/**
 * Full product photo at natural aspect ratio — w-full, h-auto, no letterboxing.
 * Uses Next.js image optimization (WebP, responsive widths).
 */
export function IntrinsicImage({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = "",
  style,
  rounded = true,
  onError,
  onLoad,
}: IntrinsicImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={INTRINSIC_WIDTH}
      height={INTRINSIC_HEIGHT}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      className={`configurator-product-image block w-full h-auto ${rounded ? IMAGE_BORDER_RADIUS : ""} ${className}`}
      style={{ width: "100%", height: "auto", ...style }}
      onError={onError}
      onLoad={onLoad}
    />
  );
}

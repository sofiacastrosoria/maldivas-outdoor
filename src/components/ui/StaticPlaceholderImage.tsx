"use client";

import { IntrinsicImage } from "./IntrinsicImage";
import { IMAGE_SIZES } from "@/lib/imageSizes";

interface StaticPlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** Filesystem image — natural aspect ratio, no letterboxing */
export function StaticPlaceholderImage({
  src,
  alt,
  className = "",
  priority = false,
}: StaticPlaceholderImageProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <IntrinsicImage
        src={src}
        alt={alt}
        sizes={IMAGE_SIZES.about}
        priority={priority}
      />
    </div>
  );
}

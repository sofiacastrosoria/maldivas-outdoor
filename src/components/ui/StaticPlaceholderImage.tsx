"use client";

import { IntrinsicImage } from "./IntrinsicImage";

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
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  );
}

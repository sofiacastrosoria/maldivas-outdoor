"use client";

import Image from "next/image";
import { IMAGE_CONTAIN } from "@/lib/responsiveImage";

interface StaticPlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** Filesystem image from /public/images — full photo visible on mobile */
export function StaticPlaceholderImage({
  src,
  alt,
  className = "",
  priority = false,
}: StaticPlaceholderImageProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-sand/10 flex items-center justify-center lg:aspect-[506/391] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={900}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={`w-full h-auto max-h-[85vh] ${IMAGE_CONTAIN} lg:absolute lg:inset-0 lg:h-full lg:w-full lg:max-h-none`}
        style={{ width: "100%", height: "auto" }}
        priority={priority}
        unoptimized
      />
    </div>
  );
}

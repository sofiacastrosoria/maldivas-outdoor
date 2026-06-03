"use client";

import Image from "next/image";

interface StaticPlaceholderImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** Filesystem image from /public/images — manually replaceable by filename */
export function StaticPlaceholderImage({
  src,
  alt,
  className = "",
  priority = false,
}: StaticPlaceholderImageProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-black aspect-[506/391] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain object-center"
        priority={priority}
        unoptimized
      />
    </div>
  );
}

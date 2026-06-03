"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

interface CartItemImageProps {
  src: string;
  alt: string;
}

export function CartItemImage({ src, alt }: CartItemImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="relative h-full w-full">
        <ImagePlaceholder />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="80px"
      onError={() => setFailed(true)}
      unoptimized={src.startsWith("/images/")}
    />
  );
}

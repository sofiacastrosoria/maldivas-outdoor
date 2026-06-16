"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGE_SIZES } from "@/lib/imageSizes";
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
      sizes={IMAGE_SIZES.cart}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

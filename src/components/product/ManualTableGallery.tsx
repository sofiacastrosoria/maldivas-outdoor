"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import type { TableImageIndex } from "@/lib/images";
import { resolveVariantImage } from "@/lib/resolveImage";
import { DynamicProductImage } from "./DynamicProductImage";
import { FullscreenImageModal } from "./FullscreenImageModal";
import { ProductImageContainer } from "./ProductImageContainer";

export function ManualTableGallery({
  product,
  onImageChange,
}: {
  product: Product;
  onImageChange?: (index: TableImageIndex) => void;
}) {
  const [active, setActive] = useState<TableImageIndex>(1);
  const [open, setOpen] = useState(false);

  const src = useMemo(
    () => resolveVariantImage(product, undefined, active),
    [product, active]
  );

  return (
    <>
      <ProductImageContainer clickable onClick={() => setOpen(true)}>
        <DynamicProductImage
          product={product}
          tableIndex={active}
          alt={product.name}
          priority
          sizes="100vw"
          imageMaxHeight="42vh"
        />
      </ProductImageContainer>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            const prev = active === 1 ? 3 : ((active - 1) as TableImageIndex);
            setActive(prev);
            onImageChange?.(prev);
          }}
          className="px-4 py-2 text-[10px] tracking-luxury uppercase border border-stone/20 text-matte-black/50 hover:border-matte-black/35 transition-all duration-300"
          aria-label="Imagen anterior"
        >
          ←
        </button>
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              const idx = i as TableImageIndex;
              setActive(idx);
              onImageChange?.(idx);
            }}
            aria-pressed={active === i}
            className={`px-4 py-2 text-[10px] tracking-luxury uppercase border transition-all duration-300 ${
              active === i
                ? "border-matte-black bg-matte-black text-white"
                : "border-stone/20 text-matte-black/50 hover:border-matte-black/35"
            }`}
          >
            {i}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const next = active === 3 ? 1 : ((active + 1) as TableImageIndex);
            setActive(next);
            onImageChange?.(next);
          }}
          className="px-4 py-2 text-[10px] tracking-luxury uppercase border border-stone/20 text-matte-black/50 hover:border-matte-black/35 transition-all duration-300"
          aria-label="Imagen siguiente"
        >
          →
        </button>
      </div>

      <FullscreenImageModal
        isOpen={open}
        src={src}
        alt={product.name}
        onClose={() => setOpen(false)}
      />
    </>
  );
}


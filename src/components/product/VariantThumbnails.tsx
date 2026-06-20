"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { Product, ProductConfig } from "@/types";
import { isTableProduct, TABLE_IMAGE_INDEXES, type TableImageIndex } from "@/lib/images";
import { usesComedorVariantImages } from "@/lib/comedorImages";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import { resolveVariantImage } from "@/lib/resolveImage";

interface ThumbnailItem {
  key: string;
  src: string;
  label: string;
  isActive: boolean;
  onSelect: () => void;
}

interface VariantThumbnailsProps {
  product: Product;
  config: ProductConfig;
  tableIndex: TableImageIndex;
  onConfigChange: (patch: Partial<ProductConfig>) => void;
  onTableIndexChange: (index: TableImageIndex) => void;
}

export function VariantThumbnails({
  product,
  config,
  tableIndex,
  onConfigChange,
  onTableIndexChange,
}: VariantThumbnailsProps) {
  const items = useMemo((): ThumbnailItem[] => {
    if (usesComedorVariantImages(product)) {
      return [];
    }

    if (isTableProduct(product)) {
      return TABLE_IMAGE_INDEXES.map((idx) => ({
        key: `table-${idx}`,
        src: resolveVariantImage(product, config, idx),
        label: String(idx),
        isActive: tableIndex === idx,
        onSelect: () => onTableIndexChange(idx),
      }));
    }

    const thumbs: ThumbnailItem[] = [];

    for (const structure of product.structures) {
      if (structure.id === "estandar") continue;
      const patch = { structureId: structure.id };
      thumbs.push({
        key: `structure-${structure.id}`,
        src: resolveVariantImage(product, { ...config, ...patch }),
        label: structure.label,
        isActive: config.structureId === structure.id,
        onSelect: () => onConfigChange(patch),
      });
    }

    for (const fabric of product.fabrics) {
      const patch = { fabricId: fabric.id };
      thumbs.push({
        key: `fabric-${fabric.id}`,
        src: resolveVariantImage(product, { ...config, ...patch }),
        label: fabric.label,
        isActive: config.fabricId === fabric.id,
        onSelect: () => onConfigChange(patch),
      });
    }

    return thumbs.slice(0, 10);
  }, [product, config, tableIndex, onConfigChange, onTableIndexChange]);

  if (items.length <= 1) return null;

  return (
    <div className="flex flex-shrink-0 gap-2.5 overflow-x-auto px-0.5 pt-2 md:flex-wrap md:justify-center md:overflow-x-visible md:gap-3 md:pt-4 md:px-2">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onSelect}
          aria-pressed={item.isActive}
          title={item.label}
          className={`relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-lg border bg-ivory transition-all duration-300 sm:h-11 sm:w-16 md:h-12 md:w-[4.5rem] ${
            item.isActive
              ? "border-matte-black/80 shadow-[0_1px_6px_rgba(26,26,26,0.08)]"
              : "border-premium-border/50 shadow-[0_1px_3px_rgba(26,26,26,0.04)] hover:border-matte-black/25 opacity-90 hover:opacity-100"
          }`}
        >
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes={IMAGE_SIZES.thumbnail}
            className="configurator-product-image object-contain object-center"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}

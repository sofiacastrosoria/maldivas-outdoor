"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { Product, ProductConfig } from "@/types";
import { isTableProduct, TABLE_IMAGE_INDEXES, type TableImageIndex } from "@/lib/images";
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
    <div className="flex gap-2 overflow-x-auto py-1.5 flex-shrink-0">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onSelect}
          aria-pressed={item.isActive}
          title={item.label}
          className={`relative flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-md overflow-hidden border transition-all duration-300 ${
            item.isActive
              ? "border-matte-black border-2 shadow-sm"
              : "border-premium-border hover:border-matte-black/30 opacity-90 hover:opacity-100"
          }`}
        >
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes="72px"
            className="object-contain object-center bg-ivory"
            unoptimized
          />
        </button>
      ))}
    </div>
  );
}

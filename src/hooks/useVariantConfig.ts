"use client";

import { useCallback, useState } from "react";
import type { Product, ProductConfig } from "@/types";
import {
  defaultMarbellaStoneModel,
  getStoneModelById,
} from "@/data/comedorStone";
import { defaultProductConfig } from "@/lib/images";

function applyConfigPatch(
  product: Product,
  prev: ProductConfig,
  patch: Partial<ProductConfig>
): ProductConfig {
  const next: ProductConfig = { ...prev, ...patch };

  if (product.slug === "marbella" && patch.stoneModel) {
    const model = getStoneModelById(patch.stoneModel);
    if (model) {
      next.stoneBrand = model.brand;
    }
  }

  if (
    product.slug === "marbella" &&
    patch.sizeId &&
    patch.sizeId !== prev.sizeId
  ) {
    const stone = defaultMarbellaStoneModel(patch.sizeId);
    next.stoneBrand = stone.stoneBrand;
    next.stoneModel = stone.stoneModel;
  }

  return next;
}

/** Single source of truth for variant selection — no external sync */
export function useVariantConfig(product: Product) {
  const [config, setConfig] = useState<ProductConfig>(() =>
    defaultProductConfig(product)
  );

  const updateConfig = useCallback(
    (patch: Partial<ProductConfig>) => {
      setConfig((prev) => applyConfigPatch(product, prev, patch));
    },
    [product]
  );

  const resetConfig = useCallback(() => {
    setConfig(defaultProductConfig(product));
  }, [product]);

  return { config, updateConfig, resetConfig, setConfig };
}

export type VariantConfigReturn = ReturnType<typeof useVariantConfig>;

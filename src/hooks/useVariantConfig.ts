"use client";

import { useCallback, useState } from "react";
import type { Product, ProductConfig } from "@/types";
import { defaultProductConfig } from "@/lib/images";

/** Single source of truth for variant selection — no external sync */
export function useVariantConfig(product: Product) {
  const [config, setConfig] = useState<ProductConfig>(() =>
    defaultProductConfig(product)
  );

  const updateConfig = useCallback((patch: Partial<ProductConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultProductConfig(product));
  }, [product]);

  return { config, updateConfig, resetConfig, setConfig };
}

export type VariantConfigReturn = ReturnType<typeof useVariantConfig>;

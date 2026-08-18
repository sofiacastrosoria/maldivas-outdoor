"use client";

import { createContext, useEffect, type ReactNode } from "react";
import { setRuntimePriceCatalog } from "@/lib/prices/catalog";
import type { PriceVariantRow } from "@/lib/prices/types";

const PriceCatalogContext = createContext(false);

export function PriceCatalogProvider({
  initial,
  children,
}: {
  initial: PriceVariantRow[];
  children: ReactNode;
}) {
  setRuntimePriceCatalog(initial.length ? initial : null);

  useEffect(() => {
    setRuntimePriceCatalog(initial.length ? initial : null);
  }, [initial]);

  return (
    <PriceCatalogContext.Provider value={true}>
      {children}
    </PriceCatalogContext.Provider>
  );
}

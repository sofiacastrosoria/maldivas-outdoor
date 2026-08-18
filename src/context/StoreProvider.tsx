"use client";

import { createContext, useEffect, type ReactNode } from "react";
import { setRuntimePriceCatalog } from "@/lib/prices/catalog";
import { setRuntimeDiscounts } from "@/lib/discounts/runtime";
import { setRuntimeCatalog } from "@/lib/catalog/runtime";
import { setRuntimeAvailability, type VariantAvailabilityRow } from "@/lib/catalog/availability";
import type { PriceVariantRow } from "@/lib/prices/types";
import type { DiscountRates, ProductDiscountRow } from "@/lib/discounts/types";
import type { CatalogProductRow, ProductStatusRow } from "@/lib/catalog/types";

const StoreContext = createContext(false);

export function StoreProvider({
  prices,
  discounts,
  catalog,
  children,
}: {
  prices: PriceVariantRow[];
  discounts: { global: DiscountRates; overrides: ProductDiscountRow[] };
  catalog: {
    statuses: ProductStatusRow[];
    customs: CatalogProductRow[];
    availability: VariantAvailabilityRow[];
  };
  children: ReactNode;
}) {
  const apply = () => {
    setRuntimePriceCatalog(prices.length ? prices : null);
    setRuntimeDiscounts(discounts.global, discounts.overrides);
    setRuntimeCatalog(catalog.statuses, catalog.customs);
    setRuntimeAvailability(catalog.availability);
  };

  apply();

  useEffect(() => {
    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, discounts, catalog]);

  return <StoreContext.Provider value={true}>{children}</StoreContext.Provider>;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import {
  PremiumProductCover,
  PremiumProductCoverPlaceholder,
  PremiumProductCoverSkeleton,
  PRODUCT_COVER_ASPECT_CLASS,
} from "./PremiumProductCover";
import { COVER_RADIUS } from "@/lib/imageStyles";
import {
  discoverModelCardVariants,
  getModelCardVariants,
  pickInitialVariantIndex,
  pickNextVariantIndex,
  type ModelCardVariant,
} from "@/lib/modelCardImages";

function preloadSrc(src: string) {
  const img = new window.Image();
  img.src = src;
}

export function ModelVariantSlider({
  product,
  autoplayMs = 6500,
}: {
  product: Product;
  autoplayMs?: number;
}) {
  const [pool, setPool] = useState<ModelCardVariant[]>([]);
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setPool([]);
    setIndex(0);
    setDisplayIndex(0);

    const sync = getModelCardVariants(product);
    if (sync.length > 0) {
      const initial = pickInitialVariantIndex(sync);
      setPool(sync);
      setIndex(initial);
      setDisplayIndex(initial);
      setReady(true);
      const nextIdx = pickNextVariantIndex(sync, initial);
      if (sync[nextIdx]?.url) preloadSrc(sync[nextIdx].url);
      return;
    }

    discoverModelCardVariants(product).then((variants) => {
      if (cancelled) return;
      const initial = pickInitialVariantIndex(variants);
      setPool(variants);
      setIndex(initial);
      setDisplayIndex(initial);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [product]);

  const goTo = useCallback(
    async (next: number) => {
      const target = pool[next];
      if (!target) return;
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = target.url;
      });
      setDisplayIndex(next);
      setIndex(next);
    },
    [pool]
  );

  const advance = useCallback(() => {
    const next = pickNextVariantIndex(pool, index);
    void goTo(next);
  }, [pool, index, goTo]);

  useEffect(() => {
    if (pool.length <= 1) return;
    const timer = setInterval(advance, autoplayMs);
    return () => clearInterval(timer);
  }, [pool.length, autoplayMs, advance]);

  useEffect(() => {
    if (pool.length <= 1) return;
    const nextIdx = pickNextVariantIndex(pool, displayIndex);
    const nextUrl = pool[nextIdx]?.url;
    if (nextUrl) preloadSrc(nextUrl);
  }, [pool, displayIndex]);

  if (!ready) {
    return <PremiumProductCoverSkeleton />;
  }

  const active = pool[displayIndex];

  if (!active) {
    return <PremiumProductCoverPlaceholder label={product.name} />;
  }

  return (
    <div className={`relative w-full ${PRODUCT_COVER_ASPECT_CLASS}`}>
      <motion.div
        key={active.url}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full"
      >
        <PremiumProductCover
          src={active.url}
          alt={product.name}
          priority={displayIndex === 0}
        />
      </motion.div>

      <div className={`pointer-events-none absolute inset-0 ${COVER_RADIUS} bg-gradient-to-t from-matte-black/40 via-transparent to-transparent`} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
        <p className="text-sm md:text-base font-extralight tracking-tight text-white drop-shadow-sm">
          {product.name}
        </p>
      </div>
    </div>
  );
}

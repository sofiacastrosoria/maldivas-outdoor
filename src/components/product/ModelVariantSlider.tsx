"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import { IMAGE_SIZES } from "@/lib/imageSizes";
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
    return (
      <div className="w-full aspect-[7/5] bg-sand/15 animate-pulse" aria-hidden />
    );
  }

  const active = pool[displayIndex];

  if (!active) {
    return (
      <div className="relative w-full flex items-end p-4 md:p-5 min-h-[120px] bg-sand/10 aspect-[7/5]">
        <p className="text-sm md:text-base font-extralight tracking-tight text-matte-black/80">
          {product.name}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-sand/10">
      <motion.div
        key={active.url}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full"
      >
        <IntrinsicImage
          src={active.url}
          alt={product.name}
          sizes={IMAGE_SIZES.card}
          priority={displayIndex === 0}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/40 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 pointer-events-none z-10">
        <p className="text-sm md:text-base font-extralight tracking-tight text-white drop-shadow-sm">
          {product.name}
        </p>
      </div>
    </div>
  );
}

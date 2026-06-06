"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import {
  discoverModelCardVariants,
  pickInitialVariantIndex,
  pickNextVariantIndex,
  type ModelCardVariant,
} from "@/lib/modelCardImages";

function preloadImage(src: string) {
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setPool([]);
    setIndex(0);

    discoverModelCardVariants(product).then((variants) => {
      if (cancelled) return;
      setPool(variants);
      setIndex(pickInitialVariantIndex(variants));
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [product]);

  const advance = useCallback(() => {
    setIndex((current) => pickNextVariantIndex(pool, current));
  }, [pool]);

  useEffect(() => {
    if (pool.length <= 1) return;
    const timer = setInterval(advance, autoplayMs);
    return () => clearInterval(timer);
  }, [pool.length, autoplayMs, advance]);

  const active = pool[index];
  const nextIndex =
    pool.length > 1 ? pickNextVariantIndex(pool, index) : index;
  const nextSrc = pool[nextIndex]?.url;

  useEffect(() => {
    if (nextSrc) preloadImage(nextSrc);
  }, [nextSrc]);

  if (!ready) {
    return <div className="w-full min-h-[120px] bg-sand/15 animate-pulse" />;
  }

  if (!active) {
    return (
      <div className="relative w-full flex items-end p-4 md:p-5 min-h-[120px] bg-sand/10">
        <p className="text-sm md:text-base font-extralight tracking-tight text-matte-black/80">
          {product.name}
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full"
        >
          <IntrinsicImage
            src={active.url}
            alt={product.name}
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/40 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 pointer-events-none z-10">
        <p className="text-sm md:text-base font-extralight tracking-tight text-white drop-shadow-sm">
          {product.name}
        </p>
      </div>
    </div>
  );
}

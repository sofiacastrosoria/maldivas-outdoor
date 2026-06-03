"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types";
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
    return <div className="absolute inset-0 bg-matte-black/5 animate-pulse" />;
  }

  if (!active) {
    return (
      <div className="absolute inset-0 flex items-end bg-matte-black p-4 md:p-5">
        <p className="text-sm md:text-base font-extralight tracking-tight text-white">
          {product.name}
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={active.url}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover object-center"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/45 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 pointer-events-none z-10">
        <p className="text-sm md:text-base font-extralight tracking-tight text-white">
          {product.name}
        </p>
      </div>
    </div>
  );
}

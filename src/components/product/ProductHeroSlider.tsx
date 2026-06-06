"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import { filterExistingHeroSlides } from "./sliderSlides";

export interface HeroSlide {
  src: string;
  label: string;
  href?: string;
}

interface ProductHeroSliderProps {
  slides: HeroSlide[];
  autoplayMs?: number;
  /** @deprecated intrinsic sizing — prop kept for callers */
  aspectClass?: string;
  /** @deprecated intrinsic sizing — prop kept for callers */
  fullscreen?: boolean;
}

function SlideImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) return null;

  return (
    <IntrinsicImage
      src={src}
      alt={alt}
      sizes="100vw"
      priority
      onError={() => setFailed(true)}
    />
  );
}

export function ProductHeroSlider({
  slides,
  autoplayMs = 5500,
  fullscreen = false,
}: ProductHeroSliderProps) {
  const [validSlides, setValidSlides] = useState<HeroSlide[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setValidSlides([]);
    setIndex(0);

    filterExistingHeroSlides(slides).then((filtered) => {
      if (!cancelled) setValidSlides(filtered);
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % validSlides.length);
  }, [validSlides.length]);

  useEffect(() => {
    if (validSlides.length <= 1) return;
    const timer = setInterval(next, autoplayMs);
    return () => clearInterval(timer);
  }, [validSlides.length, autoplayMs, next]);

  if (validSlides.length === 0) return null;

  const slide = validSlides[index];

  const inner = (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.src}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.005 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full"
        >
          <SlideImage src={slide.src} alt={slide.label} />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white z-10 pointer-events-none">
        <p className="text-lg md:text-2xl font-extralight tracking-tight drop-shadow-sm">
          {slide.label}
        </p>
      </div>

      {validSlides.length > 1 && (
        <div className="absolute bottom-8 right-8 md:bottom-10 md:right-10 flex gap-2 z-10">
          {validSlides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-[2px] transition-all duration-500 ${
                i === index ? "w-8 bg-white" : "w-4 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (slide.href) {
    return (
      <Link href={slide.href} className="block group">
        {inner}
      </Link>
    );
  }

  return inner;
}

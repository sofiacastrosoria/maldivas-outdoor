"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import { IMAGE_BORDER_RADIUS } from "@/lib/imageStyles";

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

function preloadSrc(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function ProductHeroSlider({
  slides,
  autoplayMs = 5500,
}: ProductHeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const transitioning = useRef(false);

  const goTo = useCallback(
    async (next: number) => {
      if (slides.length === 0 || transitioning.current) return;
      const target = slides[next];
      if (!target) return;

      transitioning.current = true;
      await preloadSrc(target.src);
      setDisplayIndex(next);
      setIndex(next);
      transitioning.current = false;
    },
    [slides]
  );

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    const n = (index + 1) % slides.length;
    void goTo(n);
  }, [index, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const nextIdx = (displayIndex + 1) % slides.length;
    const nextSrc = slides[nextIdx]?.src;
    if (nextSrc) void preloadSrc(nextSrc);
  }, [displayIndex, slides]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, autoplayMs);
    return () => clearInterval(timer);
  }, [slides.length, autoplayMs, next]);

  useEffect(() => {
    setIndex(0);
    setDisplayIndex(0);
    if (slides[0]?.src) void preloadSrc(slides[0].src);
  }, [slides]);

  if (slides.length === 0) return null;

  const slide = slides[displayIndex];

  const inner = (
    <div className={`relative w-full overflow-hidden bg-sand/10 ${IMAGE_BORDER_RADIUS}`}>
      <motion.div
        key={slide.src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full"
      >
        <IntrinsicImage
          src={slide.src}
          alt={slide.label}
          sizes={IMAGE_SIZES.hero}
          priority={displayIndex === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white z-10 pointer-events-none">
        <p className="text-lg md:text-2xl font-extralight tracking-tight drop-shadow-sm">
          {slide.label}
        </p>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 right-8 md:bottom-10 md:right-10 flex gap-2 z-10">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => void goTo(i)}
              className={`h-[2px] transition-all duration-500 ${
                i === displayIndex ? "w-8 bg-white" : "w-4 bg-white/35 hover:bg-white/60"
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

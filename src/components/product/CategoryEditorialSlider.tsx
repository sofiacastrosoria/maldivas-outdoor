"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  categoryEditorialSlides,
  type SliderCategory,
} from "@/data/editorialSliders";
import {
  editorialSlideFileExists,
  editorialSlideUrl,
} from "./sliderSlides";
import { ProductHeroSlider } from "./ProductHeroSlider";

export function CategoryEditorialSlider({
  category,
  title,
  href,
  ctaLabel = "VER PRODUCTOS",
  showDivider = false,
}: {
  category: SliderCategory;
  title: string;
  href: string;
  ctaLabel?: string;
  showDivider?: boolean;
}) {
  const slides = useMemo(
    () =>
      categoryEditorialSlides[category]
        .filter((s) => editorialSlideFileExists(category, s.file))
        .map((s) => ({
          src: editorialSlideUrl(category, s.file),
          label: s.label,
          href: s.href,
        })),
    [category]
  );

  return (
    <section
      className={showDivider ? "border-t border-premium-border/60 pt-10 md:pt-14" : ""}
    >
      <div className="text-center px-6 md:px-12 pb-6 md:pb-8">
        <h2 className="text-xl md:text-3xl font-extralight tracking-luxury uppercase text-matte-black">
          {title}
        </h2>
      </div>

      <div className="relative">
        <ProductHeroSlider slides={slides} autoplayMs={7500} fullscreen />
      </div>

      <div className="flex justify-center py-8 md:py-10 px-6">
        <Link
          href={href}
          className="text-xs tracking-luxury uppercase border border-matte-black/25 px-10 py-3.5 text-matte-black hover:bg-matte-black hover:text-white transition-all duration-500"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

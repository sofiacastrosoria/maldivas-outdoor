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
  href,
}: {
  category: SliderCategory;
  href: string;
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
    <div className="relative">
      <ProductHeroSlider slides={slides} autoplayMs={7500} fullscreen />
      <Link
        href={href}
        className="absolute inset-0 z-20"
        aria-label={`Explorar ${category}`}
      />
    </div>
  );
}

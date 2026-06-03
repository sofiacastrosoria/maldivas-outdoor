"use client";

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

function CategoryEditorialHero({ category }: { category: SliderCategory }) {
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
    <ProductHeroSlider slides={slides} fullscreen autoplayMs={6500} />
  );
}

export function ReposerasCategoryHero() {
  return <CategoryEditorialHero category="reposeras" />;
}

export function LivingCategoryHero() {
  return <CategoryEditorialHero category="living" />;
}

export function ComedorCategoryHero() {
  return <CategoryEditorialHero category="comedor" />;
}

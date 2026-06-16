import type { SliderCategory } from "@/data/editorialSliders";
import {
  editorialSlideFileExists,
  manifestUrlExists,
} from "@/lib/imageManifest";
import type { HeroSlide } from "./ProductHeroSlider";

export { editorialSlideFileExists };

export function editorialSlideUrl(
  category: SliderCategory,
  file: string
): string {
  return `/images/sliders/${category}/${file}`;
}

/** Sync filter via manifest — no network probes */
export function filterHeroSlides(slides: HeroSlide[]): HeroSlide[] {
  return slides.filter((slide) => manifestUrlExists(slide.src));
}

import type { SliderCategory } from "@/data/editorialSliders";
import imageManifest from "../../../public/images/manifest.json";
import type { HeroSlide } from "./ProductHeroSlider";

type Manifest = {
  files: Record<string, { url: string; mtimeMs: number; size: number }>;
};

const manifest = imageManifest as Manifest;

/** Exact editorial slide file exists at /images/sliders/{category}/{file} */
export function editorialSlideFileExists(
  category: SliderCategory,
  file: string
): boolean {
  const entry = manifest.files[file];
  if (!entry) return false;
  return entry.url === `/images/sliders/${category}/${file}`;
}

export function editorialSlideUrl(
  category: SliderCategory,
  file: string
): string {
  return `/images/sliders/${category}/${file}`;
}

function probeImageUrl(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Keep only slides whose image file actually loads */
export async function filterExistingHeroSlides(
  slides: HeroSlide[]
): Promise<HeroSlide[]> {
  const checks = await Promise.all(
    slides.map(async (slide) => {
      const ok = await probeImageUrl(slide.src);
      return ok ? slide : null;
    })
  );
  return checks.filter(Boolean) as HeroSlide[];
}

/** Probe numbered model slider images; skip missing indices (no gaps rendered) */
export async function probeModelSliderImages(
  base: string,
  max = 10
): Promise<string[]> {
  const found: string[] = [];
  for (let i = 1; i <= max; i++) {
    const src = `${base}/${i}.jpg`;
    const ok = await probeImageUrl(src);
    if (ok) found.push(src);
  }
  return found;
}

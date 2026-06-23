/**
 * Editorial slider images — drag JPGs into /public/images/sliders/{category}/
 * Filenames listed here; order defines slide sequence (curated interleaving).
 * Missing files are skipped automatically at render time.
 */

export interface EditorialSlide {
  /** Filename only, e.g. "01-reposera-fendi-terraza.jpg" */
  file: string;
  /** Model name only — displayed on slide overlay */
  label: string;
  href?: string;
  /** Ruta completa opcional cuando la imagen no está en /images/sliders/{category}/ */
  src?: string;
}

export type SliderCategory = "reposeras" | "living" | "comedor";

export function editorialSlideSrc(
  category: SliderCategory,
  file: string
): string {
  return `/images/sliders/${category}/${file}`;
}

/** Category portadas — editorial ambientaciones (NOT configurator images) */
export const categoryEditorialSlides: Record<SliderCategory, EditorialSlide[]> =
  {
    reposeras: [
      {
        file: "01-reposera-fendi-similmaderamarron-negro.jpg",
        label: "Fendi",
        href: "/productos/reposeras/fendi",
      },
      {
        file: "02-reposera-skorphio-greige-beige.jpg",
        label: "Skorphio",
        href: "/productos/reposeras/skorphio",
      },
      {
        file: "03-reposera-malaga-terraza-boutique.jpg",
        label: "Málaga",
        href: "/productos/reposeras/malaga",
      },
      {
        file: "05-reposera-mdq-conjunto-sombrilla.jpg",
        label: "MDQ",
        href: "/productos/reposeras/mdq",
      },
      {
        file: "06-reposera-baros-anodidonatural-gris.jpg",
        label: "Baros",
        href: "/productos/reposeras/baros",
      },
    ],
    living: [
      {
        file: "01-living-fendi-similmaderamarron-negro.jpg",
        label: "Fendi",
        href: "/productos/living/fendi",
      },
      {
        file: "02-living-maldivas-greige-beige.jpg",
        label: "Maldivas",
        href: "/productos/living/maldivas",
      },
      {
        file: "03-living-malaga-hotel-boutique.jpg",
        label: "Málaga",
        href: "/productos/living/malaga",
      },
    ],
    comedor: [
      {
        file: "skorphio-placeholder.jpg",
        label: "Skorphio",
        href: "/productos/comedor/skorphio",
      },
      {
        file: "marbella-placeholder.jpg",
        label: "Marbella",
        href: "/productos/comedor/marbella",
      },
    ],
  };

/** Product page editorial slider — filter by slug in filename */
export function getProductEditorialSlides(
  category: SliderCategory,
  productSlug: string
): EditorialSlide[] {
  return categoryEditorialSlides[category].filter((s) =>
    s.file.toLowerCase().includes(productSlug.toLowerCase())
  );
}

export function mapEditorialToHero(
  category: SliderCategory,
  slides: EditorialSlide[]
) {
  return slides.map((s) => ({
    src: editorialSlideSrc(category, s.file),
    label: s.label,
    href: s.href,
  }));
}

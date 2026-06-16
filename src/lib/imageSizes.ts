/** Responsive `sizes` hints for next/image — mobile-first, smaller on phones */
export const IMAGE_SIZES = {
  hero: "(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1400px",
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  configurator: "(max-width: 768px) 100vw, 640px",
  thumbnail: "72px",
  cart: "80px",
  lightbox: "90vw",
  about: "(max-width: 1024px) 100vw, 50vw",
} as const;

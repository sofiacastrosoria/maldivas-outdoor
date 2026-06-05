/**
 * Mobile-first image classes — full photo visible, no aggressive cropping.
 * Below lg (1024px): intrinsic width + auto height where supported.
 * lg+: contained within layout shells.
 */
export const IMAGE_CONTAIN = "object-contain object-center";

/** Fill-mode image: contain on all breakpoints */
export const IMAGE_CONTAIN_FILL = `${IMAGE_CONTAIN} w-full h-full`;

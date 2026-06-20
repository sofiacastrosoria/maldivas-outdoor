"use client";

import { motion } from "framer-motion";

interface ImagePlaceholderProps {
  message?: string;
  className?: string;
  /** Mismo tono que la página — sin gradiente blanco */
  surface?: boolean;
}

export function ImagePlaceholder({
  message = "No hay imagen disponible para esta configuración",
  className = "",
  surface = false,
}: ImagePlaceholderProps) {
  const bgClass = surface
    ? "bg-ivory"
    : "bg-gradient-to-br from-sand/25 via-white to-greige/10";

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center px-8 text-center ${bgClass} ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        className="mb-4 text-matte-black/15"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <circle cx="8.5" cy="10.5" r="1.5" />
        <path d="M21 16l-5.5-5.5L8 18" />
      </svg>
      <p className="max-w-[240px] text-[11px] leading-relaxed tracking-wide text-matte-black/38">
        {message}
      </p>
    </div>
  );
}

/** Premium fade + subtle zoom wrapper for image swaps */
export const premiumFadeTransition = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.005 },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function PremiumFadeWrapper({
  imageKey,
  children,
}: {
  imageKey: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div key={imageKey} {...premiumFadeTransition} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

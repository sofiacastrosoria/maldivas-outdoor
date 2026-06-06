"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const FADE_MS = 0.2;

export function FullscreenImageModal({
  isOpen,
  src,
  alt,
  onClose,
}: {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevBodyOverflow || "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fullscreen-image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_MS }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          <div
            className="absolute inset-0 bg-matte-black/70 backdrop-blur-md"
            aria-hidden
          />

          <button
            type="button"
            aria-label="Cerrar imagen ampliada"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 z-[230] flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-matte-black shadow-[0_2px_12px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-95 transition-all duration-200"
          >
            <span className="text-xl leading-none font-light" aria-hidden>
              ×
            </span>
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_MS }}
            className="relative z-[220] h-[min(70dvh,85vw*5/7)] w-full max-w-5xl max-h-[85dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain object-center"
              sizes="100vw"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

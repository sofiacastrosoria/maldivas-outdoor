"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import { IMAGE_BORDER_RADIUS } from "@/lib/imageStyles";

const FADE_MS = 0.25;

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      width: style.width,
      overflow: style.overflow,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.width = "100%";
    style.overflow = "hidden";
    document.body.dataset.lightboxOpen = "true";

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.width = prev.width;
      style.overflow = prev.overflow;
      delete document.body.dataset.lightboxOpen;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}

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

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
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
          className="fixed inset-0 z-[310] flex items-center justify-center bg-matte-black/92 backdrop-blur-md"
          onClick={onClose}
        >
          <button
            type="button"
            aria-label="Cerrar imagen ampliada"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed left-4 top-4 sm:left-6 sm:top-6 z-[320] flex h-12 w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-matte-black shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-white/95 active:scale-95 transition-all duration-200"
          >
            <span className="text-2xl leading-none font-light" aria-hidden>
              ×
            </span>
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: FADE_MS }}
            className="relative z-[315] w-[90vw] h-[90vh] max-w-[90vw] max-h-[90dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className={`configurator-product-image object-contain object-center ${IMAGE_BORDER_RADIUS}`}
              sizes={IMAGE_SIZES.lightbox}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

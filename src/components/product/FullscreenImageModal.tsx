"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] bg-matte-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[210] p-4 md:p-10"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute left-4 top-4 md:left-8 md:top-8 z-[220] text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm tracking-wide">✕</span>
            </button>

            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


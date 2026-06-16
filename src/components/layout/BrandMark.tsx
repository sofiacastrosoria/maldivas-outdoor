"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const LOGO_SRC = "/logo/maldivas-logo-transparent.png";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      aria-label="Maldivas Outdoor — Inicio"
    >
      <motion.div
        className="relative flex h-8 w-8 items-center justify-center sm:h-9 sm:w-9 md:h-10 md:w-10"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={LOGO_SRC}
          alt="Maldivas Outdoor"
          width={40}
          height={40}
          className="h-full w-full object-contain object-center opacity-[0.92] transition-opacity duration-500 group-hover:opacity-100"
          priority
        />
      </motion.div>

      <span
        className="mt-2 sm:mt-2.5 text-[10px] sm:text-[11px] md:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.22em] md:tracking-[0.24em] leading-none transition-colors duration-500 group-hover:opacity-80 whitespace-nowrap"
        style={{ color: "var(--brand-logo)" }}
      >
        MALDIVAS OUTDOOR
      </span>
    </Link>
  );
}

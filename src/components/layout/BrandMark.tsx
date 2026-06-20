"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const LOGO_SRC = "/logo/maldivas-logo-transparent.png";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="group flex h-full flex-col items-center justify-center overflow-visible lg:py-2 xl:py-2.5 2xl:py-3"
      aria-label="Maldivas Outdoor — Inicio"
    >
      <motion.div
        className="relative flex h-7 w-7 items-center justify-center"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={LOGO_SRC}
          alt="Maldivas Outdoor"
          width={44}
          height={44}
          className="h-full w-full object-contain object-center opacity-[0.92] transition-opacity duration-500 group-hover:opacity-100"
          priority
        />
      </motion.div>

      <span
        className="mt-1.5 text-[9px] font-semibold tracking-[0.2em] leading-none transition-colors duration-500 group-hover:opacity-80 whitespace-nowrap"
        style={{ color: "var(--brand-logo)" }}
      >
        MALDIVAS OUTDOOR
      </span>
    </Link>
  );
}

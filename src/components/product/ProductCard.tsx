"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice, getMinimumCashPrice } from "@/lib/pricing";
import { ModelVariantSlider } from "./ModelVariantSlider";

interface ProductCardProps {
  product: Product;
  href: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
  const fromPrice = getMinimumCashPrice(product);

  return (
    <Link href={href} className="group block">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        <div className="relative w-full">
          <ModelVariantSlider product={product} />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-matte-black/0 transition-colors duration-700 group-hover:bg-matte-black/5" />
        </div>

        <div className="mt-4 flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-light tracking-tight text-matte-black">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-matte-black/45">
              {product.description}
            </p>
          </div>

          <div className="flex flex-shrink-0 flex-col items-end">
            <p className="whitespace-nowrap text-right text-sm text-matte-black/60">
              {fromPrice !== null
                ? `Desde ${formatPrice(fromPrice)}`
                : "A cotizar"}
            </p>
            <span className="mt-2 inline-flex h-9 items-center rounded-full bg-matte-black px-5 text-[11px] font-medium tracking-wide text-white transition-all duration-300 group-hover:opacity-90 group-hover:shadow-[0_2px_8px_rgba(26,26,26,0.12)]">
              Personalizar
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

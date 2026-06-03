"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/pricing";
import { ModelVariantSlider } from "./ModelVariantSlider";

interface ProductCardProps {
  product: Product;
  href: string;
}

export function ProductCard({ product, href }: ProductCardProps) {
  return (
    <Link href={href} className="group block">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
      >
        <div className="relative aspect-[7/5] overflow-hidden bg-matte-black">
          <div className="absolute inset-0">
            <ModelVariantSlider product={product} />
          </div>
          <div className="absolute inset-0 bg-matte-black/0 group-hover:bg-matte-black/8 transition-colors duration-700 pointer-events-none" />
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <div>
            <h3 className="text-lg font-light tracking-tight">{product.name}</h3>
            <p className="text-xs text-matte-black/45 mt-1 line-clamp-2 max-w-xs">
              {product.description}
            </p>
          </div>
          <p className="text-sm text-matte-black/60 flex-shrink-0">
            desde {formatPrice(product.basePrice)}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

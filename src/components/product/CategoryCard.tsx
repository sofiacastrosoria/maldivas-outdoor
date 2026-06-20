"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";

interface CategoryCardProps {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  index?: number;
}

export function CategoryCard({
  title,
  subtitle,
  image,
  href,
  index = 0,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={href} className="group block relative overflow-hidden rounded-2xl">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <IntrinsicImage
            src={image}
            alt={title}
            sizes="100vw"
            className="transition-transform duration-[1.4s] ease-luxury group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 via-matte-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <p className="text-[10px] tracking-luxury uppercase text-white/60 mb-2">
              {subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight">
              {title}
            </h2>
            <span className="inline-block mt-4 text-xs tracking-wide text-white/70 group-hover:text-white transition-colors">
              Explorar →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

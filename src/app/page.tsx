"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { StaticPlaceholderImage } from "@/components/ui/StaticPlaceholderImage";
import { IMAGE_CONTAIN } from "@/lib/responsiveImage";

const taglines = [
  "Lujo silencioso. Diseño atemporal.",
  "Outdoor diseñado para permanecer.",
  "Cada pieza transforma el exterior en experiencia.",
  "Arquitectura exterior para quienes entienden el detalle.",
];

/** Real showroom — shared with Contacto */
const SHOWROOM_IMAGE = "/images/contacto/local-showroom.jpg";

const aboutImages = [
  { src: "/images/about/about-1.jpg", alt: "Maldivas Outdoor — About 1" },
  { src: "/images/about/about-2.jpg", alt: "Maldivas Outdoor — About 2" },
  { src: "/images/about/about-3.jpg", alt: "Maldivas Outdoor — About 3" },
  { src: "/images/about/about-4.jpg", alt: "Maldivas Outdoor — About 4" },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <>
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] flex items-end overflow-hidden"
      >
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={SHOWROOM_IMAGE}
            alt="Showroom Maldivas Outdoor"
            fill
            priority
            className={IMAGE_CONTAIN}
            sizes="100vw"
            unoptimized
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-matte-black/20 to-matte-black/30" />
        <motion.div
          style={{ opacity }}
          className="relative z-10 w-full px-6 pb-20 md:px-12 md:pb-28"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[10px] md:text-xs tracking-luxury uppercase text-white/60 mb-4"
          >
            Maldivas Outdoor · Córdoba, Argentina
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-4xl md:text-7xl font-extralight text-white tracking-tight max-w-4xl leading-[1.1]"
          >
            {taglines[0]}
          </motion.h1>
        </motion.div>
      </section>

      <section className="py-24 md:py-40 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <FadeIn>
          <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-6">
            About Us
          </p>
          <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-snug">
            Maldivas Outdoor nace en Córdoba, Argentina.
          </h2>
        </FadeIn>
        <FadeIn delay={0.15} className="mt-10">
          <p className="text-sm md:text-base text-matte-black/55 leading-relaxed">
            La marca crea muebles de exterior premium inspirados en hoteles
            boutique, arquitectura contemporánea y diseño atemporal. Cada pieza
            combina aluminio de alta tecnología, textiles europeos y procesos
            constructivos de excelencia.
          </p>
        </FadeIn>
      </section>

      <section className="border-t border-stone/15">
        {taglines.slice(1).map((line, i) => (
          <FadeIn
            key={line}
            className="py-20 md:py-32 px-6 md:px-12 text-center border-b border-stone/10"
          >
            <p className="text-2xl md:text-4xl font-extralight tracking-tight text-matte-black/80 max-w-3xl mx-auto">
              {line}
            </p>
          </FadeIn>
        ))}
      </section>

      <section className="py-24 md:py-32 px-6 md:px-12 border-t border-stone/15">
        <FadeIn className="max-w-6xl mx-auto mb-12 md:mb-16 text-center">
          <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
            Editorial
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight">
            Arquitectura, materia y permanencia
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {aboutImages.map((img, i) => (
            <FadeIn key={img.src} delay={i * 0.05}>
              <StaticPlaceholderImage src={img.src} alt={img.alt} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="py-32 md:py-48 px-6 text-center bg-sand/20">
        <FadeIn>
          <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
            Descubrir
          </p>
          <a
            href="/productos"
            className="inline-block text-2xl md:text-3xl font-extralight hover:opacity-60 transition-opacity duration-500"
          >
            Explorar colección →
          </a>
        </FadeIn>
      </section>
    </>
  );
}

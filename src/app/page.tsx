"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { IntrinsicImage } from "@/components/ui/IntrinsicImage";
import { IMAGE_SIZES } from "@/lib/imageSizes";
import { StaticPlaceholderImage } from "@/components/ui/StaticPlaceholderImage";

const tagline = "Lujo silencioso. Diseño atemporal.";

/** Real showroom — shared with Contacto */
const SHOWROOM_IMAGE = "/images/contacto/local-showroom.jpg";

const philosophyPillars = [
  {
    src: "/images/about/about-1.jpg",
    alt: "Maldivas Outdoor — Diseño atemporal",
    title: "Diseño Atemporal",
    text: "Creemos en formas que trascienden tendencias y acompañan los espacios durante años.",
  },
  {
    src: "/images/about/about-2.jpg",
    alt: "Maldivas Outdoor — Fabricación propia",
    title: "Fabricación Propia",
    text: "Cada pieza es desarrollada y fabricada por nuestro equipo, cuidando cada detalle constructivo y cada terminación.",
  },
  {
    src: "/images/about/about-3.jpg",
    alt: "Maldivas Outdoor — Materiales seleccionados",
    title: "Materiales Seleccionados",
    text: "Trabajamos con aluminio y textiles outdoor elegidos por su desempeño, durabilidad y estética.",
  },
  {
    src: "/images/about/about-4.jpg",
    alt: "Maldivas Outdoor — Vivir el exterior",
    title: "Vivir el Exterior",
    text: "Nuestros muebles están pensados para transformar galerías, terrazas y jardines en espacios para compartir y disfrutar.",
  },
];

export default function HomePage() {
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
        id="inicio"
        ref={heroRef}
        className="relative min-h-[70vh] flex items-end overflow-hidden bg-sand/10"
      >
        <motion.div
          style={{ y }}
          className="absolute inset-x-0 top-0 flex justify-center"
        >
          <IntrinsicImage
            src={SHOWROOM_IMAGE}
            alt="Showroom Maldivas Outdoor"
            priority
            sizes={IMAGE_SIZES.hero}
            className="max-h-[85vh]"
            rounded={false}
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
            Inicio · Maldivas Outdoor · Córdoba, Argentina
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="text-4xl md:text-7xl font-extralight text-white tracking-tight max-w-4xl leading-[1.1]"
          >
            {tagline}
          </motion.h1>
        </motion.div>
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

      <section
        id="filosofia"
        className="py-24 md:py-40 px-6 md:px-12 border-t border-stone/15"
      >
        <FadeIn className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-6">
            Nuestra Filosofía
          </p>
          <div className="space-y-6 text-sm md:text-base text-matte-black/60 leading-relaxed font-light">
            <p className="text-xl md:text-2xl font-extralight text-matte-black/85 tracking-tight leading-snug">
              No diseñamos únicamente muebles.
            </p>
            <p>
              Diseñamos espacios exteriores pensados para permanecer en el
              tiempo.
            </p>
            <p>
              Cada colección nace de la búsqueda del equilibrio entre estética,
              funcionalidad y durabilidad.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-5xl mx-auto space-y-24 md:space-y-32">
          {philosophyPillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.05}>
              <article className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <StaticPlaceholderImage src={pillar.src} alt={pillar.alt} />
                </div>
                <div className={i % 2 === 1 ? "md:order-1 md:text-right" : ""}>
                  <h3 className="text-lg md:text-xl font-extralight tracking-tight text-matte-black mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-sm md:text-base text-matte-black/55 leading-relaxed font-light">
                    {pillar.text}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}

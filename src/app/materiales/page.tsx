"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { StaticPlaceholderImage } from "@/components/ui/StaticPlaceholderImage";

const sections = [
  {
    id: "aluminio",
    title: "Aluminio",
    text: "Aluminio no recuperado proveniente de extrusoras Aluar. Tratamientos anodizados, termolacados y símil madera realizados en TDA, planta N°1 de Argentina, utilizando tecnología avanzada y materias primas importadas.",
    image: "/images/materiales/material-1.jpg",
    brands: [] as string[],
  },
  {
    id: "telas",
    title: "Telas",
    text: "Textiles acrílicos 100% importados de Europa y USA.",
    image: "/images/materiales/material-2.jpg",
    brands: [
      "Sunbrella® Francia",
      "Agora España",
      "Phifer® USA",
      "Hilos náuticos USA",
    ],
  },
  {
    id: "goma",
    title: "Goma espuma",
    text: "Piero Soft 26k | 28k | 29k HiperSoft.",
    image: "/images/materiales/material-3.jpg",
    brands: [] as string[],
  },
  {
    id: "piedras",
    title: "Piedras sinterizadas",
    text: "Superficies de alta resistencia para tops de mesa y comedor.",
    image: "/images/materiales/material-4.jpg",
    brands: ["Infinity Surface Italia", "Dekton España"],
  },
];

export default function MaterialesPage() {
  return (
    <>
      <section className="pt-32 pb-20 px-6 md:px-12 text-center min-h-[40vh] flex flex-col justify-center">
        <FadeIn>
          <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
            Materiales
          </p>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tight">
            La materia del lujo silencioso
          </h1>
          <p className="text-sm text-matte-black/50 mt-6 max-w-xl mx-auto">
            Cada material fue seleccionado por su desempeño, procedencia y
            capacidad de envejecer con elegancia.
          </p>
        </FadeIn>
      </section>

      <section className="pb-32 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 max-w-6xl mx-auto">
          {sections.map((section, i) => (
            <FadeIn key={section.id} delay={i * 0.06}>
              <article id={section.id} className="space-y-6">
                <StaticPlaceholderImage
                  src={section.image}
                  alt={section.title}
                />
                <div>
                  <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-2">
                    Materiales
                  </p>
                  <h2 className="text-2xl md:text-3xl font-extralight tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm text-matte-black/55 leading-relaxed mt-4">
                    {section.text}
                  </p>
                  {section.brands.length > 0 && (
                    <ul className="mt-6 space-y-2 border-t border-stone/15 pt-6">
                      {section.brands.map((brand) => (
                        <li
                          key={brand}
                          className="text-xs tracking-wide text-matte-black/50 border-l border-stone/30 pl-4"
                        >
                          {brand}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}

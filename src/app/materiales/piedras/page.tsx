import type { Metadata } from "next";
import { MaterialDetailLayout } from "@/components/materials/MaterialDetailLayout";
import { MaterialItemCard } from "@/components/materials/MaterialItemCard";
import { piedrasDekton, piedrasInfinity } from "@/data/materialsContent";

export const metadata: Metadata = {
  title: "Conocer Piedras",
};

/** Proporción 4:3 — más protagonista para muestras de piedra */
const STONE_ASPECT = "aspect-[4/3]";

export default function ConocerPiedrasPage() {
  return (
    <MaterialDetailLayout
      eyebrow="Materiales"
      title="Conocer Piedras"
      intro="Superficies sinterizadas de alta resistencia para tops de mesa y comedor — seleccionadas por desempeño técnico y presencia material."
    >
      {/* ── Dekton ─────────────────────────────────────────────────────── */}
      <section className="mb-20 md:mb-28">
        <p className="text-center text-[10px] tracking-luxury uppercase text-matte-black/40 mb-12">
          Dekton
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10">
          {piedrasDekton.map((item, i) => (
            <MaterialItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              aspectClass={STONE_ASPECT}
              delay={i * 0.05}
            />
          ))}
        </div>
      </section>

      {/* ── Infinity ────────────────────────────────────────────────────── */}
      <section className="border-t border-premium-border/50 pt-16 md:pt-20">
        <p className="text-center text-[10px] tracking-luxury uppercase text-matte-black/40 mb-12">
          Infinity
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {piedrasInfinity.map((item, i) => (
            <MaterialItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              aspectClass={STONE_ASPECT}
              delay={i * 0.03}
            />
          ))}
        </div>
      </section>
    </MaterialDetailLayout>
  );
}

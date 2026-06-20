import type { Metadata } from "next";
import { MaterialDetailLayout } from "@/components/materials/MaterialDetailLayout";
import { MaterialItemCard } from "@/components/materials/MaterialItemCard";
import { piedrasDekton, piedrasInfinity } from "@/data/materialsContent";

export const metadata: Metadata = {
  title: "Conocer Piedras",
};

export default function ConocerPiedrasPage() {
  return (
    <MaterialDetailLayout
      eyebrow="Materiales"
      title="Conocer Piedras"
      intro="Superficies sinterizadas de alta resistencia para tops de mesa y comedor — seleccionadas por desempeño técnico y presencia material."
    >
      <section className="mb-20 md:mb-28">
        <h2 className="text-center text-[10px] tracking-luxury uppercase text-matte-black/40 mb-10">
          Dekton
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {piedrasDekton.map((item, i) => (
            <MaterialItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              delay={i * 0.04}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-premium-border/50 pt-16 md:pt-20">
        <h2 className="text-center text-[10px] tracking-luxury uppercase text-matte-black/40 mb-10">
          Infinity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-12">
          {piedrasInfinity.map((item, i) => (
            <MaterialItemCard
              key={item.id}
              title={item.title}
              description={item.description}
              image={item.image}
              delay={i * 0.03}
            />
          ))}
        </div>
      </section>
    </MaterialDetailLayout>
  );
}

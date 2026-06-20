import type { Metadata } from "next";
import { MaterialDetailLayout } from "@/components/materials/MaterialDetailLayout";
import { MaterialItemCard } from "@/components/materials/MaterialItemCard";
import { aluminioCategories } from "@/data/materialsContent";

export const metadata: Metadata = {
  title: "Conocer Aluminio",
};

export default function ConocerAluminioPage() {
  return (
    <MaterialDetailLayout
      eyebrow="Materiales"
      title="Conocer Aluminio"
      intro="Aluminio no recuperado de extrusoras Aluar, con tratamientos anodizados, termolacados y símil madera realizados en TDA — planta N°1 de Argentina."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {aluminioCategories.map((item, i) => (
          <MaterialItemCard
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            delay={i * 0.05}
          />
        ))}
      </div>
    </MaterialDetailLayout>
  );
}

import type { Metadata } from "next";
import { MaterialDetailLayout } from "@/components/materials/MaterialDetailLayout";
import { MaterialItemCard } from "@/components/materials/MaterialItemCard";
import { telasBrands } from "@/data/materialsContent";

export const metadata: Metadata = {
  title: "Conocer Telas",
};

export default function ConocerTelasPage() {
  return (
    <MaterialDetailLayout
      eyebrow="Materiales"
      title="Conocer Telas"
      intro="Textiles acrílicos 100% importados de Europa y USA, seleccionados por solidez cromática, tacto y desempeño en exteriores."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {telasBrands.map((item, i) => (
          <MaterialItemCard
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            showColorPalette={item.hasColorPalette}
            delay={i * 0.05}
          />
        ))}
      </div>
    </MaterialDetailLayout>
  );
}

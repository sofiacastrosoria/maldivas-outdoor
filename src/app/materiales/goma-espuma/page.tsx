import type { Metadata } from "next";
import { MaterialDetailLayout } from "@/components/materials/MaterialDetailLayout";
import { MaterialItemCard } from "@/components/materials/MaterialItemCard";
import { gomaEspumaBrand, gomaEspumaOptions } from "@/data/materialsContent";

export const metadata: Metadata = {
  title: "Conocer Goma Espuma",
};

export default function ConocerGomaEspumaPage() {
  return (
    <MaterialDetailLayout
      eyebrow="Materiales"
      title="Conocer Goma Espuma"
      intro={`Espumas técnicas ${gomaEspumaBrand} para asientos outdoor — confort estable, recuperación y durabilidad en exteriores.`}
    >
      <p className="text-center text-[10px] tracking-luxury uppercase text-matte-black/40 mb-10">
        Marca {gomaEspumaBrand}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {gomaEspumaOptions.map((item, i) => (
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

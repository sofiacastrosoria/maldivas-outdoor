import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";
import { CategoryEditorialSlider } from "@/components/product/CategoryEditorialSlider";

export const metadata: Metadata = {
  title: "Productos",
  description: "Reposeras, juegos de living y comedor premium.",
};

export default function ProductosPage() {
  return (
    <div className="pt-24 pb-32">
      <FadeIn className="px-6 md:px-12 mb-16 md:mb-24 text-center">
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
          Colección
        </p>
        <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
          Productos
        </h1>
        <p className="text-sm text-matte-black/50 mt-6 max-w-lg mx-auto">
          Tres universos de diseño. Una misma filosofía: lujo silencioso para el
          exterior.
        </p>
      </FadeIn>

      <div className="space-y-0">
        <CategoryEditorialSlider
          category="reposeras"
          title="Reposeras"
          href="/productos/reposeras"
        />
        <CategoryEditorialSlider
          category="living"
          title="Juegos de Living"
          href="/productos/living"
          showDivider
        />
        <CategoryEditorialSlider
          category="comedor"
          title="Comedor"
          href="/productos/comedor"
          showDivider
        />
      </div>
    </div>
  );
}

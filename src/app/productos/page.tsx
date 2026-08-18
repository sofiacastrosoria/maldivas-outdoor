import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { CategoryEditorialSlider } from "@/components/product/CategoryEditorialSlider";
import { ProductCard } from "@/components/product/ProductCard";
import { getExtraPublicCategories, getPublicProductsByCategory } from "@/lib/catalog/runtime";
import { getCategoryHref, getCategoryLabel } from "@/lib/catalog/href";

export const metadata: Metadata = {
  title: "Productos",
  description: "Reposeras, juegos de living y comedor premium.",
};

export default function ProductosPage() {
  const extraCategories = getExtraPublicCategories();

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
        {extraCategories.map((category) => {
          const items = getPublicProductsByCategory(category);
          if (items.length === 0) return null;
          return (
            <section
              key={category}
              className="border-t border-premium-border/60 pt-10 md:pt-14 px-6 md:px-12"
            >
              <div className="text-center pb-8">
                <h2 className="text-xl md:text-3xl font-extralight tracking-luxury uppercase text-matte-black">
                  {getCategoryLabel(category)}
                </h2>
                <Link
                  href={getCategoryHref(category)}
                  className="mt-4 inline-block text-xs tracking-luxury uppercase text-matte-black/50 hover:text-matte-black"
                >
                  Ver productos
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

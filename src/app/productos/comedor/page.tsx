import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCategory } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { ComedorCategoryHero } from "@/components/product/CategoryHeroes";

export const metadata: Metadata = {
  title: "Comedor",
};

export default function ComedorPage() {
  const items = getProductsByCategory("comedor");

  return (
    <>
      <div>
        <ComedorCategoryHero />
      </div>
      <div className="pb-32 px-6 md:px-12">
        <FadeIn className="mb-16 mt-16">
          <Link
            href="/productos"
            className="text-xs text-matte-black/40 hover:text-matte-black"
          >
            ← Productos
          </Link>
          <h1 className="text-4xl md:text-6xl font-extralight mt-6 tracking-tight">
            Comedor
          </h1>
          <p className="text-sm text-matte-black/50 mt-4 max-w-md">
            Mesa Marbella. Medida personalizable con piedras sinterizadas premium.
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-2xl">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              href={`/productos/comedor/${p.slug}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

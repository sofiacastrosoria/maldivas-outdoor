import type { Metadata } from "next";
import Link from "next/link";
import { getPublicProductsByCategory } from "@/lib/catalog/runtime";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Reposeras",
};

export default function ReposerasPage() {
  const items = getPublicProductsByCategory("reposeras");

  return (
    <div className="pt-24 pb-32 px-6 md:px-12">
      <FadeIn className="mb-16">
        <Link
          href="/productos"
          className="text-xs text-matte-black/40 hover:text-matte-black"
        >
          ← Productos
        </Link>
        <h1 className="text-4xl md:text-6xl font-extralight mt-6 tracking-tight">
          Reposeras
        </h1>
        <p className="text-sm text-matte-black/50 mt-4 max-w-md">
          Descanso escultórico. Cinco modelos con personalización completa.
        </p>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            href={`/productos/reposeras/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}

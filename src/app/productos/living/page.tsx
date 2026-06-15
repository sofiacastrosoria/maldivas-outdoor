import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCategory } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Juegos de Living",
};

export default function LivingPage() {
  const sillones = getProductsByCategory("living");
  const mesas = getProductsByCategory("mesas");

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
          Juegos de Living
        </h1>
      </FadeIn>

      <FadeIn className="mb-10">
        <h2 className="text-[10px] tracking-luxury uppercase text-matte-black/40">
          Sillones
        </h2>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-24">
        {sillones.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            href={`/productos/living/${p.slug}`}
          />
        ))}
      </div>

      <FadeIn className="mb-10 pt-8 border-t border-stone/15">
        <h2 className="text-[10px] tracking-luxury uppercase text-matte-black/40">
          Mesas de Living
        </h2>
        <p className="text-sm text-matte-black/50 mt-3">
          Tamaño personalizable · Marca y modelo de piedra a elección
        </p>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {mesas.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            href={`/productos/living/mesas/${p.slug}`}
          />
        ))}
      </div>
    </div>
  );
}

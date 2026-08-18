import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategoryLabel } from "@/lib/catalog/href";
import { getPublicProductsByCategory } from "@/lib/catalog/runtime";

const RESERVED = new Set(["reposeras", "living", "comedor"]);

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: getCategoryLabel(category) };
}

export default async function ExtraCategoryPage({ params }: Props) {
  const { category } = await params;
  if (RESERVED.has(category)) notFound();

  const items = getPublicProductsByCategory(category);

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
          {getCategoryLabel(category)}
        </h1>
      </FadeIn>
      {items.length === 0 ? (
        <p className="text-sm text-matte-black/50">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

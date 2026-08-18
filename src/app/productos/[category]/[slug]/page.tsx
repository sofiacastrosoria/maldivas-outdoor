import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getCategoryHref, getCategoryLabel } from "@/lib/catalog/href";
import { getPublicProductBySlug } from "@/lib/catalog/runtime";

const RESERVED = new Set(["reposeras", "living", "comedor"]);

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getPublicProductBySlug(category, slug);
  return { title: product?.name ?? getCategoryLabel(category) };
}

export default async function ExtraProductPage({ params }: Props) {
  const { category, slug } = await params;
  if (RESERVED.has(category)) notFound();
  const product = getPublicProductBySlug(category, slug);
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref={getCategoryHref(category)}
      backLabel={getCategoryLabel(category)}
    />
  );
}

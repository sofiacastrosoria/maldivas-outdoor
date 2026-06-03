import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { ProductDetail } from "@/components/product/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ["fendi", "skorphio", "malaga", "maldivas", "milos"].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("living", slug);
  return { title: product?.name ?? "Sillón" };
}

export default async function SillonDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug("living", slug);
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref="/productos/living"
      backLabel="Juegos de Living"
    />
  );
}

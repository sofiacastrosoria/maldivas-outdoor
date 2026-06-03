import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductDetail } from "@/components/product/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ["fendi", "skorphio", "malaga", "milos"].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(
    (p) => p.category === "mesas" && p.slug === slug
  );
  return { title: product?.name ?? "Mesa" };
}

export default async function MesaDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find(
    (p) => p.category === "mesas" && p.slug === slug
  );
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref="/productos/living"
      backLabel="Juegos de Living"
    />
  );
}

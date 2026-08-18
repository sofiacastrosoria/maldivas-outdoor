import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/catalog/runtime";
import { ProductDetail } from "@/components/product/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [{ slug: "marbella" }, { slug: "skorphio" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicProductBySlug("comedor", slug);
  return { title: product?.name ?? "Comedor" };
}

export default async function ComedorDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublicProductBySlug("comedor", slug);
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref="/productos/comedor"
      backLabel="Comedor"
    />
  );
}

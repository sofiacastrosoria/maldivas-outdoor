import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/catalog/runtime";
import { ProductDetail } from "@/components/product/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ["fendi", "skorphio", "malaga", "mdq", "baros"].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicProductBySlug("reposeras", slug);
  return { title: product?.name ?? "Reposera" };
}

export default async function ReposeraDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getPublicProductBySlug("reposeras", slug);
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref="/productos/reposeras"
      backLabel="Reposeras"
    />
  );
}

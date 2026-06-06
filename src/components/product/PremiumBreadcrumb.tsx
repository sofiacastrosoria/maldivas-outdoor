import Link from "next/link";
import type { Product } from "@/types";
import { getCategoryBreadcrumb } from "@/lib/productDisplay";

export function PremiumBreadcrumb({ product }: { product: Product }) {
  const category = getCategoryBreadcrumb(product);

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-[11px] tracking-wide text-premium-gray"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-matte-black transition-colors">
            Inicio
          </Link>
        </li>
        <li aria-hidden className="text-premium-border">
          &gt;
        </li>
        <li>
          <Link
            href={category.href}
            className="hover:text-matte-black transition-colors"
          >
            {category.label}
          </Link>
        </li>
        <li aria-hidden className="text-premium-border">
          &gt;
        </li>
        <li className="text-matte-black/70">{product.name}</li>
      </ol>
    </nav>
  );
}

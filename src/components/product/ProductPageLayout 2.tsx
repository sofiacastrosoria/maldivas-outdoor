"use client";

/** Outer shell for product configurator pages (padding only). */
export function ProductPageLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-6 md:px-12">{children}</div>;
}

import { FadeIn } from "@/components/ui/FadeIn";
import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalPageLayout({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-3xl mx-auto">
      <FadeIn className="mb-16">
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mb-4">
          {eyebrow}
        </p>
        <h1 className="text-3xl md:text-5xl font-extralight tracking-tight">
          {title}
        </h1>
        {lastUpdated ? (
          <p className="mt-4 text-xs text-matte-black/40">
            Última actualización: {lastUpdated}
          </p>
        ) : null}
      </FadeIn>
      <div className="space-y-6 text-sm font-light leading-relaxed text-matte-black/70 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_a]:text-matte-black [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-70">
        {children}
      </div>
    </div>
  );
}

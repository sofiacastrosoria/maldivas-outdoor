import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";

interface MaterialDetailLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}

export function MaterialDetailLayout({
  eyebrow,
  title,
  intro,
  children,
}: MaterialDetailLayoutProps) {
  return (
    <div className="pt-28 pb-32 px-6 md:px-12">
      <FadeIn className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
        <Link
          href="/materiales"
          className="text-xs text-matte-black/40 hover:text-matte-black transition-colors"
        >
          ← Materiales
        </Link>
        <p className="text-[10px] tracking-luxury uppercase text-matte-black/40 mt-6 mb-3">
          {eyebrow}
        </p>
        <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-matte-black">
          {title}
        </h1>
        <p className="text-sm text-matte-black/55 leading-relaxed mt-5">{intro}</p>
      </FadeIn>

      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}

import Link from "next/link";

interface MaterialExploreButtonProps {
  href: string;
  label: string;
}

/** Cápsula premium — mismo lenguaje que Personalizar */
export function MaterialExploreButton({ href, label }: MaterialExploreButtonProps) {
  return (
    <Link
      href={href}
      className="mt-5 inline-flex h-9 items-center rounded-full bg-matte-black px-5 text-[11px] font-medium tracking-wide text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_2px_8px_rgba(26,26,26,0.12)]"
    >
      {label}
    </Link>
  );
}

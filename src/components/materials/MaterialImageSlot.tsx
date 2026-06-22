import Image from "next/image";
import { PRODUCT_COVER_ASPECT_CLASS } from "@/components/product/PremiumProductCover";

interface MaterialImageSlotProps {
  src?: string;
  alt: string;
  /** Tailwind aspect class. Default: aspect-[7/5] (producto). Usar aspect-[4/3] para piedras. */
  aspectClass?: string;
}

/** Espacio reservado para imagen — carga automática cuando exista src */
export function MaterialImageSlot({
  src,
  alt,
  aspectClass = PRODUCT_COVER_ASPECT_CLASS,
}: MaterialImageSlotProps) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-ivory ${aspectClass}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-premium-border/60 bg-sand/10 ${aspectClass}`}
      aria-hidden
    >
      <span className="text-[10px] tracking-luxury uppercase text-matte-black/30">
        Imagen próximamente
      </span>
    </div>
  );
}

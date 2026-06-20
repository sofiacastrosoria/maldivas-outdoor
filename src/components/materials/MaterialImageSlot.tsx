import Image from "next/image";
import { PRODUCT_COVER_ASPECT_CLASS } from "@/components/product/PremiumProductCover";

interface MaterialImageSlotProps {
  src?: string;
  alt: string;
}

/** Espacio reservado para imagen — carga automática cuando exista src */
export function MaterialImageSlot({ src, alt }: MaterialImageSlotProps) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-ivory ${PRODUCT_COVER_ASPECT_CLASS}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-2xl border border-dashed border-premium-border/60 bg-sand/10 ${PRODUCT_COVER_ASPECT_CLASS}`}
      aria-hidden
    >
      <span className="text-[10px] tracking-luxury uppercase text-matte-black/30">
        Imagen próximamente
      </span>
    </div>
  );
}

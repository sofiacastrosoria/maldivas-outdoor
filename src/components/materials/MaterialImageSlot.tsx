import Image from "next/image";
import { PRODUCT_COVER_ASPECT_CLASS } from "@/components/product/PremiumProductCover";
import { IMAGE_BORDER_RADIUS } from "@/lib/imageStyles";

interface MaterialImageSlotProps {
  src?: string;
  alt: string;
}

/** Espacio reservado para imagen — carga automática cuando exista src */
export function MaterialImageSlot({ src, alt }: MaterialImageSlotProps) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-ivory ${IMAGE_BORDER_RADIUS} ${PRODUCT_COVER_ASPECT_CLASS}`}
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
      className={`flex w-full items-center justify-center border border-dashed border-premium-border/60 bg-sand/10 ${IMAGE_BORDER_RADIUS} ${PRODUCT_COVER_ASPECT_CLASS}`}
      aria-hidden
    >
      <span className="text-[10px] tracking-luxury uppercase text-matte-black/30">
        Imagen próximamente
      </span>
    </div>
  );
}

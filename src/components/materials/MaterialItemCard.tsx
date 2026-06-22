import { FadeIn } from "@/components/ui/FadeIn";
import { MaterialColorPaletteSlot } from "./MaterialColorPaletteSlot";
import { MaterialImageSlot } from "./MaterialImageSlot";

interface MaterialItemCardProps {
  title: string;
  description: string;
  image?: string;
  showColorPalette?: boolean;
  /** Tailwind aspect class para la imagen. Default: aspect-[7/5]. */
  aspectClass?: string;
  delay?: number;
}

export function MaterialItemCard({
  title,
  description,
  image,
  showColorPalette = false,
  aspectClass,
  delay = 0,
}: MaterialItemCardProps) {
  return (
    <FadeIn delay={delay}>
      <article className="space-y-4">
        <MaterialImageSlot src={image} alt={title} aspectClass={aspectClass} />
        <div>
          <h2 className="text-lg md:text-xl font-extralight tracking-tight text-matte-black">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-matte-black/50">
              {description}
            </p>
          )}
          {showColorPalette && <MaterialColorPaletteSlot brand={title} />}
        </div>
      </article>
    </FadeIn>
  );
}

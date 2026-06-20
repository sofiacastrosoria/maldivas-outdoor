import { FadeIn } from "@/components/ui/FadeIn";
import { MaterialColorPaletteSlot } from "./MaterialColorPaletteSlot";
import { MaterialImageSlot } from "./MaterialImageSlot";

interface MaterialItemCardProps {
  title: string;
  description: string;
  image?: string;
  showColorPalette?: boolean;
  delay?: number;
}

export function MaterialItemCard({
  title,
  description,
  image,
  showColorPalette = false,
  delay = 0,
}: MaterialItemCardProps) {
  return (
    <FadeIn delay={delay}>
      <article className="space-y-5">
        <MaterialImageSlot src={image} alt={title} />
        <div>
          <h2 className="text-xl md:text-2xl font-extralight tracking-tight text-matte-black">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-matte-black/55">{description}</p>
          {showColorPalette && <MaterialColorPaletteSlot brand={title} />}
        </div>
      </article>
    </FadeIn>
  );
}

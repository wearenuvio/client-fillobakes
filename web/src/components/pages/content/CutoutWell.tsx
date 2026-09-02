import Image from "next/image";
import { cn } from "@/lib/cn";
import { LoafGlyph } from "@/components/ui/LineArt";
import { getProductBySlug } from "@/lib/catalog";

/**
 * A single product cutout on a tinted well — DESIGN.md §10.1 and §12.3.
 *
 * Hero variant A's right column is a cutout, not a photograph: centred in a
 * `paper-200` well at `--radius-none`, occupying 55–62% of the well's width,
 * with `--shadow-contact` on the image itself so it sits ON the well rather
 * than floating above it.
 *
 * When no cutout has been delivered for the SKU, the line-art loaf takes its
 * place rather than a stretched photograph.
 */
export function CutoutWell({
  slug,
  priority = false,
  sizes,
  className,
}: {
  slug: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const product = getProductBySlug(slug);

  return (
    <div
      data-surface="well"
      className={cn(
        "relative grid aspect-square w-full place-items-center rounded-none bg-paper-200",
        className,
      )}
    >
      {product?.image ? (
        <Image
          src={product.image.src}
          alt={product.name}
          width={800}
          height={800}
          priority={priority}
          sizes={sizes}
          className="w-[58%] object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]"
        />
      ) : (
        <LoafGlyph size={180} className="opacity-70" />
      )}
    </div>
  );
}

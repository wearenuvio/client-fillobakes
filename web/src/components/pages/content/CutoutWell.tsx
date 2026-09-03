import Image from "next/image";
import { cn } from "@/lib/cn";
import { LoafGlyph } from "@/components/ui/LineArt";
import { getProductBySlug } from "@/lib/catalog";

/**
 * A single product cutout floating on a tinted well — DESIGN-v2 §2.
 *
 * The same object as a ProductCard's image area: a 1:1 well in `--color-well`
 * with the cutout at roughly three quarters of its width and the one drop
 * shadow the system allows. When no cutout exists for the SKU the line-art
 * loaf takes its place rather than a stretched photograph.
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
  const cutout = product?.image?.kind === "cutout";

  return (
    <div
      data-surface="well"
      className={cn(
        "relative grid aspect-square w-full place-items-center overflow-hidden rounded-lg bg-well",
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
          className={
            cutout ? "w-[74%] object-contain cutout" : "size-full object-cover"
          }
        />
      ) : (
        <LoafGlyph size={160} className="text-muted opacity-50" />
      )}
    </div>
  );
}

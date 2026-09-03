import Image from "next/image";
import { cn } from "@/lib/cn";
import { LoafGlyph } from "@/components/ui/LineArt";
import { getProductBySlug } from "@/lib/catalog";

/**
 * The thumbnail row on an order line — DESIGN-v2 §2.
 *
 * The same object as a ProductCard's well, shrunk: a tinted square with the
 * cutout floating on it. A SKU with no cutout falls back to the line-art loaf
 * rather than a stretched photograph.
 */
export function ItemThumbs({
  items,
  size = 48,
  max = 4,
  className,
}: {
  items: { slug: string; name: string }[];
  size?: number;
  max?: number;
  className?: string;
}) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {shown.map((item) => {
        const product = getProductBySlug(item.slug);
        return (
          <span
            key={item.slug}
            data-surface="well"
            className="grid shrink-0 place-items-center overflow-hidden rounded-md bg-well"
            style={{ width: size, height: size }}
          >
            {product?.image ? (
              <Image
                src={product.image.src}
                alt=""
                width={120}
                height={120}
                sizes="48px"
                className={
                  product.image.kind === "cutout"
                    ? "w-[76%] object-contain cutout-sm"
                    : "size-full object-cover"
                }
              />
            ) : (
              <LoafGlyph size={Math.round(size * 0.6)} className="text-muted opacity-60" />
            )}
          </span>
        );
      })}
      {rest > 0 ? (
        <span className="text-body-sm text-muted tabular">+{rest}</span>
      ) : null}
    </div>
  );
}

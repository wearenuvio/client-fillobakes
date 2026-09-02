import Image from "next/image";
import { cn } from "@/lib/cn";
import { LoafGlyph } from "@/components/ui/LineArt";
import { getProductBySlug } from "@/lib/catalog";

/**
 * The thumbnail row on an order line. Cutouts sit in a paper-200 well at
 * --radius-none with the contact shadow (§10.1); a SKU with no photograph
 * falls back to the line-art glyph rather than a broken frame.
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
            className="grid shrink-0 place-items-center bg-paper-200"
            style={{ width: size, height: size }}
          >
            {product?.image ? (
              <Image
                src={product.image.src}
                alt=""
                width={120}
                height={120}
                sizes="48px"
                className="w-[62%] object-contain drop-shadow-[0_18px_24px_rgba(4,33,47,0.35)]"
              />
            ) : (
              <LoafGlyph size={Math.round(size * 0.7)} />
            )}
          </span>
        );
      })}
      {rest > 0 ? (
        <span className="nano text-ink-500 tabular">+{rest}</span>
      ) : null}
    </div>
  );
}

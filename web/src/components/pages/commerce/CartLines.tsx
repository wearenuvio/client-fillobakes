"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Price } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { getProductBySlug } from "@/lib/catalog";
import { useCartStore, type CartLine } from "@/store/cart";

/**
 * The full-page cart's line items — the drawer's line item at page scale.
 * Names, prices and images are looked up from the catalogue at render, so a
 * price change can never leave a stale number in someone's browser.
 */
export function CartLines({
  lines,
  soldOut,
  className,
}: {
  lines: CartLine[];
  /** Slugs the van has run out of; the row says so and offers the way out. */
  soldOut: string[];
  className?: string;
}) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);

  return (
    <ul className={cn("divide-y divide-paper-300 border-y border-y-paper-300", className)}>
      {lines.map((line) => {
        const product = getProductBySlug(line.slug);
        if (!product) return null;
        const gone = soldOut.includes(line.slug);

        return (
          <li key={line.slug} className="flex flex-wrap gap-4 py-6 sm:flex-nowrap">
            <span
              data-surface="well"
              className={cn(
                "grid size-20 shrink-0 place-items-center bg-paper-200",
                gone && "opacity-55 grayscale",
              )}
            >
              {product.image ? (
                <Image
                  src={product.image.src}
                  alt=""
                  width={160}
                  height={160}
                  sizes="80px"
                  className="w-[70%] object-contain"
                />
              ) : (
                <LoafGlyph size={44} className="opacity-70" />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${product.slug}`}
                className="link-underline block text-body font-semibold text-ink-800"
              >
                {product.name}
              </Link>
              <KanaLabel kana={product.kana} />
              <p className="micro mt-1 text-ink-500">
                {product.tags.includes("savory") ? "SAVOURY" : "SWEET"} • EGGLESS
              </p>

              <div className="mt-3 flex items-center gap-3">
                <QtyStepper
                  qty={line.qty}
                  onIncrement={() => increment(line.slug)}
                  onDecrement={() => decrement(line.slug)}
                  label={`Quantity of ${product.name}`}
                />
                <button
                  type="button"
                  onClick={() => remove(line.slug)}
                  className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                >
                  Remove
                </button>
              </div>
            </div>

            <Price
              amount={product.price * line.qty}
              size="md"
              muted={gone}
              className="shrink-0"
            />
          </li>
        );
      })}
    </ul>
  );
}

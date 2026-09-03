"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/catalog";
import { getCategoryOf } from "@/lib/catalog";
import { cutoutVariants } from "@/lib/images";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useCartStore, useCartHydrated, qtyOf } from "@/store/cart";

/**
 * ProductCard — DESIGN-v2 §2.
 *
 * A card ground with a 1:1 well behind a cutout at 78% width. Below it: the
 * category in small caps, the name in the display serif, the kana directly
 * under the name, then price and one accent Add that becomes a stepper.
 *
 * There is deliberately no description. A menu board lists the bake and the
 * price; the sentence about it belongs on the product page, and stripping it
 * out is what lets eight cards read as one grid rather than eight paragraphs.
 *
 * Heights are equalised structurally, not by hope: the category line is a
 * single truncated line, the name is clamped to two and reserves both, and the
 * kana never wraps. So the price row lands on the same baseline in every card
 * of a row whether the name is "Fruit Sando" or "Japanese Marble Bread".
 *
 * Hover swaps the `-v1` cutout for `-v2` on a 250ms cross-fade, both frames
 * loaded up front so the second one never pops in late. Where only one
 * revision exists the card falls back to a gentle scale, and on touch — where
 * there is no hover — the resting frame is all anyone ever sees.
 *
 * Sold out keeps the card warm rather than killing it grey: the cutout
 * desaturates halfway and no further, the ground stays card white, and the
 * button becomes a secondary "Notify me". Running out is good news, not a
 * fault, so nothing turns red and nothing leaves the grid. "Few left" is gold
 * type on a paper pill, and never a number.
 */

export type ProductCardStock = {
  soldOut?: boolean;
  /** Renders the gold "Few left" tag when 1–5 remain. Never prints the count. */
  left?: number | null;
  /** "This week" — the weekly-special chip. */
  isNew?: boolean;
  /** Unused in v2: the seal lives on the hero and the PDP, not on a card. */
  bakedToday?: boolean;
};

const SIZES = "(min-width: 1280px) 280px, (min-width: 768px) 30vw, 45vw";

export function ProductCard({
  product,
  stock,
  rowIndex = 0,
  priority = false,
  onNotifyMe,
  className,
}: {
  product: Product;
  stock?: ProductCardStock;
  /** Kept for API compatibility; v2 wells are one tint. */
  rowIndex?: number;
  priority?: boolean;
  onNotifyMe?: (slug: string) => void;
  className?: string;
}) {
  void rowIndex;
  const lines = useCartStore((s) => s.lines);
  const add = useCartStore((s) => s.add);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  // The server cannot see localStorage, so the card renders its empty state
  // until the browser has taken over. Reading the persisted quantity straight
  // out of the store puts a stepper in the client tree where the server put an
  // "Add", and React reports a hydration mismatch.
  const hydrated = useCartHydrated();
  const qty = hydrated ? qtyOf(lines, product.slug) : 0;

  const soldOut = stock?.soldOut ?? false;
  const few =
    !soldOut &&
    typeof stock?.left === "number" &&
    stock.left > 0 &&
    stock.left <= 5;
  const category = getCategoryOf(product);

  // The resting frame is -v1 when it exists, otherwise whatever resolved.
  const variants = cutoutVariants(product.slug);
  const isCutout = product.image?.kind === "cutout";
  const resting = isCutout ? (variants.v1 ?? product.image?.src ?? null) : null;
  const hover =
    isCutout && variants.v2 && variants.v2 !== resting ? variants.v2 : null;

  const cutoutBox = cn(
    "absolute top-1/2 left-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2",
    "object-contain cutout transition-opacity duration-[250ms] ease-[var(--ease-standard)]",
    soldOut && "opacity-80 grayscale-[.5]",
  );

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-card",
        "transition-[box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        "hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {/* -------- Well: 1:1, cutout at 78%, centred ------------------- */}
      <div
        data-surface="well"
        className="relative aspect-square w-full overflow-hidden bg-well"
      >
        <Link
          href={product.href}
          className="absolute inset-0 focus-visible:outline-offset-[-3px]"
          aria-label={product.name}
        >
          {resting ? (
            <>
              <Image
                src={resting}
                alt=""
                width={600}
                height={600}
                priority={priority}
                sizes={SIZES}
                className={cn(
                  cutoutBox,
                  hover
                    ? "group-hover:opacity-0"
                    : cn(
                        "transition-transform duration-[var(--dur-base)]",
                        "group-hover:scale-103 motion-reduce:transform-none",
                      ),
                )}
              />
              {hover ? (
                <Image
                  src={hover}
                  alt=""
                  width={600}
                  height={600}
                  priority={priority}
                  sizes={SIZES}
                  aria-hidden="true"
                  className={cn(cutoutBox, "opacity-0 group-hover:opacity-100")}
                />
              ) : null}
            </>
          ) : product.image ? (
            /* No cutout: the old site's photograph fills the well instead. */
            <Image
              src={product.image.src}
              alt=""
              width={600}
              height={600}
              priority={priority}
              sizes={SIZES}
              className={cn(
                "absolute inset-[7%] size-[86%] rounded-md object-cover",
                "transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                "group-hover:scale-103 motion-reduce:transform-none",
                soldOut && "opacity-80 grayscale-[.5]",
              )}
            />
          ) : (
            <span className="grid size-full place-items-center">
              <LoafGlyph size={112} className="text-muted opacity-60" />
            </span>
          )}
        </Link>

        {/* -------- One tag, top-left. Never two. ------------------------ */}
        {soldOut ? (
          <span className="pointer-events-none absolute top-3 left-3 inline-flex h-6 items-center rounded-pill bg-paper px-2.5 text-[11px] font-medium tracking-[0.08em] text-ink-2 uppercase">
            Sold out today
          </span>
        ) : few ? (
          <span className="pointer-events-none absolute top-3 left-3 inline-flex h-6 items-center rounded-pill bg-paper px-2.5 text-[11px] font-medium tracking-[0.08em] text-gold uppercase">
            Few left
          </span>
        ) : stock?.isNew ? (
          <span className="pointer-events-none absolute top-3 left-3 inline-flex h-6 items-center rounded-pill bg-accent px-2.5 text-[11px] font-medium tracking-[0.08em] text-on-accent uppercase">
            This week
          </span>
        ) : null}
      </div>

      {/* -------- Meta ------------------------------------------------- */}
      <div className="flex flex-1 flex-col p-4 lg:p-5">
        {/* One line each, always. "Pies and strudels" is the longest label in
            the catalogue and is the reason this truncates rather than wraps. */}
        <p className="truncate text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
          {category?.label}
        </p>

        {/* Two lines reserved whether the name needs them or not, so the price
            row sits on one baseline across the row. */}
        <h3 className="mt-1.5 line-clamp-2 min-h-[2lh] font-display text-[20px] leading-[1.15] text-ink lg:text-[22px]">
          <Link href={product.href} className="link-underline">
            {product.name}
          </Link>
        </h3>
        <KanaLabel kana={product.kana} className="mt-0.5 whitespace-nowrap" />

        <div className="mt-auto flex flex-col items-start gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Price amount={product.price} muted={soldOut} />

          {soldOut ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNotifyMe?.(product.slug)}
              className="w-full sm:w-auto"
            >
              Notify me
            </Button>
          ) : qty > 0 ? (
            <QtyStepper
              qty={qty}
              onIncrement={() => increment(product.slug)}
              onDecrement={() => decrement(product.slug)}
              label={`Quantity of ${product.name}`}
            />
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => add(product.slug)}
              aria-label={`Add ${product.name} to your order`}
              className="w-full sm:w-auto"
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

/** 4-up desktop, 2-up mobile, 24px gutters (§3 Shop). */
export function ProductGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

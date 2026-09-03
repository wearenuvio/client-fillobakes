"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/catalog";
import { cutoutVariants } from "@/lib/images";
import { Price } from "@/components/ui/Price";
import { Button } from "@/components/ui/Button";
import { StampBadge } from "@/components/ui/Stamp";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useCartStore, useCartHydrated, qtyOf } from "@/store/cart";

/**
 * ProductCard — the menu-board card (moodboard mb1).
 *
 * A flat square of `--color-well` with the cutout floating on it, and the
 * words underneath on the page's own ground. No white card, no border, no
 * radius on the well: the reference is a printed menu board, where the item
 * is a picture and a line of type and the paper does the rest. Card chrome
 * around each of twenty-three items turned the shop grid into a spreadsheet.
 *
 * Under the well, left-aligned: the name in the display serif, the kana, one
 * attribute line of three words, and the price row. The category label that
 * used to sit above the name is gone — the attribute line says more in the
 * same space, and on a category page the label repeated the tab.
 *
 * Heights are equalised structurally: the name is clamped to two lines and
 * reserves both, the kana and the attribute line never wrap, and the price
 * row is pushed to the bottom by `mt-auto`. So the row of prices lands on one
 * baseline whether the name is "Fruit Sando" or "Japanese Marble Bread".
 *
 * Hover swaps the `-v1` cutout for `-v2` on a 250ms cross-fade, both frames
 * loaded up front. Where only one revision exists the card falls back to a
 * gentle scale, and on touch the resting frame is all anyone ever sees.
 *
 * Sold out is one image and no swap. Cross-fading two stacked frames at
 * reduced opacity used to blend them into a double exposure, which read as a
 * rendering fault rather than as "gone". Now it is a single grey frame at 42%
 * with the tag over it — unmistakable at arm's length, and still warm,
 * because the ground and the type never change.
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

/* -------------------------------------------------------------------------- */
/* The attribute line                                                         */
/* -------------------------------------------------------------------------- */

/** The one thing a customer would say first about this bake. */
const FLAVOUR: [string, string][] = [
  ["spicy", "Spicy"],
  ["chocolate", "Chocolate"],
  ["strawberry", "Strawberry"],
  ["apple", "Apple"],
  ["coffee", "Coffee"],
  ["cardamom", "Cardamom"],
  ["cheese", "Cheese"],
  ["paneer", "Paneer"],
  ["mushroom", "Mushroom"],
  ["garlic", "Garlic"],
  ["nuts", "Nutty"],
  ["fruit", "Fruity"],
  ["mild", "Mild"],
];

/** What the kind feels like, when no flavour tag stands out. */
const TEXTURE: Record<string, string> = {
  breads: "Soft",
  anpan: "Cream-filled",
  karepan: "Crisp",
  "pies-strudels": "Flaky",
  "fruit-sandos": "Chilled",
};

/** What the kind is called, as a fallback second word. */
const NOUN: Record<string, string> = {
  breads: "Milk bread",
  anpan: "An pan",
  karepan: "Kare pan",
  "pies-strudels": "Pastry",
  "fruit-sandos": "Sando",
};

/**
 * Three words, dot separated, derived from the SKU's own tags — never written
 * per product, so a new item in products.json gets a correct line for free.
 * Eggless is always last: it is the one claim the whole catalogue makes and
 * the reason most people are on the page.
 */
function attributes(product: Product): string {
  const tags = new Set(product.tags);
  const category = product.category;

  const flavour =
    FLAVOUR.find(([tag]) => tags.has(tag))?.[1] ?? TEXTURE[category] ?? "Soft";

  let second = tags.has("savory")
    ? "Savoury"
    : tags.has("sweet")
      ? "Sweet"
      : (NOUN[category] ?? "Baked daily");

  // "Spicy · Spicy · Eggless" helps nobody.
  if (second === flavour) second = NOUN[category] ?? "Baked daily";

  return `${flavour} · ${second} · Eggless`;
}

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

  // The resting frame is -v1 when it exists, otherwise whatever resolved.
  const variants = cutoutVariants(product.slug);
  const isCutout = product.image?.kind === "cutout";
  const resting = isCutout ? (variants.v1 ?? product.image?.src ?? null) : null;
  // Sold out never swaps: one frame, greyed, is the whole state.
  const hover =
    !soldOut && isCutout && variants.v2 && variants.v2 !== resting
      ? variants.v2
      : null;

  const cutoutBox = cn(
    "absolute top-1/2 left-1/2 w-[74%] -translate-x-1/2 -translate-y-1/2",
    "object-contain cutout transition-opacity duration-[250ms] ease-[var(--ease-standard)]",
    soldOut && "opacity-[0.42] grayscale",
  );

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-line bg-card",
        "transition-[box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        "hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transform-none",
        className,
      )}
    >
      {/* -------- Well: flat, square, edge to edge, no inner radius ----
          The card keeps its own 10px corner and hairline; the well does not
          add a second one inside it. `overflow-hidden` on the article is what
          rounds the two top corners, so the square meets the card edge
          cleanly on all three sides. */}
      <div
        data-surface="well"
        className={cn(
          "relative aspect-square w-full overflow-hidden bg-well @container",
          "transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        )}
      >
        {/* The Japanese name sits inside the well as a faint watermark behind
            the cutout — large, vertical-centred, never read as a label. */}
        {product.kana ? (
          <span
            aria-hidden="true"
            className="pointer-events-none font-[family-name:var(--font-kana)] absolute inset-0 flex select-none items-center justify-center text-[clamp(22px,13cqw,48px)] leading-none font-medium tracking-[0.04em] text-ink/[0.08] whitespace-nowrap"
          >
            {product.kana}
          </span>
        ) : null}
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
                        !soldOut && "group-hover:scale-103",
                        "motion-reduce:transform-none",
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
                "absolute inset-[7%] size-[86%] object-cover",
                "transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                !soldOut && "group-hover:scale-103",
                "motion-reduce:transform-none",
                soldOut && "opacity-[0.42] grayscale",
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
          <StampBadge className="absolute top-3 left-3">
            Sold out today
          </StampBadge>
        ) : few ? (
          <StampBadge tone="gold" className="absolute top-3 left-3">
            Few left
          </StampBadge>
        ) : stock?.isNew ? (
          <StampBadge tone="accent" className="absolute top-3 left-3">
            This week
          </StampBadge>
        ) : null}
      </div>

      {/* -------- Meta ------------------------------------------------- */}
      <div className="flex flex-1 flex-col p-4 lg:p-5">
        {/* Two lines reserved whether the name needs them or not, so the price
            row sits on one baseline across the row. */}
        <h3 className="line-clamp-2 min-h-[2lh] font-display text-[20px] leading-[1.15] text-ink lg:text-[22px]">
          <Link href={product.href} className="link-underline">
            {product.name}
          </Link>
        </h3>

        {/* Two lines reserved below 640, one from there up. In a 2-up phone
            grid the column is 123px of text and "Cream-filled · Sweet ·
            Eggless" is about 174px, so a single truncated line lost the word
            the whole line exists for. Both states reserve their height, so
            the price row still lands on one baseline across a row. */}
        <p className="mt-1.5 line-clamp-2 min-h-[2lh] text-[12px] text-muted sm:line-clamp-1 sm:min-h-[1lh]">
          {attributes(product)}
        </p>

        {/* One 40px row for the control, whichever control it is, so adding
            an item never nudges the grid. */}
        <div className="mt-auto flex h-10 items-center justify-between gap-3 pt-4">
          <Price amount={product.price} muted={soldOut} />

          {soldOut ? (
            /* "Notify me" beside a price in a 123px phone column overflows
               the card by about 7px. The label drops a word below 640 rather
               than the row wrapping, which would break the shared baseline;
               the full sentence stays in the accessible name. */
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNotifyMe?.(product.slug)}
              aria-label={`Tell me when ${product.name} is back`}
              className="px-3 sm:px-4"
            >
              <span className="sm:hidden">Notify</span>
              <span className="hidden sm:inline">Notify me</span>
            </Button>
          ) : qty > 0 ? (
            <QtyStepper
              qty={qty}
              onIncrement={() => increment(product.slug)}
              onDecrement={() => decrement(product.slug)}
              label={`Quantity of ${product.name}`}
            />
          ) : (
            <button
              type="button"
              onClick={() => add(product.slug)}
              aria-label={`Add ${product.name}`}
              className={cn(
                "inline-flex size-10 shrink-0 items-center justify-center rounded-pill",
                "bg-accent text-on-accent",
                "transition-[background-color,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                "hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0",
                "focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none",
                "motion-reduce:transform-none",
              )}
            >
              <Plus size={20} strokeWidth={2} aria-hidden="true" />
            </button>
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

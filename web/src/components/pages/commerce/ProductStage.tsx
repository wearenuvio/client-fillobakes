"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Stamp } from "@/components/ui/Stamp";
import { Button } from "@/components/ui/Button";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { formatINR } from "@/lib/format";
import { MapPin } from "lucide-react";
import { getArea } from "@/lib/mock";
import { useCartStore, useCartHydrated, qtyOf } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";
import type { ProductImage } from "@/lib/images";

/**
 * The product stage — DESIGN-v2 §3 Product.
 *
 * Left: a 1:1 well with the cutout floating in it, the seal pressed into a
 * corner, and thumbs beneath (v1, v2, one lifestyle photograph). Right: the
 * buy column. Both halves are one client component because the gallery and the
 * stepper are the only interactive things on the page and splitting them costs
 * a second bundle for nothing.
 */

export function ProductGalleryV2({
  images,
  alt,
  soldOut = false,
}: {
  images: ProductImage[];
  alt: string;
  soldOut?: boolean;
}) {
  const [index, setIndex] = React.useState(0);
  const active = images[index];

  return (
    <div>
      {/* The same square well, the same 10px radius and the same ground as a
          ProductCard, so the page reads as the card opened up rather than as a
          second treatment of the same object. */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-well">
        {active ? (
          <Image
            key={active.src}
            src={active.src}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 92vw"
            className={cn(
              active.kind === "cutout"
                ? "scale-[0.78] object-contain cutout"
                // The lifestyle frame is stock, lit cool, and sits grey next
                // to the cutouts. Same warm-up as `.photo-warm` applies to the
                // story photos, written inline because that class also sets
                // `position: relative`, which would break `fill`.
                : "object-cover [filter:sepia(0.18)_saturate(1.05)]",
              soldOut && "opacity-80 grayscale-[.5]",
            )}
          />
        ) : (
          <span className="grid size-full place-items-center">
            <LoafGlyph size={180} className="text-muted opacity-60" />
          </span>
        )}

        {/* The seal needs its own positioned wrapper. `Stamp` puts `relative`
            on its root, and in the generated stylesheet that lands after
            `absolute`, so passing the placement down as a className lost the
            fight and dropped the seal into the top-left corner of the well,
            where `overflow-hidden` cut it in half. */}
        <span className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6">
          <Stamp lines={["baked this", "morning"]} size={72} />
        </span>
      </div>

      {/* Thumbs: one fixed square each, so a tall lifestyle frame and a wide
          cutout still make the same button. */}
      {images.length > 1 ? (
        <ul className="mt-4 flex gap-3">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1} of ${images.length}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border bg-well",
                  "transition-colors duration-[var(--dur-base)]",
                  "focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none",
                  i === index ? "border-ink" : "border-line hover:border-muted",
                )}
              >
                <span className="relative block size-full">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="80px"
                    className={cn(
                      image.kind === "cutout"
                        ? "scale-[0.78] object-contain"
                        : "object-cover [filter:sepia(0.18)_saturate(1.05)]",
                    )}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ProductAddBlock({
  slug,
  name,
  price,
  soldOut = false,
}: {
  slug: string;
  name: string;
  price: number;
  soldOut?: boolean;
}) {
  const lines = useCartStore((s) => s.lines);
  const add = useCartStore((s) => s.add);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const openCart = useCartStore((s) => s.open);
  // Persisted state is invisible to the server: render the empty state until
  // the browser has hydrated, or the button label mismatches.
  const hydrated = useCartHydrated();
  const qty = hydrated ? qtyOf(lines, slug) : 0;

  if (soldOut) {
    return (
      <div>
        <Button variant="secondary" size="lg" fullWidth>
          Tell me when it is back
        </Button>
        <p className="mt-3 text-body-sm text-muted">
          It sold out this morning. We bake it again on the next run.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {qty > 0 ? (
          <QtyStepper
            qty={qty}
            onIncrement={() => increment(slug)}
            onDecrement={() => decrement(slug)}
            label={`Quantity of ${name}`}
          />
        ) : null}
        <Button
          size="lg"
          fullWidth={qty === 0}
          className={qty > 0 ? "flex-1" : undefined}
          onClick={() => {
            add(slug);
            openCart();
          }}
        >
          {qty > 0
            ? `Added — ${formatINR(price * qty)}`
            : `Add to order — ${formatINR(price)}`}
        </Button>
      </div>
      <p className="mt-3 text-[13px] leading-[1.5] text-muted">
        Order by 8pm for tomorrow&rsquo;s delivery.
      </p>
    </div>
  );
}

/**
 * One line saying where this is going, under the button.
 *
 * The page used to carry two full-width lane cards here — home delivery and
 * catch-the-van, each with its own explanation — which asked someone still
 * deciding whether they want the bread to first decide how they want it
 * carried. The lane choice belongs in the cart drawer, next to the order it
 * applies to. What is left is the reassurance: we know where you are, and
 * here is the day.
 *
 * Renders the unset state on the server and the known one after hydration:
 * the area lives in localStorage, so anything else is a hydration mismatch.
 */
export function ProductDeliveryRow() {
  const hydrated = useSessionHydrated();
  const area = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);
  const openCart = useCartStore((s) => s.open);

  const known = hydrated && area && areaStatus !== "unset";
  const days = known ? getArea(area)?.runDaysLabel : null;

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink-2">
      <MapPin
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className="shrink-0 text-muted"
      />
      {known ? (
        <>
          <span>
            Deliver to <span className="text-ink">{area}</span>
            {days ? ` · ${days}` : null}
          </span>
          <button
            type="button"
            onClick={openCart}
            className="link-underline font-semibold text-accent"
          >
            change
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={openCart}
          className="link-underline font-semibold text-accent"
        >
          Set your area
        </button>
      )}
    </p>
  );
}

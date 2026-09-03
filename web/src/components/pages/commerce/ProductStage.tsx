"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Stamp } from "@/components/ui/Stamp";
import { Button } from "@/components/ui/Button";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { formatINR } from "@/lib/format";
import { useCartStore, useCartHydrated, qtyOf } from "@/store/cart";
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
                : "object-cover",
              soldOut && "opacity-80 grayscale-[.5]",
            )}
          />
        ) : (
          <span className="grid size-full place-items-center">
            <LoafGlyph size={180} className="text-muted opacity-60" />
          </span>
        )}

        <Stamp
          lines={["baked this", "morning"]}
          size={96}
          className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6"
        />
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
                        : "object-cover",
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
          className="flex-1"
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
      <p className="mt-3 text-body-sm text-muted">
        Order by 8pm for tomorrow&rsquo;s delivery.
      </p>
    </div>
  );
}

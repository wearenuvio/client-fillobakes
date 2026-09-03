"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { Skeleton } from "@/components/ui/Skeleton";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { COMMERCE } from "@/lib/config";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * The full-page cart.
 *
 * The drawer is the primary surface; this is the deep link, the back button's
 * destination from checkout, and the page for anyone who would rather see the
 * whole order at once. It says exactly what the drawer says — same lines,
 * same delivery row, same meter, same one button — because two surfaces that
 * disagree about a total are worse than one surface.
 */
export function CartPage() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const hydrated = useCartHydrated();
  const sessionReady = useSessionHydrated();

  const lines = useCartStore((s) => s.lines);
  const lane = useSessionStore((s) => s.lane);
  const area = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span
          data-surface="well"
          className="grid size-36 place-items-center rounded-pill bg-well"
        >
          <Image
            src="/images/products/custard-anpan-v1.png"
            alt=""
            width={280}
            height={280}
            sizes="144px"
            className="w-[50%] object-contain cutout-sm"
          />
        </span>
        <p className="mt-7 font-display text-[28px] leading-tight text-ink">
          Nothing in your order yet.
        </p>
        <ButtonLink href="/shop" size="lg" className="mt-6">
          See the menu
        </ButtonLink>
      </div>
    );
  }

  const totals = computeTotals(lines, lane);
  const placed = sessionReady && Boolean(area) && areaStatus === "served";
  const pct = Math.min(
    100,
    Math.round((totals.subtotal / COMMERCE.freeDeliveryThreshold) * 100),
  );

  return (
    <>
      <p className="max-w-[46ch] text-body-lg text-ink-2">
        Delivery is inside the total, so the number here is the number you pay.
      </p>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-14">
        {/* -------- Lines --------------------------------------------- */}
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <CartRow key={line.slug} slug={line.slug} qty={line.qty} />
          ))}
        </ul>

        {/* -------- Summary ------------------------------------------- */}
        <div className="rounded-lg border border-line bg-card p-5 sm:p-6 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          {placed ? (
            <div className="flex items-baseline justify-between gap-4">
              <p className="min-w-0 text-body-sm text-ink-2">
                {lane === "catch_the_van" ? "Catch the van in " : "Deliver to "}
                <span className="text-ink">{area}</span>
              </p>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="link-underline shrink-0 text-body-sm font-semibold text-accent"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-sm text-ink-2">Where should we bring it?</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSheetOpen(true)}
              >
                Set area
              </Button>
            </div>
          )}

          <div className="mt-4">
            <div
              className="h-[3px] w-full overflow-hidden rounded-pill bg-well"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-pill bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-standard)]"
                style={{ width: totals.freeDeliveryEarned ? "100%" : `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-body-sm text-muted tabular">
              {totals.freeDeliveryEarned
                ? "Free delivery"
                : `${formatINR(totals.toFreeDelivery)} more for free delivery`}
            </p>
          </div>

          <dl className="mt-5 border-t border-line pt-5">
            <div className="flex items-baseline justify-between gap-4 py-1">
              <dt className="text-body-sm text-ink-2">Items</dt>
              <dd className="text-body-sm text-ink tabular">
                {formatINR(totals.subtotal)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-1">
              <dt className="text-body-sm text-ink-2">Delivery</dt>
              <dd className="text-body-sm text-ink tabular">
                {totals.delivery === 0 ? "Free" : formatINR(totals.delivery)}
              </dd>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <dt className="text-body text-ink">Total</dt>
              <dd className="font-display text-[26px] leading-none text-ink tabular">
                {formatINR(totals.total)}
              </dd>
            </div>
          </dl>

          <ButtonLink href="/checkout" size="lg" fullWidth className="mt-6">
            Checkout · {formatINR(totals.total)}
          </ButtonLink>
        </div>
      </div>

      <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

function CartRow({ slug, qty }: { slug: string; qty: number }) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const product = getProductBySlug(slug);
  if (!product) return null;

  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      <span
        data-surface="well"
        className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-well sm:size-24"
      >
        {product.image ? (
          <Image
            src={product.image.src}
            alt=""
            width={200}
            height={200}
            sizes="(min-width: 640px) 96px, 80px"
            className={cn(
              product.image.kind === "cutout"
                ? "w-[76%] object-contain cutout-sm"
                : "size-full object-cover",
            )}
          />
        ) : (
          <LoafGlyph size={44} className="text-muted opacity-70" />
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link
          href={product.href}
          className="link-underline font-display text-[21px] leading-tight text-ink"
        >
          {product.name}
        </Link>
        <KanaLabel kana={product.kana} className="mt-0.5" />

        {/* The stepper's own minus becomes a bin at one, so there is no
            second remove control beside it. */}
        <div className="mt-auto pt-4">
          <QtyStepper
            qty={qty}
            onIncrement={() => increment(slug)}
            onDecrement={() => decrement(slug)}
            label={`Quantity of ${product.name}`}
          />
        </div>
      </div>

      <span className="shrink-0 text-body-lg font-semibold text-ink tabular">
        {formatINR(product.price * qty)}
      </span>
    </li>
  );
}

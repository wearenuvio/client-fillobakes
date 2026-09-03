"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useFocusTrap, useLockBodyScroll } from "@/components/ui/overlay";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { COMMERCE } from "@/lib/config";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * Cart drawer — PAGES-v2 "Cart drawer".
 *
 * A right-hand sheet on desktop; on a phone it is a bottom sheet at 90vh with
 * a drag handle, because that is the shape a thumb expects and the shape every
 * other sheet on this site takes.
 *
 * Order of the panel, top to bottom: lines, delivery row, free-delivery meter,
 * totals, one button. The delivery row is here and nowhere earlier — it is the
 * first moment where the answer is load-bearing.
 *
 * The money rule: the total on the button is the total charged. Delivery is
 * inside it, shown once, never "calculated at checkout".
 */

export function CartDrawer({ onChangeLane }: { onChangeLane?: () => void }) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartHydrated();

  const sessionReady = useSessionHydrated();
  const lane = useSessionStore((s) => s.lane);
  const area = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);

  useLockBodyScroll(isOpen);
  useFocusTrap(panelRef, isOpen, close);

  if (!isOpen) return null;

  const totals = computeTotals(lines, lane);
  const empty = hydrated && lines.length === 0;
  const placed = sessionReady && Boolean(area) && areaStatus === "served";
  const laneFree = lane === "catch_the_van";

  return (
    <div className="fixed inset-0 z-[var(--z-drawer)]">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 w-full cursor-default bg-scrim motion-safe:animate-[fade_var(--dur-base)_var(--ease-standard)]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        tabIndex={-1}
        className={cn(
          "absolute inset-x-0 bottom-0 flex h-[90vh] flex-col bg-card outline-none",
          "rounded-t-xl shadow-overlay",
          "motion-safe:animate-[sheet-in_var(--dur-slow)_var(--ease-out)]",
          // From 640px it becomes the right-hand sheet.
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-auto sm:w-[min(440px,100vw)]",
          "sm:rounded-t-none sm:rounded-l-xl",
          "sm:motion-safe:animate-[drawer-in_var(--dur-slow)_var(--ease-out)]",
        )}
      >
        {/* -------- Drag handle, phone only --------------------------- */}
        <div className="flex shrink-0 justify-center pt-3 sm:hidden">
          <span aria-hidden="true" className="h-1 w-10 rounded-pill bg-line" />
        </div>

        {/* -------- Header -------------------------------------------- */}
        <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-4 pb-5 sm:pt-6">
          <div>
            <h2 className="font-display text-[28px] leading-none text-ink">
              Your order
            </h2>
            {!empty ? (
              <p className="mt-2 text-body-sm text-muted tabular">
                {totals.count} {totals.count === 1 ? "item" : "items"}
              </p>
            ) : null}
          </div>
          <IconButton label="Close your order" onClick={close}>
            <X size={24} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
        </div>

        {empty ? (
          <EmptyOrder onClose={close} />
        ) : (
          <>
            {/* -------- Lines ---------------------------------------- */}
            <div className="min-h-0 flex-1 overflow-y-auto border-t border-line">
              <ul className="divide-y divide-line px-6">
                {lines.map((line) => (
                  <CartLine key={line.slug} slug={line.slug} qty={line.qty} />
                ))}
              </ul>
            </div>

            {/* -------- Foot ----------------------------------------- */}
            <div className="shrink-0 border-t border-line bg-paper px-6 pt-4 pb-6">
              {/* Delivery row */}
              {placed ? (
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 text-body-sm text-ink-2">
                    {laneFree ? "Catch the van in " : "Deliver to "}
                    <span className="text-ink">{area}</span>
                  </p>
                  <button
                    type="button"
                    onClick={onChangeLane}
                    className="link-underline shrink-0 text-body-sm font-semibold text-accent"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-body-sm text-ink-2">
                    Where should we bring it?
                  </p>
                  <Button variant="secondary" size="sm" onClick={onChangeLane}>
                    Set area
                  </Button>
                </div>
              )}

              {/* Free-delivery meter */}
              <FreeDeliveryMeter
                subtotal={totals.subtotal}
                earned={totals.freeDeliveryEarned}
                shortfall={totals.toFreeDelivery}
              />

              {/* Totals */}
              <dl className="mt-4 border-t border-line pt-4">
                <SummaryRow label="Items" value={formatINR(totals.subtotal)} />
                <SummaryRow
                  label="Delivery"
                  value={
                    totals.delivery === 0 ? "Free" : formatINR(totals.delivery)
                  }
                />
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <dt className="text-body text-ink">Total</dt>
                  <dd className="font-display text-[24px] leading-none text-ink tabular">
                    {formatINR(totals.total)}
                  </dd>
                </div>
              </dl>

              <ButtonLink
                href="/checkout"
                size="lg"
                fullWidth
                onClick={close}
                className="mt-5"
              >
                Checkout · {formatINR(totals.total)}
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * The meter. A 3px track and one line of copy — and once it is reached the
 * copy becomes the reward rather than disappearing, so the bar earns its
 * place instead of blinking out of existence at the finish line.
 */
function FreeDeliveryMeter({
  subtotal,
  earned,
  shortfall,
}: {
  subtotal: number;
  earned: boolean;
  shortfall: number;
}) {
  const pct = Math.min(
    100,
    Math.round((subtotal / COMMERCE.freeDeliveryThreshold) * 100),
  );

  return (
    <div className="mt-4">
      <div
        className="h-[3px] w-full overflow-hidden rounded-pill bg-well"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-pill bg-accent transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-standard)]"
          style={{ width: earned ? "100%" : `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-body-sm text-muted tabular">
        {earned
          ? "Free delivery"
          : `${formatINR(shortfall)} more for free delivery`}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="text-body-sm text-ink-2">{label}</dt>
      <dd className="text-body-sm text-ink tabular">{value}</dd>
    </div>
  );
}

/** Empty: one cutout at half size, one sentence, one button. */
function EmptyOrder({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-12 text-center">
      <span
        data-surface="well"
        className="grid size-32 place-items-center rounded-pill bg-well"
      >
        <Image
          src="/images/products/custard-anpan-v1.png"
          alt=""
          width={240}
          height={240}
          sizes="128px"
          className="w-[50%] object-contain cutout-sm"
        />
      </span>
      <p className="mt-6 font-display text-[24px] leading-tight text-ink">
        Nothing in your order yet.
      </p>
      <ButtonLink href="/shop" size="lg" className="mt-6" onClick={onClose}>
        See the menu
      </ButtonLink>
    </div>
  );
}

function CartLine({ slug, qty }: { slug: string; qty: number }) {
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const product = getProductBySlug(slug);
  if (!product) return null;

  return (
    <li className="flex gap-4 py-4">
      <span
        data-surface="well"
        className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-well"
      >
        {product.image ? (
          <Image
            src={product.image.src}
            alt=""
            width={160}
            height={160}
            sizes="64px"
            className={
              product.image.kind === "cutout"
                ? "w-[76%] object-contain cutout-sm"
                : "size-full object-cover"
            }
          />
        ) : (
          <LoafGlyph size={36} className="text-muted opacity-70" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <Link
          href={product.href}
          className="link-underline block truncate font-display text-[19px] leading-tight text-ink"
        >
          {product.name}
        </Link>
        <KanaLabel kana={product.kana} className="mt-0.5" />
        <div className="mt-2.5">
          <QtyStepper
            qty={qty}
            onIncrement={() => increment(slug)}
            onDecrement={() => decrement(slug)}
            label={`Quantity of ${product.name}`}
          />
        </div>
      </div>

      <Price amount={product.price * qty} size="sm" className="shrink-0 pt-0.5" />
    </li>
  );
}

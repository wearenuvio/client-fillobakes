"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Coins, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoafGlyph } from "@/components/ui/LineArt";
import { FulfilmentSummary } from "@/components/blocks/FulfilmentLane";
import { useFocusTrap, useLockBodyScroll } from "@/components/ui/overlay";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR, formatTimeBandShort, weekdayName } from "@/lib/format";
import { COMMERCE } from "@/lib/config";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore } from "@/store/session";

/**
 * Cart drawer — DESIGN.md §12.7.
 *
 * Right-side panel, `min(440px, 100vw)`, paper-0, rounded on the left corners,
 * `--shadow-overlay`, over a navy scrim. Focus trapped, Esc closes, the
 * trigger regains focus on close.
 *
 * The money rule (DECISIONS.md §5): the total shown here is the total charged.
 * Delivery is inside it. Free-delivery progress is a 3px paper-200 track with
 * a kiln fill — kiln, never danger, at any level.
 */

export function CartDrawer({ onChangeLane }: { onChangeLane?: () => void }) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartHydrated();

  const lane = useSessionStore((s) => s.lane);
  const area = useSessionStore((s) => s.area);
  const date = useSessionStore((s) => s.date);
  const band = useSessionStore((s) => s.band);

  useLockBodyScroll(isOpen);
  useFocusTrap(panelRef, isOpen, close);

  if (!isOpen) return null;

  const totals = computeTotals(lines, lane);
  const empty = hydrated && lines.length === 0;

  const laneDetail = [
    date ? weekdayName(date) : null,
    area,
    band ? formatTimeBandShort(band) : null,
  ]
    .filter(Boolean)
    .join(" · ");

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
          "absolute inset-y-0 right-0 flex w-[min(440px,100vw)] flex-col bg-paper-0",
          "rounded-l-lg shadow-overlay outline-none",
          "motion-safe:animate-[drawer-in_var(--dur-slow)_var(--ease-out)]",
        )}
      >
        {/* -------- Header ------------------------------------------------ */}
        <div className="flex items-start justify-between gap-4 border-b border-paper-300 p-6">
          <div>
            <h2 className="text-display-sm">Your order</h2>
            <p className="micro mt-1 text-ink-500 tabular">
              {totals.count} {totals.count === 1 ? "ITEM" : "ITEMS"}
            </p>
          </div>
          <IconButton label="Close the box" onClick={close}>
            <X size={24} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
        </div>

        {/* -------- Lines -------------------------------------------------- */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {empty ? (
            <EmptyState
              title="Nothing in the box yet."
              body="This week we've got milk bread, custard an pan and three kinds of pastry."
              glyph={<LoafGlyph size={96} />}
              action={
                <ButtonLink href="/shop" variant="secondary" size="md" onClick={close}>
                  See this week&rsquo;s bake
                </ButtonLink>
              }
            />
          ) : (
            <ul className="divide-y divide-paper-300 px-6">
              {lines.map((line) => (
                <CartLine key={line.slug} slug={line.slug} qty={line.qty} />
              ))}
            </ul>
          )}
        </div>

        {!empty ? (
          <>
            {/* -------- Summary -------------------------------------------- */}
            <div className="border-t border-paper-300 px-6 py-4">
              <SummaryRow label="Subtotal" value={formatINR(totals.subtotal)} />
              <SummaryRow
                label="Delivery"
                value={totals.delivery === 0 ? "Free" : formatINR(totals.delivery)}
              />
              <div className="mt-3 flex items-center gap-2 text-caption text-ink-500">
                <Coins size={16} strokeWidth={1.5} aria-hidden="true" className="text-crumb-ink" />
                <span className="tabular">
                  Earns {totals.coinsEarned} coins
                </span>
              </div>
            </div>

            {/* -------- Fulfilment row, directly above the footer ---------- */}
            <div className="px-6">
              {lane ? (
                <FulfilmentSummary
                  lane={lane}
                  detail={laneDetail || "Pick a day and a window"}
                  onChange={onChangeLane}
                />
              ) : (
                <div className="border-t border-paper-300 py-3">
                  <p className="text-body-sm text-ink-600">
                    Set your area to check out.
                  </p>
                  <Button variant="secondary" size="sm" className="mt-2" onClick={onChangeLane}>
                    Set your area
                  </Button>
                </div>
              )}
            </div>

            {/* -------- Footer --------------------------------------------- */}
            <div className="sticky bottom-0 border-t border-paper-300 bg-paper-50 p-6">
              {!totals.freeDeliveryEarned ? (
                <div className="mb-4">
                  <div className="h-[3px] w-full bg-paper-200" aria-hidden="true">
                    <div
                      className="h-full bg-kiln"
                      style={{
                        width: `${Math.min(
                          100,
                          (totals.subtotal / COMMERCE.freeDeliveryThreshold) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="micro mt-2 text-ink-500 tabular">
                    {formatINR(totals.toFreeDelivery)} MORE FOR FREE DELIVERY
                  </p>
                </div>
              ) : null}

              <ButtonLink
                href="/checkout"
                size="lg"
                fullWidth
                onClick={close}
                className={cn(!lane && "pointer-events-none opacity-50")}
                aria-disabled={!lane || undefined}
              >
                Checkout · {formatINR(totals.total)}
              </ButtonLink>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 py-1">
      <span className="text-body-sm text-ink-600">{label}</span>
      <span className="dot-leader" aria-hidden="true" />
      <span className="text-body-sm text-ink-800 tabular">{value}</span>
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
        className="grid size-18 shrink-0 place-items-center bg-paper-200"
      >
        {product.image ? (
          <Image
            src={product.image.src}
            alt=""
            width={144}
            height={144}
            sizes="72px"
            className="w-[70%] object-contain"
          />
        ) : (
          <LoafGlyph size={40} className="opacity-70" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <Link
          href={product.href}
          className="link-underline block truncate text-body font-semibold text-ink-800"
        >
          {product.name}
        </Link>
        <KanaLabel kana={product.kana} />
        <div className="mt-2">
          <QtyStepper
            qty={qty}
            onIncrement={() => increment(slug)}
            onDecrement={() => decrement(slug)}
            label={`Quantity of ${product.name}`}
          />
        </div>
      </div>

      <Price amount={product.price * qty} size="sm" className="shrink-0" />
    </li>
  );
}

/**
 * Cross-sell strip (§12.7) — one item, above the summary. A 56px well, a nano
 * label, name, price and a 28px circular plus.
 */
export function CrossSellStrip({ slug }: { slug: string }) {
  const add = useCartStore((s) => s.add);
  const product = getProductBySlug(slug);
  if (!product) return null;

  return (
    <div className="flex items-center gap-3 border-t border-paper-300 px-6 py-3">
      <span
        data-surface="well"
        className="grid size-14 shrink-0 place-items-center bg-paper-200"
      >
        {product.image ? (
          <Image
            src={product.image.src}
            alt=""
            width={112}
            height={112}
            sizes="56px"
            className="w-[70%] object-contain"
          />
        ) : (
          <LoafGlyph size={32} className="opacity-70" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="nano text-ink-500">ADD A LOAF?</p>
        <p className="truncate text-body-sm font-semibold text-ink-800">{product.name}</p>
      </div>
      <Price amount={product.price} size="sm" />
      <button
        type="button"
        onClick={() => add(product.slug)}
        aria-label={`Add ${product.name} to the box`}
        className="relative grid size-7 shrink-0 place-items-center rounded-pill border-[1.5px] border-ink-800 text-ink-800 after:absolute after:size-11 after:content-['']"
      >
        <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

"use client";

import * as React from "react";
import { AlertCircle, Coins } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { Rule } from "@/components/ui/Rule";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoafGlyph } from "@/components/ui/LineArt";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { FulfilmentSummary } from "@/components/blocks/FulfilmentLane";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { CartLines } from "@/components/pages/commerce/CartLines";
import { HoldTimer } from "@/components/pages/commerce/HoldTimer";
import type { RunView } from "@/components/pages/commerce/types";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR, formatTimeBandShort, pluralise, weekdayName } from "@/lib/format";
import { COMMERCE } from "@/lib/config";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * The full-page cart. The drawer is the primary surface (§12.7); this is the
 * deep-link target and the page for people who would rather see it all at once.
 *
 * The money rule is the same one everywhere: `computeTotals` is the source of
 * truth, delivery is inside the total, and the number here is the number
 * checkout charges (DECISIONS.md §5).
 */
export function CartPage({
  runs,
  areaRuns,
  runCarries,
  soldOutSlugs,
  onVanSlugs,
  suggestions,
  holdCopy,
  holdMinutes,
  coins,
}: {
  runs: RunView[];
  areaRuns: Record<string, string>;
  /** Run id -> the slugs that run carries. */
  runCarries: Record<string, string[]>;
  /** Slugs the van has run out of, from the real on-board counts. */
  soldOutSlugs: string[];
  /** Slugs with a live remaining count — the only real hold there is. */
  onVanSlugs: string[];
  /** "You might also like" — pairings resolved on the server. */
  suggestions: string[];
  holdCopy: { running: string; expiringSoon: string; expired: string };
  holdMinutes: number;
  coins: { balance: number; threshold: number; value: number; progress: string };
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const hydrated = useCartHydrated();
  const sessionHydrated = useSessionHydrated();

  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const lane = useSessionStore((s) => s.lane);
  const area = useSessionStore((s) => s.area);
  const date = useSessionStore((s) => s.date);
  const band = useSessionStore((s) => s.band);

  if (!hydrated) {
    return (
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <>
        <EmptyState
          title="Nothing in the box yet."
          body="This week we’ve got milk bread, custard an pan and three kinds of pastry."
          glyph={<LoafGlyph size={96} />}
          action={
            <ButtonLink href="/shop" variant="secondary" size="md">
              See this week’s bake
            </ButtonLink>
          }
        />
        {/* Never a dead end: the menu rail sits under the empty state. */}
        <div className="mt-8">
          <Rule label="On the van this week" tone="strong" />
          <ProductGrid className="mt-8">
            {suggestions.map((slug) => {
              const product = getProductBySlug(slug);
              if (!product) return null;
              return (
                <ProductCard
                  key={slug}
                  product={{ ...product, href: `/product/${slug}` }}
                  stock={{ soldOut: soldOutSlugs.includes(slug) }}
                />
              );
            })}
          </ProductGrid>
        </div>
      </>
    );
  }

  const totals = computeTotals(lines, lane);
  const run = area ? runs.find((r) => r.id === areaRuns[area]) : undefined;
  const goneInCart = lines.filter((l) => soldOutSlugs.includes(l.slug));
  const carried = run ? (runCarries[run.id] ?? []) : [];
  const offRun = run
    ? lines.filter(
        (l) => !soldOutSlugs.includes(l.slug) && !carried.includes(l.slug),
      )
    : [];
  const holdable = lines.some((l) => onVanSlugs.includes(l.slug));
  const coinsShort = Math.max(0, coins.threshold - coins.balance);

  const laneDetail = [
    date ? weekdayName(date) : run?.nextDayLabel,
    area,
    band ? formatTimeBandShort(band) : run?.bandLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  const suggested = suggestions.filter((s) => !lines.some((l) => l.slug === s)).slice(0, 4);

  return (
    <>
      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {/* -------- The two things that can go wrong in a cart -------- */}
          {goneInCart.length > 0 ? (
            <div className="mb-6 rounded-md bg-warning-tint p-4">
              <p className="flex items-start gap-2 text-body text-warning">
                <AlertCircle
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
                We sold the last one while you were deciding. Remove it, or swap for the
                Custard An Pan.
              </p>
              <div className="mt-3 flex flex-wrap gap-3 pl-7">
                {goneInCart.map((line) => (
                  <Button
                    key={line.slug}
                    variant="secondary"
                    size="sm"
                    onClick={() => remove(line.slug)}
                  >
                    Remove {getProductBySlug(line.slug)?.name ?? line.slug}
                  </Button>
                ))}
                <ButtonLink href="/product/custard-an-pan" variant="ghost" size="sm">
                  See the Custard An Pan
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {offRun.length > 0 && run ? (
            <div className="mb-6 rounded-md bg-paper-200 p-4">
              <p className="text-body text-ink-800">
                {offRun
                  .map((l) => getProductBySlug(l.slug)?.name)
                  .filter(Boolean)
                  .join(", ")}{" "}
                {offRun.length === 1 ? "isn’t" : "aren’t"} on the {run.shortName} run.
                Switch runs, or take {offRun.length === 1 ? "it" : "them"} off.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => setSheetOpen(true)}
              >
                Change your run
              </Button>
            </div>
          ) : null}

          {holdable ? (
            <HoldTimer
              className="mb-6"
              holdMinutes={holdMinutes}
              running={holdCopy.running}
              expiringSoon={holdCopy.expiringSoon}
              expired={holdCopy.expired}
            />
          ) : null}

          <CartLines lines={lines} soldOut={soldOutSlugs} />
        </div>

        {/* -------- The money, on the right, sticky at desktop ---------- */}
        <div className="lg:col-span-5">
          <div className="rounded-lg border border-paper-300 bg-paper-0 p-6 lg:sticky lg:top-24">
            <h2 className="text-display-sm text-ink-800">
              {pluralise(totals.count, "item")}
            </h2>

            <dl className="mt-6">
              <SummaryRow label="Subtotal" value={formatINR(totals.subtotal)} />
              <SummaryRow
                label="Delivery"
                value={
                  totals.delivery === 0
                    ? lane === "catch_the_van"
                      ? "Free — you’re catching the van"
                      : "Free"
                    : formatINR(totals.delivery)
                }
              />
              <div className="mt-3 border-t border-t-paper-300 pt-3">
                <div className="flex items-baseline gap-3">
                  <dt className="text-body font-semibold text-ink-800">
                    Total, including delivery
                  </dt>
                  <span className="dot-leader" aria-hidden="true" />
                  <dd>
                    <Price amount={totals.total} size="md" />
                  </dd>
                </div>
              </div>
            </dl>

            {/* -------- Coins: the real balance, and the real gap ------- */}
            <p className="mt-4 flex items-start gap-2 text-body-sm text-ink-600">
              <Coins
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-1 shrink-0 text-crumb-ink"
              />
              <span className="tabular">
                {coins.balance >= coins.threshold
                  ? `You can take ${formatINR(coins.value)} off at checkout.`
                  : `${coins.balance} coins. ${coinsShort} more and you can take ${formatINR(
                      coins.value,
                    )} off.`}{" "}
                This order earns {totals.coinsEarned}.
              </span>
            </p>

            {/* -------- Free-delivery progress: kiln, never danger ------ */}
            {!totals.freeDeliveryEarned ? (
              <div className="mt-6">
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

            {/* -------- Lane, day and window, restated ----------------- */}
            {sessionHydrated && lane ? (
              <FulfilmentSummary
                className="mt-6"
                lane={lane}
                detail={laneDetail || "Pick a day and a window"}
                onChange={() => setSheetOpen(true)}
              />
            ) : (
              <div className="mt-6 border-t border-t-paper-300 pt-4">
                <p className="text-body-sm text-ink-600">Set your area to check out.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSheetOpen(true)}
                >
                  Set your area
                </Button>
              </div>
            )}

            <ButtonLink
              href="/checkout"
              size="lg"
              fullWidth
              className={cn("mt-6 tabular", !lane && "pointer-events-none opacity-50")}
              aria-disabled={!lane || undefined}
            >
              Checkout · {formatINR(totals.total)}
            </ButtonLink>

            {run ? (
              <p className="mt-3 text-caption text-ink-500">{run.cutoffLine}</p>
            ) : null}
          </div>
        </div>
      </div>

      {suggested.length > 0 ? (
        <div className="mt-20">
          <Rule label="You might also like" tone="strong" />
          <ProductGrid className="mt-8">
            {suggested.map((slug) => {
              const product = getProductBySlug(slug);
              if (!product) return null;
              return (
                <ProductCard
                  key={slug}
                  product={{ ...product, href: `/product/${slug}` }}
                  stock={{ soldOut: soldOutSlugs.includes(slug) }}
                />
              );
            })}
          </ProductGrid>
        </div>
      ) : null}

      <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 py-1">
      <dt className="text-body-sm text-ink-600">{label}</dt>
      <span className="dot-leader" aria-hidden="true" />
      <dd className="text-body-sm text-ink-800 tabular">{value}</dd>
    </div>
  );
}

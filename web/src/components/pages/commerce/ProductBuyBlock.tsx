"use client";

import * as React from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { useToast } from "@/components/ui/Toast";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { FulfilmentLane } from "@/components/blocks/FulfilmentLane";
import { formatINR, formatTimeBand } from "@/lib/format";
import { COMMERCE } from "@/lib/config";
import { useCartStore, useCartHydrated, qtyOf } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";
import type { RunView } from "@/components/pages/commerce/types";

/**
 * The PDP buy block.
 *
 * Order is the argument (journey §3.3): the availability answer, then the
 * cut-off, then the button. The lane selector sits directly under the button
 * with its price attached (§12.29), so route and window are settled before
 * checkout rather than sprung at the end.
 *
 * Sold out is written as three separate strings in three separate slots —
 * status, cause, promise (§12.27) — and is never styled as an error.
 */
export function ProductBuyBlock({
  slug,
  name,
  price,
  runs,
  areaRuns,
  onRuns,
  soldOut,
  left,
  defaultRunId,
}: {
  slug: string;
  name: string;
  price: number;
  runs: RunView[];
  /** Area name -> the run id that serves it. */
  areaRuns: Record<string, string>;
  /** Run ids that carry this SKU. */
  onRuns: string[];
  soldOut: boolean;
  left: number | null;
  defaultRunId: string;
}) {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [pending, setPending] = React.useState(1);

  const cartHydrated = useCartHydrated();
  const sessionHydrated = useSessionHydrated();
  const lines = useCartStore((s) => s.lines);
  const add = useCartStore((s) => s.add);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const openCart = useCartStore((s) => s.open);

  const area = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);
  const lane = useSessionStore((s) => s.lane);
  const setLane = useSessionStore((s) => s.setLane);

  const inCart = cartHydrated ? qtyOf(lines, slug) : 0;
  const areaSet = sessionHydrated && Boolean(area) && areaStatus === "served";

  const run =
    runs.find((r) =>
      areaSet
        ? lane === "home_delivery"
          ? r.id === "home_delivery"
          : r.id === (area ? areaRuns[area] : undefined)
        : r.id === defaultRunId,
    ) ??
    runs.find((r) => r.id === defaultRunId) ??
    runs[0];

  const onThisRun = onRuns.includes(run.id);
  const elsewhere = runs.find((r) => r.id !== run.id && onRuns.includes(r.id));

  const routeLine = areaSet
    ? [run.nextDayLabel, run.shortName, run.bandLabel ?? "two-hour window"]
        .filter(Boolean)
        .join(" · ")
    : "Check where we can bring this";

  const honestCount =
    !soldOut && typeof left === "number" && left > 0 && left <= 10
      ? run.lane === "home_delivery"
        ? `Only ${left} left for ${run.nextDayLabel ?? "the next run"}`
        : `Only ${left} on ${run.nextDayLabel ?? "the next"}${
            run.nextDayLabel ? "’s" : ""
          } van`
      : null;

  function handleAdd() {
    add(slug, pending);
    openCart();
  }

  return (
    <div>
      {/* -------- 5. Route line — the availability answer, inline --------- */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className={cn(
          "flex min-h-11 w-full items-center gap-2 rounded-sm border border-paper-400 bg-paper-0",
          "px-4 py-2 text-left text-body-sm text-ink-800",
          "transition-colors duration-[var(--dur-fast)] hover:border-ink-600",
        )}
      >
        <MapPin size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
        <span className="min-w-0 flex-1 truncate tabular">{routeLine}</span>
        <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-ink-500" />
      </button>

      {/* -------- Not on this run: name the run it is on ------------------ */}
      {!onThisRun ? (
        <div className="mt-4 rounded-md bg-paper-200 p-4">
          <p className="text-body font-semibold text-ink-800">
            {elsewhere
              ? `On ${elsewhere.nextDayLabel ?? "the next"}${
                  elsewhere.nextDayLabel ? "’s" : ""
                } ${elsewhere.shortName} run.`
              : "Not on a van run this week."}
          </p>
          <p className="mt-1 text-body-sm text-ink-600">
            It isn’t going out on the {run.shortName} run. You can still add it and pick
            that run at checkout.
          </p>
        </div>
      ) : null}

      {soldOut ? (
        /* -------- Sold out: status, cause, promise ---------------------- */
        <div className="mt-6">
          <p className="font-display text-display-sm text-ink-800">
            Gone for this week. We bake again Saturday.
          </p>
          <p className="mt-3 text-body text-ink-600">
            The van carries what the oven makes, and this one went. No restocks, it is a
            van.
          </p>
          <Button
            size="lg"
            fullWidth
            className="mt-6"
            onClick={() =>
              toast({
                message: "Done. You’ll hear before anyone else does.",
                tone: "success",
              })
            }
          >
            Tell me when the van’s back out
          </Button>
          <p className="mt-2 text-caption text-ink-500">
            One message, Sunday morning. Nothing else.
          </p>
        </div>
      ) : (
        <>
          {/* -------- 6. Cut-off line, directly above the button --------- */}
          <p className="mt-6 text-body-sm text-danger">{run.cutoffLine}</p>

          {/* -------- 7. Quantity and Add ------------------------------- */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {inCart > 0 ? (
              <>
                <QtyStepper
                  qty={inCart}
                  onIncrement={() => increment(slug)}
                  onDecrement={() => decrement(slug)}
                  label={`Quantity of ${name} in your box`}
                />
                <Button variant="secondary" size="lg" onClick={openCart}>
                  In your box · see it
                </Button>
              </>
            ) : (
              <>
                <QtyStepper
                  qty={pending}
                  onIncrement={() =>
                    setPending((q) => Math.min(COMMERCE.maxPerLine, q + 1))
                  }
                  onDecrement={() => setPending((q) => Math.max(1, q - 1))}
                  label={`How many ${name}`}
                />
                <Button size="lg" onClick={handleAdd} className="tabular">
                  Add · {formatINR(price * pending)}
                </Button>
              </>
            )}
          </div>

          {/* -------- 8. Honest count, only at ten or fewer -------------- */}
          {honestCount ? (
            <p className="mt-3 text-body-sm text-warning tabular">{honestCount}</p>
          ) : null}
        </>
      )}

      {/* -------- The lane selector, directly under the button ----------- */}
      <div className="mt-8">
        <p className="micro mb-3 text-ink-500">Where the van meets you</p>
        <FulfilmentLane
          options={[
            {
              id: "catch_the_van",
              detail: laneDetail(runs, areaRuns, area, "catch_the_van"),
            },
            {
              id: "home_delivery",
              detail: laneDetail(runs, areaRuns, area, "home_delivery"),
            },
          ]}
          value={lane}
          onChange={setLane}
          areaSet={areaSet}
          onCheckArea={() => setSheetOpen(true)}
        />
      </div>

      {/* -------- Sticky buy bar, mobile only ---------------------------- */}
      {!soldOut ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-paper-300",
            "bg-paper-0 md:hidden",
          )}
        >
          <div className="container-content flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm font-semibold text-ink-800">{name}</p>
              <p className="truncate text-caption text-danger">{run.cutoffLine}</p>
            </div>
            {inCart > 0 ? (
              <Button size="md" variant="secondary" onClick={openCart} className="shrink-0">
                In your box
              </Button>
            ) : (
              <Button size="md" onClick={handleAdd} className="shrink-0 tabular">
                Add · {formatINR(price * pending)}
              </Button>
            )}
          </div>
        </div>
      ) : null}

      <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}

/** "Saturday · Indiranagar · 4:40–5:10 PM" for each lane card. */
function laneDetail(
  runs: RunView[],
  areaRuns: Record<string, string>,
  area: string | null,
  lane: "catch_the_van" | "home_delivery",
): string {
  if (lane === "home_delivery") {
    const run = runs.find((r) => r.id === "home_delivery");
    return [run?.nextDayLabel, area, formatTimeBand("16:00-18:00")]
      .filter(Boolean)
      .join(" · ");
  }
  const run = area ? runs.find((r) => r.id === areaRuns[area]) : undefined;
  const stop = run?.stops[run.stops.length - 1];
  return [run?.nextDayLabel, stop?.name, stop?.bandLabel].filter(Boolean).join(" · ");
}

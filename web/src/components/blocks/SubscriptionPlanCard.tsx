import * as React from "react";
import { AlertCircle, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";

/**
 * SubscriptionPlanCard — DESIGN.md §12.18, for The Standing Order.
 *
 * The load-bearing behavioural rule: **a subscription to a weekly run must be
 * trivially escapable, or people will not start one.** Skip and pause live on
 * the current-plan card itself, never behind a "Manage" page, never behind a
 * retention interstitial, and never in `--color-danger` — skipping a week is
 * not a destructive act.
 *
 * The recommended plan does NOT scale up and does not gain a shadow; it earns
 * its emphasis from a paper-100 surface, a 1.5px ink border and one badge.
 */

export type PlanState = "default" | "recommended" | "current" | "paused";

export function SubscriptionPlanCard({
  planName,
  cadence,
  price,
  priceSuffix = "/ week",
  benefits,
  state = "default",
  /**
   * The label on the recommended card. There is no "most popular" data behind
   * this product yet (DECISIONS §10), so the page supplies a claim it can
   * support and the card asserts nothing on its own.
   */
  badge,
  /** Shown under the amount when the price is an estimate, not founder-set. */
  priceNote,
  action,
  /** Current plan only. */
  nextDelivery,
  onChangeNext,
  onSkip,
  onPause,
  onResume,
  skipped,
  onUndoSkip,
  /** "PAUSED · BACK 3 NOV" */
  pausedLabel,
  /** A banner above the controls: payment failed, route changed, out of stock. */
  banner,
  cutoffNotice,
  className,
}: {
  planName: string;
  cadence: React.ReactNode;
  price: number;
  priceSuffix?: string;
  benefits: string[];
  state?: PlanState;
  badge?: React.ReactNode;
  priceNote?: React.ReactNode;
  action?: React.ReactNode;
  nextDelivery?: React.ReactNode;
  onChangeNext?: () => void;
  onSkip?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  skipped?: React.ReactNode;
  onUndoSkip?: () => void;
  pausedLabel?: string;
  banner?: React.ReactNode;
  cutoffNotice?: React.ReactNode;
  className?: string;
}) {
  const isCurrent = state === "current" || state === "paused";
  const paused = state === "paused";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg p-8 transition-[transform,box-shadow]",
        "duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
        state === "recommended"
          ? "border-[1.5px] border-ink-800 bg-paper-100"
          : paused
            ? "border border-paper-300 bg-paper-100"
            : state === "current"
              ? "border border-success bg-paper-0"
              : "border border-paper-300 bg-paper-0 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {state === "recommended" && badge ? (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <Badge variant="solid">{badge}</Badge>
        </span>
      ) : null}

      {state === "current" ? (
        <span className="absolute -top-2.5 left-8">
          <Badge variant="outline">Your plan</Badge>
        </span>
      ) : null}

      {paused ? (
        <span className="absolute -top-2.5 left-8">
          <Badge variant="solid">{pausedLabel ?? "Paused"}</Badge>
        </span>
      ) : null}

      <p className="micro text-kiln">{planName}</p>
      <p className="mt-2 font-display text-display-sm text-ink-800">{cadence}</p>

      <p className="mt-4 flex items-baseline gap-2">
        <Price amount={price} size="xl" />
        <span className="text-body-sm text-ink-500">{priceSuffix}</span>
      </p>
      {priceNote ? (
        <p className="micro mt-1 text-ink-500">{priceNote}</p>
      ) : null}

      <hr className="my-6 h-px border-0 bg-paper-300" />

      <ul className="space-y-3">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <Check
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className={cn("mt-1 shrink-0", paused ? "text-ink-400" : "text-success")}
            />
            <span className={cn("text-body-sm", paused ? "text-ink-500" : "text-ink-600")}>
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {paused ? (
          <Button size="md" fullWidth onClick={onResume}>
            Resume now
          </Button>
        ) : (
          (action ?? (
            <Button size="md" fullWidth>
              {isCurrent ? "Manage" : "Choose this one"}
            </Button>
          ))
        )}
      </div>

      {/* -------- Current plan: escape controls, never hidden ------------ */}
      {isCurrent ? (
        <>
          <hr className="my-6 h-px border-0 bg-paper-300" />

          {banner ? (
            <p className="mb-4 flex items-start gap-2 rounded-md bg-warning-tint p-3 text-body-sm text-warning">
              <AlertCircle
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              {banner}
            </p>
          ) : null}

          {nextDelivery ? (
            <div className="flex flex-wrap items-center gap-3">
              <Calendar
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="shrink-0 text-ink-600"
              />
              <span className="text-body-sm font-semibold text-ink-800">
                {nextDelivery}
              </span>
              <Button variant="ghost" size="sm" onClick={onChangeNext}>
                Change
              </Button>
            </div>
          ) : null}

          {skipped ? (
            <p className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-warning-tint p-3 text-body-sm text-warning">
              <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" />
              {skipped}
              {onUndoSkip ? (
                <Button variant="ghost" size="sm" onClick={onUndoSkip}>
                  Undo
                </Button>
              ) : null}
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {/* Same geometry as every other secondary/ghost pair. */}
              <Button variant="secondary" size="sm" onClick={onSkip}>
                Skip this week
              </Button>
              <Button variant="ghost" size="sm" onClick={onPause}>
                Pause
              </Button>
            </div>
          )}

          {cutoffNotice ? (
            <p className="micro mt-3 text-warning">{cutoffNotice}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

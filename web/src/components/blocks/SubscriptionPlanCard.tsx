import * as React from "react";
import Image from "next/image";
import { AlertCircle, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { LoafGlyph } from "@/components/ui/LineArt";

/**
 * SubscriptionPlanCard — DESIGN-v2 §2 "Plan card", for The Standing Order.
 *
 * The load-bearing behavioural rule: **a weekly commitment has to be trivially
 * escapable, or nobody starts one.** Skip and pause live on the plan card
 * itself, never behind a "Manage" page, never behind a retention interstitial,
 * and never in the danger colour — skipping a week is not destructive.
 *
 * The recommended card does not grow, does not gain a shadow and does not
 * shout. It earns its emphasis from a peach ground, a 1.5px ink hairline and
 * one badge, exactly like the tinted sections elsewhere on the site.
 *
 * `contents` draws what is actually in the box as small cutouts on a cream
 * well — a plan is easier to choose when you can see the bread.
 */

export type PlanState = "default" | "recommended" | "current" | "paused";

export type PlanContent = { slug: string; src: string | null; name: string };

export function SubscriptionPlanCard({
  planName,
  cadence,
  price,
  priceSuffix = "/ week",
  benefits,
  /** The bread itself, drawn as cutouts on a well. */
  contents,
  state = "default",
  /**
   * The label on the recommended card. There is no "most popular" data behind
   * this product yet, so the page supplies a claim it can support and the card
   * asserts nothing on its own.
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
  /** "Paused · back 3 Nov" */
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
  contents?: PlanContent[];
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
  const recommended = state === "recommended";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl p-6 lg:p-8",
        "transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        recommended
          ? "border-[1.5px] border-ink bg-peach"
          : paused
            ? "border border-line bg-paper-2"
            : "border border-line bg-card hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
    >
      {recommended && badge ? (
        <span className="absolute -top-3 left-6 lg:left-8">
          <Badge variant="solid">{badge}</Badge>
        </span>
      ) : null}

      {state === "current" ? (
        <span className="absolute -top-3 left-6 lg:left-8">
          <Badge variant="outline">Your plan</Badge>
        </span>
      ) : null}

      {paused ? (
        <span className="absolute -top-3 left-6 lg:left-8">
          <Badge variant="solid">{pausedLabel ?? "Paused"}</Badge>
        </span>
      ) : null}

      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        {planName}
      </p>
      <h3 className="mt-2 font-display text-[clamp(24px,2.4vw,28px)] leading-[1.1] text-ink">
        {cadence}
      </h3>

      {contents && contents.length > 0 ? (
        <div
          className={cn(
            "mt-5 flex h-[104px] items-center justify-center gap-1 overflow-hidden rounded-lg px-3",
            recommended ? "bg-card" : "bg-well",
          )}
        >
          {contents.map((item) =>
            item.src ? (
              <Image
                key={item.slug}
                src={item.src}
                alt=""
                width={200}
                height={200}
                sizes="88px"
                className="h-[84px] w-auto max-w-[31%] object-contain cutout-sm"
              />
            ) : (
              <LoafGlyph
                key={item.slug}
                size={56}
                className="text-muted opacity-60"
              />
            ),
          )}
        </div>
      ) : null}

      <p className="mt-6 flex items-baseline gap-2">
        <Price amount={price} size="xl" />
        <span className="text-body-sm text-muted">{priceSuffix}</span>
      </p>
      {priceNote ? (
        <p className="mt-1 text-body-sm text-muted">{priceNote}</p>
      ) : null}

      <ul className="mt-6 space-y-2.5">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <Check
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className={cn("mt-1 shrink-0", paused ? "text-muted" : "text-accent")}
            />
            <span className={cn("text-body-sm", paused ? "text-muted" : "text-ink-2")}>
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        {paused ? (
          <Button size="md" fullWidth onClick={onResume}>
            Resume now
          </Button>
        ) : (
          (action ?? (
            <Button variant="secondary" size="md" fullWidth>
              {isCurrent ? "Manage" : "Choose this one"}
            </Button>
          ))
        )}
      </div>

      {/* -------- Current plan: escape controls, never hidden ------------ */}
      {isCurrent ? (
        <>
          <hr className="my-6 h-px border-0 bg-line" />

          {banner ? (
            <p className="mb-4 flex items-start gap-2 rounded-md border border-gold bg-card p-3 text-body-sm text-crumb-ink">
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
                className="shrink-0 text-ink-2"
              />
              <span className="text-body-sm font-semibold text-ink">
                {nextDelivery}
              </span>
              <Button variant="ghost" size="sm" onClick={onChangeNext}>
                Change
              </Button>
            </div>
          ) : null}

          {skipped ? (
            <p className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-line bg-paper-2 p-3 text-body-sm text-ink-2">
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
              <Button variant="secondary" size="sm" onClick={onSkip}>
                Skip this week
              </Button>
              <Button variant="ghost" size="sm" onClick={onPause}>
                Pause
              </Button>
            </div>
          )}

          {cutoffNotice ? (
            <p className="mt-3 text-body-sm text-muted">{cutoffNotice}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

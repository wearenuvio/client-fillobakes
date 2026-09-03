import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The status card — PAGES-v2 "The Van".
 *
 * The one thing the page exists to say, and it has to be true. Live gets a
 * terracotta pill and a stop count; off air gets the same card, the same size
 * and the same weight, because the van rests more days than it runs and a
 * resting van is not an error.
 *
 * Two rules the card enforces on its callers:
 *  - **Stops, not minutes.** Proximity is a stop count and time is a band that
 *    widens in traffic. Nothing here counts down.
 *  - **No position, no claim.** When the feed is suppressed the card says so
 *    in a sentence and the schedule below carries the answer instead.
 *
 * The freshness line is the fixture's own, rendered on the server. It does not
 * tick: a counter that climbs on its own would keep claiming a fresh reading
 * long after the page stopped receiving one.
 */

export type StatusTone = "live" | "stale" | "resting";

const TONES: Record<StatusTone, { pill: string; dot: string; pulse: boolean }> = {
  live: {
    pill: "bg-accent text-on-accent",
    dot: "bg-on-accent",
    pulse: true,
  },
  stale: {
    pill: "border border-gold bg-card text-crumb-ink",
    dot: "bg-gold",
    pulse: false,
  },
  resting: {
    pill: "border border-line bg-paper-2 text-ink-2",
    dot: "bg-muted",
    pulse: false,
  },
};

export function VanStatusCard({
  tone,
  statusLabel,
  updatedLabel,
  headline,
  arrivalLine,
  sub,
  note,
  footer,
  children,
  className,
}: {
  tone: StatusTone;
  statusLabel: string;
  /** "Updated 9s ago" — omitted when there is no reading to be fresh about. */
  updatedLabel?: string | null;
  headline: string;
  arrivalLine?: string | null;
  sub?: string | null;
  /** The sentence that explains a suppressed position. */
  note?: string | null;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = TONES[tone];

  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-card p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span
          className={cn(
            "inline-flex h-7 items-center gap-2 rounded-pill px-3",
            "text-[11px] font-medium tracking-[0.14em] uppercase",
            t.pill,
          )}
        >
          <span className="relative grid size-1.5 place-items-center" aria-hidden="true">
            <span className={cn("size-1.5 rounded-pill", t.dot)} />
            {t.pulse ? (
              <span
                data-motion="pulse"
                className={cn(
                  "absolute size-1.5 rounded-pill animate-[var(--animate-van-pulse)]",
                  t.dot,
                )}
              />
            ) : null}
          </span>
          {statusLabel}
        </span>

        {updatedLabel ? (
          <span className="text-body-sm text-muted tabular">{updatedLabel}</span>
        ) : null}
      </div>

      <p className="mt-5 max-w-[20ch] font-display text-[clamp(28px,5.2vw,40px)] leading-[1.05] text-ink">
        {headline}
      </p>

      {arrivalLine ? (
        <p className="mt-3 text-body-lg text-ink-2">{arrivalLine}</p>
      ) : null}
      {sub ? <p className="mt-1 text-body-lg text-ink-2">{sub}</p> : null}
      {note ? (
        <p className="mt-4 max-w-[52ch] text-body-sm text-muted">{note}</p>
      ) : null}

      {children}

      {footer ? <div className="mt-7">{footer}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bake strip                                                                  */
/* -------------------------------------------------------------------------- */

export type BakeMark = { label: string; at: string | null };

/**
 * This morning's bake, shown only while the van is out — a made thing has a
 * clock on it, and the wait reads as craft rather than as a queue.
 */
export function BakeRibbon({
  marks,
  className,
}: {
  marks: BakeMark[];
  className?: string;
}) {
  if (marks.length === 0) return null;

  return (
    <div className={cn("rounded-xl border border-line bg-paper-2 px-5 py-4 sm:px-6", className)}>
      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        This morning
      </p>
      <ul className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        {marks.map((mark) => (
          <li key={mark.label} className="flex items-baseline gap-2">
            <span className="text-body-sm text-ink-2">{mark.label}</span>
            {mark.at ? (
              <span className="font-display text-[18px] leading-none text-ink tabular">
                {mark.at}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

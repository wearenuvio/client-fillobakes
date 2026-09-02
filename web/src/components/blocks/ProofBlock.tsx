import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * ProofBlock / SpecList — DESIGN.md §12.33.
 *
 * Numbers do the persuading; the spec row replaces the adjectives. At ₹200 a
 * loaf the buyer wants something checkable, and "artisanal" is not checkable.
 *
 * Hard rules this component exists to enforce:
 *  - Every value is a real, checkable number or a real material.
 *  - No adjectives in a spec cell. "SLOW FERMENT" is not a spec; "18H FERMENT"
 *    is. Pass a `value` that is a measurement.
 *  - Mono and tabular always, so the column reads as data.
 *  - Never coloured, never badged, never given an icon — the plainness IS the
 *    credibility.
 *  - Maximum four cells inline, seven rows in the list. If a value is unknown
 *    the row is OMITTED; a spec list with a blank is worse than a shorter one.
 */

export type Spec = { label: string; value: string | null | undefined };

/** Inline variant (PDP, under the sensory line): three or four cells. */
export function ProofBlock({
  specs,
  /** The objection-answer, on its own line. Never the headline. */
  claim,
  className,
}: {
  specs: Spec[];
  claim?: React.ReactNode;
  className?: string;
}) {
  const cells = specs.filter((s) => s.value).slice(0, 4);
  if (cells.length === 0) return null;

  return (
    <div className={className}>
      <dl
        className={cn(
          "flex flex-wrap border-y border-y-paper-300 py-4",
          "divide-x divide-paper-300",
        )}
      >
        {cells.map((spec) => (
          <div
            key={spec.label}
            className="min-w-0 grow basis-1/2 px-4 first:pl-0 min-[560px]:basis-0"
          >
            <dt className="sr-only">{spec.label}</dt>
            <dd className="micro text-ink-600 tabular">{spec.value}</dd>
          </div>
        ))}
      </dl>
      {claim ? <p className="mt-4 text-body text-ink-800">{claim}</p> : null}
    </div>
  );
}

/** List variant (PDP detail, /about): hairline rows with a dot leader. */
export function SpecList({
  specs,
  claim,
  className,
}: {
  specs: Spec[];
  claim?: React.ReactNode;
  className?: string;
}) {
  const rows = specs.filter((s) => s.value).slice(0, 7);
  if (rows.length === 0) return null;

  return (
    <div className={className}>
      <dl className="divide-y divide-paper-300 border-y border-y-paper-300">
        {rows.map((spec) => (
          <div key={spec.label} className="flex items-baseline gap-3 py-3">
            <dt className="micro shrink-0 text-ink-500">{spec.label}</dt>
            <span className="dot-leader" aria-hidden="true" />
            <dd className="shrink-0 font-mono text-body-sm text-ink-800 tabular">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
      {claim ? <p className="mt-4 text-body text-ink-800">{claim}</p> : null}
    </div>
  );
}

/**
 * "How to eat it" — pairs with the spec block on every PDP. For an unfamiliar
 * product, usage instruction IS the persuasion: it removes the "I won't know
 * what to do with it" objection that adjectives cannot touch.
 */
export function HowToEatIt({
  kicker = "How to eat it",
  children,
  className,
}: {
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="micro text-ink-500">{kicker}</p>
      <p className="mt-3 max-w-[62ch] text-body text-ink-600">{children}</p>
    </div>
  );
}

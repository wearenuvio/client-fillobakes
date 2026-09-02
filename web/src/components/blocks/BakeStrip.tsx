import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatClockBare, parseIso } from "@/lib/format";
import type { BakeStripStep } from "@/lib/mock";

/**
 * BakeStrip — DESIGN.md §12.30.
 *
 * Four real timestamps that keep the tracker meaningful in the hours when the
 * van's dot has not moved, and that show the labour behind the loaf.
 *
 * **Every timestamp is a real, server-supplied clock time.** The strip is a
 * promise of honesty and a fabricated time destroys it — so a step with
 * `at: null` renders as pending with an em dash, never as a guess.
 *
 * No progress bar connecting the cells. No percentage. Times are 12-hour
 * without a meridiem — the page context supplies morning or evening.
 *
 * Off air, all four cells render pending with a "next bake" label beneath,
 * rather than the strip being hidden.
 */

export type BakeCellState = "done" | "active" | "pending" | "skipped";

/** Columns at >=640. Static classes so Tailwind can see them. */
const COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

/**
 * The strip prefers the server's own `atLabel`. When a fixture carries only
 * `at` — the order strips do — it is formatted here rather than rendering a
 * done tick against an em dash. Both shapes occur: "16:00" and a full ISO
 * timestamp.
 */
function clockOf(step: BakeStripStep): string {
  if (step.atLabel) return step.atLabel;
  if (!step.at) return "\u2014";
  const parts = parseIso(step.at);
  if (parts) {
    return formatClockBare(
      `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`,
    );
  }
  return formatClockBare(step.at);
}

function stateOf(step: BakeStripStep, activeStep?: string): BakeCellState {
  if (step.done) return "done";
  if (activeStep && step.step === activeStep) return "active";
  return "pending";
}

export function BakeStrip({
  steps,
  /** The step currently running; its timestamp reads NOW. */
  activeStep,
  /** Rendered under the strip when nothing has started yet. */
  footnote,
  /** Cells across at >=640. Derived from `steps.length` when not given. */
  columns,
  tone = "paper",
  className,
}: {
  steps: BakeStripStep[];
  activeStep?: string;
  footnote?: React.ReactNode;
  columns?: number;
  tone?: "paper" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const cols = COLUMNS[columns ?? steps.length] ?? "sm:grid-cols-4";

  return (
    <div className={className}>
      <div
        className={cn(
          "grid grid-cols-2 border-y",
          cols,
          dark
            ? "border-y-[var(--hairline-dark-color)]"
            : "border-y-paper-300",
        )}
      >
        {steps.map((step, index) => {
          const state = stateOf(step, activeStep);
          return (
            <div
              key={step.step}
              className={cn(
                "flex flex-col items-center gap-1.5 py-5",
                // Vertical rules between cells; horizontal ones in the 2×2 grid.
                index % 2 === 1 && "border-l",
                index >= 2 && "border-t sm:border-t-0",
                "sm:border-l sm:first:border-l-0",
                dark
                  ? "border-[var(--hairline-dark-color)]"
                  : "border-paper-300",
              )}
            >
              <BakeGlyph state={state} dark={dark} />
              <span
                className={cn(
                  "nano",
                  state === "pending" || state === "skipped"
                    ? "text-ink-400"
                    : dark
                      ? "text-paper-0"
                      : "text-ink-800",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "font-mono text-caption tabular",
                  state === "pending" || state === "skipped"
                    ? "text-ink-400"
                    : dark
                      ? "text-paper-0"
                      : "text-ink-800",
                )}
              >
                {state === "active"
                  ? "NOW"
                  : state === "done"
                    ? clockOf(step)
                    : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {footnote ? (
        <p className={cn("nano mt-3", dark ? "text-ink-400" : "text-ink-500")}>
          {footnote}
        </p>
      ) : null}
    </div>
  );
}

function BakeGlyph({ state, dark }: { state: BakeCellState; dark: boolean }) {
  if (state === "done") {
    return (
      <Check
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
        className={dark ? "text-paper-0" : "text-ink-800"}
      />
    );
  }
  if (state === "active") {
    return (
      <span className="relative grid size-4 place-items-center" aria-hidden="true">
        <span className="size-2 rounded-pill bg-crumb" />
        <span
          data-motion="pulse"
          className="absolute size-2 rounded-pill bg-crumb animate-[var(--animate-van-pulse)]"
        />
      </span>
    );
  }
  if (state === "skipped") {
    // A stage that did not run is not a fault the visitor can act on:
    // it is never given an error colour.
    return (
      <Minus size={16} strokeWidth={1.5} aria-hidden="true" className="text-ink-400" />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="size-2 rounded-pill border border-paper-400"
    />
  );
}

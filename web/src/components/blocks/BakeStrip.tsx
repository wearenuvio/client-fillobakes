import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatClockBare, parseIso } from "@/lib/format";
import type { BakeStripStep } from "@/lib/mock";

/**
 * BakeStrip — the four steps between an order and a doorstep:
 * Ordered · Baking · On the van · Delivered.
 *
 * It exists because a tracker with a dot that has not moved for two hours
 * says nothing, and this says something true the whole time: where the bread
 * is in its own day.
 *
 * **Every timestamp is real.** A step that has not happened carries the day
 * it is expected, or an em dash — never a guessed clock time. A fabricated
 * bake strip is worse than no bake strip.
 */

export type BakeCellState = "done" | "active" | "pending" | "skipped";

/** Columns from 640px up. Static classes so Tailwind can see them. */
const COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

/**
 * Prefers the server's own label; formats a raw ISO or "16:00" when that is
 * all the fixture carries. Never invents one.
 */
function clockOf(step: BakeStripStep): string {
  if (step.atLabel) return step.atLabel;
  if (!step.at) return "—";
  const parts = parseIso(step.at);
  if (parts) {
    return formatClockBare(
      `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`,
    );
  }
  return step.at.includes(":") ? formatClockBare(step.at) : step.at;
}

function stateOf(step: BakeStripStep, activeStep?: string): BakeCellState {
  if (step.done) return "done";
  if (activeStep && step.step === activeStep) return "active";
  return "pending";
}

export function BakeStrip({
  steps,
  /** The step currently running; its cell reads "Now". */
  activeStep,
  footnote,
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
  const hairline = dark ? "border-[var(--hairline-dark-color)]" : "border-line";

  return (
    <div className={className}>
      <div className={cn("grid grid-cols-2 border-y", cols, hairline)}>
        {steps.map((step, index) => {
          const state = stateOf(step, activeStep);
          const quiet = state === "pending" || state === "skipped";
          return (
            <div
              key={step.step}
              className={cn(
                "flex flex-col items-center gap-2 px-2 py-5",
                // Vertical rules between cells; horizontal ones in the 2×2 grid.
                index % 2 === 1 && "border-l",
                index >= 2 && "border-t sm:border-t-0",
                "sm:border-l sm:first:border-l-0",
                hairline,
              )}
            >
              <BakeGlyph state={state} dark={dark} />
              <span
                className={cn(
                  "text-center text-[12px] font-medium tracking-[0.12em] uppercase",
                  quiet ? "text-muted" : dark ? "text-on-choc" : "text-ink",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "text-center text-body-sm tabular",
                  quiet ? "text-muted" : dark ? "text-on-choc-2" : "text-ink-2",
                )}
              >
                {state === "active" ? "Now" : clockOf(step)}
              </span>
            </div>
          );
        })}
      </div>

      {footnote ? (
        <p
          className={cn(
            "mt-3 text-body-sm",
            dark ? "text-on-choc-2" : "text-muted",
          )}
        >
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
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className={dark ? "text-on-choc" : "text-accent"}
      />
    );
  }
  if (state === "active") {
    return (
      <span className="relative grid size-4.5 place-items-center" aria-hidden="true">
        <span className="size-2.5 rounded-pill bg-accent" />
        <span
          data-motion="pulse"
          className="absolute size-2.5 rounded-pill bg-accent animate-[var(--animate-van-pulse)]"
        />
      </span>
    );
  }
  if (state === "skipped") {
    // A stage that did not run is not a fault anyone can act on, so it never
    // takes an error colour.
    return (
      <Minus size={18} strokeWidth={1.5} aria-hidden="true" className="text-muted" />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="size-2.5 rounded-pill border border-line"
    />
  );
}

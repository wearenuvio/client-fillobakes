import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { BakeStripStep } from "@/lib/mock";
import { formatTimeOfDay } from "@/lib/format";

/**
 * The order timeline — site-content "Screen: Order detail".
 *
 * Five steps, always all five visible, each with the sentence that belongs to
 * it. It borrows the BakeStrip's cell language (§12.30) — a check for a
 * completed stage, a crumb dot for the active one, a hollow ring for a future
 * one, a minus for a stage that did not run — but stacks vertically, because
 * an order has five steps and a sentence per step and the four-across strip
 * has room for neither.
 *
 * `at: null` renders an em dash. A fabricated timestamp is worse than none.
 */
export function OrderTimeline({
  steps,
  className,
}: {
  steps: BakeStripStep[];
  className?: string;
}) {
  const activeIndex = steps.findIndex((s) => !s.done);

  return (
    <ol className={cn("relative", className)}>
      {/* The left-gutter rule the glyphs sit on. */}
      <span
        aria-hidden="true"
        className="absolute top-4 bottom-4 left-[7px] w-0.5 bg-paper-300"
      />
      {steps.map((step, index) => {
        const state =
          step.done ? "done" : index === activeIndex ? "active" : "pending";
        return (
          <li key={step.step} className="relative py-3 pl-8">
            <span
              aria-hidden="true"
              className="absolute top-4 left-0 grid size-4 place-items-center"
            >
              {state === "done" ? (
                <Check size={16} strokeWidth={1.5} className="text-ink-800" />
              ) : state === "active" ? (
                <span className="relative grid size-2 place-items-center">
                  <span className="size-2 rounded-pill bg-crumb" />
                  <span
                    data-motion="pulse"
                    className="absolute size-2 rounded-pill bg-crumb opacity-50 motion-safe:animate-ping"
                  />
                </span>
              ) : (
                <span className="size-2 rounded-pill border-[1.5px] border-paper-400" />
              )}
            </span>

            <div className="flex items-baseline justify-between gap-4">
              <span
                className={cn(
                  "nano min-w-0",
                  state === "pending" ? "text-ink-400" : "text-ink-800",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "shrink-0 font-mono text-caption tabular",
                  state === "pending" ? "text-ink-400" : "text-ink-800",
                )}
              >
                {step.at
                  ? formatTimeOfDay(step.at)
                  : state === "active"
                    ? "NOW"
                    : "\u2014"}
              </span>
            </div>
            <p
              className={cn(
                "mt-1 text-body-sm",
                state === "pending" ? "text-ink-500" : "text-ink-800",
              )}
            >
              {step.sentence ??
                (state === "done" ? "Done." : state === "active" ? "Next up." : "Not yet.")}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

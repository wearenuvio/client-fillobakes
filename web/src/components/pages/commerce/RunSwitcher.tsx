"use client";

import { MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RunView } from "@/components/pages/commerce/types";

/**
 * The lane and route switcher (site-content §2 of /shop).
 *
 * `Sat 10 Oct · Indiranagar` | `Thu 8 Oct · Koramangala` | … | `Home delivery`
 *
 * Switching genuinely re-filters the menu, because what goes on a van differs
 * by run. It changes what you are looking at; it does not overwrite the area
 * saved in the header chip, which stays the thing checkout reads.
 */
export function RunSwitcher({
  runs,
  value,
  onChange,
  className,
}: {
  runs: RunView[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        role="radiogroup"
        aria-label="Choose a run"
        className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] py-1"
      >
        {runs.map((run) => {
          const selected = run.id === value;
          const Icon = run.lane === "home_delivery" ? Truck : MapPin;
          return (
            <button
              key={run.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(run.id)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-sm px-4 whitespace-nowrap",
                "text-body-sm transition-colors duration-[var(--dur-fast)]",
                selected
                  ? "border border-transparent bg-ink-800 text-paper-0"
                  : "border border-paper-300 bg-paper-0 text-ink-600 hover:border-ink-600 hover:text-ink-800",
              )}
            >
              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="tabular">{run.switcherLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

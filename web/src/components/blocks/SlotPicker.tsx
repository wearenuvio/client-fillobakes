"use client";

import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { slotChipParts, formatTimeBandShort } from "@/lib/format";

/**
 * SlotPicker — DESIGN.md §12.8. The checkout's most important control.
 *
 * Two rows of chips: dates on a snapping scroll rail, then time bands in a
 * 2-col (mobile) / 4-col (desktop) grid.
 *
 * The cut-off rule is stated, not implied: a day whose 8pm cut-off has passed
 * renders unavailable with the rule spelled out, and a same-day band closing
 * within 60 minutes raises the warning bar above the time row. There is never
 * a countdown — DECISIONS.md §5 allows a timer only when it is wired to a real
 * constraint, and this one is a date, not a clock.
 */

export type SlotDate = {
  /** ISO date, e.g. "2026-10-03". */
  date: string;
  available: boolean;
  isToday?: boolean;
  /** Stated when unavailable: "Closed 8pm Thursday". */
  reason?: string;
};

export type SlotBand = {
  /** 24h band, e.g. "16:00-18:00". */
  band: string;
  available: boolean;
  /** Renders "n LEFT" under the label in warning ink. */
  left?: number | null;
};

export function SlotPicker({
  dates,
  bands,
  selectedDate,
  selectedBand,
  onSelectDate,
  onSelectBand,
  /** "Orders close Thursday 8pm" — shown once, in body colour, as a fact. */
  cutoffNote,
  /** Raises the warning bar above the time row (§12.8). */
  cutoffWarning,
  className,
}: {
  dates: SlotDate[];
  bands: SlotBand[];
  selectedDate: string | null;
  selectedBand: string | null;
  onSelectDate: (date: string) => void;
  onSelectBand: (band: string) => void;
  cutoffNote?: React.ReactNode;
  cutoffWarning?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* -------- Date chips ------------------------------------------- */}
      <div
        role="radiogroup"
        aria-label="Choose a day"
        className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] py-1"
      >
        {dates.map((slot) => {
          const parts = slotChipParts(slot.date);
          const selected = slot.date === selectedDate;
          return (
            <button
              key={slot.date}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={!slot.available || undefined}
              tabIndex={!slot.available ? -1 : selected || !selectedDate ? 0 : -1}
              onClick={() => slot.available && onSelectDate(slot.date)}
              title={!slot.available ? slot.reason : undefined}
              className={cn(
                "relative flex h-19 w-16 flex-col items-center justify-center gap-0.5 rounded-sm",
                "transition-colors duration-[var(--dur-fast)]",
                selected
                  ? "border-0 bg-ink-800 text-paper-0"
                  : slot.available
                    ? "border border-paper-300 bg-paper-0 text-ink-800 hover:border-ink-600"
                    : "border border-paper-300 bg-paper-200 text-ink-400",
              )}
            >
              <span className="nano">
                {slot.isToday ? (
                  <span className={selected ? "text-crumb" : "text-kiln"}>TODAY</span>
                ) : (
                  parts.weekday
                )}
              </span>
              <span className="font-display text-title-lg tabular">{parts.day}</span>
              <span className="nano">{parts.month}</span>

              {selected ? (
                <Check
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="absolute top-1 right-1"
                />
              ) : null}
              {!slot.available ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--color-paper-400)_50%,transparent_calc(50%+0.5px))]"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* -------- Cut-off notice, above the time row -------------------- */}
      {cutoffWarning ? (
        <p className="mt-4 flex items-center gap-2 rounded-sm bg-warning-tint px-3 py-2 text-body-sm text-warning">
          <Clock size={16} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
          {cutoffWarning}
        </p>
      ) : null}

      {/* -------- Time bands -------------------------------------------- */}
      <div
        role="radiogroup"
        aria-label="Choose a window"
        className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4"
      >
        {bands.map((slot) => {
          const selected = slot.band === selectedBand;
          const low = typeof slot.left === "number" && slot.left > 0 && slot.left <= 3;
          return (
            <button
              key={slot.band}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-disabled={!slot.available || undefined}
              tabIndex={!slot.available ? -1 : selected || !selectedBand ? 0 : -1}
              onClick={() => slot.available && onSelectBand(slot.band)}
              className={cn(
                "relative flex min-h-11 flex-col items-center justify-center rounded-sm px-2 py-2",
                "transition-colors duration-[var(--dur-fast)]",
                selected
                  ? "border-0 bg-ink-800 text-paper-0"
                  : slot.available
                    ? "border border-paper-300 bg-paper-0 text-ink-800 hover:border-ink-600"
                    : "border border-paper-300 bg-paper-200 text-ink-400",
              )}
            >
              <span className="text-body-sm tabular">{formatTimeBandShort(slot.band)}</span>
              {low && slot.available ? (
                <span className={cn("nano", selected ? "text-crumb" : "text-warning")}>
                  {slot.left} LEFT
                </span>
              ) : null}
              {!slot.available ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--color-paper-400)_50%,transparent_calc(50%+0.5px))]"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {cutoffNote ? (
        <p className="mt-4 text-caption text-ink-500">{cutoffNote}</p>
      ) : null}
    </div>
  );
}

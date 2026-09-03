"use client";

import { cn } from "@/lib/cn";
import { slotChipParts, formatTimeBandShort } from "@/lib/format";

/**
 * SlotPicker — PAGES-v2 checkout block 3.
 *
 * A rail of date chips, then the windows for the chosen day. A day that
 * cannot take an order is not hidden and is not crossed out: it stays in the
 * rail, greyed, with the reason set in small type directly beneath it, so the
 * rule is legible rather than mysterious.
 *
 * On the van lane there is only ever one window — the stop's own band — so
 * the row renders a single wide chip rather than a grid of four with three
 * dead cells.
 */

export type SlotDate = {
  /** ISO date, e.g. "2026-10-03". */
  date: string;
  available: boolean;
  /** Set under a disabled chip: "Orders closed" or "No run". */
  reason?: string;
};

export type SlotBand = {
  /** 24h band, e.g. "16:00-18:00". */
  band: string;
  available: boolean;
};

export function SlotPicker({
  dates,
  bands,
  selectedDate,
  selectedBand,
  onSelectDate,
  onSelectBand,
  /** "Order by 8pm for next-day delivery." — one line, stated once. */
  note,
  className,
}: {
  dates: SlotDate[];
  bands: SlotBand[];
  selectedDate: string | null;
  selectedBand: string | null;
  onSelectDate: (date: string) => void;
  onSelectBand: (band: string) => void;
  note?: React.ReactNode;
  className?: string;
}) {
  const single = bands.length === 1;

  return (
    <div className={className}>
      {/* -------- Days ------------------------------------------------- */}
      <div
        role="radiogroup"
        aria-label="Choose a day"
        className="scroll-rail -mx-[var(--gutter)] gap-2.5 px-[var(--gutter)] pt-1 pb-2"
      >
        {dates.map((slot) => {
          const parts = slotChipParts(slot.date);
          const selected = slot.date === selectedDate;
          return (
            <div key={slot.date} className="flex w-17 flex-col items-center">
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={!slot.available || undefined}
                tabIndex={!slot.available ? -1 : selected || !selectedDate ? 0 : -1}
                onClick={() => slot.available && onSelectDate(slot.date)}
                className={cn(
                  "flex h-20 w-17 flex-col items-center justify-center gap-0.5 rounded-lg border",
                  "transition-[border-color,background-color,transform] duration-[var(--dur-fast)]",
                  selected
                    ? "border-accent bg-accent text-on-accent"
                    : slot.available
                      ? "border-line bg-card text-ink hover:border-ink"
                      : "cursor-not-allowed border-line bg-paper-2 text-muted",
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-[0.12em] uppercase",
                    selected ? "text-on-accent/80" : "text-muted",
                  )}
                >
                  {parts.weekday}
                </span>
                <span className="font-display text-[22px] leading-none tabular">
                  {parts.day}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium tracking-[0.12em] uppercase",
                    selected ? "text-on-accent/80" : "text-muted",
                  )}
                >
                  {parts.month}
                </span>
              </button>
              {/* The reason sits under the chip, never inside it. The wrapper
                  holds two lines' height whether or not it has any, so every
                  chip in the rail keeps the same baseline. */}
              <span className="mt-1.5 h-8 text-center text-[11px] leading-4 text-balance text-muted">
                {!slot.available ? slot.reason : null}
              </span>
            </div>
          );
        })}
      </div>

      {/* -------- Windows ---------------------------------------------- */}
      <div
        role="radiogroup"
        aria-label="Choose a window"
        className={cn(
          "mt-4 grid gap-2.5",
          single ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4",
        )}
      >
        {bands.map((slot) => {
          const selected = slot.band === selectedBand;
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
                "flex min-h-12 items-center justify-center rounded-md border px-3 text-body-sm",
                "transition-[border-color,background-color] duration-[var(--dur-fast)]",
                selected
                  ? "border-accent bg-accent text-on-accent"
                  : slot.available
                    ? "border-line bg-card text-ink hover:border-ink"
                    : "cursor-not-allowed border-line bg-paper-2 text-muted",
              )}
            >
              <span className="tabular">{formatTimeBandShort(slot.band)}</span>
              {!slot.available ? (
                <span className="ml-2 text-[11px] tracking-[0.08em] uppercase">
                  Full
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {note ? <p className="mt-4 text-body-sm text-muted">{note}</p> : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { COMMERCE } from "@/lib/config";

/**
 * QtyStepper — DESIGN.md §12.9.
 *
 * 108×36px, pill, 1.5px ink-800, transparent fill. The `−` and `+` cells are
 * 36×36 with a padded 44px hit area. The quantity cross-fades; it never counts
 * up. At quantity 1 the `−` shows `trash-2` and removes the line.
 */

export function QtyStepper({
  qty,
  onIncrement,
  onDecrement,
  max = COMMERCE.maxPerLine,
  label = "Quantity",
  tone = "ink",
  /** Border pulses at 900ms during an optimistic update; stays interactive. */
  pending = false,
  className,
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max?: number;
  label?: string;
  tone?: "ink" | "onDark";
  pending?: boolean;
  className?: string;
}) {
  const [showMax, setShowMax] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const atMax = qty >= max;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function handleIncrement() {
    if (atMax) {
      setShowMax(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setShowMax(false), 2000);
      return;
    }
    onIncrement();
  }

  const onDark = tone === "onDark";

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        role="group"
        aria-label={label}
        className={cn(
          "grid h-9 w-27 grid-cols-[36px_1fr_36px] items-center rounded-md",
          "border bg-card",
          onDark ? "border-on-choc text-on-choc" : "border-line text-ink",
          pending && "animate-[var(--animate-pending)]",
        )}
      >
        <button
          type="button"
          onClick={onDecrement}
          aria-label={qty <= 1 ? "Remove from the box" : "Reduce quantity"}
          className={cn(
            "relative grid size-9 place-items-center rounded-pill",
            "after:absolute after:size-11 after:content-['']",
            "hover:bg-veil transition-colors duration-[var(--dur-fast)]",
          )}
        >
          {qty <= 1 ? (
            <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Minus size={18} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>

        <span
          aria-live="polite"
          className="text-center text-body-sm font-semibold tabular"
        >
          {qty}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          aria-disabled={atMax || undefined}
          aria-label="Increase quantity"
          className={cn(
            "relative grid size-9 place-items-center rounded-pill",
            "after:absolute after:size-11 after:content-['']",
            "hover:bg-veil transition-colors duration-[var(--dur-fast)]",
            atMax && "text-muted",
          )}
        >
          <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {showMax ? (
        <span
          role="status"
          className={cn(
            "nano absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap",
            "rounded-md bg-ink px-2 py-1 text-on-choc",
          )}
        >
          MAX {max} PER ORDER
        </span>
      ) : null}
    </div>
  );
}

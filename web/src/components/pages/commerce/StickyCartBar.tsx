"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { formatINR, pluralise } from "@/lib/format";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore } from "@/store/session";

/**
 * The sticky bottom bar — PAGES-v2: `2 items · ₹449 · View order`.
 *
 * Mobile only in v2: on a phone the header cart icon is small and far away, so
 * the running total follows the thumb. On desktop the header carries it.
 *
 * It appears only when the order has something in it, and the number on it is
 * `computeTotals` — the same number the drawer shows and the same number
 * checkout charges (DECISIONS.md §5). Delivery is already inside it.
 */
export function StickyCartBar({ className }: { className?: string }) {
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const open = useCartStore((s) => s.open);
  const lane = useSessionStore((s) => s.lane);

  if (!hydrated || lines.length === 0) return null;
  const totals = computeTotals(lines, lane);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[var(--z-sticky)] border-t border-line bg-card md:hidden",
        "shadow-[0_-8px_24px_rgba(43,27,18,0.06)]",
        "motion-safe:animate-[fade_var(--dur-base)_var(--ease-out)]",
        className,
      )}
    >
      <div className="container-content flex items-center gap-4 py-3">
        <p className="min-w-0 flex-1 truncate text-body-sm text-ink-2 tabular">
          {pluralise(totals.count, "item")}
          <span aria-hidden="true"> · </span>
          <span className="font-semibold text-ink">{formatINR(totals.total)}</span>
        </p>
        <Button size="md" onClick={open}>
          View order
        </Button>
      </div>
    </div>
  );
}

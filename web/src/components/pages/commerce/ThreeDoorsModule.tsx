"use client";

import * as React from "react";
import { ThreeDoors, type Door } from "@/components/blocks/ThreeDoors";
import { useCartStore, useCartHydrated } from "@/store/cart";

/**
 * Three doors, gated to a first visit (DESIGN.md §12.32).
 *
 * "The module renders only for first-time visitors; returning buyers are
 * routed straight past it to the grid, and it never reappears once someone has
 * ordered." Two signals answer that without a back end:
 *
 *   · anything has ever been in the box this browser, and
 *   · an order has been placed from this browser (checkout writes the flag).
 *
 * It renders nothing on the server and nothing on the first client paint, so
 * a returning buyer never sees it flash past.
 */

export const ORDERED_KEY = "fillo.commerce.ordered.v1";
const BROWSED_KEY = "fillo.commerce.browsed.v1";

export function ThreeDoorsModule({
  doors,
  className,
}: {
  doors: Door[];
  className?: string;
}) {
  const hydrated = useCartHydrated();
  const lines = useCartStore((s) => s.lines);
  const [firstVisit, setFirstVisit] = React.useState(false);

  React.useEffect(() => {
    let ordered = false;
    let browsed = false;
    try {
      ordered = localStorage.getItem(ORDERED_KEY) !== null;
      browsed = localStorage.getItem(BROWSED_KEY) !== null;
      localStorage.setItem(BROWSED_KEY, "1");
    } catch {
      // Private mode or a blocked store: treat the visitor as returning, which
      // is the quieter of the two mistakes.
      ordered = true;
    }
    setFirstVisit(!ordered && !browsed);
  }, []);

  if (!hydrated || !firstVisit || lines.length > 0) return null;

  return (
    <section aria-labelledby="three-doors" className={className}>
      <ThreeDoors
        doors={doors}
        heading={<span id="three-doors">New here? Start with one of three.</span>}
        lead="Everything is eggless. Everything is baked the morning it goes out."
        escapeHref="/shop/all"
        escapeLabel="Or browse all 23 bakes →"
      />
      <p className="mt-4 text-center text-caption text-ink-500">
        * The Sunday Table price is an estimate until the kitchen sets it.
      </p>
    </section>
  );
}

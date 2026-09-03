"use client";

import { useCartStore, useCartHydrated } from "@/store/cart";

/**
 * The gap that keeps the last row of a page clear of `StickyCartBar`.
 *
 * The bar is `position: fixed`, so without a spacer it covers whatever the
 * page ends on. A fixed-height spacer is not the answer either: the bar only
 * exists once something is in the cart, so a constant one leaves a band of
 * dead paper above the footer for every visitor who has not added anything.
 *
 * So it watches the same store the bar does and matches it — nothing when the
 * cart is empty, and the bar's real height (a 44px button in 12px of padding,
 * plus the hairline and the phone's home indicator) when it is not.
 */
export function CartBarSpacer() {
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartHydrated();

  if (!hydrated || lines.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="h-[calc(4.5rem+env(safe-area-inset-bottom))] md:hidden"
    />
  );
}

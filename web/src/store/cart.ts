"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { COMMERCE, type LaneId } from "@/lib/config";
import { getProductBySlug } from "@/lib/catalog";
import { useHydrated } from "@/store/hydrated";

/**
 * The box.
 *
 * Persisted shape is deliberately tiny — `{ slug, qty }` only. Names, prices
 * and images are looked up from the catalogue at render time, so a price
 * change never leaves a stale number in someone's localStorage, and the blob
 * stays under a kilobyte.
 *
 * Money rule (DECISIONS.md §5): the total shown in the drawer is the total
 * charged. Delivery is inside the total, never "calculated at checkout".
 */

export type CartLine = { slug: string; qty: number };

export type CartState = {
  version: number;
  lines: CartLine[];
  /** The drawer is UI state, but it lives here so any component can open it. */
  isOpen: boolean;

  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  increment: (slug: string) => void;
  decrement: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      version: 1,
      lines: [],
      isOpen: false,

      add: (slug, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.slug === slug);
          if (!existing) return { lines: [...s.lines, { slug, qty }] };
          return {
            lines: s.lines.map((l) =>
              l.slug === slug
                ? { ...l, qty: Math.min(COMMERCE.maxPerLine, l.qty + qty) }
                : l,
            ),
          };
        }),

      setQty: (slug, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.slug !== slug)
              : s.lines.map((l) =>
                  l.slug === slug
                    ? { ...l, qty: Math.min(COMMERCE.maxPerLine, qty) }
                    : l,
                ),
        })),

      increment: (slug) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.slug === slug
              ? { ...l, qty: Math.min(COMMERCE.maxPerLine, l.qty + 1) }
              : l,
          ),
        })),

      // At quantity 1 the "−" control removes the line (§12.9).
      decrement: (slug) =>
        set((s) => ({
          lines: s.lines.flatMap((l) =>
            l.slug === slug ? (l.qty <= 1 ? [] : [{ ...l, qty: l.qty - 1 }]) : [l],
          ),
        })),

      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "fillo.cart.v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // isOpen is session UI, never persisted.
      partialize: (s) => ({ version: s.version, lines: s.lines }),
    },
  ),
);

export function useCartHydrated(): boolean {
  return useHydrated();
}

/* -------------------------------------------------------------------------- */
/* Derived money                                                               */
/* -------------------------------------------------------------------------- */

export type CartTotals = {
  count: number;
  subtotal: number;
  /** 0 on the van lane, 0 above the threshold, otherwise COMMERCE.deliveryFee. */
  delivery: number;
  /** Delivery is inside this number. */
  total: number;
  /** ₹ still needed for free delivery; 0 when it is already free. */
  toFreeDelivery: number;
  freeDeliveryEarned: boolean;
  /** Coins this order would earn: 2 per ₹100 of subtotal. */
  coinsEarned: number;
};

export function deliveryFeeFor(lane: LaneId | null, subtotal: number): number {
  if (lane === "catch_the_van") return 0;
  if (subtotal <= 0) return 0;
  if (subtotal >= COMMERCE.freeDeliveryThreshold) return 0;
  return COMMERCE.deliveryFee;
}

/** Pure, so pages and tests can compute totals without mounting the store. */
export function computeTotals(lines: CartLine[], lane: LaneId | null): CartTotals {
  let count = 0;
  let subtotal = 0;
  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    if (!product) continue;
    count += line.qty;
    subtotal += product.price * line.qty;
  }
  const delivery = deliveryFeeFor(lane, subtotal);
  const freeDeliveryEarned =
    lane === "catch_the_van" || subtotal >= COMMERCE.freeDeliveryThreshold;
  return {
    count,
    subtotal,
    delivery,
    total: subtotal + delivery,
    toFreeDelivery: freeDeliveryEarned
      ? 0
      : Math.max(0, COMMERCE.freeDeliveryThreshold - subtotal),
    freeDeliveryEarned,
    coinsEarned:
      Math.floor(subtotal / COMMERCE.coinsBasis) * COMMERCE.coinsPerHundred,
  };
}

/** Quantity of one SKU currently in the box. 0 when absent. */
export function qtyOf(lines: CartLine[], slug: string): number {
  return lines.find((l) => l.slug === slug)?.qty ?? 0;
}

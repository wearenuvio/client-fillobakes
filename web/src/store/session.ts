"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LaneId } from "@/lib/config";
import { useHydrated } from "@/store/hydrated";

/**
 * Where the van meets you — chosen BEFORE the cart (DECISIONS.md §2).
 *
 * The header location chip reads this store; the Area & lane sheet writes it.
 * Serviceability is asked once and remembered (DESIGN.md §12.28): stored
 * per-browser, never re-asked mid-session, and it never blocks browsing —
 * only checkout.
 *
 * Only primitives are persisted (client-localstorage-schema): area name, lane,
 * stop id, date and band. Everything else is derived from mock data at render.
 */

export type AreaStatus =
  | "unset"
  /** On a route, and the van runs there this week. */
  | "served"
  /** On a route, but no run in the current week. */
  | "no_run"
  /** Not on any route yet — the waitlist lane, never an error. */
  | "out_of_area";

export type SessionState = {
  /** Schema version — bump when the shape changes so old blobs are dropped. */
  version: number;
  area: string | null;
  areaStatus: AreaStatus;
  lane: LaneId | null;
  /** Catch-the-van lane only. */
  stopId: string | null;
  /** ISO date of the chosen run, e.g. "2026-10-03". */
  date: string | null;
  /** 24h band, e.g. "16:00-18:00". */
  band: string | null;

  /* ---- Identity, written by checkout, read by the confirmation ------- */
  /** Ten digits, no country code. Null until checkout verifies one. */
  phone: string | null;
  phoneVerified: boolean;
  /** Optional at checkout, so the confirmation can greet by name. */
  customerName: string | null;

  setArea: (area: string, status: AreaStatus) => void;
  setLane: (lane: LaneId) => void;
  setStop: (stopId: string | null) => void;
  setSlot: (date: string | null, band: string | null) => void;
  setPhone: (phone: string | null, verified: boolean) => void;
  setCustomerName: (name: string | null) => void;
  clearLocation: () => void;
};

const EMPTY = {
  area: null,
  areaStatus: "unset" as AreaStatus,
  lane: null,
  stopId: null,
  date: null,
  band: null,
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      version: 1,
      ...EMPTY,
      phone: null,
      phoneVerified: false,
      customerName: null,

      setArea: (area, status) =>
        set((s) => ({
          area,
          areaStatus: status,
          // Changing area invalidates a stop that belonged to the old one.
          stopId: status === "served" ? s.stopId : null,
        })),

      setLane: (lane) =>
        set((s) => ({ lane, stopId: lane === "catch_the_van" ? s.stopId : null })),

      setStop: (stopId) => set({ stopId, lane: "catch_the_van" }),

      setSlot: (date, band) => set({ date, band }),

      setPhone: (phone, verified) => set({ phone, phoneVerified: verified }),

      setCustomerName: (name) => set({ customerName: name }),

      clearLocation: () => set({ ...EMPTY }),
    }),
    {
      name: "fillo.session.v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        version: s.version,
        area: s.area,
        areaStatus: s.areaStatus,
        lane: s.lane,
        stopId: s.stopId,
        date: s.date,
        band: s.band,
        phone: s.phone,
        phoneVerified: s.phoneVerified,
        customerName: s.customerName,
      }),
    },
  ),
);

/** True once the browser has taken over — guards the SSR mismatch. */
export function useSessionHydrated(): boolean {
  return useHydrated();
}

import type { LaneId } from "@/lib/config";

/**
 * The serialisable slice of a Run that crosses the server/client boundary.
 *
 * The full `Run` carries the whole route record; the board only needs the
 * sentences, so this is what gets sent (server-serialization). Products are
 * looked up from the catalogue on the client, which is a static import either
 * way, so only slugs travel.
 */
export type RunView = {
  id: string;
  lane: LaneId;
  /** "Indiranagar" */
  shortName: string;
  /** "The Indiranagar run" */
  routeName: string;
  /** "Sat 10 Oct · Indiranagar" */
  switcherLabel: string;
  /** "Saturdays" */
  runDaysLabel: string;
  /** Authored per-route copy, verbatim. */
  cutoffLine: string;
  /** "4:40–5:10 PM" — the stop band, or null on the delivery lane. */
  bandLabel: string | null;
  /** "Saturday 10 October" */
  nextDateLabel: string | null;
  /** "Saturday" */
  nextDayLabel: string | null;
  areas: string[];
  stops: {
    id: string;
    name: string;
    descriptor: string;
    /** 24h band, e.g. "16:40-17:10" — what SlotPicker wants. */
    band: string;
    /** "4:40–5:10 PM" — what a human wants. */
    bandLabel: string;
  }[];
};

/** One SKU's run membership and real supply, precomputed on the server. */
export type ItemView = {
  slug: string;
  /** Run ids that carry it. */
  runs: string[];
  soldOut: boolean;
  left: number | null;
  /** "On Saturday's Indiranagar run" — /shop/all's availability badge. */
  availability: string;
};

export type CategoryView = {
  slug: string;
  label: string;
  count: number;
  description: string;
};

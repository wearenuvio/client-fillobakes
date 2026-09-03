import { AS_OF, getAreas, getRoute, getAllStops } from "@/lib/mock";
import { COMMERCE } from "@/lib/config";
import { parseIso, weekdayName } from "@/lib/format";

/**
 * Everything checkout needs, read from the fixtures on the server and handed
 * to the client as plain data.
 *
 * The day list is generated here rather than in the browser on purpose: a
 * `new Date()` in a client component disagrees with the one the server used a
 * moment earlier, React calls it a hydration mismatch, and the date rail
 * flickers. Every date on this page descends from `meta.asOf`.
 */

export type CheckoutStop = {
  id: string;
  name: string;
  descriptor: string;
  band: string;
  bandLabel: string;
};

export type CheckoutArea = {
  slug: string;
  name: string;
  pincode: string;
  serviceability: "served" | "catch_van_only" | "not_yet";
  runDaysLabel: string | null;
  /** Lowercase weekday names the route runs, e.g. ["thursday", "saturday"]. */
  runDays: string[];
  /** Home-delivery windows, 24h. Empty on a van-only area. */
  windows: string[];
  stops: CheckoutStop[];
};

export type CheckoutDay = {
  /** ISO date, "2026-10-04". */
  date: string;
  /** Lowercase weekday, so the client can match it against `runDays`. */
  weekday: string;
  /** True once the 8pm cut-off for this day has already passed. */
  closed: boolean;
};

/** The four windows a home delivery can take when an area names none. */
export const DEFAULT_WINDOWS = [
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
];

export function checkoutAreas(): CheckoutArea[] {
  const stops = getAllStops();
  return getAreas().map((area) => {
    const route = area.routeId ? getRoute(area.routeId) : undefined;
    return {
      slug: area.slug,
      name: area.name,
      pincode: area.pincode,
      serviceability: area.serviceability,
      runDaysLabel: area.runDaysLabel,
      runDays: route ? route.runDays.map((d) => d.toLowerCase()) : [],
      windows: area.windows.length ? area.windows : [],
      stops: stops
        .filter((s) => s.area === area.name)
        .map((s) => ({
          id: s.id,
          name: s.name,
          descriptor: s.descriptor,
          band: s.band,
          bandLabel: s.bandLabel,
        })),
    };
  });
}

/**
 * Today plus the next seven days.
 *
 * Eight rather than seven, because the longest gap between two runs on any
 * route is a week: an eight-day rail always contains at least one day the
 * chosen area can actually receive an order on, whichever day you arrive.
 *
 * Today is closed whenever its 8pm cut-off has passed — and the cut-off for a
 * given day falls at 8pm the evening *before* it, so today is always closed
 * by the time anyone is looking at this page. That is the rule the whole site
 * states ("Order by 8pm for tomorrow"), and the rail shows it rather than
 * quietly dropping the day.
 */
export function checkoutDays(count = 8): CheckoutDay[] {
  const now = parseIso(AS_OF);
  if (!now) return [];

  const out: CheckoutDay[] = [];
  for (let i = 0; i < count; i++) {
    const iso = addDays(now.year, now.month, now.day, i);
    out.push({
      date: iso,
      weekday: weekdayName(`${iso}T00:00:00+05:30`).toLowerCase(),
      // Day 0's window shut at 8pm yesterday; day 1's shuts at 8pm tonight,
      // which has not happened yet at any hour this fixture describes.
      closed: i === 0 || (i === 1 && now.hour >= COMMERCE.cutoffHour),
    });
  }
  return out;
}

/** Calendar maths on wall-clock parts, so no timezone can move a date. */
function addDays(year: number, month: number, day: number, add: number): string {
  const d = new Date(Date.UTC(year, month - 1, day));
  d.setUTCDate(d.getUTCDate() + add);
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

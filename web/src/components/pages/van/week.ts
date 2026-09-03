import { AS_OF, getRoutes, type Route, type VanStop } from "@/lib/mock";
import type { WeekDay, WeekRun } from "@/components/pages/van/WeekStrip";
import type { MapStop } from "@/components/pages/van/RouteMap";

/**
 * Calendar helpers for the van pages.
 *
 * Every date is derived from the fixture's frozen `asOf` and computed in UTC
 * off the date portion alone, so the strip reads the same on a laptop in
 * Bengaluru and on a build server in another timezone. Nothing here calls
 * `Date.now()`: a page that invented "today" would disagree with the fixture
 * it renders beside.
 */

const DAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** The frozen today, as a UTC midnight so day arithmetic cannot drift. */
function today(): Date {
  return new Date(`${AS_OF.slice(0, 10)}T00:00:00Z`);
}

/** "15:20" → "3:20pm". The only clock format these pages print. */
export function clockLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

/**
 * The next day the van runs a route and you can still order into — "Saturday".
 *
 * Counted from tomorrow, not from today: orders close at 8pm the evening
 * before a run, so today's run is never the one a visitor can still buy into.
 * On a daily route that is the difference between offering a van that has
 * already been past and offering the one that has not.
 */
export function nextRunDayFor(route: Route | undefined): string {
  const start = today();
  const days = new Set(route?.runDays ?? []);
  for (let i = 1; i < 9; i++) {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    const name = DAY_LONG[d.getUTCDay()];
    if (days.size === 0 || days.has(name.toLowerCase())) return name;
  }
  return "Saturday";
}

/**
 * The next seven days, each carrying the runs that fall on it.
 *
 * Forward-looking on purpose: a strip that opened on Monday when today is
 * Saturday would offer four days nobody can order into.
 */
export function buildWeek(): WeekDay[] {
  const routes = getRoutes();
  const start = today();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    const dow = date.getUTCDay();
    const key = DAY_LONG[dow].toLowerCase();

    const runs: WeekRun[] = routes
      .filter((route) => route.runDays.includes(key))
      .map((route) => ({
        routeId: route.id,
        name: route.name,
        slug: route.slug,
        from: clockLabel(route.firstStopAt),
        stops: route.stops.map((stop) => ({
          id: stop.id,
          name: stop.name,
          descriptor: stop.descriptor,
          band: stop.bandLabel,
        })),
      }));

    return {
      key: `${key}-${i}`,
      short: DAY_SHORT[dow],
      long: DAY_LONG[dow],
      date: `${date.getUTCDate()} ${MONTH_SHORT[date.getUTCMonth()]}`,
      today: i === 0,
      runs,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Map rows                                                                    */
/* -------------------------------------------------------------------------- */

/** A route's published stops, with nothing claimed about where the van is. */
export function mapStopsForRoute(route: Route): MapStop[] {
  return route.stops.map((stop) => ({
    id: stop.id,
    name: stop.name,
    descriptor: stop.descriptor,
    band: stop.bandLabel,
    state: "upcoming" as const,
    stateLabel: null,
  }));
}

/**
 * Today's stops. The published band always wins the time slot; the live state
 * is a short label beside it, so a failed feed costs a label and never the
 * schedule.
 */
export function mapStopsForVan(stops: VanStop[], route: Route | undefined): MapStop[] {
  const byId = new Map((route?.stops ?? []).map((s) => [s.id, s]));

  return stops.map((stop) => {
    const detail = byId.get(stop.id);
    return {
      id: stop.id,
      name: stop.name,
      descriptor: detail?.descriptor ?? null,
      band: detail?.bandLabel ?? stop.etaBandLabel ?? "—",
      state: stop.state,
      stateLabel: liveLabel(stop),
    };
  });
}

function liveLabel(stop: VanStop): string | null {
  if (stop.state === "sold_out") return "Sold out";
  if (stop.state === "current") return "Here now";
  if (stop.state === "done") return stop.atLabel ? `Left ${stop.atLabel}` : "Done";
  return stop.stateLabel === "next" ? "Next" : null;
}

/** "16:00-18:00" → "4–6pm". The delivery windows, as anyone would say them. */
export function windowLabel(window: string): string {
  const [from, to] = window.split("-");
  if (!from || !to) return window;
  const a = clockLabel(from.trim());
  const b = clockLabel(to.trim());
  const suffix = a.slice(-2);
  return b.endsWith(suffix) ? `${a.slice(0, -2)}–${b}` : `${a}–${b}`;
}

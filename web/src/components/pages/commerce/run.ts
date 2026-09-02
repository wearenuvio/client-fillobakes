import {
  parseIso,
  formatLongDate,
  formatShortDate,
  formatTimeBand,
  weekdayName,
} from "@/lib/format";
import {
  AS_OF,
  getRoutes,
  getRoute,
  getArea,
  getStockFor,
  type Route,
  type RouteStop,
  type LaneId,
} from "@/lib/mock";
import { getProducts, type Product } from "@/lib/catalog";

/**
 * Run awareness for the commerce pages.
 *
 * Fulfilment is route runs (DECISIONS.md §2): each route has run days, and
 * orders close at 8pm the evening BEFORE a run. Nothing here builds a `Date`
 * from a fixture ISO string — every calculation works on the wall-clock parts
 * `lib/format.parseIso` returns, in whole days since the epoch, so the server
 * and the browser can never disagree.
 *
 * "Now" is `mock.AS_OF` — Saturday 3 October 2026, 16:05, the frozen moment
 * every fixture is dated around. Today's Indiranagar run is out on the road;
 * ordering for it closed at 8pm on Friday.
 */

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const MS_PER_DAY = 86_400_000;

/** Whole days since 1970-01-01, read off the ISO string's wall clock. */
function dayNumber(iso: string): number {
  const p = parseIso(iso);
  if (!p) return 0;
  return Math.round(Date.UTC(p.year, p.month - 1, p.day) / MS_PER_DAY);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** The inverse: a day number back to "2026-10-10". */
function isoDate(day: number): string {
  const d = new Date(day * MS_PER_DAY);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** 1970-01-01 was a Thursday, so day 0 is index 4. */
function weekdayOf(day: number): (typeof WEEKDAYS)[number] {
  return WEEKDAYS[(((day + 4) % 7) + 7) % 7];
}

const NOW = parseIso(AS_OF);
/** Today, as a day number. */
export const TODAY = dayNumber(AS_OF);
/** Wall-clock minutes since the epoch, for cut-off comparisons. */
const NOW_MINUTES = TODAY * 1440 + (NOW ? NOW.hour * 60 + NOW.minute : 0);

/** Orders close at 8pm the evening before a run (COMMERCE.cutoffHour). */
function cutoffMinutes(runDay: number): number {
  return (runDay - 1) * 1440 + 20 * 60;
}

/* -------------------------------------------------------------------------- */
/* Runs                                                                        */
/* -------------------------------------------------------------------------- */

export type RunSlot = {
  /** ISO date of the run, e.g. "2026-10-10". */
  date: string;
  /** "Saturday 10 October" */
  dateLabel: string;
  /** "Sat 10 Oct" */
  shortLabel: string;
  /** "Saturday" */
  dayLabel: string;
  /** False once 8pm the evening before has passed. */
  open: boolean;
  isToday: boolean;
};

export type Run = {
  /** The route id, or "home_delivery" for the door lane. */
  id: string;
  lane: LaneId;
  routeId: string | null;
  routeSlug: string | null;
  /** "The Indiranagar run" */
  routeName: string;
  /** "Indiranagar" — the run's short name, used inside sentences. */
  shortName: string;
  areas: string[];
  runDaysLabel: string;
  /** The first run still open for orders. Null when nothing is orderable. */
  next: RunSlot | null;
  /** The next few run dates, closed ones included — they render greyed. */
  slots: RunSlot[];
  stops: RouteStop[];
  /** The window the run arrives in: the stop band, or the delivery windows. */
  bandLabel: string | null;
  /** Authored per-route cut-off copy, rendered verbatim. */
  cutoffLine: string;
  /** "Sat 10 Oct · Indiranagar" — the switcher chip. */
  switcherLabel: string;
};

/** "The Indiranagar run" -> "Indiranagar"; "The Banaswadi round" -> "Banaswadi". */
function shortNameOf(route: Route): string {
  return route.name.replace(/^The\s+/i, "").replace(/\s+(run|round)$/i, "");
}

function slotFor(day: number): RunSlot {
  const date = isoDate(day);
  return {
    date,
    dateLabel: formatLongDate(date),
    shortLabel: formatShortDate(date),
    dayLabel: weekdayName(date),
    open: NOW_MINUTES < cutoffMinutes(day),
    isToday: day === TODAY,
  };
}

/** The next `count` dates this route runs, starting today. */
function runSlots(route: Route, count = 5): RunSlot[] {
  const out: RunSlot[] = [];
  for (let day = TODAY; out.length < count && day < TODAY + 90; day++) {
    if (route.runDays.includes(weekdayOf(day))) out.push(slotFor(day));
  }
  return out;
}

/** "12:00–2:00 PM" — the whole run, first stop's start to last stop's end. */
function runWindow(route: Route): string | null {
  const first = route.stops[0];
  const last = route.stops[route.stops.length - 1];
  if (!first || !last) return null;
  const start = first.band.split(/[-–]/)[0]?.trim();
  const end = last.band.split(/[-–]/)[1]?.trim();
  return start && end ? formatTimeBand(`${start}-${end}`) : null;
}

function runFor(route: Route): Run {
  const slots = runSlots(route);
  const next = slots.find((s) => s.open) ?? null;
  return {
    id: route.id,
    lane: "catch_the_van",
    routeId: route.id,
    routeSlug: route.slug,
    routeName: route.name,
    shortName: shortNameOf(route),
    areas: route.areas,
    runDaysLabel: route.runDaysLabel,
    next,
    slots,
    stops: route.stops,
    bandLabel: runWindow(route),
    cutoffLine: route.cutoffLabel,
    switcherLabel: next
      ? `${next.shortLabel} · ${shortNameOf(route)}`
      : shortNameOf(route),
  };
}

/**
 * The home-delivery lane is not a route: it runs wherever a route does, so its
 * slots are every served route's run days merged. Its window is the customer's
 * chosen two-hour band, not a stop band.
 */
function deliveryRun(): Run {
  const days = new Set<number>();
  for (const route of getRoutes()) {
    for (let day = TODAY; day < TODAY + 21; day++) {
      if (route.runDays.includes(weekdayOf(day))) days.add(day);
    }
  }
  const slots = [...days].sort((a, b) => a - b).slice(0, 6).map(slotFor);
  const next = slots.find((s) => s.open) ?? null;
  return {
    id: "home_delivery",
    lane: "home_delivery",
    routeId: null,
    routeSlug: null,
    routeName: "Home delivery",
    shortName: "Home delivery",
    areas: [],
    runDaysLabel: "Whenever the van runs your area",
    next,
    slots,
    stops: [],
    bandLabel: null,
    cutoffLine: "Order by 8pm the evening before a run",
    switcherLabel: "Home delivery",
  };
}

/**
 * Every run the switcher offers, soonest first, with the delivery lane last —
 * the order a buyer reads it in is "when can I get bread", not "which route
 * was defined first".
 */
export function getRuns(): Run[] {
  const routes = getRoutes()
    .map(runFor)
    .sort((a, b) => {
      if (!a.next) return 1;
      if (!b.next) return -1;
      return a.next.date < b.next.date ? -1 : a.next.date > b.next.date ? 1 : 0;
    });
  return [...routes, deliveryRun()];
}

export function getRun(id: string): Run | undefined {
  return getRuns().find((r) => r.id === id);
}

/**
 * The run a session belongs to. An area maps to its route; the delivery lane
 * overrides it; with nothing set, the earliest orderable run stands in so the
 * page has a real date to talk about, and the caller shows the "set your area"
 * banner beside it.
 */
export function resolveRun(
  area: string | null,
  lane: LaneId | null,
): { run: Run; resolved: boolean } {
  const runs = getRuns();
  if (lane === "home_delivery") {
    return { run: runs[runs.length - 1], resolved: Boolean(area) };
  }
  if (area) {
    const record = getArea(area);
    const match = record?.routeId ? runs.find((r) => r.routeId === record.routeId) : undefined;
    if (match) return { run: match, resolved: true };
  }
  const soonest = [...runs]
    .filter((r) => r.routeId && r.next)
    .sort((a, b) => (a.next!.date < b.next!.date ? -1 : 1))[0];
  return { run: soonest ?? runs[0], resolved: false };
}

/** The stop on this run closest to a session's saved stop, else the first. */
export function stopOn(run: Run, stopId: string | null): RouteStop | null {
  if (!run.stops.length) return null;
  return run.stops.find((s) => s.id === stopId) ?? run.stops[0];
}

/* -------------------------------------------------------------------------- */
/* What is on which run                                                        */
/* -------------------------------------------------------------------------- */

/**
 * LOCAL DERIVATION, pending real data.
 *
 * mock-data.json carries per-SKU supply for exactly one moment — the four
 * items on today's Indiranagar van (`vanState.onBoard`) — and no per-route
 * menu at all. The run switcher is specified as a real filter and not a
 * cosmetic one (journey §3.2), so until the founders supply a menu per route
 * this module derives one, deterministically and in one place:
 *
 *   · every route carries the whole Breads category — the loaves go out on
 *     every van;
 *   · the filled and savoury bakes rotate, so a SKU sits out roughly one run
 *     in four;
 *   · home delivery carries the full catalogue.
 *
 * No count and no sold-out state comes from here — those come only from
 * `getStockFor()`, which is real. Logged in PHASE2B-REQUESTS.md.
 */
const ROUTE_ORDER = getRoutes().map((r) => r.id);
const CATALOGUE_INDEX = new Map(getProducts().map((p, i) => [p.slug, i]));

export function isOnRun(product: Product, run: Run): boolean {
  if (run.lane === "home_delivery") return true;
  if (product.category === "breads") return true;
  const routeIndex = ROUTE_ORDER.indexOf(run.id);
  if (routeIndex < 0) return true;
  const index = CATALOGUE_INDEX.get(product.slug) ?? 0;
  return (index + routeIndex) % 4 !== 3;
}

export function productsOnRun(run: Run): Product[] {
  return getProducts().filter((p) => isOnRun(p, run));
}

/** The runs that do carry a SKU — for "On Thursday's Koramangala run". */
export function runsCarrying(product: Product): Run[] {
  return getRuns().filter((run) => run.routeId && isOnRun(product, run));
}

/**
 * The availability badge on /shop/all: which lane and day this SKU can be got
 * on, stated as a fact rather than a promise.
 */
export function availabilityLabel(product: Product): string {
  const carrying = runsCarrying(product);
  if (carrying.length === 0) return "Home delivery only";
  if (carrying.length === ROUTE_ORDER.length) return "On every run";
  const next = carrying.find((r) => r.next);
  if (!next?.next) return "On the next run";
  return `On ${next.next.dayLabel}'s ${next.shortName} run`;
}

/* -------------------------------------------------------------------------- */
/* Supply                                                                      */
/* -------------------------------------------------------------------------- */

export type Stock = {
  soldOut: boolean;
  left: number | null;
  /** "12 left" / "Gone for this week" — the authored label. */
  label: string | null;
};

/**
 * The only real supply data on the site: what is on the van right now. A SKU
 * that is not on board has no count, and we say nothing rather than guess.
 */
export function stockFor(slug: string): Stock {
  const item = getStockFor(slug);
  if (!item) return { soldOut: false, left: null, label: null };
  return {
    soldOut: item.state === "sold_out",
    left: item.left,
    label: item.label,
  };
}

/** §12.5's card props, from real supply only. */
export function cardStock(slug: string) {
  const stock = stockFor(slug);
  return {
    soldOut: stock.soldOut,
    left: stock.left,
  };
}

/**
 * "Only 6 on Saturday's van" is shown only when the true remaining count is
 * ten or fewer (site-content, PDP §8). Above that it is noise, and without a
 * count there is nothing honest to say.
 */
export function honestCount(slug: string, run: Run): string | null {
  const stock = stockFor(slug);
  if (stock.soldOut || stock.left === null || stock.left > 10) return null;
  const day = run.next?.dayLabel ?? "the next";
  return run.lane === "home_delivery"
    ? `Only ${stock.left} left for ${day}`
    : `Only ${stock.left} on ${day}'s van`;
}

/* -------------------------------------------------------------------------- */
/* Slots                                                                       */
/* -------------------------------------------------------------------------- */

export type BandOption = { band: string; available: boolean };

/**
 * The two-hour windows on offer. Home delivery uses the area's published
 * windows; the van lane has exactly one window per stop, because the van is
 * only there once.
 */
export function bandsFor(run: Run, area: string | null, stopId: string | null): BandOption[] {
  if (run.lane === "home_delivery") {
    const record = area ? getArea(area) : undefined;
    const windows = record?.windows.length
      ? record.windows
      : ["12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"];
    return windows.map((band) => ({ band, available: true }));
  }
  const stop = stopOn(run, stopId);
  return stop ? [{ band: stop.band, available: true }] : [];
}

/** The route a run belongs to, for the stop list at checkout. */
export function routeOf(run: Run): Route | undefined {
  return run.routeId ? getRoute(run.routeId) : undefined;
}

/** True when a chosen date's cut-off has since passed — the mid-flow state. */
export function isSlotClosed(date: string | null): boolean {
  if (!date) return false;
  return NOW_MINUTES >= cutoffMinutes(dayNumber(date));
}

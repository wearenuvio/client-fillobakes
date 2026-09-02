import { formatClock } from "@/lib/format";
import type { Route, RouteStop, VanStop } from "@/lib/mock";
import type { ScheduleStop } from "@/components/pages/van/StopSchedule";

/**
 * Fixture → schedule-row adapters.
 *
 * Everything the tracker prints comes through here, so a row can never carry a
 * time the fixture did not supply: `null` stays an em dash, and a band stays a
 * band (DESIGN.md §12.16, "stops, not minutes").
 */

const DAY_SHORT: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

/** ["monday","wednesday","friday"] → "Mon · Wed · Fri"; all seven → "Daily". */
export function shortRunDays(days: string[]): string {
  if (days.length >= 7) return "Daily";
  return days.map((d) => DAY_SHORT[d] ?? d).join(" · ");
}

/** "15:20" → "3:20 PM". Kept here so the page never builds a Date. */
export function runStartLabel(route: Route): string {
  return formatClock(route.firstStopAt);
}

/** The first clock time in a band: "16:40-17:10" → "4:40". */
export function bandStart(band: string): string {
  const [start] = band.split(/[-–]/);
  const m = /^(\d{1,2}):(\d{2})/.exec(start?.trim() ?? "");
  if (!m) return "—";
  const h24 = Number(m[1]);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m[2]}`;
}

export function mapsQueryFor(stop: RouteStop): string {
  return `${stop.name}, ${stop.area}, Bengaluru ${stop.pincode}`;
}

/** A route's published stops — the schedule, with no live state attached. */
export function scheduleRowsForRoute(route: Route): ScheduleStop[] {
  return route.stops.map((stop, i) => ({
    id: stop.id,
    index: i + 1,
    name: stop.name,
    descriptor: stop.descriptor,
    time: bandStart(stop.band),
    note: stop.bandLabel,
    state: "upcoming" as const,
    stateLabel: null,
    mapsQuery: mapsQueryFor(stop),
  }));
}

/** Today's live stops, enriched with the descriptors from the route fixture. */
export function scheduleRowsForVan(
  stops: VanStop[],
  route: Route | undefined,
): ScheduleStop[] {
  const byId = new Map((route?.stops ?? []).map((s) => [s.id, s]));
  return stops.map((stop, i) => {
    const detail = byId.get(stop.id);
    return {
      id: stop.id,
      index: i + 1,
      name: stop.name,
      descriptor: detail?.descriptor ?? null,
      time: stop.atLabel ?? (detail ? bandStart(detail.band) : "—"),
      note: stop.at ? null : (stop.etaBandLabel ?? detail?.bandLabel ?? null),
      state: stop.state,
      stateLabel: stop.stateLabel || null,
      mapsQuery: detail ? mapsQueryFor(detail) : `${stop.name}, Bengaluru`,
    };
  });
}

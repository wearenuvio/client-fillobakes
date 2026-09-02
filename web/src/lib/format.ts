/**
 * Formatting primitives for Fillo Bakes.
 *
 * Two rules from DESIGN.md govern everything here:
 *
 *  1. Currency is `₹` with NO space before the amount, whole rupees only
 *     (mock-data.json: "no paise anywhere in this business"), and the element
 *     that renders it must carry `tabular-nums` — use the `tabular` class or
 *     the <Price> component, never a bare string in a proportional context.
 *  2. Every date/time string is derived from the ISO fields *as written*
 *     (they all carry +05:30, Asia/Kolkata). We never hand an ISO string to
 *     `Date` + `toLocaleString`, because the server's TZ and the browser's TZ
 *     would disagree and React would flag a hydration mismatch.
 */

export const TIMEZONE = "Asia/Kolkata";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DateParts = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number;
};

/**
 * Reads the wall-clock parts out of an ISO string without timezone conversion.
 * "2026-09-26T16:38:00+05:30" -> { year: 2026, month: 9, day: 26, hour: 16, ... }
 */
export function parseIso(iso: string): DateParts | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(iso);
  if (!m) return null;
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: m[4] ? Number(m[4]) : 0,
    minute: m[5] ? Number(m[5]) : 0,
  };
}

/** Zeller-free weekday lookup that works on the wall-clock parts. */
function weekdayIndex(p: DateParts): number {
  return new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
}

/* -------------------------------------------------------------------------- */
/* Money                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * `₹200` — no space, no decimals, Indian digit grouping above 9,999.
 * Always render inside something carrying `tabular-nums`.
 */
export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}₹${groupIndian(Math.abs(rounded))}`;
}

/** 1234567 -> "12,34,567" (Indian grouping: last 3, then 2s). */
export function groupIndian(n: number): string {
  const s = String(n);
  if (s.length <= 3) return s;
  const head = s.slice(0, -3);
  const tail = s.slice(-3);
  return `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${tail}`;
}

/** "₹120 MORE FOR FREE DELIVERY" style deltas. Never returns a negative. */
export function formatShortfall(target: number, subtotal: number): string {
  return formatINR(Math.max(0, target - subtotal));
}

/* -------------------------------------------------------------------------- */
/* Dates                                                                       */
/* -------------------------------------------------------------------------- */

/** "Saturday 26 September" */
export function formatLongDate(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return `${DAYS[weekdayIndex(p)]} ${p.day} ${MONTHS[p.month - 1]}`;
}

/** "Sat 3 Oct" */
export function formatShortDate(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return `${DAYS[weekdayIndex(p)].slice(0, 3)} ${p.day} ${MONTHS[p.month - 1].slice(0, 3)}`;
}

/** "26 Sep" */
export function formatDayMonth(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return `${p.day} ${MONTHS[p.month - 1].slice(0, 3)}`;
}

/** Weekday name: "Saturday" */
export function weekdayName(iso: string): string {
  const p = parseIso(iso);
  return p ? DAYS[weekdayIndex(p)] : "";
}

/** The SlotPicker date chip: { weekday: "WED", day: "3", month: "OCT" } */
export function slotChipParts(iso: string): {
  weekday: string;
  day: string;
  month: string;
} {
  const p = parseIso(iso);
  if (!p) return { weekday: "", day: "", month: "" };
  return {
    weekday: DAYS[weekdayIndex(p)].slice(0, 3).toUpperCase(),
    day: String(p.day),
    month: MONTHS[p.month - 1].slice(0, 3).toUpperCase(),
  };
}

/* -------------------------------------------------------------------------- */
/* Times and bands                                                             */
/* -------------------------------------------------------------------------- */

/** "16:00" -> "4:00 PM" */
export function formatClock(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm);
  if (!m) return hhmm;
  const h24 = Number(m[1]);
  const meridiem = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m[2]} ${meridiem}`;
}

/**
 * "16:00" -> "4:10" — 12-hour with no meridiem. Used inside the BakeStrip,
 * where §12.30 says the page context supplies morning/evening.
 */
export function formatClockBare(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm);
  if (!m) return hhmm;
  const h24 = Number(m[1]);
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m[2]}`;
}

/** ISO timestamp -> "4:47 PM" */
export function formatTimeOfDay(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return formatClock(`${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`);
}

/**
 * "16:00-18:00" -> "4:00–6:00 PM" (en dash, single trailing meridiem when the
 * band does not cross noon/midnight). This is the long label used in prose,
 * summaries and confirmations.
 */
export function formatTimeBand(band: string): string {
  const [start, end] = band.split(/[-–]/).map((s) => s.trim());
  if (!start || !end) return band;
  const startH = Number(start.split(":")[0]);
  const endH = Number(end.split(":")[0]);
  const sameHalf = startH >= 12 === endH >= 12;
  if (sameHalf) {
    const endLabel = formatClock(end);
    const startLabel = formatClock(start).replace(/\s(AM|PM)$/, "");
    return `${startLabel}–${endLabel}`;
  }
  return `${formatClock(start)}–${formatClock(end)}`;
}

/**
 * "12:00-14:00" -> "12–2 PM". The compact form used on 44px slot chips
 * (§12.8), where the long form does not fit.
 */
export function formatTimeBandShort(band: string): string {
  const [start, end] = band.split(/[-–]/).map((s) => s.trim());
  if (!start || !end) return band;
  const bare = (t: string) => {
    const [h, mm] = t.split(":");
    const h24 = Number(h);
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return mm === "00" ? String(h12) : `${h12}:${mm}`;
  };
  const endH = Number(end.split(":")[0]);
  return `${bare(start)}–${bare(end)} ${endH >= 12 ? "PM" : "AM"}`;
}

/**
 * The arrival band (§12.16). Always a band, never a countdown.
 * ("16:40", "16:50") -> "Around 4:40 to 4:50"
 */
export function formatArrivalBand(start: string, end: string): string {
  return `Around ${formatClockBare(start)} to ${formatClockBare(end)}`;
}

/** "9" -> "UPDATED 9S AGO" — the tracker's freshness counter. */
export function formatPingAge(seconds: number): string {
  if (seconds < 60) return `UPDATED ${seconds}S AGO`;
  const mins = Math.floor(seconds / 60);
  return `UPDATED ${mins}M AGO`;
}

/** 29 -> "0:29" — the OTP resend countdown, mono and tabular. */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/* Misc                                                                        */
/* -------------------------------------------------------------------------- */

/** "1 item" / "3 items" — never "1 items". */
export function pluralise(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** Title-cased area/stop strings are left alone; UI is sentence case. */
export function upper(value: string): string {
  return value.toUpperCase();
}

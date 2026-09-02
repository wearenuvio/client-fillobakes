import { getSubscription, getSubscriptionState } from "@/lib/mock";

/**
 * The standing order, typed against what mock-data.json actually holds.
 *
 * `lib/mock`'s Subscription type is intentionally loose in a couple of places
 * (`nextDelivery` and `upcoming` carry a `Record<string, unknown>` escape
 * hatch), so this file narrows the fixture once, here, rather than casting at
 * every call site.
 */

export type StandingOrderLine = { slug: string; qty: number; name?: string };

export type UpcomingDelivery = {
  date: string;
  dateLabel: string;
  status: "scheduled" | "skipped";
  items?: string[];
  price?: number;
  canSkip?: boolean;
  canUnskip?: boolean;
  statusCopy?: string;
};

export type StandingOrder = {
  id: string;
  status: string;
  statusLabel: string;
  frequency: string;
  frequencyOptions: string[];
  area: string;
  routeDay: string;
  stopLabel: string;
  windowLabel: string;
  lane: string;
  addressId: string | null;
  startedAt: string;
  plan: {
    name: string;
    items: StandingOrderLine[];
    listPrice: number;
    weeklyPrice: number;
    savingPerWeek: number;
    savingLabel: string;
    priceConfidence: string;
  };
  cutoff: { rule: string; label: string; nextCutoffAt: string; tbc: boolean };
  nextDelivery: {
    date: string;
    dateLabel: string;
    windowLabel: string;
    stopLabel: string;
    items: StandingOrderLine[];
    price: number;
    canSkip: boolean;
    canChange: boolean;
    closesLabel: string;
  };
  upcoming: UpcomingDelivery[];
  history: { deliveredCount: number; skippedCount: number; label: string };
  actions: {
    canSkipNext: boolean;
    canPause: boolean;
    maxPauseWeeks: number;
    canChangeBox: boolean;
    changeBoxCopy: string;
    canChangeRouteDay: boolean;
    availableRouteDays: string[];
    canCancel: boolean;
    cancelCopy: string;
    skipCopy: string;
    pastCutoffSkip: string;
    cancelOffersPauseOnce: boolean;
  };
  payment: {
    methodLabel: string;
    nextChargeAt: string;
    lastChargeAmount: number;
    healthy: boolean;
  };
  /** Only present on the merged alternate states. */
  banner?: string;
  cta?: string;
  copy?: string;
  fallback?: string;
  resumeLabel?: string;
  options?: string[];
  lastDelivery?: string;
};

export function standingOrder(variant = "active"): StandingOrder {
  const raw =
    variant === "active"
      ? getSubscription()
      : getSubscriptionState(variant as Parameters<typeof getSubscriptionState>[0]);
  return raw as unknown as StandingOrder;
}

/** "saturday" -> "Saturday". Run days are stored lower-case in the fixture. */
export function dayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

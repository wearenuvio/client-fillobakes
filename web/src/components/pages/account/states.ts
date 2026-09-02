/**
 * The mock state selectors.
 *
 * This is a front end with no back end: every account screen has states that
 * only a real order table could produce. Rather than inventing a control that
 * would ship to customers, each screen reads an optional `?state=` (or
 * `?status=`) parameter and renders that fixture. The default is always the
 * real one from mock-data.json.
 */

export const DASHBOARD_STATES = [
  "default",
  "new",
  "no_standing_order",
  "paused",
  "payment_failed",
] as const;
export type DashboardState = (typeof DASHBOARD_STATES)[number];

export const ORDERS_LIST_STATES = ["default", "empty"] as const;
export type OrdersListState = (typeof ORDERS_LIST_STATES)[number];

export const SUBSCRIPTION_PAGE_STATES = [
  "active",
  "paused",
  "payment_failed",
  "route_changed",
  "route_retired",
  "out_of_stock",
  "cancelled",
  "past_cutoff",
  "none",
] as const;
export type SubscriptionPageState = (typeof SUBSCRIPTION_PAGE_STATES)[number];

export const REWARDS_STATES = [
  "default",
  "redeemable",
  "armed",
  "not_member",
  "legacy_email",
  "empty",
] as const;
export type RewardsState = (typeof REWARDS_STATES)[number];

export const ADDRESS_STATES = ["default", "empty"] as const;
export type AddressState = (typeof ADDRESS_STATES)[number];

export const ALERTS_STATES = ["default", "all_paused", "blocked"] as const;
export type AlertsState = (typeof ALERTS_STATES)[number];

export const GIFT_CARD_STATES = ["default", "empty"] as const;
export type GiftCardState = (typeof GIFT_CARD_STATES)[number];

/** Narrows an unknown query value to one of a screen's states. */
export function pickState<T extends readonly string[]>(
  allowed: T,
  value: string | string[] | undefined,
  fallback: T[number],
): T[number] {
  const raw = Array.isArray(value) ? value[0] : value;
  return allowed.includes(raw as T[number]) ? (raw as T[number]) : fallback;
}

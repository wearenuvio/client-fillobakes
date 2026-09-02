import raw from "@/data/mock-data.json";

/**
 * The mocked back end.
 *
 * Read-only fixture data from src-content/mock-data.json, aligned to the v2
 * route map. Two rules govern it (DECISIONS.md §10, DESIGN.md §12.30):
 *
 *  - Every timestamp is a real event time. `null` means "has not happened
 *    yet" and must render as an unticked step, never as a guess.
 *  - Values the founders have not set carry a TBC string. Read them with
 *    `isTbc()` / the `TBC` register and render them honestly rather than
 *    inventing a number.
 */

/* -------------------------------------------------------------------------- */
/* Money and orders                                                            */
/* -------------------------------------------------------------------------- */

export type Money = {
  subtotal: number;
  discount: { code: string | null; amount: number };
  delivery: number | null;
  deliveryLabel?: string;
  deliveryTbc?: string;
  tax: number;
  taxRateLabel: string;
  filloPlusJoinFee: number;
  total: number;
  totalNote?: string;
};

export type OrderItem = {
  slug: string;
  name: string;
  variant: string | null;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

/** The status vocabulary in mock-data `orderStatusReference`. */
export type OrderStatus =
  | "placed"
  | "baking"
  | "loading"
  | "out"
  | "delivered"
  | "missed"
  | "cancelled"
  | "payment_pending"
  | "failed";

export type BakeStripStep = {
  step: string;
  label: string;
  done: boolean;
  at: string | null;
  atLabel?: string;
  sentence?: string;
};

export type Order = {
  id: string;
  placedAt: string;
  status: OrderStatus;
  statusLabel: string;
  statusSentence: string;
  fulfilment: {
    lane: LaneId;
    laneLabel: string;
    addressId: string | null;
    date: string;
    dateLabel: string;
    window?: string;
    windowLabel?: string;
    area: string;
    stopId?: string | null;
    stopName?: string;
    routeId?: string;
  };
  items: OrderItem[];
  money: Money;
  payment: {
    method: string;
    methodLabel: string;
    processor: string;
    reference: string | null;
    paidAt: string | null;
  };
  bakeStrip: BakeStripStep[];
  coinsEarned: number;
  coinsPostedAt: string | null;
  canChange: boolean;
  changeClosedAt?: string;
  changeClosedCopy?: string;
};

/** The off-happy-path order states, keyed by status. */
export type OrderStateCopy = { statusLabel: string; copy: string; cta?: string };

/* -------------------------------------------------------------------------- */
/* Lanes, routes and areas                                                     */
/* -------------------------------------------------------------------------- */

export type LaneId = "catch_the_van" | "home_delivery";

export type Lane = {
  id: LaneId;
  label: string;
  price: number;
  priceLabel: string;
  freeOver?: number;
  freeOverLabel?: string;
  priceTbc?: string;
  line: string;
  /** The van lane skips the address block in checkout entirely. */
  skipsAddressBlock: boolean;
};

export type RouteStop = {
  id: string;
  name: string;
  /** "opposite the Nandini booth" — the local landmark that makes it findable. */
  descriptor: string;
  area: string;
  pincode: string;
  band: string;
  bandLabel: string;
};

export type Route = {
  id: string;
  name: string;
  slug: string;
  areas: string[];
  runDays: string[];
  runDaysLabel: string;
  cadenceLabel: string;
  firstStopAt: string;
  cutoffLabel: string;
  stops: RouteStop[];
};

export type Serviceability = "served" | "catch_van_only" | "not_yet";

export type Area = {
  slug: string;
  name: string;
  pincode: string;
  serviceability: Serviceability;
  routeId: string | null;
  runDaysLabel: string | null;
  lanes: LaneId[];
  deliveryFee: number | null;
  freeOver: number | null;
  windows: string[];
  nextRun: string | null;
  nextRunLabel: string | null;
  chipLabel: string;
  answer: string;
  /** Present on not_yet areas — the shape mock-data.json actually carries. */
  waitlist?: AreaWaitlist;
  /** Present where a lane needs a caveat of its own (hsr-layout). */
  laneNote?: string;
  nearestStop?: string;
  nearestStopLabel?: string;
};

export type AreaWaitlist = {
  requests: number;
  position: number;
  /** null until the founders set it; read `thresholdTbc` and say so. */
  threshold: number | null;
  thresholdTbc?: string;
  copy: string;
};

/* -------------------------------------------------------------------------- */
/* Van                                                                         */
/* -------------------------------------------------------------------------- */

export type VanStopState = "done" | "current" | "upcoming" | "sold_out";

export type VanStop = {
  id: string;
  name: string;
  state: VanStopState;
  stateLabel: string;
  at: string | null;
  atLabel?: string;
  etaBandLabel?: string;
  /** "opposite the Nandini booth" — the landmark that makes a stop findable. */
  descriptor?: string | null;
  /** Free text handed to a map app — never a stored coordinate. */
  mapsQuery?: string | null;
  /** The pre-composed row string, for the lite/no-map rendering. */
  row?: string;
};

/**
 * Tracker states. DESIGN.md §12.16 is explicit that OFF AIR is the primary
 * state and must be designed first — five days out of seven it *is* the page.
 * `go_dark` is the driver's kill switch; `off_route` suppresses the position
 * rather than publishing a deviation (journey §6.5).
 */
export type VanStatus =
  | "live"
  | "off_air"
  | "stale"
  | "off_route"
  | "go_dark"
  | "map_failed"
  | "no_run_today"
  | "route_cancelled"
  | "off_hours";

export type OnBoardItem = {
  slug: string;
  name: string;
  left: number;
  state: "in_stock" | "low_stock" | "sold_out";
  label: string;
};

export type VanState = {
  status: string;
  statusLabel?: string;
  headline: string;
  sub?: string;
  arrivalLine?: string;
  asOf: string;
  lastPingSecondsAgo?: number;
  lastPingLabel?: string;
  refreshIntervalSeconds: number;
  routeId?: string;
  routeName?: string;
  routeSlug?: string;
  currentWard?: string;
  position?: { lat: number; lng: number; snappedToRoute: boolean; precisionMetres: number };
  positionSuppressed?: boolean;
  stopsAwayFromCustomer?: number;
  etaBand?: { start: string; end: string; label: string };
  stops: VanStop[];
  bakeStrip: BakeStripStep[];
  bakeStripHidden?: boolean;
  mapFailed?: boolean;
  activityFeed: { at: string; atLabel: string; text: string }[];
  onBoard: OnBoardItem[];
  ovenCapacity: number | null;
  ovenCapacityTbc: string;
  stampCard: { slots: number; earned: number; enabled: boolean; note: string };
  strip: Record<string, string>;
  notifyMe: {
    triggers: string[];
    default: string;
    copy: Record<string, string>;
    note: string;
  };
  week?: { day: string; route: string; from: string }[];
  cta?: string;
  markerOpacity?: number;
};

/* -------------------------------------------------------------------------- */
/* Customer, subscription, loyalty, boxes, gift cards                          */
/* -------------------------------------------------------------------------- */

export type Customer = {
  id: string;
  name: string;
  phone: string;
  phoneVerified: boolean;
  email: string | null;
  createdAt: string;
  filloPlus: {
    isMember: boolean;
    joinedAt: string;
    memberSince: string;
    memberLabel: string;
    foundingMember?: boolean;
  };
  defaultAddressId: string;
  areaSet: string;
  pincode: string;
};

export type Address = {
  id: string;
  label: string;
  isDefault: boolean;
  society: string;
  blockAndFlat: string;
  landmark: string | null;
  area: string;
  pincode: string;
  leaveItWith: string | null;
  serviceable: boolean;
  routeId: string;
  routeLine: string;
  availableWindows: string[];
};

export type SubscriptionItem = { slug: string; qty?: number; name?: string; role?: string };

export type SubscriptionStatus =
  | "active"
  | "paused"
  | "payment_failed"
  | "cancelled";

export type Subscription = {
  id: string;
  customerId: string;
  productName: string;
  plan: {
    id: string;
    name: string;
    items: SubscriptionItem[];
    listPrice: number;
    weeklyPrice: number;
    savingPerWeek: number;
    savingLabel: string;
    priceConfidence: string;
  };
  status: SubscriptionStatus;
  statusLabel: string;
  frequency: string;
  frequencyOptions: string[];
  startedAt: string;
  addressId: string | null;
  routeId: string;
  routeDay: string;
  stopId?: string;
  stopLabel?: string;
  lane: LaneId;
  window?: string;
  windowLabel?: string;
  area: string;
  cutoff: { rule: string; nextCutoffAt: string; tbc: boolean };
  nextDelivery: Record<string, unknown> & {
    date: string;
    dateLabel: string;
    contents: SubscriptionItem[];
  };
  upcoming: { date: string; dateLabel: string; status: string; contents: SubscriptionItem[] }[];
  history: Record<string, unknown>;
  actions: Record<string, unknown>;
  payment: Record<string, unknown>;
  /** The Wed / Thu / Fri / Sat message loop. `template: null` = no message. */
  weeklyMessages?: SubscriptionMessage[];
  alternateStates: Record<string, Record<string, unknown>>;
};

export type SubscriptionMessage = {
  when: string;
  template: string | null;
  buttons?: string[];
  note?: string;
};

export type LedgerEntry = {
  id: string;
  at: string;
  dateLabel: string;
  type: string;
  description: string;
  orderId: string | null;
  coins: number;
  balanceAfter: number;
};

export type LoyaltyLedger = {
  customerId: string;
  balance: number;
  redeemThreshold: number;
  coinsToNextRedemption: number;
  redemptionValue: number;
  earnRate: { coins: number; perRupees: number };
  progressCopy: string;
  nudgeCopy: string;
  entries: LedgerEntry[];
  ledgerNote: string;
  emptyCopy: string;
};

export type Box = {
  id: string;
  slug: string;
  name: string;
  type: string;
  contents: { slug: string; qty: number }[];
  listValue: number;
  price: number;
  priceConfidence: string;
  savingLabel: string;
  line: string;
  allergenFlag?: string;
  image: string | null;
  imageNote?: string;
};

export type GiftCards = {
  denominations: number[];
  customAllowed: boolean;
  expiry: string | null;
  expiryTbc: string;
  deliveryChannel: string;
  bought: Record<string, unknown>[];
  received: Record<string, unknown>[];
  states: Record<string, string>;
};

export type CutoffClock = {
  rule: string;
  ruleTbc: boolean;
  pattern: string;
  /** open · openNoArea · soon · veryClose · closedToday · betweenRuns · … */
  copy: Record<string, string>;
  note: string;
};

export type CartReservation = {
  holdMinutes: number;
  holdMinutesTbc: string;
  /** running · expiringSoon · expired · notHeld · itemSoldOutInCart · itemOffRoute */
  copy: Record<string, string>;
  note: string;
};

export type AreaChipState =
  | "unset"
  | "van_lane_set"
  | "delivery_lane_set"
  | "no_run_this_week"
  | "out_of_area";

export type AreaChip = {
  current: { state: AreaChipState; label: string };
  states: { state: AreaChipState; label: string; tone: string }[];
  note: string;
};

export type AlertPreferences = {
  customerId: string;
  channel: string;
  number: string;
  toggles: {
    key: string;
    label: string;
    helper: string;
    value: boolean;
    locked: boolean;
    lockedCopy?: string;
  }[];
  watchedForRestock: string[];
  channelOptions?: string[];
};

/* -------------------------------------------------------------------------- */
/* The file                                                                    */
/* -------------------------------------------------------------------------- */

const data = raw as unknown as {
  meta: {
    asOf: string;
    timezone: string;
    currency: string;
    conventions: string[];
    tbc: Record<string, string>;
  };
  customer: Customer;
  addresses: Address[];
  orders: Order[];
  orderStates: Record<string, OrderStateCopy>;
  orderStatusReference: string[];
  subscription: Subscription;
  loyaltyLedger: LoyaltyLedger;
  vanState: VanState & { alternateStates: Record<string, Partial<VanState>> };
  routes: Route[];
  routesNote: string;
  areas: Area[];
  areasNote: string;
  boxes: Box[];
  giftCards: GiftCards;
  cutoffClock: CutoffClock;
  cartReservation: CartReservation;
  areaChip: AreaChip;
  lanes: Lane[];
  alertPreferences: AlertPreferences;
};

export const MOCK_META = data.meta;

/** The frozen "now" every mock timestamp is relative to. */
export const AS_OF = data.meta.asOf;

/** The founder-TBC register, so a page can say so rather than invent a value. */
export const TBC = data.meta.tbc;

/** True when a value is a founder placeholder rather than a real number. */
export function isTbc(value: unknown): boolean {
  return typeof value === "string" && /tbc/i.test(value);
}

/* -------------------------------------------------------------------------- */
/* Customer and account                                                        */
/* -------------------------------------------------------------------------- */

export function getCustomer(): Customer {
  return data.customer;
}

export function getAddresses(): Address[] {
  return data.addresses;
}

export function getAddress(id: string): Address | undefined {
  return data.addresses.find((a) => a.id === id);
}

export function getDefaultAddress(): Address | undefined {
  return data.addresses.find((a) => a.isDefault) ?? data.addresses[0];
}

export function getOrders(): Order[] {
  return data.orders;
}

export function getOrder(id: string): Order | undefined {
  return data.orders.find((o) => o.id === id);
}

export function getOrderIds(): string[] {
  return data.orders.map((o) => o.id);
}

/** The most recent order, for the account dashboard's "next delivery" card. */
export function getLatestOrder(): Order | undefined {
  return data.orders[0];
}

/** Copy for the off-happy-path order states (missed, payment_pending, failed). */
export function getOrderStateCopy(status: string): OrderStateCopy | undefined {
  return data.orderStates[status];
}

export const ORDER_STATUS_REFERENCE = data.orderStatusReference;

export function getSubscription(): Subscription {
  return data.subscription;
}

/** One of the six alternate subscription states, merged over the active one. */
export function getSubscriptionState(
  variant: keyof Subscription["alternateStates"] | "active",
): Subscription & Record<string, unknown> {
  if (variant === "active") return data.subscription;
  const alt = data.subscription.alternateStates[variant as string];
  if (!alt) return data.subscription;
  return { ...data.subscription, ...alt } as Subscription & Record<string, unknown>;
}

export const SUBSCRIPTION_STATES = [
  "active",
  "paused",
  "payment_failed",
  "route_changed",
  "route_retired",
  "out_of_stock",
  "cancelled",
] as const;

export function getLoyaltyLedger(): LoyaltyLedger {
  return data.loyaltyLedger;
}

export function getAlertPreferences(): AlertPreferences {
  return data.alertPreferences;
}

/* -------------------------------------------------------------------------- */
/* Lanes                                                                       */
/* -------------------------------------------------------------------------- */

export function getLanes(): Lane[] {
  return data.lanes;
}

const laneIndex = new Map(data.lanes.map((l) => [l.id, l]));

export function getLane(id: LaneId): Lane | undefined {
  return laneIndex.get(id);
}

/* -------------------------------------------------------------------------- */
/* Routes                                                                      */
/* -------------------------------------------------------------------------- */

export function getRoutes(): Route[] {
  return data.routes;
}

export const ROUTES_NOTE = data.routesNote;

const routeById = new Map(data.routes.map((r) => [r.id, r]));
const routeBySlug = new Map(data.routes.map((r) => [r.slug, r]));

export function getRoute(idOrSlug: string): Route | undefined {
  return routeById.get(idOrSlug) ?? routeBySlug.get(idOrSlug);
}

/** Slugs for /van/[route] static params. */
export function getRouteSlugs(): string[] {
  return data.routes.map((r) => r.slug);
}

/** Every stop across every route, deduplicated by id. */
export function getAllStops(): (RouteStop & { routeId: string; routeName: string; runDaysLabel: string })[] {
  const seen = new Set<string>();
  const out: (RouteStop & { routeId: string; routeName: string; runDaysLabel: string })[] = [];
  for (const route of data.routes) {
    for (const stop of route.stops) {
      if (seen.has(stop.id)) continue;
      seen.add(stop.id);
      out.push({
        ...stop,
        routeId: route.id,
        routeName: route.name,
        runDaysLabel: route.runDaysLabel,
      });
    }
  }
  return out;
}

export function getStop(id: string) {
  return getAllStops().find((s) => s.id === id);
}

/** The routes that serve a named area. */
export function getRoutesForArea(area: string): Route[] {
  return data.routes.filter((r) =>
    r.areas.some((a) => a.toLowerCase() === area.toLowerCase()),
  );
}

/* -------------------------------------------------------------------------- */
/* Areas                                                                       */
/* -------------------------------------------------------------------------- */

export function getAreas(): Area[] {
  return data.areas;
}

export const AREAS_NOTE = data.areasNote;

const areaBySlug = new Map(data.areas.map((a) => [a.slug, a]));

export function getArea(slugOrName: string): Area | undefined {
  const direct = areaBySlug.get(slugOrName);
  if (direct) return direct;
  const lower = slugOrName.toLowerCase();
  return data.areas.find(
    (a) => a.name.toLowerCase() === lower || a.pincode === slugOrName,
  );
}

/** Slugs for /areas/[area] static params. */
export function getAreaSlugs(): string[] {
  return data.areas.map((a) => a.slug);
}

export function getServedAreas(): Area[] {
  return data.areas.filter((a) => a.serviceability !== "not_yet");
}

/** Free-text resolution for the AreaCheck combobox and the lane sheet. */
export function resolveAreaQuery(query: string): Area | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    data.areas.find((a) => a.name.toLowerCase() === q || a.pincode === q) ??
    data.areas.find((a) => a.name.toLowerCase().startsWith(q)) ??
    data.areas.find((a) => a.name.toLowerCase().includes(q))
  );
}

export function areaSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/* -------------------------------------------------------------------------- */
/* Boxes and gift cards                                                        */
/* -------------------------------------------------------------------------- */

export function getBoxes(): Box[] {
  return data.boxes;
}

export function getBox(slug: string): Box | undefined {
  return data.boxes.find((b) => b.slug === slug);
}

export function getGiftCards(): GiftCards {
  return data.giftCards;
}

/* -------------------------------------------------------------------------- */
/* Cutoff clock, cart reservation, area chip                                   */
/* -------------------------------------------------------------------------- */

/**
 * The certainty sentence. Every state's copy is authored; nothing here
 * computes a countdown, because DECISIONS.md §5 allows a timer only where it
 * is wired to a real constraint.
 */
export function getCutoffClock(): CutoffClock {
  return data.cutoffClock;
}

export const CUTOFF_STATES = [
  "open",
  "openNoArea",
  "soon",
  "veryClose",
  "closedToday",
  "betweenRuns",
  "passedMidFlow",
  "outOfArea",
] as const;

export type CutoffState = (typeof CUTOFF_STATES)[number];

export function getCutoffCopy(state: CutoffState): string {
  return data.cutoffClock.copy[state] ?? data.cutoffClock.copy.open;
}

/** The only honest timer on the site: a real cart hold during a live run. */
export function getCartReservation(): CartReservation {
  return data.cartReservation;
}

export function getAreaChip(): AreaChip {
  return data.areaChip;
}

/* -------------------------------------------------------------------------- */
/* Van state                                                                   */
/* -------------------------------------------------------------------------- */

const liveVan: VanState = data.vanState;

export const VAN_STATES: VanStatus[] = [
  "live",
  "off_air",
  "stale",
  "off_route",
  "go_dark",
  "map_failed",
  "no_run_today",
  "route_cancelled",
  "off_hours",
];

/**
 * The tracker state. Every variant keeps the IDENTICAL layout (§12.16) — only
 * the content moves. Off air is never styled as an error and never smaller
 * than the live state.
 */
export function getVanState(variant: VanStatus = "live"): VanState {
  if (variant === "live") return liveVan;
  const alt = data.vanState.alternateStates[variant];
  if (!alt) return liveVan;

  const merged: VanState = { ...liveVan, ...alt } as VanState;

  const grounded =
    variant === "off_air" ||
    variant === "off_hours" ||
    variant === "no_run_today" ||
    variant === "route_cancelled";

  if (grounded) {
    // Every dot hollow; nothing has happened yet today.
    merged.stops = liveVan.stops.map((s) => ({
      ...s,
      state: "upcoming" as const,
      stateLabel: "",
      at: null,
    }));
    merged.bakeStripHidden = true;
    merged.activityFeed = [];
  }
  return merged;
}

/** Today's on-board counts. Drives ProductCard low-stock / sold-out states. */
export function getOnBoard(): OnBoardItem[] {
  return liveVan.onBoard;
}

export function getStockFor(slug: string): OnBoardItem | undefined {
  return liveVan.onBoard.find((i) => i.slug === slug);
}

/** The three van-strip lines (journey §6.3). */
export function getVanStripCopy(): Record<string, string> {
  return liveVan.strip;
}

export function getNotifyMeCopy() {
  return liveVan.notifyMe;
}

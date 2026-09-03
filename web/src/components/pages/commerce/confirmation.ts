import { getProductBySlug } from "@/lib/catalog";
import {
  getCustomer,
  getOrders,
  getOrder,
  getAddress,
  type Order,
  type Customer,
} from "@/lib/mock";
import { AS_OF } from "@/lib/mock";
import {
  formatLongDate,
  formatTimeBand,
  formatTimeBandShort,
  parseIso,
} from "@/lib/format";

/**
 * The order confirmation's data.
 *
 * `FB-1042` is the order checkout has just placed. It is not in the fixture
 * file because it did not exist a moment ago — the page builds it from the
 * cart and the session, and falls back to the shape below when the link is
 * opened cold (forwarded on WhatsApp, reopened tomorrow), so the page reads
 * correctly either way.
 *
 * Every other id resolves against `mock-data.json` as before.
 */

export const CONFIRMATION_ORDER_ID = "FB-1042";

export type BakeStep = {
  key: string;
  label: string;
  /** "5:40" when it happened, otherwise the expected day. Never a guess. */
  at: string | null;
  done: boolean;
};

export type OrderView = {
  id: string;
  /** First name only. The headline is a greeting, not a salutation. */
  greetingName: string;
  promise: string;
  items: { slug: string; name: string; qty: number; lineTotal: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  /** "Indiranagar" or "Indiranagar, 5th Cross". */
  where: string;
  /** "Saturday 10 October, 4–6pm". */
  when: string;
  lane: "catch_the_van" | "home_delivery";
  bake: BakeStep[];
  /**
   * The step actually running right now, when the fixture knows of one. A
   * brand-new order has none: nothing is in the oven at 4:05pm because you
   * ordered at 4:05pm, and saying "Now" under Baking would be a small lie.
   */
  activeStep?: string;
  /** Drives which reason-to-return card renders. */
  orderCount: number;
  /** "the shokupan", when this order repeats something bought before. */
  repeatItem: string | null;
  /** The weekday a standing order would land on: "Saturday". */
  standingDay: string | null;
};

const BAKE_LABELS: { key: string; label: string }[] = [
  { key: "ordered", label: "Ordered" },
  { key: "baking", label: "Baking" },
  { key: "on_the_van", label: "On the van" },
  { key: "delivered", label: "Delivered" },
];

/** The four steps of a brand-new order: one done, three ahead of it. */
export function freshBake(dayLabel: string): BakeStep[] {
  const now = parseIso(AS_OF);
  const at = now
    ? `${((now.hour + 11) % 12) + 1}:${String(now.minute).padStart(2, "0")}`
    : null;
  return BAKE_LABELS.map((step, i) => ({
    ...step,
    at: i === 0 ? at : dayLabel,
    done: i === 0,
  }));
}

/**
 * The cold-open shape of FB-1042 — what the link shows when the cart that
 * made it is long gone.
 */
export function confirmationFallback(): OrderView {
  const items = [
    { slug: "milk-shokupan", qty: 1 },
    { slug: "custard-an-pan", qty: 2 },
  ].map((line) => {
    const product = getProductBySlug(line.slug);
    return {
      slug: line.slug,
      name: product?.name ?? line.slug,
      qty: line.qty,
      lineTotal: (product?.price ?? 0) * line.qty,
    };
  });
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const delivery = subtotal >= 499 ? 0 : 49;

  return {
    id: CONFIRMATION_ORDER_ID,
    greetingName: "Riya",
    promise:
      "Your order is on Saturday's list. We'll message you Friday night with the exact window.",
    items,
    subtotal,
    delivery,
    total: subtotal + delivery,
    where: "Indiranagar",
    when: "Saturday 10 October, 4–6pm",
    lane: "home_delivery",
    bake: freshBake("Saturday"),
    orderCount: customerOrderCount(),
    repeatItem: "the shokupan",
    standingDay: "Saturday",
  };
}

/** An order that really is in the fixtures. */
export function orderView(id: string): OrderView | null {
  const order = getOrder(id);
  if (!order) return null;

  const address = order.fulfilment.addressId
    ? getAddress(order.fulfilment.addressId)
    : undefined;

  const where =
    order.fulfilment.lane === "catch_the_van"
      ? (order.fulfilment.stopName ?? order.fulfilment.area)
      : address
        ? `${address.blockAndFlat}, ${address.society}, ${address.area}`
        : order.fulfilment.area;

  const windowLabel = order.fulfilment.window
    ? formatTimeBand(order.fulfilment.window)
    : (order.fulfilment.windowLabel ?? "");

  return {
    id: order.id,
    greetingName: firstName(getCustomer().name),
    promise: order.statusSentence,
    items: order.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      qty: item.qty,
      lineTotal: item.lineTotal,
    })),
    subtotal: order.money.subtotal,
    delivery: order.money.delivery ?? 0,
    total: order.money.total,
    where,
    when: [order.fulfilment.dateLabel, windowLabel].filter(Boolean).join(", "),
    lane: order.fulfilment.lane,
    bake: mockBake(order),
    activeStep: order.bakeStrip.find((step) => !step.done)?.step,
    orderCount: customerOrderCount(),
    repeatItem: repeatItemOf(order),
    standingDay: order.fulfilment.dateLabel?.split(" ")[0] ?? null,
  };
}

/** Four labelled steps out of the fixture's own strip. */
function mockBake(order: Order): BakeStep[] {
  return BAKE_LABELS.map((step, i) => {
    const source = order.bakeStrip[i];
    const parts = source?.at ? parseIso(source.at) : null;
    return {
      ...step,
      at: source?.atLabel
        ? source.atLabel
        : parts
          ? `${((parts.hour + 11) % 12) + 1}:${String(parts.minute).padStart(2, "0")}`
          : (order.fulfilment.dateLabel ?? null),
      done: Boolean(source?.done),
    };
  });
}

/**
 * The Standing Order pitch fires on the second order and never the first: the
 * first order proves the bread, the second is where the habit already exists.
 */
function customerOrderCount(): number {
  const customer = getCustomer() as Customer & { orderCount?: number };
  if (typeof customer.orderCount === "number") return customer.orderCount;
  return getOrders().filter((o) => o.status !== "cancelled").length;
}

function repeatItemOf(order: Order): string | null {
  const earlier = getOrders().filter(
    (o) => o.status !== "cancelled" && o.placedAt < order.placedAt,
  );
  const repeated = order.items.find((item) =>
    earlier.some((o) => o.items.some((i) => i.slug === item.slug)),
  );
  return repeated ? repeated.name.toLowerCase() : null;
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? full;
}

/** "2026-10-10" + "16:00-18:00" → "Saturday 10 October, 4–6pm". */
export function whenLabel(date: string | null, band: string | null): string {
  if (!date) return "";
  const day = formatLongDate(`${date}T00:00:00+05:30`);
  return band ? `${day}, ${formatTimeBandShort(band)}` : day;
}

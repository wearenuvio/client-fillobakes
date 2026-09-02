import type { BakeStripStep, Order, OrderStatus } from "@/lib/mock";
import type { BadgeVariant } from "@/components/ui/Badge";

/**
 * The order status vocabulary — mock-data's `orderStatusReference`, eleven
 * states, with the sentence site-content.md writes for each.
 *
 * The sentence is the point: an order screen that shows a pill and no
 * sentence tells the customer nothing they could act on.
 */

export type AnyOrderStatus =
  | OrderStatus
  | "confirmed"
  | "loaded"
  | "collected"
  | "refunded";

type StatusSpec = {
  label: string;
  sentence: string;
  tone: BadgeVariant;
  /** The last bake-strip step this status has reached; -1 is "none yet". */
  reached: number;
  cta?: { label: string; href?: string };
};

export const ORDER_STATUS: Record<string, StatusSpec> = {
  confirmed: {
    label: "Confirmed",
    sentence: "We have it. Baking starts Friday night.",
    tone: "info",
    reached: 0,
  },
  placed: {
    label: "Confirmed",
    sentence: "We have it. Baking starts Friday night.",
    tone: "info",
    reached: 0,
  },
  baking: {
    label: "Baking",
    sentence: "Your bread is in. Mixed at 4:10, in the oven at 5:40.",
    tone: "tint",
    reached: 1,
  },
  loaded: {
    label: "Loaded on the van",
    sentence: "Out of the oven and on board.",
    tone: "tint",
    reached: 2,
  },
  loading: {
    label: "Loaded on the van",
    sentence: "Out of the oven and on board.",
    tone: "tint",
    reached: 2,
  },
  out: {
    label: "Out on the route",
    sentence: "2 stops away. Around 4:40 to 4:50.",
    tone: "success",
    reached: 3,
  },
  delivered: {
    label: "Delivered",
    sentence: "Delivered at 4:47. Tear it, don't slice it.",
    tone: "success",
    reached: 4,
  },
  collected: {
    label: "Collected",
    sentence: "Collected at Indiranagar, 4:52. Thanks for coming out.",
    tone: "success",
    reached: 4,
  },
  missed: {
    label: "Missed at the stop",
    sentence: "We waited at Indiranagar till 6:10. Message us and we'll sort it.",
    tone: "warning",
    reached: 3,
    cta: { label: "Message us on WhatsApp" },
  },
  cancelled: {
    label: "Cancelled",
    sentence:
      "Cancelled. Nothing further will be charged, and the refund is with Razorpay — 7 to 10 working days.",
    tone: "muted",
    reached: 0,
  },
  refunded: {
    label: "Refunded",
    sentence:
      "Refunded in full. It's with Razorpay — 7 to 10 working days to reach your bank.",
    tone: "muted",
    reached: 0,
  },
  payment_pending: {
    label: "Payment pending",
    sentence: "We're waiting on your bank. Nothing is confirmed yet.",
    tone: "warning",
    reached: -1,
  },
  failed: {
    label: "Payment failed",
    sentence: "Nothing was charged and your order wasn't booked.",
    tone: "danger",
    reached: -1,
    cta: { label: "Try again", href: "/checkout" },
  },
};

export function statusSpec(status: string): StatusSpec {
  return ORDER_STATUS[status] ?? ORDER_STATUS.confirmed;
}

/**
 * Re-derives the bake strip for a status without inventing a timestamp:
 * a step the order has not reached loses its clock and goes back to unticked,
 * which is exactly what a null means in the fixtures.
 */
export function stripForStatus(
  steps: BakeStripStep[],
  status: string,
): BakeStripStep[] {
  const reached = statusSpec(status).reached;
  return steps.map((step, index) =>
    index <= reached
      ? step
      : { ...step, done: false, at: null, sentence: undefined },
  );
}

/** The active cell — the first one that has not happened yet. */
export function activeStepKey(steps: BakeStripStep[]): string | undefined {
  return steps.find((s) => !s.done)?.step;
}

/** An order rendered in a status other than its own, for the state gallery. */
export function orderInStatus(order: Order, status: string): Order {
  const spec = statusSpec(status);
  if (status === order.status) return order;
  return {
    ...order,
    status: status as OrderStatus,
    statusLabel: spec.label,
    statusSentence: spec.sentence,
    bakeStrip: stripForStatus(order.bakeStrip, status),
    canChange: status === "confirmed" || status === "payment_pending",
  };
}

/** Upcoming = not yet in the customer's hands and not cancelled. */
export function isUpcoming(status: string): boolean {
  return ["confirmed", "placed", "baking", "loaded", "loading", "out", "payment_pending"].includes(
    status,
  );
}

export function isClosed(status: string): boolean {
  return ["delivered", "collected", "missed"].includes(status);
}

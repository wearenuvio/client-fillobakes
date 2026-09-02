import { getLatestOrder, type Order } from "@/lib/mock";
import { formatShortDate } from "@/lib/format";
import { standingOrder } from "@/components/pages/account/subscriptionData";

/**
 * Small readers for the fields mock-data.json carries but `lib/mock`'s Order
 * type does not name (the fixture calls the van stop `stopLabel`; the type
 * calls it `stopName`). Kept in one place so no page casts inline.
 */

export function stopLabelOf(order: Order): string | null {
  const f = order.fulfilment as unknown as { stopLabel?: string; stopName?: string };
  return f.stopLabel ?? f.stopName ?? null;
}

/** "Indiranagar, 12th Main" for the van lane, the address area for delivery. */
export function whereLabel(order: Order): string {
  return stopLabelOf(order) ?? order.fulfilment.area;
}

export type OrderExtras = {
  cancelledAt?: string;
  canReorder?: boolean;
  reportWindowOpen?: boolean;
  reportWindowCopy?: string;
};

export function extrasOf(order: Order): OrderExtras {
  return order as unknown as OrderExtras;
}

export type MoneyExtras = {
  refunded?: number;
  refundReference?: string;
  refundInitiatedAt?: string;
  discount: { code: string | null; amount: number; label?: string };
};

export function moneyExtras(order: Order): MoneyExtras {
  return order.money as unknown as MoneyExtras;
}

/**
 * The area chip repeated on the dashboard head: place, mode, next slot — the
 * same three facts the header chip carries (site-content, "The area chip").
 */
export function accountChipLabel(): string {
  const subscription = standingOrder("active");
  const order = getLatestOrder();
  const area = order?.fulfilment.area ?? subscription.area;
  const date = order
    ? formatShortDate(order.fulfilment.date)
    : subscription.nextDelivery.dateLabel;
  const window = order?.fulfilment.windowLabel ?? subscription.windowLabel;
  return `${area} · ${date} · ${window}`;
}

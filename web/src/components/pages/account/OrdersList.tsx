"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoafGlyph } from "@/components/ui/LineArt";
import { Price } from "@/components/ui/Price";
import { cn } from "@/lib/cn";
import { getOrders } from "@/lib/mock";
import { ItemThumbs } from "@/components/pages/account/ItemThumbs";
import { ReorderButton } from "@/components/pages/account/AddAgain";
import { whereLabel } from "@/components/pages/account/orderData";
import { isUpcoming, statusSpec } from "@/components/pages/account/orderStatus";
import type { OrdersListState } from "@/components/pages/account/states";

/**
 * Orders — site-content "Screen: Orders".
 *
 * Rows, newest first: date, thumbnails, stop or address, total, status pill,
 * reorder and the invoice. Filtering is client-side over the fixture; there
 * is no search, because three orders do not need one.
 */

const FILTERS = ["All", "Upcoming", "Delivered", "Cancelled"] as const;
type Filter = (typeof FILTERS)[number];

export function OrdersList({ state = "default" }: { state?: OrdersListState }) {
  const [filter, setFilter] = React.useState<Filter>("All");
  const orders = state === "empty" ? [] : getOrders();

  const visible = orders.filter((order) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return isUpcoming(order.status);
    if (filter === "Delivered") return ["delivered", "collected"].includes(order.status);
    return ["cancelled", "refunded"].includes(order.status);
  });

  if (orders.length === 0) {
    return (
      <EmptyState
        glyph={<LoafGlyph size={96} />}
        title="No orders yet."
        body="The first one is the hard one. Bangalore Bloom is ₹99 and most people start there."
        action={<ButtonLink href="/shop">See this week&rsquo;s bake</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter orders"
        className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] sm:mx-0 sm:px-0"
      >
        {FILTERS.map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(option)}
              className={cn(
                "micro h-11 rounded-sm px-4 whitespace-nowrap transition-colors",
                "duration-[var(--dur-fast)]",
                active
                  ? "bg-ink-800 text-paper-0"
                  : "border border-paper-300 text-ink-600 hover:text-ink-800",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-body text-ink-600">
          Nothing in that filter yet.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-paper-300 border-y border-paper-300">
          {visible.map((order) => {
            const spec = statusSpec(order.status);
            return (
              <li key={order.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="micro text-ink-500 tabular">
                      {order.fulfilment.dateLabel} · {order.id}
                    </p>
                    <p className="mt-2 text-title text-ink-800">
                      {order.items.map((i) => `${i.qty} ${i.name}`).join(", ")}
                    </p>
                    <p className="mt-1 text-body-sm text-ink-600 tabular">
                      {order.fulfilment.laneLabel} · {whereLabel(order)}
                      {order.fulfilment.windowLabel ? ` · ${order.fulfilment.windowLabel}` : ""}
                    </p>
                  </div>
                  <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
                    <Badge variant={spec.tone}>{spec.label}</Badge>
                    <Price amount={order.money.total} size="md" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <ItemThumbs items={order.items} />
                  <div className="flex flex-wrap items-center gap-3">
                    <ReorderButton
                      items={order.items.map((i) => ({ slug: i.slug, qty: i.qty }))}
                    />
                    <Link
                      href={`/account/orders/${order.id}#invoice`}
                      className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                    >
                      Invoice
                    </Link>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                    >
                      See this order
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

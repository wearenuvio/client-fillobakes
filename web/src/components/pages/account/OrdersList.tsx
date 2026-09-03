"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { LoafGlyph } from "@/components/ui/LineArt";
import { Price } from "@/components/ui/Price";
import { getOrders } from "@/lib/mock";
import { Panel } from "@/components/pages/account/Panel";
import { ItemThumbs } from "@/components/pages/account/ItemThumbs";
import { ReorderButton } from "@/components/pages/account/AddAgain";
import { whereLabel } from "@/components/pages/account/orderData";
import { statusSpec } from "@/components/pages/account/orderStatus";
import type { OrdersListState } from "@/components/pages/account/states";

/**
 * Orders — PAGES-v2 Account, "Orders".
 *
 * One card per order, newest first: date, items, where, total, a status chip
 * and one way back into the box. Three orders do not need a filter bar, and a
 * second row of tabs under the account tabs would be two navigations arguing
 * on a 375px screen.
 */
export function OrdersList({ state = "default" }: { state?: OrdersListState }) {
  const orders = state === "empty" ? [] : getOrders();

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-card px-6 py-16 text-center">
        <span aria-hidden="true" className="mx-auto mb-6 block w-fit opacity-20">
          <LoafGlyph size={88} />
        </span>
        <p className="font-display text-[26px] leading-tight text-ink">
          No orders yet.
        </p>
        <p className="mx-auto mt-2 max-w-[38ch] text-body text-ink-2">
          Twenty-three bakes, all eggless, all out of the oven this morning.
        </p>
        <ButtonLink href="/shop" className="mt-7">
          See the menu
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-5 lg:gap-6">
      {orders.map((order) => {
        const spec = statusSpec(order.status);
        return (
          <Panel as="li" key={order.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase tabular">
                {order.fulfilment.dateLabel}
              </p>
              <Badge variant={spec.tone}>{spec.label}</Badge>
            </div>

            <h2 className="mt-4 font-display text-[22px] leading-snug text-ink">
              {order.items.map((i) => `${i.qty} ${i.name}`).join(", ")}
            </h2>
            <p className="mt-1 text-body-sm text-ink-2 tabular">
              {order.fulfilment.laneLabel} · {whereLabel(order)}
              {order.fulfilment.windowLabel ? ` · ${order.fulfilment.windowLabel}` : ""}
            </p>

            <div className="mt-5 flex items-center gap-4 border-t border-line pt-5">
              <ItemThumbs items={order.items} size={44} max={2} className="shrink-0" />
              <span className="flex-1" />
              <Price amount={order.money.total} size="lg" className="shrink-0" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ReorderButton
                items={order.items.map((i) => ({ slug: i.slug, qty: i.qty }))}
                variant="secondary"
              />
              <Link
                href={`/account/orders/${order.id}`}
                className="link-underline inline-flex items-center gap-2 text-body-sm font-semibold text-accent"
              >
                See this order
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </Panel>
        );
      })}
    </ul>
  );
}

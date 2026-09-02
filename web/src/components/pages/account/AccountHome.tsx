"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, Coins } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { DropCardLike } from "@/components/pages/account/NextUp";
import { Panel, PanelHead } from "@/components/pages/account/Panel";
import { CoinProgress } from "@/components/pages/account/CoinProgress";
import { AddAgain } from "@/components/pages/account/AddAgain";
import { ACCOUNT_NAV } from "@/components/pages/account/AccountNav";
import { statusSpec } from "@/components/pages/account/orderStatus";
import { dayName, standingOrder } from "@/components/pages/account/subscriptionData";
import { getProductBySlug } from "@/lib/catalog";
import {
  getCustomer,
  getLatestOrder,
  getLoyaltyLedger,
  getVanStripCopy,
} from "@/lib/mock";
import { pluralise } from "@/lib/format";
import { stopLabelOf } from "@/components/pages/account/orderData";
import type { DashboardState } from "@/components/pages/account/states";

/**
 * The account dashboard — journey §5.2 and site-content "Screen: Account".
 *
 * The block order is the order of what people come here to do: what is
 * arriving, then the standing order, then coins, then order again. Every
 * screen in this area answers "what happens next, and when" — an account
 * page that only shows history is a filing cabinet.
 */
export function AccountHome({ state = "default" }: { state?: DashboardState }) {
  const customer = getCustomer();
  const order = getLatestOrder();
  const subscription = standingOrder("active");
  const pausedState = standingOrder("paused");
  const failedState = standingOrder("payment_failed");
  const ledger = getLoyaltyLedger();
  const vanStrip = getVanStripCopy();
  const { toast } = useToast();

  const [skipOpen, setSkipOpen] = React.useState(false);
  const [skipped, setSkipped] = React.useState(false);

  const isNew = state === "new";
  const hasOrder = !isNew;
  const orderCount = isNew ? 0 : ((customer as unknown as { orderCount?: number }).orderCount ?? 0);
  const hasSubscription = !isNew && state !== "no_standing_order";
  const paused = state === "paused";
  const paymentFailed = state === "payment_failed";
  const paymentFailedCopy = failedState;
  const pausedCopy = pausedState;

  const spec = order ? statusSpec(order.status) : null;
  const recent = hasOrder && order ? order.items.slice(0, 3) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* The payment-failed banner sits above everything, per journey §5.2. */}
      {paymentFailed ? (
        <div className="rounded-md bg-warning-tint p-4 sm:p-6">
          <p className="flex items-start gap-2 text-body text-warning">
            <AlertCircle size={20} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
            {paymentFailedCopy.banner}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              onClick={() => toast({ message: "Payment retried. We'll confirm on WhatsApp." })}
            >
              {paymentFailedCopy.cta}
            </Button>
            <p className="text-caption text-ink-600">{paymentFailedCopy.fallback}</p>
          </div>
        </div>
      ) : null}

      {/* 1 — Next up. The largest card on the page. */}
      {hasOrder && order && spec ? (
        <DropCardLike
          kicker={`${order.fulfilment.laneLabel} · ${order.fulfilment.area}`}
          badge={<Badge variant={spec.tone}>{spec.label}</Badge>}
          heading={order.fulfilment.dateLabel}
          detail={[
            order.fulfilment.windowLabel,
            stopLabelOf(order) ?? order.fulfilment.area,
          ]
            .filter(Boolean)
            .join(" · ")}
          items={order.items.map((i) => `${i.qty} ${i.name}`).join(", ")}
          total={order.money.total}
          live={order.status === "out" ? vanStrip.live_near_you : spec.sentence}
          actions={
            <>
              <ButtonLink href="/van">Track the van</ButtonLink>
              {order.canChange ? (
                <ButtonLink href={`/account/orders/${order.id}`} variant="secondary">
                  Change or cancel
                </ButtonLink>
              ) : (
                <ButtonLink href={`/account/orders/${order.id}`} variant="secondary">
                  See this order
                </ButtonLink>
              )}
            </>
          }
          note={order.canChange ? undefined : order.changeClosedCopy}
        />
      ) : (
        <Panel>
          <PanelHead label="Next up" />
          <p className="mt-4 text-display-sm text-ink-800">
            Nothing on the van for you yet.
          </p>
          <p className="mt-2 text-body text-ink-600">
            This week we&rsquo;ve got milk bread, custard an pan and three kinds of
            pastry.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/shop">See this week&rsquo;s bake</ButtonLink>
            <ButtonLink href="/van" variant="secondary">
              Where the van goes
            </ButtonLink>
          </div>
        </Panel>
      )}

      {/* 2 — Your standing order. */}
      {hasSubscription ? (
        <Panel tone={paused ? "muted" : "default"}>
          <PanelHead
            label="Your standing order"
            trailing={
              <Badge variant={paused ? "muted" : "success"}>
                {paused ? "Paused" : subscription.statusLabel}
              </Badge>
            }
          />
          <p className="mt-4 text-title text-ink-800">
            {subscription.plan.name} · every {dayName(subscription.routeDay)} ·{" "}
            {subscription.stopLabel} {subscription.windowLabel}
          </p>
          {paused ? (
            <p className="mt-2 text-body-sm text-ink-600">{pausedCopy.copy}</p>
          ) : (
            <p className="mt-2 text-body-sm text-ink-600 tabular">
              Next: {subscription.nextDelivery.dateLabel}. {subscription.cutoff.label}.
            </p>
          )}
          {skipped ? (
            <p className="mt-4 flex items-start gap-2 rounded-md bg-warning-tint p-3 text-body-sm text-warning">
              <AlertCircle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                {subscription.nextDelivery.dateLabel} skipped.{" "}
                <button
                  type="button"
                  className="link-underline text-warning"
                  onClick={() => {
                    setSkipped(false);
                    toast({ message: "Back on. Nothing else changed." });
                  }}
                >
                  Undo
                </button>
              </span>
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            {paused ? (
              <Button onClick={() => toast({ message: "Resumed. Next delivery is back on." })}>
                {pausedCopy.cta}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setSkipOpen(true)}
                disabled={skipped}
              >
                Skip this week
              </Button>
            )}
            <ButtonLink href="/account/subscription" variant="ghost">
              Manage
            </ButtonLink>
          </div>
        </Panel>
      ) : orderCount >= 2 ? (
        <Panel>
          <PanelHead label="The Standing Order" />
          <p className="mt-4 text-display-sm text-ink-800">
            Same loaf, same day, no thinking about it.
          </p>
          <p className="mt-2 text-body text-ink-600">
            One Milk Shokupan every Saturday at {subscription.stopLabel}, at{" "}
            <span className="tabular">₹{subscription.plan.weeklyPrice}</span> instead of{" "}
            <span className="tabular">₹{subscription.plan.listPrice}</span>. Skip any week,
            pause anytime, cancel in one tap.
          </p>
          <div className="mt-6">
            <ButtonLink href="/account/subscription/setup">
              Set up a standing order
            </ButtonLink>
          </div>
        </Panel>
      ) : null}

      {/* 3 — Fillo coins. */}
      <Panel>
        <PanelHead
          label="Fillo coins"
          trailing={
            customer.filloPlus.foundingMember && !isNew ? (
              <Badge variant="crumb">Founding member</Badge>
            ) : null
          }
        />
        {isNew ? (
          <>
            <p className="mt-4 text-body text-ink-800">
              No coins yet. They land the moment an order is delivered, not when you
              pay.
            </p>
            <div className="mt-6">
              <ButtonLink href="/fillo-plus" variant="ghost">
                How Fillo+ works
              </ButtonLink>
            </div>
          </>
        ) : customer.filloPlus.isMember ? (
          <>
            <p className="mt-4 flex items-baseline gap-3">
              <Coins size={20} strokeWidth={1.5} className="text-ink-600" aria-hidden="true" />
              <span className="text-display-sm text-ink-800 tabular">
                {pluralise(ledger.balance, "coin")}
              </span>
              <span className="text-body-sm text-ink-600 tabular">
                {ledger.coinsToNextRedemption} more for ₹{ledger.redemptionValue} off
              </span>
            </p>
            <CoinProgress
              className="mt-4"
              balance={ledger.balance}
              threshold={ledger.redeemThreshold}
            />
            <div className="mt-6">
              <ButtonLink href="/account/rewards" variant="ghost">
                See your coins
              </ButtonLink>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-body text-ink-800">
              You&rsquo;re not on Fillo+ yet. It&rsquo;s free, and you start earning on
              your next order.
            </p>
            <div className="mt-6">
              <ButtonLink href="/fillo-plus">Join Fillo+ — free</ButtonLink>
            </div>
          </>
        )}
      </Panel>

      {/* 4 — Order again. */}
      {recent.length ? (
        <Panel>
          <PanelHead label="Order again" />
          <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {recent.map((item) => {
              const product = getProductBySlug(item.slug);
              return (
                <li
                  key={item.slug}
                  className="flex min-w-0 items-center justify-between gap-4 rounded-md border border-paper-300 px-4 py-3 sm:w-auto"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-body-sm text-ink-800">
                      {item.name}
                    </span>
                    {product ? (
                      <Price
                        amount={product.price}
                        size="sm"
                        className="mt-0.5 block"
                      />
                    ) : null}
                  </span>
                  <AddAgain slug={item.slug} name={item.name} variant="ghost" />
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}

      {/* 5 — The nav row, repeated as text at the foot of the dashboard. */}
      <nav aria-label="Account sections" className="border-t border-paper-300 pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {ACCOUNT_NAV.filter((item) => item.href !== "/account").map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="micro link-underline text-ink-600 hover:text-ink-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Dialog
        open={skipOpen}
        onClose={() => setSkipOpen(false)}
        title="Skip this week?"
        description={`Skipping ${subscription.nextDelivery.dateLabel}. You won't be charged. Back the week after.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSkipOpen(false)}>
              Keep it
            </Button>
            <Button
              onClick={() => {
                setSkipped(true);
                setSkipOpen(false);
                toast({
                  message: `${subscription.nextDelivery.dateLabel} skipped. You won't be charged.`,
                });
              }}
            >
              Skip this week
            </Button>
          </>
        }
      />
    </div>
  );
}

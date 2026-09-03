"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, PauseCircle, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { Panel, PanelHead, Notice } from "@/components/pages/account/Panel";
import { CoinProgress } from "@/components/pages/account/CoinProgress";
import { ItemThumbs } from "@/components/pages/account/ItemThumbs";
import { AddAgain } from "@/components/pages/account/AddAgain";
import { ACCOUNT_NAV } from "@/components/pages/account/AccountNav";
import { statusSpec } from "@/components/pages/account/orderStatus";
import { dayName, standingOrder } from "@/components/pages/account/subscriptionData";
import { getProductBySlug } from "@/lib/catalog";
import { getCustomer, getLatestOrder, getLoyaltyLedger } from "@/lib/mock";
import { stopLabelOf } from "@/components/pages/account/orderData";
import type { DashboardState } from "@/components/pages/account/states";

/**
 * The account overview — PAGES-v2 Account, "Home".
 *
 * Four things in the order people came for them: what is arriving, the
 * standing order, the coins, and the last order to put back in the box. One
 * terracotta button on the screen; everything else is an outline or a link.
 */
export function AccountHome({ state = "default" }: { state?: DashboardState }) {
  const customer = getCustomer();
  const order = getLatestOrder();
  const subscription = standingOrder("active");
  const paused = standingOrder("paused");
  const failed = standingOrder("payment_failed");
  const ledger = getLoyaltyLedger();
  const { toast } = useToast();

  const [skipOpen, setSkipOpen] = React.useState(false);
  const [skipped, setSkipped] = React.useState(false);

  const isNew = state === "new";
  const hasOrder = !isNew && Boolean(order);
  const orderCount =
    isNew ? 0 : ((customer as unknown as { orderCount?: number }).orderCount ?? 0);
  const hasSubscription = !isNew && state !== "no_standing_order";
  const isPaused = state === "paused";
  const paymentFailed = state === "payment_failed";

  const spec = order ? statusSpec(order.status) : null;
  const recent = hasOrder && order ? order.items.slice(0, 2) : [];

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {paymentFailed ? (
        <Notice
          tone="attention"
          icon={<AlertCircle size={20} strokeWidth={1.5} />}
          actions={
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  toast({ message: "Payment retried. We will confirm on WhatsApp." })
                }
              >
                {failed.cta ?? "Retry payment"}
              </Button>
              <span className="text-body-sm text-muted">{failed.fallback}</span>
            </>
          }
        >
          {failed.banner}
        </Notice>
      ) : null}

      {isPaused ? (
        <Notice icon={<PauseCircle size={20} strokeWidth={1.5} />}>
          {paused.copy ?? "Your standing order is paused. Nothing is being charged."}
        </Notice>
      ) : null}

      {/* ---- 1. Next delivery ----------------------------------------- */}
      {hasOrder && order && spec ? (
        <Panel>
          <PanelHead
            label={order.fulfilment.laneLabel}
            trailing={<Badge variant={spec.tone}>{spec.label}</Badge>}
          />

          <h2 className="mt-4 font-display text-[28px] leading-tight text-ink">
            {order.fulfilment.dateLabel}
          </h2>
          <p className="mt-1 text-body text-ink-2 tabular">
            {[order.fulfilment.windowLabel, stopLabelOf(order) ?? order.fulfilment.area]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <div className="mt-5 flex items-center gap-4 border-t border-line pt-5">
            <ItemThumbs items={order.items} size={44} max={2} className="shrink-0" />
            <p className="min-w-0 flex-1 text-body-sm text-ink-2">
              {order.items.map((i) => `${i.qty} ${i.name}`).join(", ")}
            </p>
            <Price amount={order.money.total} size="lg" className="shrink-0" />
          </div>

          {order.status === "out" ? (
            <p className="mt-5 flex items-start gap-2 text-body-sm text-ink">
              <Truck
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-accent"
              />
              <span className="tabular">{spec.sentence}</span>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {order.status === "out" ? (
              <ButtonLink href="/van">Track the van</ButtonLink>
            ) : (
              <ButtonLink href={`/account/orders/${order.id}`}>
                See this order
              </ButtonLink>
            )}
            {order.canChange ? (
              <Link
                href={`/account/orders/${order.id}`}
                className="link-underline text-body-sm font-semibold text-accent"
              >
                Change
              </Link>
            ) : null}
          </div>

          {order.canChange ? null : (
            <p className="mt-4 text-body-sm text-muted">{order.changeClosedCopy}</p>
          )}
        </Panel>
      ) : (
        <Panel>
          <PanelHead label="Next delivery" />
          <h2 className="mt-4 font-display text-[28px] leading-tight text-ink">
            Nothing on the van for you yet.
          </h2>
          <p className="mt-2 max-w-[42ch] text-body text-ink-2">
            Milk bread, custard an pan and three kinds of pastry are baking this
            week.
          </p>
          <ButtonLink href="/shop" className="mt-6">
            See the menu
          </ButtonLink>
        </Panel>
      )}

      {/* ---- 2. Standing order ---------------------------------------- */}
      {hasSubscription ? (
        <Panel tone={isPaused ? "muted" : "default"}>
          <PanelHead
            label="Standing order"
            trailing={
              <Badge variant={isPaused ? "muted" : "success"}>
                {isPaused ? "Paused" : subscription.statusLabel}
              </Badge>
            }
          />
          <p className="mt-4 font-display text-[22px] leading-snug text-ink">
            {subscription.plan.name}, every {dayName(subscription.routeDay)}
          </p>
          <p className="mt-1 text-body-sm text-ink-2 tabular">
            {isPaused
              ? (paused.copy ?? "Paused. Nothing is charged while it is paused.")
              : `${subscription.stopLabel} · ${subscription.windowLabel} · next ${subscription.nextDelivery.dateLabel}`}
          </p>

          {skipped ? (
            <p className="mt-4 text-body-sm text-ink-2">
              {subscription.nextDelivery.dateLabel} skipped.{" "}
              <button
                type="button"
                className="link-underline font-semibold text-accent"
                onClick={() => {
                  setSkipped(false);
                  toast({ message: "Back on. Nothing else changed." });
                }}
              >
                Undo
              </button>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            {isPaused ? (
              <Button
                variant="secondary"
                onClick={() => toast({ message: "Resumed. Your next delivery is back on." })}
              >
                Resume
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setSkipOpen(true)}
                disabled={skipped}
              >
                {skipped ? "Skipped" : "Skip this week"}
              </Button>
            )}
            <Link
              href="/account/subscription"
              className="link-underline text-body-sm font-semibold text-accent"
            >
              Manage
            </Link>
          </div>
        </Panel>
      ) : orderCount >= 2 ? (
        <Panel tone="peach">
          <PanelHead label="The Standing Order" />
          <p className="mt-3 max-w-[16ch] font-display text-[clamp(26px,3vw,32px)] leading-[1.05] text-ink">
            Your bread, every week.
          </p>
          <p className="mt-3 max-w-[42ch] text-body text-ink-2">
            One Milk Shokupan every Saturday at {subscription.stopLabel}. Skip any
            week, pause any time.
          </p>
          <ButtonLink
            href="/account/subscription/setup"
            variant="secondary"
            className="mt-6"
          >
            Set it up
          </ButtonLink>
        </Panel>
      ) : null}

      {/* ---- 3. Coins -------------------------------------------------- */}
      <Panel>
        <PanelHead
          label="Fillo coins"
          trailing={
            customer.filloPlus.foundingMember && !isNew ? (
              <Badge variant="warning">Founding member</Badge>
            ) : null
          }
        />
        {isNew || !customer.filloPlus.isMember ? (
          <>
            <p className="mt-4 max-w-[44ch] text-body text-ink-2">
              Fillo+ is free. Two coins for every ₹100, and 25 coins is ₹25 off.
            </p>
            <ButtonLink href="/fillo-plus" variant="secondary" className="mt-6">
              Join free
            </ButtonLink>
          </>
        ) : (
          <>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-[40px] leading-none text-ink tabular">
                {ledger.balance}
              </span>
              <span className="text-body-sm text-ink-2 tabular">
                {ledger.coinsToNextRedemption} more for ₹{ledger.redemptionValue} off
              </span>
            </p>
            <CoinProgress
              className="mt-5 max-w-[420px]"
              balance={ledger.balance}
              threshold={ledger.redeemThreshold}
            />
            <Link
              href="/account/rewards"
              className="link-underline mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-accent"
            >
              See your coins
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </>
        )}
      </Panel>

      {/* ---- 4. Order again -------------------------------------------- */}
      {recent.length ? (
        <Panel>
          <PanelHead label="Order again" />
          <ul className="mt-4 divide-y divide-line border-t border-line">
            {recent.map((item) => {
              const product = getProductBySlug(item.slug);
              return (
                <li
                  key={item.slug}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <ItemThumbs items={[item]} size={40} max={1} />
                    <span className="min-w-0">
                      <span className="block truncate text-body-sm text-ink">
                        {item.name}
                      </span>
                      {product ? (
                        <Price amount={product.price} size="sm" className="mt-0.5 block" />
                      ) : null}
                    </span>
                  </span>
                  <AddAgain slug={item.slug} name={item.name} variant="secondary" />
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}

      {/* ---- 5. Quick links -------------------------------------------- */}
      <nav aria-label="Account sections" className="border-t border-line pt-6">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {ACCOUNT_NAV.filter((item) => item.href !== "/account").map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="link-underline text-body-sm text-ink-2 hover:text-ink"
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
        title={`Skip ${subscription.nextDelivery.dateLabel}?`}
        description="You will not be charged, and it is back the week after."
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
                  message: `${subscription.nextDelivery.dateLabel} skipped. You will not be charged.`,
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

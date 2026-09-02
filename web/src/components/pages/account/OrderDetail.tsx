"use client";

import * as React from "react";
import { AlertCircle, Check, MessageCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/Field";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { TrackerCard } from "@/components/blocks/TrackerCard";
import { FulfilmentSummary } from "@/components/blocks/FulfilmentLane";
import { cn } from "@/lib/cn";
import { formatINR, formatTimeOfDay } from "@/lib/format";
import { getAddress, getVanState, type Order } from "@/lib/mock";
import { whatsappHref } from "@/lib/config";
import { Panel, PanelHead, MetaRow } from "@/components/pages/account/Panel";
import { ItemThumbs } from "@/components/pages/account/ItemThumbs";
import { ReorderButton } from "@/components/pages/account/AddAgain";
import {
  extrasOf,
  moneyExtras,
  whereLabel,
} from "@/components/pages/account/orderData";
import { statusSpec } from "@/components/pages/account/orderStatus";
import { OrderTimeline } from "@/components/pages/account/OrderTimeline";

/**
 * Order detail — site-content "Screen: Order detail".
 *
 * Everything on /order/[id], plus the invoice, the payment method and a way
 * to tell us something went wrong. The five-step strip carries real
 * timestamps only: a step that has not happened has no clock, because a
 * fabricated bake strip is worse than no bake strip.
 */
export function OrderDetail({ order }: { order: Order }) {
  // The fixture's status vocabulary is wider than lib/mock's OrderStatus union
  // (it also carries confirmed, loaded, collected and refunded), so compare on
  // the string rather than narrowing it away.
  const status: string = order.status;
  const spec = statusSpec(status);
  const extras = extrasOf(order);
  const money = moneyExtras(order);
  const address = order.fulfilment.addressId
    ? getAddress(order.fulfilment.addressId)
    : undefined;
  const { toast } = useToast();

  const [changeOpen, setChangeOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [problemOpen, setProblemOpen] = React.useState(false);
  const [cancelled, setCancelled] = React.useState(false);
  const [changedTo, setChangedTo] = React.useState<string | null>(null);
  const [rated, setRated] = React.useState<number | null>(null);

  const delivered = status === "delivered" || status === "collected";
  const closed = ["cancelled", "refunded"].includes(status) || cancelled;
  const reportOpen = extras.reportWindowOpen !== false;

  const windows = address?.availableWindows ?? ["16:00-18:00", "18:00-20:00"];

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------------------------------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="micro text-ink-500 tabular">
            {order.fulfilment.dateLabel}
          </p>
          <Badge variant={cancelled ? "muted" : spec.tone}>
            {cancelled ? "Cancelled" : spec.label}
          </Badge>
        </div>
        <p className="mt-4 text-display-sm text-ink-800">
          {cancelled
            ? "Cancelled. Nothing further will be charged, and the refund is with Razorpay — 7 to 10 working days."
            : order.statusSentence}
        </p>
        {changedTo ? (
          <p className="mt-4 flex items-start gap-2 rounded-md bg-success-tint p-3 text-body-sm text-success">
            <Check size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
            Changed. {changedTo}. Same total.
          </p>
        ) : null}
        {spec.cta && !closed ? (
          <div className="mt-6">
            {spec.cta.href ? (
              <ButtonLink href={spec.cta.href}>{spec.cta.label}</ButtonLink>
            ) : (
              <ButtonLink
                href={whatsappHref(`Hi Fillo — question about order ${order.id}.`)}
                variant="secondary"
                icon={<MessageCircle size={16} strokeWidth={1.5} />}
                iconPosition="leading"
              >
                {spec.cta.label}
              </ButtonLink>
            )}
          </div>
        ) : null}
      </Panel>

      {/* ---- The bake strip. Real timestamps, nulls stay unticked. -------- */}
      <Panel>
        <PanelHead label="What happened, and when" />
        <OrderTimeline className="mt-4" steps={order.bakeStrip} />
        <p className="nano mt-4 border-t border-paper-300 pt-4 text-ink-500">
          Every time here is a real one from the kitchen. A step with no time has
          not happened yet.
        </p>
      </Panel>

      {/* ---- The tracker, embedded where the customer will actually look -- */}
      {status === "out" && !cancelled ? (
        <TrackerCard van={getVanState("live")} />
      ) : null}

      {/* ---- Where and when ---------------------------------------------- */}
      <Panel>
        <PanelHead label="Where and when" />
        <FulfilmentSummary
          className="mt-2"
          lane={order.fulfilment.lane}
          detail={`${order.fulfilment.dateLabel} · ${whereLabel(order)}${
            order.fulfilment.windowLabel ? ` · ${order.fulfilment.windowLabel}` : ""
          }`}
        />
        {address ? (
          <address className="mt-4 text-body-sm text-ink-600 not-italic">
            {address.label} · {address.blockAndFlat}, {address.society}
            <br />
            {address.landmark ? `${address.landmark}, ` : ""}
            {address.area} {address.pincode}
          </address>
        ) : null}
      </Panel>

      {/* ---- Items and money --------------------------------------------- */}
      <Panel>
        <PanelHead
          label="Your order"
          trailing={<ItemThumbs items={order.items} size={40} />}
        />
        <ul className="mt-4 divide-y divide-paper-300 border-y border-paper-300">
          {order.items.map((item) => (
            <li key={item.slug} className="flex items-baseline gap-4 py-3">
              <span className="min-w-0 flex-1 text-body text-ink-800">
                <span className="tabular">{item.qty}</span> × {item.name}
                {item.variant ? (
                  <span className="text-ink-500"> · {item.variant}</span>
                ) : null}
              </span>
              <Price amount={item.lineTotal} size="sm" />
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <MetaRow label="Subtotal" value={formatINR(order.money.subtotal)} />
          {money.discount.amount ? (
            <MetaRow
              label={money.discount.label ?? "Discount"}
              value={`−${formatINR(money.discount.amount)}`}
            />
          ) : null}
          <MetaRow
            label="Delivery"
            value={
              order.money.delivery === null
                ? "TBC"
                : order.money.delivery === 0
                  ? (order.money.deliveryLabel ?? "Free")
                  : formatINR(order.money.delivery)
            }
          />
          <MetaRow label={`Tax ${order.money.taxRateLabel}`} value={formatINR(order.money.tax)} />
          <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-paper-300 pt-4">
            <span className="text-title text-ink-800">Total</span>
            <Price amount={order.money.total} size="lg" />
          </div>
          {money.refunded ? (
            <p className="mt-3 text-caption text-ink-500 tabular">
              Refunded {formatINR(money.refunded)} to your UPI app — reference{" "}
              {money.refundReference}.
            </p>
          ) : null}
        </div>
      </Panel>

      {/* ---- Payment and invoice ----------------------------------------- */}
      <Panel id="invoice">
        <PanelHead label="Payment and invoice" />
        <div className="mt-2">
          <MetaRow label="Paid with" value={order.payment.methodLabel} />
          <MetaRow label="Processor" value={order.payment.processor} />
          <MetaRow label="Reference" value={order.payment.reference ?? "—"} />
          <MetaRow
            label="Paid at"
            value={order.payment.paidAt ? formatTimeOfDay(order.payment.paidAt) : "—"}
          />
          <MetaRow label="Invoice" value={order.id} />
        </div>
        <p className="mt-4 text-caption text-ink-500">
          Your invoice goes out on WhatsApp with the order confirmation. Ask us and
          we&rsquo;ll send it again.
        </p>
      </Panel>

      {/* ---- Actions, gated by the cutoff -------------------------------- */}
      <Panel>
        <PanelHead label="Change this order" />
        {closed ? (
          <p className="mt-4 text-body text-ink-600">
            This order is closed. Nothing further will be charged.
          </p>
        ) : delivered ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RateRow rated={rated} onRate={(n) => {
                setRated(n);
                toast({ message: "Thanks. That helps us more than you'd think." });
              }} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ReorderButton
                items={order.items.map((i) => ({ slug: i.slug, qty: i.qty }))}
                variant="primary"
              />
              {reportOpen ? (
                <Button variant="secondary" onClick={() => setProblemOpen(true)}>
                  Something wrong?
                </Button>
              ) : null}
            </div>
            {!reportOpen ? (
              <p className="mt-4 text-caption text-ink-500">
                {extras.reportWindowCopy ??
                  "The 24-hour window for reporting a problem has passed, but message us anyway — we'd rather know."}
              </p>
            ) : null}
          </>
        ) : order.canChange ? (
          <>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setChangeOpen(true)}>
                Change window
              </Button>
              <ButtonLink href="/account/addresses" variant="secondary">
                Change stop or address
              </ButtonLink>
              <Button variant="ghost" onClick={() => setCancelOpen(true)}>
                Cancel this order
              </Button>
            </div>
            <p className="mt-4 text-caption text-ink-500">
              Free until Thursday 8pm. After that the dough is already in.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 text-body text-ink-600">
              {order.changeClosedCopy ??
                "Too late to change this one — the dough's in. Message us and we'll do what we can."}
            </p>
            <div className="mt-6">
              <ButtonLink
                href={whatsappHref(`Hi Fillo — question about order ${order.id}.`)}
                variant="secondary"
                icon={<MessageCircle size={16} strokeWidth={1.5} />}
                iconPosition="leading"
              >
                WhatsApp us
              </ButtonLink>
            </div>
          </>
        )}
      </Panel>

      <p className="text-caption text-ink-500">
        Something not right?{" "}
        <a
          href={whatsappHref(`Hi Fillo — question about order ${order.id}.`)}
          className="link-underline text-ink-700"
        >
          Report a problem on WhatsApp
        </a>
        . We read these ourselves.
      </p>

      {/* ---- Dialogs ------------------------------------------------------ */}
      <Dialog
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
        title="Change your window"
        description="Pick another window on the same run. The total does not change."
      >
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {windows.map((band) => (
            <li key={band}>
              <button
                type="button"
                onClick={() => {
                  setChangedTo(`${order.fulfilment.dateLabel}, ${band.replace("-", " to ")}`);
                  setChangeOpen(false);
                  toast({ message: `Changed. ${order.fulfilment.dateLabel}, ${band}. Same total.` });
                }}
                className={cn(
                  "flex h-11 w-full items-center justify-center rounded-sm border",
                  "border-paper-400 bg-paper-0 text-body-sm text-ink-800 tabular",
                  "hover:border-ink-600",
                )}
              >
                {band}
              </button>
            </li>
          ))}
        </ul>
      </Dialog>

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this order?"
        description="Nothing further will be charged, and the refund is with Razorpay — 7 to 10 working days."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setCancelled(true);
                setCancelOpen(false);
                toast({
                  message:
                    "Cancelled. Nothing further will be charged, and the refund is with Razorpay — 7 to 10 working days.",
                });
              }}
            >
              Cancel this order
            </Button>
          </>
        }
      />

      <ProblemDialog
        order={order}
        open={problemOpen}
        onClose={() => setProblemOpen(false)}
      />
    </div>
  );
}

function RateRow({
  rated,
  onRate,
}: {
  rated: number | null;
  onRate: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="micro text-ink-500">Rate this</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onRate(n)}
            aria-label={`${n} out of 5`}
            aria-pressed={rated === n}
            className="grid size-11 place-items-center"
          >
            <Star
              size={20}
              strokeWidth={1.5}
              className={cn(
                rated !== null && n <= rated ? "fill-crumb text-crumb" : "text-paper-400",
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProblemDialog({
  order,
  open,
  onClose,
}: {
  order: Order;
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [picked, setPicked] = React.useState<string[]>([]);
  const [sent, setSent] = React.useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Tell us what went wrong"
      description="We can't take returns — everything is baked for the day it's made. But if this arrived damaged, wrong, or just not right, tell us and we'll sort it. Every time."
      footer={
        sent ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              Not now
            </Button>
            <Button
              onClick={() => {
                setSent(true);
                toast({
                  message: "Got it. We read these ourselves and we'll reply on WhatsApp today.",
                });
              }}
            >
              Send this to us
            </Button>
          </>
        )
      }
    >
      {sent ? (
        <p className="mt-6 flex items-start gap-2 text-body text-success">
          <Check size={20} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
          Got it. We read these ourselves and we&rsquo;ll reply on WhatsApp today.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <fieldset className="border-0 p-0">
            <legend className="micro mb-2 text-ink-600">Which items</legend>
            {order.items.map((item) => (
              <Checkbox
                key={item.slug}
                label={item.name}
                checked={picked.includes(item.slug)}
                onChange={(e) =>
                  setPicked((current) =>
                    e.target.checked
                      ? [...current, item.slug]
                      : current.filter((s) => s !== item.slug),
                  )
                }
              />
            ))}
          </fieldset>

          <Field
            label="Photos (up to three)"
            htmlFor="problem-photos"
            helper="A photo tells us more than a paragraph."
          >
            <Input id="problem-photos" type="file" accept="image/*" multiple />
          </Field>

          <Field label="What happened" htmlFor="problem-note">
            <Textarea id="problem-note" placeholder="As much or as little as you like." />
          </Field>

          <p className="flex items-start gap-2 text-caption text-ink-500">
            <AlertCircle size={16} strokeWidth={1.5} className="mt-px shrink-0" aria-hidden="true" />
            Order {order.id}, {order.fulfilment.dateLabel}. We&rsquo;ll have all of that
            already.
          </p>
        </div>
      )}
    </Dialog>
  );
}

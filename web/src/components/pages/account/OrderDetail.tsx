"use client";

import * as React from "react";
import { Check, MapPin, MessageCircle, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { BakeStrip } from "@/components/blocks/BakeStrip";
import { cn } from "@/lib/cn";
import { formatINR, formatTimeOfDay } from "@/lib/format";
import { getAddress, type Order } from "@/lib/mock";
import { whatsappHref } from "@/lib/config";
import { Panel, PanelHead, MetaRow } from "@/components/pages/account/Panel";
import { ItemThumbs } from "@/components/pages/account/ItemThumbs";
import { ReorderButton } from "@/components/pages/account/AddAgain";
import { TextAreaField, CheckRow } from "@/components/pages/content/Form";
import { extrasOf, moneyExtras, whereLabel } from "@/components/pages/account/orderData";
import { bakeStripFour, statusSpec } from "@/components/pages/account/orderStatus";

/**
 * Order detail — PAGES-v2 Account, "Orders … Detail".
 *
 * The status sentence, the four-step bake status, where it is going, what it
 * cost, and one way back into the box. Every clock on the strip is a real one
 * from the fixture: a step that has not happened carries an em dash rather
 * than a guess.
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
  const steps = React.useMemo(() => bakeStripFour(order.bakeStrip), [order.bakeStrip]);

  const windows = address?.availableWindows ?? ["16:00-18:00", "18:00-20:00"];

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* ---- Where it stands ------------------------------------------- */}
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase tabular">
            {order.fulfilment.dateLabel}
          </p>
          <Badge variant={cancelled ? "muted" : spec.tone}>
            {cancelled ? "Cancelled" : spec.label}
          </Badge>
        </div>

        <p className="mt-4 max-w-[34ch] font-display text-[26px] leading-tight text-ink">
          {cancelled
            ? "Cancelled. Nothing further will be charged."
            : order.statusSentence}
        </p>

        {changedTo ? (
          <p className="mt-4 flex items-start gap-2 text-body-sm text-ink-2">
            <Check
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-1 shrink-0 text-success"
            />
            <span>Changed to {changedTo}. Same total.</span>
          </p>
        ) : null}

        {status === "out" && !cancelled ? (
          <ButtonLink href="/van" className="mt-6" icon={<Truck size={16} strokeWidth={1.5} />} iconPosition="leading">
            Track the van
          </ButtonLink>
        ) : null}

        {spec.cta && !closed && status !== "out" ? (
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

      {/* ---- Bake status ------------------------------------------------ */}
      <Panel>
        <PanelHead label="Bake status" />
        {/* No active cell: "NOW" in a step that has not started would be a
            guess, and the status sentence above already says where it is. */}
        <BakeStrip className="mt-4" steps={steps} columns={4} />
        <p className="mt-4 text-body-sm text-muted">
          Every time here is a real one from the kitchen. A step with no time has
          not happened yet.
        </p>
      </Panel>

      {/* ---- Where and when --------------------------------------------- */}
      <Panel>
        <PanelHead label="Where and when" />
        <p className="mt-4 flex items-start gap-3 text-body text-ink">
          <MapPin
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-accent"
          />
          <span className="tabular">
            {order.fulfilment.laneLabel} · {whereLabel(order)}
            {order.fulfilment.windowLabel ? ` · ${order.fulfilment.windowLabel}` : ""}
          </span>
        </p>
        {address ? (
          <address className="mt-3 pl-[30px] text-body-sm text-ink-2 not-italic">
            {address.blockAndFlat}, {address.society}
            <br />
            {address.landmark ? `${address.landmark}, ` : ""}
            {address.area} {address.pincode}
          </address>
        ) : null}
      </Panel>

      {/* ---- Items and money -------------------------------------------- */}
      <Panel>
        <PanelHead
          label="Your order"
          trailing={<ItemThumbs items={order.items} size={40} max={3} />}
        />
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {order.items.map((item) => (
            <li key={item.slug} className="flex items-baseline gap-4 py-3">
              <span className="min-w-0 flex-1 text-body text-ink">
                <span className="tabular">{item.qty}</span> × {item.name}
                {item.variant ? (
                  <span className="text-muted"> · {item.variant}</span>
                ) : null}
              </span>
              <Price amount={item.lineTotal} size="sm" />
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <MetaRow label="Items" value={formatINR(order.money.subtotal)} />
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
                ? null
                : order.money.delivery === 0
                  ? "Free"
                  : formatINR(order.money.delivery)
            }
          />
          <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-line pt-4">
            <span className="font-display text-[22px] text-ink">Total</span>
            <Price amount={order.money.total} size="lg" />
          </div>
          {money.refunded ? (
            <p className="mt-3 text-body-sm text-muted tabular">
              Refunded {formatINR(money.refunded)} to your UPI app, reference{" "}
              {money.refundReference}.
            </p>
          ) : null}
        </div>
      </Panel>

      {/* ---- Payment and invoice ---------------------------------------- */}
      <Panel id="invoice">
        <PanelHead label="Payment and invoice" />
        <div className="mt-2">
          <MetaRow label="Paid with" value={order.payment.methodLabel} />
          <MetaRow label="Reference" value={order.payment.reference} />
          <MetaRow
            label="Paid at"
            value={order.payment.paidAt ? formatTimeOfDay(order.payment.paidAt) : null}
          />
          <MetaRow label="Invoice" value={order.id} />
        </div>
        <p className="mt-4 text-body-sm text-muted">
          Your invoice goes out on WhatsApp with the confirmation. Ask and we send
          it again.
        </p>
      </Panel>

      {/* ---- What you can still do -------------------------------------- */}
      <Panel>
        <PanelHead label={delivered ? "How was it" : "Change this order"} />
        {closed ? (
          <p className="mt-4 text-body text-ink-2">
            This order is closed. Nothing further will be charged.
          </p>
        ) : delivered ? (
          <>
            <RateRow
              className="mt-3"
              rated={rated}
              onRate={(n) => {
                setRated(n);
                toast({ message: "Thanks. That helps us more than you would think." });
              }}
            />
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ReorderButton
                items={order.items.map((i) => ({ slug: i.slug, qty: i.qty }))}
                variant="primary"
              />
              {reportOpen ? (
                <button
                  type="button"
                  onClick={() => setProblemOpen(true)}
                  className="link-underline text-body-sm font-semibold text-accent"
                >
                  Something wrong
                </button>
              ) : null}
            </div>
            {!reportOpen ? (
              <p className="mt-4 text-body-sm text-muted">
                {extras.reportWindowCopy ??
                  "The 24-hour window for reporting a problem has passed. Message us anyway, we would rather know."}
              </p>
            ) : null}
          </>
        ) : order.canChange ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button variant="secondary" onClick={() => setChangeOpen(true)}>
                Change window
              </Button>
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="link-underline text-body-sm text-ink-2 hover:text-ink"
              >
                Cancel this order
              </button>
            </div>
            <p className="mt-4 text-body-sm text-muted">
              Free until Thursday 8pm. After that the dough is already in.
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 max-w-[46ch] text-body text-ink-2">
              {order.changeClosedCopy ??
                "Too late to change this one, the dough is in. Message us and we will do what we can."}
            </p>
            <ButtonLink
              href={whatsappHref(`Hi Fillo — question about order ${order.id}.`)}
              variant="secondary"
              className="mt-6"
              icon={<MessageCircle size={16} strokeWidth={1.5} />}
              iconPosition="leading"
            >
              Message us
            </ButtonLink>
          </>
        )}
      </Panel>

      {/* ---- Dialogs ----------------------------------------------------- */}
      <Dialog
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
        title="Change your window"
        description="Another window on the same run. The total does not change."
      >
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {windows.map((band) => (
            <li key={band}>
              <button
                type="button"
                onClick={() => {
                  const label = `${order.fulfilment.dateLabel}, ${band.replace("-", " to ")}`;
                  setChangedTo(label);
                  setChangeOpen(false);
                  toast({ message: `Changed to ${label}. Same total.` });
                }}
                className={cn(
                  "flex h-12 w-full items-center justify-center rounded-md border border-line",
                  "bg-card text-body-sm text-ink tabular transition-colors",
                  "duration-[var(--dur-fast)] hover:border-ink",
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
        description="Nothing further will be charged. The refund goes back through Razorpay and takes 7 to 10 working days."
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
                toast({ message: "Cancelled. Nothing further will be charged." });
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
  className,
}: {
  rated: number | null;
  onRate: (n: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
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
            size={22}
            strokeWidth={1.5}
            aria-hidden="true"
            className={cn(
              rated !== null && n <= rated
                ? "fill-gold text-gold"
                : "text-line",
            )}
          />
        </button>
      ))}
      {rated !== null ? (
        <span className="ml-2 text-body-sm text-muted">Thanks.</span>
      ) : null}
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
      description="We cannot take returns, because everything is baked for the day it is made. If this arrived damaged, wrong, or just not right, we will sort it."
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
                  message: "Got it. We read these ourselves and reply on WhatsApp today.",
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
        <p className="mt-6 flex items-start gap-2 text-body text-ink">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-success"
          />
          Got it. We read these ourselves and reply on WhatsApp today.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          <fieldset className="border-0 p-0">
            <legend className="mb-1 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              Which items
            </legend>
            {order.items.map((item) => (
              <CheckRow
                key={item.slug}
                id={`problem-${item.slug}`}
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

          <TextAreaField
            id="problem-note"
            label="What happened"
            placeholder="As much or as little as you like."
            helper={`A photo helps — send it when we reply. We already have order ${order.id}, ${order.fulfilment.dateLabel}.`}
          />
        </div>
      )}
    </Dialog>
  );
}

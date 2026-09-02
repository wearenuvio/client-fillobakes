import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, getH1, JsonLd } from "@/lib/seo";
import { Section, Container } from "@/components/blocks/Section";
import { Rule, Kicker } from "@/components/ui/Rule";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoafGlyph } from "@/components/ui/LineArt";
import { BakeStrip } from "@/components/blocks/BakeStrip";
import { VanStrip } from "@/components/blocks/TrackerCard";
import { FulfilmentSummary } from "@/components/blocks/FulfilmentLane";
import {
  OrderActions,
  JoinFilloPlus,
  OrderAgain,
} from "@/components/pages/commerce/OrderActions";
import { ChangeOrCancel } from "@/components/pages/commerce/ChangeOrCancel";
import { getProductBySlug } from "@/lib/catalog";
import {
  getOrder,
  getOrderIds,
  getOrders,
  getOrderStateCopy,
  getCustomer,
  getAddress,
  getVanStripCopy,
  type Order,
  type Customer,
} from "@/lib/mock";
import {
  formatINR,
  formatTimeBand,
  formatTimeOfDay,
  formatClockBare,
  parseIso,
} from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

/**
 * Confirmation and live status. noindex, and excluded from the sitemap.
 * Reachable without login, so it survives being forwarded on WhatsApp.
 */
export function generateStaticParams() {
  return getOrderIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  return buildMetadata(`/order/${id}`, { noindex: true });
}

/** The four steps a customer is told about, with real clock times only. */
function bakeSteps(order: Order) {
  return order.bakeStrip.map((step) => ({
    ...step,
    // §12.30: a real, server-supplied clock time or an em dash. Never a guess.
    atLabel: step.at ? formatClockBare(clockOf(step.at)) : undefined,
  }));
}

function clockOf(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

/**
 * The Standing Order pitch fires on the second order and never the first
 * (`customer.orderCountNote`). The first order proves the bread; the second is
 * where the habit exists.
 */
function orderCount(): number {
  // mock-data carries `customer.orderCount` and a note that >= 2 is what
  // unlocks this pitch, but lib/mock's Customer type does not expose it yet
  // (requested in PHASE2B-REQUESTS.md). Read it narrowly, and fall back to
  // counting the orders that were not cancelled.
  const customer = getCustomer() as Customer & { orderCount?: number };
  if (typeof customer.orderCount === "number") return customer.orderCount;
  return getOrders().filter((o) => o.status !== "cancelled").length;
}

function standingOrderPitch(order: Order) {
  const count = orderCount();
  if (count < 2) return null;

  const orders = getOrders().filter((o) => o.status !== "cancelled");
  const earlier = orders.filter((o) => o.placedAt < order.placedAt);
  const repeated = order.items.find((item) =>
    earlier.some((o) => o.items.some((i) => i.slug === item.slug)),
  );

  return {
    // Both headlines are statements of fact. The fixtures happen to carry no
    // repeat purchase, so the count is what is true for this customer.
    headline: repeated
      ? `You’ve ordered a ${repeated.name} twice.`
      : `That’s ${count} orders now.`,
  };
}

export default async function OrderPage({ params }: Params) {
  const { id } = await params;
  const order = getOrder(id);
  const path = `/order/${id}`;

  if (!order) {
    return (
      <>
        <JsonLd path={path} crumbs={[{ name: "Order", path }]} />
        <Section surface="paper-50">
          <EmptyState
            title="We can’t find that order."
            body="The link may have been cut short somewhere between here and WhatsApp. Send us the number and we will pull it up."
            glyph={<LoafGlyph size={96} />}
            action={
              <ButtonLink href="/shop" variant="secondary" size="md">
                See this week’s bake
              </ButtonLink>
            }
          />
        </Section>
      </>
    );
  }

  const address = order.fulfilment.addressId
    ? getAddress(order.fulfilment.addressId)
    : undefined;
  const windowLabel = order.fulfilment.window
    ? formatTimeBand(order.fulfilment.window)
    : (order.fulfilment.windowLabel ?? "");
  const place =
    order.fulfilment.lane === "catch_the_van"
      ? (order.fulfilment.stopName ?? order.fulfilment.area)
      : address
        ? `${address.blockAndFlat}, ${address.society}, ${address.area}`
        : order.fulfilment.area;

  const stateCopy = getOrderStateCopy(order.status);
  const pitch = standingOrderPitch(order);
  const activeStep = order.bakeStrip.find((s) => !s.done)?.step;
  const vanRelevant = order.status === "out" || order.status === "loading";
  const detail = [
    order.fulfilment.dateLabel,
    order.fulfilment.lane === "catch_the_van" ? order.fulfilment.stopName : order.fulfilment.area,
    windowLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <JsonLd path={path} crumbs={[{ name: "Order", path }]} />

      {/* -------- The promise, not a warning --------------------------- */}
      <Section surface="paper-50" size="half">
        <Container width="narrow" className="!px-0">
          <Kicker>Order {order.id}</Kicker>
          <h1 className="mt-4 text-display-xl text-ink-800">
            {getH1(path, "Got it.")}
          </h1>
          <p className="mt-6 max-w-[46ch] text-body-lg text-ink-800 tabular">
            {order.fulfilment.dateLabel}, {windowLabel}, at{" "}
            {order.fulfilment.lane === "catch_the_van" ? place : "your gate"}. We’ll
            message you the night before with the exact time.
          </p>
          {stateCopy ? (
            <p className="mt-3 max-w-[46ch] text-body text-ink-600">{stateCopy.copy}</p>
          ) : (
            <p className="mt-3 max-w-[46ch] text-body text-ink-600">
              {order.statusSentence}
            </p>
          )}

          <div className="mt-8">
            <OrderActions
              orderId={order.id}
              calendar={`${order.fulfilment.dateLabel}, ${windowLabel} · ${place}`}
            />
          </div>
        </Container>
      </Section>

      {/* -------- 1. The order card ------------------------------------ */}
      <Section surface="paper-100" size="half">
        <Container width="narrow" className="!px-0">
          <div className="rounded-lg border border-paper-300 bg-paper-0 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="micro text-ink-500 tabular">{order.id}</p>
              <Badge variant={order.status === "delivered" ? "success" : "tint"}>
                {order.statusLabel}
              </Badge>
            </div>

            <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
              {order.items.map((item) => {
                const product = getProductBySlug(item.slug);
                return (
                  <li key={item.slug} className="flex items-center gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="link-underline text-body text-ink-800"
                      >
                        {item.name}
                      </Link>
                      <KanaLabel kana={product?.kana ?? null} />
                      {item.variant ? (
                        <p className="micro mt-1 text-ink-500">{item.variant}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-body-sm text-ink-500 tabular">
                      × {item.qty}
                    </p>
                    <Price amount={item.lineTotal} size="sm" className="shrink-0" />
                  </li>
                );
              })}
            </ul>

            <dl className="mt-4">
              <Row label="Subtotal" value={formatINR(order.money.subtotal)} />
              {order.money.discount.amount > 0 ? (
                <Row
                  label={order.money.discount.code ?? "Discount"}
                  value={`−${formatINR(order.money.discount.amount)}`}
                />
              ) : null}
              <Row
                label="Delivery"
                value={
                  order.money.deliveryTbc
                    ? "Not recorded"
                    : (order.money.deliveryLabel ??
                      (order.money.delivery === 0
                        ? "Free"
                        : formatINR(order.money.delivery ?? 0)))
                }
              />
              <Row label={`Tax ${order.money.taxRateLabel}`} value={formatINR(order.money.tax)} />
              <div className="mt-3 flex items-baseline gap-3 border-t border-t-paper-300 pt-3">
                <dt className="text-body font-semibold text-ink-800">Paid</dt>
                <span className="dot-leader" aria-hidden="true" />
                <dd>
                  <Price amount={order.money.total} size="md" />
                </dd>
              </div>
            </dl>

            <FulfilmentSummary
              className="mt-4"
              lane={order.fulfilment.lane}
              detail={detail}
            />
            <p className="mt-3 text-caption text-ink-500">
              {order.payment.methodLabel} · {order.payment.processor}
              {order.payment.paidAt ? ` · ${formatTimeOfDay(order.payment.paidAt)}` : ""}
            </p>
          </div>
        </Container>
      </Section>

      {/* -------- 2. Van strip, live when it is relevant --------------- */}
      <Section surface="paper-50" size="half">
        <Container width="narrow" className="!px-0">
          <VanStrip
            state={vanRelevant ? "live_near_you" : "off_air"}
            copy={getVanStripCopy()}
          />

          {/* -------- 3. The timeline, real timestamps only ------------- */}
          <div className="mt-10">
            <Rule label="Where it is" tone="strong" />
            <BakeStrip
              className="mt-6"
              steps={bakeSteps(order)}
              activeStep={activeStep}
              footnote={
                activeStep
                  ? "A step with no time has not happened yet. We do not guess."
                  : undefined
              }
            />
          </div>

          {/* -------- 6. Change or cancel, and it must work ------------- */}
          <div className="mt-10">
            <ChangeOrCancel
              canChange={order.canChange}
              closedCopy={
                order.changeClosedCopy ??
                "Too late to change this one — the dough’s in. Message us and we’ll do what we can."
              }
              cutoffLine="You can change or cancel free until 8pm the evening before."
            />
          </div>

          {order.status === "delivered" ? (
            <div className="mt-10 flex flex-wrap gap-3">
              <OrderAgain
                slugs={order.items.map((i) => ({ slug: i.slug, qty: i.qty }))}
              />
              <Button variant="ghost" size="md">
                Rate this
              </Button>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* -------- The order-#2 moment, above Fillo+ -------------------- */}
      {pitch ? (
        <Section surface="paper-100" size="half">
          <Container width="narrow" className="!px-0">
            <Kicker>The Standing Order</Kicker>
            <h2 className="mt-4 text-display-md text-ink-800">{pitch.headline}</h2>
            <p className="mt-4 max-w-[46ch] text-body-lg text-ink-600">
              Want it on the van every week? Skip any week, pause anytime, cancel in one
              tap.
            </p>
            <ButtonLink href="/standing-order" size="lg" className="mt-6">
              Set up a standing order
            </ButtonLink>
          </Container>
        </Section>
      ) : null}

      {/* -------- 5. Fillo+, one tap, phone already verified ----------- */}
      <Section surface="paper-50" size="half">
        <Container width="narrow" className="!px-0">
          <Kicker>Fillo+</Kicker>
          <h2 className="mt-4 text-display-md text-ink-800">Fillo+ is free.</h2>
          <p className="mt-4 max-w-[46ch] text-body-lg text-ink-600 tabular">
            Your number is already verified, so this is one tap. Earn 2 coins for every
            ₹100 you spend. 25 coins is ₹25 off, and they never expire.
          </p>
          <div className="mt-6">
            <JoinFilloPlus />
          </div>
        </Container>
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 py-1">
      <dt className="text-body-sm text-ink-600">{label}</dt>
      <span className="dot-leader" aria-hidden="true" />
      <dd className="text-body-sm text-ink-800 tabular">{value}</dd>
    </div>
  );
}

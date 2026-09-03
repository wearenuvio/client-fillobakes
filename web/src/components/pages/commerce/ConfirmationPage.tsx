"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Truck } from "lucide-react";
import { PageHeader } from "@/components/blocks/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { LoafGlyph } from "@/components/ui/LineArt";
import { BakeStrip } from "@/components/blocks/BakeStrip";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { whatsappHref } from "@/lib/config";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";
import {
  CONFIRMATION_ORDER_ID,
  freshBake,
  whenLabel,
  type OrderView,
} from "@/components/pages/commerce/confirmation";

/**
 * Order confirmation — PAGES-v2 "Order confirmation".
 *
 * The reward moment, and immediately after it the reason to come back. The
 * order that checkout has just placed is reconstructed from the cart and the
 * session before the cart is emptied, so the page shows what you actually
 * bought rather than a stand-in. Opened cold — forwarded on WhatsApp, or
 * reopened tomorrow — it falls back to the server's copy of the same order.
 */

export function ConfirmationPage({ order }: { order: OrderView }) {
  const cartReady = useCartHydrated();
  const sessionReady = useSessionHydrated();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);

  const lane = useSessionStore((s) => s.lane);
  const area = useSessionStore((s) => s.area);
  const date = useSessionStore((s) => s.date);
  const band = useSessionStore((s) => s.band);
  const customerName = useSessionStore((s) => s.customerName);

  const live = order.id === CONFIRMATION_ORDER_ID;

  // Snapshot once, then empty the cart. Reading the store directly would make
  // the page dissolve the instant it clears itself.
  const [snapshot, setSnapshot] = React.useState<OrderView | null>(null);
  const taken = React.useRef(false);

  React.useEffect(() => {
    if (!live || taken.current) return;
    if (!cartReady || !sessionReady) return;
    taken.current = true;
    if (lines.length === 0) return;

    const totals = computeTotals(lines, lane);
    const dayName = date
      ? whenLabel(date, null).split(" ")[0]
      : order.bake[1]?.at ?? "";

    setSnapshot({
      ...order,
      greetingName: customerName?.trim()
        ? customerName.trim().split(/\s+/)[0]
        : order.greetingName,
      items: lines.map((line) => {
        const product = getProductBySlug(line.slug);
        return {
          slug: line.slug,
          name: product?.name ?? line.slug,
          qty: line.qty,
          lineTotal: (product?.price ?? 0) * line.qty,
        };
      }),
      subtotal: totals.subtotal,
      delivery: totals.delivery,
      total: totals.total,
      where: area ?? order.where,
      when: whenLabel(date, band) || order.when,
      lane: lane ?? order.lane,
      promise: dayName
        ? `Your order is on ${dayName}'s list. We'll message you the night before with the exact window.`
        : order.promise,
      bake: freshBake(dayName || "Soon"),
      activeStep: undefined,
    });
    clear();
  }, [
    live,
    cartReady,
    sessionReady,
    lines,
    lane,
    area,
    date,
    band,
    customerName,
    clear,
    order,
  ]);

  const view = snapshot ?? order;

  return (
    <div className="bg-paper">
      {/* -------- The reward ------------------------------------------ */}
      <PageHeader
        title={`Got it, ${view.greetingName}.`}
        lede={view.promise}
        variant="compact"
        art="crumbs-scatter"
        artSize="md"
      />
      <div className="container-narrow pb-16 lg:pb-24">
        {/* -------- The order card ------------------------------------ */}
        <div className="rounded-lg border border-line bg-card p-5 sm:p-6">
          <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase tabular">
            Order {view.id}
          </p>

          <ul className="mt-5 divide-y divide-line border-y border-line">
            {view.items.map((item) => (
              <ConfirmationLine key={item.slug} {...item} />
            ))}
          </ul>

          <dl className="mt-4">
            <Row label="Items" value={formatINR(view.subtotal)} />
            <Row
              label="Delivery"
              value={view.delivery === 0 ? "Free" : formatINR(view.delivery)}
            />
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <dt className="text-body text-ink">Paid</dt>
              <dd className="font-display text-[24px] leading-none text-ink tabular">
                {formatINR(view.total)}
              </dd>
            </div>
          </dl>

          <dl className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                Where
              </dt>
              <dd className="mt-1 text-body text-ink">
                {view.lane === "catch_the_van"
                  ? `Catch the van · ${view.where}`
                  : view.where}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                When
              </dt>
              <dd className="mt-1 text-body text-ink tabular">{view.when}</dd>
            </div>
          </dl>

          <a
            href={whatsappHref(`Hi Fillo — about order ${view.id}.`)}
            target="_blank"
            rel="noreferrer"
            className="link-underline mt-5 inline-flex items-center gap-2 text-body-sm font-semibold text-accent"
          >
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
            Message us
          </a>
        </div>

        {/* -------- Bake status --------------------------------------- */}
        <div className="mt-12">
          <h2 className="font-display text-[26px] leading-tight text-ink">
            Where it is
          </h2>
          <BakeStrip
            className="mt-5"
            activeStep={view.activeStep}
            steps={view.bake.map((step) => ({
              step: step.key,
              label: step.label,
              done: step.done,
              at: null,
              atLabel: step.at ?? "—",
            }))}
          />
        </div>

        {/* -------- The reason to come back --------------------------- */}
        {view.orderCount >= 2 ? (
          <ReturnCard
            title={
              view.repeatItem
                ? `You've ordered ${view.repeatItem} twice.`
                : `That's ${view.orderCount} orders now.`
            }
            line={
              view.standingDay
                ? `Want it every ${view.standingDay}? Skip any week.`
                : "Want it every week? Skip any week."
            }
            cta="Set it up"
            href="/standing-order"
          />
        ) : (
          <ReturnCard
            title="Join free, earn on every order."
            line={`Your number is already verified, so this is one tap. This order earns ${
              Math.floor(view.subtotal / 100) * 2
            } coins.`}
            cta="Join with this number"
            href="/fillo-plus"
          />
        )}

        {/* -------- The last quiet link ------------------------------- */}
        <p className="mt-10">
          <Link
            href="/van"
            className="link-underline inline-flex items-center gap-2 text-body-sm font-semibold text-accent"
          >
            <Truck size={16} strokeWidth={1.5} aria-hidden="true" />
            Track the van
          </Link>
        </p>
      </div>
    </div>
  );
}

/** Peach ground, serif title, two lines, one button. Calm. */
function ReturnCard({
  title,
  line,
  cta,
  href,
}: {
  title: string;
  line: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="mt-12 rounded-lg bg-peach p-6 sm:p-8">
      <h2 className="font-display text-[28px] leading-tight text-ink">
        {title}
      </h2>
      <p className="mt-2 max-w-[42ch] text-body-lg text-ink-2">{line}</p>
      <ButtonLink href={href} size="lg" className="mt-6">
        {cta}
      </ButtonLink>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="text-body-sm text-ink-2">{label}</dt>
      <dd className="text-body-sm text-ink tabular">{value}</dd>
    </div>
  );
}

function ConfirmationLine({
  slug,
  name,
  qty,
  lineTotal,
}: {
  slug: string;
  name: string;
  qty: number;
  lineTotal: number;
}) {
  const product = getProductBySlug(slug);
  return (
    <li className="flex items-center gap-3 py-3">
      <span
        data-surface="well"
        className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-well"
      >
        {product?.image ? (
          <Image
            src={product.image.src}
            alt=""
            width={120}
            height={120}
            sizes="48px"
            className={
              product.image.kind === "cutout"
                ? "w-[78%] object-contain"
                : "size-full object-cover"
            }
          />
        ) : (
          <LoafGlyph size={26} className="text-muted opacity-70" />
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-body text-ink">{name}</span>
      <span className="shrink-0 text-body-sm text-muted tabular">× {qty}</span>
      <span className="shrink-0 text-body-sm text-ink tabular">
        {formatINR(lineTotal)}
      </span>
    </li>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Clock, Coins, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { Field, Input, Checkbox } from "@/components/ui/Field";
import { OtpField } from "@/components/ui/OtpField";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoafGlyph } from "@/components/ui/LineArt";
import { Skeleton } from "@/components/ui/Skeleton";
import { SlotPicker } from "@/components/blocks/SlotPicker";
import { FulfilmentLane } from "@/components/blocks/FulfilmentLane";
import { UpiPayButton } from "@/components/blocks/UpiPayButton";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { HoldTimer } from "@/components/pages/commerce/HoldTimer";
import { ORDERED_KEY } from "@/components/pages/commerce/ThreeDoorsModule";
import type { RunView } from "@/components/pages/commerce/types";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR, formatTimeBand } from "@/lib/format";
import type { LaneId } from "@/lib/config";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";

/**
 * Checkout — one page, one domain, four blocks (journey §4.2).
 *
 * The live journey puts seven surfaces between craving and paying, asks for
 * contact details three times, and adds delivery inside Shopify so ₹420
 * promised becomes ₹470 charged. That last one is not friction, it is a broken
 * promise, and it is the thing this page exists to fix:
 *
 *   · the total here is `computeTotals`, the same function the drawer uses;
 *   · delivery is inside it, before the address block is even reached;
 *   · the number on the button is the number in the table.
 *
 * Guest checkout is the default path, so there is no "continue as guest" link
 * — there is nothing to continue from. The phone number is the identity.
 *
 * Two timers render, and both are wired to a published fact: the 8pm cut-off
 * and the van's real remaining stock. Nothing here counts down for effect.
 */

type Slot = { date: string; dateLabel: string; open: boolean; isToday: boolean };

type PayMethod = "upi" | "card" | "cod";

export function CheckoutPage({
  runs,
  areaRuns,
  runSlots,
  areaWindows,
  soldOutSlugs,
  onVanSlugs,
  cutoffCopy,
  holdCopy,
  holdMinutes,
  coins,
  cod,
  orderId,
}: {
  runs: RunView[];
  areaRuns: Record<string, string>;
  /** Run id -> the next few run dates, closed ones included. */
  runSlots: Record<string, Slot[]>;
  /** Area name -> its published two-hour windows. */
  areaWindows: Record<string, string[]>;
  soldOutSlugs: string[];
  onVanSlugs: string[];
  cutoffCopy: Record<string, string>;
  holdCopy: { running: string; expiringSoon: string; expired: string };
  holdMinutes: number;
  coins: { balance: number; threshold: number; value: number };
  cod: { surcharge: number; cap: number; note: string };
  /** The mock order the pay button lands on. */
  orderId: string;
}) {
  const router = useRouter();
  const cartHydrated = useCartHydrated();
  const sessionHydrated = useSessionHydrated();

  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const lane = useSessionStore((s) => s.lane);
  const setLane = useSessionStore((s) => s.setLane);
  const area = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);
  const storedStopId = useSessionStore((s) => s.stopId);
  const setStop = useSessionStore((s) => s.setStop);
  const storedDate = useSessionStore((s) => s.date);
  const storedBand = useSessionStore((s) => s.band);
  const setSlot = useSessionStore((s) => s.setSlot);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [date, setDate] = React.useState<string | null>(null);
  const [band, setBand] = React.useState<string | null>(null);
  const [stopId, setStopId] = React.useState<string | null>(null);
  const [cutoffPassed, setCutoffPassed] = React.useState(false);

  const [phone, setPhone] = React.useState("");
  const [otpStep, setOtpStep] = React.useState<"number" | "code">("number");
  const [otpStatus, setOtpStatus] = React.useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const [resendIn, setResendIn] = React.useState(0);
  const [verified, setVerified] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const [address, setAddress] = React.useState({
    flat: "",
    building: "",
    street: "",
    landmark: "",
    pincode: "",
  });

  const [method, setMethod] = React.useState<PayMethod>("upi");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [joinPlus, setJoinPlus] = React.useState(false);
  const [payState, setPayState] = React.useState<
    "idle" | "awaiting" | "success" | "failed"
  >("idle");

  const areaSet = sessionHydrated && Boolean(area) && areaStatus === "served";
  const laneId: LaneId = lane ?? "catch_the_van";

  const run =
    runs.find((r) =>
      laneId === "home_delivery" ? r.id === "home_delivery" : r.id === (area ? areaRuns[area] : ""),
    ) ?? runs[0];

  const slots = runSlots[run.id] ?? [];
  const stops = run.stops;
  const activeStop = stops.find((s) => s.id === stopId) ?? stops[0] ?? null;

  const bands: string[] =
    laneId === "home_delivery"
      ? (area ? areaWindows[area] : undefined) ?? ["16:00-18:00", "18:00-20:00"]
      : activeStop
        ? [activeStop.band]
        : [];

  /* -------- Default-select the next open slot, once ------------------- */
  React.useEffect(() => {
    if (!sessionHydrated) return;
    setStopId((current) => current ?? storedStopId ?? stops[0]?.id ?? null);

    const firstOpen = slots.find((s) => s.open);
    // A slot chosen earlier in the session whose 8pm cut-off has since passed
    // is the real "the run closed while you were here" case.
    const stale = Boolean(
      storedDate && slots.some((s) => s.date === storedDate && !s.open),
    );
    if (stale) setCutoffPassed(true);

    const wanted = stale
      ? (firstOpen?.date ?? null)
      : storedDate && slots.some((s) => s.date === storedDate && s.open)
        ? storedDate
        : (firstOpen?.date ?? null);

    setDate((current) => current ?? wanted);
    setBand((current) => current ?? storedBand ?? bands[0] ?? null);
    // Slots and bands are derived from the run, which only changes when the
    // lane does; re-running on every render would fight the user's choice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionHydrated, run.id, laneId]);

  React.useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  /* -------- Money — one function, everywhere ------------------------- */
  const totals = computeTotals(lines, laneId);
  const coupon = couponApplied ? Math.round(totals.subtotal * 0.1) : 0;
  const codFee = method === "cod" ? cod.surcharge : 0;
  const dueNow = Math.max(0, totals.total - coupon + codFee);
  const couponEligible = totals.subtotal >= 500;
  const codBlocked = totals.subtotal > cod.cap;

  const goneInCart = lines.filter((l) => soldOutSlugs.includes(l.slug));
  const holdable = lines.some((l) => onVanSlugs.includes(l.slug));

  const canPay =
    verified && Boolean(date) && Boolean(band) && areaSet && goneInCart.length === 0;

  function sendCode() {
    setSending(true);
    setOtpError(null);
    setTimeout(() => {
      setSending(false);
      setOtpStep("code");
      setOtpStatus("idle");
      setResendIn(30);
    }, 700);
  }

  function verify(code: string) {
    setOtpStatus("verifying");
    setOtpError(null);
    setTimeout(() => {
      // The mock accepts a six-digit code. `000000` is the failure path, so
      // the error state is reachable without a back end.
      if (code === "000000") {
        setOtpStatus("error");
        setOtpError("That code didn’t match. Try again, or we’ll send a new one.");
        return;
      }
      setOtpStatus("success");
      setVerified(true);
    }, 900);
  }

  function pay() {
    if (!canPay) return;
    setPayState("awaiting");
    setTimeout(() => {
      setPayState("success");
      try {
        localStorage.setItem(ORDERED_KEY, orderId);
      } catch {
        // A blocked store only costs us the first-visit heuristic.
      }
      setSlot(date, band);
      if (stopId) setStop(stopId);
      clear();
      router.push(`/order/${orderId}`);
    }, 1600);
  }

  if (!cartHydrated) {
    return (
      <div className="mt-10 space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Nothing to pay for yet."
        body="This week we’ve got milk bread, custard an pan and three kinds of pastry."
        glyph={<LoafGlyph size={96} />}
        action={
          <ButtonLink href="/shop" variant="secondary" size="md">
            See this week’s bake
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="mt-10 flex flex-col gap-16">
      {/* ================= BLOCK 1 — how you're getting it ============== */}
      <section aria-labelledby="block-lane">
        <BlockHeading id="block-lane" step={1}>
          How you’re getting it
        </BlockHeading>

        {!areaSet ? (
          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-md bg-paper-200 p-4">
            <MapPin size={20} strokeWidth={1.5} aria-hidden="true" className="text-ink-800" />
            <p className="min-w-0 flex-1 text-body-sm text-ink-600">
              Set your area and we can show you the days and windows that are real for
              you.
            </p>
            <Button variant="secondary" size="sm" onClick={() => setSheetOpen(true)}>
              Set your area
            </Button>
          </div>
        ) : null}

        <FulfilmentLane
          className="mt-6"
          options={[
            {
              id: "catch_the_van",
              detail: [run.nextDayLabel, activeStop?.name, activeStop?.bandLabel]
                .filter(Boolean)
                .join(" · "),
            },
            {
              id: "home_delivery",
              detail: [run.nextDayLabel, area, formatTimeBand(bands[0] ?? "16:00-18:00")]
                .filter(Boolean)
                .join(" · "),
            },
          ]}
          value={laneId}
          onChange={setLane}
          areaSet={areaSet}
          onCheckArea={() => setSheetOpen(true)}
        />

        {/* -------- Van lane: which stop ------------------------------- */}
        {laneId === "catch_the_van" && stops.length > 0 ? (
          <fieldset className="mt-8 min-w-0 border-0 p-0">
            <legend className="micro mb-3 text-ink-600">Which stop</legend>
            <div className="grid gap-2 md:grid-cols-2">
              {stops.map((stop) => (
                <label
                  key={stop.id}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border p-4",
                    "transition-colors duration-[var(--dur-fast)]",
                    stop.id === activeStop?.id
                      ? "border-ink-800 bg-paper-100"
                      : "border-paper-300 bg-paper-0 hover:border-ink-600",
                  )}
                >
                  <input
                    type="radio"
                    name="stop"
                    value={stop.id}
                    checked={stop.id === activeStop?.id}
                    onChange={() => setStopId(stop.id)}
                    className="mt-1 size-5 shrink-0 appearance-none rounded-pill border-[1.5px] border-ink-600 checked:border-ink-800 checked:bg-ink-800 checked:shadow-[inset_0_0_0_3px_var(--color-paper-0)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-body-sm font-semibold text-ink-800">
                      {stop.name}
                    </span>
                    <span className="block text-caption text-ink-500">
                      {stop.descriptor}
                    </span>
                    <span className="block text-caption text-ink-600 tabular">
                      {stop.bandLabel}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* -------- Cut-off passed while you were here ------------------ */}
        {cutoffPassed ? (
          <p className="mt-8 flex items-start gap-2 rounded-sm bg-warning-tint p-3 text-body-sm text-warning">
            <Clock size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0" />
            {cutoffCopy.passedMidFlow}
          </p>
        ) : null}

        {/* -------- The dates and windows that actually exist ----------- */}
        <div className="mt-8">
          <p className="micro mb-3 text-ink-600">Which day</p>
          <SlotPicker
            dates={slots.map((slot) => ({
              date: slot.date,
              available: slot.open,
              isToday: slot.isToday,
              reason: cutoffCopy.closedToday,
            }))}
            bands={bands.map((b) => ({ band: b, available: true }))}
            selectedDate={date}
            selectedBand={band}
            onSelectDate={(next) => {
              setDate(next);
              setCutoffPassed(false);
            }}
            onSelectBand={setBand}
            cutoffNote={run.cutoffLine}
          />
          {/* The rule sits beside the greyed date, not in a tooltip. */}
          {slots.some((s) => !s.open) ? (
            <p className="mt-3 text-caption text-ink-500">{cutoffCopy.closedToday}</p>
          ) : null}
        </div>
      </section>

      {/* ================= BLOCK 2 — what it is and what it costs ======= */}
      <section aria-labelledby="block-order">
        <BlockHeading id="block-order" step={2}>
          What’s in it
        </BlockHeading>

        {goneInCart.length > 0 ? (
          <div className="mt-6 rounded-md bg-warning-tint p-4">
            <p className="flex items-start gap-2 text-body text-warning">
              <AlertCircle
                size={20}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              We sold the last one while you were deciding. Remove it, or swap for the
              Custard An Pan.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 pl-7">
              {goneInCart.map((line) => (
                <Button
                  key={line.slug}
                  variant="secondary"
                  size="sm"
                  onClick={() => remove(line.slug)}
                >
                  Remove {getProductBySlug(line.slug)?.name ?? line.slug}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {holdable ? (
          <HoldTimer
            className="mt-6"
            holdMinutes={holdMinutes}
            running={holdCopy.running}
            expiringSoon={holdCopy.expiringSoon}
            expired={holdCopy.expired}
          />
        ) : null}

        <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
          {lines.map((line) => {
            const product = getProductBySlug(line.slug);
            if (!product) return null;
            return (
              <li key={line.slug} className="flex items-center gap-4 py-4">
                <span
                  data-surface="well"
                  className="grid size-14 shrink-0 place-items-center bg-paper-200"
                >
                  {product.image ? (
                    <Image
                      src={product.image.src}
                      alt=""
                      width={112}
                      height={112}
                      sizes="56px"
                      className="w-[70%] object-contain"
                    />
                  ) : (
                    <LoafGlyph size={32} className="opacity-70" />
                  )}
                </span>
                <p className="min-w-0 flex-1 text-body text-ink-800">
                  {product.name}
                  <span className="text-ink-500 tabular"> × {line.qty}</span>
                </p>
                <Price amount={product.price * line.qty} size="sm" />
              </li>
            );
          })}
        </ul>

        <dl className="mt-6 max-w-[26rem]">
          <MoneyRow label="Subtotal" value={formatINR(totals.subtotal)} />
          <MoneyRow
            label="Delivery"
            value={
              totals.delivery === 0
                ? laneId === "catch_the_van"
                  ? "Free — you’re catching the van"
                  : "Free"
                : formatINR(totals.delivery)
            }
          />
          {coupon > 0 ? (
            <MoneyRow label="FILLO10" value={`−${formatINR(coupon)}`} tone="kiln" />
          ) : null}
          {codFee > 0 ? (
            <MoneyRow label="Cash at the door" value={`+${formatINR(codFee)}`} />
          ) : null}
          <div className="mt-3 flex items-baseline gap-3 border-t border-t-paper-300 pt-3">
            <dt className="text-body font-semibold text-ink-800">
              Total, including delivery
            </dt>
            <span className="dot-leader" aria-hidden="true" />
            <dd>
              <Price amount={dueNow} size="md" />
            </dd>
          </div>
        </dl>

        {/* -------- Coins and the coupon, both stated as facts ---------- */}
        <p className="mt-4 flex items-start gap-2 text-body-sm text-ink-600">
          <Coins
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-crumb-ink"
          />
          <span className="tabular">
            {coins.balance >= coins.threshold
              ? `${coins.balance} coins. ${formatINR(coins.value)} off is yours to take.`
              : `${coins.balance} coins. ${
                  coins.threshold - coins.balance
                } more and you can take ${formatINR(coins.value)} off.`}{" "}
            This order earns {totals.coinsEarned}.
          </span>
        </p>

        <div className="mt-3">
          {couponEligible ? (
            couponApplied ? (
              <p className="flex items-center gap-2 text-body-sm text-success">
                <Check size={16} strokeWidth={1.5} aria-hidden="true" />
                FILLO10 applied.
                <button
                  type="button"
                  onClick={() => setCouponApplied(false)}
                  className="link-underline text-ink-700"
                >
                  Remove
                </button>
              </p>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setCouponApplied(true)}>
                FILLO10 takes 10% off this order — apply it
              </Button>
            )
          ) : (
            <p className="text-body-sm text-ink-500 tabular">
              Add {formatINR(500 - totals.subtotal)} more and FILLO10 takes 10% off.
            </p>
          )}
        </div>
      </section>

      {/* ================= BLOCK 3 — who you are ======================== */}
      <section aria-labelledby="block-you">
        <BlockHeading id="block-you" step={3}>
          Who you are
        </BlockHeading>

        {verified ? (
          <div className="mt-6 rounded-md bg-success-tint p-4">
            <p className="flex items-center gap-2 text-body font-semibold text-ink-800">
              <Check size={20} strokeWidth={1.5} aria-hidden="true" className="text-success" />
              <span className="tabular">+91 {phone}</span>
            </p>
            <p className="mt-1 pl-7 text-body-sm text-ink-600">
              That’s all we need. There is no password and no account to make.
            </p>
          </div>
        ) : (
          <div className="mt-6 max-w-[26rem]">
            <OtpField
              step={otpStep}
              phone={phone}
              onPhoneChange={setPhone}
              onSendCode={sendCode}
              onChangeNumber={() => {
                setOtpStep("number");
                setOtpStatus("idle");
                setOtpError(null);
              }}
              onComplete={verify}
              status={otpStatus}
              error={otpError}
              sending={sending}
              resendIn={resendIn}
              onResend={sendCode}
            />
            {otpStep === "code" ? (
              <p className="mt-3 text-caption text-ink-500">
                Sent. Check your messages. This is a preview, so any six digits verify.
              </p>
            ) : null}
          </div>
        )}

        <div className="mt-6 max-w-[26rem]">
          <Field
            label="Email"
            htmlFor="checkout-email"
            helper="Optional, for your invoice. We will not put you on a list."
          >
            <Input
              id="checkout-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Field>
        </div>

        {/* -------- Where — home delivery only ------------------------- */}
        {laneId === "home_delivery" ? (
          <div className="mt-10">
            <p className="micro mb-4 text-ink-600">Where should we bring it</p>
            <div className="grid max-w-[36rem] gap-4 sm:grid-cols-2">
              <Field label="Flat / house no." htmlFor="addr-flat">
                <Input
                  id="addr-flat"
                  value={address.flat}
                  onChange={(e) => setAddress({ ...address, flat: e.target.value })}
                  autoComplete="address-line1"
                />
              </Field>
              <Field label="Apartment or building name" htmlFor="addr-building">
                <Input
                  id="addr-building"
                  value={address.building}
                  onChange={(e) => setAddress({ ...address, building: e.target.value })}
                  autoComplete="address-line2"
                />
              </Field>
              <Field label="Street / area" htmlFor="addr-street">
                <Input
                  id="addr-street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </Field>
              <Field
                label="Landmark"
                htmlFor="addr-landmark"
                helper="Helps our driver find you."
              >
                <Input
                  id="addr-landmark"
                  value={address.landmark}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                />
              </Field>
              <Field label="Pincode" htmlFor="addr-pincode">
                <Input
                  id="addr-pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })
                  }
                  autoComplete="postal-code"
                  className="font-mono tabular"
                />
              </Field>
              <Field label="City" htmlFor="addr-city">
                <Input id="addr-city" value="Bengaluru" readOnly disabled />
              </Field>
            </div>
          </div>
        ) : null}
      </section>

      {/* ================= BLOCK 4 — pay ================================ */}
      <section aria-labelledby="block-pay">
        <BlockHeading id="block-pay" step={4}>
          Pay
        </BlockHeading>

        <div className="mt-6 max-w-[26rem]">
          <div className="flex items-baseline gap-3">
            <p className="text-body font-semibold text-ink-800">
              Total, including delivery
            </p>
            <span className="dot-leader" aria-hidden="true" />
            <Price amount={dueNow} size="md" />
          </div>

          {method === "cod" ? (
            <div className="mt-6">
              <p className="text-body text-ink-800 tabular">
                Cash at the door, +{formatINR(cod.surcharge)}, first order only.
              </p>
              {codBlocked ? (
                <p className="mt-2 flex items-start gap-2 rounded-sm bg-paper-200 p-3 text-body-sm text-ink-600">
                  <AlertCircle
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                  />
                  Prepaid only for larger orders — it keeps the van light.
                </p>
              ) : null}
              <Button
                size="lg"
                fullWidth
                className="mt-4 tabular"
                disabled={!canPay || codBlocked}
                loading={payState === "awaiting"}
                onClick={pay}
              >
                Place the order · {formatINR(dueNow)} at the door
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 -ml-3"
                onClick={() => setMethod("upi")}
              >
                Pay now with UPI instead
              </Button>
            </div>
          ) : (
            <UpiPayButton
              className="mt-6"
              amount={dueNow}
              state={payState === "awaiting" ? "awaiting" : payState === "failed" ? "failed" : "idle"}
              onPay={pay}
              onCard={() => setMethod("card")}
              onOther={() => setMethod("cod")}
              onRetry={() => setPayState("idle")}
            />
          )}

          {!canPay && payState === "idle" ? (
            <p className="mt-3 text-caption text-ink-500">
              {!areaSet
                ? "Set your area to check out."
                : !verified
                  ? "Verify your number and the pay button opens."
                  : goneInCart.length > 0
                    ? "Take the sold-out item off and you can pay."
                    : "Pick a day and a window."}
            </p>
          ) : null}

          <div className="mt-6">
            <Checkbox
              label="Join Fillo+ — free. Earn coins on this order."
              helper="Phone-based. No fee, no card, nothing to cancel."
              checked={joinPlus}
              onChange={(e) => setJoinPlus(e.target.checked)}
            />
          </div>

          {/* -------- The promise, under the pay button ---------------- */}
          <p className="mt-6 text-body text-ink-800">
            {run.nextDayLabel ?? "Saturday"},{" "}
            {formatTimeBand(band ?? bands[0] ?? "16:00-18:00")}, at your{" "}
            {laneId === "home_delivery" ? "gate" : "stop"}. We’ll message you the night
            before with the exact time.
          </p>
          <p className="mt-2 text-body-sm text-ink-600">
            You can change or cancel free until 8pm the evening before.
          </p>
          <p className="mt-4 text-caption text-ink-500">
            * The cash-at-the-door surcharge and the {formatINR(cod.cap)} prepaid
            threshold are not final. {cod.note}
          </p>
        </div>
      </section>

      <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}

function BlockHeading({
  id,
  step,
  children,
}: {
  id: string;
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <Badge variant="solid" tabular>
        {step}
      </Badge>
      <h2 id={id} className="text-display-sm text-ink-800">
        {children}
      </h2>
    </div>
  );
}

function MoneyRow({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "kiln";
}) {
  return (
    <div className="flex items-baseline gap-3 py-1">
      <dt className="text-body-sm text-ink-600">{label}</dt>
      <span className="dot-leader" aria-hidden="true" />
      <dd className={cn("text-body-sm tabular", tone === "kiln" ? "text-kiln" : "text-ink-800")}>
        {value}
      </dd>
    </div>
  );
}

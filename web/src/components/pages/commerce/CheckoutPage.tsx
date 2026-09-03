"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { LoafGlyph } from "@/components/ui/LineArt";
import {
  OtpBoxes,
  PhoneInput,
  VerifiedPhone,
  type OtpStatus,
} from "@/components/ui/OtpField";
import { SlotPicker } from "@/components/blocks/SlotPicker";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { useToast } from "@/components/ui/Toast";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR, formatLongDate, formatTimeBandShort } from "@/lib/format";
import { useCartStore, useCartHydrated, computeTotals } from "@/store/cart";
import { useSessionStore, useSessionHydrated } from "@/store/session";
import {
  DEFAULT_WINDOWS,
  type CheckoutArea,
  type CheckoutDay,
} from "@/components/pages/commerce/checkout-data";

/**
 * Checkout — PAGES-v2 "Checkout".
 *
 * One page. Four blocks. On a phone they stack in the order you would answer
 * them; from 1024px the order summary lifts out and sticks to the right while
 * the three questions stay on the left.
 *
 * There is exactly one primary button on this screen and it is the last thing
 * you reach: "Pay ₹449". Delivery is already inside that number, so nothing
 * moves between here and the bank.
 */

/** The mock code. Anything else is the wrong-code path. */
const OTP_CODE = "1234";
const COD_SURCHARGE = 30;
/** Long enough that nobody meets it mid-flow, short enough to be real. */
const SLOT_FILLS_AFTER_MS = 45_000;

type PayMethod = "upi" | "card" | "cash";

export function CheckoutPage({
  areas,
  days,
  orderId,
}: {
  areas: CheckoutArea[];
  days: CheckoutDay[];
  orderId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const cartReady = useCartHydrated();
  const sessionReady = useSessionHydrated();
  const lines = useCartStore((s) => s.lines);

  const areaName = useSessionStore((s) => s.area);
  const areaStatus = useSessionStore((s) => s.areaStatus);
  const lane = useSessionStore((s) => s.lane);
  const stopId = useSessionStore((s) => s.stopId);
  const date = useSessionStore((s) => s.date);
  const band = useSessionStore((s) => s.band);
  const setStop = useSessionStore((s) => s.setStop);
  const setSlot = useSessionStore((s) => s.setSlot);
  const setPhoneOnSession = useSessionStore((s) => s.setPhone);
  const setCustomerName = useSessionStore((s) => s.setCustomerName);

  const [sheetOpen, setSheetOpen] = React.useState(false);

  /* ---- Address ------------------------------------------------------- */
  const [flat, setFlat] = React.useState("");
  const [society, setSociety] = React.useState("");
  const [landmark, setLandmark] = React.useState("");

  /* ---- Identity ------------------------------------------------------ */
  const [phone, setPhone] = React.useState("");
  const [otpStep, setOtpStep] = React.useState<"number" | "code">("number");
  const [otpStatus, setOtpStatus] = React.useState<OtpStatus>("idle");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  /* ---- Pay ----------------------------------------------------------- */
  const [method, setMethod] = React.useState<PayMethod>("upi");
  const [codeOpen, setCodeOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [paying, setPaying] = React.useState(false);

  /* ---- The slot that fills while you are looking at it ---------------- */
  const [filledBand, setFilledBand] = React.useState<string | null>(null);

  const area = areas.find((a) => a.name === areaName) ?? null;
  const placed = sessionReady && Boolean(area) && areaStatus === "served";
  const vanLane = lane === "catch_the_van";
  const stop = area?.stops.find((s) => s.id === stopId) ?? area?.stops[0] ?? null;

  const totals = computeTotals(lines, lane);
  const surcharge = method === "cash" ? COD_SURCHARGE : 0;
  const payable = totals.total + surcharge;

  /* ---- Days and windows for the chosen lane --------------------------- */
  const slotDates = React.useMemo(
    () =>
      days.map((day) => {
        if (day.closed) {
          return { date: day.date, available: false, reason: "Orders closed" };
        }
        const runs = !area?.runDays.length || area.runDays.includes(day.weekday);
        return runs
          ? { date: day.date, available: true }
          : { date: day.date, available: false, reason: "No run" };
      }),
    [days, area],
  );

  const windows = React.useMemo(() => {
    if (vanLane) return stop ? [stop.band] : [];
    if (area?.windows.length) return area.windows;
    return DEFAULT_WINDOWS;
  }, [vanLane, stop, area]);

  const slotBands = React.useMemo(
    () =>
      windows.map((w) => ({ band: w, available: w !== filledBand })),
    [windows, filledBand],
  );

  /* ---- Empty cart leaves, it does not sit here empty ------------------ */
  React.useEffect(() => {
    if (!cartReady || lines.length > 0) return;
    toast({ message: "Add something first." });
    router.replace("/shop");
  }, [cartReady, lines.length, router, toast]);

  /* ---- First open day and window get chosen for you ------------------- */
  React.useEffect(() => {
    if (!sessionReady) return;
    const openDays = slotDates.filter((d) => d.available).map((d) => d.date);
    const openBands = slotBands.filter((b) => b.available).map((b) => b.band);
    const nextDate = openDays.includes(date ?? "") ? date : (openDays[0] ?? null);
    const nextBand = openBands.includes(band ?? "") ? band : (openBands[0] ?? null);
    if (nextDate !== date || nextBand !== band) setSlot(nextDate, nextBand);
  }, [sessionReady, slotDates, slotBands, date, band, setSlot]);

  /* ---- A window fills while you are on the page ----------------------- */
  React.useEffect(() => {
    if (windows.length < 2) return;
    const target = windows[windows.length - 1];
    const timer = window.setTimeout(() => setFilledBand(target), SLOT_FILLS_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [windows]);

  React.useEffect(() => {
    if (!filledBand || band !== filledBand) return;
    const next = windows.find((w) => w !== filledBand) ?? null;
    setSlot(date, next);
    toast({
      message: `${formatTimeBandShort(filledBand)} just filled. We moved you to ${
        next ? formatTimeBandShort(next) : "the next window"
      }.`,
      tone: "info",
    });
  }, [filledBand, band, windows, date, setSlot, toast]);

  /* ---- OTP ------------------------------------------------------------ */
  const verified = otpStatus === "success";

  function sendCode() {
    setSending(true);
    setOtpError(null);
    window.setTimeout(() => {
      setSending(false);
      setOtpStep("code");
      setOtpStatus("idle");
    }, 600);
  }

  function verify(entered: string) {
    setOtpStatus("verifying");
    setOtpError(null);
    window.setTimeout(() => {
      if (entered !== OTP_CODE) {
        setOtpStatus("error");
        setOtpError("That code didn't match. Try again or resend.");
        return;
      }
      setOtpStatus("success");
      setPhoneOnSession(phone, true);
    }, 700);
  }

  /* ---- Pay ------------------------------------------------------------ */
  const addressDone = vanLane || (flat.trim() !== "" && society.trim() !== "");
  const ready = placed && Boolean(date) && Boolean(band) && verified && addressDone;

  function pay() {
    setPaying(true);
    setCustomerName(name.trim() || null);
    window.setTimeout(() => router.push(`/order/${orderId}`), 1500);
  }

  if (cartReady && lines.length === 0) return null;

  return (
    <>
      <div className="container-content pt-10 pb-16 lg:pt-14 lg:pb-24">
        {/* -------- Page head ------------------------------------------ */}
        <header>
          <h1 className="font-display text-display-2 text-ink">Checkout</h1>
          <p className="mt-3 max-w-[46ch] text-body-lg text-ink-2">
            Your order, once. Delivery is already inside the total.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-14">
          {/* ================= LEFT: the three questions ================ */}
          <div className="order-2 min-w-0 lg:order-1">
            {/* -------- 2. Where -------------------------------------- */}
            <Block index="1" title="Where">
              {placed && area ? (
                <>
                  <div className="flex items-start gap-4 rounded-lg border border-line bg-card p-5">
                    <span className="mt-0.5 shrink-0 text-ink">
                      {vanLane ? (
                        <MapPin size={22} strokeWidth={1.5} aria-hidden="true" />
                      ) : (
                        <Truck size={22} strokeWidth={1.5} aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[22px] leading-tight text-ink">
                        {vanLane ? "Catch the van" : "Home delivery"}
                      </p>
                      <p className="mt-1 text-body-sm text-ink-2 tabular">
                        {vanLane
                          ? area.name
                          : `${area.name} · ${
                              totals.delivery === 0
                                ? "free delivery"
                                : formatINR(totals.delivery)
                            }`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSheetOpen(true)}
                      className="link-underline shrink-0 text-body-sm font-semibold text-accent"
                    >
                      Change
                    </button>
                  </div>

                  {vanLane ? (
                    <fieldset className="mt-5 border-0 p-0">
                      <legend className="micro mb-3 text-muted">
                        Pick a stop
                      </legend>
                      <div className="grid gap-2.5">
                        {area.stops.map((s) => {
                          const selected = s.id === stop?.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setStop(s.id)}
                              className={cn(
                                "flex items-center gap-4 rounded-md border px-4 py-3.5 text-left",
                                "transition-colors duration-[var(--dur-fast)]",
                                selected
                                  ? "border-ink bg-card"
                                  : "border-line bg-card hover:border-muted",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "grid size-5 shrink-0 place-items-center rounded-pill border",
                                  selected ? "border-accent" : "border-line",
                                )}
                              >
                                {selected ? (
                                  <span className="size-2.5 rounded-pill bg-accent" />
                                ) : null}
                              </span>
                              {/* Name on its own line, place and time under
                                  it: stop names are long, and letting the
                                  band share the line leaves the rows uneven. */}
                              <span className="min-w-0 flex-1">
                                <span className="block text-body text-ink">
                                  {s.name}
                                </span>
                                <span className="mt-0.5 block text-body-sm text-muted tabular">
                                  {s.descriptor}
                                  <span aria-hidden="true"> · </span>
                                  {s.bandLabel}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ) : (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <TextField
                        label="House or flat"
                        value={flat}
                        onChange={setFlat}
                        autoComplete="address-line1"
                      />
                      <TextField
                        label="Building or society"
                        value={society}
                        onChange={setSociety}
                        autoComplete="address-line2"
                      />
                      <TextField
                        label="Landmark"
                        optional
                        value={landmark}
                        onChange={setLandmark}
                      />
                      <TextField label="Area" value={area.name} readOnly />
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-line bg-card p-5">
                  <p className="text-body text-ink-2">
                    We need an area before we can bring this anywhere.
                  </p>
                  <Button
                    variant="secondary"
                    size="md"
                    className="mt-4"
                    onClick={() => setSheetOpen(true)}
                  >
                    Set area
                  </Button>
                </div>
              )}
            </Block>

            {/* -------- 3. When --------------------------------------- */}
            <Block index="2" title="When">
              <SlotPicker
                dates={slotDates}
                bands={slotBands}
                selectedDate={date}
                selectedBand={band}
                onSelectDate={(d) => setSlot(d, band)}
                onSelectBand={(b) => setSlot(date, b)}
                note="Order by 8pm for next-day delivery."
              />
            </Block>

            {/* -------- 4. Who and pay -------------------------------- */}
            <Block index="3" title="Who and pay">
              {/* Phone */}
              <div className="rounded-lg border border-line bg-card p-5">
                {verified ? (
                  <VerifiedPhone
                    phone={phone}
                    onChange={() => {
                      setOtpStep("number");
                      setOtpStatus("idle");
                      setOtpError(null);
                    }}
                  />
                ) : otpStep === "number" ? (
                  <>
                    <label
                      htmlFor="checkout-phone"
                      className="micro mb-2 block text-muted"
                    >
                      Mobile number
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <PhoneInput
                        id="checkout-phone"
                        value={phone}
                        onChange={setPhone}
                        className="sm:flex-1"
                      />
                      <Button
                        variant="secondary"
                        size="lg"
                        loading={sending}
                        disabled={phone.length !== 10}
                        onClick={sendCode}
                      >
                        Send code
                      </Button>
                    </div>
                    <p className="mt-2.5 text-body-sm text-muted">
                      We only use this to tell you where your order is.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="micro text-muted">Enter the 4-digit code</p>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("number");
                          setOtpStatus("idle");
                          setOtpError(null);
                        }}
                        className="link-underline text-body-sm font-semibold text-accent"
                      >
                        Change number
                      </button>
                    </div>
                    <OtpBoxes
                      className="mt-3"
                      status={otpStatus}
                      onComplete={verify}
                      error={otpError}
                      autoFocus
                    />
                  </>
                )}
              </div>

              {/* Name and email, both optional */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField label="Name" optional value={name} onChange={setName} autoComplete="name" />
                <TextField
                  label="Email"
                  optional
                  hint="for your receipt"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
              </div>

              {/* Payment */}
              <fieldset className="mt-8 border-0 p-0">
                <legend className="micro mb-3 text-muted">How you pay</legend>
                <div className="grid gap-2.5">
                  <PayOption
                    id="upi"
                    method={method}
                    onSelect={setMethod}
                    title="UPI"
                    line="Pay from any UPI app."
                    chips={["Google Pay", "PhonePe", "Paytm"]}
                  />
                  <PayOption
                    id="card"
                    method={method}
                    onSelect={setMethod}
                    title="Card"
                    line="Credit or debit, saved after the first time."
                  />
                  <PayOption
                    id="cash"
                    method={method}
                    onSelect={setMethod}
                    title="Cash at the door"
                    line={`Adds ${formatINR(COD_SURCHARGE)} on a first order.`}
                  />
                </div>
              </fieldset>

              {/* Have a code? — a link, never a field sitting open */}
              <div className="mt-6">
                {codeOpen ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <TextField
                      label="Code"
                      value={code}
                      onChange={setCode}
                      className="sm:flex-1"
                    />
                    <Button variant="secondary" size="lg" disabled={!code.trim()}>
                      Apply
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCodeOpen(true)}
                    className="link-underline text-body-sm font-semibold text-accent"
                  >
                    Have a code?
                  </button>
                )}
              </div>

              {/* The one primary button on this page */}
              <Button
                className="mt-8"
                size="lg"
                fullWidth
                disabled={!ready}
                loading={paying}
                onClick={pay}
              >
                {paying ? "Confirming with your bank" : `Pay ${formatINR(payable)}`}
              </Button>
              {!ready && !paying ? (
                <p className="mt-3 text-body-sm text-muted">
                  {!placed
                    ? "Set your area to carry on."
                    : !addressDone
                      ? "We need a flat and a building to find you."
                      : "Verify your number to carry on."}
                </p>
              ) : null}
            </Block>
          </div>

          {/* ================= RIGHT: 1. Your order ==================== */}
          <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <Block title="Your order" flush>
              <div className="rounded-lg border border-line bg-card p-5">
                <ul className="divide-y divide-line">
                  {lines.map((line) => (
                    <SummaryLine key={line.slug} slug={line.slug} qty={line.qty} />
                  ))}
                </ul>

                <dl className="mt-4 border-t border-line pt-4">
                  <MoneyRow label="Items" value={formatINR(totals.subtotal)} />
                  <MoneyRow
                    label="Delivery"
                    value={totals.delivery === 0 ? "Free" : formatINR(totals.delivery)}
                  />
                  {surcharge > 0 ? (
                    <MoneyRow
                      label="Cash at the door"
                      value={formatINR(surcharge)}
                    />
                  ) : null}
                  <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                    <dt className="text-body text-ink">Total</dt>
                    <dd className="font-display text-[26px] leading-none text-ink tabular">
                      {formatINR(payable)}
                    </dd>
                  </div>
                </dl>

                {date && band ? (
                  <p className="mt-4 border-t border-line pt-4 text-body-sm text-ink-2">
                    {formatLongDate(`${date}T00:00:00+05:30`)},{" "}
                    <span className="tabular">{formatTimeBandShort(band)}</span>
                  </p>
                ) : null}

                <Link
                  href="/cart"
                  className="link-underline mt-4 inline-block text-body-sm font-semibold text-accent"
                >
                  Edit your order
                </Link>
              </div>
            </Block>
          </div>
        </div>
      </div>

      <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Pieces                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A numbered block. The number is what makes three questions feel finite, and
 * it is the only place on the site where a heading carries a digit.
 *
 * Only the questions are numbered. "Your order" sits in the right-hand column
 * on a wide screen, so numbering it 1 would have the eye reading "2" on the
 * left and "1" on the right; and it is a summary, not a step you answer.
 */
function Block({
  index,
  title,
  flush = false,
  children,
}: {
  /** Omitted on the summary: it is a total, not a question. */
  index?: string;
  title: string;
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cn(!flush && "mt-12 first:mt-0")}>
      <div className="flex items-baseline gap-3">
        {index ? (
          <span className="text-body-sm font-medium text-accent tabular">
            {index}
          </span>
        ) : null}
        <h2 className="font-display text-[26px] leading-tight text-ink">
          {title}
        </h2>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  optional = false,
  hint,
  readOnly = false,
  type = "text",
  autoComplete,
  className,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  optional?: boolean;
  hint?: string;
  readOnly?: boolean;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  const id = React.useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="micro mb-2 block text-muted">
        {label}
        {optional ? <span className="normal-case"> (optional)</span> : null}
        {hint ? <span className="normal-case tracking-normal"> {hint}</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        readOnly={readOnly}
        autoComplete={autoComplete}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "h-13 w-full rounded-md border border-line px-4 text-body text-ink",
          "transition-colors duration-[var(--dur-fast)]",
          "placeholder:text-muted focus:border-ink focus:outline-none",
          readOnly ? "bg-paper-2 text-ink-2" : "bg-card hover:border-muted",
        )}
      />
    </div>
  );
}

function PayOption({
  id,
  method,
  onSelect,
  title,
  line,
  chips,
}: {
  id: PayMethod;
  method: PayMethod;
  onSelect: (m: PayMethod) => void;
  title: string;
  line: string;
  chips?: string[];
}) {
  const selected = method === id;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(id)}
      className={cn(
        "flex items-start gap-4 rounded-md border px-4 py-4 text-left",
        "transition-colors duration-[var(--dur-fast)]",
        selected ? "border-ink bg-card" : "border-line bg-card hover:border-muted",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill border",
          selected ? "border-accent" : "border-line",
        )}
      >
        {selected ? <span className="size-2.5 rounded-pill bg-accent" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-body-sm text-ink-2">{line}</span>
        {chips ? (
          <span className="mt-2.5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex h-7 items-center rounded-pill border border-line px-2.5 text-[12px] text-ink-2"
              >
                {chip}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function MoneyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="text-body-sm text-ink-2">{label}</dt>
      <dd className="text-body-sm text-ink tabular">{value}</dd>
    </div>
  );
}

function SummaryLine({ slug, qty }: { slug: string; qty: number }) {
  const product = getProductBySlug(slug);
  if (!product) return null;
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0">
      <span
        data-surface="well"
        className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-md bg-well"
      >
        {product.image ? (
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
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm text-ink">{product.name}</span>
        <span className="block text-body-sm text-muted tabular">
          {qty} × {formatINR(product.price)}
        </span>
      </span>
      <span className="shrink-0 text-body-sm text-ink tabular">
        {formatINR(product.price * qty)}
      </span>
    </li>
  );
}

"use client";

import * as React from "react";
import { Check, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { COMMERCE, type LaneId } from "@/lib/config";
import { formatINR } from "@/lib/format";
import { getAreas, type Area } from "@/lib/mock";
import { useFocusTrap, useLockBodyScroll } from "@/components/ui/overlay";
import { useSessionStore } from "@/store/session";

/**
 * Area & lane sheet — PAGES-v2 "Area & lane sheet".
 *
 * Two steps. Never more.
 *
 *   1. Where should we bring it?   an area input over six real suggestions
 *   2. How do you want it?         home delivery or catch the van
 *
 * Step 1 resolves to exactly three results — served, van only, not yet — and
 * only "served" carries on to step 2. Van-only areas have one honest lane, so
 * offering a choice would be a lie; the result itself is the button.
 *
 * The nine-step version this replaces asked the lane first and then the area,
 * which meant a Whitefield visitor picked a delivery lane before being told we
 * do not go there. Area first, always.
 */

type Step = "where" | "lane";
type Result = "served" | "van-only" | "not-yet";

export function AreaLaneSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  const [step, setStep] = React.useState<Step>("where");
  const [result, setResult] = React.useState<Result | null>(null);
  const [query, setQuery] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notified, setNotified] = React.useState(false);
  const [picked, setPicked] = React.useState<Area | null>(null);

  const setArea = useSessionStore((s) => s.setArea);
  const setLane = useSessionStore((s) => s.setLane);

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  // Every open starts at step one. A sheet that remembers a half-finished
  // answer from twenty minutes ago is a sheet nobody trusts.
  React.useEffect(() => {
    if (!open) return;
    setStep("where");
    setResult(null);
    setQuery("");
    setPhone("");
    setNotified(false);
    setPicked(null);
  }, [open]);

  if (!open) return null;

  function choose(area: Area) {
    setPicked(area);
    setQuery(area.name);
    if (area.serviceability === "not_yet") {
      setArea(area.name, "out_of_area");
      setResult("not-yet");
      return;
    }
    setArea(area.name, "served");
    if (area.serviceability === "catch_van_only") {
      setResult("van-only");
      return;
    }
    setResult("served");
  }

  function takeVan() {
    setLane("catch_the_van");
    onClose();
  }

  function takeLane(lane: LaneId) {
    setLane(lane);
    onClose();
  }

  const q = query.trim().toLowerCase();
  const matches =
    q && picked?.name.toLowerCase() !== q
      ? getAreas().filter(
          (a) => a.name.toLowerCase().includes(q) || a.pincode.startsWith(q),
        )
      : getAreas();

  return (
    <div className="fixed inset-0 z-[var(--z-dialog)]">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 w-full cursor-default bg-scrim motion-safe:animate-[fade_var(--dur-base)_var(--ease-standard)]"
      />

      <div className="absolute inset-0 flex items-end sm:items-center sm:justify-center sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn(
            "relative flex max-h-[88vh] w-full flex-col bg-card outline-none",
            "rounded-t-xl shadow-overlay sm:max-w-[460px] sm:rounded-xl",
            "motion-safe:animate-[sheet-in_var(--dur-slow)_var(--ease-out)]",
            "sm:motion-safe:animate-[dialog-in_var(--dur-slow)_var(--ease-out)]",
          )}
        >
          <SheetHandle />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
            <h2
              id={titleId}
              className="font-display text-[26px] leading-[1.1] text-ink sm:text-[30px]"
            >
              {step === "lane" ? "How do you want it?" : "Where should we bring it?"}
            </h2>

            {step === "where" ? (
              <>
                {/* -------- The input ---------------------------------- */}
                <div className="relative mt-5">
                  <MapPin
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted"
                  />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setResult(null);
                      setPicked(null);
                    }}
                    placeholder="Area or pincode"
                    aria-label="Area or pincode"
                    autoComplete="off"
                    className={cn(
                      "h-13 w-full rounded-md border border-line bg-paper pr-4 pl-12",
                      "text-body text-ink placeholder:text-muted",
                      "transition-colors duration-[var(--dur-fast)]",
                      "hover:border-muted focus:border-ink focus:outline-none",
                    )}
                  />
                </div>

                {/* -------- The answer, or the six areas ---------------- */}
                {result ? (
                  <AreaResult
                    result={result}
                    area={picked}
                    phone={phone}
                    notified={notified}
                    onPhone={setPhone}
                    onNotify={() => setNotified(true)}
                    onContinue={() => setStep("lane")}
                    onTakeVan={takeVan}
                  />
                ) : (
                  <ul className="mt-4 divide-y divide-line">
                    {matches.map((area) => (
                      <li key={area.slug}>
                        <button
                          type="button"
                          onClick={() => choose(area)}
                          className={cn(
                            "flex min-h-13 w-full items-center gap-3 py-3 text-left",
                            "transition-colors duration-[var(--dur-fast)] hover:text-accent",
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-body text-ink">
                              {area.name}
                            </span>
                            <span className="block text-body-sm text-muted tabular">
                              {area.pincode}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                    {matches.length === 0 ? (
                      <li className="py-4 text-body-sm text-ink-2">
                        Nothing by that name yet. Try an area or a 6-digit
                        pincode.
                      </li>
                    ) : null}
                  </ul>
                )}
              </>
            ) : (
              /* -------- Step 2: the two lanes ----------------------- */
              <div className="mt-5 grid gap-3">
                <LaneCard
                  icon={<Truck size={22} strokeWidth={1.5} aria-hidden="true" />}
                  title="Home delivery"
                  price={formatINR(COMMERCE.deliveryFee)}
                  line="Two-hour window, to your door."
                  onClick={() => takeLane("home_delivery")}
                />
                <LaneCard
                  icon={<MapPin size={22} strokeWidth={1.5} aria-hidden="true" />}
                  title="Catch the van"
                  price="Free"
                  line="Pick a stop, we hold your order on board."
                  onClick={() => takeLane("catch_the_van")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** The grab handle. Decorative on desktop, the affordance on a phone. */
function SheetHandle() {
  return (
    <div className="flex shrink-0 justify-center pt-3 pb-5 sm:pt-6">
      <span
        aria-hidden="true"
        className="h-1 w-10 rounded-pill bg-line sm:hidden"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The three results                                                           */
/* -------------------------------------------------------------------------- */

function AreaResult({
  result,
  area,
  phone,
  notified,
  onPhone,
  onNotify,
  onContinue,
  onTakeVan,
}: {
  result: Result;
  area: Area | null;
  phone: string;
  notified: boolean;
  onPhone: (value: string) => void;
  onNotify: () => void;
  onContinue: () => void;
  onTakeVan: () => void;
}) {
  const name = area?.name ?? "your area";

  if (result === "served") {
    return (
      <div className="mt-6">
        <p className="flex items-start gap-2.5 text-body-lg text-ink">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-success"
          />
          <span>
            We deliver to {name} on {daysOf(area)}.
          </span>
        </p>
        <Button className="mt-6" size="lg" fullWidth onClick={onContinue}>
          Choose how
        </Button>
      </div>
    );
  }

  if (result === "van-only") {
    return (
      <div className="mt-6">
        <p className="flex items-start gap-2.5 text-body-lg text-ink">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-success"
          />
          <span>
            The van stops in {name} {daysOf(area, true)}. Home delivery is
            coming soon.
          </span>
        </p>
        <Button className="mt-6" size="lg" fullWidth onClick={onTakeVan}>
          Catch the van
        </Button>
      </div>
    );
  }

  if (notified) {
    return (
      <div className="mt-6">
        <p className="flex items-start gap-2.5 text-body-lg text-ink">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-success"
          />
          <span className="tabular">
            Done. We&rsquo;ll message +91 {phone} the week we reach {name}.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="text-body-lg text-ink">
        Not yet in {name}. Leave your number and we&rsquo;ll tell you first.
      </p>
      <div className="mt-5 flex items-stretch rounded-md border border-line bg-paper focus-within:border-ink">
        <span className="flex items-center pl-4 text-body text-muted tabular">
          +91
        </span>
        <span aria-hidden="true" className="my-3 ml-3 w-px bg-line" />
        <input
          value={phone}
          onChange={(e) => onPhone(e.target.value.replace(/\D/g, ""))}
          inputMode="tel"
          maxLength={10}
          placeholder="98765 43210"
          aria-label="Mobile number"
          className={cn(
            "h-13 min-w-0 flex-1 bg-transparent px-3 text-body text-ink tabular",
            "placeholder:text-muted focus:outline-none",
          )}
        />
      </div>
      <Button
        className="mt-4"
        size="lg"
        fullWidth
        disabled={phone.length !== 10}
        onClick={onNotify}
      >
        Notify me
      </Button>
    </div>
  );
}

/**
 * "Saturdays" → "on Saturdays"; the van-only voice wants the bare label. The
 * fixture already writes these as sentences, so nothing is assembled here
 * beyond the preposition.
 */
function daysOf(area: Area | null, bare = false): string {
  const label = area?.runDaysLabel ?? "the days we run";
  if (bare) return label.toLowerCase() === "every day" ? "every day" : `on ${label}`;
  return label;
}

function LaneCard({
  icon,
  title,
  price,
  line,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  price: string;
  line: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 rounded-lg border border-line bg-paper p-5 text-left",
        "transition-[border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)]",
        "hover:-translate-y-0.5 hover:border-ink",
      )}
    >
      <span className="mt-0.5 shrink-0 text-ink">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4">
          <span className="font-display text-[22px] leading-tight text-ink">
            {title}
          </span>
          <span className="text-body-lg font-semibold text-ink tabular">
            {price}
          </span>
        </span>
        <span className="mt-1 block text-body-sm text-ink-2">{line}</span>
      </span>
    </button>
  );
}

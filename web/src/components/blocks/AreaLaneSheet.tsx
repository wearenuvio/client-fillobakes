"use client";

import * as React from "react";
import { Check, ExternalLink, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Price, FreeLabel } from "@/components/ui/Price";
import { Skeleton } from "@/components/ui/Skeleton";
import { LANES, COMMERCE, type LaneId } from "@/lib/config";
import { formatINR } from "@/lib/format";
import { getAllStops, getAreas, resolveAreaQuery } from "@/lib/mock";
import { useSessionStore } from "@/store/session";

/**
 * Area & lane sheet — journey-recommendation.md §2.3.
 *
 * ONE sheet, reached from the header chip, the home lane cards, the PDP route
 * line and checkout. It is where lane and area get chosen before the cart
 * (DECISIONS.md §2), and the catalogue stays browsable without it.
 *
 * All eight states the doc asks for are mocked here:
 *   lane · van-stop · delivery-area · success-van · success-delivery ·
 *   no-run · out-of-area · loading/error
 */

export type SheetStep =
  | "lane"
  | "van-stop"
  | "delivery-area"
  | "success-van"
  | "success-delivery"
  | "no-run"
  | "out-of-area"
  | "loading"
  | "error";

export function AreaLaneSheet({
  open,
  onClose,
  initialStep = "lane",
}: {
  open: boolean;
  onClose: () => void;
  initialStep?: SheetStep;
}) {
  const [step, setStep] = React.useState<SheetStep>(initialStep);
  const setArea = useSessionStore((s) => s.setArea);
  const setLane = useSessionStore((s) => s.setLane);
  const setStop = useSessionStore((s) => s.setStop);
  const setSlot = useSessionStore((s) => s.setSlot);

  React.useEffect(() => {
    if (open) setStep(initialStep);
  }, [open, initialStep]);

  return (
    <Dialog open={open} onClose={onClose} variant="sheet" title={titleFor(step)}>
      <AreaLaneSheetBody
        step={step}
        onStep={setStep}
        onChooseLane={(lane) => {
          setLane(lane);
          setStep(lane === "catch_the_van" ? "van-stop" : "delivery-area");
        }}
        onChooseStop={(stopId, area, band) => {
          setStop(stopId);
          setArea(area, "served");
          setSlot(null, band);
          setStep("success-van");
        }}
        onChooseArea={(name) => {
          const resolved = resolveAreaQuery(name);
          if (!resolved || resolved.serviceability === "not_yet") {
            setArea(resolved?.name ?? name, "out_of_area");
            setStep("out-of-area");
            return;
          }
          setArea(resolved.name, "served");
          if (resolved.serviceability === "catch_van_only") {
            setLane("catch_the_van");
            setStep("van-stop");
            return;
          }
          setLane("home_delivery");
          setStep("success-delivery");
        }}
        onDone={onClose}
      />
    </Dialog>
  );
}

function titleFor(step: SheetStep): string {
  switch (step) {
    case "lane":
      return "How do you want it?";
    case "van-stop":
      return "Pick a stop";
    case "delivery-area":
      return "Where should we bring it?";
    case "success-van":
    case "success-delivery":
      return "You're set";
    case "no-run":
      return "No run this week";
    case "out-of-area":
      return "Not yet";
    case "error":
      return "That didn't load";
    default:
      return "One moment";
  }
}

/**
 * The sheet's body, exported separately so the styleguide can render every
 * step side by side without eight open dialogs.
 */
export function AreaLaneSheetBody({
  step,
  onStep,
  onChooseLane,
  onChooseStop,
  onChooseArea,
  onDone,
}: {
  step: SheetStep;
  onStep: (step: SheetStep) => void;
  onChooseLane: (lane: LaneId) => void;
  onChooseStop: (stopId: string, area: string, band: string) => void;
  onChooseArea: (area: string) => void;
  onDone: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const area = useSessionStore((s) => s.area);
  const stopId = useSessionStore((s) => s.stopId);

  const stops = getAllStops();
  const chosenStop = stops.find((s) => s.id === stopId);

  switch (step) {
    /* ---- 1. Choose a lane, with true prices on both --------------------- */
    case "lane":
      return (
        <div className="grid gap-3 min-[560px]:grid-cols-2">
          {(["catch_the_van", "home_delivery"] as LaneId[]).map((id) => {
            const lane = LANES[id];
            const Icon = id === "catch_the_van" ? MapPin : Truck;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChooseLane(id)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-md border-[1.5px] border-paper-400",
                  "bg-paper-0 p-5 text-left transition-colors duration-[var(--dur-fast)]",
                  "hover:border-ink-600",
                )}
              >
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="text-ink-800" />
                <span className="text-title font-sans font-semibold text-ink-800">
                  {lane.label}
                </span>
                {lane.price === 0 ? <FreeLabel /> : <Price amount={lane.price} />}
                <span className="micro text-ink-500">{lane.qualifier}</span>
              </button>
            );
          })}
        </div>
      );

    /* ---- 2. Van lane → pick a stop -------------------------------------- */
    case "van-stop":
      return (
        <ul className="divide-y divide-paper-300">
          {stops.map((stop) => (
            <li key={stop.id}>
              <div className="flex items-center gap-3 py-3">
                <button
                  type="button"
                  onClick={() => onChooseStop(stop.id, stop.area, stop.band)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block text-body font-semibold text-ink-800">
                    {stop.name}
                  </span>
                  <span className="micro block text-ink-500">
                    {stop.descriptor} · {stop.runDaysLabel} · {stop.bandLabel}
                  </span>
                </button>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(`${stop.name} Bengaluru`)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${stop.name} in maps`}
                  className="grid size-11 shrink-0 place-items-center rounded-md text-ink-600 hover:bg-veil"
                >
                  <ExternalLink size={20} strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      );

    /* ---- 3. Delivery lane → area name first, never a raw pincode -------- */
    case "delivery-area": {
      const q = query.trim().toLowerCase();
      const matches = q
        ? getAreas().filter(
            (a) => a.name.toLowerCase().includes(q) || a.pincode.startsWith(q),
          )
        : getAreas();
      return (
        <div>
          <Button variant="ghost" size="sm" className="-ml-3 mb-2">
            Use my location
          </Button>
          <Field label="Area" htmlFor="lane-sheet-area">
            <Input
              id="lane-sheet-area"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start typing an area"
              leadingIcon={<MapPin size={20} strokeWidth={1.5} aria-hidden="true" />}
              autoComplete="off"
            />
          </Field>
          <ul className="mt-4 divide-y divide-paper-300">
            {matches.map((a) => (
              <li key={a.slug}>
                <button
                  type="button"
                  onClick={() => onChooseArea(a.name)}
                  className="flex min-h-11 w-full items-center gap-2 py-3 text-left text-body text-ink-800"
                >
                  <MapPin size={16} strokeWidth={1.5} aria-hidden="true" className="text-ink-500" />
                  <span className="min-w-0 flex-1">
                    {a.name}
                    <span className="micro block text-ink-500">
                      {a.serviceability === "not_yet"
                        ? "Not yet"
                        : a.runDaysLabel ?? "Van stops nearby"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {matches.length === 0 ? (
              <li>
                <button
                  type="button"
                  onClick={() => onChooseArea(query.trim())}
                  className="flex min-h-11 w-full items-center py-3 text-left text-body text-ink-600"
                >
                  Check “{query.trim()}” anyway
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      );
    }

    /* ---- 4. Success, van ------------------------------------------------ */
    case "success-van":
      return (
        <SheetSuccess
          line={`You're on ${chosenStop?.runDaysLabel ?? "this week"}'s ${area ?? ""} list.`}
          sub={`Orders close ${COMMERCE.cutoffLabel}.`}
          onDone={onDone}
        />
      );

    /* ---- 5. Success, delivery ------------------------------------------ */
    case "success-delivery":
      return (
        <SheetSuccess
          line={`We deliver to ${area ?? "your area"}.`}
          sub={`${formatINR(COMMERCE.deliveryFee)}, free over ${formatINR(
            COMMERCE.freeDeliveryThreshold,
          )}.`}
          onDone={onDone}
        />
      );

    /* ---- 6. No run this week — a schedule, never an error --------------- */
    case "no-run":
      return (
        <div>
          <p className="text-body text-ink-600">
            The van isn&rsquo;t doing {area ?? "your area"} this week. Next: Saturday.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="md">Notify me</Button>
            <Button variant="ghost" size="md" onClick={() => onStep("lane")}>
              Pick another lane
            </Button>
          </div>
        </div>
      );

    /* ---- 7. Out of area — a waitlist, never a dead end ------------------ */
    case "out-of-area": {
      const waitlist = area ? resolveAreaQuery(area) : undefined;
      return (
        <div>
          <p className="text-body text-ink-600">
            The van hasn&rsquo;t reached {area ?? "there"} yet. Tell us you&rsquo;re
            there and we&rsquo;ll come sooner — we plan routes by demand.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Mobile number" htmlFor="lane-sheet-phone" className="sm:flex-1">
              <Input
                id="lane-sheet-phone"
                prefix="+91"
                inputMode="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="font-mono tabular"
              />
            </Field>
            <Button size="md" disabled={phone.length !== 10}>
              Add my area
            </Button>
          </div>
          {waitlist?.waitlist?.requests ? (
            <p className="micro mt-3 text-ink-500 tabular">
              {waitlist.waitlist.requests} PEOPLE IN {waitlist.name.toUpperCase()} HAVE
              ASKED
            </p>
          ) : null}
        </div>
      );
    }

    /* ---- 8. Loading and error ------------------------------------------ */
    case "loading":
      return (
        <div className="grid gap-3 min-[560px]:grid-cols-2">
          <Skeleton rounded="md" className="h-40" />
          <Skeleton rounded="md" className="h-40" />
        </div>
      );

    case "error":
    default:
      return (
        <div>
          <p className="text-body text-ink-600">
            Something broke at our end. Nothing was charged. Try again, or
            WhatsApp us.
          </p>
          <Button size="md" className="mt-6" onClick={() => onStep("lane")}>
            Try again
          </Button>
        </div>
      );
  }
}

function SheetSuccess({
  line,
  sub,
  onDone,
}: {
  line: string;
  sub: string;
  onDone: () => void;
}) {
  return (
    <div>
      <p className="flex items-start gap-2 text-body font-semibold text-ink-800">
        <Check size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        {line}
      </p>
      <p className="mt-1 pl-7 text-body-sm text-ink-600">{sub}</p>
      <Button size="md" className="mt-6" onClick={onDone}>
        See this week&rsquo;s bake
      </Button>
    </div>
  );
}

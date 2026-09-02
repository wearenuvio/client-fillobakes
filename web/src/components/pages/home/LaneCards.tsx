"use client";

import * as React from "react";
import { Check, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { Price, FreeLabel } from "@/components/ui/Price";
import { AreaCheck } from "@/components/blocks/AreaCheck";
import { LANES, type LaneId } from "@/lib/config";
import { getArea, getRoutesForArea, type Area } from "@/lib/mock";
import { formatTimeBand } from "@/lib/format";
import { useSessionStore, useSessionHydrated } from "@/store/session";
import { Tbc } from "@/components/pages/home/Tbc";

/**
 * "Two ways to get bread" — site-content Home §5, DESIGN.md §12.29.
 *
 * The lane is chosen BEFORE the cart, because the lane changes which days,
 * which stops and which items are available (DECISIONS.md §2). The price is
 * attached to each lane and always visible — never "calculated at checkout".
 *
 * Two states, exactly as the copy specifies them:
 *  - area unset  — both cards are CTAs, and picking one opens the area check.
 *  - area set    — the chosen card is confirmed with the day and the window,
 *                  and the other collapses to a Switch link.
 *
 * "Catch the van only" is a lane, never an error, and is never styled as one.
 */

const LANE_ORDER: LaneId[] = ["catch_the_van", "home_delivery"];

function laneDetail(lane: LaneId, area: Area | undefined): string {
  if (!area) return LANES[lane].line;
  if (lane === "catch_the_van") {
    const route = getRoutesForArea(area.name)[0];
    const stop = route?.stops.find((s) => s.area === area.name) ?? route?.stops[0];
    return stop
      ? `${area.runDaysLabel} · ${stop.name} · ${stop.bandLabel}`
      : `${area.runDaysLabel} · ${area.name}`;
  }
  const window = area.windows[0];
  return window
    ? `${area.runDaysLabel} · ${area.name} · ${formatTimeBand(window)}`
    : `${area.runDaysLabel} · ${area.name}`;
}

export function LaneCards() {
  const hydrated = useSessionHydrated();
  const areaName = useSessionStore((s) => s.area);
  const lane = useSessionStore((s) => s.lane);
  const setLane = useSessionStore((s) => s.setLane);

  const [checking, setChecking] = React.useState<LaneId | null>(null);
  const [switching, setSwitching] = React.useState(false);

  const area = hydrated && areaName ? getArea(areaName) : undefined;
  const settled = Boolean(hydrated && area && lane) && !switching;

  function choose(next: LaneId) {
    setLane(next);
    if (!area) setChecking(next);
    else setSwitching(false);
  }

  /* -------- Settled: one confirmed card, one Switch link ------------------ */
  if (settled && area && lane) {
    const other = LANE_ORDER.find((id) => id !== lane) as LaneId;
    const available = area.lanes.includes(other);

    return (
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <LaneCard
            lane={lane}
            detail={laneDetail(lane, area)}
            selected
            as="static"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 lg:col-span-5">
          <p className="text-body text-ink-600">
            {available
              ? `${LANES[other].label} is open in ${area.name} too.`
              : `${LANES[other].label} is not in ${area.name} yet.`}
          </p>
          <div className="flex flex-wrap gap-3">
            {available ? (
              <Button variant="secondary" size="md" onClick={() => choose(other)}>
                Switch to {LANES[other].label.toLowerCase()}
              </Button>
            ) : null}
            <Button variant="ghost" size="md" onClick={() => setSwitching(true)}>
              Change area
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* -------- Unset: both cards are CTAs ----------------------------------- */
  return (
    <div>
      <div className="grid gap-4 min-[560px]:grid-cols-2">
        {LANE_ORDER.map((id) => (
          <LaneCard
            key={id}
            lane={id}
            detail={laneDetail(id, area)}
            selected={checking === id}
            onSelect={() => choose(id)}
          />
        ))}
      </div>

      {checking || switching ? (
        <div className="mt-8 border-t border-t-paper-300 pt-8">
          <h3 className="text-display-sm text-ink-800">
            {checking === "catch_the_van"
              ? "Which area are you in?"
              : "Where should we bring it?"}
          </h3>
          <AreaCheck
            className="mt-4 max-w-[640px]"
            onCheck={() => {
              setChecking(null);
              setSwitching(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function LaneCard({
  lane,
  detail,
  selected = false,
  as = "button",
  onSelect,
}: {
  lane: LaneId;
  detail: React.ReactNode;
  selected?: boolean;
  as?: "button" | "static";
  onSelect?: () => void;
}) {
  const config = LANES[lane];
  const Icon = lane === "home_delivery" ? Truck : MapPin;
  const shell = cn(
    "relative flex h-full flex-col gap-3 rounded-md border-[1.5px] p-6 text-left",
    "transition-colors duration-[var(--dur-fast)]",
    selected ? "border-ink-800 bg-paper-0" : "border-paper-400 bg-paper-0",
    as === "button" && "hover:border-ink-600",
  );

  const body = (
    <>
      {selected ? (
        <Check
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="absolute top-5 right-5 text-ink-800"
        />
      ) : null}

      <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="text-ink-800" />

      <span className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="text-title-lg font-sans text-ink-800">{config.label}</span>
        {config.price === 0 ? <FreeLabel /> : <Price amount={config.price} />}
      </span>

      <span className="max-w-[38ch] text-body text-ink-600">{detail}</span>

      <span className="micro mt-auto flex items-center gap-2 pt-3 text-ink-500">
        {config.qualifier}
        {lane === "home_delivery" ? <Tbc what="The delivery fee and the free-delivery threshold" /> : null}
      </span>
    </>
  );

  if (as === "static") {
    return <div className={shell}>{body}</div>;
  }

  return (
    <button type="button" onClick={onSelect} className={shell}>
      {body}
    </button>
  );
}

/** The escape hatch under the pair — serviceability without a commitment. */
export function LaneCardsFooter() {
  return (
    <p className="mt-6 text-body-sm text-ink-500">
      Not sure we reach you?{" "}
      <ButtonLink href="/areas" variant="ghost" size="sm" className="-mx-1 align-baseline">
        See every area we run
      </ButtonLink>
    </p>
  );
}

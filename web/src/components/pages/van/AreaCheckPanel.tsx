"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AreaCheck, type AreaCheckStatus } from "@/components/blocks/AreaCheck";
import { FulfilmentLane } from "@/components/blocks/FulfilmentLane";
import type { Area, LaneId } from "@/lib/mock";
import { useSessionStore } from "@/store/session";

/**
 * The AreaCheck, wired up.
 *
 * `<AreaCheck>` is presentational by design, so the state machine lives here:
 * idle → checking → one of the three results, or the pincode error. A numeric
 * query that matches nothing is an error ("that pincode isn't one we
 * recognise"); a *name* that matches nothing is not — it is a new area, and
 * the waitlist is a lane rather than a dead end (§12.28).
 */
export function AreaCheckPanel({ className }: { className?: string }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<AreaCheckStatus>("idle");
  const [area, setArea] = React.useState<Area | null>(null);
  const [query, setQuery] = React.useState("");
  const [captured, setCaptured] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <AreaCheck
      className={className}
      status={status}
      area={area}
      query={query}
      captured={captured}
      error="That pincode isn't one we recognise."
      onCheck={(value, resolved) => {
        setQuery(value);
        setArea(resolved ?? null);
        setCaptured(false);
        setStatus("checking");
        timer.current = window.setTimeout(() => {
          if (!resolved && /^\d+$/.test(value.trim())) setStatus("error");
          else setStatus("result");
        }, 600);
      }}
      onPrimaryAction={(resolved) => {
        router.push(
          resolved.serviceability === "served"
            ? "/shop"
            : `/areas/${resolved.slug}`,
        );
      }}
      onSecondaryAction={(resolved) => {
        router.push(resolved.routeId ? `/van/${resolved.routeId.replace("route_", "")}` : "/van");
      }}
      onCapture={() => setCaptured(true)}
    />
  );
}

/**
 * The two lanes on an area page, writing the choice into the session so the
 * catalogue never has to ask again. An unavailable lane says why, in place,
 * and is never styled as a failure — catch-the-van is a lane, not a fallback
 * (§12.29).
 */
export function AreaLanePicker({
  area,
  lanes,
  detail,
  stopId,
  className,
}: {
  area: string;
  lanes: LaneId[];
  detail: Record<LaneId, React.ReactNode>;
  stopId?: string | null;
  className?: string;
}) {
  const lane = useSessionStore((s) => s.lane);
  const sessionArea = useSessionStore((s) => s.area);
  const setSessionArea = useSessionStore((s) => s.setArea);
  const setLane = useSessionStore((s) => s.setLane);
  const setStop = useSessionStore((s) => s.setStop);

  const value = sessionArea === area ? lane : null;

  return (
    <FulfilmentLane
      className={className}
      value={value}
      onChange={(next) => {
        setSessionArea(area, "served");
        setLane(next);
        if (next === "catch_the_van" && stopId) setStop(stopId);
      }}
      options={[
        {
          id: "catch_the_van",
          detail: detail.catch_the_van,
          available: lanes.includes("catch_the_van"),
          reason: lanes.includes("catch_the_van")
            ? undefined
            : `NO STOP IN ${area.toUpperCase()} YET`,
        },
        {
          id: "home_delivery",
          detail: detail.home_delivery,
          available: lanes.includes("home_delivery"),
          reason: lanes.includes("home_delivery")
            ? undefined
            : `WE DON'T DELIVER TO ${area.toUpperCase()} YET`,
        },
      ]}
    />
  );
}

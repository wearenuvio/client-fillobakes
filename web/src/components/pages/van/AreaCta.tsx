"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import type { LaneId } from "@/lib/mock";
import { useSessionStore } from "@/store/session";

/**
 * `Order for Banaswadi` — the one action an area page exists to offer.
 *
 * Serviceability is asked once and remembered (§12.28), so pressing this sets
 * the session's area, lane and stop before the catalogue is opened. It never
 * gates browsing; it just means the shop can answer the location question
 * instead of asking it again.
 */
export function AreaCtaButton({
  area,
  lane,
  stopId,
  label,
  href = "/shop",
  size = "lg",
}: {
  area: string;
  lane: LaneId;
  stopId?: string | null;
  label: string;
  href?: string;
  size?: "md" | "lg";
}) {
  const router = useRouter();
  const setArea = useSessionStore((s) => s.setArea);
  const setLane = useSessionStore((s) => s.setLane);
  const setStop = useSessionStore((s) => s.setStop);

  return (
    <Button
      size={size}
      onClick={() => {
        setArea(area, "served");
        setLane(lane);
        if (stopId) setStop(stopId);
        router.push(href);
      }}
    >
      {label}
    </Button>
  );
}

/**
 * The waitlist, for an area the van has not reached.
 *
 * "Not yet" is a lane, not an error (§13): no apology, no support link, no
 * dead end. The public position count is the point — it turns an out-of-area
 * lookup into the founders' route-planning data, and gives the visitor a
 * reason to tell their street.
 */
export function WaitlistCapture({
  area,
  requests,
  position,
  /** The founders have not set the threshold; we say so rather than guess. */
  thresholdTbc,
  className,
}: {
  area: string;
  /** How many people have asked for this area. A real count or nothing. */
  requests: number | null;
  /** The position this visitor takes, straight from the fixture. */
  position: number | null;
  thresholdTbc?: boolean;
  className?: string;
}) {
  const [phone, setPhone] = React.useState("");
  const [state, setState] = React.useState<"idle" | "saving" | "done">("idle");
  const setSessionArea = useSessionStore((s) => s.setArea);
  const timer = React.useRef<number | undefined>(undefined);
  const fieldId = React.useId();

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  if (state === "done") {
    return (
      <div className={cn("rounded-md bg-paper-100 p-6", className)}>
        <p className="flex items-start gap-2 text-body text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-success"
          />
          <span>
            Noted. We&rsquo;ll message you when the van gets to {area}.
            {position !== null ? (
              <>
                {" "}
                You&rsquo;re <span className="tabular">#{position}</span> in {area}.
              </>
            ) : null}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-md bg-paper-100 p-6", className)}>
      <h2 className="font-display text-display-sm text-ink-800">
        Tell us you&rsquo;re in {area}
      </h2>
      <p className="mt-3 max-w-[62ch] text-body text-ink-600">
        We plan routes by demand. Every request is a pin on the map the founders
        drive by.
      </p>

      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
        <div>
          <dt className="micro text-ink-500">Asked so far</dt>
          <dd className="mt-1 font-display text-display-sm text-ink-800 tabular">
            {requests ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="micro text-ink-500">Requests before we add the route</dt>
          <dd className="mt-1 text-body text-ink-600">
            {thresholdTbc ? "Not set yet [TBC]" : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="WhatsApp number" htmlFor={`${fieldId}-phone`} className="sm:flex-1">
          <Input
            id={`${fieldId}-phone`}
            prefix="+91"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="font-mono tabular"
          />
        </Field>
        <Button
          size="md"
          loading={state === "saving"}
          disabled={phone.length !== 10}
          onClick={() => {
            setState("saving");
            setSessionArea(area, "out_of_area");
            timer.current = window.setTimeout(() => setState("done"), 900);
          }}
        >
          Notify me
        </Button>
      </div>

      <p className="micro mt-4 text-ink-500">
        One message, when the van gets there. Nothing else.
      </p>
    </div>
  );
}

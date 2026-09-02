"use client";

import * as React from "react";
import { Bell, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { NotifyMeSheet } from "@/components/pages/van/NotifyMeSheet";

/**
 * StopSchedule — DESIGN.md §12.17.2, the load-bearing content of the tracker.
 *
 * A left-gutter timeline: a 2px hairline with one dot per stop, a display-face
 * time, the ward, its local descriptor, and a state word. Four stop states —
 * served, here now, upcoming, sold out — and **sold out is shown, never
 * hidden**: it is honesty, not a fault (site-content, "Stop states").
 *
 * Every row carries the two things that make a stop findable in Bengaluru: the
 * landmark it is opposite, and a link into a map app. Per-stop `Notify me`
 * opens the sheet — never an OS prompt.
 */

export type ScheduleStop = {
  id: string;
  /** Keys the row to its numbered marker on the diagram. */
  index?: number;
  name: string;
  descriptor?: string | null;
  /** The display-face time: "4:40", or a weekday when the van is off air. */
  time: string;
  /** The band or the served time, in mono under the name. */
  note?: string | null;
  state: "done" | "current" | "upcoming" | "sold_out";
  stateLabel?: string | null;
  /** Free text handed to the map app — never a stored coordinate. */
  mapsQuery?: string | null;
};

export function StopSchedule({
  stops,
  /** Off air every dot is hollow and no row is "now". */
  grounded = false,
  className,
}: {
  stops: ScheduleStop[];
  grounded?: boolean;
  className?: string;
}) {
  const [notifyStop, setNotifyStop] = React.useState<string | null>(null);

  return (
    <>
      <ol className={cn("relative", className)}>
        <span
          aria-hidden="true"
          className="absolute top-4 bottom-4 left-[5px] w-0.5 bg-paper-300"
        />
        {stops.map((stop) => {
          const state = grounded ? "upcoming" : stop.state;
          return (
            <li
              key={stop.id}
              className={cn(
                "relative flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 pl-8",
                state === "current" && "bg-paper-100",
              )}
            >
              <Dot state={state} />

              <span
                className={cn(
                  "w-16 shrink-0 font-display text-title-lg tabular",
                  state === "current"
                    ? "text-ink-800"
                    : state === "done"
                      ? "text-ink-500"
                      : "text-ink-600",
                )}
              >
                {stop.time}
              </span>

              <span className="min-w-0 flex-1 basis-40">
                <span
                  className={cn(
                    "flex items-baseline gap-1.5 text-body",
                    state === "current"
                      ? "font-semibold text-ink-800"
                      : state === "done"
                        ? "text-ink-500"
                        : "text-ink-600",
                    state === "sold_out" && "line-through",
                  )}
                >
                  {state === "done" ? (
                    <Check
                      size={14}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 self-center"
                    />
                  ) : null}
                  {typeof stop.index === "number" ? (
                    <span className="micro shrink-0 self-center text-ink-500 tabular">
                      {stop.index}
                    </span>
                  ) : null}
                  {stop.name}
                </span>
                {stop.descriptor ? (
                  <span className="mt-0.5 block text-caption text-ink-500">
                    {stop.descriptor}
                  </span>
                ) : null}
                {stop.note ? (
                  <span className="mt-0.5 block font-mono text-caption text-ink-500 tabular">
                    {stop.note}
                  </span>
                ) : null}
              </span>

              {!grounded && stop.stateLabel ? (
                <span
                  className={cn(
                    "micro shrink-0",
                    state === "current" ? "text-kiln" : "text-ink-500",
                  )}
                >
                  {stop.stateLabel}
                </span>
              ) : null}

              <span className="flex shrink-0 items-center gap-1">
                {stop.mapsQuery ? (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      stop.mapsQuery,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-11 place-items-center rounded-md text-ink-600 hover:bg-veil hover:text-ink-900"
                  >
                    <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
                    <span className="sr-only">Open {stop.name} in maps</span>
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => setNotifyStop(stop.id)}
                  className="grid size-11 place-items-center rounded-md text-ink-600 hover:bg-veil hover:text-ink-900"
                >
                  <Bell size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span className="sr-only">Tell me when the van reaches {stop.name}</span>
                </button>
              </span>
            </li>
          );
        })}
      </ol>

      <NotifyMeSheet
        open={notifyStop !== null}
        onClose={() => setNotifyStop(null)}
        stopId={notifyStop ?? undefined}
      />
    </>
  );
}

function Dot({ state }: { state: ScheduleStop["state"] }) {
  if (state === "current") {
    return (
      <span aria-hidden="true" className="absolute top-6 left-0 grid size-3 place-items-center">
        <span className="size-3 rounded-pill bg-crumb" />
        <span
          data-motion="pulse"
          className="absolute size-3 rounded-pill bg-crumb animate-[var(--animate-van-pulse)]"
        />
      </span>
    );
  }
  if (state === "done") {
    return (
      <span aria-hidden="true" className="absolute top-6 left-0 size-3 rounded-pill bg-ink-800" />
    );
  }
  if (state === "sold_out") {
    return (
      <span
        aria-hidden="true"
        className="absolute top-6 left-0 size-3 rounded-pill border-[1.5px] border-ink-400 bg-paper-200"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="absolute top-6 left-0 size-3 rounded-pill border-[1.5px] border-paper-400 bg-paper-50"
    />
  );
}

/**
 * The week, when the van is off air — the same row geometry, dated by day
 * instead of clocked by stop (§12.16, "the route list becomes the schedule").
 */
export function WeekSchedule({
  rows,
  className,
}: {
  rows: { day: string; route: string; from: string; href?: string }[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="absolute top-4 bottom-4 left-[5px] w-0.5 bg-paper-300"
      />
      {rows.map((row) => (
        <li
          key={`${row.day}-${row.route}`}
          className="relative flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 pl-8"
        >
          <span
            aria-hidden="true"
            className="absolute top-6 left-0 size-3 rounded-pill border-[1.5px] border-paper-400 bg-paper-50"
          />
          <span className="w-28 shrink-0 font-display text-title-lg text-ink-800">
            {row.day}
          </span>
          <span className="min-w-0 flex-1 basis-40 text-body text-ink-600">
            {row.href ? (
              <a href={row.href} className="link-underline text-ink-800">
                {row.route}
              </a>
            ) : (
              row.route
            )}
          </span>
          <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
            from {row.from}
          </span>
        </li>
      ))}
    </ol>
  );
}

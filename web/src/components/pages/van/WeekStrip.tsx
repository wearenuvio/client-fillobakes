"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * The week — PAGES-v2 "The Van".
 *
 * Seven days across, today lit, and one tap opens that day's stops underneath.
 * The strip is the answer to "when are you near me", so it never hides behind a
 * date picker and it never collapses the days the van rests: a blank Tuesday is
 * information.
 *
 * The panel below the strip is one region that swaps content, rather than seven
 * stacked accordions — on a phone that keeps the answer within a thumb's reach
 * of the day you just pressed.
 */

export type WeekRun = {
  routeId: string;
  name: string;
  slug: string;
  from: string;
  stops: { id: string; name: string; descriptor: string; band: string }[];
};

export type WeekDay = {
  key: string;
  short: string;
  long: string;
  date: string;
  today: boolean;
  runs: WeekRun[];
};

export function WeekStrip({ days, className }: { days: WeekDay[]; className?: string }) {
  const todayIndex = Math.max(
    0,
    days.findIndex((d) => d.today),
  );
  const [openIndex, setOpenIndex] = React.useState(todayIndex);
  const open = days[openIndex] ?? days[0];
  const panelId = React.useId();

  if (days.length === 0) return null;

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="The week ahead"
        className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-7 md:gap-3 md:px-0"
      >
        {days.map((day, i) => {
          const selected = i === openIndex;
          const resting = day.runs.length === 0;
          return (
            <button
              key={day.key}
              type="button"
              role="tab"
              id={`${panelId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={panelId}
              onClick={() => setOpenIndex(i)}
              className={cn(
                "w-[96px] shrink-0 rounded-lg border px-3 py-3 text-left md:w-auto",
                "transition-[background-color,border-color,transform]",
                "duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                selected
                  ? "border-ink bg-card"
                  : "border-line bg-paper-2 hover:-translate-y-0.5 hover:border-muted",
              )}
            >
              <span
                className={cn(
                  "flex items-baseline gap-1.5 text-[12px] font-medium tracking-[0.12em] uppercase",
                  day.today ? "text-accent" : "text-muted",
                )}
              >
                {day.short}
                {day.today ? <span className="normal-case tracking-normal">·</span> : null}
                {day.today ? (
                  <span className="tracking-[0.06em] normal-case">today</span>
                ) : null}
              </span>
              <span className="mt-1.5 block font-display text-[18px] leading-tight text-ink tabular">
                {day.date}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-body-sm",
                  resting ? "text-muted" : "text-ink-2",
                )}
              >
                {resting
                  ? "Resting"
                  : day.runs.length === 1
                    ? "1 run"
                    : `${day.runs.length} runs`}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${openIndex}`}
        tabIndex={-1}
        className="mt-5 rounded-xl border border-line bg-card p-6 sm:p-8"
      >
        <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
          {open.long} {open.date}
        </p>

        {open.runs.length === 0 ? (
          <p className="mt-3 max-w-[42ch] font-display text-[24px] leading-tight text-ink">
            The van rests. The kitchen does not.
          </p>
        ) : (
          <div className="mt-5 space-y-8">
            {open.runs.map((run) => (
              <div key={run.routeId}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-[24px] leading-tight text-ink">
                    {run.name}
                  </h3>
                  <p className="text-body-sm text-muted tabular">
                    From {run.from}
                  </p>
                </div>

                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {run.stops.map((stop) => (
                    <li
                      key={stop.id}
                      className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <span className="min-w-0 text-body text-ink">
                        {stop.name}
                        <span className="block text-body-sm text-muted sm:inline sm:before:content-['_·_']">
                          {stop.descriptor}
                        </span>
                      </span>
                      <span className="shrink-0 text-body-sm text-ink-2 tabular">
                        {stop.band}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/van/${run.slug}`}
                  className="link-underline mt-3 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent"
                >
                  See the {run.name.replace(/^The /, "")}
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

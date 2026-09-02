import * as React from "react";
import Link from "next/link";
import { AlertCircle, Check, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BakeStrip } from "@/components/blocks/BakeStrip";
import type { VanState, VanStop } from "@/lib/mock";

/**
 * TrackerCard and its parts — DESIGN.md §12.16, §12.17; journey §6.
 *
 * THE LOAD-BEARING RULE. Status, hero line, arrival band and route list are
 * server-rendered BEFORE the map loads. The card is the truth; the map is the
 * feeling. If the map layer is removed entirely this component must still
 * answer the question the visitor arrived with — which is why nothing here
 * imports a map library, and the map is passed in as a child.
 *
 * STOPS, NOT MINUTES. Proximity is a stop count; time is a ten-minute band
 * that widens in traffic. Never a countdown.
 *
 * OFF AIR IS THE PRIMARY STATE. The van runs a few days a week, so most days
 * this is the page. It keeps the identical layout — pill, hero line,
 * route-as-list, one action — and only the content changes. It is never styled
 * as an error, never greyed out, and never smaller than the live state.
 */

/* -------------------------------------------------------------------------- */
/* Status pill                                                                 */
/* -------------------------------------------------------------------------- */

type PillTone = {
  surface: string;
  text: string;
  dot: string;
  pulse: boolean;
};

const PILL: Record<string, PillTone> = {
  live: { surface: "bg-ink-900", text: "text-crumb", dot: "bg-crumb", pulse: true },
  stale: {
    surface: "bg-warning-tint",
    text: "text-warning",
    dot: "bg-warning",
    pulse: false,
  },
  off_air: {
    surface: "bg-paper-200",
    text: "text-ink-600",
    dot: "bg-ink-400",
    pulse: false,
  },
  off_hours: {
    surface: "bg-paper-200",
    text: "text-ink-600",
    dot: "bg-ink-400",
    pulse: false,
  },
  no_run_today: {
    surface: "bg-paper-200",
    text: "text-ink-600",
    dot: "bg-ink-400",
    pulse: false,
  },
  route_cancelled: {
    surface: "bg-paper-200",
    text: "text-ink-600",
    dot: "bg-ink-400",
    pulse: false,
  },
  go_dark: {
    surface: "bg-paper-200",
    text: "text-ink-600",
    dot: "bg-ink-400",
    pulse: false,
  },
  off_route: {
    surface: "bg-paper-200",
    text: "text-ink-600",
    dot: "bg-ink-400",
    pulse: false,
  },
  map_failed: {
    surface: "bg-danger-tint",
    text: "text-danger",
    dot: "bg-danger",
    pulse: false,
  },
};

/** Every state carries a dot, a label and a time or a date. Never a bare "offline". */
export function VanStatusPill({
  status,
  label,
  className,
}: {
  status: string;
  label: string;
  className?: string;
}) {
  const tone = PILL[status] ?? PILL.off_air;
  return (
    <span
      className={cn(
        "nano inline-flex h-7 items-center gap-2 rounded-pill px-3",
        tone.surface,
        tone.text,
        className,
      )}
    >
      <span className="relative grid size-2 place-items-center" aria-hidden="true">
        <span className={cn("size-2 rounded-pill", tone.dot)} />
        {tone.pulse ? (
          <span
            data-motion="pulse"
            className={cn(
              "absolute size-2 rounded-pill animate-[var(--animate-van-pulse)]",
              tone.dot,
            )}
          />
        ) : null}
      </span>
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Route list — the load-bearing content                                       */
/* -------------------------------------------------------------------------- */

export function RouteList({
  stops,
  tone = "paper",
  className,
}: {
  stops: VanStop[];
  tone?: "paper" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <ol className={cn("relative", className)}>
      {/* The left-gutter timeline the dots sit on. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-2 bottom-2 left-[5px] w-0.5",
          dark ? "bg-[var(--hairline-dark-color)]" : "bg-paper-300",
        )}
      />
      {stops.map((stop) => (
        <li
          key={stop.id}
          className={cn(
            "relative flex items-baseline gap-3 py-3 pl-8",
            stop.state === "current" && !dark && "bg-paper-100",
          )}
        >
          <StopDot state={stop.state} dark={dark} />
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block text-body",
                stop.state === "current"
                  ? cn("font-semibold", dark ? "text-paper-0" : "text-ink-800")
                  : stop.state === "done"
                    ? cn(dark ? "text-ink-400" : "text-ink-500")
                    : cn(dark ? "text-ink-400" : "text-ink-600"),
                stop.state === "sold_out" && "line-through",
              )}
            >
              {stop.state === "done" ? (
                <Check
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mr-1.5 inline-block align-baseline"
                />
              ) : null}
              {stop.name}
            </span>
            {/* The landmark is what makes a stop findable in Bengaluru
                (DESIGN §12.17.2) — it is content, not decoration. */}
            {stop.descriptor ? (
              <span
                className={cn(
                  "mt-0.5 block text-caption",
                  dark ? "text-ink-400" : "text-ink-500",
                )}
              >
                {stop.descriptor}
              </span>
            ) : null}
          </span>
          {stop.mapsQuery ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                stop.mapsQuery,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "grid size-11 shrink-0 -my-3 place-items-center self-center rounded-md",
                dark
                  ? "text-ink-400 hover:text-paper-0"
                  : "text-ink-600 hover:bg-veil hover:text-ink-900",
              )}
            >
              <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">Open {stop.name} in maps</span>
            </a>
          ) : null}
          <span
            className={cn(
              "shrink-0 font-mono text-caption tabular",
              dark ? "text-ink-400" : "text-ink-500",
            )}
          >
            {stop.state === "current"
              ? (stop.stateLabel || "now")
              : (stop.atLabel ?? stop.etaBandLabel ?? stop.stateLabel ?? "")}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StopDot({ state, dark }: { state: VanStop["state"]; dark: boolean }) {
  if (state === "current") {
    return (
      <span
        aria-hidden="true"
        className="absolute top-4 left-0 grid size-3 place-items-center"
      >
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
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-4 left-0 size-3 rounded-pill",
          dark ? "bg-paper-0" : "bg-ink-800",
        )}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-4 left-0 size-3 rounded-pill border-[1.5px]",
        dark ? "border-ink-400" : "border-paper-400",
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* The panel                                                                   */
/* -------------------------------------------------------------------------- */

export function TrackerCard({
  van,
  /** The map, passed in so it can be a progressively-enhanced child. */
  map,
  /** Off air: the WhatsApp opt-in is the primary action. */
  onNotify,
  compact = false,
  className,
}: {
  van: VanState;
  map?: React.ReactNode;
  onNotify?: () => void;
  compact?: boolean;
  className?: string;
}) {
  const grounded =
    van.status === "off_air" ||
    van.status === "off_hours" ||
    van.status === "no_run_today" ||
    van.status === "route_cancelled";

  return (
    <div
      className={cn(
        "rounded-lg border border-paper-300 bg-paper-0 p-6",
        compact && "max-w-[380px]",
        className,
      )}
    >
      {/* 1. Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-title font-sans font-semibold text-ink-800">
          Fillo Moving Bakery
        </h3>
      </div>

      {/* 2. Status pill — a state AND a time or date. */}
      <VanStatusPill
        status={van.status}
        label={van.statusLabel ?? "OFF AIR"}
        className="mt-3"
      />

      {/* 3. Hero line, then the arrival band. Never a countdown. */}
      <p className="mt-4 font-display text-display-sm text-ink-800">
        {van.headline}
      </p>
      {van.arrivalLine || van.etaBand ? (
        <p className="mt-1 text-body-sm text-ink-600">
          {van.arrivalLine ?? van.etaBand?.label}
        </p>
      ) : null}

      {/* 4. Map — a child, never the container. */}
      {van.mapFailed ? (
        <div className="mt-4 rounded-md bg-paper-200 p-4">
          <p className="flex items-start gap-2 text-body-sm text-ink-600">
            <AlertCircle
              size={16}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            We can&rsquo;t reach the van right now — here&rsquo;s today&rsquo;s
            route anyway.
          </p>
          <Button variant="ghost" size="sm" className="mt-2 -ml-3">
            Retry
          </Button>
        </div>
      ) : map ? (
        <div className="mt-4 aspect-16/10 overflow-hidden rounded-md bg-paper-100">
          {map}
        </div>
      ) : null}

      {/* 5. Route list, or the week's schedule when off air. */}
      {grounded && van.week?.length ? (
        <ul className="mt-4 divide-y divide-paper-300">
          {van.week.map((row) => (
            <li key={row.day} className="flex items-baseline gap-3 py-3">
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-pill border-[1.5px] border-paper-400"
              />
              <span className="min-w-0 flex-1 text-body text-ink-600">
                {row.day} / {row.route}
              </span>
              <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
                {row.from}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <RouteList stops={van.stops.slice(0, compact ? 3 : undefined)} className="mt-4" />
      )}

      {/* 6. One action. */}
      <div className="mt-6">
        {grounded ? (
          <Button size="md" fullWidth onClick={onNotify} icon={<Truck size={20} strokeWidth={1.5} />}>
            {van.cta ?? "Tell me when the van's out"}
          </Button>
        ) : (
          <ButtonLink href="/van" variant="ghost" size="md">
            Open full tracker →
          </ButtonLink>
        )}
      </div>

      {/* The bake strip stays meaningful when the dot has not moved. */}
      {!van.bakeStripHidden && van.bakeStrip?.length ? (
        <BakeStrip steps={van.bakeStrip} className="mt-6" />
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The reusable strip (journey §6.3)                                           */
/* -------------------------------------------------------------------------- */

export type VanStripState = "live_near_you" | "live_elsewhere" | "off_air";

/**
 * A LINK, never a modal — and never the floating element, because that slot
 * belongs to WhatsApp. Used on the home page, /order/[id] and /account.
 */
export function VanStrip({
  state,
  copy,
  href = "/van",
  onNotify,
  tone = "paper",
  className,
}: {
  state: VanStripState;
  copy: Record<string, string>;
  href?: string;
  onNotify?: () => void;
  tone?: "paper" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const live = state !== "off_air";
  const cta = state === "off_air" ? "See the week's route →" : state === "live_near_you" ? "Track it →" : "See today's route →";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-y py-4",
        dark ? "border-y-[var(--hairline-dark-color)]" : "border-y-paper-300",
        className,
      )}
    >
      <span className="relative grid size-2.5 shrink-0 place-items-center" aria-hidden="true">
        <span
          className={cn("size-2.5 rounded-pill", live ? "bg-crumb" : "bg-ink-400")}
        />
        {live ? (
          <span
            data-motion="pulse"
            className="absolute size-2.5 rounded-pill bg-crumb animate-[var(--animate-van-pulse)]"
          />
        ) : null}
      </span>

      <p className={cn("min-w-0 flex-1 text-body-sm", dark ? "text-ink-400" : "text-ink-600")}>
        {copy[state]}
      </p>

      <Link
        href={href}
        className={cn(
          "link-underline shrink-0 text-body-sm",
          dark ? "text-paper-0" : "text-ink-800",
        )}
      >
        {cta}
      </Link>

      {state === "off_air" && onNotify ? (
        <Button variant="ghost" size="sm" onClick={onNotify}>
          Tell me when it&rsquo;s out
        </Button>
      ) : null}
    </div>
  );
}

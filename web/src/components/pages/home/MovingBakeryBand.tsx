import Image from "next/image";
import Link from "next/link";
import { Kicker } from "@/components/ui/Rule";
import { RouteList, VanStrip, VanStatusPill } from "@/components/blocks/TrackerCard";
import { StatsBand } from "@/components/blocks/StatsBand";
import { getAllStops, getRoutes, getVanState } from "@/lib/mock";
import { getProducts } from "@/lib/catalog";
import { formatTimeOfDay } from "@/lib/format";

/**
 * The dark band — DESIGN.md §14.3, site-content Home §9.
 *
 * The page's one rhythm beat and the brand's unfair asset. Order of certainty
 * is preserved even here: status, then the line, then the stops as text — and
 * only then the picture. If the image never loads, the band still answers the
 * question the visitor arrived with, because everything above it is text.
 *
 * Stops, not minutes: proximity is a stop count and time is a ten-minute band.
 * Nothing here counts down.
 *
 * The band closes on the stats rather than starting a new section, and every
 * number in them is counted from the data — no "4,000+ loaves a month".
 */

const ROUTE_STILL = "/images/stock/van-and-city/bengaluru-tree-lined-road-morning.jpg";

export function MovingBakeryBand() {
  const van = getVanState();
  const routes = getRoutes();
  const stops = getAllStops();

  const live = van.status === "live" || van.status === "stale";
  const stripState = live
    ? typeof van.stopsAwayFromCustomer === "number"
      ? ("live_near_you" as const)
      : ("live_elsewhere" as const)
    : ("off_air" as const);

  const current = van.stops.find((s) => s.state === "current");
  const next = van.stops.find((s) => s.state === "upcoming");

  const marquee = [
    live ? "the van is out" : "the ovens are cold, the plan isn't",
    van.routeName?.toLowerCase(),
    current ? `${current.name.toLowerCase()} right now` : null,
    next ? `${next.name.toLowerCase()} next` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const stats = [
    { value: String(getProducts().length), caption: "Bakes on the menu" },
    { value: "100%", caption: "Eggless, every one" },
    { value: String(routes.length), caption: "Van routes" },
    { value: String(stops.length), caption: "Stops on the map" },
  ];

  return (
    <section
      data-surface="dark"
      className="relative overflow-hidden bg-ink-900 pb-[var(--section-y-lg)]"
    >
      {/* -------- The marquee, hard against the band's upper edge -------- */}
      <div className="relative overflow-hidden border-b-2 border-b-crumb py-4">
        <div
          data-motion="marquee"
          className="flex w-max animate-[var(--animate-marquee)] gap-8 whitespace-nowrap hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]"
        >
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="font-display text-display-lg text-paper-0"
            >
              {marquee} · {marquee} ·{" "}
            </span>
          ))}
        </div>
      </div>

      <div className="container-content pt-[var(--section-y)]">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          {/* -------- Columns 1–5: the claim --------------------------- */}
          <div className="lg:col-span-5">
            <Kicker tone="crumb">The moving bakery</Kicker>
            <h2 className="mt-4 text-display-md text-paper-0">
              We drive the bread to your street.
            </h2>
            <p className="mt-5 max-w-[46ch] text-body text-ink-400">
              The bakery moves. One route an afternoon, a fixed set of stops,
              and bread that was in the oven the same morning. No warehouse in
              between.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* On a dark band the primary inverts to paper-0 (§14.3). The
                  button variants are all tuned for paper, so the geometry is
                  reproduced here rather than overridden — the token set is
                  the same, only the two colours change. */}
              <Link
                href="/van"
                className="inline-flex h-13 items-center justify-center rounded-md bg-paper-0 px-6 font-sans text-body-lg font-medium tracking-[0.005em] text-ink-900 transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:bg-paper-100 active:translate-y-px"
              >
                Track the van
              </Link>
              <Link
                href={van.routeSlug ? `/van/${van.routeSlug}` : "/van"}
                className="link-underline inline-flex h-13 items-center justify-center rounded-md px-5 font-sans text-body-lg font-medium tracking-[0.005em] text-crumb"
              >
                See today&rsquo;s stops →
              </Link>
            </div>

            <VanStrip
              state={stripState}
              copy={van.strip}
              tone="dark"
              className="mt-10"
            />
          </div>

          {/* -------- Columns 7–12: the stops as text, then the picture - */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="flex flex-wrap items-center gap-3">
              <VanStatusPill
                status={van.status}
                label={van.statusLabel ?? "OFF AIR"}
              />
              <p className="text-body-sm text-ink-400">
                {van.arrivalLine ?? van.etaBand?.label}
              </p>
            </div>

            <p className="mt-5 font-display text-display-sm text-paper-0">
              {van.headline}
            </p>

            <RouteList stops={van.stops} tone="dark" className="mt-4" />

            <div className="mt-6 aspect-16/10 overflow-hidden rounded-lg bg-ink-800">
              <Image
                src={ROUTE_STILL}
                alt="A tree-lined Bengaluru street on a weekend morning"
                width={1200}
                height={750}
                sizes="(min-width: 1024px) 620px, 92vw"
                className="size-full object-cover opacity-70 grayscale-40"
              />
            </div>
            <p className="micro mt-3 text-ink-400">
              Last fix {formatTimeOfDay(van.asOf)} · refreshes every{" "}
              {van.refreshIntervalSeconds} seconds
            </p>
          </div>
        </div>

        {/* -------- The band closes on the numbers --------------------- */}
        <StatsBand
          stats={stats}
          className="mt-[var(--section-y)] border-t border-t-[var(--hairline-dark-color)] pt-4"
        />
      </div>
    </section>
  );
}

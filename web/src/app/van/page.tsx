import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle, Truck } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { BakeStrip } from "@/components/blocks/BakeStrip";
import { VanStatusPill } from "@/components/blocks/TrackerCard";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Rule";
import { LineArtBleed } from "@/components/ui/LineArt";
import { MapPanel } from "@/components/pages/van/MapPanel";
import { RouteDiagram } from "@/components/pages/van/RouteDiagram";
import { NotifyMeButton } from "@/components/pages/van/NotifyMeSheet";
import { NotifyRow } from "@/components/pages/van/NotifyRow";
import { StateSwitcher } from "@/components/pages/van/StateSwitcher";
import { StopSchedule, WeekSchedule } from "@/components/pages/van/StopSchedule";
import {
  ActivityFeed,
  OnBoardList,
  StampCardSlot,
} from "@/components/pages/van/VanModules";
import {
  runStartLabel,
  scheduleRowsForRoute,
  scheduleRowsForVan,
  shortRunDays,
} from "@/components/pages/van/schedule";
import { whatsappHref } from "@/lib/config";
import {
  getRoute,
  getRoutes,
  getVanState,
  VAN_STATES,
  type VanStatus,
} from "@/lib/mock";

const PATH = "/van";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The tracker.
 *
 * The order of the page is the order of certainty (DESIGN.md §12.17): status →
 * hero line → arrival band → bake strip → the schedule → and only then the map.
 * Everything above the map is server-rendered text, so the page still answers
 * the question a visitor arrived with when the map never arrives.
 *
 * **Off air is the default.** The van runs some days and not others, so most
 * days this is the page — it gets the best line, the notify button and the
 * full schedule, and it is never styled as an error (§13).
 *
 * `?state=` swaps the fixture for a reviewer. It is not a feature.
 */
export default async function VanPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const requested = (VAN_STATES as readonly string[]).includes(state ?? "")
    ? (state as VanStatus)
    : "off_air";

  const van = getVanState(requested);
  const route = getRoute(van.routeSlug ?? "indiranagar");
  const routes = getRoutes();

  const grounded =
    van.status === "off_air" ||
    van.status === "off_hours" ||
    van.status === "no_run_today" ||
    van.status === "route_cancelled";

  // Off air nothing has been mixed yet today, so every cell is pending and the
  // strip says when the next one starts rather than disappearing (§12.30).
  const bakeSteps = van.bakeStripHidden
    ? van.bakeStrip.map((s) => ({ ...s, done: false, at: null, atLabel: undefined }))
    : van.bakeStrip;
  const nextBakeDay = (van.week?.[0]?.day ?? "Saturday").toUpperCase();
  const firstBakeAt = van.bakeStrip[0]?.atLabel;

  // The pill always carries a state AND a time or a date (§12.16.1): live
  // states append the freshness counter the fixture supplies.
  const pillLabel =
    van.status === "live" && van.lastPingLabel
      ? `${van.statusLabel ?? "LIVE"} · ${van.lastPingLabel}`
      : (van.statusLabel ?? "OFF AIR");

  // Off route and go-dark both suppress the position, so neither may print a
  // live arrival band — the published schedule below carries the answer.
  const positionHidden = Boolean(van.positionSuppressed) || van.status === "go_dark";
  const arrivalLine = positionHidden
    ? null
    : (van.arrivalLine ?? van.etaBand?.label ?? null);

  const liveRows = scheduleRowsForVan(van.stops, route);
  const routeRows = route ? scheduleRowsForRoute(route) : [];

  const weekRows = routes.map((r) => ({
    day: shortRunDays(r.runDays),
    route: r.name,
    from: runStartLabel(r),
    href: `/van/${r.slug}`,
  }));

  const diagramStops = (grounded ? routeRows : liveRows).map((row) => ({
    id: row.id,
    name: row.name,
    state: row.state,
  }));

  const switcherVisible =
    Boolean(state) || process.env.NODE_ENV !== "production";

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "The van", path: PATH }]}
        nodes={[bakeryLd(routes.flatMap((r) => r.areas))]}
      />

      {/* 1 · Status band. The pill always carries a state AND a time or date. */}
      <Section surface="dark" size="half">
        <Kicker tone="crumb">Fillo moving bakery</Kicker>
        <div className="mt-4">
          <VanStatusPill status={van.status} label={pillLabel} />
        </div>
        <h1 className="mt-6 max-w-[18ch] font-display text-display-xl text-paper-0">
          {van.headline}
        </h1>
        {arrivalLine ? (
          <p className="mt-4 text-body-lg text-ink-400">{arrivalLine}</p>
        ) : null}
        {van.sub ? <p className="mt-1 text-body-lg text-ink-400">{van.sub}</p> : null}
        {positionHidden ? (
          <p className="mt-4 max-w-[62ch] text-body-sm text-ink-400">
            We are not publishing a position right now. Everything below —
            the stops, the bands and the cut-off — is unchanged.
          </p>
        ) : null}

        {/* 4 · Bake strip, directly under the status band, on the dark surface. */}
        <BakeStrip
          className="mt-10"
          tone="dark"
          steps={bakeSteps}
          footnote={
            van.bakeStripHidden
              ? `NEXT BAKE ${nextBakeDay}${firstBakeAt ? `, FROM ${firstBakeAt}AM` : ""}`
              : undefined
          }
        />
      </Section>

      {/* 2 · The schedule (the truth) beside the map (the feeling). */}
      <Section surface="paper-50" className="overflow-hidden">
        <LineArtBleed glyph="van" side="right" size={720} />

        <div className="relative flex flex-wrap items-center gap-4">
          {grounded ? (
            <NotifyMeButton
              label={van.cta ?? "Tell me when the van's out"}
              size="lg"
              icon={<Truck size={20} strokeWidth={1.5} />}
            />
          ) : (
            <ButtonLink href={`/van/${van.routeSlug ?? "indiranagar"}`} size="lg">
              See today&rsquo;s route
            </ButtonLink>
          )}
          <ButtonLink href="/areas" variant="secondary" size="lg">
            Check my area
          </ButtonLink>
          {route ? (
            <p className="micro basis-full text-ink-500 sm:basis-auto">
              {route.cutoffLabel}
            </p>
          ) : null}
        </div>

        <div className="relative mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Kicker>{grounded ? "The week" : "Today"}</Kicker>
            <h2 className="mt-4 font-display text-display-md text-ink-800">
              {grounded ? "Where the van goes" : "Today's route"}
            </h2>
            <p className="micro mt-3 text-ink-500">
              {grounded ? "Every dot hollow until the van rolls" : van.routeName}
            </p>

            {grounded ? (
              <>
                <WeekSchedule className="mt-8" rows={weekRows} />
                {route ? (
                  <>
                    <h3 className="micro mt-12 text-kiln">
                      {route.name} · stops in order
                    </h3>
                    <StopSchedule className="mt-2" stops={routeRows} grounded />
                  </>
                ) : null}
              </>
            ) : (
              <StopSchedule className="mt-8" stops={liveRows} />
            )}

            <p className="mt-8 max-w-[62ch] text-body-sm text-ink-600">
              The van leaves the kitchen at the time above and stays at each
              stop till the racks are empty. Proximity is a stop count, never a
              countdown.
            </p>
          </div>

          {/* 3 · The map: a progressively-enhanced child, never the container. */}
          <div className="lg:col-span-7">
            <MapPanel
              failed={Boolean(van.mapFailed)}
              caption="The map shows the van, not you. We publish where it is during a run, and nothing else."
            >
              <RouteDiagram
                stops={diagramStops}
                parked={grounded || Boolean(van.positionSuppressed)}
                label={
                  grounded
                    ? `A diagram of the ${route?.name ?? "route"}, with the van parked at the kitchen.`
                    : `A diagram of the ${van.routeName ?? "route"}, with the van at ${
                        van.currentWard ?? "its current stop"
                      }.`
                }
              />
            </MapPanel>
          </div>
        </div>
      </Section>

      {/* 7 · What's on board. */}
      <Section surface="paper-100">
        <SectionHeader
          as="h2"
          kicker={grounded ? "This week" : "On board"}
          heading={grounded ? "What we're baking" : "What's on the van"}
          lead={
            grounded
              ? "The van loads what the kitchen bakes that morning. Counts go up here once it is loaded."
              : "Counts come off the van as it sells. Sold out stays on the list, because that is the honest answer."
          }
        />
        <OnBoardList
          className="mt-10"
          items={van.onBoard}
          grounded={grounded}
          cutoffLine={grounded ? route?.cutoffLabel : undefined}
        />
      </Section>

      {/* 9 · What happened today — generated, never hand-typed. */}
      {van.activityFeed.length >= 2 ? (
        <Section surface="paper-50">
          <SectionHeader as="h2" kicker="The run" heading="What happened today" />
          <ActivityFeed className="mt-10" entries={van.activityFeed} />
        </Section>
      ) : null}

      {/* The walk-up promise — the loudest thing on the page after the status. */}
      <Section surface="dark" size="lg">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Kicker tone="crumb">No order needed</Kicker>
            <h2 className="mt-4 font-display text-display-lg text-paper-0">
              You can just walk up
            </h2>
            <p className="mt-6 max-w-[62ch] text-body-lg text-ink-400">
              If the van is at a stop you don&rsquo;t need an order. Come to the
              hatch and buy what&rsquo;s there. UPI and card both work.
              What&rsquo;s on board is what&rsquo;s on board, and the popular
              things go early.
            </p>
          </div>
          <div className="lg:col-span-5">
            <ul className="divide-y divide-[var(--hairline-dark-color)] border-y border-y-[var(--hairline-dark-color)]">
              {routes.map((r) => (
                <li key={r.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                  <Link
                    href={`/van/${r.slug}`}
                    className="link-underline min-w-0 flex-1 basis-40 text-body text-paper-0"
                  >
                    {r.name}
                  </Link>
                  <span className="shrink-0 font-mono text-caption text-ink-400 tabular">
                    {shortRunDays(r.runDays)} · from {runStartLabel(r)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 8 · Notify me, and 10 · the stamp-card slot. */}
      <Section surface="paper-50">
        <NotifyRow />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="micro text-kiln">Stamp card</h2>
            <StampCardSlot
              className="mt-6"
              slots={van.stampCard.slots}
              earned={van.stampCard.earned}
              enabled={van.stampCard.enabled}
            />
          </div>

          {/* 11 · Ask us where we are, and 12 · the footer module. */}
          <div className="lg:col-span-7">
            <h2 className="micro text-kiln">If the page isn&rsquo;t enough</h2>
            <p className="mt-6 max-w-[62ch] text-body text-ink-600">
              Ask us where we are and we will tell you. The reply will not know
              more than this page does — the same feed answers both.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink
                href={whatsappHref("Hi Fillo — where is the van right now? (from the website)")}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
                icon={<MessageCircle size={20} strokeWidth={1.5} />}
                iconPosition="leading"
              >
                Ask us where we are
              </ButtonLink>
              <ButtonLink
                href="/account/alerts"
                variant="ghost"
                size="md"
                icon={<MapPin size={20} strokeWidth={1.5} />}
                iconPosition="leading"
              >
                Manage alerts
              </ButtonLink>
            </div>
            <p className="mt-8 max-w-[62ch] text-caption text-ink-500">
              What we publish: the van&rsquo;s position snapped to its route,
              rounded to about 50 metres, and only between the first stop and the
              last. What we never publish: where it has been, or where you are.
              Seeing the van needs no login, no app and no location permission.
            </p>

            <StateSwitcher
              className="mt-10"
              states={VAN_STATES}
              current={requested}
              basePath={PATH}
              visible={switcherVisible}
            />
          </div>
        </div>
      </Section>
    </>
  );
}

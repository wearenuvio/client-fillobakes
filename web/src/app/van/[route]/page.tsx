import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { VanStrip } from "@/components/blocks/TrackerCard";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Rule";
import { MapPanel } from "@/components/pages/van/MapPanel";
import { RouteDiagram } from "@/components/pages/van/RouteDiagram";
import { NotifyMeButton } from "@/components/pages/van/NotifyMeSheet";
import { NotifyRow } from "@/components/pages/van/NotifyRow";
import { ShareRouteButton } from "@/components/pages/van/ShareRouteButton";
import { StopSchedule } from "@/components/pages/van/StopSchedule";
import { OnBoardList } from "@/components/pages/van/VanModules";
import {
  runStartLabel,
  scheduleRowsForRoute,
  scheduleRowsForVan,
  shortRunDays,
} from "@/components/pages/van/schedule";
import {
  areaSlug,
  getArea,
  getRoute,
  getRouteSlugs,
  getRoutes,
  getVanState,
  getVanStripCopy,
} from "@/lib/mock";

type Params = { params: Promise<{ route: string }> };

export function generateStaticParams() {
  return getRouteSlugs().map((route) => ({ route }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { route } = await params;
  const found = getRoute(route);
  if (!found) return buildMetadata(`/van/${route}`);
  return buildMetadata(`/van/${found.slug}`, {
    title: `${found.name} — stops and times | Fillo Bakes`,
    description: `Where the Fillo van stops on the ${found.name}: ${found.stops
      .map((s) => s.name)
      .join(", ")}. ${found.runDaysLabel}. ${found.cutoffLabel}.`,
  });
}

/**
 * A route page — the QR target on the van's glass case and on the bag.
 *
 * It has to work when the van is parked, so nothing here depends on the live
 * feed: the stops, their landmarks and their bands come from the route fixture
 * and are server-rendered. The live strip appears only when this route is the
 * one currently running, and it is a link, never a modal (journey §6.3).
 */
export default async function RoutePage({ params }: Params) {
  const { route } = await params;
  const found = getRoute(route);
  if (!found) notFound();

  const path = `/van/${found.slug}`;
  const van = getVanState("live");
  const isRunning = van.routeSlug === found.slug;

  const rows = isRunning
    ? scheduleRowsForVan(van.stops, found)
    : scheduleRowsForRoute(found);

  const diagramStops = rows.map((row) => ({
    id: row.id,
    name: row.name,
    state: row.state,
  }));

  const otherRoutes = getRoutes().filter((r) => r.slug !== found.slug);

  return (
    <>
      <JsonLd
        path={path}
        crumbs={[
          { name: "The van", path: "/van" },
          { name: found.name, path },
        ]}
        nodes={[bakeryLd(found.areas)]}
      />

      <Section surface="paper-50">
        <Kicker>The route</Kicker>
        <h1 className="mt-4 max-w-[16ch] font-display text-display-lg text-ink-800">
          {found.name}
        </h1>
        <p className="mt-4 text-body-lg text-ink-600">
          {found.runDaysLabel}, from {runStartLabel(found)}. {found.cadenceLabel}.
        </p>
        <p className="micro mt-6 text-ink-500">{found.cutoffLabel}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" size="lg">
            See this week&rsquo;s bake
          </ButtonLink>
          <NotifyMeButton
            label="Tell me when this route runs"
            size="lg"
            variant="secondary"
            stopId={found.stops[0]?.id}
            icon={<Bell size={20} strokeWidth={1.5} />}
          />
          <ShareRouteButton title={found.name} path={path} />
        </div>

        {/* The live strip — only when this route is the one out today. */}
        {isRunning ? (
          <VanStrip
            className="mt-10"
            state="live_near_you"
            copy={getVanStripCopy()}
            href="/van"
          />
        ) : (
          <p className="mt-10 border-y border-y-paper-300 py-4 text-body-sm text-ink-600">
            The van is not on this route right now. Every time below is the
            published band, not a live position.
          </p>
        )}
      </Section>

      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <SectionHeader
              as="h2"
              kicker="In order"
              heading="The stops"
              count={found.stops.length}
              meta={<p>{shortRunDays(found.runDays)}</p>}
            />
            <StopSchedule className="mt-8" stops={rows} grounded={!isRunning} />
            <p className="mt-6 max-w-[62ch] text-body-sm text-ink-600">
              Each band is when the van is at that stop, not when it leaves the
              kitchen. It stays till the racks are empty.
            </p>
          </div>

          <div className="lg:col-span-7">
            <MapPanel caption="The route, drawn. The numbers match the list — the list is the one that matters.">
              <RouteDiagram
                stops={diagramStops}
                parked={!isRunning}
                label={`A diagram of the ${found.name}, showing ${found.stops.length} stops in order.`}
              />
            </MapPanel>
          </div>
        </div>
      </Section>

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHeader
              as="h2"
              kicker="On this run"
              heading="What the van carries"
              lead="Availability differs by run. Counts appear once the van is loaded."
            />
            <OnBoardList
              className="mt-10"
              items={van.onBoard}
              grounded={!isRunning}
              cutoffLine={found.cutoffLabel}
            />
          </div>

          <div className="lg:col-span-5">
            <h2 className="micro text-kiln">Who it serves</h2>
            <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
              {found.areas.map((area) => {
                const slug = areaSlug(area);
                const known = getArea(slug);
                return (
                  <li key={area} className="flex items-baseline gap-4 py-3">
                    <span className="min-w-0 flex-1 text-body text-ink-800">
                      {known ? (
                        <Link href={`/areas/${known.slug}`} className="link-underline">
                          {area}
                        </Link>
                      ) : (
                        area
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
                      {found.stops.filter((s) => s.area === area).length} stops
                    </span>
                  </li>
                );
              })}
            </ul>

            <h2 className="micro mt-12 text-kiln">The other runs</h2>
            <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
              {otherRoutes.map((r) => (
                <li key={r.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                  <Link
                    href={`/van/${r.slug}`}
                    className="link-underline min-w-0 flex-1 basis-40 text-body text-ink-800"
                  >
                    {r.name}
                  </Link>
                  <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
                    {shortRunDays(r.runDays)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section surface="paper-100">
        <NotifyRow />
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { RouteMap } from "@/components/pages/van/RouteMap";
import { SetAreaButton } from "@/components/pages/van/SetAreaButton";
import { clockLabel, mapStopsForRoute, nextRunDayFor } from "@/components/pages/van/week";
import { getArea, getRoute, getRouteSlugs, areaSlug } from "@/lib/mock";

type Params = { params: Promise<{ route: string }> };

export function generateStaticParams() {
  return getRouteSlugs().map((route) => ({ route }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { route: slug } = await params;
  const route = getRoute(slug);
  return buildMetadata("/van", {
    title: route?.name ?? "The van",
    description: route
      ? `${route.name}: ${route.runDaysLabel.toLowerCase()}, from ${clockLabel(route.firstStopAt)}. Every stop and the band it falls in.`
      : undefined,
  });
}

/**
 * One route — PAGES-v2 "Routes".
 *
 * The map is the page. Every stop carries the landmark that makes it findable
 * from the pavement rather than from a map app, and the band it falls in;
 * pressing "Catch it here" remembers the area, the lane and the stop, then
 * opens the order drawer already knowing all three.
 *
 * There is no second copy of the stop list underneath. A visitor who has read
 * the route once should not have to read it again to act on it.
 */
export default async function RoutePage({ params }: Params) {
  const { route: slug } = await params;
  const route = getRoute(slug);
  if (!route) notFound();

  const stops = mapStopsForRoute(route);
  const nextRunDay = nextRunDayFor(route);
  const byId = new Map(route.stops.map((s) => [s.id, s]));

  return (
    <>
      <JsonLd
        path={`/van/${route.slug}`}
        crumbs={[
          { name: "The van", path: "/van" },
          { name: route.name, path: `/van/${route.slug}` },
        ]}
        nodes={[bakeryLd(route.areas)]}
      />

      <section className="bg-paper pt-8 pb-10 lg:pt-10 lg:pb-14">
        <div className="container-content">
          <Link
            href="/van"
            className="link-underline inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent"
          >
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            The van
          </Link>

          <p className="mt-8 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
            {route.cadenceLabel}
          </p>
          <h1 className="mt-3 text-display-2 text-ink">{route.name}</h1>
          <p className="mt-5 max-w-[48ch] text-body-lg text-ink-2">
            {route.runDaysLabel}, from {clockLabel(route.firstStopAt)}. It stays at
            each stop until the racks are empty.
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-muted">
            <span>{route.cutoffLabel}.</span>
            <span aria-hidden="true">·</span>
            <span>
              Serves{" "}
              {route.areas.map((area, i) => {
                // Only the neighbourhoods with a page of their own become
                // links; the rest are named in plain text rather than sent to
                // a 404.
                const hasPage = Boolean(getArea(areaSlug(area)));
                return (
                  <span key={area}>
                    {i > 0 ? (i === route.areas.length - 1 ? " and " : ", ") : ""}
                    {hasPage ? (
                      <Link
                        href={`/areas/${areaSlug(area)}`}
                        className="link-underline text-ink-2"
                      >
                        {area}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{area}</span>
                    )}
                  </span>
                );
              })}
            </span>
          </p>
        </div>
      </section>

      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-content">
          <div className="max-w-[var(--max-narrow)]">
            <RouteMap
              stops={stops}
              parked
              routeName={route.name}
              rowHeight={190}
              renderAction={(stop) => {
                const detail = byId.get(stop.id);
                if (!detail) return null;
                const area = getArea(detail.area);
                return (
                  <SetAreaButton
                    area={detail.area}
                    status={area?.serviceability === "not_yet" ? "out_of_area" : "served"}
                    lane="catch_the_van"
                    stopId={detail.id}
                    variant="secondary"
                    size="md"
                  >
                    Catch it here
                  </SetAreaButton>
                );
              }}
            />

            <p className="mt-6 max-w-[52ch] text-body-sm text-muted">
              You do not need an order to buy from the hatch — walk up and take
              what is on board. Ordering ahead is how you make sure it is still
              there when the van reaches you on {nextRunDay}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

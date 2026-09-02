import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Truck } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Rule";
import { AreaCheckPanel } from "@/components/pages/van/AreaCheckPanel";
import { runStartLabel, shortRunDays } from "@/components/pages/van/schedule";
import { getAreas, getRoute, getRoutes, type Area } from "@/lib/mock";

const PATH = "/areas";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * The serviceability index.
 *
 * A van's out-of-area lookup is not a lost customer — it is route-planning
 * data, so every area gets a page whatever the answer is, and the three
 * answers are laid out as three groups rather than one list with failures in
 * it (site-content, "/areas/[area]").
 */
export default function AreasPage() {
  const areas = getAreas();
  const routes = getRoutes();

  const served = areas.filter((a) => a.serviceability === "served");
  const vanOnly = areas.filter((a) => a.serviceability === "catch_van_only");
  const notYet = areas.filter((a) => a.serviceability === "not_yet");

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Areas", path: PATH }]}
        nodes={[bakeryLd(areas.filter((a) => a.serviceability !== "not_yet").map((a) => a.name))]}
      />

      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Kicker>Serviceability</Kicker>
            <h1 className="mt-4 max-w-[14ch] font-display text-display-lg text-ink-800">
              Where we go
            </h1>
            <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
              A van has a route, not a radius. Put your area in and you get the
              real answer — the run day, the stop, and what delivery costs — before
              you fill a box.
            </p>
            <p className="mt-4 max-w-[62ch] text-body-sm text-ink-500">
              Not on the list is not a no. We add stops where enough people ask.
            </p>
          </div>

          <div className="lg:col-span-5">
            <AreaCheckPanel />
          </div>
        </div>
      </Section>

      <Section surface="paper-100">
        <SectionHeader
          as="h2"
          kicker="Both lanes"
          heading="Van and delivery"
          count={served.length}
          lead="Catch the van at a stop, free, or have it brought to your door in a two-hour window."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {served.map((area) => (
            <AreaCard key={area.slug} area={area} />
          ))}
        </ul>
      </Section>

      {vanOnly.length > 0 ? (
        <Section surface="paper-50">
          <SectionHeader
            as="h2"
            kicker="Van only"
            heading="Catch it at a stop"
            count={vanOnly.length}
            lead="We stop here but we don't bring it to doors yet. Meeting the van costs nothing, which makes this the cheaper lane, not the lesser one."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vanOnly.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </ul>
        </Section>
      ) : null}

      {notYet.length > 0 ? (
        <Section surface="paper-100">
          <SectionHeader
            as="h2"
            kicker="Not yet"
            heading="Where we're asked for"
            count={notYet.length}
            lead="We plan routes by demand. Tell us you're there and you move the map."
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notYet.map((area) => (
              <AreaCard key={area.slug} area={area} />
            ))}
          </ul>
        </Section>
      ) : null}

      <Section surface="paper-50">
        <SectionHeader
          as="h2"
          kicker="The runs"
          heading="Four routes"
          lead="Each area sits on one route, and the route decides the day."
        />
        <ul className="mt-10 divide-y divide-paper-300 border-y border-y-paper-300">
          {routes.map((route) => (
            <li
              key={route.id}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-2 py-5"
            >
              <Link
                href={`/van/${route.slug}`}
                className="link-underline basis-full text-title font-sans font-semibold text-ink-800 sm:basis-64"
              >
                {route.name}
              </Link>
              <span className="min-w-0 flex-1 text-body-sm text-ink-600">
                {route.areas.join(" · ")}
              </span>
              <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
                {shortRunDays(route.runDays)} · from {runStartLabel(route)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/van" variant="secondary" size="md">
            Where the van is now
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}

function AreaCard({ area }: { area: Area }) {
  const route = area.routeId ? getRoute(area.routeId) : undefined;
  const notYet = area.serviceability === "not_yet";
  const vanOnly = area.serviceability === "catch_van_only";

  return (
    <li className="flex flex-col rounded-md border border-paper-300 bg-paper-0 p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-title font-sans font-semibold text-ink-800">
          <Link href={`/areas/${area.slug}`} className="link-underline">
            {area.name}
          </Link>
        </h3>
        {notYet ? (
          <Badge variant="outline">Waitlist</Badge>
        ) : vanOnly ? (
          <Badge variant="tint">Van only</Badge>
        ) : (
          <Badge variant="success">Both lanes</Badge>
        )}
      </div>

      <p className="mt-3 min-h-[3.5rem] text-body-sm text-ink-600">{area.answer}</p>

      <dl className="mt-4 space-y-1">
        {route ? (
          <div className="flex items-baseline gap-2">
            <dt className="micro shrink-0 text-ink-500">Run</dt>
            <dd className="font-mono text-caption text-ink-800 tabular">
              {shortRunDays(route.runDays)} · from {runStartLabel(route)}
            </dd>
          </div>
        ) : null}
        {area.deliveryFee !== null ? (
          <div className="flex items-baseline gap-2">
            <dt className="micro shrink-0 text-ink-500">Delivery</dt>
            <dd className="font-mono text-caption text-ink-800 tabular">
              ₹{area.deliveryFee}
              {area.freeOver ? `, free over ₹${area.freeOver}` : ""}
            </dd>
          </div>
        ) : null}
        <div className="flex items-baseline gap-2">
          <dt className="micro shrink-0 text-ink-500">Pincode</dt>
          <dd className="font-mono text-caption text-ink-800 tabular">{area.pincode}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center gap-2 text-body-sm">
        {notYet ? (
          <MapPin size={16} strokeWidth={1.5} aria-hidden="true" className="text-ink-500" />
        ) : (
          <Truck size={16} strokeWidth={1.5} aria-hidden="true" className="text-ink-600" />
        )}
        <Link href={`/areas/${area.slug}`} className="link-underline text-ink-700">
          {notYet ? `Add my street in ${area.name}` : `What we do in ${area.name}`}
        </Link>
      </div>
    </li>
  );
}

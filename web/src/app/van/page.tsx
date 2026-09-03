import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { RouteMap } from "@/components/pages/van/RouteMap";
import { VanStatusCard, BakeRibbon } from "@/components/pages/van/VanStatusCard";
import { WeekStrip } from "@/components/pages/van/WeekStrip";
import { NotifyWhatsApp } from "@/components/pages/van/NotifyWhatsApp";
import { StateSwitcher } from "@/components/pages/van/StateSwitcher";
import {
  buildWeek,
  mapStopsForRoute,
  mapStopsForVan,
  nextRunDayFor,
} from "@/components/pages/van/week";
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
 * The van — PAGES-v2 "The Van".
 *
 * The page answers one question, in this order: is it out, where is it, and
 * when is it near me. Everything is server-rendered text and an inline SVG, so
 * the answer survives a bad connection; nothing on the page is a countdown,
 * because proximity here is a count of stops and time is a band that widens in
 * traffic.
 *
 * Off air keeps the identical card, the identical size and the identical
 * weight. The van rests more days than it runs, and a resting van is not an
 * error state.
 *
 * `?state=` swaps the fixture for a reviewer. It is not a feature, and the
 * switcher only draws when the parameter is already there or in development.
 */

/** Variants where nothing has left the kitchen: no marker, no bake strip. */
const GROUNDED = new Set<VanStatus>([
  "off_air",
  "off_hours",
  "no_run_today",
  "route_cancelled",
]);

/** Variants where the van is out but we deliberately publish no position. */
const SUPPRESSED = new Set<VanStatus>(["go_dark", "off_route"]);

const PILL: Partial<Record<VanStatus, string>> = {
  live: "Live",
  map_failed: "Live",
  off_route: "Live",
  stale: "Last seen 4:32",
  go_dark: "Off the map",
  off_air: "Off air",
  no_run_today: "Off air",
  route_cancelled: "Off air",
  off_hours: "Resting",
};

const NOTE: Partial<Record<VanStatus, string>> = {
  stale: "The last fix came in a couple of minutes ago. The stops and bands below are unchanged.",
  go_dark: "We are not publishing a position right now. The stops and bands below are unchanged.",
  off_route:
    "The van is between stops, so there is no position to publish. The stops and bands below are unchanged.",
};

export default async function VanPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const requested: VanStatus = (VAN_STATES as readonly string[]).includes(state ?? "")
    ? (state as VanStatus)
    : "live";

  const van = getVanState(requested);
  const routes = getRoutes();
  const route = getRoute(van.routeSlug ?? "indiranagar");

  const grounded = GROUNDED.has(requested);
  const suppressed = SUPPRESSED.has(requested);
  const tone = grounded || requested === "go_dark" ? "resting" : requested === "stale" ? "stale" : "live";

  // A freshness reading only means something where a position is published.
  const updatedLabel =
    !grounded && !suppressed && requested !== "stale" && van.lastPingSecondsAgo
      ? `Updated ${van.lastPingSecondsAgo}s ago`
      : null;

  // PAGES-v2 prints three marks and the road. The fixture also carries a
  // "proofed" stamp timed after the bake, which cannot be true of one batch,
  // so it is left out rather than printed as a contradiction.
  const marks = ["mixed", "baked", "loading"]
    .map((step) => van.bakeStrip.find((s) => s.step === step))
    .filter((s): s is NonNullable<typeof s> => Boolean(s?.at))
    .map((s) => ({ label: s.label, at: s.atLabel ?? null }));

  const mapStops = grounded
    ? route
      ? mapStopsForRoute(route)
      : []
    : mapStopsForVan(van.stops, route);

  const week = buildWeek();
  const nextRunDay = nextRunDayFor(route);
  const switcherVisible = Boolean(state) || process.env.NODE_ENV !== "production";

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "The van", path: PATH }]}
        nodes={[bakeryLd(routes.flatMap((r) => r.areas))]}
      />

      {/* -------- Hero ------------------------------------------------- */}
      <section className="bg-paper pt-12 pb-10 lg:pt-16 lg:pb-14">
        <div className="container-content">
          <p className="script">Bread that comes to your street.</p>
          <h1 className="mt-2 text-display-2 text-ink">The van</h1>
          <p className="mt-5 max-w-[48ch] text-body-lg text-ink-2">
            Every morning we bake, then drive fixed routes across Bengaluru.
            Catch it at a stop, or track it to your door.
          </p>
        </div>
      </section>

      {/* -------- Where it is right now -------------------------------- */}
      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-content">
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
            <div className="flex flex-col gap-4">
              <VanStatusCard
                tone={tone}
                statusLabel={PILL[requested] ?? "Off air"}
                updatedLabel={updatedLabel}
                headline={van.headline}
                arrivalLine={
                  grounded || suppressed
                    ? (van.arrivalLine ?? null)
                    : requested === "stale"
                      ? null
                      : (van.etaBand?.label ?? null)
                }
                sub={van.sub ?? null}
                note={NOTE[requested] ?? null}
                footer={
                  route ? (
                    <ButtonLink
                      href={`/van/${route.slug}`}
                      variant="ghost"
                      size="md"
                      icon={<ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />}
                    >
                      See every stop on {route.name.replace(/^The /, "the ")}
                    </ButtonLink>
                  ) : null
                }
              />

              {!grounded && marks.length > 0 ? (
                <BakeRibbon marks={[...marks, { label: "On the road", at: null }]} />
              ) : null}
            </div>

            <RouteMap
              stops={mapStops}
              parked={grounded || suppressed}
              routeName={route?.name}
            />
          </div>
        </div>
      </section>

      {/* -------- The week --------------------------------------------- */}
      <section
        data-reveal
        className="border-y border-line bg-paper-2 py-[var(--section-y)]"
      >
        <div className="container-content">
          <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
            The next seven days
          </p>
          <h2 className="mt-3 max-w-[18ch] text-h2 text-ink">
            Where the van will be.
          </h2>
          <WeekStrip days={week} className="mt-9" />
        </div>
      </section>

      {/* -------- The one nudge ---------------------------------------- */}
      <section data-reveal className="bg-paper py-[var(--section-y)]">
        <div className="container-content">
          <NotifyWhatsApp confirmSuffix={`on ${nextRunDay}`} />

          <StateSwitcher
            className="mt-14"
            states={VAN_STATES}
            current={requested}
            basePath={PATH}
            visible={switcherVisible}
          />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, Truck } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd, faqLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Rule";
import { Faq } from "@/components/blocks/Faq";
import { AreaCtaButton, WaitlistCapture } from "@/components/pages/van/AreaCta";
import { AreaLanePicker } from "@/components/pages/van/AreaCheckPanel";
import { AreaVanPanel } from "@/components/pages/van/AreaVanPanel";
import { MapPanel } from "@/components/pages/van/MapPanel";
import { RouteDiagram } from "@/components/pages/van/RouteDiagram";
import { NotifyRow } from "@/components/pages/van/NotifyRow";
import { StopSchedule } from "@/components/pages/van/StopSchedule";
import { OnBoardList } from "@/components/pages/van/VanModules";
import {
  runStartLabel,
  scheduleRowsForRoute,
  shortRunDays,
} from "@/components/pages/van/schedule";
import { formatTimeBand } from "@/lib/format";
import {
  getArea,
  getAreaSlugs,
  getAreas,
  getRoute,
  getVanState,
  type Area,
} from "@/lib/mock";

type Params = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return getAreaSlugs().map((area) => ({ area }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { area } = await params;
  const found = getArea(area);
  if (!found) return buildMetadata(`/areas/${area}`);
  return buildMetadata(`/areas/${found.slug}`, {
    title: `Japanese milk bread in ${found.name} | Fillo Bakes`,
    description: `${found.answer} ${
      found.serviceability === "served"
        ? `Home delivery ₹${found.deliveryFee}, free over ₹${found.freeOver}. Order by 8pm the evening before.`
        : found.serviceability === "catch_van_only"
          ? "Catch the van at a stop nearby — no fee, ever."
          : "Tell us you're there and we'll come sooner."
    }`,
  });
}

/**
 * A serviceability landing page — the only realistic local-SEO lane this
 * business has, and the answer to a question the old site never asked.
 *
 * The answer comes first, in one sentence, above everything else. Then the
 * stop or the window, the cut-off, the menu and one action. "Not yet" is a
 * waitlist with a public position count, never a sorry and never a dead end
 * (site-content, "The three states").
 */
export default async function AreaPage({ params }: Params) {
  const { area } = await params;
  const found = getArea(area);
  if (!found) notFound();

  const path = `/areas/${found.slug}`;
  const route = found.routeId ? getRoute(found.routeId) : undefined;
  const notYet = found.serviceability === "not_yet";
  const vanOnly = found.serviceability === "catch_van_only";

  const stopsHere = (route?.stops ?? []).filter((s) => s.area === found.name);
  const stopRows = route
    ? scheduleRowsForRoute(route).filter((row) =>
        stopsHere.length > 0 ? stopsHere.some((s) => s.id === row.id) : true,
      )
    : [];

  const live = getVanState("live");
  const isRunning = route ? live.routeId === route.id : false;
  const van = getVanState(isRunning ? "live" : "off_air");
  const diagramStops = route
    ? scheduleRowsForRoute(route).map((r) => ({
        id: r.id,
        name: r.name,
        state: isRunning
          ? (van.stops.find((s) => s.id === r.id)?.state ?? "upcoming")
          : ("upcoming" as const),
      }))
    : [];

  const windows = found.windows.map((w) => formatTimeBand(w));

  const siblings = getAreas().filter(
    (a) => a.slug !== found.slug && a.routeId === found.routeId && found.routeId,
  );
  const elsewhere = getAreas().filter(
    (a) => a.slug !== found.slug && a.serviceability !== "not_yet",
  );

  const faqItems = buildFaq(found, route ? shortRunDays(route.runDays) : null, windows);

  return (
    <>
      <JsonLd
        path={path}
        crumbs={[
          { name: "Areas", path: "/areas" },
          { name: found.name, path },
        ]}
        nodes={[bakeryLd([found.name]), faqLd(faqItems)]}
      />

      {/* 1 and 2 · The H1, then the answer immediately. */}
      <Section surface="paper-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Kicker>{found.name} · Bengaluru {found.pincode}</Kicker>
            <h1 className="mt-4 max-w-[16ch] font-display text-display-lg text-ink-800">
              Japanese milk bread in {found.name}
            </h1>

            <p
              className={`mt-8 flex items-start gap-3 rounded-md p-4 text-body-lg ${
                notYet ? "bg-paper-100" : vanOnly ? "bg-paper-200" : "bg-success-tint"
              }`}
            >
              {notYet ? (
                <MapPin
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 text-ink-500"
                />
              ) : vanOnly ? (
                <Truck
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 text-ink-800"
                />
              ) : (
                <Check
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mt-1.5 shrink-0 text-success"
                />
              )}
              <span className="text-ink-800">{found.answer}</span>
            </p>

            {!notYet && route ? (
              <>
                <p className="mt-4 text-body text-ink-600">
                  {found.deliveryFee !== null
                    ? `Home delivery is ₹${found.deliveryFee}, free over ₹${found.freeOver}. Catching the van is free.`
                    : "Catching the van is free. We don't bring it to doors here yet."}
                </p>
                <p className="micro mt-6 text-ink-500">{route.cutoffLabel}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <AreaCtaButton
                    area={found.name}
                    lane={found.lanes.includes("home_delivery") ? "home_delivery" : "catch_the_van"}
                    stopId={stopsHere[0]?.id ?? null}
                    label={`Order for ${found.name}`}
                  />
                  <ButtonLink href={`/van/${route.slug}`} variant="secondary" size="lg">
                    See the full route
                  </ButtonLink>
                </div>
              </>
            ) : null}
          </div>

          {/* The tracker widget: text first, map handed in as a child. */}
          {route ? (
            <div className="lg:col-span-5">
              {isRunning ? (
                // The van is on this route right now, so the widget can answer
                // "where is it" — text first, the map handed in as a child.
                <AreaVanPanel
                  van={van}
                  stops={diagramStops}
                  parked={false}
                  stopId={stopsHere[0]?.id ?? null}
                  label={`A diagram of the ${route.name}, with the van on its way through ${found.name}.`}
                />
              ) : (
                <>
                  <p className="micro text-ink-500">Next run</p>
                  <p className="mt-2 font-display text-display-sm text-ink-800">
                    {found.nextRunLabel ?? route.runDaysLabel}
                  </p>
                  <p className="mt-2 text-body-sm text-ink-600">
                    {route.name} · {route.runDaysLabel}, from {runStartLabel(route)}.
                  </p>
                  <MapPanel
                    className="mt-6"
                    caption="The route, drawn. The numbers match the stops listed below."
                  >
                    <RouteDiagram
                      stops={diagramStops}
                      parked
                      label={`A diagram of the ${route.name}, with ${route.stops.length} stops in order.`}
                    />
                  </MapPanel>
                </>
              )}
            </div>
          ) : null}
        </div>
      </Section>

      {/* 3 · The stop, or the window. */}
      {!notYet && route ? (
        <Section surface="paper-100">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <SectionHeader
                as="h2"
                kicker="Where to meet it"
                heading={
                  stopRows.length === 1 ? "The stop" : `Stops in ${found.name}`
                }
                meta={<p>{route.name}</p>}
              />
              <StopSchedule className="mt-8" stops={stopRows} grounded={!isRunning} />
              {found.laneNote ? (
                <p className="mt-6 max-w-[62ch] text-body-sm text-ink-600">
                  Home delivery doesn&rsquo;t reach {found.name} yet. Catch the van
                  instead — it&rsquo;s free.
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-5">
              <h2 className="micro text-kiln">Your two lanes</h2>
              <AreaLanePicker
                className="mt-6"
                area={found.name}
                lanes={found.lanes}
                stopId={stopsHere[0]?.id ?? null}
                detail={{
                  catch_the_van: `${shortRunDays(route.runDays)} · ${
                    stopsHere[0]?.name ?? route.stops[0]?.name
                  } · from ${runStartLabel(route)}`,
                  home_delivery: windows.length
                    ? `${shortRunDays(route.runDays)} · ${found.name} · ${windows[0]}`
                    : `${shortRunDays(route.runDays)} · ${found.name}`,
                }}
              />

              {windows.length > 0 ? (
                <>
                  <h3 className="micro mt-10 text-ink-500">Delivery windows</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {windows.map((w) => (
                      <li key={w}>
                        <Badge variant="outline" tabular>
                          {w}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {found.nextRunLabel ? (
                <p className="mt-8 text-body-sm text-ink-600">
                  Next run: {found.nextRunLabel}.
                </p>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {/* The waitlist — a lane, not an error. */}
      {notYet ? (
        <Section surface="paper-100">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <WaitlistCapture
                area={found.name}
                requests={found.waitlist?.requests ?? null}
                position={found.waitlist?.position ?? null}
                thresholdTbc={Boolean(found.waitlist?.thresholdTbc)}
              />
              <p className="mt-6 max-w-[62ch] text-body-sm text-ink-600">
                We plan routes by demand, so the count above is the whole
                mechanism — not a marketing number. The founders drive by it.
              </p>
            </div>
            <div className="lg:col-span-5">
              <h2 className="micro text-kiln">Where the van does go</h2>
              <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
                {elsewhere.map((a) => (
                  <li key={a.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                    <Link
                      href={`/areas/${a.slug}`}
                      className="link-underline min-w-0 flex-1 basis-32 text-body text-ink-800"
                    >
                      {a.name}
                    </Link>
                    <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
                      {a.runDaysLabel ? shortRunDaysFromLabel(a) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/van" variant="secondary" size="md">
                  See this week&rsquo;s runs
                </ButtonLink>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {/* 5 · This week's menu for this route. */}
      {!notYet ? (
        <Section surface="paper-50">
          <SectionHeader
            as="h2"
            kicker="This week"
            heading={`What comes to ${found.name}`}
            lead="The van loads what the kitchen bakes that morning. Sold out stays on the list."
          />
          <OnBoardList
            className="mt-10"
            items={live.onBoard}
            grounded={!isRunning}
            cutoffLine={route?.cutoffLabel}
          />
          <div className="mt-10">
            <ButtonLink href="/shop" size="md">
              See this week&rsquo;s bake
            </ButtonLink>
          </div>
        </Section>
      ) : null}

      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHeader as="h2" kicker="Asked here" heading={`${found.name} questions`} />
            <Faq className="mt-8" items={faqItems} />
          </div>

          {/* 8 · The other areas on this route — what makes the cluster work. */}
          <div className="lg:col-span-5">
            <h2 className="micro text-kiln">
              {siblings.length > 0 ? "Also on this route" : "Other areas"}
            </h2>
            <ul className="mt-6 divide-y divide-paper-300 border-y border-y-paper-300">
              {(siblings.length > 0 ? siblings : elsewhere).map((a) => (
                <li key={a.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                  <Link
                    href={`/areas/${a.slug}`}
                    className="link-underline min-w-0 flex-1 basis-32 text-body text-ink-800"
                  >
                    {a.name}
                  </Link>
                  <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
                    {a.pincode}
                  </span>
                </li>
              ))}
            </ul>
            {route ? (
              <div className="mt-8">
                <ButtonLink href={`/van/${route.slug}`} variant="ghost" size="md">
                  {route.name} →
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      <Section surface="paper-50">
        <NotifyRow area={found.name} />
      </Section>
    </>
  );
}

/** The run-day summary for a sibling area, without re-deriving its route. */
function shortRunDaysFromLabel(area: Area): string {
  const route = area.routeId ? getRoute(area.routeId) : undefined;
  return route ? shortRunDays(route.runDays) : "—";
}

/** Every answer is derived from the fixture — nothing here is written twice. */
function buildFaq(
  area: Area,
  runDays: string | null,
  windows: string[],
): { question: string; answer: string }[] {
  if (area.serviceability === "not_yet") {
    return [
      {
        question: `Do you deliver to ${area.name}?`,
        answer: `Not yet. The van hasn't reached ${area.name}. We add stops where enough people ask, so the waitlist above is the fastest way to change that.`,
      },
      {
        question: "How do you decide where to go next?",
        answer:
          "By demand. Every request is counted against the area, and when an area has enough of them it becomes a run. The founders have not fixed the threshold yet.",
      },
      {
        question: "Can I still buy bread?",
        answer:
          "Yes, at any stop on any route. You do not need an order to buy at the hatch — walk up and buy what is on board.",
      },
    ];
  }

  const lanes =
    area.deliveryFee !== null
      ? `Both: catch the van at a stop for free, or home delivery for ₹${area.deliveryFee}, free over ₹${area.freeOver}.`
      : "Catch the van at a stop. It is free, and we do not bring it to doors here yet.";

  return [
    {
      question: `Do you deliver to ${area.name}?`,
      answer: `${area.answer} ${lanes}`,
    },
    {
      question: `When does the van come to ${area.name}?`,
      answer: `${area.runDaysLabel ?? runDays ?? "On its route days"}.${
        windows.length ? ` Delivery windows are ${windows.join(", ")}.` : ""
      } The van stays at a stop until the racks are empty.`,
    },
    {
      question: "When do orders close?",
      answer:
        "8pm the evening before a run. After that the dough is in and the van is loaded to the order list.",
    },
  ];
}

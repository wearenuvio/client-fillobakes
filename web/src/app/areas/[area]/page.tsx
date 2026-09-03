import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { NotifyWhatsApp } from "@/components/pages/van/NotifyWhatsApp";
import { SetAreaButton } from "@/components/pages/van/SetAreaButton";
import { clockLabel, nextRunDayFor, windowLabel } from "@/components/pages/van/week";
import { getArea, getAreaSlugs, getLane, getRoute } from "@/lib/mock";

type Params = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return getAreaSlugs().map((area) => ({ area }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { area: slug } = await params;
  const area = getArea(slug);
  return buildMetadata("/areas", {
    title: area ? `Bread delivery in ${area.name}` : "Areas",
    description: area?.answer,
  });
}

/**
 * One area — PAGES-v2 "Areas".
 *
 * Somebody arrives here from a search having typed their own neighbourhood, so
 * the page asks their question back at them and answers it in the first line.
 * Everything after that exists to make the yes actionable, or to make the not
 * yet worth waiting through.
 *
 * The one button remembers the area and the lane before it opens the order
 * drawer, so the answer is never re-asked in the cart.
 */
export default async function AreaPage({ params }: Params) {
  const { area: slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const route = area.routeId ? getRoute(area.routeId) : undefined;
  const served = area.serviceability === "served";
  const vanOnly = area.serviceability === "catch_van_only";
  const notYet = area.serviceability === "not_yet";

  const nextRunDay = route ? nextRunDayFor(route) : null;
  const stopsHere = (route?.stops ?? []).filter((s) => s.area === area.name);
  const vanLane = getLane("catch_the_van");
  const deliveryLane = getLane("home_delivery");

  return (
    <>
      <JsonLd
        path={`/areas/${area.slug}`}
        crumbs={[
          { name: "Areas", path: "/areas" },
          { name: area.name, path: `/areas/${area.slug}` },
        ]}
        nodes={[bakeryLd([area.name])]}
      />

      <PageHeader
        title={`Do we reach ${area.name}?`}
        art="wheat-stalk"
        artSize="sm"
        back={{ href: "/areas", label: "All areas" }}
      />

      {/* -------- The answer, and the one thing to do about it ---------- */}
      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-content">
          <div className="max-w-[var(--max-narrow)] rounded-xl border border-line bg-card p-6 sm:p-9">
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              {notYet ? "Not yet" : vanOnly ? "The van only" : "Yes"}
            </p>
            <p className="mt-3 max-w-[24ch] font-display text-[clamp(26px,4.4vw,36px)] leading-[1.08] text-ink">
              {area.answer}
            </p>

            {notYet ? (
              <p className="mt-5 max-w-[52ch] text-body text-ink-2">
                {area.waitlist
                  ? `${area.waitlist.requests} people here have asked for it. We add a neighbourhood once enough of them have.`
                  : "We add a neighbourhood once enough people here have asked for it."}
              </p>
            ) : (
              <>
                <dl className="mt-8 grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
                  <div>
                    <dt className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                      Run days
                    </dt>
                    <dd className="mt-1.5 text-body text-ink">
                      {area.runDaysLabel}
                      {route ? `, from ${clockLabel(route.firstStopAt)}` : ""}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                      Catch the van
                    </dt>
                    <dd className="mt-1.5 text-body text-ink">
                      {vanLane?.priceLabel ?? "Free"} · we hold your order on board
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                      Home delivery
                    </dt>
                    <dd className="mt-1.5 text-body text-ink">
                      {vanOnly
                        ? "Not here yet"
                        : `${deliveryLane?.priceLabel ?? "₹49"} · free over ₹${deliveryLane?.freeOver ?? 499}`}
                    </dd>
                  </div>

                  {!vanOnly && area.windows.length > 0 ? (
                    <div>
                      <dt className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                        Windows
                      </dt>
                      <dd className="mt-1.5 text-body text-ink">
                        {area.windows.map(windowLabel).join(", ")}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-9">
                  <SetAreaButton
                    area={area.name}
                    status={served ? "served" : "no_run"}
                    lane={served ? "home_delivery" : "catch_the_van"}
                    size="lg"
                  >
                    Order for {nextRunDay ?? "the next run"}
                  </SetAreaButton>
                  <p className="mt-3 text-body-sm text-muted">
                    {route?.cutoffLabel ?? "Order by 8pm the evening before a run"}.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* -------- Where it actually stops ------------------------------- */}
      {stopsHere.length > 0 && route ? (
        <section
          data-reveal
          className="border-y border-line bg-paper-2 py-[var(--section-y)]"
        >
          <div className="container-content">
            <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              {route.name}
            </p>
            <h2 className="mt-3 max-w-[18ch] text-h2 text-ink">
              Where it pulls up in {area.name}.
            </h2>

            <ul className="mt-8 max-w-[var(--max-narrow)] divide-y divide-line border-y border-line">
              {stopsHere.map((stop) => (
                <li
                  key={stop.id}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="min-w-0">
                    <span className="block font-display text-[21px] leading-tight text-ink">
                      {stop.name}
                    </span>
                    <span className="mt-0.5 block text-body-sm text-muted">
                      {stop.descriptor}
                    </span>
                  </span>
                  <span className="shrink-0 text-body-sm text-ink-2 tabular">
                    {stop.bandLabel}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={`/van/${route.slug}`}
              className="link-underline mt-6 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent"
            >
              See the whole route
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      {/* -------- Not yet: the only thing left to do -------------------- */}
      {notYet ? (
        <section data-reveal className="bg-paper pb-[var(--section-y)]">
          <div className="container-content">
            <NotifyWhatsApp
              className="max-w-[var(--max-narrow)]"
              heading={`We will tell you the week we reach ${area.name}.`}
              body="One WhatsApp, once, when the route opens. Nothing before that."
              cta="Tell me"
              confirmSuffix={`the week we reach ${area.name}`}
            />
          </div>
        </section>
      ) : null}
    </>
  );
}

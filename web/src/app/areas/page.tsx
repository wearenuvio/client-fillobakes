import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { getAreas } from "@/lib/mock";

const PATH = "/areas";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Where we reach — PAGES-v2 "Areas".
 *
 * Six tiles and nothing else. The not-yet areas keep their place in the grid
 * at full size and full contrast: an area we have not reached is a waiting
 * list, not a failure, and hiding it would only send the visitor to a search
 * box to find out the same thing.
 */
export default function AreasPage() {
  const areas = getAreas();

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Areas", path: PATH }]}
        nodes={[bakeryLd(areas.map((a) => a.name))]}
      />

      <PageHeader
        script="Do we reach you?"
        title="Where we go"
        lede="Six neighbourhoods so far. Pick yours to see the days, the stops and what a delivery costs."
        art="wheat-stalk"
        artSize="sm"
      />

      <section className="bg-paper pb-[var(--section-y)]">
        <div className="container-content">
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {areas.map((area) => {
              const soon = area.serviceability === "not_yet";
              // Van-only areas must not claim a delivery lane they do not have.
              const vanOnly = area.serviceability === "catch_van_only";
              return (
                <li key={area.slug}>
                  <Link
                    href={`/areas/${area.slug}`}
                    className={cn(
                      "group flex h-full flex-col rounded-lg border border-line bg-card p-5 lg:p-6",
                      "transition-[box-shadow,transform] duration-[var(--dur-base)]",
                      "ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:shadow-lift",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[12px] font-medium tracking-[0.12em] uppercase",
                        soon ? "text-muted" : "text-accent",
                      )}
                    >
                      {soon
                        ? "On the list"
                        : vanOnly
                          ? "The van stops here"
                          : "We deliver"}
                    </span>

                    <span className="mt-2 font-display text-[22px] leading-tight text-ink lg:text-[26px]">
                      {area.name}
                    </span>

                    <span className="mt-1.5 text-body-sm text-ink-2">
                      {soon ? "Not yet on a route" : area.runDaysLabel}
                    </span>

                    <span className="mt-auto flex items-center gap-2 pt-6 text-body-sm font-semibold text-accent">
                      {soon ? "Join the list" : "See the days"}
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5 motion-reduce:transform-none"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

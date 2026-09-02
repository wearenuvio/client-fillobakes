"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { resolveAreaQuery, getAreas } from "@/lib/mock";
import { useSessionStore } from "@/store/session";
import type { ProductImage } from "@/lib/images";

/**
 * The dark band — DESIGN-v2 §3.7. The page's only dark surface.
 *
 * Chocolate full-bleed, two cutouts floating off the left and right edges, one
 * display-2 line, one sentence, and the area check inline. The answer is a
 * single sentence in the band, never a modal and never a new section.
 */

type Result =
  | { kind: "served"; text: string }
  | { kind: "van-only"; text: string }
  | { kind: "not-yet"; text: string };

export function HomeVanBand({
  leftCutout,
  rightCutout,
}: {
  leftCutout: ProductImage | null;
  rightCutout: ProductImage | null;
}) {
  const [query, setQuery] = React.useState("");
  const [result, setResult] = React.useState<Result | null>(null);
  const setArea = useSessionStore((s) => s.setArea);
  const listId = React.useId();

  function check(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    const area = resolveAreaQuery(value);
    if (!area || area.serviceability === "not_yet") {
      setResult({
        kind: "not-yet",
        text: area
          ? `${area.name} is not on a route yet. Join the waitlist and we will tell you the week it is.`
          : "That one is not on a route yet. Join the waitlist and we will tell you the week it is.",
      });
      return;
    }

    setArea(
      area.name,
      area.serviceability === "served" ? "served" : "no_run",
    );

    if (area.serviceability === "catch_van_only") {
      setResult({
        kind: "van-only",
        text: `The van stops in ${area.name} on ${lower(area.runDaysLabel)}. Home delivery reaches ${area.name} soon.`,
      });
      return;
    }

    setResult({
      kind: "served",
      text: `We deliver to ${area.name} on ${lower(area.runDaysLabel)}.`,
    });
  }

  return (
    <section
      data-surface="dark"
      className="relative overflow-hidden bg-choc py-[var(--section-y-lg)]"
    >
      {/* -------- Cutouts floating off both edges -------------------- */}
      {leftCutout ? (
        <Image
          src={leftCutout.src}
          alt=""
          width={520}
          height={520}
          aria-hidden="true"
          sizes="240px"
          className="pointer-events-none absolute -left-10 bottom-10 hidden w-[190px] -rotate-12 cutout lg:block xl:-left-4 xl:w-[210px]"
        />
      ) : null}
      {rightCutout ? (
        <Image
          src={rightCutout.src}
          alt=""
          width={520}
          height={520}
          aria-hidden="true"
          sizes="240px"
          className="pointer-events-none absolute -right-8 top-14 hidden w-[180px] rotate-12 cutout lg:block xl:-right-2 xl:w-[200px]"
        />
      ) : null}

      <div className="container-content relative">
        <div className="mx-auto max-w-[46rem] text-center">
          <h2 className="text-display-2 text-on-choc">
            Order by 8pm. At your door tomorrow.
          </h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-body-lg text-on-choc-2">
            Two-hour delivery windows across Bengaluru, or catch the van at a
            stop near you and skip the delivery fee.
          </p>

          <form
            onSubmit={check}
            className="mx-auto mt-9 flex max-w-[440px] flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="area-check" className="sr-only">
              Your area or pincode
            </label>
            <input
              id="area-check"
              name="area"
              list={listId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Area or pincode"
              autoComplete="postal-code"
              className={cn(
                "h-12 w-full min-w-0 rounded-md border border-[var(--hairline-dark-color)]",
                "bg-choc-2 px-4 text-body-sm text-on-choc",
                "placeholder:text-on-choc-2 focus:border-gold focus:outline-none",
              )}
            />
            <datalist id={listId}>
              {getAreas().map((area) => (
                <option key={area.slug} value={area.name} />
              ))}
            </datalist>
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-md bg-accent px-6 text-body-sm font-semibold text-on-accent transition-colors duration-[var(--dur-base)] hover:bg-accent-hover"
            >
              Check my area
            </button>
          </form>

          <p
            aria-live="polite"
            className={cn(
              "mx-auto mt-5 min-h-6 max-w-[46ch] text-body-sm",
              result?.kind === "not-yet" ? "text-gold" : "text-on-choc",
            )}
          >
            {result?.text ?? ""}
          </p>

          <Link
            href="/van"
            className="link-underline mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-gold"
          >
            Track the van
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** "Mondays, Wednesdays and Fridays" reads better mid-sentence in lower case. */
function lower(label: string | null): string {
  if (!label) return "on its run days";
  return label.charAt(0).toLowerCase() + label.slice(1);
}

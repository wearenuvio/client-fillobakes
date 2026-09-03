"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { resolveAreaQuery, getAreas } from "@/lib/mock";
import { InkArt } from "@/components/ui/InkArt";
import { useSessionStore } from "@/store/session";
import type { ProductImage } from "@/lib/images";

/**
 * The dark band — DESIGN-v2 §3.7. The page's only dark surface.
 *
 * Chocolate full-bleed, two cutouts floating off the left and right edges, one
 * display-2 line, one sentence, and the area check inline. The answer is a
 * single sentence in the band, never a modal and never a new section.
 *
 * This is the only surface in the site that takes the `-light` colourway of
 * the line art: the van at the right edge and the tied sheaf at the left, both
 * behind the photographic cutouts, per `lineart/INDEX.md`.
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
      data-reveal
      className="relative overflow-hidden bg-choc py-[var(--section-y-lg)]"
    >
      {/* -------- Line art, in the corners the cutouts leave empty -----
          The two photographic cutouts sit bottom-left and top-right, so the
          drawings take the other two corners. A drawing under a cutout reads
          as a printing fault rather than as atmosphere — the lines come out
          of the product's edges — so the diagonal is deliberate and the two
          layers never touch. The van is also pulled clear of the centred
          text column's right edge. */}
      <InkArt
        name="wheat-pair-v2"
        tone="light"
        width={340}
        opacity={0.18}
        className="top-[-40px] left-[-100px] w-[340px]"
      />
      <InkArt
        name="bakery-van"
        tone="light"
        width={340}
        opacity={0.18}
        className="right-[-90px] bottom-[-30px] w-[340px]"
      />

      {/* -------- Cutouts floating off both edges -------------------- */}
      {leftCutout ? (
        <Image
          src={leftCutout.src}
          alt=""
          width={520}
          height={520}
          aria-hidden="true"
          sizes="240px"
          className="pointer-events-none absolute -left-8 bottom-16 hidden w-[180px] -rotate-12 cutout lg:block xl:left-2 xl:w-[196px]"
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
          className="pointer-events-none absolute -right-6 top-20 hidden w-[170px] rotate-12 cutout lg:block xl:right-2 xl:w-[186px]"
        />
      ) : null}

      <div className="container-content relative">
        <div className="mx-auto max-w-[46rem] text-center">
          <h2 className="text-display-2 text-on-choc">
            Order by 8pm. At your door tomorrow.
          </h2>
          {/* The hero and the trust strip both name the city already; §6 caps
              a fact at two mentions, so this sentence drops it. */}
          <p className="mx-auto mt-5 max-w-[52ch] text-body-lg text-on-choc-2">
            Two-hour delivery windows, or catch the van at a stop near you and
            skip the delivery fee.
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
              "mx-auto mt-4 min-h-5 max-w-[46ch] text-body-sm",
              result?.kind === "not-yet" ? "text-gold" : "text-on-choc",
            )}
          >
            {result?.text ?? ""}
          </p>

          <Link
            href="/van"
            className="link-underline mt-5 inline-flex items-center gap-2 text-body-sm font-semibold text-gold"
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

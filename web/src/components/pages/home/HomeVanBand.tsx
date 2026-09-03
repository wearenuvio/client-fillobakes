"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { resolveAreaQuery, getAreas } from "@/lib/mock";
import { InkArt } from "@/components/ui/InkArt";
import { useSessionStore } from "@/store/session";

/**
 * The dark band — DESIGN-v2 §3.7. The page's only dark surface.
 *
 * Chocolate full-bleed, the delivery promise, and the area check inline. The
 * answer is a single sentence in the band, never a modal and never a new
 * section.
 *
 * The band's image is one drawing: the bakery van in the `-light` colourway,
 * which this is the only surface in the site permitted to use. It is drawn
 * large — about 39% of the window at desktop, 60% on a phone — and it sits
 * whole. That is what forced the two-column layout: a 460px van cannot stand
 * beside a centred 736px text column without either being cropped by the
 * section edge or running under the words, and both of those are worse than
 * moving the text to the left.
 *
 * It is also why the band lost its two floating product cutouts and the wheat
 * sheaf. Four objects in one band could not all be placed clear of each other
 * and clear of the edges; a band about delivery is better served by one van
 * drawn properly than by three things fighting in the corners.
 */

type Result =
  | { kind: "served"; text: string }
  | { kind: "van-only"; text: string }
  | { kind: "not-yet"; text: string };

export function HomeVanBand() {
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

    setArea(area.name, area.serviceability === "served" ? "served" : "no_run");

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
      className="relative bg-choc py-[var(--section-y-lg)]"
    >
      <div className="container-content">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-16">
          {/* -------- The words ------------------------------------- */}
          <div className="text-center lg:text-left">
            <h2 className="text-display-2 text-on-choc">
              Order by 8pm. At your door tomorrow.
            </h2>
            {/* The hero and the trust strip both name the city already; §6
                caps a fact at two mentions, so this sentence drops it. */}
            <p className="mx-auto mt-5 max-w-[52ch] text-body-lg text-on-choc-2 lg:mx-0">
              Two-hour delivery windows, or catch the van at a stop near you
              and skip the delivery fee.
            </p>

            <form
              onSubmit={check}
              className="mx-auto mt-9 flex max-w-[440px] flex-col gap-3 sm:flex-row lg:mx-0"
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
                "mx-auto mt-4 min-h-5 max-w-[46ch] text-body-sm lg:mx-0",
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

          {/* -------- The van ---------------------------------------
              A box with the drawing's own 1200:872 ratio, so `contain`
              fills it exactly and there is no crop on any edge. The band
              has no `overflow-hidden` any more: nothing here reaches for
              a section edge, so nothing needs clipping. */}
          <div className="mx-auto w-[68%] max-w-[420px] lg:mr-0 lg:w-full lg:max-w-[500px]">
            <div className="relative aspect-[1200/872] w-full">
              <InkArt
                name="bakery-van"
                tone="light"
                width={500}
                fit="contain"
                opacity={0.22}
                hideOnPhone={false}
                sizes="(min-width: 1024px) 500px, 68vw"
                className="inset-0"
              />
            </div>
          </div>
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

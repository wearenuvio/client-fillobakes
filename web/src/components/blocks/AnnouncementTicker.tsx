"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Announcement / ticker bar — DESIGN.md §12.2.
 *
 * 36px, ink-900, paper-0 nano text, marqueeing at `--dur-marquee` linear with
 * duplicated content for a seamless loop. Pauses on hover and focus-within.
 * Dismissible; dismissal persists for the session. Not sticky — it scrolls
 * away, which is why the dark band's marquee and this one are never both in
 * view.
 *
 * The content is the CERTAINTY SENTENCE: the bar never says "delivery
 * available", it states the day and the hour, computed. States come from
 * journey-recommendation.md §2.1.
 */

export type TickerState =
  | "orders-open"
  | "cutoff-soon"
  | "between-drops"
  | "no-area"
  | "out-of-area"
  | "van-live";

export const TICKER_COPY: Record<TickerState, { line: string; cta?: { label: string; href: string } }> = {
  "orders-open": {
    line: "Order by Thursday 8pm for Saturday's Indiranagar run",
    cta: { label: "See the bake", href: "/shop" },
  },
  "cutoff-soon": {
    line: "Orders close in 6 hours for Saturday's run",
    cta: { label: "See the bake", href: "/shop" },
  },
  "between-drops": {
    line: "Next bake: Saturday. Orders open Sunday 9am.",
    cta: { label: "See the bake", href: "/shop" },
  },
  "no-area": {
    line: "Order by Thursday 8pm for Saturday's bake",
    cta: { label: "Set your area", href: "/areas" },
  },
  "out-of-area": {
    line: "We're not on your street yet — tell us where you are",
    cta: { label: "Add my area", href: "/areas" },
  },
  "van-live": {
    line: "The van is in Indiranagar · 2 stops away",
    cta: { label: "Track it", href: "/van" },
  },
};

const SESSION_KEY = "fillo.ticker.dismissed";

export function AnnouncementTicker({
  state = "orders-open",
  /** Extra certainty segments, separated by a crumb bullet. */
  segments = ["100% eggless", "Free delivery over ₹499"],
  className,
}: {
  state?: TickerState;
  segments?: string[];
  className?: string;
}) {
  const [dismissed, setDismissed] = React.useState(false);

  // Session-scoped dismissal, read after mount so SSR and hydration agree.
  React.useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") setDismissed(true);
    } catch {
      /* private mode: the bar simply stays. */
    }
  }, []);

  if (dismissed) return null;

  const copy = TICKER_COPY[state];
  const items = [copy.line, ...segments];

  return (
    <div
      data-surface="dark"
      className={cn(
        "group relative flex h-9 items-center overflow-hidden bg-ink-900",
        className,
      )}
    >
      <div
        data-motion="marquee"
        className={cn(
          "flex min-w-max shrink-0 animate-[var(--animate-marquee)]",
          "group-hover:[animation-play-state:paused]",
          "group-focus-within:[animation-play-state:paused]",
        )}
      >
        {/* Duplicated once for a seamless -50% loop. */}
        {[0, 1].map((copyIndex) => (
          <ul
            key={copyIndex}
            aria-hidden={copyIndex === 1}
            className="flex items-center"
          >
            {items.map((item, i) => (
              <li key={`${copyIndex}-${i}`} className="flex items-center">
                <span className="nano px-4 whitespace-nowrap text-paper-0">
                  {item}
                </span>
                <span className="text-crumb" aria-hidden="true">
                  ·
                </span>
              </li>
            ))}
            {copy.cta ? (
              <li className="flex items-center">
                <Link
                  href={copy.cta.href}
                  className="nano link-underline px-4 whitespace-nowrap text-crumb"
                  tabIndex={copyIndex === 1 ? -1 : undefined}
                >
                  {copy.cta.label}
                </Link>
                <span className="text-crumb" aria-hidden="true">
                  ·
                </span>
              </li>
            ) : null}
          </ul>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* nothing to persist to; the bar stays gone for this render. */
          }
        }}
        aria-label="Dismiss this notice"
        className="absolute inset-y-0 right-0 grid w-11 place-items-center bg-ink-900 text-ink-400 hover:text-paper-0"
      >
        <X size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

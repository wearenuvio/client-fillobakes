"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Review = { quote: string; name: string; meta: string };

/**
 * Reviews — equal cards from md up, a one-at-a-time swipe carousel below.
 *
 * Every quote is set at the same size so the three cards read as one row;
 * `min-h` keeps the cards the same height even when one quote is short.
 * On a phone the same cards become a horizontal scroll-snap track, one
 * slide per view, with dots and two 44px arrows. Scroll position drives the
 * dots (no timers), so a swipe and an arrow press stay in sync.
 */
export function ReviewsCarousel({ reviews }: { reviews: readonly Review[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        setActive(Math.max(0, Math.min(reviews.length - 1, i)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reviews.length]);

  const go = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (i + reviews.length) % reviews.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className={cn(
          // Phone: snap track. md+: plain 3-up grid, no scrolling.
          "flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "md:grid md:grid-cols-3 md:gap-8 md:overflow-visible",
        )}
        aria-roledescription="carousel"
        aria-label="What people say"
      >
        {reviews.map((review, i) => (
          <figure
            key={review.name}
            className={cn(
              "flex w-full shrink-0 snap-center flex-col justify-between",
              "stamp-badge stamp-card p-8 md:min-h-[268px]",
              i % 2 === 0 ? "md:-rotate-[0.6deg]" : "md:rotate-[0.6deg]",
            )}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${reviews.length}`}
          >
            <div>
              <Stars />
              <blockquote className="mt-5 font-display text-[22px] leading-[1.3] text-ink italic">
                {review.quote}
              </blockquote>
            </div>
            <figcaption className="mt-6 text-body-sm text-muted">
              {review.name} · {review.meta}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Phone controls only. */}
      <div className="mt-5 flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous review"
          className="grid size-11 place-items-center rounded-pill border border-line text-ink"
        >
          <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <div className="flex gap-2" aria-hidden="true">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-2 rounded-pill transition-colors duration-[var(--dur-base)]",
                i === active ? "bg-accent" : "bg-line",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next review"
          className="grid size-11 place-items-center rounded-pill border border-line text-ink"
        >
          <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-1", className)} aria-label="Five out of five">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="var(--color-gold)" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

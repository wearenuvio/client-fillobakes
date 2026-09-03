import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Testimonial — DESIGN-v2 §2.
 *
 * A big serif italic quote, then the name and area, then five small gold
 * stars. No card, no quote-mark graphic, no rating above the quote — the
 * words come first and the badge of trust comes after them.
 *
 * `star` is the only filled icon in the system, and it is filled with gold.
 */

export type TestimonialData = {
  quote: string;
  name: string;
  /** "INDIRANAGAR · MAY 2026" */
  meta: string;
  rating?: number;
  avatar?: { src: string } | null;
};

export function Testimonial({
  quote,
  name,
  meta,
  rating,
  avatar,
  className,
}: TestimonialData & { className?: string }) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <figure className={cn("max-w-[46ch]", className)}>
      <blockquote className="font-display text-[clamp(22px,2.6vw,28px)] leading-snug text-ink italic">
        {quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-4">
        {avatar ? (
          <Image
            src={avatar.src}
            alt=""
            width={96}
            height={96}
            className="size-12 shrink-0 rounded-pill object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-pill bg-well font-display text-[22px] text-ink"
          >
            {initial}
          </span>
        )}

        <span className="min-w-0">
          <span className="block text-body-sm font-semibold text-ink">{name}</span>
          <span className="block text-body-sm text-muted">{meta}</span>
          {typeof rating === "number" ? (
            <Rating value={rating} className="mt-1" />
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}

export function Rating({
  value,
  max = 5,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${value} out of ${max}`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          className={i < value ? "fill-gold text-gold" : "fill-line text-line"}
        />
      ))}
    </span>
  );
}

/**
 * The carousel rail: circular ghost arrows top-right, a hairline track beneath
 * with a kiln progress segment, scroll-snap on touch. There is NO auto-advance
 * — the reader sets the pace.
 */
export function TestimonialRail({
  children,
  progress = 0.34,
  controls,
  className,
}: {
  children: React.ReactNode;
  progress?: number;
  controls?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {controls ? (
        <div className="mb-6 flex justify-end gap-2">{controls}</div>
      ) : null}

      <div className="scroll-rail gap-12">{children}</div>

      <div className="mt-8 h-px w-full bg-line" aria-hidden="true">
        <div
          className="h-full bg-accent"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Testimonial — DESIGN.md §12.13.
 *
 * No card, no quote-mark graphic, no star row above the quote. The quote is
 * display type on paper-100, capped at 46ch; the attribution and the rating sit
 * below it, in that order.
 *
 * The avatar frame is one of the four sanctioned uses of `--radius-blob`.
 * `star` is the ONLY permitted filled icon in the whole system, and it is
 * filled with `--color-crumb`.
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
      <blockquote className="font-display text-display-sm text-ink-800">
        {quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-4">
        {avatar ? (
          <Image
            src={avatar.src}
            alt=""
            width={96}
            height={96}
            className="size-12 shrink-0 rounded-blob object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-blob bg-paper-200 font-display text-title-lg text-ink-800"
          >
            {initial}
          </span>
        )}

        <span className="min-w-0">
          <span className="block text-body-sm font-semibold text-ink-800">{name}</span>
          <span className="micro block text-ink-500">{meta}</span>
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
          className={i < value ? "fill-crumb text-crumb" : "fill-paper-300 text-paper-300"}
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

      <div className="mt-8 h-px w-full bg-paper-300" aria-hidden="true">
        <div
          className="h-full bg-kiln"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}

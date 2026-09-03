import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Long-form typography — DESIGN-v2 §1.
 *
 * There is no typography plugin here on purpose: an editorial body is written
 * as plain JSX and picks up the same token scale as the rest of the site
 * through descendant variants.
 *
 *  - Measure caps at 68ch, which lands body-lg on roughly 62 characters.
 *  - Headings are the display serif at weight 400. An h3 steps into the sans
 *    rather than shrinking the serif below 24px.
 *  - Terracotta is the only link colour, and the underline grows from the left.
 */
export function Prose({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "max-w-[var(--max-prose)] text-body-lg text-ink-2",
        "[&>*:first-child]:mt-0",
        "[&_p]:mt-6",
        "[&_h2]:mt-14 [&_h2]:mb-0 [&_h2]:font-display [&_h2]:text-[clamp(26px,3vw,34px)] [&_h2]:leading-tight [&_h2]:text-ink",
        "[&_h3]:mt-10 [&_h3]:mb-0 [&_h3]:font-sans [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-ink",
        "[&_h2+p]:mt-4 [&_h3+p]:mt-3",
        "[&_ul]:mt-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:mt-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_li]:marker:text-line",
        "[&_strong]:font-semibold [&_strong]:text-ink",
        "[&_a]:text-accent [&_a]:font-medium [&_a]:link-underline",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The standfirst. One size up from the body, capped short, sitting above the
 * article rather than inside it so the measure change is deliberate.
 */
export function Lead({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...rest}
      className={cn("max-w-[46ch] text-body-lg text-ink-2", className)}
    >
      {children}
    </p>
  );
}

/**
 * A pull quote — the one display-face interruption a long article gets.
 * Hairline above and below, never a card, never a quote-mark graphic.
 */
export function PullQuote({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <figure
      {...rest}
      className={cn("my-12 max-w-[42ch] border-y border-line py-8", className)}
    >
      <blockquote className="font-display text-[clamp(24px,3vw,30px)] leading-snug text-ink italic">
        {children}
      </blockquote>
    </figure>
  );
}

/** A footnote: caption size, muted, directly beneath the claim it escorts. */
export function Footnote({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...rest} className={cn("mt-3 max-w-[58ch] text-body-sm text-muted", className)}>
      {children}
    </p>
  );
}

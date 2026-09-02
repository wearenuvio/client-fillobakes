import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Long-form typography — DESIGN.md §3.1, §3.2 and §8.
 *
 * The system has no typography plugin on purpose: prose here is the same
 * token scale as the rest of the site, addressed through descendant variants
 * so an editorial body can be written as plain JSX and still obey the law.
 *
 *  - Measure is capped at `--max-prose` (68ch); §3.2.3 asks for ~62ch of
 *    body, which is what `--text-body-lg` lands on inside that container.
 *  - Headings stay display weight 400 (§3.2.1). An h3 drops to the sans
 *    register rather than shrinking the display face below 24px (§3.2.2).
 *  - Links inside long-form copy are the one place kiln is allowed to carry
 *    running text (§2.4), with the underline growing from the left (§9).
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
        "max-w-[var(--max-prose)] text-body-lg text-ink-600",
        "[&>*:first-child]:mt-0",
        "[&_p]:mt-6",
        "[&_h2]:mt-14 [&_h2]:mb-0 [&_h2]:text-display-sm [&_h2]:text-ink-800",
        "[&_h3]:mt-10 [&_h3]:mb-0 [&_h3]:font-sans [&_h3]:text-title-lg [&_h3]:font-semibold [&_h3]:text-ink-800",
        "[&_h2+p]:mt-4 [&_h3+p]:mt-3",
        "[&_ul]:mt-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_ol]:mt-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5",
        "[&_li]:marker:text-paper-400",
        "[&_strong]:font-semibold [&_strong]:text-ink-800",
        "[&_a]:text-kiln [&_a]:link-underline",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The lead paragraph. `--text-body-lg` capped at 46ch (§3.2.3), sitting above
 * the body rather than inside it so the measure change is deliberate.
 */
export function Lead({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...rest}
      className={cn("max-w-[46ch] text-body-lg text-ink-600", className)}
    >
      {children}
    </p>
  );
}

/**
 * A pull quote — the one display-face interruption a long article gets.
 * Hairline above and below, never a card, never a quote-mark graphic (§12.13).
 */
export function PullQuote({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <figure
      {...rest}
      className={cn(
        "my-12 max-w-[46ch] border-y border-y-paper-300 py-8",
        className,
      )}
    >
      <blockquote className="font-display text-display-sm text-ink-800">
        {children}
      </blockquote>
    </figure>
  );
}

/**
 * A footnote — the humour container (§1.1.3). One per section, `*`-prefixed,
 * caption size, ink-500, directly beneath the claim it escorts.
 */
export function Footnote({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...rest}
      className={cn("mt-3 max-w-[62ch] text-caption text-ink-500", className)}
    >
      <span aria-hidden="true">*</span> {children}
    </p>
  );
}

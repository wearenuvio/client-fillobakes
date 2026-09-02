import { cn } from "@/lib/cn";

/**
 * The TBC tag — DECISIONS.md §10, and the brief's hard rule.
 *
 * A founder placeholder is printed as a placeholder. It is never rounded into
 * a confident number, never quietly dropped, and never dressed as an error:
 * the surrounding sentence still carries the fact, this only carries the gap.
 */
export function Tbc({
  /** What the missing number is, for the tooltip and for screen readers. */
  what,
  className,
}: {
  what?: string;
  className?: string;
}) {
  const title = what
    ? `${what} — not set yet, so we are not printing a number`
    : "Not set yet, so we are not printing a number";

  return (
    <abbr
      title={title}
      className={cn("micro align-baseline text-ink-500 no-underline", className)}
    >
      [TBC]
    </abbr>
  );
}

/**
 * An estimated number: ours, derived from retail, not founder-set. Same
 * discipline as the TBC tag — the figure is real arithmetic, the tag says who
 * it came from.
 */
export function Est({ what, className }: { what?: string; className?: string }) {
  return (
    <abbr
      title={what ?? "Estimated — derived from retail, not set by the founders"}
      className={cn("nano align-baseline text-ink-500 no-underline", className)}
    >
      [Est.]
    </abbr>
  );
}

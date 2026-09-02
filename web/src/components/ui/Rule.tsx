import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Rule — the hairline. DESIGN.md §6: the mood board structures pages with 1px
 * rules, not with boxes. Always 1px, never a colour outside the paper scale.
 *
 * `label` turns it into a labelled hairline: a micro-caps kicker sitting on
 * the rule, which is how every section in the system announces itself.
 */

export type RuleProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `strong` terminates a section; `dark` is for ink-900 bands. */
  tone?: "default" | "strong" | "dark";
  label?: React.ReactNode;
  /** Right-hand slot on a labelled rule — a count, a date, a link. */
  trailing?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
};

const TONES = {
  default: "bg-paper-300",
  strong: "bg-paper-400",
  dark: "bg-[var(--hairline-dark-color)]",
} as const;

export function Rule({
  tone = "default",
  label,
  trailing,
  orientation = "horizontal",
  className,
  ...rest
}: RuleProps) {
  if (orientation === "vertical") {
    return (
      <div
        aria-hidden="true"
        {...rest}
        className={cn("w-px self-stretch", TONES[tone], className)}
      />
    );
  }

  if (!label && !trailing) {
    return (
      <hr
        {...(rest as React.HTMLAttributes<HTMLHRElement>)}
        className={cn("h-px w-full border-0", TONES[tone], className)}
      />
    );
  }

  return (
    <div {...rest} className={cn("flex w-full items-center gap-4", className)}>
      {label ? (
        <span
          className={cn(
            "micro shrink-0",
            tone === "dark" ? "text-crumb" : "text-kiln",
          )}
        >
          {label}
        </span>
      ) : null}
      <span className={cn("h-px flex-1", TONES[tone])} aria-hidden="true" />
      {trailing ? (
        <span
          className={cn(
            "micro shrink-0",
            tone === "dark" ? "text-ink-400" : "text-ink-500",
          )}
        >
          {trailing}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Kicker — the `--text-micro` uppercase label above a section heading.
 * DESIGN.md §13: give every section one.
 */
export function Kicker({
  tone = "kiln",
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLParagraphElement> & {
  tone?: "kiln" | "ink" | "crumb";
}) {
  return (
    <p
      {...rest}
      className={cn(
        "micro",
        tone === "kiln" && "text-kiln",
        tone === "ink" && "text-ink-500",
        tone === "crumb" && "text-crumb",
        className,
      )}
    >
      {children}
    </p>
  );
}

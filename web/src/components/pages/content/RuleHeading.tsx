import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The system's labelled hairline (§6), but semantic.
 *
 * `<Rule label>` is decorative — a span on a rule — which is right when a
 * display heading follows it. Where the label IS the section's heading, the
 * document would otherwise jump straight from h1 to the h3s inside the
 * section. This renders the identical thing as a real heading element.
 */
export function RuleHeading({
  children,
  trailing,
  as: Heading = "h2",
  tone = "kiln",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  trailing?: React.ReactNode;
  as?: "h2" | "h3";
  tone?: "kiln" | "crumb";
}) {
  return (
    <div {...rest} className={cn("flex items-center gap-4", className)}>
      <Heading
        className={cn(
          "micro shrink-0 font-mono",
          tone === "crumb" ? "text-crumb" : "text-kiln",
        )}
      >
        {children}
      </Heading>
      <span
        className={cn(
          "h-px flex-1",
          tone === "crumb" ? "bg-[var(--hairline-dark-color)]" : "bg-paper-400",
        )}
        aria-hidden="true"
      />
      {trailing ? (
        <span
          className={cn(
            "micro shrink-0",
            tone === "crumb" ? "text-ink-400" : "text-ink-500",
          )}
        >
          {trailing}
        </span>
      ) : null}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * The labelled hairline, as a real heading.
 *
 * The site's label layer — 12px Hanken caps at .12em — sitting on a rule, so
 * a section that is introduced by its label rather than by a display line
 * still contributes a heading to the document outline.
 */
export function RuleHeading({
  children,
  trailing,
  as: Heading = "h2",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  trailing?: React.ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div {...rest} className={cn("flex items-center gap-4", className)}>
      <Heading className="shrink-0 font-sans text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        {children}
      </Heading>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      {trailing ? (
        <span className="shrink-0 text-body-sm text-muted tabular">{trailing}</span>
      ) : null}
    </div>
  );
}

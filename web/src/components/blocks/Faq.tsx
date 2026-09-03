"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * FAQ accordion — DESIGN-v2 §2.
 *
 * A hairline-separated list. No card, no radius, capped at `--max-narrow`.
 * The panel animates via `grid-template-rows: 0fr → 1fr`, which is the only
 * way to transition to auto height without measuring.
 *
 * One open at a time is deliberately NOT enforced — multiple may be open,
 * because someone comparing two answers should not have to re-open the first.
 *
 * The FAQ is one of the places the voice allows humour (site-content.md rule
 * 1: humour lives where the user is bored, anxious or disappointed).
 */

export type FaqItem = { question: string; answer: React.ReactNode };

export function Faq({
  items,
  headingLevel = 3,
  /**
   * "narrow" caps the list at the reading measure, which is right when it
   * sits in a full-width section. "full" lets a column that is already
   * measured — a 8-of-12 grid cell — set the width instead.
   */
  measure = "narrow",
  className,
}: {
  items: FaqItem[];
  headingLevel?: 2 | 3 | 4;
  measure?: "narrow" | "full";
  className?: string;
}) {
  const [open, setOpen] = React.useState<Set<number>>(() => new Set());
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  const baseId = React.useId();

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div
      className={cn(measure === "narrow" && "max-w-[var(--max-narrow)]", className)}
    >
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.question} className="border-b border-b-line">
            <Heading className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-[20px] leading-snug text-ink lg:text-[22px]">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-muted transition-transform",
                    "duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                    "group-hover:text-accent",
                    isOpen && "rotate-180 text-accent",
                  )}
                />
              </button>
            </Heading>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows]",
                "duration-[var(--dur-base)] ease-[var(--ease-out)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-[var(--max-prose)] pb-6 text-body text-ink-2 [&_a]:link-underline [&_a]:font-medium [&_a]:text-accent">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

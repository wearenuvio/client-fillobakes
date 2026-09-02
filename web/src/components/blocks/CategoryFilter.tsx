"use client";

import { cn } from "@/lib/cn";
import type { Category } from "@/lib/catalog";

/**
 * CategoryFilter — DESIGN.md §12.6.
 *
 *  - ≥1024: a left rail. Active gets ink-800, weight 500, a 2px category bar
 *    in the left gutter, and the count on the right.
 *  - <1024: a horizontal scroll rail with snap, bleeding to the viewport edge,
 *    with a paper-50 fade mask on both ends.
 *
 * An empty category (Weekly Specials today) keeps its chip visible at ink-400
 * with `aria-disabled` — the grid shows the empty state rather than the
 * category disappearing.
 */

const CATEGORY_BAR: Record<string, string> = {
  all: "bg-ink-800",
  breads: "bg-cat-breads",
  anpan: "bg-cat-anpan",
  karepan: "bg-cat-karepan",
  "pies-strudels": "bg-cat-pies",
  "fruit-sandos": "bg-cat-sandos",
  "weekly-specials": "bg-cat-weekly",
};

export type CategoryFilterProps = {
  categories: Category[];
  /** "all" or a category slug. */
  value: string;
  onChange: (value: string) => void;
  totalCount: number;
  variant?: "rail" | "chips" | "responsive";
  className?: string;
};

export function CategoryFilter({
  categories,
  value,
  onChange,
  totalCount,
  variant = "responsive",
  className,
}: CategoryFilterProps) {
  const items = [
    { slug: "all", label: "All", count: totalCount },
    ...categories.map((c) => ({ slug: c.slug, label: c.label, count: c.count })),
  ];

  return (
    <div className={className}>
      {variant !== "chips" ? (
        <CategoryRail
          items={items}
          value={value}
          onChange={onChange}
          className={variant === "responsive" ? "hidden lg:block" : undefined}
        />
      ) : null}
      {variant !== "rail" ? (
        <CategoryChips
          items={items}
          value={value}
          onChange={onChange}
          className={variant === "responsive" ? "lg:hidden" : undefined}
        />
      ) : null}
    </div>
  );
}

type Item = { slug: string; label: string; count: number };

/** ≥1024 — the left rail, mirroring the current /shop. */
export function CategoryRail({
  items,
  value,
  onChange,
  className,
}: {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <nav aria-label="Filter by category" className={className}>
      <ul className="flex flex-col">
        {items.map((item, index) => {
          const active = item.slug === value;
          const empty = item.count === 0;
          return (
            <li key={item.slug}>
              {/* A hairline separates All from the six categories. */}
              {index === 1 ? (
                <hr className="my-2 h-px border-0 bg-paper-300" />
              ) : null}
              <button
                type="button"
                onClick={() => onChange(item.slug)}
                aria-current={active ? "true" : undefined}
                aria-disabled={empty || undefined}
                className={cn(
                  "micro relative flex w-full items-center justify-between gap-4 py-3 pl-4 text-left",
                  "transition-colors duration-[var(--dur-fast)]",
                  active
                    ? "font-medium text-ink-800"
                    : empty
                      ? "text-ink-400"
                      : "text-ink-600 hover:text-ink-800",
                )}
              >
                {active ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2",
                      CATEGORY_BAR[item.slug],
                    )}
                  />
                ) : null}
                <span>{item.label}</span>
                <span className={cn("tabular", active ? "text-ink-500" : "text-ink-500")}>
                  {item.count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** <1024 — the scroll rail, gutter-bleeding with a fade mask at both ends. */
export function CategoryChips({
  items,
  value,
  onChange,
  className,
}: {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)] py-1"
        role="group"
        aria-label="Filter by category"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, black var(--gutter), black calc(100% - var(--gutter)), transparent 100%)",
        }}
      >
        {items.map((item) => {
          const active = item.slug === value;
          const empty = item.count === 0;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onChange(item.slug)}
              aria-pressed={active}
              aria-disabled={empty || undefined}
              className={cn(
                "micro inline-flex h-9 items-center gap-2 rounded-sm px-4 whitespace-nowrap",
                "transition-colors duration-[var(--dur-fast)]",
                active
                  ? "border border-transparent bg-ink-800 text-paper-0"
                  : empty
                    ? "border border-paper-300 text-ink-400"
                    : "border border-paper-300 text-ink-600 hover:border-ink-600 hover:text-ink-800",
              )}
            >
              {item.label}
              <span className="tabular opacity-70">{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

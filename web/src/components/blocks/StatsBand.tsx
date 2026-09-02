import { cn } from "@/lib/cn";

/**
 * StatsBand — DESIGN.md §12.14.
 *
 * Full-bleed ink-900 at `--section-y-lg`. Three or four cells separated by
 * VERTICAL hairline rules, not by gaps. Below 768 it becomes a 2×2 grid with
 * horizontal hairlines.
 *
 * **Values render at their final number — there is no count-up animation**
 * (§9, "what never animates"). And every number here is true or it does not
 * ship (DECISIONS.md §10): pass a `[TBC]` caption rather than a rounded-up
 * guess.
 */

export type Stat = { value: string; caption: string };

export function StatsBand({
  stats,
  className,
}: {
  stats: Stat[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2",
        stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.caption}
          className={cn(
            "flex flex-col items-center gap-2 px-4 py-6 text-center",
            // Vertical rules between cells (2×2 below md, one row above).
            index % 2 === 1 && "border-l border-l-[var(--hairline-dark-color)]",
            index >= 2 && "border-t border-t-[var(--hairline-dark-color)] md:border-t-0",
            "md:border-l md:border-l-[var(--hairline-dark-color)] md:first:border-l-0",
          )}
        >
          <span className="font-display text-display-lg text-paper-0 tabular">
            {stat.value}
          </span>
          <span className="nano text-ink-400">{stat.caption}</span>
        </div>
      ))}
    </div>
  );
}

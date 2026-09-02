import { cn } from "@/lib/cn";

/**
 * Loading placeholders — DESIGN.md §12.5.
 *
 * A well fills `--color-paper-200` with a 1.4s shimmer sweeping
 * `--color-paper-100`; meta lines are three rounded bars. There is no spinner
 * in a grid and no spinner as an empty state.
 */

export function Skeleton({
  className,
  rounded = "sm",
}: {
  className?: string;
  rounded?: "none" | "sm" | "md" | "pill";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block shimmer",
        rounded === "none" && "rounded-none",
        rounded === "sm" && "rounded-sm",
        rounded === "md" && "rounded-md",
        rounded === "pill" && "rounded-pill",
        className,
      )}
    />
  );
}

/** A ProductCard in its loading state — same geometry, no content. */
export function ProductCardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading a bake">
      <Skeleton rounded="none" className="aspect-square w-full" />
      <Skeleton className="mt-3 h-2.5 w-20" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

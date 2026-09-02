import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * A reviewer's control, not a feature.
 *
 * The tracker has one master state on any given day, and the mock carries nine.
 * This lets a reviewer walk all of them without editing a fixture. It renders
 * only when `?state=` is already in the URL, or in development — so it is never
 * part of the page a customer sees.
 */

export function StateSwitcher({
  states,
  current,
  basePath,
  visible,
  className,
}: {
  states: readonly string[];
  current: string;
  basePath: string;
  visible: boolean;
  className?: string;
}) {
  if (!visible) return null;

  return (
    <div className={cn("border-t border-t-paper-300 pt-4", className)}>
      <p className="micro text-ink-500">Preview state — reviewers only</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {states.map((state) => {
          const active = state === current;
          return (
            <li key={state}>
              <Link
                href={`${basePath}?state=${state}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nano inline-flex h-11 items-center rounded-sm px-3",
                  active
                    ? "bg-ink-800 text-paper-0"
                    : "border border-paper-400 text-ink-600 hover:border-ink-600",
                )}
              >
                {state.replace(/_/g, " ")}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * A reviewer's control, not a feature.
 *
 * The tracker has one master state on any given day and the fixture carries
 * nine, so this walks a reviewer through all of them without editing data. It
 * draws only when `?state=` is already in the URL, or in development — a
 * customer never meets it.
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
    <div className={cn("border-t border-line pt-5", className)}>
      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        Preview state — reviewers only
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {states.map((state) => {
          const active = state === current;
          return (
            <li key={state}>
              <Link
                href={`${basePath}?state=${state}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-pill px-4 text-body-sm",
                  active
                    ? "bg-ink text-on-accent"
                    : "border border-line text-ink-2 hover:border-muted",
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

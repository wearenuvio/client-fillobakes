import * as React from "react";
import { cn } from "@/lib/cn";
import { LoafGlyph } from "@/components/ui/LineArt";

/**
 * Empty and error states — DESIGN.md §12.20.
 *
 * A ghosted line-art glyph at 96px and 12% opacity, a `--text-title` line, a
 * `--text-body-sm` `--color-ink-500` line, and ONE ghost or secondary button.
 * Never an illustration in colour. Never a spinner as an empty state.
 *
 * The copy convention (site-content.md) is that the second line names what is
 * actually baking — an empty state hands the user exactly one door.
 */

export function EmptyState({
  title,
  body,
  action,
  glyph,
  className,
}: {
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Exactly one. Two actions is a menu, not an empty state. */
  action?: React.ReactNode;
  glyph?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center px-4 py-16 text-center",
        className,
      )}
    >
      <span aria-hidden="true" className="mb-6 block opacity-12">
        {glyph ?? <LoafGlyph size={96} />}
      </span>
      <p className="text-title text-ink-800">{title}</p>
      {body ? (
        <p className="mt-2 max-w-[46ch] text-body-sm text-ink-500">{body}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

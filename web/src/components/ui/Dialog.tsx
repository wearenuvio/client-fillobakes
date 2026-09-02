"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { useFocusTrap, useLockBodyScroll } from "@/components/ui/overlay";

/**
 * Dialog — DESIGN.md §12.23.
 *
 * 520px, `--radius-lg`, paper-0, `--shadow-overlay`, padding `--space-8`.
 * Scrim fades in over `--dur-base`; the panel scales 0.97 → 1 over
 * `--dur-slow`. Focus trapped, Esc closes, scroll locked, focus returns.
 *
 * Below 640px it becomes a bottom sheet: full width, `--radius-lg` on the top
 * corners only, entering with `translateY(100% → 0)`.
 *
 * `variant="sheet"` forces the bottom sheet at every width — that is the form
 * the Area & lane sheet and the WhatsApp opt-in sheet always take.
 */

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = "dialog",
  labelledBy,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Actions row: ghost cancel, then primary or destructive, right-aligned. */
  footer?: React.ReactNode;
  variant?: "dialog" | "sheet";
  labelledBy?: string;
  className?: string;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open, onClose);

  if (!open) return null;

  const sheet = variant === "sheet";

  return (
    <div className="fixed inset-0 z-[var(--z-dialog)]">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 w-full cursor-default bg-scrim motion-safe:animate-[fade_var(--dur-base)_var(--ease-standard)]"
      />
      <div
        className={cn(
          "absolute inset-0 flex",
          sheet ? "items-end" : "items-end sm:items-center sm:justify-center sm:p-6",
        )}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy ?? (title ? titleId : undefined)}
          tabIndex={-1}
          className={cn(
            "relative w-full bg-paper-0 shadow-overlay outline-none",
            "p-6 sm:p-8",
            "max-h-[92vh] overflow-y-auto",
            sheet
              ? "rounded-t-lg"
              : "rounded-t-lg sm:max-w-[520px] sm:rounded-lg",
            "motion-safe:animate-[sheet-in_var(--dur-slow)_var(--ease-out)]",
            !sheet && "sm:motion-safe:animate-[dialog-in_var(--dur-slow)_var(--ease-out)]",
            className,
          )}
        >
          <div className="absolute top-4 right-4">
            <IconButton label="Close" size="sm" onClick={onClose}>
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>

          {title ? (
            <h2 id={titleId} className="pr-10 text-display-sm">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-3 text-body text-ink-600">{description}</p>
          ) : null}

          {children ? <div className={cn(title && "mt-6")}>{children}</div> : null}

          {footer ? (
            /* Sticky, so a long list (the catalogue picker, a long form) never
               scrolls its own actions out of reach. The negative margins bleed
               it to the panel edges; the hairline separates it from content
               passing underneath. */
            <div
              className={cn(
                "sticky bottom-0 z-1 mt-8 flex flex-wrap items-center justify-end gap-3",
                "border-t border-paper-300 bg-paper-0",
                "-mx-6 -mb-6 px-6 py-4 sm:-mx-8 sm:-mb-8 sm:px-8",
              )}
            >
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

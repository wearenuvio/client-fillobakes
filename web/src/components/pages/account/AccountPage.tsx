"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoafGlyph } from "@/components/ui/LineArt";
import { useAccountSession } from "@/components/pages/account/session";

/**
 * Every account screen's shell: the H1 stays on the page in both states, and
 * only the body is gated — an account page that hides its own title reads as
 * a broken page rather than a signed-out one.
 */
export function AccountPage({
  h1,
  kicker,
  lead,
  chip,
  actions,
  children,
  className,
}: {
  h1: React.ReactNode;
  kicker?: React.ReactNode;
  lead?: React.ReactNode;
  /** The area chip, repeated on the right of the dashboard head (journey §5.2). */
  chip?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const { hydrated, signedIn } = useAccountSession();

  return (
    <div className={cn("min-w-0", className)}>
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {kicker ? <p className="micro mb-3 text-kiln">{kicker}</p> : null}
          <h1 className="text-display-md text-ink-800">{h1}</h1>
          {lead ? (
            <p className="mt-3 max-w-[46ch] text-body text-ink-600">{lead}</p>
          ) : null}
        </div>
        {chip || actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {chip}
            {actions}
          </div>
        ) : null}
      </header>

      <div className="mt-8">
        {hydrated && !signedIn ? <SignedOut /> : children}
      </div>
    </div>
  );
}

function SignedOut() {
  return (
    <EmptyState
      glyph={<LoafGlyph size={96} />}
      title="You've been signed out."
      body="Put your number in and we'll take you straight back."
      action={<ButtonLink href="/login">Sign in</ButtonLink>}
    />
  );
}

/**
 * The area chip, read-only. The interactive one lives in the header; this is
 * the dashboard's repeat of the same three facts — place, mode, next slot.
 */
export function AreaChipStatic({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-paper-300 bg-paper-0 px-4 text-body-sm text-ink-600">
      <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
      {label}
    </span>
  );
}

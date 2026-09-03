"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { LoafGlyph } from "@/components/ui/LineArt";
import { InkArt, type InkArtName } from "@/components/ui/InkArt";
import { useAccountSession } from "@/components/pages/account/session";

/**
 * Every account screen's shell — DESIGN-v2 §1 type scale, PAGES-v2 Account.
 *
 * An eyebrow in the label layer, the title in the display serif, at most one
 * line under it. The title stays on the page in both states and only the body
 * is gated: a screen that hides its own heading reads as broken rather than
 * as signed out.
 */
export function AccountPage({
  h1,
  kicker,
  lead,
  chip,
  actions,
  art,
  children,
  className,
}: {
  h1: React.ReactNode;
  kicker?: React.ReactNode;
  lead?: React.ReactNode;
  /** The area chip: place, day, window — the three facts the cart repeats. */
  chip?: React.ReactNode;
  actions?: React.ReactNode;
  /** One faint drawing behind the header, from 1024 up (DESIGN-v2 §6). */
  art?: InkArtName;
  children: React.ReactNode;
  className?: string;
}) {
  const { hydrated, signedIn } = useAccountSession();

  return (
    <div className={cn("relative min-w-0 overflow-hidden", className)}>
      {/* The header's right third is clear on every screen that does not
          carry the area chip, so the drawing sits there rather than bleeding
          off an edge the account column does not have. */}
      {art ? (
        <InkArt
          name={art}
          width={210}
          opacity={0.12}
          className="top-0 right-0 hidden lg:block"
        />
      ) : null}
      <header className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {kicker ? (
            <p className="mb-3 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              {kicker}
            </p>
          ) : null}
          <h1 className="text-h2 text-ink">{h1}</h1>
          {lead ? (
            <p className="mt-3 max-w-[48ch] text-body-lg text-ink-2">{lead}</p>
          ) : null}
        </div>
        {chip || actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {chip}
            {actions}
          </div>
        ) : null}
      </header>

      <div className="relative mt-8 lg:mt-10">
        {hydrated && !signedIn ? <SignedOut /> : children}
      </div>
    </div>
  );
}

function SignedOut() {
  return (
    <div className="rounded-lg border border-line bg-card px-6 py-16 text-center">
      <span aria-hidden="true" className="mx-auto mb-6 block w-fit opacity-20">
        <LoafGlyph size={88} />
      </span>
      <p className="font-display text-[26px] leading-tight text-ink">
        You are signed out.
      </p>
      <p className="mx-auto mt-2 max-w-[38ch] text-body text-ink-2">
        Put your number in and we will take you straight back.
      </p>
      <ButtonLink href="/login" className="mt-7">
        Sign in
      </ButtonLink>
    </div>
  );
}

/**
 * The area chip, read only. The interactive one lives in the cart; this is
 * the account's repeat of the same three facts — place, day, window.
 */
export function AreaChipStatic({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line bg-card px-4 text-body-sm text-ink-2">
      <MapPin size={16} strokeWidth={1.5} aria-hidden="true" className="text-accent" />
      <span className="tabular">{label}</span>
    </span>
  );
}

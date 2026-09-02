import * as React from "react";
import { cn } from "@/lib/cn";
import { isTbc } from "@/lib/mock";
import { SpecList, type Spec } from "@/components/blocks/ProofBlock";

/**
 * TBC handling for spec blocks — DECISIONS.md §10 and DESIGN.md §12.33.
 *
 * Two rules collide here and both have to hold:
 *
 *  1. "If a value is unknown, the row is omitted; a spec list with a blank is
 *     worse than a shorter one." (§12.33)
 *  2. "Every number is true or clearly mock-tagged. Never round a TBC into a
 *     confident number." (DECISIONS §10)
 *
 * So a TBC value is stripped out of the SpecList — which stays a clean column
 * of real, checkable data — and reappears below it as a named, plain-language
 * line saying what is still being confirmed. Nothing is invented, nothing is
 * silently dropped, and the reader can see the difference.
 */

export type MaybeSpec = { label: string; value: string | null | undefined };

export function splitSpecs(specs: MaybeSpec[]): {
  known: Spec[];
  pending: string[];
} {
  const known: Spec[] = [];
  const pending: string[] = [];
  for (const spec of specs) {
    if (!spec.value) continue;
    if (isTbc(spec.value)) pending.push(spec.label);
    else known.push(spec);
  }
  return { known, pending };
}

/**
 * The SpecList, plus an honest note naming anything the founders have not
 * signed off. Renders nothing at all when there is neither.
 */
export function HonestSpecList({
  specs,
  claim,
  pendingLead = "Still being confirmed",
  className,
}: {
  specs: MaybeSpec[];
  claim?: React.ReactNode;
  pendingLead?: string;
  className?: string;
}) {
  const { known, pending } = splitSpecs(specs);
  if (known.length === 0 && pending.length === 0) return null;

  return (
    <div className={className}>
      <SpecList specs={known} claim={claim} />
      {pending.length > 0 ? (
        <p className="mt-4 text-caption text-ink-500">
          <span className="micro text-ink-500">{pendingLead}</span>{" "}
          <span>{listToSentence(pending)}</span>. We would
          rather leave a line blank than print a number nobody measured.
        </p>
      ) : null}
    </div>
  );
}

/**
 * A single TBC value rendered inline, for prose that has to mention it:
 * "free over ₹499" reads as a fact, so the qualifier travels with it.
 */
export function TbcMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "micro ml-1.5 inline-block align-baseline text-ink-500",
        className,
      )}
      title="Not yet confirmed by the bakery"
    >
      to be confirmed
    </span>
  );
}

function listToSentence(items: string[]): string {
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

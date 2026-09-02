"use client";

import * as React from "react";
import { WhatsAppOptIn, type OptInState } from "@/components/blocks/WhatsAppOptIn";

/**
 * The inline WhatsApp opt-in row (§12.31), wired to a local mock.
 *
 * It is only ever placed by a page, never mounted by itself, and it closes the
 * tracker rather than interrupting it. `Not now` collapses it to a single
 * hairline line so the choice is respected without the row vanishing.
 */
export function NotifyRow({
  area,
  className,
}: {
  area?: string | null;
  className?: string;
}) {
  const [state, setState] = React.useState<OptInState>("idle");
  const [dismissed, setDismissed] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  if (dismissed) {
    return (
      <p className={className}>
        <span className="text-body-sm text-ink-500">
          No nudges, then. The schedule above is always here.
        </span>
      </p>
    );
  }

  return (
    <WhatsAppOptIn
      className={className}
      state={state}
      area={area}
      onSubmit={() => {
        setState("submitting");
        timer.current = window.setTimeout(() => setState("success"), 900);
      }}
      onNotNow={() => setDismissed(true)}
      onChange={() => setState("idle")}
      onTurnOff={() => setDismissed(true)}
    />
  );
}

"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCountdown } from "@/lib/format";

/**
 * The cart hold — the only honest timer on this site.
 *
 * DECISIONS.md §5 allows a timer only where it is wired to a real constraint,
 * and `cartReservation.note` goes further: "If the build does not actually
 * reserve stock, this timer must not render." So it renders only when the box
 * holds something that is on the van right now with a real remaining count —
 * the one piece of live supply the fixtures carry — and never otherwise.
 *
 * Copy is `cartReservation.copy`, verbatim, in all three states.
 */
export function HoldTimer({
  holdMinutes,
  running,
  expiringSoon,
  expired,
  className,
}: {
  holdMinutes: number;
  /** "Held for 6:42" — the number is replaced by the live one. */
  running: string;
  expiringSoon: string;
  expired: string;
  className?: string;
}) {
  const [secondsLeft, setSecondsLeft] = React.useState(holdMinutes * 60);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const isExpired = secondsLeft === 0;
  const isSoon = !isExpired && secondsLeft <= 60;

  const label = isExpired
    ? expired
    : isSoon
      ? expiringSoon
      : `${running.replace(/\s[\d:]+$/, "")} ${formatCountdown(secondsLeft)}`;

  return (
    <p
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-sm px-3 py-2 text-body-sm",
        isExpired || isSoon ? "bg-warning-tint text-warning" : "bg-paper-200 text-ink-600",
        className,
      )}
    >
      <Clock size={16} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0" />
      <span className="tabular">{label}</span>
    </p>
  );
}

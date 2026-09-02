import * as React from "react";
import { Truck } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { Panel } from "@/components/pages/account/Panel";

/**
 * The "next up" card — the largest object on the dashboard.
 *
 * It follows the DropCard's discipline (§12.27): the fact carries its own
 * slot, the numbers are tabular, and the live line is a stop count and a
 * ten-minute band, never a countdown.
 */
export function DropCardLike({
  kicker,
  badge,
  heading,
  detail,
  items,
  total,
  live,
  actions,
  note,
}: {
  kicker: React.ReactNode;
  badge?: React.ReactNode;
  heading: React.ReactNode;
  detail?: React.ReactNode;
  items?: React.ReactNode;
  total?: number;
  live?: React.ReactNode;
  actions?: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="micro text-ink-500">{kicker}</p>
        {badge}
      </div>

      <h2 className="mt-4 text-display-sm text-ink-800">{heading}</h2>
      {detail ? (
        <p className="mt-1 text-body text-ink-600 tabular">{detail}</p>
      ) : null}

      {items || total !== undefined ? (
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t border-paper-300 pt-5">
          {items ? <p className="min-w-0 text-body text-ink-800">{items}</p> : <span />}
          {total !== undefined ? <Price amount={total} size="lg" /> : null}
        </div>
      ) : null}

      {live ? (
        <p className="mt-5 flex items-start gap-2 text-body-sm text-ink-800">
          <Truck size={20} strokeWidth={1.5} className="mt-px shrink-0 text-ink-600" aria-hidden="true" />
          <span className="tabular">{live}</span>
        </p>
      ) : null}

      {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      {note ? <p className="mt-4 text-caption text-ink-500">{note}</p> : null}
    </Panel>
  );
}

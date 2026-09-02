import Link from "next/link";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { Price } from "@/components/ui/Price";
import { getProductBySlug } from "@/lib/catalog";
import type { OnBoardItem, VanState } from "@/lib/mock";

/**
 * The tracker's smaller modules — what's on board, what happened today, and
 * the stamp-card slot.
 *
 * All three obey the same rule: a number is printed only where the fixture
 * supplies one. Off air there are no live counts, so the list becomes a menu
 * and the cut-off carries the pressure instead (§13, "don't fabricate a stock
 * count").
 */

export function OnBoardList({
  items,
  /** Off air: names and prices, no counts, and the cut-off underneath. */
  grounded = false,
  cutoffLine,
  className,
}: {
  items: OnBoardItem[];
  grounded?: boolean;
  cutoffLine?: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <ul className="divide-y divide-paper-300 border-y border-y-paper-300">
        {items.map((item) => {
          const product = getProductBySlug(item.slug);
          const soldOut = item.state === "sold_out";
          return (
            <li key={item.slug} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
              <span className="min-w-0 flex-1 basis-40">
                <span
                  className={cn(
                    "block text-body font-semibold",
                    soldOut && !grounded ? "text-ink-500" : "text-ink-800",
                  )}
                >
                  {product ? (
                    <Link href={`/product/${product.slug}`} className="link-underline">
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </span>
                {product?.kana ? <KanaLabel kana={product.kana} /> : null}
              </span>

              {!grounded ? (
                <span className="shrink-0">
                  {soldOut ? (
                    <Badge variant="muted">Gone for this week</Badge>
                  ) : item.state === "low_stock" ? (
                    <Badge variant="warning" tabular>
                      {item.label}
                    </Badge>
                  ) : (
                    <span className="micro text-ink-500 tabular">{item.label}</span>
                  )}
                </span>
              ) : null}

              {product ? (
                <Price amount={product.price} size="sm" muted={soldOut && !grounded} />
              ) : null}
            </li>
          );
        })}
      </ul>
      {cutoffLine ? <p className="micro mt-4 text-ink-500">{cutoffLine}</p> : null}
    </div>
  );
}

/**
 * "What happened today" — generated from stop events, never hand-typed, and
 * hidden entirely below two rows rather than shown thin (§12.17.5).
 */
export function ActivityFeed({
  entries,
  className,
}: {
  entries: VanState["activityFeed"];
  className?: string;
}) {
  if (entries.length < 2) return null;

  return (
    <ul className={cn("divide-y divide-paper-300 border-y border-y-paper-300", className)}>
      {entries.slice(0, 5).map((entry) => (
        <li key={`${entry.at}-${entry.text}`} className="flex items-baseline gap-4 py-3">
          <span className="min-w-0 flex-1 text-body text-ink-600">{entry.text}</span>
          <span className="shrink-0 font-mono text-caption text-ink-500 tabular">
            {entry.atLabel}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The stamp-card slot: built, and shipped switched off, because the layout has
 * to exist before the mechanic does. No leaderboard, ever.
 */
export function StampCardSlot({
  slots,
  earned,
  enabled,
  className,
}: {
  slots: number;
  earned: number;
  enabled: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-3" aria-label="Stamp card">
        {Array.from({ length: slots }, (_, i) => (
          <li
            key={i}
            className={cn(
              "grid size-12 place-items-center rounded-pill border border-dashed border-paper-400",
              i < earned && enabled ? "bg-crumb" : "bg-paper-100",
            )}
          >
            <span className="micro text-ink-500 tabular">{i + 1}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[62ch] text-body-sm text-ink-500">
        {enabled
          ? `${earned} of ${slots} stops stamped.`
          : "Six stops, six stamps. The card is built and not switched on yet — this is where it will fill up."}
      </p>
    </div>
  );
}

import { cn } from "@/lib/cn";

/**
 * KanaLabel — DESIGN.md §12.26.
 *
 * The small Japanese reading under a product name. Used in ProductCard, PDP
 * titles, cart line items and order confirmations — nowhere else. Never in
 * nav, never in a button, never as a heading.
 *
 * Hard rules this component enforces:
 *  - Omit rather than invent. `kana={null}` renders nothing and the layout
 *    closes up, so every parent must look correct without it.
 *  - Never romanised as a substitute — pass the kana, not "shokupan".
 *  - One line only. `decorative` marks it aria-hidden, which is right whenever
 *    the Latin name directly above already carries the same meaning.
 */

export function KanaLabel({
  kana,
  decorative = true,
  className,
}: {
  kana: string | null | undefined;
  decorative?: boolean;
  className?: string;
}) {
  if (!kana) return null;
  return (
    <span
      lang="ja"
      aria-hidden={decorative || undefined}
      className={cn("kana block truncate", className)}
    >
      {kana}
    </span>
  );
}

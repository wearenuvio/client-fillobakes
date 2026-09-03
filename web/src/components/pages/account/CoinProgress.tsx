import { cn } from "@/lib/cn";

/**
 * Coins progress — gold is a highlight, never a page colour (DESIGN-v2 §1).
 * A 4px track on the well tint with a gold fill, and the count underneath in
 * plain sentence case rather than the label layer.
 */
export function CoinProgress({
  balance,
  threshold,
  className,
}: {
  balance: number;
  threshold: number;
  className?: string;
}) {
  const capped = Math.max(0, Math.min(balance, threshold));
  const pct = threshold > 0 ? Math.round((capped / threshold) * 100) : 0;
  return (
    <div className={cn("min-w-0", className)}>
      <div
        role="progressbar"
        aria-valuenow={balance}
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-label={`${balance} of ${threshold} coins`}
        className="h-1 w-full overflow-hidden rounded-pill bg-well"
      >
        <div
          className="h-full rounded-pill bg-gold transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-out)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-body-sm text-muted tabular">
        {balance >= threshold
          ? `Ready to redeem`
          : `${capped} of ${threshold} coins`}
      </p>
    </div>
  );
}

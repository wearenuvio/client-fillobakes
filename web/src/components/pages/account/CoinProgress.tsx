import { cn } from "@/lib/cn";

/**
 * Coins progress — crumb is one of exactly five permitted uses of the signal
 * colour (DESIGN.md §2.5: "Fillo+ coins and tier chrome"). It is a fill here,
 * never text on paper.
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
  const pct = Math.max(0, Math.min(100, Math.round((balance / threshold) * 100)));
  return (
    <div className={cn("min-w-0", className)}>
      <div
        role="progressbar"
        aria-valuenow={balance}
        aria-valuemin={0}
        aria-valuemax={threshold}
        aria-label={`${balance} of ${threshold} coins`}
        className="h-1 w-full bg-paper-200"
      >
        <div className="h-full bg-crumb" style={{ width: `${pct}%` }} />
      </div>
      <p className="nano mt-2 text-ink-500 tabular">
        {balance} of {threshold} coins
      </p>
    </div>
  );
}

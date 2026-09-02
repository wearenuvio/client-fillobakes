import * as React from "react";
import { AlertCircle, Check, Loader2, Smartphone } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { formatINR, formatCountdown } from "@/lib/format";

/**
 * UPI pay button — DESIGN.md §12.34. India's default rail, and the PRIMARY
 * payment action — not an alternative tucked below cards.
 *
 * Rules this component enforces:
 *  - The amount is in the label in every state that has one.
 *  - The accepted apps are PLAIN TEXT, never logo lockups, so the payment step
 *    keeps the system's typographic discipline and does not age badly.
 *  - **The page never blanks out to a spinner while the user is away in their
 *    UPI app.** `awaiting` keeps the button visible and disabled.
 *  - `returned-unknown` is the state a returning user actually hits, and it
 *    offers no action for the first 8 seconds.
 *  - Never a raw gateway error code. Log it; show the human line.
 *  - Never auto-retry.
 */

export type UpiState =
  | "idle"
  | "awaiting"
  | "returned-unknown"
  | "success"
  | "failed";

export function UpiPayButton({
  amount,
  state = "idle",
  /** Seconds left on the UPI collect request. Real, from the gateway. */
  expiresIn,
  /** After 20s of awaiting, a ghost cancel appears under the countdown. */
  showCancel = false,
  /** After 8s of returned-unknown, a ghost refresh appears. */
  showRefresh = false,
  onPay,
  onCancel,
  onRefresh,
  onRetry,
  onCard,
  onOther,
  onWriteToUs,
  className,
}: {
  amount: number;
  state?: UpiState;
  expiresIn?: number;
  showCancel?: boolean;
  showRefresh?: boolean;
  onPay?: () => void;
  onCancel?: () => void;
  onRefresh?: () => void;
  onRetry?: () => void;
  onCard?: () => void;
  onOther?: () => void;
  onWriteToUs?: () => void;
  className?: string;
}) {
  /* -------- success: replaced in place ------------------------------- */
  if (state === "success") {
    return (
      <div className={cn("rounded-md bg-success-tint p-4", className)}>
        <p className="flex items-start gap-2 text-body font-semibold text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-success"
          />
          <span className="tabular">Paid {formatINR(amount)}</span>
        </p>
        <p className="mt-2 pl-7 text-body-sm text-ink-600">
          Your box is on Saturday&rsquo;s list. We&rsquo;ll message you Friday
          night with the exact spot and time.
        </p>
      </div>
    );
  }

  /* -------- failed: reassurance first --------------------------------- */
  if (state === "failed") {
    return (
      <div className={cn("rounded-md bg-danger-tint p-4", className)}>
        <p className="flex items-start gap-2 text-body font-semibold text-ink-800">
          <AlertCircle
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-danger"
          />
          That didn&rsquo;t go through — nothing&rsquo;s been charged.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 pl-7">
          <Button size="md" onClick={onRetry}>
            Try again
          </Button>
          <Button variant="ghost" size="md" onClick={onWriteToUs}>
            Write to us and we&rsquo;ll hold your box
          </Button>
        </div>
      </div>
    );
  }

  /* -------- returned-unknown: no action for 8 seconds ------------------ */
  if (state === "returned-unknown") {
    return (
      <div className={cn("rounded-md bg-info-tint p-4", className)}>
        <p className="flex items-center gap-2 text-body text-ink-800">
          <Loader2
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="shrink-0 animate-spin motion-reduce:animate-none"
          />
          Checking with your bank…
        </p>
        <span
          aria-hidden="true"
          className="mt-3 block h-px w-full bg-paper-300"
        />
        {showRefresh ? (
          <Button variant="ghost" size="sm" className="mt-2 -ml-3" onClick={onRefresh}>
            Refresh status
          </Button>
        ) : null}
      </div>
    );
  }

  /* -------- idle and awaiting ----------------------------------------- */
  const awaiting = state === "awaiting";

  return (
    <div className={className}>
      <Button
        size="lg"
        fullWidth
        onClick={onPay}
        disabled={awaiting}
        loading={awaiting}
        icon={awaiting ? undefined : <Smartphone size={20} strokeWidth={1.5} />}
        iconPosition="leading"
        className="tabular"
      >
        {awaiting ? "Approve in your UPI app" : `Pay ${formatINR(amount)} with UPI`}
      </Button>

      {awaiting ? (
        <>
          {typeof expiresIn === "number" ? (
            <p className="mt-2 font-mono text-caption text-ink-500 tabular">
              EXPIRES IN {formatCountdown(expiresIn)}
            </p>
          ) : null}
          {showCancel ? (
            <Button variant="ghost" size="sm" className="mt-1 -ml-3" onClick={onCancel}>
              Cancel and go back
            </Button>
          ) : null}
        </>
      ) : (
        <>
          {/* Plain text, not logo lockups. */}
          <p className="micro mt-3 text-ink-500">GPAY · PHONEPE · PAYTM · BHIM</p>

          <div className="mt-4 flex flex-col gap-2">
            <Button variant="secondary" size="lg" fullWidth onClick={onCard}>
              Pay by card
            </Button>
            <Button variant="ghost" size="md" onClick={onOther}>
              Other ways to pay
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

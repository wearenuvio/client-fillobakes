import { Coins, Repeat } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { COMMERCE, MEMBERSHIP } from "@/lib/config";

/**
 * The two low explainers — site-content Home §12 and §13.
 *
 * Both sit low on purpose. The Standing Order is pitched at the confirmation
 * of a customer's SECOND order, never on a first visit, so on the home page it
 * is three lines and a button and nothing more. Loyalty converts people who
 * are already sold, and a high placement reads as a discount brand.
 *
 * Fillo+ is FREE and phone-based. There is no ₹1 anywhere on this site.
 */

export function LowExplainers() {
  return (
    <div className="divide-y divide-paper-300 border-y border-y-paper-300">
      <div className="grid gap-6 py-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-1">
          <Repeat
            size={24}
            strokeWidth={1.5}
            aria-hidden="true"
            className="text-kiln"
          />
        </div>
        <div className="lg:col-span-6">
          <h2 className="text-display-md text-ink-800">
            Bread, standing. Every Saturday.
          </h2>
          <p className="mt-3 max-w-[46ch] text-body-lg text-ink-600">
            Put your loaf on the van&rsquo;s list and stop thinking about it.
            Skip any week. Pause anytime.
          </p>
        </div>
        <div className="flex items-start lg:col-span-4 lg:col-start-9 lg:justify-end">
          <ButtonLink href="/standing-order" variant="secondary" size="md">
            How it works
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 py-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-1">
          <Coins
            size={24}
            strokeWidth={1.5}
            aria-hidden="true"
            className="text-kiln"
          />
        </div>
        <div className="lg:col-span-6">
          <h2 className="text-display-md text-ink-800">
            {MEMBERSHIP.name} is free
          </h2>
          <p className="mt-3 max-w-[46ch] text-body-lg text-ink-600">
            Join with your phone number. Earn{" "}
            <span className="tabular">{COMMERCE.coinsPerHundred}</span> coins for
            every <span className="tabular">₹{COMMERCE.coinsBasis}</span> you
            spend. <span className="tabular">{COMMERCE.coinsRedeemThreshold}</span>{" "}
            coins is{" "}
            <span className="tabular">₹{COMMERCE.coinsRedeemValue}</span> off, and
            they never expire.
          </p>
        </div>
        <div className="flex items-start lg:col-span-4 lg:col-start-9 lg:justify-end">
          <ButtonLink href="/fillo-plus" variant="secondary" size="md">
            Join {MEMBERSHIP.name} — free
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

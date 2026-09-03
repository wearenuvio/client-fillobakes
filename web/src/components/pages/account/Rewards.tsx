"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { formatINR } from "@/lib/format";
import { getCustomer, getLoyaltyLedger } from "@/lib/mock";
import { Panel, PanelHead } from "@/components/pages/account/Panel";
import { CoinProgress } from "@/components/pages/account/CoinProgress";
import type { RewardsState } from "@/components/pages/account/states";

/**
 * Fillo coins — PAGES-v2 Account, "Rewards".
 *
 * The balance is the page: a 64px serif number, the bar to the next ₹25, one
 * button when it can be spent, then where every coin came from. Two coins per
 * ₹100 and 25 coins is ₹25 off is the whole scheme, which is why there are no
 * tiers here.
 */
export function Rewards({ state = "default" }: { state?: RewardsState }) {
  const customer = getCustomer();
  const ledger = getLoyaltyLedger();
  const { toast } = useToast();

  const notMember = state === "not_member";
  const legacy = state === "legacy_email";
  const empty = state === "empty";

  const balance = empty
    ? 0
    : state === "redeemable" || state === "armed"
      ? 30
      : ledger.balance;
  const toGo = Math.max(0, ledger.redeemThreshold - balance);
  const canRedeem = balance >= ledger.redeemThreshold;

  const [armed, setArmed] = React.useState(state === "armed");
  const [showAll, setShowAll] = React.useState(false);

  const entries = empty || notMember ? [] : ledger.entries;
  const shown = showAll ? entries : entries.slice(0, 6);

  if (notMember) {
    return (
      <Panel tone="peach">
        <PanelHead label="Fillo+" />
        <p className="mt-3 max-w-[16ch] font-display text-[clamp(28px,3.2vw,36px)] leading-[1.05] text-ink">
          Join free, earn on every order.
        </p>
        <p className="mt-4 max-w-[42ch] text-body text-ink-2">
          Two coins for every ₹100, and 25 coins is ₹25 off. Your last order
          would have earned you 10.
        </p>
        <ButtonLink href="/fillo-plus" className="mt-7">
          Join free
        </ButtonLink>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* ---- The balance ------------------------------------------------ */}
      <Panel>
        <PanelHead
          label="Your balance"
          trailing={
            customer.filloPlus.foundingMember ? (
              <Badge variant="warning">Founding member</Badge>
            ) : (
              <Badge variant="outline">Fillo+ member</Badge>
            )
          }
        />

        <p className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-[64px] leading-[0.9] text-ink tabular">
            {balance}
          </span>
          <span className="text-body-lg text-ink-2">
            {balance === 1 ? "coin" : "coins"}
          </span>
        </p>

        <p className="mt-4 max-w-[42ch] text-body text-ink-2">
          {canRedeem
            ? `That is enough for ${formatINR(ledger.redemptionValue)} off.`
            : `${toGo} more and you can take ${formatINR(ledger.redemptionValue)} off.`}
        </p>

        <CoinProgress
          className="mt-5 max-w-[440px]"
          balance={balance}
          threshold={ledger.redeemThreshold}
        />

        {legacy ? (
          <>
            <p className="mt-6 max-w-[42ch] text-body text-ink-2">
              You joined with your email. Add your phone number to keep these
              coins.
            </p>
            <ButtonLink href="/account/settings" variant="secondary" className="mt-5">
              Add my number
            </ButtonLink>
          </>
        ) : armed ? (
          <p className="mt-6 flex items-start gap-2 text-body text-ink">
            <Check
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-1 shrink-0 text-success"
            />
            <span>
              {formatINR(ledger.redemptionValue)} off is waiting on your next
              order.{" "}
              <button
                type="button"
                onClick={() => {
                  setArmed(false);
                  toast({ message: "Undone. Your coins are back where they were." });
                }}
                className="link-underline font-semibold text-accent"
              >
                Undo
              </button>
            </span>
          </p>
        ) : canRedeem ? (
          <Button
            className="mt-6"
            onClick={() => {
              setArmed(true);
              toast({
                message: `${formatINR(ledger.redemptionValue)} off is waiting on your next order.`,
              });
            }}
          >
            Redeem {formatINR(ledger.redemptionValue)}
          </Button>
        ) : (
          <p className="mt-6 text-body-sm text-muted">
            Coins land the moment an order is delivered, not when you pay.
          </p>
        )}
      </Panel>

      {/* ---- The ledger -------------------------------------------------- */}
      <Panel>
        <PanelHead label="Where they came from" />
        {entries.length === 0 ? (
          <p className="mt-4 max-w-[42ch] text-body text-ink-2">{ledger.emptyCopy}</p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {shown.map((entry) => (
                <li key={entry.id} className="flex items-baseline gap-3 py-3">
                  <span className="w-[68px] shrink-0 text-body-sm text-muted tabular">
                    {entry.dateLabel}
                  </span>
                  <span className="min-w-0 flex-1 text-body-sm text-ink">
                    {entry.orderId ? (
                      <Link
                        href={`/account/orders/${entry.orderId}`}
                        className="link-underline"
                      >
                        {entry.description}
                      </Link>
                    ) : (
                      entry.description
                    )}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-body-sm font-semibold tabular",
                      entry.coins > 0 ? "text-ink" : "text-muted",
                    )}
                  >
                    {entry.coins > 0
                      ? `+${entry.coins}`
                      : entry.coins < 0
                        ? `−${Math.abs(entry.coins)}`
                        : "0"}
                  </span>
                </li>
              ))}
            </ul>
            {entries.length > shown.length ? (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="link-underline mt-4 text-body-sm font-semibold text-accent"
              >
                Show all {entries.length}
              </button>
            ) : null}
          </>
        )}
      </Panel>
    </div>
  );
}

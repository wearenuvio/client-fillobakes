"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Coins } from "lucide-react";
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
 * Fillo coins — site-content "Screen: Rewards".
 *
 * Fillo+ is free and phone-based: 2 coins per ₹100, 25 coins is ₹25 off, no
 * expiry. That is the whole scheme and it fits in one sentence, which is why
 * there are no tiers on this page.
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
  const shown = showAll ? entries : entries.slice(0, 8);

  const memberLine = customer.filloPlus.foundingMember
    ? `Founding member since ${customer.filloPlus.memberSince}.`
    : `Fillo+ member since ${customer.filloPlus.memberSince}.`;

  return (
    <div className="flex flex-col gap-6">
      {/* --- Balance ------------------------------------------------------ */}
      <Panel>
        <PanelHead
          label="Fillo coins"
          trailing={
            notMember ? null : customer.filloPlus.foundingMember ? (
              <Badge variant="crumb">Founding member</Badge>
            ) : (
              <Badge variant="outline">Fillo+ member</Badge>
            )
          }
        />

        {notMember ? (
          <>
            <p className="mt-4 text-display-sm text-ink-800">No coins yet.</p>
            <p className="mt-2 max-w-[46ch] text-body text-ink-600">
              You&rsquo;re not on Fillo+ yet. It&rsquo;s free, and this order would have
              earned you 10 coins.
            </p>
            <div className="mt-6">
              <ButtonLink href="/fillo-plus">Join Fillo+ — free</ButtonLink>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 flex items-start gap-3 text-body-lg text-ink-800 tabular">
              <Coins size={24} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-600" aria-hidden="true" />
              {canRedeem
                ? `You have enough for ${formatINR(ledger.redemptionValue)} off. It applies at checkout.`
                : `${toGo} more and you can take ${formatINR(ledger.redemptionValue)} off.`}
            </p>
            <CoinProgress
              className="mt-5 max-w-[420px]"
              balance={Math.min(balance, ledger.redeemThreshold)}
              threshold={ledger.redeemThreshold}
            />
            <p className="mt-5 text-body-sm text-ink-600">{memberLine}</p>
          </>
        )}
      </Panel>

      {/* --- Redeem ------------------------------------------------------- */}
      {!notMember ? (
        <Panel>
          <PanelHead label="Redeem" />
          {legacy ? (
            <>
              <p className="mt-4 text-body text-ink-800">
                You joined Fillo+ with your email. Add your phone number to keep your
                coins.
              </p>
              <div className="mt-6">
                <ButtonLink href="/account/settings">Add my number</ButtonLink>
              </div>
            </>
          ) : armed ? (
            <>
              <p className="mt-4 flex items-start gap-2 text-body text-ink-800">
                <Check size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                {formatINR(ledger.redemptionValue)} off is waiting on your next order.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ButtonLink href="/shop">See this week&rsquo;s bake</ButtonLink>
                <button
                  type="button"
                  onClick={() => {
                    setArmed(false);
                    toast({ message: "Undone. Your coins are back where they were." });
                  }}
                  className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                >
                  Undo
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-body text-ink-800">
                {canRedeem
                  ? `You have enough for ${formatINR(ledger.redemptionValue)} off. It applies at checkout.`
                  : ledger.nudgeCopy}
              </p>
              <div className="mt-6">
                <Button
                  disabled={!canRedeem}
                  onClick={() => {
                    setArmed(true);
                    toast({
                      message: `${formatINR(ledger.redemptionValue)} off is waiting on your next order.`,
                    });
                  }}
                >
                  {canRedeem
                    ? "Redeem on my next order"
                    : `Redeem ${formatINR(ledger.redemptionValue)}`}
                </Button>
              </div>
            </>
          )}
        </Panel>
      ) : null}

      {/* --- Founding member --------------------------------------------- */}
      {customer.filloPlus.foundingMember && !notMember ? (
        <Panel tone="muted">
          <PanelHead label="Founding member" />
          <p className="mt-3 text-body text-ink-800">
            You joined when Fillo+ cost {formatINR(1)}. That badge stays, and you get
            first access to every new bake.
          </p>
        </Panel>
      ) : null}

      {/* --- Ledger ------------------------------------------------------- */}
      <Panel>
        <PanelHead label="Where the coins came from" />
        {entries.length === 0 ? (
          <p className="mt-4 text-body text-ink-600">{ledger.emptyCopy}</p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-paper-300 border-y border-paper-300">
              {shown.map((entry) => (
                <li key={entry.id} className="flex items-baseline gap-4 py-3">
                  <span className="w-16 shrink-0 text-caption text-ink-500 tabular">
                    {entry.dateLabel}
                  </span>
                  <span className="min-w-0 flex-1 text-body-sm text-ink-800">
                    {entry.orderId ? (
                      <Link
                        href={`/account/orders/${entry.orderId}`}
                        className="link-underline text-ink-800"
                      >
                        {entry.description}
                      </Link>
                    ) : (
                      entry.description
                    )}
                  </span>
                  <span
                    className={cn(
                      "w-14 shrink-0 text-right text-body-sm tabular",
                      entry.coins > 0 ? "text-success" : "text-ink-600",
                    )}
                  >
                    {entry.coins > 0 ? `+${entry.coins}` : entry.coins < 0 ? `−${Math.abs(entry.coins)}` : "0"}
                  </span>
                  <span className="w-12 shrink-0 text-right text-caption text-ink-500 tabular">
                    {entry.balanceAfter}
                  </span>
                </li>
              ))}
            </ul>
            {entries.length > 8 && !showAll ? (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="link-underline mt-4 text-body-sm text-ink-700 hover:text-ink-900"
              >
                Show all
              </button>
            ) : null}
            <p className="mt-4 text-caption text-ink-500">
              Coins land the moment an order is delivered, not when you pay.
            </p>
          </>
        )}
      </Panel>
    </div>
  );
}

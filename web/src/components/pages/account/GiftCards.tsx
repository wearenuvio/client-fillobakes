"use client";

import * as React from "react";
import { Check, Gift } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input } from "@/components/ui/Field";
import { WheatGlyph } from "@/components/ui/LineArt";
import { Price } from "@/components/ui/Price";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { formatINR, formatLongDate } from "@/lib/format";
import { getGiftCards, isTbc } from "@/lib/mock";
import { Panel, PanelHead } from "@/components/pages/account/Panel";
import type { GiftCardState } from "@/components/pages/account/states";

/**
 * Gift cards — site-content "Screen: Gift cards".
 *
 * Two tabs, and one field that reads a code. The codes it accepts are the
 * ones in the fixture: a spent card says so rather than failing silently.
 */

type Bought = {
  code: string;
  amount: number;
  balance: number;
  recipientName: string;
  deliverOn: string;
  statusLabel: string;
  status: string;
  message: string;
};

type Received = {
  code: string;
  amount: number;
  balance: number;
  fromName: string;
  statusLabel: string;
  balanceLabel: string;
  receivedAt: string;
};

const TABS = ["Cards I bought", "Cards I've been given"] as const;

export function GiftCards({ state = "default" }: { state?: GiftCardState }) {
  const data = getGiftCards();
  const { toast } = useToast();

  const bought = (state === "empty" ? [] : data.bought) as unknown as Bought[];
  const [received, setReceived] = React.useState<Received[]>(
    (state === "empty" ? [] : data.received) as unknown as Received[],
  );

  const [tab, setTab] = React.useState<(typeof TABS)[number]>(TABS[0]);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [added, setAdded] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  function addCode() {
    setBusy(true);
    setError(null);
    setAdded(null);
    const wanted = code.trim().toUpperCase();
    window.setTimeout(() => {
      setBusy(false);
      const all = [
        ...(data.bought as unknown as Bought[]),
        ...(data.received as unknown as Received[]),
      ];
      const match = all.find((c) => c.code.toUpperCase() === wanted);
      if (!match) {
        setError(data.states.invalid);
        return;
      }
      if (match.balance <= 0) {
        setError(data.states.spent);
        return;
      }
      if (received.some((c) => c.code === match.code)) {
        setError("That one is already on your account.");
        return;
      }
      setReceived((current) => [
        ...current,
        {
          code: match.code,
          amount: match.amount,
          balance: match.balance,
          fromName: "recipientName" in match ? match.recipientName : "a friend",
          statusLabel: "Ready to use",
          balanceLabel: `${formatINR(match.balance)} left of ${formatINR(match.amount)}`,
          receivedAt: new Date().toISOString(),
        },
      ]);
      setCode("");
      setAdded(
        `Added. ${formatINR(match.balance)} sits on your account and comes off your next order automatically.`,
      );
      toast({ message: `Added. ${formatINR(match.balance)} is on your account.` });
    }, 500);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add a card */}
      <Panel>
        <PanelHead label="Add a card" />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field
            className="sm:max-w-[320px]"
            label="Gift card code"
            htmlFor="gift-code"
            error={error}
            helper={added ?? "It comes off your next order automatically."}
          >
            <Input
              id="gift-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="FILLO-0000-0000"
              className="font-mono tabular"
              invalid={Boolean(error)}
            />
          </Field>
          <Button className="shrink-0" loading={busy} disabled={!code.trim()} onClick={addCode}>
            Add this card
          </Button>
        </div>
      </Panel>

      {/* Tabs */}
      <div role="tablist" aria-label="Gift cards" className="flex flex-wrap gap-2">
        {TABS.map((option) => {
          const active = option === tab;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(option)}
              className={cn(
                "micro h-11 rounded-sm px-4 transition-colors duration-[var(--dur-fast)]",
                active
                  ? "bg-ink-800 text-paper-0"
                  : "border border-paper-300 text-ink-600 hover:text-ink-800",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {tab === TABS[0] ? (
        bought.length === 0 ? (
          <EmptyState
            glyph={<WheatGlyph size={96} />}
            title={data.states.emptyBought}
            body="A gift card is bread on a day they choose, which is the only kind of gift a bakery can post."
            action={<ButtonLink href="/gift-cards">Send a gift card</ButtonLink>}
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {bought.map((card) => (
              <li key={card.code}>
                <Panel as="div" className="flex h-full flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="flex items-center gap-2 text-title text-ink-800">
                      <Gift size={20} strokeWidth={1.5} aria-hidden="true" />
                      For {card.recipientName}
                    </p>
                    <Badge variant={card.status === "fully_used" ? "muted" : "outline"}>
                      {card.statusLabel}
                    </Badge>
                  </div>
                  <p className="mt-3 font-mono text-caption text-ink-500 tabular">
                    {card.code}
                  </p>
                  <p className="mt-4 flex items-baseline gap-3">
                    <Price amount={card.amount} size="lg" />
                    {card.balance !== card.amount ? (
                      <span className="text-body-sm text-ink-600 tabular">
                        {card.balance === 0
                          ? "nothing left"
                          : `${formatINR(card.balance)} left`}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-3 flex-1 text-body-sm text-ink-600 tabular">
                    {card.status === "scheduled" ? "Goes out" : "Sent"}{" "}
                    {formatLongDate(card.deliverOn)}. &ldquo;{card.message}&rdquo;
                  </p>
                  <div className="mt-5 border-t border-paper-300 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        toast({ message: `Sent again to ${card.recipientName} on WhatsApp.` })
                      }
                      className="link-underline text-body-sm text-ink-700 hover:text-ink-900"
                    >
                      Resend
                    </button>
                  </div>
                </Panel>
              </li>
            ))}
          </ul>
        )
      ) : received.length === 0 ? (
        <EmptyState
          glyph={<WheatGlyph size={96} />}
          title={data.states.emptyReceived}
          body="Add a code above and the balance lands here."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {received.map((card) => (
            <li key={card.code}>
              <Panel as="div" className="flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-title text-ink-800">From {card.fromName}</p>
                  <Badge variant={card.balance > 0 ? "success" : "muted"}>
                    {card.statusLabel}
                  </Badge>
                </div>
                <p className="mt-3 font-mono text-caption text-ink-500 tabular">
                  {card.code}
                </p>
                <p className="mt-4 flex items-baseline gap-3">
                  <Price amount={card.balance} size="lg" />
                  <span className="text-body-sm text-ink-600 tabular">
                    {card.balanceLabel}
                  </span>
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-paper-300 pt-4">
                  <ButtonLink href="/shop" size="sm" variant="secondary">
                    Use it at checkout
                  </ButtonLink>
                  <span className="flex items-center gap-1.5 text-caption text-ink-500">
                    <Check size={16} strokeWidth={1.5} className="text-success" aria-hidden="true" />
                    Comes off automatically
                  </span>
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}

      <p className="text-caption text-ink-500">
        {isTbc(data.expiryTbc)
          ? "Whether these expire is still being decided. Until it is, we will not print a date we cannot honour."
          : null}
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { getGiftCards } from "@/lib/mock";
import { formatINR } from "@/lib/format";

/**
 * The other two gift-card flows — site-content "Page: Gift cards".
 *
 * Redeem and check balance. Checking a balance needs no login, because the
 * person holding the card is often not the person with the account, and
 * making them sign in to see ₹150 is how a card stops being spent.
 *
 * Mocked against the fixture cards: a real code answers with its real
 * balance, anything else gets the honest miss.
 */

type Card = {
  code: string;
  amount: number;
  balance: number;
  status: string;
  balanceLabel?: string;
};

function findCard(code: string): Card | undefined {
  const cards = getGiftCards();
  const all = [...cards.bought, ...cards.received] as unknown as Card[];
  const needle = code.trim().toUpperCase();
  return all.find((card) => card.code.toUpperCase() === needle);
}

export function GiftCardCodes() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CodePanel
        kind="redeem"
        heading="Have a card"
        label="Enter a gift card code"
        cta="Add it to my account"
      />
      <CodePanel
        kind="balance"
        heading="Check a balance"
        label="Gift card code"
        cta="Check balance"
      />
    </div>
  );
}

function CodePanel({
  kind,
  heading,
  label,
  cta,
}: {
  kind: "redeem" | "balance";
  heading: string;
  label: string;
  cta: string;
}) {
  const states = getGiftCards().states as Record<string, string>;
  const [code, setCode] = React.useState("");
  const [result, setResult] = React.useState<{
    tone: "ok" | "miss";
    message: string;
  } | null>(null);
  const fieldId = React.useId();

  function submit() {
    const card = findCard(code);
    if (!card) {
      setResult({ tone: "miss", message: states.invalid });
      return;
    }
    if (card.balance <= 0) {
      setResult({ tone: "miss", message: states.spent });
      return;
    }
    setResult({
      tone: "ok",
      message:
        kind === "redeem"
          ? `Added. ${formatINR(card.balance)} sits on your account and comes off your next order automatically.`
          : (card.balanceLabel ??
            `${formatINR(card.balance)} left of ${formatINR(card.amount)}.`),
    });
  }

  return (
    <div className="rounded-md border border-paper-300 bg-paper-0 p-6">
      <h3 className="text-title-lg font-sans text-ink-800">{heading}</h3>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label={label} htmlFor={fieldId} className="sm:flex-1">
          <Input
            id={fieldId}
            value={code}
            placeholder="FILLO-0000-0000"
            autoComplete="off"
            onChange={(e) => {
              setCode(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className="font-mono tabular uppercase"
          />
        </Field>
        <Button variant="secondary" size="md" onClick={submit} className="sm:shrink-0">
          {cta}
        </Button>
      </div>

      {result ? (
        <p
          className={cn(
            "mt-4 flex items-start gap-2 rounded-md p-4 text-body-sm",
            result.tone === "ok"
              ? "bg-success-tint text-ink-800"
              : "bg-paper-100 text-ink-600",
          )}
        >
          {result.tone === "ok" ? (
            <Check
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-success"
            />
          ) : null}
          <span>{result.message}</span>
        </p>
      ) : null}
    </div>
  );
}

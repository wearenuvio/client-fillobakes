"use client";

import * as React from "react";
import { Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { getGiftCards } from "@/lib/mock";
import { formatINR, formatLongDate } from "@/lib/format";
import { Tbc } from "@/components/pages/home/Tbc";

/**
 * Buying a gift card — site-content "Page: Gift cards".
 *
 * This is the thing that still converts on a sold-out day: when the run is
 * gone, it is the only purchase left on the site, which is why the sold-out
 * module links straight here.
 *
 * Whether cards expire is still a founder question, so the page says that
 * plainly in the same sentence as the delivery promise rather than hiding it
 * in the terms.
 *
 * Mocked: the form validates and confirms in place. Nothing leaves the browser.
 */

export function GiftCardBuy() {
  const cards = getGiftCards();
  const [amount, setAmount] = React.useState<number>(cards.denominations[1] ?? 1000);
  const [custom, setCustom] = React.useState("");
  const [qty, setQty] = React.useState(1);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [date, setDate] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const ids = {
    custom: React.useId(),
    name: React.useId(),
    phone: React.useId(),
    date: React.useId(),
    message: React.useId(),
  };

  const customAmount = Number(custom.replace(/\D/g, ""));
  const value = custom ? customAmount : amount;
  const total = value * qty;

  function submit() {
    const next: Record<string, string> = {};
    if (!value || value < 100) next.custom = "Pick an amount, or type one over ₹100.";
    if (!name.trim()) next.name = "We need this one.";
    if (phone.replace(/\D/g, "").length !== 10)
      next.phone = "That doesn't look like a 10-digit number.";
    if (!date) next.date = "Pick the day it should land.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 700);
  }

  if (sent) {
    return (
      <div className="rounded-md bg-success-tint p-6">
        <p className="flex items-start gap-3 text-body text-ink-800">
          <Check
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-success"
          />
          <span>
            Scheduled. {formatINR(total)} lands on {name}&rsquo;s WhatsApp on{" "}
            {formatLongDate(date)}.
          </span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 -ml-3"
          onClick={() => setSent(false)}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* -------- Amount ------------------------------------------------ */}
      <fieldset>
        <legend className="micro text-ink-600">Amount</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {cards.denominations.map((denomination) => {
            const selected = !custom && amount === denomination;
            return (
              <button
                key={denomination}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setAmount(denomination);
                  setCustom("");
                }}
                className={cn(
                  "h-11 rounded-sm border px-5 font-display text-title italic tabular transition-colors duration-[var(--dur-fast)]",
                  selected
                    ? "border-ink-800 bg-ink-800 text-paper-0"
                    : "border-paper-400 bg-paper-0 text-ink-800 hover:border-ink-600",
                )}
              >
                {formatINR(denomination)}
              </button>
            );
          })}
          {cards.customAllowed ? (
            <div className="w-40">
              <Input
                id={ids.custom}
                aria-label="Another amount"
                inputMode="numeric"
                prefix="₹"
                placeholder="Other"
                value={custom}
                invalid={Boolean(errors.custom)}
                onChange={(e) => setCustom(e.target.value)}
                className="font-mono tabular"
              />
            </div>
          ) : null}
        </div>
        {errors.custom ? (
          <p className="mt-2 text-caption text-danger">{errors.custom}</p>
        ) : null}
      </fieldset>

      {/* -------- Quantity ---------------------------------------------- */}
      <div className="mt-8 flex items-center justify-between gap-4 border-y border-y-paper-300 py-4">
        <span className="micro text-ink-600">How many</span>
        <QtyStepper
          qty={qty}
          onIncrement={() => setQty((q) => Math.min(10, q + 1))}
          onDecrement={() => setQty((q) => Math.max(1, q - 1))}
          label="Number of gift cards"
        />
      </div>

      {/* -------- Recipient --------------------------------------------- */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field label="Who it is for" htmlFor={ids.name} error={errors.name}>
          <Input
            id={ids.name}
            autoComplete="name"
            value={name}
            invalid={Boolean(errors.name)}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field
          label="Their mobile number"
          htmlFor={ids.phone}
          helper="The card arrives on WhatsApp."
          error={errors.phone}
        >
          <Input
            id={ids.phone}
            type="tel"
            inputMode="tel"
            maxLength={10}
            prefix="+91"
            value={phone}
            invalid={Boolean(errors.phone)}
            onChange={(e) => setPhone(e.target.value)}
            className="font-mono tabular"
          />
        </Field>

        <Field label="Deliver on" htmlFor={ids.date} error={errors.date}>
          <Input
            id={ids.date}
            type="date"
            value={date}
            invalid={Boolean(errors.date)}
            onChange={(e) => setDate(e.target.value)}
            className="font-mono tabular"
          />
        </Field>

        <Field
          label="A message"
          htmlFor={ids.message}
          helper="Optional. It sits above the card."
        >
          <Textarea
            id={ids.message}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Happy birthday. Eat the loaf warm."
          />
        </Field>
      </div>

      <Button
        size="lg"
        fullWidth
        className="mt-8"
        loading={sending}
        onClick={submit}
        icon={<MessageCircle size={20} strokeWidth={1.5} />}
        iconPosition="leading"
      >
        Send the card · {formatINR(total)}
      </Button>

      <p className="mt-3 text-caption text-ink-500">
        Delivered on WhatsApp on the date you pick. Whether a card expires is
        still being settled <Tbc what="Gift card expiry" />, so we will say so
        here before it does.
      </p>
    </div>
  );
}

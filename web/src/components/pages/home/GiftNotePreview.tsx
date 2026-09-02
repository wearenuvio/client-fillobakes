"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Field, Textarea, Switch } from "@/components/ui/Field";

/**
 * The gift note — site-content "Page: Gifting" §3 and §4.
 *
 * 140 characters, written on the card by hand, with a card-shaped live
 * preview so the sender can see the thing that arrives rather than a form
 * field. Prices are hidden from the recipient by default, and that default is
 * shown as a control rather than buried in a policy.
 */

const LIMIT = 140;

export function GiftNotePreview() {
  const [note, setNote] = React.useState("");
  const [hidePrices, setHidePrices] = React.useState(true);
  const fieldId = React.useId();
  const over = note.length > LIMIT;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
      <div>
        <Field
          label="Your note"
          htmlFor={fieldId}
          helper="140 characters. We write it on the card by hand."
          error={over ? "That is longer than the card. Trim it a little." : undefined}
        >
          <Textarea
            id={fieldId}
            value={note}
            invalid={over}
            maxLength={LIMIT + 40}
            placeholder="Happy birthday. Eat the loaf warm."
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
        <p
          className={cn(
            "micro mt-2 tabular",
            over ? "text-danger" : "text-ink-500",
          )}
        >
          {note.length} / {LIMIT}
        </p>

        <div className="mt-6 border-t border-t-paper-300 pt-6">
          <Switch
            checked={hidePrices}
            onCheckedChange={setHidePrices}
            label="Hide prices from the recipient"
            helper="On by default. The packing slip and every message to them leaves the total out."
          />
        </div>
      </div>

      {/* The card itself, at the ratio it is printed. */}
      <div>
        <p className="micro text-ink-500">On the card</p>
        <div className="mt-3 flex aspect-3/2 flex-col justify-between rounded-md border border-paper-300 bg-paper-0 p-6">
          <p className="font-display text-display-sm text-ink-800">
            {note.trim() ? note.slice(0, LIMIT) : "Your note goes here."}
          </p>
          <p className="micro text-ink-500">
            Fillo Bakes · Bengaluru
            {hidePrices ? " · no prices on this one" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

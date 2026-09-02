"use client";

import * as React from "react";
import { Check, MessageCircle, Repeat } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCartStore } from "@/store/cart";

/**
 * The three things a confirmation is actually for: keep the date, watch the
 * van, and be told before it arrives. All three are mocked locally — nothing
 * on this page talks to a back end.
 */
export function OrderActions({
  orderId,
  calendar,
}: {
  orderId: string;
  /** "Saturday 3 October, 4:40–5:10 PM · Indiranagar, 12th Main" */
  calendar: string;
}) {
  const { toast } = useToast();
  const [optedIn, setOptedIn] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        size="md"
        onClick={() =>
          toast({
            message: `Added. ${calendar}.`,
            tone: "success",
          })
        }
      >
        Add to calendar
      </Button>

      <ButtonLink href="/van" variant="secondary" size="md">
        Track the van
      </ButtonLink>

      {optedIn ? (
        <p className="flex items-center gap-2 text-body-sm text-success">
          <Check size={16} strokeWidth={1.5} aria-hidden="true" />
          WhatsApp updates on for {orderId}.
        </p>
      ) : (
        <Button
          variant="ghost"
          size="md"
          icon={<MessageCircle size={20} strokeWidth={1.5} />}
          iconPosition="leading"
          onClick={() => setOptedIn(true)}
        >
          Get WhatsApp updates
        </Button>
      )}
    </div>
  );
}

/** Fillo+ is free and the phone is already verified, so this is one tap. */
export function JoinFilloPlus() {
  const [joined, setJoined] = React.useState(false);

  if (joined) {
    return (
      <p className="flex items-center gap-2 text-body text-success">
        <Check size={20} strokeWidth={1.5} aria-hidden="true" />
        You’re in. Coins land the moment this order is delivered, not when you pay.
      </p>
    );
  }

  return (
    <Button size="lg" onClick={() => setJoined(true)}>
      Join Fillo+ — free
    </Button>
  );
}

/** Re-order in one tap, straight into the box. */
export function OrderAgain({ slugs }: { slugs: { slug: string; qty: number }[] }) {
  const add = useCartStore((s) => s.add);
  const open = useCartStore((s) => s.open);

  return (
    <Button
      variant="secondary"
      size="md"
      icon={<Repeat size={20} strokeWidth={1.5} />}
      iconPosition="leading"
      onClick={() => {
        for (const line of slugs) add(line.slug, line.qty);
        open();
      }}
    >
      Order again
    </Button>
  );
}

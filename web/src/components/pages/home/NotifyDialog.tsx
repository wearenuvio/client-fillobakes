"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { getNotifyMeCopy } from "@/lib/mock";

/**
 * The notify-me sheet — DESIGN.md §12.31, site-content microcopy library.
 *
 * WhatsApp, not web push. Never a cold prompt on load: this only opens after a
 * value moment, which here is a sold-out bake or a sold-out card. The
 * expectation IS the pitch, so what the message says and how often it comes is
 * stated above the button — and `Not now` is a real, full-size ghost button
 * beside the primary, never an x in a corner.
 *
 * Mocked: a delay, then a toast. Nothing leaves the browser.
 */

export function NotifyDialog({
  open,
  onClose,
  /** "Seoul Spice" — named so the promise is about a real thing. */
  subject,
}: {
  open: boolean;
  onClose: () => void;
  subject?: string | null;
}) {
  const { toast } = useToast();
  const notify = getNotifyMeCopy();
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const fieldId = React.useId();

  React.useEffect(() => {
    if (!open) {
      setPhone("");
      setError(null);
      setSending(false);
    }
  }, [open]);

  function submit() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("That doesn't look like a 10-digit number.");
      return;
    }
    setError(null);
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      onClose();
      toast({
        message: "Done. You'll hear before anyone else does.",
        tone: "success",
      });
    }, 700);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        subject
          ? `Tell me when the ${subject} is back`
          : "Tell me when the van's back out"
      }
      description="One message, Sunday morning. Nothing else."
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose}>
            Not now
          </Button>
          <Button
            size="md"
            loading={sending}
            onClick={submit}
            icon={<MessageCircle size={20} strokeWidth={1.5} />}
            iconPosition="leading"
          >
            Get the nudge on WhatsApp
          </Button>
        </>
      }
    >
      <Field
        label="Mobile number"
        htmlFor={fieldId}
        helper={notify.copy.footnote}
        error={error}
      >
        <Input
          id={fieldId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          maxLength={10}
          prefix="+91"
          invalid={Boolean(error)}
          value={phone}
          disabled={sending}
          onChange={(e) => setPhone(e.target.value)}
          className="font-mono tabular"
        />
      </Field>
    </Dialog>
  );
}

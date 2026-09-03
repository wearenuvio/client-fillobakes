"use client";

import * as React from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { whatsappHref } from "@/lib/config";
import { TextField, TextAreaField } from "@/components/pages/content/Form";
import { useMockSubmit, isPhone } from "@/components/pages/content/useMockSubmit";

/**
 * The contact form — three fields, and a fallback rather than the main door.
 *
 * WhatsApp is the primary channel on this page, so this sits beside it and
 * asks for the least it can. Errors appear on blur, never on keystroke, and
 * success replaces the form in place: a success that has somewhere to live on
 * the page says so there rather than firing a toast into the corner.
 */

type Errors = { name?: string; phone?: string; message?: string };

export function ContactForm() {
  const { toast } = useToast();
  const { status, submit } = useMockSubmit();

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<Errors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  function validate(next = { name, phone, message }): Errors {
    const found: Errors = {};
    if (!next.name.trim()) found.name = "We need this one.";
    if (!next.phone.trim()) found.phone = "We need this one.";
    else if (!isPhone(next.phone))
      found.phone = "That does not look like a 10-digit number.";
    if (!next.message.trim()) found.message = "We need this one.";
    return found;
  }

  function blur(field: keyof Errors) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    setTouched({ name: true, phone: true, message: true });
    if (Object.keys(found).length > 0) return;
    submit(() =>
      toast({ message: "Sent. We reply within a day.", tone: "success" }),
    );
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-line bg-card p-6 lg:p-8">
        <p className="flex items-center gap-3 font-display text-[26px] leading-tight text-ink">
          <Check
            size={22}
            strokeWidth={1.5}
            className="shrink-0 text-success"
            aria-hidden="true"
          />
          Sent.
        </p>
        <p className="mt-3 max-w-[44ch] text-body text-ink-2">
          We reply within a day. If it is about an order going out this week,
          WhatsApp will always be quicker.
        </p>
        <ButtonLink
          href={whatsappHref("Hi Fillo — I just sent a message from the site.")}
          variant="secondary"
          className="mt-6"
          icon={<MessageCircle size={18} strokeWidth={1.5} />}
          iconPosition="leading"
        >
          Message us instead
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-5">
        <TextField
          id="contact-name"
          name="name"
          label="Your name"
          autoComplete="name"
          value={name}
          error={touched.name ? errors.name : undefined}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => blur("name")}
        />
        <TextField
          id="contact-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          prefix="+91"
          placeholder="98765 43210"
          helper="So we can answer on WhatsApp."
          value={phone}
          error={touched.phone ? errors.phone : undefined}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => blur("phone")}
        />
        <TextAreaField
          id="contact-message"
          name="message"
          label="What is this about"
          rows={5}
          placeholder="An order, an allergen, a street the van does not reach yet."
          value={message}
          error={touched.message ? errors.message : undefined}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => blur("message")}
        />
      </div>

      <Button type="submit" size="lg" className="mt-7" loading={status === "sending"}>
        Send it
      </Button>
    </form>
  );
}

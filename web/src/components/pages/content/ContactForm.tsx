"use client";

import * as React from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { whatsappHref } from "@/lib/config";
import { useMockSubmit, isPhone } from "@/components/pages/content/useMockSubmit";

/**
 * The contact form — a fallback, not the main door.
 *
 * WhatsApp is the primary channel on this page (site-content.md, Contact), so
 * this form is deliberately three fields and sits below it. Errors appear on
 * blur, never on keystroke (§12.24), and use the microcopy library's strings
 * verbatim: "We need this one." / "That doesn't look like a 10-digit number."
 *
 * Nothing is sent anywhere. Success replaces the form in place — a success
 * that has a place on the page says so there (Toast.tsx) — and a toast
 * confirms the action for anyone whose focus has moved on.
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
      found.phone = "That doesn't look like a 10-digit number.";
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
      toast({
        message: "Message noted. We reply on WhatsApp faster than by email.",
        tone: "success",
      }),
    );
  }

  if (status === "sent") {
    return (
      <div className="border-y border-y-paper-300 py-8">
        <p className="flex items-center gap-3 text-title font-sans font-semibold text-ink-800">
          <Check size={20} strokeWidth={1.5} className="text-success" aria-hidden="true" />
          Got it.
        </p>
        <p className="mt-3 max-w-[46ch] text-body text-ink-600">
          We read everything, and we answer during bakery hours. If it is about
          an order going out this week, WhatsApp will always be quicker.
        </p>
        <ButtonLink
          href={whatsappHref("Hi Fillo — I just sent a message from the site.")}
          variant="secondary"
          className="mt-6"
          icon={<MessageCircle size={20} strokeWidth={1.5} />}
        >
          Message us on WhatsApp
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[var(--max-narrow)]">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Your name"
          htmlFor="contact-name"
          error={touched.name ? errors.name : undefined}
        >
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={name}
            invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? "contact-name-error" : undefined}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => blur("name")}
          />
        </Field>

        <Field
          label="Phone"
          htmlFor="contact-phone"
          helper="So we can answer on WhatsApp."
          error={touched.phone ? errors.phone : undefined}
        >
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            prefix="+91"
            placeholder="98765 43210"
            className="font-mono"
            value={phone}
            invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby={
              touched.phone && errors.phone ? "contact-phone-error" : "contact-phone-helper"
            }
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => blur("phone")}
          />
        </Field>
      </div>

      <Field
        label="What's this about"
        htmlFor="contact-message"
        className="mt-6"
        error={touched.message ? errors.message : undefined}
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="An order, an allergen, a street the van doesn't reach yet."
          value={message}
          invalid={Boolean(touched.message && errors.message)}
          aria-describedby={
            touched.message && errors.message ? "contact-message-error" : undefined
          }
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => blur("message")}
        />
      </Field>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" loading={status === "sending"}>
          Send it
        </Button>
        <p className="text-caption text-ink-500">
          Nothing here is stored yet — this front end has no back end behind it.
        </p>
      </div>
    </form>
  );
}

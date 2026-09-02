"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { CONTACT } from "@/lib/config";
import { useMockSubmit, isPhone, isEmail } from "@/components/pages/content/useMockSubmit";

/**
 * The franchise enquiry form.
 *
 * The field set is carried over from the live site (site-content.md,
 * Franchise): the investment bands, the experience level and the formats of
 * interest, which already include the moving bakery. The qualifying questions
 * come first, because this page exists for perhaps twenty people a year and
 * the founders' time is the scarce resource.
 *
 * The dummy +91 98765 43210 that has been publicly live on this page does not
 * appear anywhere in this component; the real WhatsApp number is the only
 * number on the page.
 */

const INVESTMENT_BANDS = [
  "₹5–10 lakh",
  "₹10–20 lakh",
  "₹20–50 lakh",
  "₹50 lakh and above",
] as const;

const EXPERIENCE = [
  "No food business experience",
  "Worked in food or hospitality",
  "Currently run a food business",
  "Investing, with an operator in mind",
] as const;

const FORMATS = [
  "Moving bakery — a van and a route",
  "Physical store",
  "Cloud kitchen",
  "Pop-up and events",
] as const;

type Errors = {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  investment?: string;
  formats?: string;
};

export function FranchiseForm() {
  const { toast } = useToast();
  const { status, submit } = useMockSubmit(1100);

  const [values, setValues] = React.useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    investment: "",
    experience: EXPERIENCE[0] as string,
    note: "",
  });
  const [formats, setFormats] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Errors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  function set(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  const validate = React.useCallback(
    (v = values, f = formats): Errors => {
      const found: Errors = {};
      if (!v.name.trim()) found.name = "We need this one.";
      if (!v.phone.trim()) found.phone = "We need this one.";
      else if (!isPhone(v.phone))
        found.phone = "That doesn't look like a 10-digit number.";
      if (!v.email.trim()) found.email = "We need this one.";
      else if (!isEmail(v.email)) found.email = "That address is missing something.";
      if (!v.city.trim()) found.city = "We need this one.";
      if (!v.investment) found.investment = "Pick the band you're closest to.";
      if (f.length === 0) found.formats = "Pick at least one.";
      return found;
    },
    [values, formats],
  );

  function blur(field: keyof Errors) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  }

  function toggleFormat(format: string) {
    setFormats((current) => {
      const next = current.includes(format)
        ? current.filter((f) => f !== format)
        : [...current, format];
      setErrors(validate(values, next));
      return next;
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    setTouched({
      name: true,
      phone: true,
      email: true,
      city: true,
      investment: true,
      formats: true,
    });
    if (Object.keys(found).length > 0) return;
    submit(() =>
      toast({ message: "Enquiry noted. A founder reads these, not a form inbox.", tone: "success" }),
    );
  }

  if (status === "sent") {
    return (
      <div className="border-y border-y-paper-300 py-10">
        <p className="flex items-center gap-3 text-title font-sans font-semibold text-ink-800">
          <Check size={20} strokeWidth={1.5} className="text-success" aria-hidden="true" />
          Enquiry noted.
        </p>
        <p className="mt-3 max-w-[46ch] text-body text-ink-600">
          One of the two founders reads these. We have not set a promised
          turnaround yet, so we are not going to print one — but you will hear
          from a person, and the first conversation is a call, not a deck.
        </p>
        <p className="mt-6 text-body-sm text-ink-500">
          Faster, if you would rather:{" "}
          <a
            href={`mailto:${CONTACT.email}`}
            className="link-underline text-kiln"
          >
            {CONTACT.email}
          </a>
          {" · "}
          <span className="tabular">{CONTACT.phone}</span> on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[var(--max-narrow)]">
      <fieldset className="border-0 p-0">
        <legend className="micro text-kiln">The qualifying part</legend>

        <Field
          label="What you would want to run"
          className="mt-6"
          error={touched.formats ? errors.formats : undefined}
        >
          <div className="mt-1 grid gap-1 sm:grid-cols-2">
            {FORMATS.map((format) => (
              <Checkbox
                key={format}
                name="formats"
                value={format}
                label={format}
                checked={formats.includes(format)}
                onChange={() => toggleFormat(format)}
                onBlur={() => blur("formats")}
              />
            ))}
          </div>
        </Field>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field
            label="Investment you can commit"
            htmlFor="fr-investment"
            error={touched.investment ? errors.investment : undefined}
          >
            <Select
              id="fr-investment"
              name="investment"
              value={values.investment}
              invalid={Boolean(touched.investment && errors.investment)}
              onChange={(e) => set("investment", e.target.value)}
              onBlur={() => blur("investment")}
            >
              <option value="">Pick a band</option>
              {INVESTMENT_BANDS.map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Where you are with food" htmlFor="fr-experience">
            <Select
              id="fr-experience"
              name="experience"
              value={values.experience}
              onChange={(e) => set("experience", e.target.value)}
            >
              {EXPERIENCE.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-12 border-0 p-0">
        <legend className="micro text-kiln">How to reach you</legend>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Field
            label="Your name"
            htmlFor="fr-name"
            error={touched.name ? errors.name : undefined}
          >
            <Input
              id="fr-name"
              name="name"
              autoComplete="name"
              value={values.name}
              invalid={Boolean(touched.name && errors.name)}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => blur("name")}
            />
          </Field>

          <Field
            label="City you would run it in"
            htmlFor="fr-city"
            error={touched.city ? errors.city : undefined}
          >
            <Input
              id="fr-city"
              name="city"
              autoComplete="address-level2"
              placeholder="Bengaluru"
              value={values.city}
              invalid={Boolean(touched.city && errors.city)}
              onChange={(e) => set("city", e.target.value)}
              onBlur={() => blur("city")}
            />
          </Field>

          <Field
            label="Phone"
            htmlFor="fr-phone"
            error={touched.phone ? errors.phone : undefined}
          >
            <Input
              id="fr-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              prefix="+91"
              placeholder="98765 43210"
              className="font-mono"
              value={values.phone}
              invalid={Boolean(touched.phone && errors.phone)}
              onChange={(e) => set("phone", e.target.value)}
              onBlur={() => blur("phone")}
            />
          </Field>

          <Field
            label="Email"
            htmlFor="fr-email"
            error={touched.email ? errors.email : undefined}
          >
            <Input
              id="fr-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              invalid={Boolean(touched.email && errors.email)}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => blur("email")}
            />
          </Field>
        </div>

        <Field
          label="Anything else"
          htmlFor="fr-note"
          className="mt-6"
          helper="Optional. The neighbourhood you have in mind is the useful part."
        >
          <Textarea
            id="fr-note"
            name="note"
            rows={4}
            value={values.note}
            onChange={(e) => set("note", e.target.value)}
          />
        </Field>
      </fieldset>

      <div className="mt-8">
        <Button type="submit" size="lg" loading={status === "sending"}>
          Send enquiry
        </Button>
        <p className="mt-4 max-w-[62ch] text-caption text-ink-500">
          We read every one. We have not measured a reply time yet, so we are
          not going to promise one here. Nothing on this front end is sent
          anywhere — it is a mock.
        </p>
      </div>
    </form>
  );
}

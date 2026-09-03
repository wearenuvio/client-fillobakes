"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CONTACT } from "@/lib/config";
import {
  TextField,
  TextAreaField,
  SelectField,
  CheckRow,
  FieldLabel,
} from "@/components/pages/content/Form";
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
        found.phone = "That does not look like a 10-digit number.";
      if (!v.email.trim()) found.email = "We need this one.";
      else if (!isEmail(v.email)) found.email = "That address is missing something.";
      if (!v.city.trim()) found.city = "We need this one.";
      if (!v.investment) found.investment = "Pick the band you are closest to.";
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
      <div className="rounded-lg border border-line bg-card p-6 lg:p-8">
        <p className="flex items-center gap-3 font-display text-[26px] leading-tight text-ink">
          <Check
            size={22}
            strokeWidth={1.5}
            className="shrink-0 text-success"
            aria-hidden="true"
          />
          Enquiry noted.
        </p>
        <p className="mt-3 max-w-[46ch] text-body text-ink-2">
          A founder reads these, not a form inbox. You will hear from a person,
          and the first conversation is a call rather than a deck.
        </p>
        <p className="mt-6 text-body-sm text-muted">
          Faster, if you would rather:{" "}
          <a href={`mailto:${CONTACT.email}`} className="link-underline font-medium text-accent">
            {CONTACT.email}
          </a>
          {" · "}
          <span className="tabular">{CONTACT.phone}</span> on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <fieldset className="border-0 p-0">
        <legend className="text-[12px] font-medium tracking-[0.12em] text-accent uppercase">
          The qualifying part
        </legend>

        <div className="mt-6">
          <FieldLabel>What you would want to run</FieldLabel>
          <div className="grid gap-1 sm:grid-cols-2">
            {FORMATS.map((format) => (
              <CheckRow
                key={format}
                id={`fr-format-${format.slice(0, 8).replace(/\W/g, "")}`}
                name="formats"
                value={format}
                label={format}
                checked={formats.includes(format)}
                onChange={() => toggleFormat(format)}
                onBlur={() => blur("formats")}
              />
            ))}
          </div>
          {touched.formats && errors.formats ? (
            <p role="alert" className="mt-2 text-body-sm text-accent">
              {errors.formats}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <SelectField
            id="fr-investment"
            name="investment"
            label="Investment you can commit"
            value={values.investment}
            error={touched.investment ? errors.investment : undefined}
            onChange={(e) => set("investment", e.target.value)}
            onBlur={() => blur("investment")}
          >
            <option value="">Pick a band</option>
            {INVESTMENT_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="fr-experience"
            name="experience"
            label="Where you are with food"
            value={values.experience}
            onChange={(e) => set("experience", e.target.value)}
          >
            {EXPERIENCE.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectField>
        </div>
      </fieldset>

      <fieldset className="mt-12 border-0 p-0">
        <legend className="text-[12px] font-medium tracking-[0.12em] text-accent uppercase">
          How to reach you
        </legend>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField
            id="fr-name"
            name="name"
            label="Your name"
            autoComplete="name"
            value={values.name}
            error={touched.name ? errors.name : undefined}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => blur("name")}
          />
          <TextField
            id="fr-city"
            name="city"
            label="City you would run it in"
            autoComplete="address-level2"
            placeholder="Bengaluru"
            value={values.city}
            error={touched.city ? errors.city : undefined}
            onChange={(e) => set("city", e.target.value)}
            onBlur={() => blur("city")}
          />
          <TextField
            id="fr-phone"
            name="phone"
            label="Phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            prefix="+91"
            placeholder="98765 43210"
            value={values.phone}
            error={touched.phone ? errors.phone : undefined}
            onChange={(e) => set("phone", e.target.value)}
            onBlur={() => blur("phone")}
          />
          <TextField
            id="fr-email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={values.email}
            error={touched.email ? errors.email : undefined}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => blur("email")}
          />
        </div>

        <TextAreaField
          id="fr-note"
          name="note"
          label="Anything else"
          className="mt-5"
          rows={4}
          helper="Optional. The neighbourhood you have in mind is the useful part."
          value={values.note}
          onChange={(e) => set("note", e.target.value)}
        />
      </fieldset>

      <Button type="submit" size="lg" className="mt-8" loading={status === "sending"}>
        Send enquiry
      </Button>
    </form>
  );
}

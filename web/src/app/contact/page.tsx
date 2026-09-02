import type { Metadata } from "next";
import { AtSign, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Rule, Kicker } from "@/components/ui/Rule";
import { RuleHeading } from "@/components/pages/content/RuleHeading";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { Lead } from "@/components/pages/content/Prose";
import { ContactForm } from "@/components/pages/content/ContactForm";
import { SITE, CONTACT, whatsappHref } from "@/lib/config";
import { getServedAreas } from "@/lib/mock";

const PATH = "/contact";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Talk to us — site-content.md, Page: Contact.
 *
 * WhatsApp is the primary channel and is given the primary button; everything
 * else is a hairline row of plain facts. One email address, the real one, on
 * every page of this site — the live site's second Gmail does not appear here.
 */
export default function ContactPage() {
  const areas = getServedAreas();

  const rows = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: CONTACT.phone,
      href: whatsappHref("Hi Fillo — a question from the site."),
      note: "Do you reach me, is it really eggless, can I get it Saturday. All three are quicker in chat.",
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      note: "For anything with an attachment, or anything you want in writing.",
    },
    {
      icon: AtSign,
      label: "Instagram",
      value: CONTACT.instagramHandle,
      href: CONTACT.instagram,
      note: "What came out of the oven, and where the van is going.",
      external: true,
    },
    {
      icon: MapPin,
      label: "Where",
      value: `${SITE.city}, ${SITE.state}`,
      note: `The van runs neighbourhood routes across ${areas.length} areas so far.`,
    },
    {
      icon: Clock,
      label: "Hours",
      value: SITE.hoursLabel,
      note: "The kitchen starts a lot earlier than that. The phone does not.",
    },
  ];

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Contact", path: PATH }]}
        nodes={[bakeryLd(areas.map((a) => a.name))]}
      />

      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="van" side="right" size={560} />
        <div className="relative max-w-[var(--max-narrow)]">
          <Kicker>Contact</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">Talk to us</h1>
          <Lead className="mt-6">
            WhatsApp is fastest. We read everything.
          </Lead>
          <div className="mt-8">
            <ButtonLink
              href={whatsappHref("Hi Fillo — a question from the site.")}
              size="lg"
              icon={<MessageCircle size={20} strokeWidth={1.5} />}
              iconPosition="leading"
            >
              Message us on WhatsApp
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <RuleHeading>The details</RuleHeading>
            <p className="mt-6 max-w-[46ch] text-body text-ink-600">
              One number, one address, one account. If you find a different one
              anywhere, it is out of date and we would like to know.
            </p>
          </div>

          <dl className="lg:col-span-8">
            {rows.map(({ icon: Icon, ...row }) => (
              <div
                key={row.label}
                className="grid gap-2 border-t border-t-paper-300 py-6 last:border-b last:border-b-paper-300 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <dt className="micro flex items-center gap-2 pt-1 text-ink-500">
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                  {row.label}
                </dt>
                <dd>
                  {row.href ? (
                    <a
                      href={row.href}
                      {...(row.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="link-underline inline-flex min-h-11 items-center text-body-lg text-ink-800 tabular"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="block py-2 text-body-lg text-ink-800 tabular">
                      {row.value}
                    </span>
                  )}
                  <p className="mt-1 max-w-[52ch] text-body-sm text-ink-500">
                    {row.note}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Rule label="Or write it down" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              Three fields, no ticket number
            </h2>
            <p className="mt-4 max-w-[46ch] text-body text-ink-600">
              This goes to the same two people as everything else. If it is
              about a box going out this week, use WhatsApp instead &mdash; the
              van does not check email.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="max-w-[var(--max-narrow)]">
          <RuleHeading>Before you write</RuleHeading>
          <p className="mt-6 max-w-[62ch] text-body text-ink-600">
            Most questions have an answer already: where the van goes, how late
            you can order, what eggless means here, and what happens if a box
            arrives wrong.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/faq" variant="secondary">
              Fifteen questions
            </ButtonLink>
            <ButtonLink href="/policies/shipping" variant="ghost">
              The delivery policy
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}

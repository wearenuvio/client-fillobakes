import type { Metadata } from "next";
import { AtSign, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { buildMetadata, JsonLd, bakeryLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/blocks/PageHeader";
import {
  ContentSection,
  Eyebrow,
} from "@/components/pages/content/PageShell";
import { ContactForm } from "@/components/pages/content/ContactForm";
import { SITE, CONTACT, whatsappHref } from "@/lib/config";
import { getServedAreas } from "@/lib/mock";

const PATH = "/contact";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Talk to us — PAGES-v2 Contact.
 *
 * Two columns: the details on one side, three fields on the other. WhatsApp
 * gets the only terracotta button on the page, because it is the channel that
 * actually answers.
 */
export default function ContactPage() {
  const areas = getServedAreas();

  const rows = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: CONTACT.phone,
      href: whatsappHref("Hi Fillo — a question from the site."),
      note: "The fastest way to reach a person.",
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      note: "For anything you want in writing.",
    },
    {
      icon: AtSign,
      label: "Instagram",
      value: CONTACT.instagramHandle,
      href: CONTACT.instagram,
      note: "What came out of the oven this morning.",
      external: true,
    },
    {
      icon: MapPin,
      label: "Where",
      value: `${SITE.city}, ${SITE.state}`,
      note: `Neighbourhood routes across ${areas.length} areas so far.`,
    },
    {
      icon: Clock,
      label: "Hours",
      value: SITE.hoursLabel,
      note: "The kitchen starts earlier. The phone does not.",
    },
  ];

  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Contact", path: PATH }]}
        nodes={[bakeryLd(areas.map((a) => a.name))]}
      />

      <PageHeader
        script="We read everything."
        title="Talk to us"
        lede="WhatsApp is fastest. Everything else reaches the same two people."
        art="bakery-van"
        artSize="lg"
      >
        <ButtonLink
          href={whatsappHref("Hi Fillo — a question from the site.")}
          size="lg"
          icon={<MessageCircle size={18} strokeWidth={1.5} />}
          iconPosition="leading"
        >
          Message us on WhatsApp
        </ButtonLink>
      </PageHeader>

      <ContentSection surface="paper" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ---- The details ------------------------------------------ */}
          <div className="lg:col-span-5">
            <Eyebrow>The details</Eyebrow>
            <dl className="mt-5 border-t border-line">
              {rows.map(({ icon: Icon, ...row }) => (
                <div key={row.label} className="border-b border-line py-5">
                  <dt className="flex items-center gap-2 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                    <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                    {row.label}
                  </dt>
                  <dd className="mt-2">
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(row.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="link-underline inline-flex min-h-11 items-center text-body-lg font-medium text-accent tabular"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="block py-2 text-body-lg text-ink tabular">
                        {row.value}
                      </span>
                    )}
                    <p className="mt-1 max-w-[40ch] text-body-sm text-muted">
                      {row.note}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ---- The form --------------------------------------------- */}
          <div className="lg:col-span-7">
            <Eyebrow>Or write it down</Eyebrow>
            <h2 className="mt-3 max-w-[16ch] text-h2 text-ink">
              Three fields, no ticket number.
            </h2>
            <p className="mt-4 max-w-[46ch] text-body-lg text-ink-2">
              If it is about an order going out this week, use WhatsApp. The van
              does not check email.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection surface="paper-2" size="half">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[46ch] text-body-lg text-ink-2">
            Most questions already have an answer: where the van goes, how late
            you can order, and what happens if a box arrives wrong.
          </p>
          <ButtonLink href="/faq" variant="secondary" className="shrink-0">
            Read the questions
          </ButtonLink>
        </div>
      </ContentSection>
    </>
  );
}

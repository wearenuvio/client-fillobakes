import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Rule, Kicker } from "@/components/ui/Rule";
import { RuleHeading } from "@/components/pages/content/RuleHeading";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { Lead } from "@/components/pages/content/Prose";
import { HonestSpecList } from "@/components/pages/content/PendingSpecs";
import { FranchiseForm } from "@/components/pages/content/FranchiseForm";
import { SITE, CONTACT, whatsappHref } from "@/lib/config";
import { getProducts } from "@/lib/catalog";
import { getRoutes } from "@/lib/mock";

const PATH = "/franchise";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Partner with Fillo Bakes — site-content.md, Page: Franchise.
 *
 * Kept, trimmed and de-risked. Two claims are gone for good: "established
 * presence with thousands of loyal customers" (the home page says nothing of
 * the sort, and two numbers that disagree tell a prospective partner that
 * neither is real) and "scalable business model with strong margins" (a margin
 * claim on a public page invites a question that belongs in a call).
 *
 * The dummy +91 98765 43210 that was publicly live on this page is not here.
 * The only number on the page is the real WhatsApp line.
 */
export default function FranchisePage() {
  const itemCount = getProducts().length;
  const routeCount = getRoutes().length;

  const offering = [
    {
      title: "A tight product range, already tested",
      body: `${itemCount} items and one kitchen method, settled by more than 300 first-time tasters before the first van ran. You are not being asked to invent a menu.`,
    },
    {
      title: "The moving bakery model",
      body: "The route structure, the stop-and-window system, and the tracker that customers actually use to find the van.",
    },
    {
      title: "Training, operations and marketing support",
      body: "How the kitchen runs, how a run is planned, and how the week is sold. The eggless method is the part that takes longest to teach.",
    },
  ];

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Franchise", path: PATH }]} />

      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="van" side="right" size={620} />
        <div className="relative max-w-[var(--max-narrow)]">
          <Kicker>Franchise and partnerships</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">
            Partner with Fillo Bakes
          </h1>
          <Lead className="mt-6">
            We&rsquo;re looking for a small number of operators who want to run
            a route.
          </Lead>
          <p className="mt-6 max-w-[62ch] text-body text-ink-600">
            Founded December 2025. One van, running neighbourhood routes in{" "}
            {SITE.city}. That is the whole company, and it is the honest place
            to start a conversation about a second one.
          </p>
        </div>
      </Section>

      <Section surface="paper-100" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <RuleHeading>What we&rsquo;re offering</RuleHeading>
          </div>
          <ol className="lg:col-span-8">
            {offering.map((item, index) => (
              <li
                key={item.title}
                className="flex gap-6 border-t border-t-paper-300 py-6 last:border-b last:border-b-paper-300"
              >
                <span className="micro w-8 shrink-0 pt-1 text-ink-400 tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-sans text-title font-semibold text-ink-800">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[52ch] text-body text-ink-600">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Rule label="Where we actually are" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              The numbers, unrounded
            </h2>
            <p className="mt-4 max-w-[46ch] text-body text-ink-600">
              Anything not on this list is something we have not measured yet,
              and we would rather say that here than in the second meeting.
            </p>
          </div>
          <div className="lg:col-span-7">
            <HonestSpecList
              specs={[
                { label: "Founded", value: "December 2025" },
                { label: "Vans on the road", value: "1" },
                { label: "Routes", value: `${routeCount} in ${SITE.city}` },
                { label: "Menu", value: `${itemCount} items, all eggless` },
                { label: "Entity", value: SITE.legalName },
                { label: "Unit economics", value: "TBC — discussed on a call, not in HTML" },
                { label: "Franchise fee", value: "TBC — not set" },
              ]}
              pendingLead="Not published:"
              claim="One van, one kitchen method, and a menu that survived being tasted by strangers."
            />
          </div>
        </div>
      </Section>

      <Section surface="paper-100">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Rule label="Interest form" tone="strong" />
            <h2 className="mt-6 text-display-md text-ink-800">
              Tell us about you
            </h2>
            <p className="mt-4 max-w-[46ch] text-body text-ink-600">
              The qualifying questions are first on purpose. Both founders read
              these, and the first conversation is a call.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FranchiseForm />
          </div>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="max-w-[var(--max-narrow)]">
          <RuleHeading>Or just ask</RuleHeading>
          <p className="mt-6 max-w-[62ch] text-body text-ink-600">
            One number, one address, and they both reach{" "}
            {SITE.founders.join(" and ")}.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink
              href={whatsappHref("Hi Fillo — I'd like to talk about running a route.")}
              icon={<MessageCircle size={20} strokeWidth={1.5} />}
              iconPosition="leading"
            >
              Message us on WhatsApp
            </ButtonLink>
            <a
              href={`mailto:${CONTACT.email}`}
              className="link-underline inline-flex min-h-11 items-center text-body text-ink-600 hover:text-ink-800"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { InkArt } from "@/components/ui/InkArt";
import {
  ContentSection,
  PageHead,
  SectionHead,
  Eyebrow,
} from "@/components/pages/content/PageShell";
import { FranchiseForm } from "@/components/pages/content/FranchiseForm";
import { SITE, CONTACT, whatsappHref } from "@/lib/config";
import { getProducts } from "@/lib/catalog";
import { getRoutes } from "@/lib/mock";

const PATH = "/franchise";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Partner with Fillo Bakes — PAGES-v2 Franchise.
 *
 * Short: why partner, the form, the real contact. Two claims from the live
 * site are gone for good — "thousands of loyal customers", which contradicts
 * every other number on this site, and "strong margins", which invites a
 * question that belongs in a call. The dummy phone number that was publicly
 * live on this page is not here either; the only number is the real one.
 */
export default function FranchisePage() {
  const itemCount = getProducts().length;
  const routeCount = getRoutes().length;

  const offering = [
    {
      title: "A menu that is already settled",
      body: `${itemCount} items and one kitchen method, tested by more than 300 first-time tasters before the first van ran. You are not being asked to invent a menu.`,
    },
    {
      title: "The moving bakery model",
      body: `The route structure, the stop and window system, and the tracker customers actually use to find the van. ${routeCount} routes run on it today.`,
    },
    {
      title: "Training and operations",
      body: "How the kitchen runs, how a run is planned, and how a week is sold. The eggless method is the part that takes longest to teach.",
    },
  ];

  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: "Franchise", path: PATH }]} />

      <ContentSection
        surface="paper"
        size="none"
        className="overflow-hidden pt-10 pb-8 lg:pt-14"
      >
        <InkArt
          name="rolling-pin-and-flour-bag"
          width={400}
          opacity={0.1}
          className="top-1/2 right-[-70px] hidden -translate-y-1/2 lg:block"
        />
        <PageHead
          script="Run a route."
          title="Partner with Fillo Bakes"
          lead="We are looking for a small number of operators who want to run a route of their own."
        />
        <p className="mt-6 max-w-[54ch] text-body text-ink-2">
          Founded December 2025. One van, running neighbourhood routes in{" "}
          {SITE.city}. That is the whole company, and it is the honest place to
          start a conversation about a second one.
        </p>
      </ContentSection>

      <ContentSection surface="paper-2">
        <SectionHead eyebrow="What we offer" heading="Three things, and no deck." />
        <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {offering.map((item, index) => (
            <li
              key={item.title}
              className="rounded-lg border border-line bg-card p-6 lg:p-7"
            >
              <p className="text-body-sm text-muted tabular">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-[22px] leading-snug text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-body-sm text-ink-2">{item.body}</p>
            </li>
          ))}
        </ol>
      </ContentSection>

      <ContentSection surface="paper">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Interest form</Eyebrow>
            <h2 className="mt-3 max-w-[14ch] text-h2 text-ink">Tell us about you.</h2>
            <p className="mt-4 max-w-[42ch] text-body-lg text-ink-2">
              The qualifying questions come first on purpose. Both founders read
              these, and the first conversation is a call.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FranchiseForm />
          </div>
        </div>
      </ContentSection>

      <ContentSection surface="peach" size="half">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="max-w-[18ch] text-h2 text-ink">Or just ask.</h2>
            <p className="mt-3 max-w-[46ch] text-body-lg text-ink-2">
              One number and one address, and both reach{" "}
              {SITE.founders.join(" and ")}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink
              href={whatsappHref("Hi Fillo — I'd like to talk about running a route.")}
              icon={<MessageCircle size={18} strokeWidth={1.5} />}
              iconPosition="leading"
            >
              Message us
            </ButtonLink>
            <a
              href={`mailto:${CONTACT.email}`}
              className="link-underline text-body-sm font-semibold text-accent"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

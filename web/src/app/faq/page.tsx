import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd, faqLd } from "@/lib/seo";
import { Faq } from "@/components/blocks/Faq";
import { ButtonLink } from "@/components/ui/Button";
import {
  ContentSection,
  Eyebrow,
} from "@/components/pages/content/PageShell";
import { FAQ_GROUPS, FAQ_ITEMS } from "@/components/pages/content/faq-items";
import { whatsappHref } from "@/lib/config";

const PATH = "/faq";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Questions — PAGES-v2 FAQ.
 *
 * Four groups, one accordion, and a WhatsApp line at the bottom. The
 * accordion and the FAQPage JSON-LD are built from one array so the rich
 * result can never describe a page that no longer says that.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Questions", path: PATH }]}
        nodes={[faqLd(FAQ_ITEMS.map(({ question, answer }) => ({ question, answer })))]}
      />

      <PageHeader
        script="Ask us anything."
        title="Questions"
        lede="Everything people ask before their first order, and most of what they ask after it."
        art="wheat-pair"
        artSize="md"
      >
        <nav aria-label="Jump to a group" className="relative">
          <ul className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)]">
            {FAQ_GROUPS.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="inline-flex h-11 items-center gap-2 rounded-pill border border-line bg-card px-4 text-body-sm whitespace-nowrap text-ink-2 transition-colors duration-[var(--dur-base)] hover:border-ink hover:text-ink"
                >
                  {group.title}
                  <span className="text-muted tabular">{group.items.length}</span>
                </a>
              </li>
            ))}
          </ul>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-[calc(var(--gutter)*-1)] w-12 bg-linear-to-l from-paper to-transparent sm:hidden"
          />
        </nav>
      </PageHeader>

      <ContentSection surface="paper" size="half">
        {FAQ_GROUPS.map((group, index) => (
          <section
            key={group.id}
            id={group.id}
            className={index === 0 ? "scroll-mt-24" : "mt-14 scroll-mt-24 lg:mt-20"}
          >
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-14">
              {/* The group title takes the policies' contents column, so the
                  FAQ and the small print sit on the same grid. */}
              <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                <div className="flex items-center gap-4 lg:block">
                  <h2 className="shrink-0 font-display text-[26px] leading-tight text-ink">
                    {group.title}
                  </h2>
                  <span
                    className="h-px flex-1 bg-line lg:hidden"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 hidden text-body-sm text-muted tabular lg:block">
                  {group.items.length} answers
                </p>
              </div>

              <div className="lg:col-span-8">
                <Faq
                  measure="full"
                  headingLevel={3}
                  items={group.items.map((item) => ({
                    question: item.question,
                    answer: (
                      <>
                        <p>{item.answer}</p>
                        {item.link ? (
                          <p className="mt-4">
                            <Link href={item.link.href}>{item.link.label}</Link>
                          </p>
                        ) : null}
                      </>
                    ),
                  }))}
                />
              </div>
            </div>
          </section>
        ))}
      </ContentSection>

      <ContentSection surface="peach">
        <div className="max-w-[var(--max-narrow)]">
          <Eyebrow>Still wondering</Eyebrow>
          <h2 className="mt-3 max-w-[16ch] text-h2 text-ink">
            Message us and a person replies.
          </h2>
          <p className="mt-4 max-w-[46ch] text-body-lg text-ink-2">
            A question this page cannot answer is usually a question about your
            order, and that is faster in chat.
          </p>
          <ButtonLink
            href={whatsappHref("Hi Fillo — a question the FAQ didn't answer.")}
            size="lg"
            className="mt-7"
            icon={<MessageCircle size={18} strokeWidth={1.5} />}
            iconPosition="leading"
          >
            Message us on WhatsApp
          </ButtonLink>
        </div>
      </ContentSection>
    </>
  );
}

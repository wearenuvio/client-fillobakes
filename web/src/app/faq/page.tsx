import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildMetadata, JsonLd, faqLd } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { Kicker } from "@/components/ui/Rule";
import { Faq } from "@/components/blocks/Faq";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { Lead } from "@/components/pages/content/Prose";
import { FAQ_GROUPS, FAQ_ITEMS } from "@/components/pages/content/faq-items";
import { whatsappHref, CONTACT } from "@/lib/config";

const PATH = "/faq";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Questions — site-content.md, Page: FAQ.
 *
 * Fifteen answers in three groups. The accordion and the FAQPage JSON-LD are
 * built from one array (faq-items.ts) so the rich result can never describe a
 * page that no longer says that.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        path={PATH}
        crumbs={[{ name: "Questions", path: PATH }]}
        nodes={[faqLd(FAQ_ITEMS.map(({ question, answer }) => ({ question, answer })))]}
      />

      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="anpan" side="right" size={560} />
        <div className="relative max-w-[var(--max-narrow)]">
          <Kicker>Questions</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">Questions</h1>
          <Lead className="mt-6">
            If the answer isn&rsquo;t here, WhatsApp us. We reply faster than we
            update this page.
          </Lead>

          <nav aria-label="Jump to a group" className="mt-10">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {FAQ_GROUPS.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="micro link-underline inline-flex min-h-11 items-center text-ink-500 hover:text-ink-800"
                  >
                    {group.title}
                    <span className="ml-2 text-ink-400 tabular">
                      ({group.items.length})
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        {FAQ_GROUPS.map((group, index) => (
          <section
            key={group.id}
            id={group.id}
            className={index === 0 ? "scroll-mt-24" : "mt-20 scroll-mt-24"}
          >
            {/* The group title is the h2 the accordion questions sit under, so
                the heading order is h1 > h2 > h3 rather than h1 > h3. It is
                still the system's labelled hairline (§6), just semantic. */}
            <div className="flex max-w-[var(--max-narrow)] items-center gap-4">
              <h2 className="micro shrink-0 font-mono text-kiln">
                {group.title}
              </h2>
              <span className="h-px flex-1 bg-paper-400" aria-hidden="true" />
              <span className="micro shrink-0 text-ink-500">
                <span className="tabular">{group.items.length}</span> answers
              </span>
            </div>
            <Faq
              className="mt-2"
              headingLevel={3}
              items={group.items.map((item) => ({
                question: item.question,
                answer: (
                  <>
                    <p>{item.answer}</p>
                    {item.link ? (
                      <p className="mt-4">
                        <Link
                          href={item.link.href}
                          className="micro link-underline text-kiln"
                        >
                          {item.link.label}
                        </Link>
                      </p>
                    ) : null}
                  </>
                ),
              }))}
            />
          </section>
        ))}
      </Section>

      <Section surface="paper-100" size="half">
        <div className="max-w-[var(--max-narrow)]">
          <h2 className="text-display-sm text-ink-800">Still stuck?</h2>
          <p className="mt-3 max-w-[46ch] text-body text-ink-600">
            A question this page cannot answer is usually a question about your
            order, and that is faster in chat. The number is{" "}
            <span className="tabular">{CONTACT.phone}</span>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink
              href={whatsappHref("Hi Fillo — a question the FAQ didn't answer.")}
              size="lg"
              icon={<MessageCircle size={20} strokeWidth={1.5} />}
              iconPosition="leading"
            >
              Message us on WhatsApp
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Other ways to reach us
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}

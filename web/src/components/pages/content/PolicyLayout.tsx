import * as React from "react";
import Link from "next/link";
import { Section } from "@/components/blocks/Section";
import { Rule, Kicker } from "@/components/ui/Rule";
import { Prose, Lead } from "@/components/pages/content/Prose";
import { LineArtBleed } from "@/components/ui/LineArt";

/**
 * One shared shell for the five policies.
 *
 * Policies live at `--max-narrow` (§8) with a contents rail beside them, built
 * from the same array that renders the sections so the two cannot drift. The
 * rail is a hairline list, not a card — §6: let one hairline do the work of a
 * border, a card and a shadow.
 *
 * Voice rule 1: plainness where they pay. There is no humour in a refund line
 * and none is provided for.
 */

export type PolicySection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export const POLICY_LINKS = [
  { href: "/policies/shipping", label: "Delivery" },
  { href: "/policies/refund", label: "Refunds" },
  { href: "/policies/payment", label: "Payment and security" },
  { href: "/policies/terms", label: "Terms and conditions" },
  { href: "/policies/privacy", label: "Privacy" },
] as const;

export function PolicyLayout({
  title,
  lead,
  updated,
  sections,
  current,
}: {
  title: string;
  lead: React.ReactNode;
  /** Rendered as written; never a computed "today". */
  updated: string;
  sections: PolicySection[];
  /** The href of this page, so the rail can mark it. */
  current: string;
}) {
  return (
    <>
      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="wheat" side="right" size={520} />
        <div className="relative max-w-[var(--max-narrow)]">
          <Kicker>Policies</Kicker>
          <h1 className="mt-4 text-display-lg text-ink-800">{title}</h1>
          <Lead className="mt-6">{lead}</Lead>
          <p className="micro mt-8 text-ink-500">Last updated {updated}</p>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="On this page">
              <Rule label="Contents" />
              <ol className="mt-4 divide-y divide-paper-300 border-b border-b-paper-300">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="link-underline flex min-h-11 items-center gap-4 py-2 text-body-sm text-ink-600 hover:text-ink-800"
                    >
                      <span className="micro w-6 shrink-0 text-ink-400 tabular">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <nav aria-label="Other policies">
              <Rule label="Other policies" className="mt-12" />
              <ul className="mt-4 space-y-1">
                {POLICY_LINKS.filter((p) => p.href !== current).map(
                  (policy) => (
                    <li key={policy.href}>
                      <Link
                        href={policy.href}
                        className="link-underline flex min-h-11 items-center text-body-sm text-ink-600 hover:text-ink-800"
                      >
                        {policy.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </div>

          <div className="lg:col-span-8">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className={index === 0 ? "scroll-mt-24" : "mt-16 scroll-mt-24"}
              >
                <Rule label={String(index + 1).padStart(2, "0")} />
                <h2 className="mt-6 text-display-sm text-ink-800">
                  {section.title}
                </h2>
                <Prose className="mt-6">{section.body}</Prose>
              </section>
            ))}

            <Rule tone="strong" className="mt-16" />
            <p className="mt-6 max-w-[62ch] text-body-sm text-ink-500">
              Something here unclear, or contradicted by what actually happened
              to your order? Message us and we will fix the page as well as the
              order.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

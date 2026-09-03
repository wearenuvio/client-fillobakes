import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { InkArt } from "@/components/ui/InkArt";
import { ContentSection, PageHead, Eyebrow } from "@/components/pages/content/PageShell";
import { Prose } from "@/components/pages/content/Prose";

/**
 * One shell for the five policies — PAGES-v2 Policies.
 *
 * Serif title, the date it was last changed, a contents list, then the prose.
 * The contents list and the sections are built from the same array so the two
 * cannot drift. Plainness where they pay: there is no humour in a refund line
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
  { href: "/policies/payment", label: "Payment" },
  { href: "/policies/terms", label: "Terms" },
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
      <ContentSection
        surface="paper"
        size="none"
        className="overflow-hidden pt-10 pb-8 lg:pt-14"
      >
        <InkArt name="wheat-stalk-v2" width={170} className="top-4 -right-4" />
        <PageHead
          eyebrow="Policies"
          title={title}
          lead={lead}
          meta={
            <p className="text-body-sm text-muted">Last updated {updated}</p>
          }
        />

        <nav aria-label="Policies" className="relative mt-8">
          <ul className="scroll-rail -mx-[var(--gutter)] gap-2 px-[var(--gutter)]">
            {POLICY_LINKS.map((policy) => {
              const active = policy.href === current;
              return (
                <li key={policy.href}>
                  <Link
                    href={policy.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center rounded-pill border px-4 text-body-sm whitespace-nowrap",
                      "transition-colors duration-[var(--dur-base)]",
                      active
                        ? "border-accent bg-accent font-semibold text-on-accent"
                        : "border-line bg-card text-ink-2 hover:border-ink",
                    )}
                  >
                    {policy.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-[calc(var(--gutter)*-1)] w-12 bg-linear-to-l from-paper to-transparent sm:hidden"
          />
        </nav>
      </ContentSection>

      <ContentSection surface="paper" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="On this page">
              <Eyebrow>Contents</Eyebrow>
              <ol className="mt-4 divide-y divide-line border-y border-line">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="link-underline flex min-h-11 items-center gap-4 py-2 text-body-sm text-ink-2 hover:text-ink"
                    >
                      <span className="w-5 shrink-0 text-muted tabular">
                        {index + 1}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="lg:col-span-8">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className={index === 0 ? "scroll-mt-24" : "mt-14 scroll-mt-24"}
              >
                <h2 className="font-display text-[clamp(26px,3vw,34px)] leading-tight text-ink">
                  {section.title}
                </h2>
                <Prose className="mt-5">{section.body}</Prose>
              </section>
            ))}

            <p className="mt-14 max-w-[58ch] border-t border-line pt-6 text-body-sm text-muted">
              Something here unclear, or contradicted by what actually happened to
              your order? Message us and we will fix the page as well as the order.
            </p>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

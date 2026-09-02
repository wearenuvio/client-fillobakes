import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/blocks/Section";
import { RuleHeading } from "@/components/pages/content/RuleHeading";
import { ButtonLink } from "@/components/ui/Button";
import { LineArtBleed } from "@/components/ui/LineArt";
import { CONTACT } from "@/lib/config";
import { getRoutes } from "@/lib/mock";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = buildMetadata("/offline", { noindex: true });

/**
 * The offline shell — site-content.md, Page: Offline.
 *
 * The rule this page exists to prove: the schedule is cacheable and the live
 * map is not. Everything below the fold here is off-air content — run days,
 * the menu, the number as plain text so it can be copied without a connection.
 * Nothing on this page needs the network to be true.
 */
export default function OfflinePage() {
  const routes = getRoutes();
  const categories = getCategories();
  const itemCount = getProducts().length;

  return (
    <>
      <Section surface="paper-50" size="none" className="overflow-hidden pt-[var(--section-y)] pb-[calc(var(--section-y)/2)]">
        <LineArtBleed glyph="van" side="right" size={600} />
        <div className="relative max-w-[var(--max-narrow)]">
          <p className="micro text-kiln">Offline</p>
          <h1 className="mt-4 text-display-lg text-ink-800">
            You&rsquo;re offline.
          </h1>
          <p className="mt-6 max-w-[46ch] text-body-lg text-ink-600">
            This is what we last knew. The van&rsquo;s position and
            today&rsquo;s counts won&rsquo;t be right until you&rsquo;re back
            on.
          </p>
          <div className="mt-8">
            <ButtonLink href="/" size="lg">
              Try again
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section surface="paper-50" size="half">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <RuleHeading>The week&rsquo;s runs</RuleHeading>
            <dl className="mt-2">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="grid gap-1 border-b border-b-paper-300 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
                >
                  <dt className="text-body text-ink-800">{route.name}</dt>
                  <dd className="micro text-ink-500">{route.runDaysLabel}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-caption text-ink-500">
              Run days are the cacheable part. Which stop the van is at right
              now is not.
            </p>
          </div>

          <div className="lg:col-span-6">
            <RuleHeading trailing={`${itemCount}`}>The menu</RuleHeading>
            <ul className="mt-2">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="flex items-baseline justify-between gap-6 border-b border-b-paper-300 py-4"
                >
                  <Link
                    href={`/shop/all`}
                    className="link-underline text-body text-ink-800"
                  >
                    {category.label}
                  </Link>
                  <span className="micro text-ink-500 tabular">
                    {category.count}
                  </span>
                </li>
              ))}
            </ul>

            <RuleHeading className="mt-12">Reach us</RuleHeading>
            <p className="mt-4 text-body text-ink-800">
              WhatsApp <span className="tabular">{CONTACT.phone}</span>
            </p>
            <p className="mt-1 text-body text-ink-800">{CONTACT.email}</p>
            <p className="mt-3 text-caption text-ink-500">
              Written out rather than linked, so it can be copied with no
              connection.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

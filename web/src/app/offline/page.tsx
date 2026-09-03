import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/ui/Button";
import { SystemPage } from "@/components/pages/content/SystemPage";
import { Eyebrow } from "@/components/pages/content/PageShell";
import { CONTACT } from "@/lib/config";
import { getRoutes } from "@/lib/mock";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = buildMetadata("/offline", { noindex: true });

/**
 * The offline shell — PAGES-v2.
 *
 * The rule this page exists to prove: the schedule is cacheable and the live
 * map is not. Everything under the fold is off-air content — run days, the
 * menu, and the number written out rather than linked so it can be copied
 * with no connection. Nothing here needs the network to be true.
 */
export default function OfflinePage() {
  const routes = getRoutes();
  const categories = getCategories();

  return (
    <SystemPage
      code="Offline"
      title="You are offline."
      body="This is what we last knew. The van's position will not be right until you are back on."
      action={
        <ButtonLink href="/" size="lg">
          Try again
        </ButtonLink>
      }
    >
      <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>The week&rsquo;s runs</Eyebrow>
          <dl className="mt-4 border-t border-line">
            {routes.map((route) => (
              <div
                key={route.id}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-4"
              >
                <dt className="text-body text-ink">{route.name}</dt>
                <dd className="text-body-sm text-muted">{route.runDaysLabel}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-[46ch] text-body-sm text-muted">
            Run days are the cacheable part. Which stop the van is at right now
            is not.
          </p>
        </div>

        <div>
          <Eyebrow>The menu</Eyebrow>
          <ul className="mt-4 border-t border-line">
            {categories.map((category) => (
              <li
                key={category.slug}
                className="flex items-baseline justify-between gap-6 border-b border-line py-4"
              >
                <Link href="/shop/all" className="link-underline text-body text-ink">
                  {category.label}
                </Link>
                <span className="text-body-sm text-muted tabular">
                  {category.count}
                </span>
              </li>
            ))}
          </ul>

          <Eyebrow className="mt-10">Reach us</Eyebrow>
          <p className="mt-3 text-body text-ink tabular">{CONTACT.phone}</p>
          <p className="mt-1 text-body text-ink">{CONTACT.email}</p>
          <p className="mt-3 max-w-[46ch] text-body-sm text-muted">
            Written out rather than linked, so it can be copied with no
            connection.
          </p>
        </div>
      </div>
    </SystemPage>
  );
}

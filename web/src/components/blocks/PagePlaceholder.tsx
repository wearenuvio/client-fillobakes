import * as React from "react";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/blocks/Section";
import { Rule } from "@/components/ui/Rule";
import { getH1, getSeoRoute } from "@/lib/seo";

/**
 * Phase 2a placeholder.
 *
 * Every route in DECISIONS.md's final map exists, renders its H1 from
 * seo.json, and says plainly that it is not built yet. Phase 2b replaces the
 * body of each of these with real sections built from the component library —
 * delete <PagePlaceholder> and keep the metadata export above it.
 */

export function PagePlaceholder({
  path,
  /** Overrides the H1 for a dynamic route (the product's real name, etc.). */
  h1,
  kicker,
  /** What Phase 2b has to build here. Keep it concrete. */
  todo,
  /** Components from src/components that this page is expected to use. */
  uses,
  children,
}: {
  path: string;
  h1?: string;
  kicker?: React.ReactNode;
  todo?: React.ReactNode;
  uses?: string[];
  children?: React.ReactNode;
}) {
  const entry = getSeoRoute(path);
  const heading = h1 ?? getH1(path);

  return (
    <Section surface="paper-50">
      <SectionHeader
        as="h1"
        kicker={kicker ?? path}
        heading={heading}
        lead={entry?.metaDescription}
      />

      <div className="mt-12 max-w-[var(--max-narrow)]">
        <Rule label="TODO Phase 2b" tone="strong" />
        <p className="mt-4 text-body text-ink-600">
          {todo ??
            "This route is scaffolded but not built. The metadata, canonical, H1 and JSON-LD above are live; the page body is not."}
        </p>

        {uses?.length ? (
          <>
            <p className="micro mt-6 text-ink-500">Build it from</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {uses.map((name) => (
                <li
                  key={name}
                  className="micro rounded-xs border border-paper-400 px-2 py-1 text-ink-600"
                >
                  {name}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <p className="mt-6 text-caption text-ink-500">
          Component reference:{" "}
          <Link href="/styleguide" className="link-underline text-ink-700">
            /styleguide
          </Link>
          . Copy lives in <code className="font-mono">src-content/site-content.md</code>;
          data in <code className="font-mono">src/lib/catalog.ts</code> and{" "}
          <code className="font-mono">src/lib/mock.ts</code>.
        </p>

        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </Section>
  );
}

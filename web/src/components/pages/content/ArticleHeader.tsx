import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Kicker } from "@/components/ui/Rule";
import { Lead } from "@/components/pages/content/Prose";

/**
 * The head of a guide or a journal post.
 *
 * Kicker, H1, standfirst, then a hairline carrying the mono meta row — the
 * same "micro-caps label layer" that structures every other page (§3.1), so
 * an article reads as part of the site rather than as a blog bolted on.
 *
 * A guide is undated and maintained; a journal post is dated and never
 * updated (site-content.md, Guides). The meta row is where that difference is
 * actually visible to a reader, so it is a required prop rather than a nicety.
 */
export function ArticleHeader({
  kicker,
  title,
  standfirst,
  meta,
  backHref,
  backLabel,
  className,
}: {
  kicker: React.ReactNode;
  title: React.ReactNode;
  standfirst?: React.ReactNode;
  /** Mono micro-caps facts: "Guide · maintained", "5 minute read". */
  meta?: React.ReactNode[];
  backHref?: string;
  backLabel?: string;
  className?: string;
}) {
  return (
    <header className={cn("max-w-[var(--max-narrow)]", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="micro link-underline mb-6 inline-flex min-h-11 items-center text-ink-500 hover:text-ink-800"
        >
          {backLabel ?? "Back"}
        </Link>
      ) : null}

      <Kicker>{kicker}</Kicker>
      <h1 className="mt-4 text-display-lg text-ink-800">{title}</h1>

      {standfirst ? <Lead className="mt-6">{standfirst}</Lead> : null}

      {meta?.length ? (
        <ul className="micro mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-t-paper-300 pt-4 text-ink-500">
          {meta.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Lead } from "@/components/pages/content/Prose";

/**
 * The head of a guide or a journal post.
 *
 * A guide is undated and maintained; a journal post is dated and never
 * updated. The meta row is where that difference becomes visible to a reader,
 * which is why it is a required prop rather than a nicety.
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
          className="link-underline mb-7 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent"
        >
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          {backLabel ?? "Back"}
        </Link>
      ) : null}

      <p className="text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
        {kicker}
      </p>
      <h1 className="mt-3 text-display-2 text-ink">{title}</h1>

      {standfirst ? <Lead className="mt-5">{standfirst}</Lead> : null}

      {meta?.length ? (
        <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-body-sm text-muted">
          {meta.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

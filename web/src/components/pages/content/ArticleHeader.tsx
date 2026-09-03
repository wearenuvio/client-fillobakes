import * as React from "react";
import { PageHeader } from "@/components/blocks/PageHeader";
import type { InkArtName } from "@/components/ui/InkArt";

/**
 * The head of a guide or a journal post — the shared PageHeader, with the
 * meta row that says which of the two it is.
 *
 * A guide is undated and maintained; a journal post is dated and never
 * updated. That difference only exists for a reader if the page says it, so
 * the meta row is a required prop rather than a nicety.
 */
export function ArticleHeader({
  kicker,
  title,
  standfirst,
  meta,
  art,
  backHref,
  backLabel,
}: {
  kicker: React.ReactNode;
  title: React.ReactNode;
  standfirst?: React.ReactNode;
  meta?: React.ReactNode[];
  art?: InkArtName;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <PageHeader
      eyebrow={kicker}
      title={title}
      lede={standfirst}
      art={art}
      artSize="sm"
      back={backHref ? { href: backHref, label: backLabel ?? "Back" } : undefined}
      meta={
        meta?.length ? (
          <ul className="flex max-w-[var(--max-narrow)] flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-body-sm text-muted">
            {meta.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : undefined
      }
    />
  );
}

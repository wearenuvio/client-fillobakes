import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { AnPanGlyph } from "@/components/ui/LineArt";
import { resolveProductImage } from "@/lib/images";

/**
 * The 404 / 500 / offline shell — PAGES-v2 "404 / 500 / offline".
 *
 * A bun floating on the paper, one serif line, one sentence, one button. The
 * three system pages share it so that whatever went wrong, the site still
 * looks like the site. Anything more here is a second decision handed to
 * somebody who has already hit a wall.
 */
export function SystemPage({
  code,
  title,
  body,
  action,
  children,
  className,
}: {
  /** The label above the line: "404", "Offline". Never a stack trace. */
  code: string;
  title: React.ReactNode;
  body: React.ReactNode;
  /** Exactly one. Two buttons is a menu, not a way out. */
  action: React.ReactNode;
  /** Anything genuinely useful below the fold, e.g. the offline schedule. */
  children?: React.ReactNode;
  className?: string;
}) {
  const bun = resolveProductImage("custard-an-pan");

  return (
    <section className={cn("bg-paper py-[var(--section-y)]", className)}>
      <div className="container-content">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-[200px] place-items-center sm:size-[240px]">
            {bun ? (
              <Image
                src={bun.src}
                alt=""
                width={480}
                height={480}
                priority
                sizes="240px"
                className="w-full -rotate-6 object-contain cutout"
              />
            ) : (
              <AnPanGlyph size={150} className="text-muted opacity-50" />
            )}
          </div>

          <p className="mt-8 text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
            {code}
          </p>
          <h1 className="mt-3 max-w-[16ch] text-display-2 text-ink">{title}</h1>
          <p className="mt-5 max-w-[44ch] text-body-lg text-ink-2">{body}</p>
          <div className="mt-8">{action}</div>
        </div>

        {children ? <div className="mt-16 lg:mt-20">{children}</div> : null}
      </div>
    </section>
  );
}

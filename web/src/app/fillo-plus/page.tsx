import type { Metadata } from "next";
import { Bell, Coins, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/blocks/PageHeader";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { FilloPlusJoin } from "@/components/pages/van/JoinFilloPlus";
import { MEMBERSHIP } from "@/lib/config";

const PATH = "/fillo-plus";

export const metadata: Metadata = buildMetadata(PATH);

/**
 * Fillo+ — PAGES-v2 "Fillo+".
 *
 * One hero, three cards, one line for the founding members, and nothing else.
 * The offer is small and the page should read as small: a loyalty scheme that
 * needs a landing page to explain it is a loyalty scheme nobody will use.
 *
 * Free, phone-based, no fee anywhere. The ₹1 join fee is retired, so the only
 * place a rupee appears on this page is in the earn rate.
 */

const CARDS = [
  {
    icon: Coins,
    title: "Coins on every order",
    body: "Two for every ₹100 you spend, added the day it is delivered. They do not expire.",
  },
  {
    icon: Sparkles,
    title: "Early access to new bakes",
    body: "Weekly specials open to members first, usually a day before anyone else sees them.",
  },
  {
    icon: Bell,
    title: "Van alerts on WhatsApp",
    body: "One message when the van is near your stop, on the days you choose. Never more.",
  },
] as const;

export default function FilloPlusPage() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[{ name: MEMBERSHIP.name, path: PATH }]} />

      {/* -------- The whole offer, and the only thing to do about it --- */}
      <PageHeader
        eyebrow={`${MEMBERSHIP.name} · ${MEMBERSHIP.priceLabel}`}
        title="Join free. Earn on every order."
        lede="Two coins for every ₹100. Twenty-five coins is ₹25 off."
        art="stamp-ring"
        artSize="sm"
      >
        <FilloPlusJoin />
      </PageHeader>

      {/* -------- What it is ------------------------------------------- */}
      <section
        data-reveal
        className="border-t border-line bg-paper-2 py-[var(--section-y)]"
      >
        <div className="container-content">
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
            {CARDS.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-xl border border-line bg-card p-6 lg:p-7"
              >
                <Icon
                  size={32}
                  strokeWidth={1.25}
                  aria-hidden="true"
                  className="text-accent"
                />
                <h2 className="mt-5 font-display text-[22px] leading-tight text-ink">
                  {title}
                </h2>
                <p className="mt-2 text-body-sm text-ink-2">{body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[62ch] text-body-sm text-muted">
            Joined for ₹1 before September? You are a founding member. Your coins
            and your perks stay exactly as they were.
          </p>
        </div>
      </section>
    </>
  );
}

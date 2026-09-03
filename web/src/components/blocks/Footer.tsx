import Link from "next/link";
import { AtSign, Clock, Mail, MessageCircle } from "lucide-react";
import { CONTACT, SITE } from "@/lib/config";

/**
 * Footer — DESIGN-v2 §2, compacted.
 *
 * One block, not four stacked ones. The wordmark and its single line sit on
 * the left and the three link columns run beside them on desktop rather than
 * underneath, which is where most of the old height went. Underneath: one
 * inline contact row, then one legal line.
 *
 * The columns are short on purpose. A footer that lists every route twice is
 * a sitemap; this one carries the four or five things per column that someone
 * actually leaves the page for, and Terms and Privacy ride the legal line
 * where people look for them anyway.
 *
 * There is no newsletter field here — the home page's journal row already has
 * one, and two identical email inputs on one page read as a bug.
 *
 * The Kannada thank-you is allowed here and nowhere else on the site.
 *
 * There is no line art here any more. `wheat-stalk-v2` is a 301×1200 drawing:
 * at any width where it reads as a stalk rather than a scratch it is taller
 * than the compacted footer, so it could only appear either cropped by the
 * bottom edge or lying under the link columns. Both are against the rule that
 * a drawing is never clipped and never sits under text, so it comes out.
 */

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "The menu" },
      { href: "/standing-order", label: "The Standing Order" },
      { href: "/boxes", label: "Boxes" },
      { href: "/gift-cards", label: "Gift cards" },
      { href: "/fillo-plus", label: "Fillo+" },
    ],
  },
  {
    heading: "Fillo Bakes",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/van", label: "The van" },
      { href: "/areas", label: "Where we deliver" },
      { href: "/journal", label: "Journal" },
      { href: "/franchise", label: "Franchise" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/faq", label: "Frequently asked" },
      { href: "/contact", label: "Contact" },
      { href: "/policies/shipping", label: "Delivery and returns" },
      { href: "/policies/refund", label: "Refunds" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper-2 pt-12 pb-8 lg:pt-14">
      <div className="relative container-content">
        {/* -------- Wordmark and the three columns, side by side -------- */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <p className="font-display text-[clamp(38px,4.4vw,54px)] leading-[0.9] lowercase text-ink">
              fillo bakes
            </p>
            <p className="mt-3 max-w-[32ch] text-body-sm text-ink-2">
              Eggless Japanese bread, baked to order.
            </p>
          </div>

          {/* Two columns on a phone, three from sm. No accordion: five links
              are cheaper to render than a disclosure someone has to open. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:gap-x-14">
            {COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="font-sans text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                  {column.heading}
                </h2>
                <ul className="mt-3.5 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="link-underline text-body-sm whitespace-nowrap text-ink-2 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* -------- Contact, one row -------------------------------------- */}
        <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-line pt-6 text-body-sm text-ink-2">
          <li>
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}`}
              className="link-underline inline-flex items-center gap-2 hover:text-ink"
            >
              <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="tabular">{CONTACT.phone}</span>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${CONTACT.email}`}
              className="link-underline inline-flex items-center gap-2 hover:text-ink"
            >
              <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
              {CONTACT.email}
            </a>
          </li>
          <li>
            <a
              href={CONTACT.instagram}
              className="link-underline inline-flex items-center gap-2 hover:text-ink"
              rel="noreferrer"
            >
              <AtSign size={16} strokeWidth={1.5} aria-hidden="true" />
              {CONTACT.instagramHandle}
            </a>
          </li>
          <li className="inline-flex items-center gap-2 text-muted">
            <Clock size={16} strokeWidth={1.5} aria-hidden="true" />
            {SITE.hoursLabel}
          </li>
        </ul>

        {/* -------- One legal line ---------------------------------------- */}
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.legalName} · {SITE.city} · 100% vegetarian ·{" "}
            <Link href="/policies/terms" className="link-underline hover:text-ink">
              Terms
            </Link>{" "}
            ·{" "}
            <Link href="/policies/privacy" className="link-underline hover:text-ink">
              Privacy
            </Link>
          </p>
          <p>
            <span lang="kn">ಧನ್ಯವಾದಗಳು.</span> Thank you for letting us park on
            your street. © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

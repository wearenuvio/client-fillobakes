import Link from "next/link";
import { AtSign, MessageCircle } from "lucide-react";
import { CONTACT, SITE } from "@/lib/config";

/**
 * Footer — DESIGN-v2 §2.
 *
 * paper-2 ground, four link columns plus the wordmark set large in the display
 * serif, and the company line small and quiet at the bottom. The Kannada
 * thank-you is allowed here and nowhere else on the site.
 *
 * The newsletter field the spec puts here lives one section up instead, on the
 * home page's journal row: two identical email fields stacked on top of each
 * other read as a bug, not as an invitation.
 *
 * No dark band: the page already spends its one dark surface on the van band.
 */

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "The menu" },
      { href: "/shop/breads", label: "Breads" },
      { href: "/shop/anpan", label: "An pan" },
      { href: "/boxes", label: "Boxes" },
      { href: "/standing-order", label: "The Standing Order" },
      { href: "/gift-cards", label: "Gift cards" },
    ],
  },
  {
    heading: "Fillo Bakes",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/van", label: "The van" },
      { href: "/areas", label: "Where we deliver" },
      { href: "/fillo-plus", label: "Fillo+" },
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
      { href: "/policies/payment", label: "Payment and security" },
      { href: "/policies/terms", label: "Terms" },
      { href: "/policies/privacy", label: "Privacy" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2 pt-16 pb-10 lg:pt-20">
      <div className="container-content">
        {/* -------- Wordmark and the newsletter field ------------------- */}
        <div className="flex flex-col gap-10 border-b border-line pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[clamp(44px,6vw,72px)] leading-[0.9] lowercase text-ink">
              fillo bakes
            </p>
            <p className="mt-4 max-w-[30ch] text-body text-ink-2">
              Eggless Japanese bread, baked every morning in Bengaluru.
            </p>
          </div>

          <p className="max-w-[30ch] text-body-sm text-muted lg:text-right">
            Order by 8pm and it is at your door tomorrow, anywhere the van
            runs.
          </p>
        </div>

        {/* -------- Columns ------------------------------------------- */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-sans text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-body-sm text-ink-2 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-sans text-[12px] font-medium tracking-[0.12em] text-muted uppercase">
              Reach us
            </h2>
            <ul className="mt-4 space-y-2.5 text-body-sm text-ink-2">
              <li>
                <a
                  href={`https://wa.me/${CONTACT.whatsappNumber}`}
                  className="link-underline inline-flex items-center gap-2 hover:text-ink"
                >
                  <MessageCircle
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="tabular">{CONTACT.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="link-underline hover:text-ink"
                >
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
              <li>
                {SITE.city}, {SITE.state}
              </li>
              <li>{SITE.hoursLabel}</li>
            </ul>
          </div>
        </div>

        {/* -------- The local warmth line, allowed only here ------------ */}
        <p className="mt-14 text-body-sm text-ink-2">
          <span lang="kn">ಧನ್ಯವಾದಗಳು.</span> Thank you for letting us park on
          your street.
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.legalName} · {SITE.city} · 100% vegetarian
          </p>
          <p>© {new Date().getFullYear()} Fillo Bakes</p>
        </div>
      </div>
    </footer>
  );
}

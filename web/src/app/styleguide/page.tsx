import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/blocks/Section";
import { StyleguideClient } from "@/app/styleguide/StyleguideClient";

export const metadata: Metadata = {
  // Absolute, so the layout's "%s | Fillo Bakes" template does not double up.
  title: { absolute: "Styleguide | Fillo Bakes" },
  description:
    "Every component in the Fillo Bakes design system, in every documented state.",
  robots: { index: false, follow: false },
};

const CONTENTS: { id: string; label: string }[] = [
  { id: "colour", label: "Colour" },
  { id: "type", label: "Typography" },
  { id: "rules", label: "Rules and kickers" },
  { id: "stamp", label: "Stamp and seal" },
  { id: "lineart", label: "Line art" },
  { id: "button", label: "Button" },
  { id: "iconbutton", label: "IconButton" },
  { id: "badge", label: "Badge" },
  { id: "fields", label: "Form fields" },
  { id: "stepper", label: "QtyStepper" },
  { id: "otp", label: "OTP field" },
  { id: "overlays", label: "Dialog and toast" },
  { id: "empty", label: "Empty and loading" },
  { id: "productcard", label: "ProductCard" },
  { id: "categoryfilter", label: "CategoryFilter" },
  { id: "slotpicker", label: "SlotPicker" },
  { id: "areacheck", label: "AreaCheck" },
  { id: "lanes", label: "FulfilmentLane" },
  { id: "locationchip", label: "Location chip and sheet" },
  { id: "cart", label: "Cart drawer" },
  { id: "dropcard", label: "DropCard" },
  { id: "upi", label: "UPI pay button" },
  { id: "tracker", label: "Tracker" },
  { id: "bakestrip", label: "BakeStrip" },
  { id: "proof", label: "ProofBlock" },
  { id: "stats", label: "StatsBand" },
  { id: "hero", label: "Hero" },
  { id: "ticker", label: "Announcement ticker" },
  { id: "threedoors", label: "ThreeDoors" },
  { id: "subscription", label: "Subscription cards" },
  { id: "testimonial", label: "Testimonial" },
  { id: "faq", label: "FAQ" },
  { id: "whatsapp", label: "WhatsApp opt-in" },
  { id: "newsletter", label: "Newsletter" },
  { id: "loyalty", label: "Fillo+ chrome" },
];

/**
 * The review surface. It deliberately breaks two page-level rules — one seal
 * per page, one marquee per page — so a reviewer can see every variant at
 * once. Do not copy its density into a real page.
 */
export default function StyleguidePage() {
  return (
    <Section surface="paper-50" size="half">
      <header>
        <p className="micro text-kiln">Design system · v1.0</p>
        <h1 className="mt-4 text-display-xl text-ink-800">Styleguide</h1>
        <p className="mt-4 max-w-[62ch] text-body-lg text-ink-600">
          Every component in <code className="font-mono">src/components</code>,
          in every state DESIGN.md documents, with the clause it implements.
          Section numbers refer to <code className="font-mono">design/DESIGN.md</code>.
        </p>
        <p className="mt-3 max-w-[62ch] text-body-sm text-ink-500">
          This page breaks two page-level rules on purpose — one seal per page,
          one marquee per page — so that all the variants are visible together.
          Do not copy its density into a real page.
        </p>
      </header>

      <nav aria-label="Contents" className="mt-10">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {CONTENTS.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className="micro link-underline text-ink-600 hover:text-ink-800"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <StyleguideClient />
    </Section>
  );
}

/**
 * One-shot scaffolder for the Phase 2a placeholder routes.
 *
 * It writes a page.tsx for every STATIC route in DECISIONS.md's final map that
 * does not already exist. Dynamic routes, the system pages and /styleguide are
 * hand-written and are listed in SKIP.
 *
 *   node scripts/generate-routes.mjs
 *
 * Safe to re-run: it never overwrites a file that is already there, so once
 * Phase 2b starts filling pages this script cannot clobber them.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "src", "app");

/** path -> { crumbs, todo, uses } */
const ROUTES = {
  "/shop": {
    crumbs: [["Shop", "/shop"]],
    todo: "This week's bake: run-aware header, category filter, search, the Three Doors module and the product grid.",
    uses: ["SectionHeader", "CategoryFilter", "ThreeDoors", "ProductCard", "ProductGrid", "DropCard"],
  },
  "/shop/all": {
    crumbs: [["Shop", "/shop"], ["Everything", "/shop/all"]],
    todo: "The full 23-SKU catalogue, no run filtering. Same grid, different source set.",
    uses: ["CategoryFilter", "ProductCard", "ProductGrid"],
  },
  "/boxes": {
    crumbs: [["Boxes", "/boxes"]],
    todo: "Three curated boxes from mock.getBoxes(), plus the build-your-own entry.",
    uses: ["SectionHeader", "ProductCard", "Price", "Button"],
  },
  "/van": {
    crumbs: [["The van", "/van"]],
    todo: "The tracker. Order of certainty: status pill, hero line, arrival band, route list, bake strip, THEN the map. Off air is the primary state.",
    uses: ["VanStatusPill", "TrackerCard", "RouteList", "BakeStrip", "WhatsAppOptIn"],
  },
  "/areas": {
    crumbs: [["Areas", "/areas"]],
    todo: "Serviceability index: the AreaCheck, then every area from mock.getAreas() with its run days and lanes.",
    uses: ["AreaCheck", "FulfilmentLane", "Rule"],
  },
  "/standing-order": {
    crumbs: [["The Standing Order", "/standing-order"]],
    todo: "Subscription pitch and builder entry. Never pitched on a first visit — this page is the destination, not the interruption.",
    uses: ["SectionHeader", "SubscriptionPlanCard", "Faq"],
  },
  "/fillo-plus": {
    crumbs: [["Fillo+", "/fillo-plus"]],
    todo: "Membership explainer. Fillo+ is FREE and phone-based — there is no ₹1 fee anywhere on this page.",
    uses: ["SectionHeader", "SpecList", "Faq", "Button"],
  },
  "/gifting": {
    crumbs: [["Gifting", "/gifting"]],
    todo: "Send bread as a gift. Light page: what arrives, when, and how the recipient is told.",
    uses: ["SectionHeader", "ProductCard", "Field"],
  },
  "/gift-cards": {
    crumbs: [["Gift cards", "/gift-cards"]],
    todo: "Denominations from mock.getGiftCards(), a custom amount, and the delivery channel.",
    uses: ["SectionHeader", "Field", "Button", "Badge"],
  },
  "/cart": {
    crumbs: [["Your box", "/cart"]],
    todo: "The full-page cart. The drawer is primary; this exists for deep links and for people who prefer a page.",
    uses: ["CartDrawer parts", "QtyStepper", "FulfilmentSummary", "Price"],
  },
  "/checkout": {
    crumbs: [["Checkout", "/checkout"]],
    todo: "One page, four blocks: lane + slot, items + total with delivery inside, phone + OTP, UPI. The van lane skips the address block.",
    uses: ["FulfilmentLane", "SlotPicker", "OtpField", "UpiPayButton", "FulfilmentSummary"],
  },
  "/about": {
    crumbs: [["Our story", "/about"]],
    todo: "Story, founders, the van, the six things we hold to, and the 300-tasting proof. One ring seal on this page.",
    uses: ["HeroStatement", "SpecList", "StatsBand", "Testimonial", "RingSeal"],
  },
  "/shokupan": {
    crumbs: [["Shokupan", "/shokupan"]],
    todo: "The one page that already ranks. Keep the URL, rebuild the content around the Milk Shokupan PDP and the guides.",
    uses: ["HeroPaper", "ProofBlock", "SpecList", "ProductCard", "Faq"],
  },
  "/journal": {
    crumbs: [["Journal", "/journal"]],
    todo: "Index of the eight posts. Two are written in full; the rest are stubs in site-content.md.",
    uses: ["SectionHeader", "Rule"],
  },
  "/faq": {
    crumbs: [["Questions", "/faq"]],
    todo: "The accordion, plus FAQPage JSON-LD built from the same array. Humour is allowed here.",
    uses: ["Faq", "faqLd"],
  },
  "/contact": {
    crumbs: [["Contact", "/contact"]],
    todo: "WhatsApp first, email second, the hours, and the company line. No contact form that goes nowhere.",
    uses: ["SectionHeader", "Field", "Button"],
  },
  "/franchise": {
    crumbs: [["Franchise", "/franchise"]],
    todo: "Partnerships. A page for perhaps twenty people a year — keep it short and put the qualifying questions first.",
    uses: ["SectionHeader", "Field", "Button", "SpecList"],
  },
  "/policies/shipping": {
    crumbs: [["Policies", "/policies/shipping"], ["Delivery", "/policies/shipping"]],
    todo: "Delivery policy. Long-form prose at --max-narrow.",
    uses: ["Section", "Rule"],
  },
  "/policies/refund": {
    crumbs: [["Policies", "/policies/refund"], ["Refunds", "/policies/refund"]],
    todo: "Refunds and cancellations.",
    uses: ["Section", "Rule"],
  },
  "/policies/terms": {
    crumbs: [["Policies", "/policies/terms"], ["Terms", "/policies/terms"]],
    todo: "Terms and conditions.",
    uses: ["Section", "Rule"],
  },
  "/policies/privacy": {
    crumbs: [["Policies", "/policies/privacy"], ["Privacy", "/policies/privacy"]],
    todo: "Privacy policy. It must state the van's data contract: snapped position only, no historical trail.",
    uses: ["Section", "Rule"],
  },
  "/policies/payment": {
    crumbs: [["Policies", "/policies/payment"], ["Payment", "/policies/payment"]],
    todo: "Payment and security.",
    uses: ["Section", "Rule"],
  },
  "/login": {
    crumbs: [["Sign in", "/login"]],
    todo: "Phone + OTP. There is no password anywhere and no separate sign-up — a new number creates an account on first OTP.",
    uses: ["OtpField", "Field", "Button"],
  },
  "/logout": {
    crumbs: [["Sign out", "/logout"]],
    todo: "Clears the mocked session and returns home.",
    uses: ["Button"],
  },
  "/account": {
    crumbs: [["Account", "/account"]],
    todo: "The dashboard. Six cards in order: next delivery, Fillo+, Standing Order, recent orders, addresses, alerts.",
    uses: ["VanStrip", "SubscriptionPlanCard", "Rule", "Badge"],
  },
  "/account/orders": {
    crumbs: [["Account", "/account"], ["Orders", "/account/orders"]],
    todo: "Rows newest first, filter chips, and the empty state that names Bangalore Bloom at ₹99.",
    uses: ["Badge", "EmptyState", "Rule"],
  },
  "/account/subscription": {
    crumbs: [["Account", "/account"], ["The Standing Order", "/account/subscription"]],
    todo: "Manage: skip, pause, change run day or stop, change contents, cancel, resume. Plus payment-failed and route-changed states.",
    uses: ["SubscriptionPlanCard", "Dialog", "SlotPicker"],
  },
  "/account/subscription/setup": {
    crumbs: [["Account", "/account"], ["The Standing Order", "/account/subscription"], ["Set up", "/account/subscription/setup"]],
    todo: "The builder: contents, cadence, run day, stop or address, payment.",
    uses: ["SubscriptionPlanCard", "SlotPicker", "FulfilmentLane", "UpiPayButton"],
  },
  "/account/addresses": {
    crumbs: [["Account", "/account"], ["Addresses", "/account/addresses"]],
    todo: "Cards with the route line. The add form is Label / Society / Block and flat / Landmark / Area — never Line 1 and Line 2.",
    uses: ["Field", "AreaCheck", "Dialog", "Badge"],
  },
  "/account/rewards": {
    crumbs: [["Account", "/account"], ["Fillo+", "/account/rewards"]],
    todo: "Coin balance, progress to ₹25 off, the redeem block and the ledger from mock.getLoyaltyLedger().",
    uses: ["Badge", "Rule", "Button", "EmptyState"],
  },
  "/account/alerts": {
    crumbs: [["Account", "/account"], ["Alerts", "/account/alerts"]],
    todo: "The five WhatsApp toggles from mock.getAlertPreferences(). order_updates is on and locked, with its reason stated.",
    uses: ["Switch", "Rule", "Button"],
  },
  "/account/gift-cards": {
    crumbs: [["Account", "/account"], ["Gift cards", "/account/gift-cards"]],
    todo: "Bought and received tabs, each with its own empty state.",
    uses: ["Badge", "EmptyState", "Field"],
  },
  "/account/settings": {
    crumbs: [["Account", "/account"], ["Settings", "/account/settings"]],
    todo: "Name, number, email for invoices, and the destructive actions with their consequence in the button's own sentence.",
    uses: ["Field", "Button", "Dialog"],
  },
};

const template = (path, def) => {
  const crumbs = (def.crumbs ?? [])
    .map(([name, href]) => `{ name: ${JSON.stringify(name)}, path: ${JSON.stringify(href)} }`)
    .join(", ");
  const uses = (def.uses ?? []).map((u) => JSON.stringify(u)).join(", ");
  return `import type { Metadata } from "next";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PagePlaceholder } from "@/components/blocks/PagePlaceholder";

const PATH = ${JSON.stringify(path)};

export const metadata: Metadata = buildMetadata(PATH);

export default function Page() {
  return (
    <>
      <JsonLd path={PATH} crumbs={[${crumbs}]} />
      <PagePlaceholder
        path={PATH}
        todo={${JSON.stringify(def.todo)}}
        uses={[${uses}]}
      />
    </>
  );
}
`;
};

let written = 0;
let skipped = 0;

for (const [path, def] of Object.entries(ROUTES)) {
  const dir = join(appDir, ...path.split("/").filter(Boolean));
  const file = join(dir, "page.tsx");
  if (existsSync(file)) {
    skipped++;
    continue;
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, template(path, def));
  written++;
}

console.log(`routes: ${written} written, ${skipped} already present`);

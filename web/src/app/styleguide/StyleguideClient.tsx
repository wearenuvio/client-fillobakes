"use client";

import * as React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { SpecSection, SpecRow, SpecGrid, Swatch } from "@/components/styleguide/Spec";
import { Button, ButtonLink } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import { Rule, Kicker } from "@/components/ui/Rule";
import { Price, FreeLabel } from "@/components/ui/Price";
import { KanaLabel } from "@/components/ui/KanaLabel";
import { Stamp, RingSeal } from "@/components/ui/Stamp";
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
} from "@/components/ui/Field";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { Dialog } from "@/components/ui/Dialog";
import { Toast, useToast } from "@/components/ui/Toast";
import { OtpField, OtpBoxes } from "@/components/ui/OtpField";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";
import { LoafGlyph, AnPanGlyph, KarePanGlyph, WheatGlyph, VanGlyph } from "@/components/ui/LineArt";

import { ProductCard, ProductGrid } from "@/components/blocks/ProductCard";
import { CategoryFilter } from "@/components/blocks/CategoryFilter";
import { SlotPicker } from "@/components/blocks/SlotPicker";
import { AreaCheck, AreaResultBlock } from "@/components/blocks/AreaCheck";
import { FulfilmentLane, FulfilmentSummary } from "@/components/blocks/FulfilmentLane";
import { LocationChip } from "@/components/blocks/LocationChip";
import { AreaLaneSheet } from "@/components/blocks/AreaLaneSheet";
import { DropCard } from "@/components/blocks/DropCard";
import { ProofBlock, SpecList, HowToEatIt } from "@/components/blocks/ProofBlock";
import { ThreeDoors } from "@/components/blocks/ThreeDoors";
import { BakeStrip } from "@/components/blocks/BakeStrip";
import { TrackerCard, VanStatusPill, RouteList, VanStrip } from "@/components/blocks/TrackerCard";
import { Testimonial, TestimonialRail, Rating } from "@/components/blocks/Testimonial";
import { StatsBand } from "@/components/blocks/StatsBand";
import { AnnouncementTicker, TICKER_COPY, type TickerState } from "@/components/blocks/AnnouncementTicker";
import { HeroPaper } from "@/components/blocks/Hero";
import { SubscriptionPlanCard } from "@/components/blocks/SubscriptionPlanCard";
import { Faq } from "@/components/blocks/Faq";
import { UpiPayButton } from "@/components/blocks/UpiPayButton";
import { WhatsAppOptIn } from "@/components/blocks/WhatsAppOptIn";
import { NewsletterRow } from "@/components/blocks/NewsletterRow";

import { getCategories, getProducts, getProductBySlug } from "@/lib/catalog";
import {
  getAreas,
  getVanState,
  getStockFor,
  getLoyaltyLedger,
  getSubscription,
  VAN_STATES,
  type VanStatus,
} from "@/lib/mock";
import { SUBSCRIPTION_NAME } from "@/lib/config";

/**
 * /styleguide — every component in every documented state, labelled.
 *
 * This is a review surface, not a product page. It deliberately breaks the
 * one-seal-per-page and one-marquee-per-page rules so a reviewer can see all
 * the variants at once; do not copy its density into a real page.
 */

const products = getProducts();
const categories = getCategories();
const shokupan = getProductBySlug("milk-shokupan")!;
const anpan = getProductBySlug("custard-an-pan")!;
const soldOutSku = getProductBySlug("seoul-spice")!;
const lowSku = getProductBySlug("bangalore-bloom")!;

export function StyleguideClient() {
  return (
    <>
      <Foundations />
      <Primitives />
      <Commerce />
      <VanAndProof />
      <Marketing />
    </>
  );
}

/* ========================================================================== */
/* Foundations                                                                */
/* ========================================================================== */

function Foundations() {
  return (
    <>
      <SpecSection
        id="colour"
        title="Colour"
        section="§2"
        note="Never #FFFFFF, never #000000, never a Tailwind default. Kiln is forbidden on dark (2.46:1); crumb is fill-only on paper (2.09:1)."
      >
        <p className="micro mb-3 text-ink-500">Paper scale</p>
        <SpecGrid columns={4}>
          <Swatch token="paper-0" value="--color-paper-0" contrast="Card / dialog / input" />
          <Swatch token="paper-50" value="--color-paper-50" contrast="Page background" />
          <Swatch token="paper-100" value="--color-paper-100" contrast="Alternating band" />
          <Swatch token="paper-200" value="--color-paper-200" contrast="Product wells" />
          <Swatch token="paper-300" value="--color-paper-300" contrast="Hairlines" />
          <Swatch token="paper-400" value="--color-paper-400" contrast="Decorative rules" />
        </SpecGrid>

        <p className="micro mt-8 mb-3 text-ink-500">Ink scale — the logo navy, extended</p>
        <SpecGrid columns={4}>
          <Swatch token="ink-900" value="--color-ink-900" contrast="15.55:1" />
          <Swatch token="ink-800" value="--color-ink-800" contrast="10.75:1 · = logo" />
          <Swatch token="ink-700" value="--color-ink-700" contrast="8.38:1" />
          <Swatch token="ink-600" value="--color-ink-600" contrast="6.49:1 · body" />
          <Swatch token="ink-500" value="--color-ink-500" contrast="4.98:1 · meta" />
          <Swatch token="ink-400" value="--color-ink-400" contrast="2.42:1 · non-text on paper" />
        </SpecGrid>

        <p className="micro mt-8 mb-3 text-ink-500">Accent, signal and states</p>
        <SpecGrid columns={4}>
          <Swatch token="kiln" value="--color-kiln" contrast="6.32:1 on paper" />
          <Swatch token="kiln-700" value="--color-kiln-700" contrast="hover" />
          <Swatch token="kiln-100" value="--color-kiln-100" contrast="tint well" />
          <Swatch token="crumb" value="--color-crumb" contrast="fill only on paper" />
          <Swatch token="crumb-ink" value="--color-crumb-ink" contrast="5.12:1" />
          <Swatch token="success" value="--color-success" contrast="6.03:1" />
          <Swatch token="warning" value="--color-warning" contrast="5.41:1" />
          <Swatch token="danger" value="--color-danger" contrast="7.00:1" />
        </SpecGrid>

        <p className="micro mt-8 mb-3 text-ink-500">
          Category hints — a 2px rule, a 5px dot, a chip. Never a fill.
        </p>
        <SpecGrid columns={4}>
          <Swatch token="cat-breads" value="--color-cat-breads" contrast="4.87:1 ink" />
          <Swatch token="cat-anpan" value="--color-cat-anpan" contrast="6.32:1" />
          <Swatch token="cat-karepan" value="--color-cat-karepan" contrast="5.75:1 ink" />
          <Swatch token="cat-pies" value="--color-cat-pies" contrast="6.39:1" />
          <Swatch token="cat-sandos" value="--color-cat-sandos" contrast="4.83:1" />
          <Swatch token="cat-weekly" value="--color-cat-weekly" contrast="10.75:1" />
        </SpecGrid>
      </SpecSection>

      <SpecSection
        id="type"
        title="Typography"
        section="§3"
        note="Display is always weight 400 — if a headline feels weak, set it larger, never bolder. Never a display face below 24px, never body sans above 24px."
      >
        <div className="space-y-6">
          <p className="text-display-2xl text-ink-800">Bread, brought to you.</p>
          <p className="text-display-xl text-ink-800">2 stops away.</p>
          <p className="text-display-lg text-ink-800">Today&rsquo;s bake</p>
          <p className="text-display-md text-ink-800">The ovens are cold.</p>
          <p className="text-display-sm text-ink-800">Nothing in the box yet.</p>
          <Rule />
          <p className="text-title-lg text-ink-800">Title large, sans 600</p>
          <p className="text-title text-ink-800">Title, sans 600 — the product name</p>
          <p className="max-w-[46ch] text-body-lg text-ink-600">
            Body large. The lead paragraph, capped at 46 characters.
          </p>
          <p className="max-w-[62ch] text-body text-ink-600">
            Body. Prose caps at 62 characters, gets text-wrap: pretty, and is
            never hyphenated.
          </p>
          <p className="text-body-sm text-ink-600">Body small — meta and helper rows.</p>
          <p className="text-caption text-ink-500">Caption — helper text and footnotes.</p>
          <p className="micro text-ink-500">MICRO · THE KICKER AND SPEC LAYER</p>
          <p className="nano text-ink-500">NANO · CHIPS, SEAL RING, STATS CAPTION</p>
          <Rule />
          <div>
            <p className="text-title text-ink-800">Milk Shokupan</p>
            <KanaLabel kana={shokupan.kana} />
            <p className="micro mt-2 text-ink-500">
              Kana — Zen Kaku Gothic New, 13px, +0.06em, ink-500. Omitted rather
              than invented.
            </p>
          </div>
          <div className="flex flex-wrap items-baseline gap-6">
            <Price amount={200} size="sm" />
            <Price amount={200} />
            <Price amount={1250} size="lg" />
            <Price amount={499} size="xl" />
            <Price amount={200} muted />
            <FreeLabel />
          </div>
        </div>
      </SpecSection>

      <SpecSection
        id="rules"
        title="Rules, hairlines and kickers"
        section="§6"
        note="The mood board structures pages with 1px rules, not with boxes. A component gets a border or a background tint, never both — except inputs."
      >
        <div className="space-y-8">
          <Rule />
          <Rule tone="strong" />
          <Rule label="The menu" trailing="BAKED 5:40 AM · SOLD BY 7 PM" />
          <Rule label="This week" tone="strong" trailing="( 23 )" />
          <div data-surface="dark" className="rounded-md bg-ink-900 p-6">
            <Rule tone="dark" label="The moving bakery" trailing="UPDATED 14:01" />
          </div>
          <div className="flex gap-6">
            <Kicker>Bengaluru · 100% eggless</Kicker>
            <Kicker tone="ink">The menu</Kicker>
          </div>
        </div>
      </SpecSection>

      <SpecSection
        id="stamp"
        title="Stamp and seal"
        section="§12.12"
        note="The blob is the brand's one memorable form and appears in exactly four places: the seal, the van marker, the hero mask and the testimonial avatar. Never below 72px for the ring."
      >
        <SpecRow label="Filled stamp — crumb field, −8°, static">
          <Stamp />
          <Stamp size={44} />
          <Stamp lines={["100%", "Eggless"]} />
        </SpecRow>
        <SpecRow label="Ring seal — rotates over 22s; the leaf holds still">
          <RingSeal />
          <RingSeal size={88} />
        </SpecRow>
        <SpecRow label="Ring seal on dark — crumb ink, because kiln is illegal here" surface="dark">
          <RingSeal tone="dark" />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="lineart"
        title="Ghosted line art"
        section="§10.3"
        note="1px paper-400 illustrations at 4–6% opacity, oversized, bleeding off a section edge. One per section, never behind a product grid."
      >
        <SpecRow label="Glyphs at full strength (they ship at 5%)">
          <LoafGlyph />
          <AnPanGlyph />
          <KarePanGlyph />
          <WheatGlyph />
          <VanGlyph />
        </SpecRow>
      </SpecSection>
    </>
  );
}

/* ========================================================================== */
/* Primitives                                                                 */
/* ========================================================================== */

function Primitives() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [qty, setQty] = React.useState(2);
  const [switchOn, setSwitchOn] = React.useState(true);
  const [otpStep, setOtpStep] = React.useState<"number" | "code">("number");
  const [phone, setPhone] = React.useState("");

  return (
    <>
      <SpecSection
        id="button"
        title="Button"
        section="§12.10"
        note="Never a kiln-filled primary, never a gradient, never an all-caps label. Pills are used only in the on-photo variant, the stepper and the cart badge."
      >
        <SpecRow label="Primary — sm / md / lg">
          <Button size="sm">Add to the box</Button>
          <Button size="md">Add to the box</Button>
          <Button size="lg">Add to the box</Button>
        </SpecRow>
        <SpecRow label="Primary — hover, active and disabled are CSS states; disabled and loading shown">
          <Button disabled>Checkout</Button>
          <Button loading>Checkout</Button>
          <Button icon={<Plus size={20} strokeWidth={1.5} />} iconPosition="leading">
            Add a loaf
          </Button>
        </SpecRow>
        <SpecRow label="Secondary">
          <Button variant="secondary" size="sm">Skip this week</Button>
          <Button variant="secondary">Pay by card</Button>
          <Button variant="secondary" size="lg">Track the van</Button>
          <Button variant="secondary" disabled>Unavailable</Button>
        </SpecRow>
        <SpecRow label="Ghost — padding drops one step; underline grows from the left">
          <Button variant="ghost" size="sm">Change</Button>
          <Button variant="ghost">Read more</Button>
          <Button variant="ghost" size="lg">Where&rsquo;s the van? →</Button>
        </SpecRow>
        <SpecRow label="Destructive — only inside a confirmation dialog, never inline">
          <Button variant="destructive">Cancel this order</Button>
        </SpecRow>
        <SpecRow label="On-photo — Hero B only. Pill geometry." surface="dark">
          <Button variant="onPhotoPrimary">Order for today</Button>
          <Button variant="onPhotoSecondary">See the route</Button>
        </SpecRow>
        <SpecRow label="Full width, and as a link">
          <div className="w-full max-w-[320px]">
            <Button fullWidth size="lg">
              Reserve yours
            </Button>
          </div>
          <ButtonLink href="/shop" variant="secondary">
            See this week&rsquo;s bake
          </ButtonLink>
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="iconbutton"
        title="IconButton"
        section="§12"
        note="Minimum hit target is 44×44px everywhere. An icon-only control always carries an accessible name."
      >
        <SpecRow label="plain / outline / solid, and round">
          <IconButton label="Close"><X size={24} strokeWidth={1.5} /></IconButton>
          <IconButton label="Add" variant="outline"><Plus size={20} strokeWidth={1.5} /></IconButton>
          <IconButton label="Your box" variant="solid"><ShoppingBag size={24} strokeWidth={1.5} /></IconButton>
          <IconButton label="Previous" round variant="outline" size="sm"><ChevronLeft size={20} strokeWidth={1.5} /></IconButton>
          <IconButton label="Next" round variant="outline" size="sm"><ChevronRight size={20} strokeWidth={1.5} /></IconButton>
          <IconButton label="Disabled" disabled><X size={24} strokeWidth={1.5} /></IconButton>
        </SpecRow>
        <SpecRow label="On dark" surface="dark">
          <IconButton label="Close" variant="onDark"><X size={24} strokeWidth={1.5} /></IconButton>
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="badge"
        title="Badge and tag"
        section="§12.11"
        note="Nano, uppercase, 20px tall, never two lines. A sold-out badge inside a kiln-accented card uses the outline style, because the system has one red family and kiln and danger are never adjacent."
      >
        <SpecRow label="Tint, outline, solid">
          <Badge>Gone this week</Badge>
          <Badge variant="outline">Eggless</Badge>
          <Badge variant="outline">400g</Badge>
          <Badge variant="solid" tabular>3</Badge>
          <Badge variant="crumb">Founding member</Badge>
          <Badge variant="weekly">This week</Badge>
        </SpecRow>
        <SpecRow label="Semantic">
          <Badge variant="success">Delivered</Badge>
          <Badge variant="warning" tabular>Last 3</Badge>
          <Badge variant="danger">Payment failed</Badge>
          <Badge variant="info">On the van</Badge>
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="fields"
        title="Form fields"
        section="§12.24"
        note="The label is always visible and never a placeholder. Errors appear on blur, never on keystroke. Inputs are the one component allowed both a border and a surface tint."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <Field label="Your name" htmlFor="sg-1" helper="We put it on the box.">
            <Input id="sg-1" placeholder="Neha" />
          </Field>
          <Field label="Mobile number" htmlFor="sg-2">
            <Input id="sg-2" prefix="+91" className="font-mono tabular" defaultValue="8618906902" />
          </Field>
          <Field label="Area" htmlFor="sg-3" error="That pincode isn't one we recognise.">
            <Input id="sg-3" invalid defaultValue="999999" />
          </Field>
          <Field label="Email" htmlFor="sg-4" helper="Optional. Only used for your invoice.">
            <Input id="sg-4" valid defaultValue="neha@example.com" />
          </Field>
          <Field label="Window" htmlFor="sg-5">
            <Select id="sg-5" defaultValue="16:00-18:00">
              <option value="12:00-14:00">12–2 PM</option>
              <option value="16:00-18:00">4–6 PM</option>
            </Select>
          </Field>
          <Field label="Disabled" htmlFor="sg-6">
            <Input id="sg-6" disabled defaultValue="Not on this route" />
          </Field>
          <Field label="Leave it with" htmlFor="sg-7" className="md:col-span-2">
            <Textarea id="sg-7" placeholder="Security, if nobody answers" />
          </Field>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div>
            <p className="micro mb-2 text-ink-500">Checkbox and radio</p>
            <Checkbox label="Make this my default address" defaultChecked />
            <Checkbox label="Leave it with security" helper="If nobody answers the door." />
            <Checkbox type="radio" name="sg-lane" label="Catch the van" defaultChecked />
            <Checkbox type="radio" name="sg-lane" label="Home delivery" />
            <Checkbox label="Disabled" disabled />
          </div>
          <div>
            <p className="micro mb-2 text-ink-500">Switch — including the locked state</p>
            <Switch
              id="sg-sw-1"
              checked={switchOn}
              onCheckedChange={setSwitchOn}
              label="When the van is near me"
              helper="One nudge when we turn into your area. At most one a day."
            />
            <Switch
              id="sg-sw-2"
              checked
              locked
              label="Order updates"
              helper="Placed, baking, on the van, delivered."
              lockedCopy="We have to be able to tell you where your bread is."
            />
          </div>
        </div>
      </SpecSection>

      <SpecSection
        id="stepper"
        title="QtyStepper"
        section="§12.9"
        note="108×36px. At quantity 1 the minus shows trash-2 and removes the line. The quantity cross-fades; it never counts up."
      >
        <SpecRow label="Interactive · quantity 1 (trash) · max reached · pending">
          <QtyStepper qty={qty} onIncrement={() => setQty((q) => q + 1)} onDecrement={() => setQty((q) => Math.max(1, q - 1))} />
          <QtyStepper qty={1} onIncrement={() => {}} onDecrement={() => {}} />
          <QtyStepper qty={5} onIncrement={() => {}} onDecrement={() => {}} />
          <QtyStepper qty={2} pending onIncrement={() => {}} onDecrement={() => {}} />
        </SpecRow>
        <SpecRow label="On the dark band" surface="dark">
          <QtyStepper qty={2} tone="onDark" onIncrement={() => {}} onDecrement={() => {}} />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="otp"
        title="OTP phone field"
        section="§12.25"
        note="Two steps in one component; the second replaces the first in place, never on a new page. The digits are never masked, and the sixth digit never auto-submits without a visible state change."
      >
        <SpecRow label="Step 1 — number, then step 2 — code" full>
          <div className="grid gap-10 lg:grid-cols-2">
            <OtpField
              step={otpStep}
              phone={phone}
              onPhoneChange={setPhone}
              onSendCode={() => setOtpStep("code")}
              onChangeNumber={() => setOtpStep("number")}
              resendIn={29}
            />
            <div className="space-y-8">
              <div>
                <p className="micro mb-2 text-ink-500">Verifying</p>
                <OtpBoxes status="verifying" />
              </div>
              <div>
                <p className="micro mb-2 text-ink-500">Success</p>
                <OtpBoxes status="success" />
              </div>
              <div>
                <p className="micro mb-2 text-ink-500">Error</p>
                <OtpBoxes
                  status="error"
                  error="That code didn't match. Try again, or we'll send a new one."
                />
              </div>
            </div>
          </div>
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="overlays"
        title="Dialog, sheet and toast"
        section="§12.22, §12.23"
        note="Focus is trapped, Esc closes, scroll locks, and the trigger regains focus. Below 640px a dialog becomes a bottom sheet."
      >
        <SpecRow label="Triggers">
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            Open bottom sheet
          </Button>
          <Button
            variant="ghost"
            onClick={() => toast({ message: "Changed. Saturday, 4:00–6:00 PM. Same total." })}
          >
            Fire a toast
          </Button>
        </SpecRow>

        <SpecRow label="Toast — success, info and error, statically" surface="paper" full>
          <div className="flex flex-col gap-3">
            <Toast message="Changed. Saturday, 4:00–6:00 PM. Same total." />
            <Toast tone="info" message="Loading. The map comes last, on purpose." />
            <Toast
              tone="error"
              message="That didn't save. Nothing has changed."
              action={{ label: "Try again", onClick: () => {} }}
            />
          </div>
        </SpecRow>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Pause the box?"
          description="Nothing is charged while you're paused. We'll message you the day before it restarts."
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Not now
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Pause until 3 November</Button>
            </>
          }
        />

        <Dialog
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          variant="sheet"
          title="How do you want it?"
        >
          <p className="text-body text-ink-600">
            The sheet form at every width. Below 640px the dialog above takes
            this same shape.
          </p>
        </Dialog>
      </SpecSection>

      <SpecSection
        id="empty"
        title="Empty states and skeletons"
        section="§12.5, §12.20"
        note="A ghosted glyph at 12%, one title line, one body line and exactly one button. Never an illustration in colour, never a spinner as an empty state."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-md bg-paper-0 outline outline-paper-300">
            <EmptyState
              title="Nothing in the box yet."
              body="This week we've got milk bread, custard an pan and three kinds of pastry."
              action={<Button variant="secondary">See this week&rsquo;s bake</Button>}
            />
          </div>
          <div className="rounded-md bg-paper-0 p-6 outline outline-paper-300">
            <p className="micro mb-4 text-ink-500">Loading — 1.4s shimmer, no spinner</p>
            <div className="grid grid-cols-2 gap-4">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
            <Skeleton className="mt-6 h-11 w-40" rounded="md" />
          </div>
        </div>
      </SpecSection>
    </>
  );
}

/* ========================================================================== */
/* Commerce                                                                   */
/* ========================================================================== */

function Commerce() {
  const [category, setCategory] = React.useState("all");
  const [date, setDate] = React.useState<string | null>("2026-10-03");
  const [band, setBand] = React.useState<string | null>("16:00-18:00");
  const [lane, setLane] = React.useState<"catch_the_van" | "home_delivery" | null>("catch_the_van");
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const areas = getAreas();

  const served = areas.find((a) => a.serviceability === "served")!;
  const vanOnly = areas.find((a) => a.serviceability === "catch_van_only") ?? served;
  const notYet = areas.find((a) => a.serviceability === "not_yet") ?? served;

  return (
    <>
      <SpecSection
        id="productcard"
        title="ProductCard"
        section="§12.5"
        note="The well IS the card — no border, no background, no radius on the card itself. Sold out is never hidden, reordered or greyed out of the grid, and its chip is ink-600 on paper-200, not danger: running out is good news, not a fault."
      >
        <SpecRow label="default · in cart · low stock · this week · baked today · sold out" full>
          <ProductGrid>
            <ProductCard product={shokupan} stock={{}} />
            <ProductCard product={anpan} stock={{ bakedToday: true }} rowIndex={1} />
            <ProductCard product={lowSku} stock={{ left: getStockFor(lowSku.slug)?.left ?? 3 }} />
            <ProductCard product={products[3]} stock={{ isNew: true }} rowIndex={1} />
            <ProductCard product={soldOutSku} stock={{ soldOut: true }} />
            <ProductCardSkeleton />
          </ProductGrid>
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="categoryfilter"
        title="CategoryFilter"
        section="§12.6"
        note="A left rail at ≥1024, a snapping scroll rail below. An empty category keeps its chip at ink-400 with aria-disabled — the grid shows the empty state, the category does not disappear."
      >
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <CategoryFilter
            variant="rail"
            categories={categories}
            value={category}
            onChange={setCategory}
            totalCount={products.length}
          />
          <div>
            <CategoryFilter
              variant="chips"
              categories={categories}
              value={category}
              onChange={setCategory}
              totalCount={products.length}
            />
            <p className="mt-4 text-body-sm text-ink-500">
              Selected: <span className="font-mono">{category}</span>
            </p>
          </div>
        </div>
      </SpecSection>

      <SpecSection
        id="slotpicker"
        title="SlotPicker"
        section="§12.8"
        note="Date chips then windows. A day that cannot take an order stays in the rail, greyed, with the reason set beneath it."
      >
        <SlotPicker
          dates={[
            { date: "2026-10-03", available: false, reason: "Orders closed" },
            { date: "2026-10-04", available: false, reason: "No run" },
            { date: "2026-10-05", available: true },
            { date: "2026-10-06", available: true },
            { date: "2026-10-07", available: false, reason: "No run" },
            { date: "2026-10-08", available: true },
          ]}
          bands={[
            { band: "12:00-14:00", available: true },
            { band: "14:00-16:00", available: false },
            { band: "16:00-18:00", available: true },
            { band: "18:00-20:00", available: true },
          ]}
          selectedDate={date}
          selectedBand={band}
          onSelectDate={setDate}
          onSelectBand={setBand}
          note="Order by 8pm for next-day delivery."
        />
      </SpecSection>

      <SpecSection
        id="areacheck"
        title="AreaCheck"
        section="§12.28"
        note="Three results, each naming the outcome and giving exactly one next action. Catch-the-van-only and not-yet are lanes and waitlists — never warning, never danger, never a dead end."
      >
        <SpecRow label="Idle, with the combobox" full>
          <AreaCheck />
        </SpecRow>
        <SpecRow label="1 — served" full>
          <AreaResultBlock area={served} />
        </SpecRow>
        <SpecRow label="2 — catch the van only" full>
          <AreaResultBlock area={{ ...vanOnly, serviceability: "catch_van_only" }} />
        </SpecRow>
        <SpecRow label="3 — not yet" full>
          <AreaResultBlock area={{ ...notYet, serviceability: "not_yet" }} />
        </SpecRow>
        <SpecRow label="Captured (the waitlist confirmation)" full>
          <AreaResultBlock area={{ ...notYet, serviceability: "not_yet" }} captured />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="lanes"
        title="FulfilmentLane"
        section="§12.29"
        note="The price is attached to each lane and always visible — never disclosed later, never 'calculated at checkout'. Changing lane after items are in the box never clears the box."
      >
        <SpecRow label="Selectable, with one lane unavailable for the area" full>
          <FulfilmentLane
            value={lane}
            onChange={setLane}
            options={[
              { id: "catch_the_van", detail: "Saturday · Indiranagar, 12th Main · 4:40–5:10 PM" },
              { id: "home_delivery", detail: "Saturday · Indiranagar · 4 to 6pm" },
            ]}
          />
        </SpecRow>
        <SpecRow label="Unavailable for this area" full>
          <FulfilmentLane
            value={null}
            onChange={() => {}}
            options={[
              { id: "catch_the_van", detail: "Saturday · HSR Layout · 3:15–3:45 PM" },
              { id: "home_delivery", detail: "—", available: false, reason: "NOT IN WHITEFIELD YET" },
            ]}
          />
        </SpecRow>
        <SpecRow label="No area set — both disabled, with the AreaCheck above" full>
          <FulfilmentLane
            value={null}
            areaSet={false}
            onChange={() => {}}
            options={[
              { id: "catch_the_van", detail: "—" },
              { id: "home_delivery", detail: "—" },
            ]}
          />
        </SpecRow>
        <SpecRow label="Compact summary — cart drawer, checkout, confirmation" full>
          <FulfilmentSummary
            lane="home_delivery"
            detail="Saturday · Banaswadi · 4–6 PM"
            onChange={() => {}}
          />
          <FulfilmentSummary
            lane="catch_the_van"
            detail="Saturday · Indiranagar, 12th Main · 4:40–5:10 PM"
            onChange={() => {}}
          />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="locationchip"
        title="Location chip and the Area & lane sheet"
        section="journey §2.2, §2.3"
        note="The chip holds three facts — place, mode, next slot — and is the single source of truth for every location-dependent answer on the site. It is the entry point to the sheet, which is where lane and area are chosen before the cart."
      >
        <SpecRow label="The chip, reading the live session store">
          <LocationChip onOpen={() => setSheetOpen(true)} />
          <span className="text-body-sm text-ink-500">
            Set an area in the sheet to watch it change.
          </span>
        </SpecRow>

        <SpecRow label="The sheet — two steps, three results">
          <Button onClick={() => setSheetOpen(true)}>Open the sheet</Button>
          <span className="text-body-sm text-ink-500">
            Step 1 resolves to served (Indiranagar), van only (HSR Layout) or
            not yet (Whitefield). Only served carries on to step 2.
          </span>
          <AreaLaneSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="cart"
        title="Cart drawer"
        section="§12.7"
        note="Mounted globally. Add something from the ProductCard grid above and open it from the header, or press the button here. The total shown is the total charged — delivery is inside it."
      >
        <SpecRow label="Open the live drawer">
          <CartOpener />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="dropcard"
        title="DropCard"
        section="§12.27"
        note="Say how many you baked. Never how long is left. No clock, no ticking digits, no red, no 'hurry' — the cut-off carries all the time pressure and is stated once, in body colour."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <DropCard
            kicker="Saturday · Indiranagar"
            name="The Saturday Bake"
            baked={40}
            left={12}
            reserved={28}
            cutoffLine="Orders close Thursday 8pm. No restocks, it is a van."
          />
          <DropCard
            kicker="Saturday · Indiranagar"
            name="The Saturday Bake"
            baked={40}
            left={4}
            reserved={36}
            cutoffLine="Orders close Thursday 8pm. No restocks, it is a van."
          />
          <DropCard
            kicker="Saturday · Indiranagar"
            name="The Saturday Bake"
            status="sold-out"
            baked={40}
            left={0}
            reserved={40}
            soldOutCause="Forty loaves, gone by 9:15. Thank you, Indiranagar."
            cutoffLine="Orders close Thursday 8pm."
          />
        </div>
      </SpecSection>

      <SpecSection
        id="upi"
        title="UPI pay button"
        section="§12.34"
        note="The amount is in the label in every state that has one. The accepted apps are plain text, never logo lockups. The page never blanks out to a spinner while the user is away in their UPI app."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="micro mb-3 text-ink-500">idle</p>
            <UpiPayButton amount={840} />
          </div>
          <div className="space-y-8">
            <div>
              <p className="micro mb-3 text-ink-500">awaiting — after 20s the cancel appears</p>
              <UpiPayButton amount={840} state="awaiting" expiresIn={292} showCancel />
            </div>
            <div>
              <p className="micro mb-3 text-ink-500">returned-unknown — no action for 8s</p>
              <UpiPayButton amount={840} state="returned-unknown" showRefresh />
            </div>
            <div>
              <p className="micro mb-3 text-ink-500">success</p>
              <UpiPayButton amount={840} state="success" />
            </div>
            <div>
              <p className="micro mb-3 text-ink-500">failed — reassurance first</p>
              <UpiPayButton amount={840} state="failed" />
            </div>
          </div>
        </div>
      </SpecSection>
    </>
  );
}

function CartOpener() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <Button
      variant="secondary"
      disabled={!mounted}
      onClick={() => {
        // The drawer store is mounted in SiteChrome; open it from anywhere.
        import("@/store/cart").then((m) => m.useCartStore.getState().open());
      }}
    >
      Open the cart drawer
    </Button>
  );
}

/* ========================================================================== */
/* Van and proof                                                              */
/* ========================================================================== */

function VanAndProof() {
  const [vanStatus, setVanStatus] = React.useState<VanStatus>("live");
  const van = getVanState(vanStatus);

  return (
    <>
      <SpecSection
        id="tracker"
        title="Tracker"
        section="§12.16, §12.17"
        note="Status, hero line, arrival band and route list are server-rendered BEFORE the map. Off air is the primary state — same layout, different content, never styled as an error and never smaller than live."
      >
        <SpecRow label="Every status pill">
          {VAN_STATES.map((status) => {
            const state = getVanState(status);
            return (
              <VanStatusPill
                key={status}
                status={state.status}
                label={state.statusLabel ?? status.toUpperCase()}
              />
            );
          })}
        </SpecRow>

        <SpecRow label="The panel — switch state" full>
          <div className="mb-4 flex flex-wrap gap-2">
            {VAN_STATES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setVanStatus(status)}
                className={
                  status === vanStatus
                    ? "micro rounded-sm bg-ink-800 px-3 py-2 text-paper-0"
                    : "micro rounded-sm border border-paper-300 px-3 py-2 text-ink-600"
                }
              >
                {status}
              </button>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <TrackerCard van={van} compact />
            <div>
              <p className="micro mb-3 text-ink-500">Route list on its own</p>
              <RouteList stops={van.stops} />
            </div>
          </div>
        </SpecRow>

        <SpecRow label="Van strip — three states (journey §6.3). A link, never a modal." full>
          <div className="space-y-2">
            <VanStrip state="live_near_you" copy={van.strip} />
            <VanStrip state="live_elsewhere" copy={van.strip} />
            <VanStrip state="off_air" copy={van.strip} onNotify={() => {}} />
          </div>
        </SpecRow>

        <SpecRow label="Van strip on dark" surface="dark" full>
          <VanStrip state="live_near_you" copy={van.strip} tone="dark" />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="bakestrip"
        title="BakeStrip"
        section="§12.30"
        note="Four real kitchen timestamps. A fabricated bake strip is worse than no bake strip, so a step with no event time renders pending with an em dash. No progress bar, no percentage."
      >
        <SpecRow label="Live — three done, one active" full>
          <BakeStrip steps={getVanState("live").bakeStrip} activeStep="loading" />
        </SpecRow>
        <SpecRow label="Off air — all four pending, with the next-bake line" full>
          <BakeStrip
            steps={getVanState("off_air").bakeStrip}
            footnote="NEXT BAKE SATURDAY, FROM 4:10AM"
          />
        </SpecRow>
        <SpecRow label="On the dark band" surface="dark" full>
          <BakeStrip steps={getVanState("live").bakeStrip} activeStep="loading" tone="dark" />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="proof"
        title="ProofBlock and SpecList"
        section="§12.33"
        note="Every value is a real, checkable number or a real material. No adjective in a spec cell — 'SLOW FERMENT' is not a spec, '18H FERMENT' is. If a value is unknown the row is omitted."
      >
        <SpecRow label="Inline variant — maximum four cells" full>
          <ProofBlock
            specs={[
              { label: "Hydration", value: "82% HYDRATION [TBC]" },
              { label: "Ferment", value: "18H FERMENT [TBC]" },
              { label: "Bake", value: "BAKED 5:40" },
              { label: "Egg", value: "EGG NONE" },
            ]}
            claim="Eggless. Nobody in 300 tastings could tell."
          />
        </SpecRow>
        <SpecRow label="List variant — maximum seven rows, with dot leaders" full>
          <SpecList
            specs={[
              { label: "Hydration", value: "82% [TBC]" },
              { label: "Ferment", value: "18 hours [TBC]" },
              { label: "Bake", value: "5:40 AM" },
              { label: "Flour", value: "Japanese milled" },
              { label: "Egg", value: "None" },
              { label: "Preservatives", value: "None" },
              { label: "Best on", value: "Day one" },
            ]}
          />
        </SpecRow>
        <SpecRow label="How to eat it — pairs with the spec block on every PDP" full>
          <HowToEatIt>
            Tear it, don&rsquo;t slice it. A shokupan crumb pulls apart in sheets,
            and a knife crushes exactly the structure the overnight ferment built.
          </HowToEatIt>
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="stats"
        title="StatsBand"
        section="§12.14"
        note="Cells are separated by vertical hairlines, not by gaps. Values render at their final number — there is no count-up animation, and every number is true or it does not ship."
      >
        <div data-surface="dark" className="rounded-md bg-ink-900 py-6">
          <StatsBand
            stats={[
              { value: "23", caption: "BAKES ON THE MENU" },
              { value: "100%", caption: "EGGLESS" },
              { value: "4:10", caption: "MIXING STARTS" },
              { value: "6", caption: "AREAS ON A ROUTE" },
            ]}
          />
        </div>
      </SpecSection>
    </>
  );
}

/* ========================================================================== */
/* Marketing                                                                  */
/* ========================================================================== */

function Marketing() {
  const [tickerState, setTickerState] = React.useState<TickerState>("orders-open");
  const [optIn, setOptIn] = React.useState<"idle" | "success" | "already">("idle");
  const [newsletter, setNewsletter] = React.useState<"idle" | "success">("idle");
  const ledger = getLoyaltyLedger();
  const subscription = getSubscription();

  return (
    <>
      <SpecSection
        id="hero"
        title="Hero — variant A, the paper hero"
        section="§12.3"
        note="7/5 split, never 6/6. Paper-50 with grain, no photo, no gradient. The ring seal overlaps the column boundary. Variant B (full-bleed statement) needs a photograph that has not been shot yet."
      >
        <div className="-mx-6 overflow-hidden rounded-md outline outline-paper-300">
          <HeroPaper
            kicker="Bengaluru · 100% eggless · baked at 6 am"
            headline="Bread, brought to you."
            lead="A moving bakery on a fixed route. Japanese milk bread, baked before dawn and driven to your street in a two-hour window."
            image={shokupan.image}
            actions={
              <>
                <Button size="lg">Order for today</Button>
                <Button variant="ghost" size="lg">
                  Where&rsquo;s the van? →
                </Button>
              </>
            }
          />
        </div>
      </SpecSection>

      <SpecSection
        id="ticker"
        title="Announcement ticker"
        section="§12.2, journey §2.1"
        note="The certainty sentence: never 'delivery available', always the day and the hour. It marquees, pauses on hover and focus, and is dismissible for the session. Not sticky — it scrolls away, so it and the dark band's marquee are never both in view."
      >
        <SpecRow label="Pick a state">
          {(Object.keys(TICKER_COPY) as TickerState[]).map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setTickerState(state)}
              className={
                state === tickerState
                  ? "micro rounded-sm bg-ink-800 px-3 py-2 text-paper-0"
                  : "micro rounded-sm border border-paper-300 px-3 py-2 text-ink-600"
              }
            >
              {state}
            </button>
          ))}
        </SpecRow>
        <div className="overflow-hidden rounded-md">
          <AnnouncementTicker key={tickerState} state={tickerState} />
        </div>
      </SpecSection>

      <SpecSection
        id="threedoors"
        title="ThreeDoors"
        section="§12.32"
        note="Exactly three — not four, not a carousel. Each door is named twice: a plain-English role, then the real name with a sensory line. The escape hatch below is mandatory and never de-emphasised."
      >
        <ThreeDoors
          doors={[
            {
              role: "The Loaf",
              name: "Milk Shokupan",
              kana: shokupan.kana,
              sensory: "Pull-apart, cloud-soft.",
              price: shokupan.price,
              href: shokupan.href,
              image: shokupan.image,
            },
            {
              role: "The Sweet One",
              name: "Custard An Pan",
              kana: anpan.kana,
              sensory: "Soft bun, warm centre.",
              price: anpan.price,
              href: anpan.href,
              image: anpan.image,
            },
            {
              role: "The Box",
              name: "The Sunday Table",
              sensory: "A loaf and three bakes, chosen for you.",
              price: 499,
              href: "/boxes",
              image: null,
            },
          ]}
        />
      </SpecSection>

      <SpecSection
        id="subscription"
        title="SubscriptionPlanCard"
        section="§12.18"
        note={`${SUBSCRIPTION_NAME} must be trivially escapable, or people will not start one. Skip and pause sit on the card itself — never behind a Manage page, never behind a retention flow, and never in danger red.`}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <SubscriptionPlanCard
            planName="One loaf"
            cadence="Every week"
            price={180}
            benefits={["1 Milk Shokupan", "Your run day, your stop", "Skip any week"]}
            priceNote={subscription.plan.priceConfidence}
          />
          <SubscriptionPlanCard
            planName="The Table"
            cadence="Every week"
            price={310}
            state="recommended"
            benefits={[
              "1 bread + 1 rotating bun",
              "Swap anything before the cutoff",
              "2 coins per ₹100, as always",
            ]}
            priceNote="Est. — derived from retail, not founder-set"
          />
          <SubscriptionPlanCard
            planName="The Table"
            cadence="Every Saturday"
            price={310}
            state="current"
            benefits={["1 bread + 1 rotating bun", "Indiranagar, 12th Main", "4:40–5:10 PM"]}
            nextDelivery="Next: Saturday 3 October · 4:40–5:10 PM"
            cutoffNotice="CHANGES FOR THIS SATURDAY CLOSE THURSDAY 8PM"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <SubscriptionPlanCard
            planName="The Table"
            cadence="Every Saturday"
            price={310}
            state="current"
            benefits={["1 bread + 1 rotating bun"]}
            nextDelivery="Next: Saturday 3 October"
            skipped="Saturday 3 October skipped"
            onUndoSkip={() => {}}
          />
          <SubscriptionPlanCard
            planName="The Table"
            cadence="Every Saturday"
            price={310}
            state="paused"
            pausedLabel="Paused · back 3 Nov"
            benefits={["1 bread + 1 rotating bun", "Nothing is charged while paused"]}
          />
          <SubscriptionPlanCard
            planName="The Table"
            cadence="Every Saturday"
            price={310}
            state="current"
            benefits={["1 bread + 1 rotating bun"]}
            nextDelivery="Next: Saturday 3 October"
            banner="We couldn't take this week's payment, so Saturday is on hold. Nothing else has changed."
          />
        </div>
      </SpecSection>

      <SpecSection
        id="testimonial"
        title="Testimonial"
        section="§12.13"
        note="No card, no quote-mark graphic, no star row above the quote. The star is the only permitted filled icon in the system, and it is filled with crumb."
      >
        <TestimonialRail
          controls={
            <>
              <IconButton label="Previous" round variant="outline" size="sm">
                <ChevronLeft size={20} strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Next" round variant="outline" size="sm">
                <ChevronRight size={20} strokeWidth={1.5} />
              </IconButton>
            </>
          }
        >
          <Testimonial
            quote="The van turned into our lane at 4:45 and the bread was still warm."
            name="Ananya"
            meta="INDIRANAGAR · MAY 2026"
            rating={5}
          />
          <Testimonial
            quote="I have made shokupan for years and I cannot tell there is no egg in it."
            name="Rahul"
            meta="KORAMANGALA · APRIL 2026"
            rating={5}
          />
        </TestimonialRail>
        <SpecRow label="Rating on its own">
          <Rating value={5} />
          <Rating value={4} />
          <Rating value={3} />
        </SpecRow>
      </SpecSection>

      <SpecSection
        id="faq"
        title="FAQ accordion"
        section="§12.19"
        note="A hairline-separated list, no card, no radius. Multiple panels may be open at once — someone comparing two answers should not have to re-open the first."
      >
        <Faq
          items={[
            {
              question: "Is everything really eggless?",
              answer:
                "Yes. Every bake on the menu is vegetarian and eggless, and it always has been — it is the constraint the bakery was built around, not a substitution.",
            },
            {
              question: "What happens if I miss the van?",
              answer:
                "Message us on WhatsApp. We hold your order on board for the rest of the run, and if we cannot reach you we refund it — we would rather not keep money for bread you did not get.",
            },
            {
              question: "Why is the menu only 23 items?",
              answer:
                "Because it is a van, and a van has one oven's worth of space. Twenty-three is what fits and what we can bake properly before dawn.",
            },
          ]}
        />
      </SpecSection>

      <SpecSection
        id="whatsapp"
        title="WhatsApp opt-in"
        section="§12.31, journey §6.4"
        note="Never a cold prompt on load — it appears after a value moment. 'Not now' is always present and is a real ghost button, the same size as the primary. The expectation IS the pitch, so what the message says and how often comes before the button."
      >
        <SpecRow label="Pick a state">
          {(["idle", "success", "already"] as const).map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setOptIn(state)}
              className={
                state === optIn
                  ? "micro rounded-sm bg-ink-800 px-3 py-2 text-paper-0"
                  : "micro rounded-sm border border-paper-300 px-3 py-2 text-ink-600"
              }
            >
              {state}
            </button>
          ))}
        </SpecRow>
        <WhatsAppOptIn state={optIn} area="Indiranagar" />
      </SpecSection>

      <SpecSection
        id="newsletter"
        title="Newsletter row"
        section="§12.21"
        note="This is the marketing-list capture (the Sunday message). The van-proximity nudge above is a different consent — the two are never shown in the same viewport. Success replaces the form in place: no toast, no redirect."
      >
        <SpecRow label="Toggle success">
          <Button
            variant="ghost"
            icon={<Check size={16} strokeWidth={1.5} />}
            onClick={() => setNewsletter((s) => (s === "idle" ? "success" : "idle"))}
          >
            {newsletter === "idle" ? "Show success" : "Show form"}
          </Button>
        </SpecRow>
        <div className="-mx-6 overflow-hidden rounded-md">
          <NewsletterRow state={newsletter} />
        </div>
        <div className="-mx-6 mt-6 overflow-hidden rounded-md">
          <NewsletterRow state="idle" surface="dark" />
        </div>
      </SpecSection>

      <SpecSection
        id="loyalty"
        title="Fillo+ chrome"
        section="DECISIONS.md §3"
        note="Fillo+ is FREE and phone-based. The ₹1 join fee is retired; anyone who paid it carries a Founding member badge. Coins are 2 per ₹100 and 25 coins is ₹25 off."
      >
        <SpecRow label="Balance, progress and the ledger" full>
          <p className="font-display text-display-md text-ink-800 tabular">
            {ledger.balance} coins
          </p>
          <p className="mt-1 text-body text-ink-600">{ledger.progressCopy}</p>
          <div className="mt-4 h-1 w-full max-w-[320px] bg-paper-200" aria-hidden="true">
            <div
              className="h-full bg-crumb"
              style={{ width: `${(ledger.balance / ledger.redeemThreshold) * 100}%` }}
            />
          </div>
          <div className="mt-6 max-w-[520px]">
            <SpecList
              specs={ledger.entries.slice(0, 5).map((e) => ({
                label: `${e.dateLabel} · ${e.description}`,
                value: `${e.coins > 0 ? "+" : ""}${e.coins}`,
              }))}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="crumb">Founding member</Badge>
            <Button size="sm" icon={<MessageCircle size={16} strokeWidth={1.5} />}>
              Redeem ₹25 off
            </Button>
          </div>
        </SpecRow>
      </SpecSection>
    </>
  );
}

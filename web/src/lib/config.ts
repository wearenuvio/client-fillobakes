import { getLanes, type LaneId } from "@/lib/mock";

/**
 * Commercial and contact constants.
 *
 * Numbers the founders have not signed off are marked TBC in
 * mock-data.json's `meta.tbc` register. They are centralised here so a single
 * edit updates every surface, and so no page hard-codes a value that might be
 * wrong. Per DECISIONS.md §10, a number that is not true is either tagged or
 * not shipped.
 */

export type { LaneId };

export const SITE = {
  name: "Fillo Bakes",
  legalName: "Wise Eats SuperFood OPC Pvt Ltd",
  baseUrl: "https://www.fillobakes.com",
  locale: "en-IN",
  city: "Bengaluru",
  /** "Bangalore" wins in titles and keywords, "Bengaluru" in body copy. */
  citySeo: "Bangalore",
  state: "Karnataka",
  country: "IN",
  founded: "2025-12",
  founders: ["Neha S Nirmal", "Nischal Vasant Meethal"],
  hours: "Mo-Su 10:00-19:00",
  hoursLabel: "Monday to Sunday, 10:00 AM to 7:00 PM",
} as const;

export const CONTACT = {
  phone: "+91 86189 06902",
  phoneE164: "+918618906902",
  whatsappNumber: "918618906902",
  email: "wiseeatsindia@gmail.com",
  instagram: "https://www.instagram.com/fillo_bakes",
  instagramHandle: "@fillo_bakes",
} as const;

/** Pre-fills the WhatsApp message with page context (journey §2.7). */
export function whatsappHref(message: string): string {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const COMMERCE = {
  currency: "INR",
  /** Home delivery, charged INSIDE the total — never "calculated at checkout". */
  deliveryFee: 49,
  /** Free above this subtotal. [TBC — assumed per DECISIONS v2.] */
  freeDeliveryThreshold: 499,
  /** Catch the van is free, always. */
  vanLaneFee: 0,
  /** Orders close at 8pm the evening before a run. [TBC] */
  cutoffHour: 20,
  cutoffLabel: "8pm the evening before a run",
  /** Per-line cap surfaced by the stepper's "MAX 5 PER ORDER" tooltip. */
  maxPerLine: 5,
  /** Fillo+ is FREE and phone-based. There is no ₹1 fee anywhere. */
  coinsPerHundred: 2,
  coinsBasis: 100,
  coinsRedeemThreshold: 25,
  coinsRedeemValue: 25,
} as const;

/** The subscription product's name. Never "Weekly Box". */
export const SUBSCRIPTION_NAME = "The Standing Order";

/** Membership is free — the ₹1 join fee is retired (DECISIONS.md v2 §3). */
export const MEMBERSHIP = {
  name: "Fillo+",
  price: 0,
  priceLabel: "Free",
  foundingMemberBadge: "Founding member",
} as const;

export const LANE_IDS = ["catch_the_van", "home_delivery"] as const;

/**
 * Lane presentation, read from mock-data so the price on the card and the
 * price in the total can never drift apart.
 */
export const LANES = Object.fromEntries(
  getLanes().map((lane) => [
    lane.id,
    {
      ...lane,
      qualifier:
        lane.id === "catch_the_van"
          ? "NO FEE, EVER"
          : (lane.freeOverLabel ?? `FREE OVER ₹${COMMERCE.freeDeliveryThreshold}`).toUpperCase(),
    },
  ]),
) as Record<
  LaneId,
  ReturnType<typeof getLanes>[number] & { qualifier: string }
>;

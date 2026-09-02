import { COMMERCE, CONTACT } from "@/lib/config";

/**
 * The fifteen questions — site-content.md, Page: FAQ.
 *
 * One array, three groups, used twice: the accordion renders it and
 * `faqLd()` serialises the identical strings into FAQPage JSON-LD, so the
 * markup and the page can never disagree. That is why every answer is a plain
 * string with an optional link beside it rather than free JSX.
 *
 * The FAQ is one of the few places the voice allows humour (voice rule 1:
 * humour where they are bored, plainness where they pay). Every TBC in the
 * source copy is answered honestly here — we say what is not settled instead
 * of rounding it into a confident number (DECISIONS §10).
 */

export type QA = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export type QaGroup = { id: string; title: string; items: QA[] };

export const FAQ_GROUPS: QaGroup[] = [
  {
    id: "delivery-and-the-van",
    title: "Delivery and the van",
    items: [
      {
        question: "Do you deliver to my area?",
        answer:
          "Set your area in the chip at the top of any page. If we reach you, it shows your route days, your windows and the delivery fee before you add anything to a box. If we don't, leave your number — we plan routes by demand, and a cluster of requests in one place is the thing that moves the van.",
        link: { href: "/areas", label: "Check your area" },
      },
      {
        question: "What is a moving bakery, exactly?",
        answer:
          "A van with our bread in it, running a fixed neighbourhood route on set days. You can have it delivered to your door in a two-hour window, or meet the van at a stop and pay no delivery fee.",
        link: { href: "/van", label: "See where the van is" },
      },
      {
        question: "Can I just walk up to the van?",
        answer:
          "Yes. If it's on your street you don't need an order. Come to the hatch and buy what's there. UPI and card both work. What's on board is what's on board, and the popular things go early.",
      },
      {
        question: "When does the van come to me?",
        answer:
          "Each route has its own run days, and your area decides your route. Set your area once and the header carries it from then on: place, mode, next slot. Some routes run three times a week, one runs daily. On the days your route isn't running, the schedule is the thing to look at, not the map.",
        link: { href: "/van", label: "The run schedule" },
      },
      {
        question: "How late can I order?",
        answer:
          "8pm the evening before a run. Order by Thursday 8pm for Saturday's run. That is when the dough goes in. The exact hour is still being confirmed with the kitchen, so treat 8pm as the working rule rather than a contract. Past it, the next available run is pre-selected for you and the closed date is shown greyed with the rule beside it, not hidden.",
      },
      {
        question: "What does delivery cost?",
        answer: `Two lanes. Catching the van at a stop is free. Home delivery is ₹${COMMERCE.deliveryFee}, free over ₹${COMMERCE.freeDeliveryThreshold} — that threshold is the one number on this page the founders have not signed off yet. The fee is inside the total from the first screen. If the number on the button ever differs from the number you're charged, tell us — that's a bug, not a policy.`,
        link: { href: "/policies/shipping", label: "The delivery policy" },
      },
      {
        question: "What if I'm not home?",
        answer:
          "We call once and wait. How long we wait is not a number we have measured yet, so we are not going to print one. You can tell us at checkout where to leave it. Bread left outside in Bengaluru in June is bread we wouldn't want to eat, so we'd rather you picked a window when someone's in.",
      },
    ],
  },
  {
    id: "the-bread",
    title: "The bread",
    items: [
      {
        question: "Is everything really eggless?",
        answer:
          "Yes. All 23 items, every batch, no exceptions. Under Indian labelling rules egg is a non-vegetarian ingredient, so the green mark on our packaging already carries the claim.",
        link: { href: "/journal/why-eggless", label: "Why eggless" },
      },
      {
        question: "Is it vegan?",
        answer:
          "No. The breads and most of the fillings contain dairy — milk and butter are what make a milk bread a milk bread. Eggless and vegetarian, not vegan.",
      },
      {
        question: "What about nuts?",
        answer:
          "Pistachio An Pan contains pistachio. Every product page carries a fixed allergen block with three lines: what it contains, what it does not, and what else the kitchen handles. That third line is not published yet — we will not describe a shared kitchen until the founders have confirmed exactly what shares it.",
      },
      {
        question: "How long does it keep?",
        answer:
          "We do not have a tested answer per format in Bengaluru conditions yet, and a guess about food safety is worse than a gap. The short version we can already say: bread is best on day one, good on day two, and excellent as French toast on day three.",
        link: { href: "/guides/how-to-store-shokupan", label: "How to keep milk bread" },
      },
      {
        question: "Do you use preservatives?",
        answer:
          "No. That's also why the answer to the previous question is measured in days, not weeks.",
      },
    ],
  },
  {
    id: "money",
    title: "Money",
    items: [
      {
        question: "How do I pay?",
        answer:
          "UPI first, then cards, netbanking and wallets, all through Razorpay. We never see or store your card details. Cash at the door is available on a first order for a small surcharge and only under a cap — both figures are still being confirmed, so the checkout will tell you the real ones before you commit. Prepaid keeps the van light.",
        link: { href: "/policies/payment", label: "Payment and security" },
      },
      {
        question: "Can I get a refund?",
        answer:
          "Everything is baked for the day it's made, so we can't take returns. But if a box arrives damaged, wrong, or genuinely not right, message us within 24 hours with a photo and we'll sort it. Every time. Refunds go back through Razorpay and take 7 to 10 working days, which is the bank's pace, not ours.",
        link: { href: "/policies/refund", label: "The refunds policy" },
      },
      {
        question: "What is Fillo+, and is it the same as the Standing Order?",
        answer: `No. Fillo+ is a free membership tied to your phone number. It earns you ${COMMERCE.coinsPerHundred} coins per ₹${COMMERCE.coinsBasis} spent, and ${COMMERCE.coinsRedeemThreshold} coins is ₹${COMMERCE.coinsRedeemValue} off. The Standing Order is a weekly bread subscription that rides your route's run. It earns coins too. You can have either, or both.`,
        link: { href: "/fillo-plus", label: "What Fillo+ is" },
      },
    ],
  },
];

export const FAQ_ITEMS: QA[] = FAQ_GROUPS.flatMap((group) => group.items);

/** The shokupan landing page answers the four questions that page gets asked. */
export const SHOKUPAN_FAQ: QA[] = [
  {
    question: "What is shokupan?",
    answer:
      "Japan's everyday loaf. A fine, even crumb, a thin crust, and slices that pull apart in soft sheets rather than crumbling. In Japan it is the bread you keep in the house, not the one you buy for an occasion.",
    link: { href: "/guides/what-is-shokupan", label: "The long version" },
  },
  {
    question: "Is your shokupan eggless?",
    answer:
      "Yes, and so is everything else we bake. Egg is usually what gives a milk loaf its softness, so removing it meant finding that softness somewhere else — in hydration and in time.",
    link: { href: "/journal/why-eggless", label: "Why eggless" },
  },
  {
    question: "How do I get it?",
    answer:
      "Two lanes. Meet the van at a stop on its run, which is free, or have it delivered to your door in a two-hour window. Orders for a run close at 8pm the evening before it, because that is when the dough goes in.",
    link: { href: "/van", label: "Where the van goes" },
  },
  {
    question: "How should I eat it?",
    answer:
      "Tear it, don't slice it — it gives up in soft sheets. On day two, toast it. On day three, French toast. It holds a shape under butter, jam or a sandwich filling without going to pieces, which is the whole point of the loaf.",
    link: { href: "/guides/how-to-store-shokupan", label: "How to keep it" },
  },
];

export const FAQ_FOOT = {
  heading: "Still stuck?",
  body: "If the answer isn't here, WhatsApp us. We reply faster than we update this page.",
  whatsapp: CONTACT.phone,
} as const;

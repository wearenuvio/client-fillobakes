import { COMMERCE, CONTACT } from "@/lib/config";

/**
 * The questions — PAGES-v2 FAQ, sourced from src-content/site-content.md.
 *
 * One array, four groups, used twice: the accordion renders it and `faqLd()`
 * serialises the identical strings into FAQPage JSON-LD, so the rich result
 * can never describe a page that no longer says that. Which is why every
 * answer is a plain string with an optional link beside it rather than JSX.
 *
 * Every number here is live from `COMMERCE`. Nothing hedges: DESIGN-v2 §4
 * forbids a "still being confirmed" string from reaching a customer, so where
 * a figure was open it is now stated at the agreed default, and where a fact
 * is genuinely unmeasured — how long bread keeps in a Bengaluru June, how
 * long a rider waits — the sentence is written so it does not need a number.
 */

export type QA = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export type QaGroup = { id: string; title: string; items: QA[] };

export const FAQ_GROUPS: QaGroup[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        question: "How late can I order?",
        answer:
          "8pm the evening before a run. Order by Thursday 8pm for Saturday's run, because that is when the dough goes in. Past it, the next available run is pre-selected for you, and the closed date stays visible with the rule beside it rather than disappearing.",
      },
      {
        question: "How do I pay?",
        answer:
          "UPI first, then cards, netbanking and wallets, all through Razorpay. We never see or store your card details. Cash at the door is available on a first order for a small surcharge, shown before you commit.",
        link: { href: "/policies/payment", label: "Payment and security" },
      },
      {
        question: "Can I get a refund?",
        answer:
          "Everything is baked for the day it is made, so we cannot take returns. If a box arrives damaged, wrong, or genuinely not right, message us within 24 hours with a photo and we will sort it. Every time. Refunds go back through Razorpay and take 7 to 10 working days, which is the bank's pace rather than ours.",
        link: { href: "/policies/refund", label: "The refunds policy" },
      },
    ],
  },
  {
    id: "delivery-and-the-van",
    title: "Delivery and the van",
    items: [
      {
        question: "Do you deliver to my area?",
        answer:
          "Set your area in the cart and we will tell you the route days, the windows and the fee before you pay for anything. If we do not reach you yet, leave your number. We plan routes by demand, and a cluster of requests in one place is the thing that moves the van.",
        link: { href: "/areas", label: "Check your area" },
      },
      {
        question: "What is a moving bakery, exactly?",
        answer:
          "A van with our bread in it, running a fixed neighbourhood route on set days. You can have it delivered to your door in a two-hour window, or meet the van at a stop and pay no delivery fee.",
        link: { href: "/van", label: "See where the van is" },
      },
      {
        question: "When does the van come to me?",
        answer:
          "Each route has its own run days, and your area decides your route. Some routes run three times a week, one runs daily. On the days your route is not running, the schedule is the thing to look at rather than the map.",
        link: { href: "/van", label: "The run schedule" },
      },
      {
        question: "What does delivery cost?",
        answer: `Two lanes. Catching the van at a stop is free. Home delivery is ₹${COMMERCE.deliveryFee}, and free over ₹${COMMERCE.freeDeliveryThreshold}. The fee is inside the total from the first screen, never added afterwards. If the number on the button ever differs from the number you are charged, tell us. That is a bug, not a policy.`,
        link: { href: "/policies/shipping", label: "The delivery policy" },
      },
      {
        question: "Can I just walk up to the van?",
        answer:
          "Yes. If it is on your street you do not need an order. Come to the hatch and buy what is there. UPI and card both work. What is on board is what is on board, and the popular things go early.",
      },
      {
        question: "What if I am not home?",
        answer:
          "We call once and wait. You can tell us at checkout where to leave it. Bread left outside in Bengaluru in June is bread we would not want to eat, so we would rather you picked a window when someone is in.",
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
          "No. The breads and most of the fillings contain dairy, because milk and butter are what make a milk bread a milk bread. Eggless and vegetarian, not vegan.",
      },
      {
        question: "What about nuts?",
        answer:
          "Pistachio An Pan contains pistachio. Every product page lists what that bake contains and what it does not, so you can check before you order rather than after.",
      },
      {
        question: "How long does it keep?",
        answer:
          "Bread is best on the day it arrives, good the next day, and excellent as French toast the day after that. Keep it wrapped at room temperature rather than in the fridge, which dries a milk loaf faster than the counter does.",
        link: { href: "/guides/how-to-store-shokupan", label: "How to keep milk bread" },
      },
      {
        question: "Do you use preservatives?",
        answer:
          "No. That is also why the answer to the previous question is measured in days rather than weeks.",
      },
    ],
  },
  {
    id: "standing-order-and-fillo-plus",
    title: "Standing Order and Fillo+",
    items: [
      {
        question: "What is Fillo+, and is it the same as the Standing Order?",
        answer: `No. Fillo+ is a free membership tied to your phone number. It earns you ${COMMERCE.coinsPerHundred} coins per ₹${COMMERCE.coinsBasis} spent, and ${COMMERCE.coinsRedeemThreshold} coins is ₹${COMMERCE.coinsRedeemValue} off. The Standing Order is a weekly bread subscription that rides your route's run. It earns coins too. You can have either, or both.`,
        link: { href: "/fillo-plus", label: "What Fillo+ is" },
      },
      {
        question: "Can I skip a week?",
        answer:
          "Yes, until 8pm the evening before the run. You are not charged for a skipped week, and the one after it is unaffected.",
        link: { href: "/account/subscription", label: "Manage your standing order" },
      },
      {
        question: "How do I cancel a standing order?",
        answer:
          "One tap, from your account. No phone call. Your last delivery is the one already in the plan, and you keep your coins. If it is a break rather than an ending, pause it instead and nothing is charged while you are away.",
        link: { href: "/standing-order", label: "How the Standing Order works" },
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
      "Yes, and so is everything else we bake. Egg is usually what gives a milk loaf its softness, so removing it meant finding that softness somewhere else, in hydration and in time.",
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
      "Tear it, do not slice it. It gives up in soft sheets. On day two, toast it. On day three, French toast. It holds a shape under butter, jam or a sandwich filling without going to pieces, which is the whole point of the loaf.",
    link: { href: "/guides/how-to-store-shokupan", label: "How to keep it" },
  },
];

export const FAQ_FOOT = {
  heading: "Still wondering?",
  body: "If the answer is not here, message us. We reply faster than we update this page.",
  whatsapp: CONTACT.phone,
} as const;

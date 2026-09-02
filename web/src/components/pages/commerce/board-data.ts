import { getCategories, getProducts, getProductBySlug } from "@/lib/catalog";
import { getBox } from "@/lib/mock";
import type { Door } from "@/components/blocks/ThreeDoors";
import type {
  CategoryView,
  ItemView,
  RunView,
} from "@/components/pages/commerce/types";
import {
  availabilityLabel,
  getRuns,
  isOnRun,
  stockFor,
  type Run,
} from "@/components/pages/commerce/run";

/**
 * Server-side assembly for the shop board. Everything that reads mock-data or
 * derives a run happens here, once, and only the sentences cross into the
 * client bundle.
 */

export function runView(run: Run): RunView {
  return {
    id: run.id,
    lane: run.lane,
    shortName: run.shortName,
    routeName: run.routeName,
    switcherLabel: run.switcherLabel,
    runDaysLabel: run.runDaysLabel,
    cutoffLine: run.cutoffLine,
    bandLabel: run.bandLabel,
    nextDateLabel: run.next?.dateLabel ?? null,
    nextDayLabel: run.next?.dayLabel ?? null,
    areas: run.areas,
    stops: run.stops.map((s) => ({
      id: s.id,
      name: s.name,
      descriptor: s.descriptor,
      band: s.band,
      bandLabel: s.bandLabel,
    })),
  };
}

export function runViews(): RunView[] {
  return getRuns().map(runView);
}

/** Every SKU with its run membership and its real supply. */
export function itemViews(): ItemView[] {
  const runs = getRuns();
  return getProducts().map((product) => {
    const stock = stockFor(product.slug);
    return {
      slug: product.slug,
      runs: runs.filter((run) => isOnRun(product, run)).map((run) => run.id),
      soldOut: stock.soldOut,
      left: stock.left,
      availability: availabilityLabel(product),
    };
  });
}

/**
 * Categories for the rail. A tab that resolves to zero items is never
 * rendered — the live site's empty "Weekly Specials" tab is the exact bug this
 * filter exists to prevent (site-content, /shop §4).
 */
export function categoryViews(): CategoryView[] {
  return getCategories()
    .filter((c) => c.count > 0)
    .map((c) => ({
      slug: c.slug,
      label: c.label,
      count: c.count,
      description: c.description,
    }));
}

/**
 * The three doors, named twice each: a plain-English role, then the real name
 * with a sensory line (§12.32). The loaf, the sweet one, and the box.
 */
export function shopDoors(): Door[] {
  const loaf = getProductBySlug("milk-shokupan");
  const sweet = getProductBySlug("custard-an-pan");
  const box = getBox("the-sunday-table");

  const doors: Door[] = [];
  if (loaf) {
    doors.push({
      role: "The loaf",
      name: loaf.name,
      kana: loaf.kana,
      sensory: "The bread the bakery was built on. Tear it, don’t slice it.",
      price: loaf.price,
      href: `/product/${loaf.slug}`,
      image: loaf.image,
    });
  }
  if (sweet) {
    doors.push({
      role: "The sweet one",
      name: sweet.name,
      kana: sweet.kana,
      sensory: "A soft bun with custard cream in the middle. The one people come back for.",
      price: sweet.price,
      href: `/product/${sweet.slug}`,
      image: sweet.image,
    });
  }
  if (box) {
    doors.push({
      role: "The box",
      name: box.name,
      kana: null,
      sensory: "A loaf and three bakes, chosen for you.",
      price: box.price,
      href: "/boxes",
      // The box has no photograph yet (boxes[].imageNote); the line-art
      // placeholder is honest, a stand-in loaf is not.
      image: null,
    });
  }
  return doors;
}

import raw from "@/data/products.json";
import { resolveProductImage, type ProductImage } from "@/lib/images";

/**
 * The catalogue. 23 SKUs, six categories, every price copied verbatim from the
 * live /shop page — nothing in products.json was invented, and nothing here
 * derives a number that is not already in the file.
 */

export type CategorySlug =
  | "breads"
  | "anpan"
  | "karepan"
  | "pies-strudels"
  | "fruit-sandos"
  | "weekly-specials";

export type Category = {
  slug: CategorySlug;
  label: string;
  /** e.g. "食パン (shokupan)" — kana + romaji, as authored. */
  japaneseName: string | null;
  order: number;
  description: string;
  shortLabel: string;
  emptyState?: string;
  currentlyEmpty?: boolean;
  /** Products in this category, catalogue order. */
  products: Product[];
  count: number;
};

export type Allergens = {
  contains: string[];
  /** Inferred, NOT confirmed. Print as "may contain", never as fact. */
  likely: string[];
};

export type Product = {
  slug: string;
  name: string;
  /** Raw field: "ミルク食パン (miruku shokupan)". Use `kana` for display. */
  japaneseName: string | null;
  /**
   * The kana alone, with the romaji gloss stripped (§12.26: never romanise in
   * place of the kana). null when the SKU has no verified reading — the slot
   * collapses rather than being filled with an invention.
   */
  kana: string | null;
  category: CategorySlug;
  price: number;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  allergens: Allergens;
  existingImage: string | null;
  suggestedPairings: string[];
  badges: string[];
  legacySlug: string | null;
  notes: string | null;
  /** Resolved cutout or legacy photograph; null renders the line-art fallback. */
  image: ProductImage | null;
  href: string;
};

export type Redirect = { from: string; to: string; reason: string };

type RawProduct = Omit<Product, "kana" | "image" | "href" | "category"> & {
  category: string;
};

/**
 * "ミルク食パン (miruku shokupan)" -> "ミルク食パン"
 * Returns null when nothing but Latin text remains, so the KanaLabel slot
 * collapses instead of printing a romanisation.
 */
export function extractKana(japaneseName: string | null | undefined): string | null {
  if (!japaneseName) return null;
  const kana = japaneseName.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (!kana) return null;
  // Must contain at least one CJK/kana codepoint to count as a reading.
  return /[぀-ヿ㐀-䶿一-鿿]/.test(kana) ? kana : null;
}

const rawProducts = raw.products as unknown as RawProduct[];

const products: Product[] = rawProducts.map((p) => ({
  ...p,
  category: p.category as CategorySlug,
  kana: extractKana(p.japaneseName),
  image: resolveProductImage(p.slug, p.existingImage),
  href: `/shop/${p.slug}`,
}));

const bySlugIndex = new Map(products.map((p) => [p.slug, p]));

const rawCategories = raw.categories as unknown as Omit<
  Category,
  "products" | "count" | "slug"
>[] &
  { slug: string }[];

const categories: Category[] = [...rawCategories]
  .map((c) => {
    const slug = c.slug as CategorySlug;
    const items = products.filter((p) => p.category === slug);
    return { ...c, slug, products: items, count: items.length } as Category;
  })
  .sort((a, b) => a.order - b.order);

const categoryIndex = new Map(categories.map((c) => [c.slug, c]));

/* -------------------------------------------------------------------------- */
/* Getters                                                                     */
/* -------------------------------------------------------------------------- */

/** All 23 SKUs in catalogue order. */
export function getProducts(): Product[] {
  return products;
}

/** One SKU, or undefined. Callers on a route should `notFound()` on undefined. */
export function getProductBySlug(slug: string): Product | undefined {
  return bySlugIndex.get(slug);
}

/** Every SKU in a category, catalogue order. Empty array for Weekly Specials. */
export function getProductsByCategory(category: CategorySlug | string): Product[] {
  return categoryIndex.get(category as CategorySlug)?.products ?? [];
}

/** The six categories, in their authored order. */
export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: CategorySlug | string): Category | undefined {
  return categoryIndex.get(slug as CategorySlug);
}

/**
 * "Goes well with" — the authored pairings, resolved to real products and
 * silently dropping any slug that is not in the catalogue.
 */
export function getPairings(slug: string, limit = 3): Product[] {
  const product = bySlugIndex.get(slug);
  if (!product) return [];
  return product.suggestedPairings
    .map((s) => bySlugIndex.get(s))
    .filter((p): p is Product => Boolean(p) && p!.slug !== slug)
    .slice(0, limit);
}

/** The 8 SKUs the live home page calls customer favourites. Nothing else. */
export function getBestsellers(): Product[] {
  return products.filter((p) => p.badges.includes("bestseller"));
}

/** The single hero SKU (/about and /shokupan both single it out). */
export function getSignature(): Product | undefined {
  return products.find((p) => p.badges.includes("signature"));
}

/** Catalogue-wide price band, for the Bakery JSON-LD priceRange. */
export function getPriceRange(): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min, max };
}

/** 301 targets for the dead /product/* URLs on the old site. */
export function getRedirects(): Redirect[] {
  return raw.redirects as unknown as Redirect[];
}

/** The category a product belongs to, for the dotted label on a ProductCard. */
export function getCategoryOf(product: Product): Category | undefined {
  return categoryIndex.get(product.category);
}

export const CATALOGUE_META = raw.meta;

import {
  PRODUCT_CUTOUTS,
  LEGACY_PHOTOS,
} from "@/lib/generated/image-manifest";

/**
 * Product image resolution.
 *
 * Order of preference, per DESIGN.md §10.1 (a transparent cutout is the
 * primary mode; a legacy photograph is a stopgap):
 *
 *   1. /images/products/<slug>.png          — the delivered cutout
 *   2. /images/products/<slug>-v2.png       — newest generated revision
 *   3. /images/products/<slug>-v1.png       — first generated revision
 *   4. /images/legacy/<existingImage>       — the photograph from the old site
 *   5. null                                 — the caller renders the ghosted
 *                                             line-art placeholder instead
 *
 * Slug spelling is normalised in both directions because the generation
 * pipeline names an-pan files "…-anpan-…" while products.json uses "an-pan".
 */

const CUTOUT_SET = new Set(PRODUCT_CUTOUTS);
const LEGACY_SET = new Set(LEGACY_PHOTOS);

/** Every spelling of a slug we are willing to look for on disk. */
export function slugAliases(slug: string): string[] {
  const aliases = new Set<string>([slug]);
  aliases.add(slug.replace(/an-pan/g, "anpan"));
  aliases.add(slug.replace(/anpan/g, "an-pan"));
  // Guard against a double-rewrite producing "an-an-pan".
  return [...aliases].filter((s) => !s.includes("an-an-pan"));
}

const EXTENSIONS = ["png", "webp", "avif", "jpg", "jpeg"] as const;
const SUFFIXES = ["", "-v2", "-v1"] as const;

/** The delivered cutout for a slug, or null if none has landed yet. */
export function cutoutFor(slug: string): string | null {
  for (const alias of slugAliases(slug)) {
    for (const suffix of SUFFIXES) {
      for (const ext of EXTENSIONS) {
        const file = `${alias}${suffix}.${ext}`;
        if (CUTOUT_SET.has(file)) return `/images/products/${file}`;
      }
    }
  }
  return null;
}

/** The legacy photograph named by products.json, if the file actually exists. */
export function legacyPhoto(existingImage?: string | null): string | null {
  if (!existingImage) return null;
  if (LEGACY_SET.has(existingImage)) return `/images/legacy/${existingImage}`;
  // The old export was inconsistent about extension case (milk-shokupan-new.PNG).
  const lower = existingImage.toLowerCase();
  const match = LEGACY_PHOTOS.find((f) => f.toLowerCase() === lower);
  return match ? `/images/legacy/${match}` : null;
}

export type ProductImage = {
  src: string;
  /** "cutout" gets --shadow-contact and sits at 55–62% of the well (§10.1). */
  kind: "cutout" | "legacy";
};

/**
 * The one function components should call. Returns null when nothing exists,
 * so the caller can render the line-art placeholder rather than a broken img.
 */
export function resolveProductImage(
  slug: string,
  existingImage?: string | null,
): ProductImage | null {
  const cutout = cutoutFor(slug);
  if (cutout) return { src: cutout, kind: "cutout" };
  const legacy = legacyPhoto(existingImage);
  if (legacy) return { src: legacy, kind: "legacy" };
  return null;
}

/** Brand assets, copied from assets/logo/. */
export const BRAND = {
  logo: "/brand/fillo-bakes-logo.png",
  logoTransparent: "/brand/fillo-logo-transparent.png",
} as const;

/**
 * The two delivered revisions of a cutout, for the ProductCard's hover swap.
 *
 * `-v1` is the resting frame and `-v2` the one that cross-fades in on hover.
 * Either may be null: a SKU with one revision (or none) gets a gentle scale
 * instead, and the caller never renders an <img> for a file that is not there.
 */
export function cutoutVariants(slug: string): {
  v1: string | null;
  v2: string | null;
} {
  return { v1: variant(slug, "-v1"), v2: variant(slug, "-v2") };
}

function variant(slug: string, suffix: "-v1" | "-v2"): string | null {
  for (const alias of slugAliases(slug)) {
    for (const ext of EXTENSIONS) {
      const file = `${alias}${suffix}.${ext}`;
      if (CUTOUT_SET.has(file)) return `/images/products/${file}`;
    }
  }
  return null;
}

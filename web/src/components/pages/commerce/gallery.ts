import { PRODUCT_CUTOUTS } from "@/lib/generated/image-manifest";
import { slugAliases, legacyPhoto, type ProductImage } from "@/lib/images";

/**
 * The PDP gallery.
 *
 * `lib/images.resolveProductImage` returns the single best image for a card.
 * A gallery wants every one that landed, so this walks the same manifest for
 * the base cutout and the `-v1` / `-v2` revisions, then falls back to the old
 * site's photograph. Nothing is invented: a SKU with one file gets one frame,
 * and a SKU with none gets an empty array and the caller draws the line art.
 *
 * The copy asks for the cross-section or torn crumb to be the default frame
 * and the whole loaf second. The manifest does not say which revision is
 * which, so the order here is the delivered order. Logged in
 * PHASE2B-REQUESTS.md as a manifest field, not guessed at here.
 */

const EXTENSIONS = ["png", "webp", "avif", "jpg", "jpeg"] as const;
const SUFFIXES = ["", "-v2", "-v1"] as const;
const CUTOUTS = new Set(PRODUCT_CUTOUTS);

export function galleryFor(
  slug: string,
  existingImage?: string | null,
): ProductImage[] {
  const found: ProductImage[] = [];
  const seen = new Set<string>();

  for (const suffix of SUFFIXES) {
    for (const alias of slugAliases(slug)) {
      for (const ext of EXTENSIONS) {
        const file = `${alias}${suffix}.${ext}`;
        if (!CUTOUTS.has(file) || seen.has(file)) continue;
        seen.add(file);
        found.push({ src: `/images/products/${file}`, kind: "cutout" });
      }
    }
  }

  const legacy = legacyPhoto(existingImage);
  if (legacy) found.push({ src: legacy, kind: "legacy" });

  return found;
}

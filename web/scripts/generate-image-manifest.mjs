/**
 * Scans public/images/{products,legacy} and writes a typed manifest so that
 * src/lib/images.ts can resolve a product slug to a real file without doing
 * filesystem work in a React component (which client components cannot do).
 *
 * Run it whenever new cutouts land in public/images/products:
 *   pnpm images
 * It also runs automatically before `pnpm dev` and `pnpm build`.
 */
import { readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function list(dir) {
  const abs = join(root, "public", "images", dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => !f.startsWith(".") && /\.(png|jpe?g|webp|avif|gif)$/i.test(f))
    .sort();
}

const products = list("products");
const legacy = list("legacy");

const out = `// GENERATED FILE — do not edit by hand.
// Run \`pnpm images\` after adding files to public/images/.
export const PRODUCT_CUTOUTS: readonly string[] = ${JSON.stringify(products, null, 2)};

export const LEGACY_PHOTOS: readonly string[] = ${JSON.stringify(legacy, null, 2)};
`;

const target = join(root, "src", "lib", "generated");
mkdirSync(target, { recursive: true });
writeFileSync(join(target, "image-manifest.ts"), out);

console.log(
  `image manifest: ${products.length} cutout(s), ${legacy.length} legacy photo(s)`,
);

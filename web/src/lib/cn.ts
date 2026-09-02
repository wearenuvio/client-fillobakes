/**
 * Minimal class joiner. Deliberately not `clsx` + `tailwind-merge`: this design
 * system has one value per decision, so there is nothing to "merge away", and
 * two fewer dependencies is two fewer things in the bundle.
 */
export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: boolean | null | undefined };

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
    ) {
      out.push(String(value));
    } else if (typeof value === "boolean") {
      continue;
    } else if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
    } else {
      for (const key in value) if (value[key]) out.push(key);
    }
  }
  return out.join(" ");
}

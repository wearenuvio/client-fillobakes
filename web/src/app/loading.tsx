import { RouteFlipbook } from "@/components/blocks/RouteLoader";

/**
 * The App Router fallback for every segment that does not define its own.
 * Fills the main area on the paper ground with the small flipbook, so a route
 * change looks like the same bakery rather than a blank frame.
 */
export default function Loading() {
  return <RouteFlipbook />;
}

import type { Product } from "@/data/products";
import { isInStock } from "@/lib/store";

/**
 * A price of 0 means "ask us" — a deliberate state, not missing data.
 *
 * Defined here so this file depends on nothing new. store.ts exports the very
 * same rule once the confidential-price update is applied, so these files can
 * be pasted in any order without breaking the build.
 */
function isAskPrice(price: number): boolean {
  const value = Number(price);
  return !Number.isFinite(value) || value <= 0;
}


/**
 * Picking "Related Collectibles".
 *
 * The old version was `products.filter(p => p.id !== current.id).slice(0, 4)` —
 * literally the first four rows in the table. Every one of the 253 product
 * pages showed the same four items, and because the four oldest products all
 * happen to be confidential-price sets, every page was a wall of
 * "Ask for Price".
 *
 * This scores each candidate instead. Nothing is hidden: confidential-price
 * items still appear, they just can't take over the whole row.
 */

/** How many suggestions a product page shows. */
export const RELATED_COUNT = 4;

/**
 * At most this many suggestions may be confidential-price items, as long as
 * there are enough priced alternatives to fill the rest. A shopper who cannot
 * see a single price loses the thread; one is a discovery nudge, four is a
 * dead end.
 */
const MAX_ASK_PRICE = 1;

const WEIGHT = {
  category: 40,
  country: 20,
  type: 10,
  /** Similar price bracket => genuinely comparable pieces. */
  priceProximity: 20,
  inStock: 15,
} as const;

function norm(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

/**
 * Small deterministic hash. Used only to break ties, so two different product
 * pages with equally-good candidates don't show an identical row — while the
 * same page always renders the same picks (important for SSR/hydration).
 */
function tieBreak(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function relatedScore(base: Product, candidate: Product): number {
  let score = 0;

  if (norm(candidate.category) === norm(base.category)) score += WEIGHT.category;
  if (norm(candidate.country) && norm(candidate.country) === norm(base.country)) {
    score += WEIGHT.country;
  }
  if (norm(candidate.type) === norm(base.type)) score += WEIGHT.type;

  // Comparable price. Only meaningful when both sides actually have one.
  if (base.price > 0 && candidate.price > 0) {
    const ratio =
      Math.min(base.price, candidate.price) / Math.max(base.price, candidate.price);
    score += ratio * WEIGHT.priceProximity;
  }

  if (isInStock(candidate)) score += WEIGHT.inStock;

  return score;
}

export function getRelatedProducts(
  base: Product | null | undefined,
  all: Product[],
  count: number = RELATED_COUNT,
): Product[] {
  if (!base) return [];

  const ranked = all
    .filter((item) => item.id !== base.id && item.available)
    .map((item) => ({
      item,
      score: relatedScore(base, item) + tieBreak(base.id + item.id),
    }))
    .sort((a, b) => b.score - a.score);

  const picked: Product[] = [];
  const held: Product[] = [];
  let askCount = 0;

  for (const { item } of ranked) {
    if (picked.length >= count) break;
    if (isAskPrice(item.price)) {
      if (askCount >= MAX_ASK_PRICE) {
        held.push(item); // keep as filler in case we run short
        continue;
      }
      askCount += 1;
    }
    picked.push(item);
  }

  // Not enough priced products to fill the row (a small category, say) — top it
  // up rather than showing three cards. Better a full row than a gap.
  for (const item of held) {
    if (picked.length >= count) break;
    picked.push(item);
  }

  return picked;
}

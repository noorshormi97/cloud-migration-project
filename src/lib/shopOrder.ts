import type { Product } from "@/data/products";
import { isInStock, isPriceOnRequest } from "@/lib/store";

/**
 * Shelf order for the Shop grid.
 *
 * The shop used to render products in the order the database returned them
 * (oldest first). The oldest items happen to be the confidential-price sets,
 * so the first twelve cards a visitor saw were all "Ask for Price" — one of
 * them out of stock. That reads as a shop hiding its prices.
 *
 * Nothing is removed or demoted out of sight. Confidential-price pieces are
 * genuine stock and often the rarest things here; they simply shouldn't be the
 * entire first impression. So they're spread through the middle of the grid
 * instead of stacked at the top.
 */

/** Widest the grid ever gets (xl:grid-cols-4), so this many = one full row. */
const COLUMNS = 4;

/** No confidential-price card before this point — the opening stays priced. */
const HEAD_ROWS = 2;

/** Stop placing them near the very end so they don't form a tail either. */
const TAIL_FRACTION = 0.9;

export function orderShopProducts(products: Product[]): Product[] {
  const priced: Product[] = [];
  const askPrice: Product[] = [];
  const soldOut: Product[] = [];

  for (const product of products) {
    if (!isInStock(product)) soldOut.push(product);
    else if (isPriceOnRequest(product.price)) askPrice.push(product);
    else priced.push(product);
  }

  // Nothing to weave — keep the original order.
  if (askPrice.length === 0 || priced.length === 0) {
    return [...priced, ...askPrice, ...soldOut];
  }

  const total = priced.length + askPrice.length;
  // Reserve the opening rows — but never more than a third of a short list,
  // or there's no room left to spread anything and they bunch up again.
  const head = Math.min(
    Math.max(COLUMNS * HEAD_ROWS, Math.ceil(total * 0.12)),
    Math.floor(total / 3),
    Math.max(0, total - askPrice.length),
  );
  const tail = Math.max(head + 1, Math.floor(total * TAIL_FRACTION));
  const span = Math.max(1, tail - head);

  // Evenly spaced target positions, so they never clump together.
  const slots = new Set<number>();
  for (let k = 0; k < askPrice.length; k += 1) {
    let index = head + Math.round(((k + 0.5) * span) / askPrice.length);
    while (slots.has(index) && index < total - 1) index += 1;
    slots.add(Math.min(index, total - 1));
  }

  const out: Product[] = [];
  let p = 0;
  let a = 0;
  for (let i = 0; i < total; i += 1) {
    const wantAsk = slots.has(i);
    if ((wantAsk && a < askPrice.length) || p >= priced.length) {
      if (a < askPrice.length) {
        out.push(askPrice[a] as Product);
        a += 1;
        continue;
      }
    }
    if (p < priced.length) {
      out.push(priced[p] as Product);
      p += 1;
    }
  }

  // Out of stock always last — never worth a prime slot.
  return [...out, ...soldOut];
}

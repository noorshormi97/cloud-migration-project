import { supabase } from "@/integrations/supabase/client";
import type { Category, Product } from "@/data/products";

export const PRODUCT_BUCKET = "product-images";

type ProductRow = {
  id: string;
  name: string;
  country: string;
  category: string;
  denomination: string;
  currency: string;
  year: string;
  condition: string;
  type: string;
  description: string;
  price: number | string;
  available: boolean;
  stock?: number | null;
  images: string[] | null;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    category: row.category as Category,
    denomination: row.denomination,
    currency: row.currency,
    year: row.year,
    condition: row.condition,
    type: (row.type as Product["type"]) ?? "Coin",
    description: row.description,
    price: Number(row.price),
    available: row.available,
    stock: Number(row.stock ?? 0),
    images: row.images ?? [],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as unknown as ProductRow));
}

/**
 * The product-images bucket is public, so every photo already has a permanent
 * public URL.
 *
 * We used to mint a signed URL on every page load. The token was different each
 * time, so the URL was different each time, so neither the browser nor the CDN
 * could ever reuse a photo it had already downloaded - every single visit paid
 * full price for every single image. Signing also bought us nothing: the bucket
 * is public either way.
 *
 * A public URL is stable, needs no round-trip to create, and is served from the
 * CDN cache.
 */
export interface ImageTransform {
  width: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
}

/** Sizes the photo to the box it is actually displayed in. */
export const IMAGE_SIZES = {
  /** Shop / related / new-arrival grid cards (~163px box, 2x screens). */
  card: { width: 400, height: 400, quality: 70, resize: "cover" } as ImageTransform,
  /** Cart rows and admin list rows. */
  thumb: { width: 160, height: 160, quality: 65, resize: "cover" } as ImageTransform,
  /**
   * The large image on a product page. Square, because the gallery box is
   * aspect-square and already crops to a square with object-cover - and
   * because passing a width with no height makes Supabase keep the original
   * height, which stretches the photo.
   */
  detail: { width: 800, height: 800, quality: 78, resize: "cover" } as ImageTransform,
} as const;

/**
 * Builds the URL for a stored photo. Synchronous - there is no network call.
 * Pass a transform to have Supabase serve a resized copy instead of the
 * full-resolution original.
 */
export function imageUrl(path: string, transform?: ImageTransform): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  // Let the client build the URL - it already knows the project address, so
  // nothing here depends on an environment variable being present during SSR.
  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  const publicUrl = data?.publicUrl;
  if (!publicUrl) return null;
  if (!transform) return publicUrl;

  const params = new URLSearchParams({ width: String(transform.width) });
  if (transform.height) params.set("height", String(transform.height));
  params.set("resize", transform.resize ?? "cover");
  params.set("quality", String(transform.quality ?? 70));

  // Same object, served resized. Still one stable, cacheable URL per size.
  return `${publicUrl.replace("/object/public/", "/render/image/public/")}?${params.toString()}`;
}

/** Kept async so existing callers and queries do not have to change. */
export async function fetchImageUrl(
  path: string,
  transform?: ImageTransform,
): Promise<string | null> {
  return imageUrl(path, transform);
}

export function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

/**
 * A price of 0 is not "free" — it means the price is deliberately withheld and
 * the buyer is asked to message us. This single rule is the source of truth so
 * every surface (cards, detail pages, combos, meta tags, structured data)
 * treats confidential pricing the same way.
 */
export const PRICE_ON_REQUEST = "Ask for Price";

export function isPriceOnRequest(price: number | null | undefined) {
  const value = Number(price);
  return !Number.isFinite(value) || value <= 0;
}

export function formatPriceOrAsk(price: number | null | undefined) {
  return isPriceOnRequest(price) ? PRICE_ON_REQUEST : formatPrice(Number(price));
}

export const COURIERS = [
  { name: "Steadfast", charge: 130 },
  { name: "Shundarban", charge: 60 },
] as const;

export function isInStock(product: { available: boolean; stock: number }) {
  return product.available && product.stock > 0;
}

export interface CartLine {
  id: string;
  kind: "product" | "combo" | "new_arrival" | "start_collecting";
  name: string;
  image?: string | undefined;
  meta?: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  href?: string;
}

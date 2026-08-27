import { supabase } from '@/integrations/supabase/client';
import type { Category, Product } from '@/data/products';

export const PRODUCT_BUCKET = 'product-images';

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
    type: (row.type as Product['type']) ?? 'Coin',
    description: row.description,
    price: Number(row.price),
    available: row.available,
    stock: Number(row.stock ?? 0),
    images: row.images ?? [],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => mapProduct(row as unknown as ProductRow));
}

// Signing every image with its own request means one round-trip per card.
// Requests made in the same tick are batched into a single createSignedUrls call.
const SIGN_EXPIRY = 60 * 60 * 24 * 7;
let pendingPaths: string[] = [];
let pendingBatch: Promise<Map<string, string | null>> | null = null;

function signBatch(): Promise<Map<string, string | null>> {
  if (!pendingBatch) {
    pendingBatch = new Promise((resolve) => {
      setTimeout(async () => {
        const paths = Array.from(new Set(pendingPaths));
        pendingPaths = [];
        pendingBatch = null;
        const result = new Map<string, string | null>();
        if (paths.length === 0) return resolve(result);
        const { data, error } = await supabase.storage
          .from(PRODUCT_BUCKET)
          .createSignedUrls(paths, SIGN_EXPIRY);
        if (!error) {
          for (const entry of data ?? []) {
            if (entry.path) result.set(entry.path, entry.signedUrl ?? null);
          }
        }
        resolve(result);
      }, 0);
    });
  }
  return pendingBatch;
}

export async function fetchImageUrl(path: string): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  pendingPaths.push(path);
  const batch = await signBatch();
  return batch.get(path) ?? null;
}

export function formatPrice(price: number) {
  return `৳${price.toLocaleString('en-BD')}`;
}

export const COURIERS = [
  { name: 'Steadfast', charge: 120 },
  { name: 'Shundarban', charge: 50 },
] as const;

export function isInStock(product: { available: boolean; stock: number }) {
  return product.available && product.stock > 0;
}

export interface CartLine {
  id: string;
  kind: 'product' | 'combo';
  name: string;
  image?: string | undefined;
  meta?: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  href?: string;
}

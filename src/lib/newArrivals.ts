import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export interface NewArrival {
  id: string;
  name: string;
  category: string;
  country: string;
  year: string;
  condition: string;
  denomination: string;
  currency: string;
  type: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  is_new: boolean;
  enabled: boolean;
  display_order: number;
  image: string;
  images: string[];
  product_id: string | null;
}

type Row = Partial<Omit<NewArrival, "price" | "stock">> & {
  id: string;
  price?: number | string | null;
  stock?: number | string | null;
};

// Defensive mapping with defaults so the UI keeps working even if the
// stock/spec columns haven't been migrated yet.
function mapRow(row: Row): NewArrival {
  return {
    id: row.id,
    name: row.name ?? "",
    category: row.category ?? "",
    country: row.country ?? "",
    year: row.year ?? "",
    condition: row.condition ?? "",
    denomination: row.denomination ?? "",
    currency: row.currency ?? "",
    type: row.type ?? "Coin",
    description: row.description ?? "",
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    available: row.available ?? true,
    is_new: row.is_new ?? false,
    enabled: row.enabled ?? true,
    display_order: row.display_order ?? 0,
    image: row.image ?? "",
    images: row.images ?? [],
    product_id: row.product_id ?? null,
  };
}

export async function fetchNewArrivals(): Promise<NewArrival[]> {
  const { data, error } = await supabase
    .from("new_arrivals")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as unknown as Row));
}

// All images for the gallery: the images array, falling back to the single
// legacy image field.
export function newArrivalImages(item: NewArrival): string[] {
  if (item.images.length > 0) return item.images;
  return item.image ? [item.image] : [];
}

// Shape a New Arrivals item like a shop Product so the product page
// components (gallery / info / specs / cards) can be reused as-is.
export function newArrivalToProduct(item: NewArrival): Product {
  return {
    id: item.id,
    name: item.name,
    country: item.country,
    category: item.category,
    denomination: item.denomination,
    currency: item.currency,
    year: item.year,
    condition: item.condition,
    type: (item.type || "Coin") as Product["type"],
    description: item.description,
    price: item.price,
    available: item.available && item.enabled,
    stock: item.stock,
    images: newArrivalImages(item),
  };
}

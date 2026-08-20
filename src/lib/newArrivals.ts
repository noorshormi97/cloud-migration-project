import { supabase } from '@/integrations/supabase/client';

export interface NewArrival {
  id: string;
  name: string;
  category: string;
  country: string;
  year: string;
  condition: string;
  price: number;
  is_new: boolean;
  enabled: boolean;
  display_order: number;
  image: string;
  product_id: string | null;
}

type Row = Omit<NewArrival, 'price'> & { price: number | string };

function mapRow(row: Row): NewArrival {
  return { ...row, price: Number(row.price ?? 0) };
}

export async function fetchNewArrivals(): Promise<NewArrival[]> {
  const { data, error } = await supabase
    .from('new_arrivals')
    .select(
      'id, name, category, country, year, condition, price, is_new, enabled, display_order, image, product_id',
    )
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as unknown as Row));
}

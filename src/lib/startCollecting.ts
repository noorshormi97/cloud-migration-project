import { supabase } from '@/integrations/supabase/client';

export interface StartCollectingItem {
  id: string;
  name: string;
  price: number;
  image: string;
  product_id: string | null;
  display_order: number;
  enabled: boolean;
}

export async function fetchStartCollecting(): Promise<StartCollectingItem[]> {
  const { data, error } = await supabase
    .from('start_collecting')
    .select('id, name, price, image, product_id, display_order, enabled')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...(row as unknown as StartCollectingItem),
    price: Number((row as { price: number | string }).price ?? 0),
  }));
}

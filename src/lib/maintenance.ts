import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Global app settings row id. See supabase/migrations/...add_app_settings.sql
const GLOBAL_ID = 'global';

export async function fetchMaintenanceMode(): Promise<boolean> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('maintenance_mode')
    .eq('id', GLOBAL_ID)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data?.maintenance_mode);
}

// Upsert so it works even if the seed row is somehow missing.
export async function setMaintenanceMode(on: boolean): Promise<void> {
  const { error } = await supabase
    .from('app_settings')
    .upsert({ id: GLOBAL_ID, maintenance_mode: on }, { onConflict: 'id' });
  if (error) throw error;
}

export function useMaintenanceMode() {
  return useQuery({
    queryKey: ['maintenance-mode'],
    queryFn: fetchMaintenanceMode,
    // Cache briefly so the flag isn't refetched on every navigation; the admin
    // panel invalidates this immediately after toggling it.
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

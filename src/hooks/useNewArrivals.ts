import { useQuery } from '@tanstack/react-query';
import { fetchNewArrivals } from '@/lib/newArrivals';

export function useNewArrivals() {
  return useQuery({ queryKey: ['new-arrivals'], queryFn: fetchNewArrivals });
}

export function useVisibleNewArrivals() {
  const query = useNewArrivals();
  return { ...query, data: (query.data ?? []).filter((item) => item.enabled) };
}

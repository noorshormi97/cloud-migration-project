import { useQuery } from "@tanstack/react-query";
import { fetchNewArrivals } from "@/lib/newArrivals";

export function useNewArrivals() {
  return useQuery({ queryKey: ["new-arrivals"], queryFn: fetchNewArrivals });
}

export function useVisibleNewArrivals() {
  const query = useNewArrivals();
  return { ...query, data: (query.data ?? []).filter((item) => item.enabled) };
}

export function useNewArrival(id: string | undefined) {
  const { data, ...rest } = useNewArrivals();
  return {
    ...rest,
    data: id ? data?.find((item) => item.id === id) : undefined,
    items: data ?? [],
  };
}

import { useQuery } from "@tanstack/react-query";
import { fetchStartCollecting } from "@/lib/startCollecting";

export function useStartCollecting() {
  return useQuery({ queryKey: ["start-collecting"], queryFn: fetchStartCollecting });
}

export function useVisibleStartCollecting() {
  const query = useStartCollecting();
  return {
    ...query,
    data: (query.data ?? []).filter((item) => item.enabled).slice(0, 10),
  };
}

export function useStartCollectingItem(id: string | undefined) {
  const { data, ...rest } = useStartCollecting();
  return {
    ...rest,
    data: id ? data?.find((item) => item.id === id) : undefined,
    items: data ?? [],
  };
}

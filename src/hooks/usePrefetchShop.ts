import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchImageUrl } from '@/lib/store';
import { fetchCategories } from '@/lib/content';

// Warms the data the Shop page needs (products, categories and the first
// batch of signed product images) while the visitor is still on the home
// page, so tapping a category cube renders instantly instead of waiting on
// a cold round-trip. Purely a caching concern: no visual change.
export function usePrefetchShop() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      void queryClient.prefetchQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
      });

      await queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000,
      });
      if (cancelled) return;

      // Sign the images of the first rows so the initial Shop viewport has
      // its photos ready. fetchImageUrl batches these into one request.
      const products = queryClient.getQueryData<Awaited<ReturnType<typeof fetchProducts>>>([
        'products',
      ]);
      const paths = (products ?? [])
        .map((product) => product.images?.[0])
        .filter((path): path is string => Boolean(path))
        .slice(0, 24);

      await Promise.all(
        paths.map((path) =>
          queryClient.prefetchQuery({
            queryKey: ['product-image', path],
            queryFn: () => fetchImageUrl(path),
            staleTime: 1000 * 60 * 60,
          }),
        ),
      );
    };

    const schedule =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (cb: () => void) =>
            (window as unknown as {
              requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
            }).requestIdleCallback(cb, { timeout: 1200 })
        : (cb: () => void) => window.setTimeout(cb, 300);

    schedule(() => {
      if (!cancelled) void run();
    });

    return () => {
      cancelled = true;
    };
  }, [queryClient]);
}

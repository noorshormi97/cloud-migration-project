import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

// ============================================================================
// RoutePrefetch — background route preloading.
//
// Renders nothing. On the client it prefetches the given route (its lazy JS
// chunk + loader) so that when the user later navigates there the page is
// already available and feels instant. This is how we preload the Shop page
// while the user is still on Home, and a product page while on Shop.
//
// "CHUNK BY CHUNK" / NO LAG:
//   - It only runs client-side (useEffect), never during SSR.
//   - It defers until the browser is idle (requestIdleCallback), so it never
//     fights the user for the main thread while the current page is drawing.
//   - Each page only preloads the ONE route the user is most likely to hit
//     next, and failures are silently ignored — so we never block the UI.
// ============================================================================

function scheduleIdle(cb: () => void): () => void {
  const w = typeof window !== 'undefined' ? (window as any) : undefined;
  if (w && typeof w.requestIdleCallback === 'function') {
    const id = w.requestIdleCallback(cb, { timeout: 1800 });
    return () => w.cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 300);
  return () => clearTimeout(id);
}

interface RoutePrefetchProps {
  /** Absolute route path, e.g. "/shop" or "/product/$id". */
  to: string;
  /** Route params, required when the path has a segment like $id. */
  params?: Record<string, string>;
  /** Extra idle-padding (ms) so several preloads never all fire at once. */
  after?: number;
}

export function RoutePrefetch({ to, params, after = 0 }: RoutePrefetchProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelIdle: (() => void) | undefined;

    const go = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void (router as any)
        .preloadRoute({ to, params })
        .catch(() => {
          /* ignore — preloading is best-effort */
        });
    };

    const kickoff = () => {
      if (after > 0) timer = setTimeout(go, after);
      else go();
    };

    cancelIdle = scheduleIdle(kickoff);

    return () => {
      cancelIdle?.();
      if (timer) clearTimeout(timer);
    };
  }, [to, params, after, router]);

  return null;
}

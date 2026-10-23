import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/store';

// Shape of the json returned by the database routine get_analytics().
interface AnalyticsItem {
  name: string;
  type: string;
  quantity: number;
  unit_price: number;
}

interface AnalyticsHistoryRow {
  id: string;
  order_id: string;
  outcome: string;
  event_at: string;
  items: AnalyticsItem[];
}

interface AnalyticsBestSeller {
  name: string;
  type: string;
  total_quantity: number;
  total_value: number;
}

interface AnalyticsData {
  total_confirmed: number;
  total_cancelled: number;
  total_banknotes_sold: number;
  total_revenue: number;
  best_sellers: AnalyticsBestSeller[];
  history: AnalyticsHistoryRow[];
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  const { data, error } = await supabase.rpc('get_analytics');
  if (error) throw error;
  return (data ?? {}) as unknown as AnalyticsData;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/10 bg-paper p-4">
      <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40">{label}</p>
      <p className="mt-1 font-heading text-2xl tracking-tight text-ink md:text-3xl">{value}</p>
    </div>
  );
}

export function AdminAnalytics() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Erases only the analytics tables — orders, products and stock stay intact.
  const deleteAnalytics = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('delete_analytics');
      if (error) throw error;
    },
    onSuccess: () => {
      setConfirmDelete(false);
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    },
  });

  if (isLoading) {
    return <p className="font-sans text-sm font-light text-ink/60">Loading analytics…</p>;
  }

  if (isError || !data) {
    return <p className="font-sans text-sm font-light text-ink/60">Could not load analytics.</p>;
  }

  const historyEmpty = data.history.length === 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Confirmed Orders" value={String(data.total_confirmed)} />
        <StatCard label="Cancelled Orders" value={String(data.total_cancelled)} />
        <StatCard label="Banknotes Sold" value={String(data.total_banknotes_sold)} />
        <StatCard label="Revenue" value={formatPrice(Number(data.total_revenue))} />
      </div>

      <div>
        <h2 className="mb-3 font-heading text-xl tracking-tight text-ink md:text-2xl">
          Best Sellers
        </h2>
        {data.best_sellers.length === 0 ? (
          <p className="font-sans text-sm font-light text-ink/60">
            No confirmed sales recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
            {data.best_sellers.map((row) => (
              <div
                key={`${row.name}-${row.type}`}
                className="flex items-center justify-between gap-4 px-4 py-2.5 font-sans text-sm"
              >
                <span className="min-w-0 flex-1 truncate text-ink">
                  {row.name}
                  {row.type ? (
                    <span className="ml-2 font-light text-ink/50">{row.type}</span>
                  ) : null}
                </span>
                <span className="font-light text-ink/70">{row.total_quantity} sold</span>
                <span className="w-24 text-right text-ink">
                  {formatPrice(Number(row.total_value))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-heading text-xl tracking-tight text-ink md:text-2xl">
          Order Outcome History
        </h2>
        {historyEmpty ? (
          <p className="font-sans text-sm font-light text-ink/60">
            Confirm or cancel an order and it will be recorded here.
          </p>
        ) : (
          <div className="space-y-3">
            {data.history.map((event) => (
              <div key={event.id} className="border border-ink/10 bg-paper p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-sans text-xs text-ink/60">
                    {new Date(event.event_at).toLocaleString()}
                  </p>
                  <span
                    className={`rounded-control px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest ${
                      event.outcome === 'Confirmed'
                        ? 'border border-ink/30 bg-ink text-brand'
                        : 'border border-ink/20 bg-paper text-ink/70'
                    }`}
                  >
                    {event.outcome}
                  </span>
                </div>
                {event.items.length > 0 ? (
                  <div className="mt-2 divide-y divide-ink/10 border-t border-ink/10">
                    {event.items.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex justify-between py-2 font-sans text-sm"
                      >
                        <span className="font-light text-ink/80">
                          {item.name} × {item.quantity}
                          {item.type ? (
                            <span className="ml-2 text-ink/50">{item.type}</span>
                          ) : null}
                        </span>
                        <span className="text-ink">
                          {formatPrice(Number(item.unit_price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {confirmDelete ? (
          <div className="w-full max-w-sm border border-ink/20 bg-paper p-5">
            <p className="font-heading text-lg tracking-tight text-ink">Delete analytics data?</p>
            <p className="mt-2 font-sans text-sm font-light text-ink/70">
              This permanently erases all analytics records. Orders, products, stock and prices are
              not affected.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-control border border-ink/20 px-3 py-2 font-sans text-xs uppercase tracking-widest text-ink/70 transition-colors hover:border-ink hover:text-ink"
              >
                Keep Analytics
              </button>
              <button
                type="button"
                disabled={deleteAnalytics.isPending}
                onClick={() => deleteAnalytics.mutate()}
                className="rounded-control border border-ink bg-ink px-3 py-2 font-sans text-xs uppercase tracking-widest text-brand transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Yes, Delete Analytics
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-control border border-ink/30 px-4 py-2 font-sans text-xs uppercase tracking-widest text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            Delete Analytics
          </button>
        )}
      </div>
    </div>
  );
}

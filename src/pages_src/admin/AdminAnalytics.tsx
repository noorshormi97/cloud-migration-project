import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BadgeCheck,
  Banknote,
  CircleX,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
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

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-control border border-ink/10 bg-paper p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-ink/40">
          {label}
        </p>
        <span className="shrink-0 rounded-control border border-ink/10 bg-brand/40 p-1.5 text-ink/70">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl tracking-tight text-ink md:text-3xl">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
      <h2 className="font-heading text-xl tracking-tight text-ink md:text-2xl">
        {title}
      </h2>
      {hint ? (
        <p className="font-sans text-[11px] font-light uppercase tracking-widest text-ink/40">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-control px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-widest ${
        outcome === 'Confirmed'
          ? 'border border-ink/30 bg-ink text-brand'
          : 'border border-ink/20 bg-paper text-ink/70'
      }`}
    >
      {outcome === 'Confirmed' ? (
        <BadgeCheck className="h-3 w-3" aria-hidden="true" />
      ) : (
        <CircleX className="h-3 w-3" aria-hidden="true" />
      )}
      {outcome}
    </span>
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
  const maxBestSellerQty = Math.max(
    1,
    ...data.best_sellers.map((row) => Number(row.total_quantity)),
  );
  const totalOutcomes = Number(data.total_confirmed) + Number(data.total_cancelled);
  const confirmRate =
    totalOutcomes > 0
      ? Math.round((Number(data.total_confirmed) / totalOutcomes) * 100)
      : null;

  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <SectionHeader title="Overview" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Confirmed Orders"
            value={String(data.total_confirmed)}
            icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            label="Cancelled Orders"
            value={String(data.total_cancelled)}
            icon={<CircleX className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            label="Banknotes Sold"
            value={String(data.total_banknotes_sold)}
            icon={<Banknote className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            label="Revenue"
            value={formatPrice(Number(data.total_revenue))}
            icon={<Wallet className="h-4 w-4" aria-hidden="true" />}
          />
        </div>
        {confirmRate !== null ? (
          <p className="mt-3 flex items-center gap-2 font-sans text-xs font-light text-ink/60">
            <TrendingUp className="h-3.5 w-3.5 text-ink/50" aria-hidden="true" />
            {confirmRate}% of decided orders were confirmed
          </p>
        ) : null}
      </section>

      {/* Best Sellers */}
      <section>
        <SectionHeader title="Best Sellers" hint="Confirmed sales only" />
        {data.best_sellers.length === 0 ? (
          <div className="rounded-control border border-dashed border-ink/20 bg-paper p-6 text-center">
            <p className="font-sans text-sm font-light text-ink/60">
              No confirmed sales recorded yet. Confirm an order and it will show up here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-control border border-ink/10 bg-paper">
            {data.best_sellers.map((row, index) => (
              <div
                key={`${row.name}-${row.type}`}
                className={`px-4 py-3 ${
                  index < data.best_sellers.length - 1 ? 'border-b border-ink/10' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-sans text-sm">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="w-5 shrink-0 font-heading text-xs text-ink/40">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 truncate text-ink">
                      {row.name}
                      {row.type ? (
                        <span className="ml-2 font-light text-ink/50">{row.type}</span>
                      ) : null}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-3">
                    <span className="font-light text-ink/70">{row.total_quantity} sold</span>
                    <span className="w-24 text-right text-ink">
                      {formatPrice(Number(row.total_value))}
                    </span>
                  </span>
                </div>
                <div className="mt-2 ml-7 h-1.5 overflow-hidden rounded-control bg-ink/5">
                  <div
                    className="h-full rounded-control bg-brand-dark"
                    style={{
                      width: `${Math.max(
                        4,
                        Math.round((Number(row.total_quantity) / maxBestSellerQty) * 100),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <SectionHeader title="Order Outcome History" hint="Latest 100" />
        {historyEmpty ? (
          <div className="rounded-control border border-dashed border-ink/20 bg-paper p-6 text-center">
            <p className="font-sans text-sm font-light text-ink/60">
              Confirm or cancel an order and it will be recorded here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-control border border-ink/10 bg-paper">
            {data.history.map((event, eventIndex) => (
              <div
                key={event.id}
                className={`p-4 ${
                  eventIndex < data.history.length - 1 ? 'border-b border-ink/10' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <OutcomeBadge outcome={event.outcome} />
                    <p className="font-sans text-xs text-ink/60">
                      {new Date(event.event_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-sans text-xs font-light text-ink/50">
                    {event.items.length}{' '}
                    {event.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                {event.items.length > 0 ? (
                  <div className="mt-2 divide-y divide-ink/5 border-t border-ink/10">
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
      </section>

      {/* Danger zone */}
      <section>
        <SectionHeader title="Danger Zone" hint="Erases analytics only" />
        {confirmDelete ? (
          <div className="w-full max-w-sm rounded-control border border-ink/20 bg-paper p-5">
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
            className="inline-flex items-center gap-2 rounded-control border border-ink/30 px-4 py-2 font-sans text-xs uppercase tracking-widest text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Delete Analytics
          </button>
        )}
      </section>
    </div>
  );
}

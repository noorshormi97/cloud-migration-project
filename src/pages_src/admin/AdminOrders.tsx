import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/store';
import { Trash2 } from 'lucide-react';

const STATUSES = [
  'Pending',
  'Confirmed',
  'Cancelled',
  'Completed',
  'Shipped',
  'Delivered',
] as const;
type Status = (typeof STATUSES)[number];

interface OrderItemRow {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
}

/** Loads just the combo names so order lines can be flagged as combos. */
async function fetchComboNames(): Promise<string[]> {
  const { data, error } = await supabase
    .from('combos')
    .select('name');
  if (error) throw error;
  return (data ?? []).map((row) => String((row as { name?: unknown }).name ?? '').trim());
}

interface OrderRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  note: string;
  subtotal: number;
  courier: string;
  delivery_charge: number;
  total_price: number;
  status: Status;
  created_at: string;
  order_items: OrderItemRow[];
}

async function fetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OrderRow[];
}

export function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchOrders,
  });
  // Combo names used to tag combo order-lines (combos aren't stored with an id
  // on order_items, only their name, so we match against the combos table).
  const { data: comboNames = [] } = useQuery({
    queryKey: ['combo-names'],
    queryFn: fetchComboNames,
    staleTime: 5 * 60 * 1000,
  });
  const comboNameSet = useMemo(() => {
    const set = new Set<string>();
    for (const name of comboNames) {
      const n = name.trim().toLowerCase();
      if (n) set.add(n);
    }
    return set;
  }, [comboNames]);
  const isCombo = (item: OrderItemRow) =>
    comboNameSet.has(String(item.product_name ?? '').trim().toLowerCase());

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Cancellation goes through the database routine so stock is restored exactly
  // once per order, no matter how often the button is pressed.
  const cancelOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('cancel_order', { _order_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: ['products'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  if (isLoading) {
    return <p className="font-sans text-sm font-light text-ink/60">Loading orders…</p>;
  }

  if (orders.length === 0) {
    return <p className="font-sans text-sm font-light text-ink/60">No orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-ink/10 bg-paper p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-heading text-lg tracking-tight text-ink">
                {order.customer_name}
              </p>
              <p className="font-sans text-sm font-light text-ink/70">
                {order.customer_phone}
              </p>
              <p className="font-sans text-sm font-light text-ink/70">
                {order.customer_address}
              </p>
              {order.note ? (
                <p className="mt-1 font-sans text-xs font-light italic text-ink/60">
                  {order.note}
                </p>
              ) : null}
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/40">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus.mutate({ id: order.id, status: e.target.value as Status })
                }
                className="border border-ink/20 bg-paper px-3 py-2 font-sans text-xs uppercase tracking-widest text-ink"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {order.status === 'Confirmed' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Permanently delete this confirmed order?')) {
                      deleteOrder.mutate(order.id);
                    }
                  }}
                  className="border border-ink/20 p-2 text-ink/50 transition-colors hover:border-ink hover:text-ink"
                  aria-label="Delete order"
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 font-sans text-sm">
                <span className="flex items-center gap-2 font-light text-ink/80">
                  {item.product_name} × {item.quantity}
                  {isCombo(item) ? (
                    <span className="shrink-0 rounded-sm border border-brand-dark/70 bg-brand-dark/40 px-1.5 py-px font-sans text-[10px] font-semibold uppercase tracking-widest text-ink/80">
                      Combo
                    </span>
                  ) : null}
                </span>
                <span className="text-ink">
                  {formatPrice(Number(item.unit_price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1 text-right font-sans text-sm text-ink/70">
            <p>Subtotal: {formatPrice(Number(order.subtotal))}</p>
            <p>
              Courier: {order.courier || '—'} · Delivery{' '}
              {formatPrice(Number(order.delivery_charge))}
            </p>
          </div>
          <p className="mt-2 text-right font-heading text-lg text-ink">
            Total: {formatPrice(Number(order.total_price))}
          </p>
        </div>
      ))}
    </div>
  );
}

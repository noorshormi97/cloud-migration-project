import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Pencil, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStartCollecting } from '@/hooks/useStartCollecting';
import { formatPrice, PRODUCT_BUCKET } from '@/lib/store';
import { ProductImage } from '@/components/products/ProductImage';
import type { StartCollectingItem } from '@/lib/startCollecting';

type Draft = {
  name: string;
  price: string;
  image: string;
  display_order: string;
  enabled: boolean;
};

const emptyDraft: Draft = {
  name: '',
  price: '0',
  image: '',
  display_order: '0',
  enabled: true,
};

function toDraft(item: StartCollectingItem): Draft {
  return {
    name: item.name,
    price: String(item.price),
    image: item.image,
    display_order: String(item.display_order),
    enabled: item.enabled,
  };
}

const inputClass =
  'w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50';

export function AdminStartCollecting() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useStartCollecting();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['start-collecting'] });

  useEffect(() => {
    if (draft && editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [draft]);

  const save = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const payload = {
        name: draft.name,
        image: draft.image,
        enabled: draft.enabled,
        price: Number(draft.price) || 0,
        display_order: Math.floor(Number(draft.display_order) || 0),
      };
      if (editingId === 'new') {
        const { error: insertError } = await supabase
          .from('start_collecting')
          .insert(payload);
        if (insertError) throw insertError;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('start_collecting')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setDraft(null);
      void invalidate();
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Save failed'),
  });

  const remove = useMutation({
    mutationFn: async (item: StartCollectingItem) => {
      const { error: deleteError } = await supabase
        .from('start_collecting')
        .delete()
        .eq('id', item.id);
      if (deleteError) throw deleteError;
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error: updateError } = await supabase
        .from('start_collecting')
        .update({ enabled })
        .eq('id', id);
      if (updateError) throw updateError;
    },
    onSuccess: invalidate,
  });

  const handleUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !draft) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `start-collecting/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_BUCKET)
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      setDraft({ ...draft, image: path });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="font-sans text-sm font-light text-ink/60">
        These 10 items appear in the “Start Collecting” section on the homepage.
      </p>

      <button
        type="button"
        onClick={() => {
          setEditingId('new');
          setDraft({ ...emptyDraft, display_order: String(items.length) });
          setError(null);
        }}
        className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
      >
        <Plus size={14} /> Add item
      </button>

      {draft ? (
        <div ref={editorRef} className="space-y-3 border-2 border-ink/40 bg-paper p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg tracking-tight text-ink">
              {editingId === 'new' ? 'New item' : 'Edit item'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDraft(null);
              }}
              className="text-ink/50 hover:text-ink"
              aria-label="Close editor"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Product name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Price"
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Display order"
              type="number"
              value={draft.display_order}
              onChange={(e) => setDraft({ ...draft, display_order: e.target.value })}
            />
            <label className="flex items-center gap-2 font-sans text-sm text-ink">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
              />
              Show in section
            </label>
          </div>

          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
              Image
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex aspect-square w-24 items-center justify-center overflow-hidden border border-ink/10 bg-paper">
                <ProductImage path={draft.image} alt="Item image" iconSize={18} />
              </div>
              {draft.image ? (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, image: '' })}
                  className="border border-ink/20 px-3 py-1.5 font-sans text-xs uppercase tracking-widest text-ink/70 hover:border-ink hover:text-ink"
                >
                  Remove
                </button>
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => void handleUpload(e.target.files)}
              className="mt-3 font-sans text-xs text-ink/70"
            />
            {uploading ? (
              <p className="mt-1 font-sans text-xs text-ink/60">Uploading…</p>
            ) : null}
          </div>

          {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}

          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="w-full bg-ink py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {save.isPending ? 'Saving…' : 'Save item'}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="font-sans text-sm font-light text-ink/60">Loading items…</p>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex aspect-square w-14 items-center justify-center overflow-hidden border border-ink/10">
                  <ProductImage path={item.image} alt={item.name} iconSize={16} />
                </div>
                <div>
                  <p className="font-heading text-base tracking-tight text-ink">
                    {item.name}
                  </p>
                  <p className="font-sans text-xs font-light text-ink/60">
                    #{item.display_order} · {formatPrice(item.price)}
                    {item.enabled ? '' : ' · Hidden'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle.mutate({ id: item.id, enabled: !item.enabled })}
                  className="border border-ink/20 px-3 py-2 font-sans text-[10px] uppercase tracking-widest text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  {item.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setDraft(toDraft(item));
                    setError(null);
                  }}
                  className="border border-ink/20 p-2 text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  aria-label="Edit item"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove "${item.name}" from Start Collecting?`)) {
                      remove.mutate(item);
                    }
                  }}
                  className="border border-ink/20 p-2 text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  aria-label="Delete item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

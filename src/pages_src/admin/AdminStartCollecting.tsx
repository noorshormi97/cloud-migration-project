import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStartCollecting } from "@/hooks/useStartCollecting";
import { useCategories } from "@/hooks/useContent";
import { formatPrice, PRODUCT_BUCKET } from "@/lib/store";
import { productCategories, productTypes } from "@/data/products";
import { ProductImage } from "@/components/products/ProductImage";
import { startCollectingImages, type StartCollectingItem } from "@/lib/startCollecting";

type Draft = {
  name: string;
  category: string;
  country: string;
  year: string;
  condition: string;
  denomination: string;
  currency: string;
  type: string;
  description: string;
  price: string;
  stock: string;
  available: boolean;
  display_order: string;
  enabled: boolean;
  images: string[];
};

const emptyDraft: Draft = {
  name: "",
  category: productCategories[0] as string,
  country: "",
  year: "",
  condition: "",
  denomination: "",
  currency: "",
  type: productTypes[0],
  description: "",
  price: "0",
  stock: "0",
  available: true,
  display_order: "0",
  enabled: true,
  images: [],
};

function toDraft(item: StartCollectingItem): Draft {
  return {
    name: item.name,
    category: item.category,
    country: item.country,
    year: item.year,
    condition: item.condition,
    denomination: item.denomination,
    currency: item.currency,
    type: item.type || (productTypes[0] as string),
    description: item.description,
    price: String(item.price),
    stock: String(item.stock),
    available: item.available,
    display_order: String(item.display_order),
    enabled: item.enabled,
    images: startCollectingImages(item),
  };
}

const inputClass =
  "w-full border border-ink/20 bg-paper px-3 py-2.5 font-sans text-sm font-light text-ink outline-none focus:border-ink/50";

export function AdminStartCollecting() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useStartCollecting();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["start-collecting"] });

  useEffect(() => {
    if (draft && editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [draft]);

  const { data: dbCategories = [] } = useCategories();
  const categoryOptions = useMemo(() => {
    const names = new Set<string>();
    [...dbCategories.map((c) => c.name), ...productCategories].forEach((name) => {
      if (name && name !== "All") names.add(name);
    });
    return Array.from(names);
  }, [dbCategories]);

  const save = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const payload = {
        name: draft.name,
        category: draft.category,
        country: draft.country,
        year: draft.year,
        condition: draft.condition,
        denomination: draft.denomination,
        currency: draft.currency,
        type: draft.type,
        description: draft.description,
        enabled: draft.enabled,
        available: draft.available,
        price: Number(draft.price) || 0,
        stock: Math.max(0, Math.floor(Number(draft.stock) || 0)),
        display_order: Math.floor(Number(draft.display_order) || 0),
        images: draft.images,
        // Keep the legacy single-image column in sync for older UI bits.
        image: draft.images[0] ?? "",
      };
      if (editingId === "new") {
        const { error: insertError } = await supabase.from("start_collecting").insert(payload);
        if (insertError) throw insertError;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from("start_collecting")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      setEditingId(null);
      setDraft(null);
      void invalidate();
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: async (item: StartCollectingItem) => {
      const { error: deleteError } = await supabase
        .from("start_collecting")
        .delete()
        .eq("id", item.id);
      if (deleteError) throw deleteError;
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error: updateError } = await supabase
        .from("start_collecting")
        .update({ enabled })
        .eq("id", id);
      if (updateError) throw updateError;
    },
    onSuccess: invalidate,
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !draft) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `start-collecting/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_BUCKET)
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        uploaded.push(path);
      }
      setDraft((current) =>
        current ? { ...current, images: [...current.images, ...uploaded] } : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setDraft((current) =>
      current ? { ...current, images: current.images.filter((_, i) => i !== index) } : current,
    );
  };

  return (
    <div className="space-y-6">
      <p className="font-sans text-sm font-light text-ink/60">
        These 10 items appear in the “Start Collecting” section on the homepage. Start Collecting is
        its own catalogue, separate from the shop — each item has its own stock, images and product
        page.
      </p>

      <button
        type="button"
        onClick={() => {
          setEditingId("new");
          setDraft({
            ...emptyDraft,
            category: categoryOptions[0] ?? emptyDraft.category,
            display_order: String(items.length),
          });
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
              {editingId === "new" ? "New item" : "Edit item"}
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
            <select
              className={inputClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Country"
              value={draft.country}
              onChange={(e) => setDraft({ ...draft, country: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Year"
              value={draft.year}
              onChange={(e) => setDraft({ ...draft, year: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Condition / grade (e.g. UNC)"
              value={draft.condition}
              onChange={(e) => setDraft({ ...draft, condition: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Denomination (e.g. 10 Taka)"
              value={draft.denomination}
              onChange={(e) => setDraft({ ...draft, denomination: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Currency (e.g. BDT)"
              value={draft.currency}
              onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
            />
            <select
              className={inputClass}
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value })}
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Price"
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Stock"
              type="number"
              min="0"
              value={draft.stock}
              onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="Display order"
              type="number"
              value={draft.display_order}
              onChange={(e) => setDraft({ ...draft, display_order: e.target.value })}
            />
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 font-sans text-sm text-ink">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
                />
                Show in section
              </label>
              <label className="flex items-center gap-2 font-sans text-sm text-ink">
                <input
                  type="checkbox"
                  checked={draft.available}
                  onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
                />
                Available for sale
              </label>
            </div>
          </div>

          <textarea
            className={`${inputClass} min-h-[88px]`}
            placeholder="Description (shown on the product page)"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />

          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
              Images
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {draft.images.map((path, index) => (
                <div key={`${path}-${index}`} className="relative">
                  <div className="flex aspect-square w-24 items-center justify-center overflow-hidden border border-ink/10 bg-paper">
                    <ProductImage path={path} alt={`Image ${index + 1}`} iconSize={18} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-ink/20 bg-paper text-ink/60 hover:text-ink"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {draft.images.length === 0 ? (
                <div className="flex aspect-square w-24 items-center justify-center overflow-hidden border border-ink/10 bg-paper">
                  <ProductImage path="" alt="No image" iconSize={18} />
                </div>
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => void handleUpload(e.target.files)}
              className="mt-3 font-sans text-xs text-ink/70"
            />
            {uploading ? <p className="mt-1 font-sans text-xs text-ink/60">Uploading…</p> : null}
          </div>

          {error ? <p className="font-sans text-xs text-red-700">{error}</p> : null}

          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="w-full bg-ink py-3 font-sans text-sm font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {save.isPending ? "Saving…" : "Save item"}
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <p className="font-sans text-sm font-light text-ink/60">Loading items…</p>
      ) : (
        <div className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex aspect-square w-14 items-center justify-center overflow-hidden border border-ink/10">
                  <ProductImage
                    path={startCollectingImages(item)[0]}
                    alt={item.name}
                    iconSize={16}
                  />
                </div>
                <div>
                  <p className="font-heading text-base tracking-tight text-ink">{item.name}</p>
                  <p className="font-sans text-xs font-light text-ink/60">
                    #{item.display_order} · {formatPrice(item.price)} · Stock: {item.stock}
                    {item.enabled ? "" : " · Hidden"}
                    {item.available ? "" : " · Unavailable"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle.mutate({ id: item.id, enabled: !item.enabled })}
                  className="border border-ink/20 px-3 py-2 font-sans text-[10px] uppercase tracking-widest text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  {item.enabled ? "Disable" : "Enable"}
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

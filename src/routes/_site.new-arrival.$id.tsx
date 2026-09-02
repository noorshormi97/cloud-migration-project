import { createFileRoute } from "@tanstack/react-router";
import { CollectionItemPage } from "@/pages_src/CollectionItemPage";
import { canonicalUrl, OG_IMAGE, SITE_NAME } from "@/lib/seo";

interface ArrivalRow {
  id: string;
  name: string;
  country: string;
  category: string;
  year: string;
  condition: string;
  price: number | string;
  description: string;
}

// Server-side fetch via plain REST (same pattern as the shop product route)
// so the <head> can render a unique title/description per item during SSR.
async function fetchArrivalSsr(id: string): Promise<ArrivalRow | null> {
  try {
    const url = import.meta.env["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
    const key =
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return null;
    const res = await fetch(
      `${url}/rest/v1/new_arrivals?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as ArrivalRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/_site/new-arrival/$id")({
  loader: async ({ params }) => {
    if (!import.meta.env.SSR) return null;
    const item = await fetchArrivalSsr(params.id);
    return item ? { item } : null;
  },
  head: ({ loaderData }) => {
    const item = loaderData?.item ?? null;
    const url = canonicalUrl(`/new-arrival/${item?.id ?? ""}`);
    const title = item ? `${item.name} — New Arrival | ${SITE_NAME}` : `New Arrival | ${SITE_NAME}`;
    const description = item
      ? `${item.name}${item.country ? ` from ${item.country}` : ""}${
          item.year ? `, ${item.year}` : ""
        } — a new arrival at ${SITE_NAME}.`
      : `Newly arrived collectible coins, banknotes and stamps at ${SITE_NAME}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: NewArrivalDetail,
});

function NewArrivalDetail() {
  return <CollectionItemPage kind="new_arrival" />;
}

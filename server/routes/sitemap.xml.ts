// Nitro server route — serves a dynamic sitemap at /sitemap.xml with every
// main page, category and product, so search engines discover the catalogue.
import { defineEventHandler } from "h3";

interface ProductRow {
  id: string;
}
interface CategoryRow {
  name: string;
}

const SITE = "https://www.discoveryofcoins.store";

async function fetchRows<T>(path: string): Promise<T[]> {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return [];
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

function url(loc: string, priority: string, freq: string) {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export default defineEventHandler(async () => {
  const [products, categories] = await Promise.all([
    fetchRows<ProductRow>("products?select=id&limit=1000"),
    fetchRows<CategoryRow>("categories?select=name&limit=200"),
  ]);

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    url("/", "1.0", "weekly"),
    url("/shop", "0.9", "daily"),
    url("/combo", "0.8", "weekly"),
    url("/about", "0.6", "monthly"),
    url("/contact", "0.6", "monthly"),
    url("/terms", "0.3", "yearly"),
    ...categories.map((c) => url(`/shop?category=${encodeURIComponent(c.name)}`, "0.7", "weekly")),
    ...products.map((p) => url(`/product/${p.id}`, "0.7", "weekly")),
    "</urlset>",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});

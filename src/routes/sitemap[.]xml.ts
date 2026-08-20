// Server route — serves a dynamic sitemap at /sitemap.xml with every
// main page, category and product, so search engines discover the catalogue.
import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

interface ProductRow {
  id: string;
}
interface CategoryRow {
  name: string;
}

async function fetchRows<T>(path: string): Promise<T[]> {
  try {
    const url = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return [];
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

function urlEntry(loc: string, priority: string, freq: string) {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [products, categories] = await Promise.all([
          fetchRows<ProductRow>("products?select=id&limit=1000"),
          fetchRows<CategoryRow>("categories?select=name&limit=200"),
        ]);

        const lines: string[] = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          urlEntry("/", "1.0", "weekly"),
          urlEntry("/shop", "0.9", "daily"),
          urlEntry("/combo", "0.8", "weekly"),
          urlEntry("/about", "0.6", "monthly"),
          urlEntry("/contact", "0.6", "monthly"),
          urlEntry("/terms", "0.3", "yearly"),
          ...categories.map((c) =>
            urlEntry(`/shop?category=${encodeURIComponent(c.name)}`, "0.7", "weekly"),
          ),
          ...products.map((p) => urlEntry(`/product/${p.id}`, "0.7", "weekly")),
          "</urlset>",
          "",
        ];

        return new Response(lines.join("\n"), {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});

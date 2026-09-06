import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/pages_src/BlogPage";
import { canonicalUrl, SITE_NAME, OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/_site/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: `Blog | Bangladeshi Banknotes & Coins — ${SITE_NAME}` },
      { name: "description", content: "Educational stories about Bangladeshi banknotes, coins and collectible currency in Bangladesh: Taka notes history, Bangladesh coins collecting, and how to identify old Bangladeshi notes." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: canonicalUrl("/blog") },
      { property: "og:title", content: `Blog | Bangladeshi Banknotes & Coins — ${SITE_NAME}` },
      { property: "og:description", content: "Stories and guides on Bangladeshi banknotes, coins and collecting — from Taka notes history to building your own collection." },
      { property: "og:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/blog") }],
  }),
});

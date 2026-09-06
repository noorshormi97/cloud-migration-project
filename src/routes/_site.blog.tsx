import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/pages_src/BlogPage";
import { canonicalUrl } from "@/lib/seo";

const title = "Blog | Bangladeshi Banknotes & Coins — Discovery of Coins";
const description =
  "Educational stories about Bangladeshi banknotes, coins and collectible currency in Bangladesh: Taka notes history, Bangladesh coins collecting, and how to identify old Bangladeshi notes.";

export const Route = createFileRoute("/_site/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/blog") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/blog") }],
  }),
});

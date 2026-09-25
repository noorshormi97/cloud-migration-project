import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/pages_src/BlogPage";
import { canonicalUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

// Article structured data helps Google understand these are real editorial
// posts (and not thin filler) — useful for search and for AdSense review.
function blogSchema() {
  const posts = [
    {
      headline:
        'Visiting the "Taka Haat" in Bangladesh: Inside the Market for Old Taka Notes',
      url: `${SITE_URL}/blog#taka-haat-market-old-taka-notes`,
    },
    {
      headline:
        "How Much Is an Old Red 1 Taka Note Worth? Valuing Bangladeshi 1 Taka Notes",
      url: `${SITE_URL}/blog#old-red-1-taka-note-value`,
    },
    {
      headline:
        "The 1984 One Pound Coin with the Scottish Thistle: A Guide to Valuing UK Coins",
      url: `${SITE_URL}/blog#1984-one-pound-coin-scottish-thistle`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog | ${SITE_NAME}`,
    url: canonicalUrl("/blog"),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.headline,
      url: post.url,
      datePublished: "2026-09-01",
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME },
    })),
  };
}

export const Route = createFileRoute("/_site/blog")({
  head: () => {
    const url = canonicalUrl("/blog");
    const title = `Blog | Bangladeshi Banknotes & Coins — ${SITE_NAME}`;
    const description =
      "Educational stories about Bangladeshi banknotes, coins and collectible currency in Bangladesh: Taka notes history, Bangladesh coins collecting, and how to identify old Bangladeshi notes.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(blogSchema()),
        },
      ],
    };
  },
  component: BlogPage,
});

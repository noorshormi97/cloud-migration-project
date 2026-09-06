import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/pages_src/PrivacyPage";
import { canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/_site/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Discovery of Coins" },
      {
        name: "description",
        content:
          "How Discovery of Coins collects, uses and protects your personal information, including cookies, advertising and data retention details.",
      },
      { property: "og:title", content: "Privacy Policy | Discovery of Coins" },
      {
        property: "og:description",
        content:
          "How Discovery of Coins collects, uses and protects your personal information, including cookies, advertising and data retention details.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/privacy") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/privacy") }],
  }),
});

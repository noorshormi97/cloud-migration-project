import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/pages_src/TermsPage";
import { canonicalUrl } from "@/lib/seo";

export const Route = createFileRoute("/_site/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Discovery of Coins" },
      {
        name: "description",
        content:
          "Store terms for Discovery of Coins: fixed pricing, payment, delivery, shipping couriers and return policy for collectible coins, banknotes and stamps.",
      },
      { property: "og:title", content: "Terms & Conditions | Discovery of Coins" },
      {
        property: "og:description",
        content:
          "Store terms for Discovery of Coins: fixed pricing, payment, delivery, shipping couriers and return policy for collectible coins, banknotes and stamps.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/terms") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/terms") }],
  }),
});

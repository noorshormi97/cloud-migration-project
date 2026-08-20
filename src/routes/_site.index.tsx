import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages_src/HomePage";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "@/lib/seo";

export const Route = createFileRoute("/_site/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: `${SITE_NAME} — Buy Authentic Collectible Banknotes & World Currency in Bangladesh`,
      },
      {
        name: "description",
        content:
          "Discovery of Coins is an authentic collectible banknote seller based in Dhaka, Bangladesh. Shop world currency banknotes from countries around the globe — thousands of varieties, delivered across Bangladesh.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      {
        property: "og:title",
        content: `${SITE_NAME} — Buy Authentic Collectible Banknotes & World Currency in Bangladesh`,
      },
      {
        property: "og:description",
        content:
          "Authentic collectible banknotes and world currency from Dhaka, Bangladesh. Thousands of varieties from countries all over the world.",
      },
      { property: "og:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

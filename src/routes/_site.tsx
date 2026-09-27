import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/context/CartContext";
import { Layout } from "@/components/Layout";
import { MaintenancePage } from "@/components/MaintenancePage";
import { fetchMaintenanceMode } from "@/lib/maintenance";
import { fetchContactDetails } from "@/lib/content";

// Centralized global maintenance check for ALL public routes.
//
// Every public page lives under the `/_site` layout route, so checking here
// covers every public URL (/, /shop, /about, /contact, /combo, /product/:id,
// /terms, /privacy, ...) with a single mechanism — no per-page duplication.
//
// Admin routes (/admin, /admin/login) are top-level routes NOT under /_site,
// so they are intentionally excluded here and always work. This avoids any
// maintenance redirect loop on the admin panel / auth requests.
//
// WHY A LOADER AND NOT A HOOK:
// The flag is resolved BEFORE this route renders, on the server during the
// first paint. That matters for two reasons:
//   1. Nothing loads in the background. Previously the site rendered first and
//      swapped to the maintenance page once the flag arrived, so a visitor
//      still pulled products, categories, combos, new arrivals, start
//      collecting and faqs before seeing the notice. Now Layout never mounts,
//      so none of those queries are ever created.
//   2. No extra round trip. The browser does not fetch the flag itself, and
//      when maintenance is on the WhatsApp number comes down with it — so the
//      maintenance page costs the visitor ZERO database calls.
// Contact details are only fetched when maintenance is actually on, so normal
// visitors pay nothing for this.
export const Route = createFileRoute("/_site")({
  loader: async () => {
    let maintenance = false;
    try {
      maintenance = await fetchMaintenanceMode();
    } catch {
      // Fail open: a settings outage must never take the shop down.
      return { maintenance: false, whatsappNumber: null };
    }
    if (!maintenance) return { maintenance: false, whatsappNumber: null };

    let whatsappNumber: string | null = null;
    try {
      const contact = await fetchContactDetails();
      whatsappNumber = contact?.whatsapp_number ?? null;
    } catch {
      // The page still renders, just without the WhatsApp button.
    }
    return { maintenance: true, whatsappNumber };
  },
  // Re-check at most once a minute; the admin panel invalidates on toggle.
  staleTime: 60 * 1000,
  component: SiteLayout,
});

function SiteLayout() {
  const { maintenance, whatsappNumber } = Route.useLoaderData();

  if (maintenance) {
    return <MaintenancePage whatsappNumber={whatsappNumber} />;
  }

  return (
    <CartProvider>
      <Layout />
    </CartProvider>
  );
}

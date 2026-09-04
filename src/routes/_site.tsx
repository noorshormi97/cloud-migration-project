import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/context/CartContext";
import { Layout } from "@/components/Layout";
import { MaintenancePage } from "@/components/MaintenancePage";
import { useMaintenanceMode } from "@/lib/maintenance";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

// Centralized global maintenance check for ALL public routes.
//
// Every public page lives under the `/_site` layout route, so checking here
// covers every public URL (/, /shop, /about, /contact, /combo, /product/:id,
// /terms, /faq, ...) with a single mechanism — no per-page duplication.
//
// Admin routes (/admin, /admin/login) are top-level routes NOT under /_site,
// so they are intentionally excluded here and always work. This avoids any
// maintenance redirect loop on the admin panel / auth requests.
function SiteLayout() {
  const { data: maintenance, isError } = useMaintenanceMode();

  // NOTE on no loading screen: the public site renders immediately instead of
  // blocking the first paint on the maintenance network check. The flag is
  // fetched in the background and, if maintenance is confirmed ON, we swap to
  // the maintenance page. Because maintenance is off in normal operation,
  // visitors never see a blank/loading state on entry. Fail-open on error
  // (isError) so a settings fetch failure never bricks the site.
  if (maintenance && !isError) {
    return <MaintenancePage />;
  }

  return (
    <CartProvider>
      <Layout />
    </CartProvider>
  );
}

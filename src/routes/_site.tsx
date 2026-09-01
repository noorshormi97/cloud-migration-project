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
  const { data: maintenance, isLoading, isError } = useMaintenanceMode();

  // While the flag is loading, show a neutral branded loading screen rather
  // than briefly flashing the normal website (which would leak content while
  // maintenance is on).
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand">
        <p className="font-sans text-sm font-light tracking-wide text-ink/60">
          Loading…
        </p>
      </div>
    );
  }

  // Maintenance ON: show the maintenance page for every public route.
  // Fail-open on error (isError) so a settings fetch failure never bricks the
  // site — it just shows the normal website.
  if (maintenance && !isError) {
    return <MaintenancePage />;
  }

  return (
    <CartProvider>
      <Layout />
    </CartProvider>
  );
}

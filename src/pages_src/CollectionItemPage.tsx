import { useParams, Link } from "@/lib/router-compat";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ProductGallery } from "../components/products/ProductGallery";
import { ProductInfo } from "../components/products/ProductInfo";
import { ProductSpecs } from "../components/products/ProductSpecs";
import { ProductGrid } from "../components/products/ProductGrid";
import { useNewArrival } from "../hooks/useNewArrivals";
import { useStartCollectingItem } from "../hooks/useStartCollecting";
import { newArrivalToProduct } from "@/lib/newArrivals";
import { startCollectingToProduct } from "@/lib/startCollecting";
import type { Product } from "../data/products";

export type CollectionKind = "new_arrival" | "start_collecting";

const COPY: Record<
  CollectionKind,
  { title: string; basePath: string; related: string; notFound: string }
> = {
  new_arrival: {
    title: "New Arrivals",
    basePath: "/new-arrival",
    related: "More New Arrivals",
    notFound: "This new arrival does not exist or is no longer listed.",
  },
  start_collecting: {
    title: "Start Collecting",
    basePath: "/start-collecting",
    related: "More from Start Collecting",
    notFound: "This starter collectible does not exist or is no longer listed.",
  },
};

// Detail page for New Arrivals / Start Collecting items. Intentionally
// mirrors the shop's ProductPage — same gallery, info, specs and related
// grid — but reads from the section's own table and adds to the cart under
// the section's own kind so stock and orders stay separate from the shop.
export function CollectionItemPage({ kind }: { kind: CollectionKind }) {
  const { id } = useParams<{ id: string }>();
  const copy = COPY[kind];
  const navigate = useNavigate();
  const router = useRouter();

  const newArrival = useNewArrival(kind === "new_arrival" ? id : undefined);
  const startCollecting = useStartCollectingItem(kind === "start_collecting" ? id : undefined);

  const isLoading = kind === "new_arrival" ? newArrival.isLoading : startCollecting.isLoading;

  let product: Product | undefined;
  let related: { product: Product; href: string }[] = [];

  if (kind === "new_arrival") {
    product = newArrival.data ? newArrivalToProduct(newArrival.data) : undefined;
    related = newArrival.items
      .filter((item) => item.enabled && item.id !== id)
      .slice(0, 4)
      .map((item) => ({
        product: newArrivalToProduct(item),
        href: `${copy.basePath}/${item.id}`,
      }));
  } else {
    product = startCollecting.data ? startCollectingToProduct(startCollecting.data) : undefined;
    related = startCollecting.items
      .filter((item) => item.enabled && item.id !== id)
      .slice(0, 4)
      .map((item) => ({
        product: startCollectingToProduct(item),
        href: `${copy.basePath}/${item.id}`,
      }));
  }

  // Go back in history when possible (restores scroll position); otherwise
  // fall back to the homepage section this item came from.
  const handleBack = () => {
    if (router.history.canGoBack()) {
      window.history.back();
    } else {
      void navigate({ to: "/" });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-brand px-6 py-20 text-center md:py-24">
        <p className="font-sans text-sm font-light text-ink/60">Loading…</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="bg-brand px-6 py-20 text-center md:py-24">
        <h1 className="font-heading text-3xl tracking-tight text-ink">Item not found</h1>
        <p className="mt-4 font-sans text-sm font-light text-ink/60">{copy.notFound}</p>
        <Link
          to="/"
          className="mt-8 inline-block border border-ink bg-ink px-6 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
        >
          Back to Home
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-brand py-0 md:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative md:grid md:grid-cols-[minmax(0,5fr)_7fr] md:gap-8 lg:gap-10"
        >
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-brand/90 text-ink shadow-[0_2px_12px_rgba(17,17,17,0.15)] transition-colors hover:bg-ink hover:text-brand"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="md:max-w-[440px]">
            <ProductGallery productName={product.name} images={product.images} />
          </div>

          <div className="px-5 pb-8 pt-4 md:px-0 md:pb-0 md:pt-2">
            <ProductInfo product={product} cartKind={kind} />
          </div>
        </motion.div>

        <div className="px-6">
          <ProductSpecs product={product} />
        </div>

        {related.length > 0 && (
          <div className="mt-8 border-t border-ink/10 px-6 pt-6 md:mt-10 md:pt-8">
            <h2 className="mb-4 font-heading text-2xl tracking-tight text-ink md:text-3xl">
              {copy.related}
            </h2>
            <ProductGrid
              products={related.map((entry) => entry.product)}
              hrefFor={(p) => related.find((entry) => entry.product.id === p.id)?.href ?? "/"}
              cartKind={kind}
            />
          </div>
        )}
      </div>
    </section>
  );
}

import { useParams, Link } from '@/lib/router-compat';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProductGallery } from '../components/products/ProductGallery';
import { ProductInfo } from '../components/products/ProductInfo';
import { ProductSpecs } from '../components/products/ProductSpecs';
import { ProductGrid } from '../components/products/ProductGrid';
import { useProduct } from '../hooks/useProducts';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, products, isLoading } = useProduct(id);
  const navigate = useNavigate();
  const router = useRouter();
  const relatedProducts = product
    ? products.filter((item) => item.id !== product.id).slice(0, 4)
    : [];

  // Go back in history when possible (restores the shop's scroll position);
  // otherwise fall back to the shop page.
  const handleBack = () => {
    if (router.history.canGoBack()) {
      window.history.back();
    } else {
      void navigate({ to: '/shop' });
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
        <h1 className="font-heading text-3xl tracking-tight text-ink">
          Product not found
        </h1>
        <p className="mt-4 font-sans text-sm font-light text-ink/60">
          The collectible you are looking for does not exist.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-block border border-ink bg-ink px-6 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/90"
        >
          Back to Shop
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
          {/* Floating back arrow — overlaid on the product image (top-left).
              Uses browser "back" so it returns to where the user was in the
              shop (preserving scroll position), with a /shop fallback. */}
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to shop"
            className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-brand/90 text-ink shadow-[0_2px_12px_rgba(17,17,17,0.15)] transition-colors hover:bg-ink hover:text-brand"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Product image — full-width on top on mobile, left column on desktop */}
          <div className="md:max-w-[440px]">
            <ProductGallery productName={product.name} images={product.images} />
          </div>

          {/* Product info — below the image on mobile, right column on desktop */}
          <div className="px-5 pb-8 pt-4 md:px-0 md:pb-0 md:pt-2">
            <ProductInfo product={product} />
          </div>
        </motion.div>

        <div className="px-6">
          <ProductSpecs product={product} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-ink/10 px-6 pt-6 md:mt-10 md:pt-8">
            <h2 className="mb-4 font-heading text-2xl tracking-tight text-ink md:text-3xl">
              Related Collectibles
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </section>
  );
}

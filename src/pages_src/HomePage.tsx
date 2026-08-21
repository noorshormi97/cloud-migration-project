import { Link } from '@/lib/router-compat';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { NewArrivals } from '../components/NewArrivals';
import { FaqSection } from '../components/FaqSection';

export function HomePage() {
  return (
    <>
      <Hero />

      {/* Shop All Products — moved before "Shop by Category" (same button as before) */}
      <section className="bg-brand px-6 pt-10 pb-2 md:pt-14 md:pb-2">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            to="/shop"
            className="inline-block border border-ink bg-ink px-7 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
          >
            Shop All Products
          </Link>
        </div>
      </section>

      <CategoryGrid />
      <NewArrivals />
      <FaqSection />
    </>
  );
}

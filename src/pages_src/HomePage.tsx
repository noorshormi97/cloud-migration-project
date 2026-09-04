import { Link } from '@/lib/router-compat';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { NewArrivals } from '../components/NewArrivals';
import { StartCollecting } from '../components/StartCollecting';
import { AboutUsSection } from '../components/AboutUsSection';
import { SendMessageSection } from '../components/SendMessageSection';
import { FaqSection } from '../components/FaqSection';
import { RoutePrefetch } from '../components/RoutePrefetch';

export function HomePage() {
  return (
    <>
      {/* Preload the Shop page (chunk + product/category data) in the background
          so clicking "Shop by Category" / "Shop All Products" opens instantly. */}
      <RoutePrefetch to="/shop" />
      <Hero />
      <CategoryGrid />

      {/* Shop All Products — centered below "Shop by Category" */}
      <section className="bg-brand px-6 pt-7 pb-8 md:pt-8 md:pb-10">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            to="/shop"
            className="inline-block border border-ink bg-ink px-7 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
          >
            Shop All Products
          </Link>
        </div>
      </section>

      <NewArrivals />
      <StartCollecting />
      <AboutUsSection />
      <SendMessageSection />
      <FaqSection />
    </>
  );
}

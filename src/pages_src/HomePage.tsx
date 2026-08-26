import { Link } from '@/lib/router-compat';
import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { NewArrivals } from '../components/NewArrivals';
import { StartCollecting } from '../components/StartCollecting';
import { AboutUsSection } from '../components/AboutUsSection';
import { FaqSection } from '../components/FaqSection';

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />

      {/* Shop All Products — centered below "Shop by Category" */}
      <section className="bg-brand px-6 pt-8 pb-12 md:pt-10 md:pb-16">
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
      <FaqSection />
    </>
  );
}

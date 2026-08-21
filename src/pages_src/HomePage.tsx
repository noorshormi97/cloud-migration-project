import { Hero } from '../components/Hero';
import { CategoryGrid } from '../components/CategoryGrid';
import { NewArrivals } from '../components/NewArrivals';
import { FaqSection } from '../components/FaqSection';

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <NewArrivals />
      <FaqSection />
    </>
  );
}

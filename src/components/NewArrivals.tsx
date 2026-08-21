import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/router-compat';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from './products/ProductImage';
import { useVisibleNewArrivals } from '@/hooks/useNewArrivals';
import { formatPrice } from '@/lib/store';
import type { NewArrival } from '@/lib/newArrivals';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function iconTypeFor(item: NewArrival): 'banknote' | 'coin' | 'accessory' {
  const text = `${item.category} ${item.name}`.toLowerCase();
  if (text.includes('note')) return 'banknote';
  if (text.includes('coin')) return 'coin';
  return 'accessory';
}

function ArrivalCard({ item }: { item: NewArrival }) {
  const card = (
    <article className="group flex h-full snap-start flex-col border border-ink/10 bg-paper transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_18px_40px_-24px_rgba(17,17,17,0.55)]">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-ink/10 bg-paper">
        <ProductImage
          path={item.image}
          alt={item.name}
          label="Image"
          iconType={iconTypeFor(item)}
          className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
        />
        {item.is_new ? (
          <span className="absolute left-0 top-0 bg-ink px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
            New
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 md:p-5">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-ink/50">
          {item.category}
        </p>
        <h3 className="font-heading text-xl leading-snug tracking-tight text-ink">
          {item.name}
        </h3>
        <p className="font-sans text-xs font-light text-ink/60">
          {[item.country, item.year, item.condition].filter(Boolean).join(' · ')}
        </p>
        <p className="mt-auto pt-3 font-sans text-base font-medium text-ink">
          {formatPrice(item.price)}
        </p>
      </div>
    </article>
  );

  if (item.product_id) {
    return (
      <li className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[24%]">
        <Link to={`/product/${item.product_id}`} className="block h-full">
          {card}
        </Link>
      </li>
    );
  }

  return (
    <li className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[24%]">{card}</li>
  );
}

export function NewArrivals() {
  const { data: items } = useVisibleNewArrivals();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 24 : track.clientWidth * 0.8;
    const maxScroll = track.scrollWidth - track.clientWidth;
    let next = track.scrollLeft + direction * step;
    if (next > maxScroll - 4) next = direction === 1 ? 0 : maxScroll;
    if (next < 0) next = maxScroll;
    track.scrollTo({ left: next, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || items.length < 2) return;
    const id = window.setInterval(() => scrollByCard(1), 4200);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, items.length, scrollByCard]);

  if (items.length === 0) return null;

  return (
    <section
      id="new-arrivals"
      aria-labelledby="new-arrivals-heading"
      className="bg-brand px-6 pb-12 pt-10 md:pb-16 md:pt-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-ink/50">
              Just In
            </p>
            <h2
              id="new-arrivals-heading"
              className="mt-2 font-heading text-3xl tracking-tight text-ink md:text-4xl"
            >
              New Arrivals
            </h2>
            <p className="mt-2 max-w-md font-sans text-sm font-light leading-relaxed text-ink/60">
              Recently acquired pieces, photographed and graded this week.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous new arrivals"
              className="border border-ink/25 p-2.5 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next new arrivals"
              className="border border-ink/25 p-2.5 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          tabIndex={0}
          role="list"
          aria-label="New arrivals carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              scrollByCard(1);
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              scrollByCard(-1);
            }
          }}
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/40 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <ArrivalCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

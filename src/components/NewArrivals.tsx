import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/router-compat';
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
    <article className="group flex h-full snap-start flex-col border border-ink/10 bg-paper">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-ink/10 bg-paper">
        <ProductImage
          path={item.image}
          alt={item.name}
          label="Image"
          iconType={iconTypeFor(item)}
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

  // Card widths: one full card on mobile (no partial peek), then 2 / 3 / 4
  // across sm / lg / xl — each width subtracts its share of the 24px gap so
  // every snap point lands exactly on one card.
  const liClass =
    'w-full shrink-0 snap-start sm:w-[calc(50%_-_12px)] lg:w-[calc(33.333%_-_16px)] xl:w-[calc(25%_-_18px)]';

  if (item.product_id) {
    return (
      <li className={liClass}>
        <Link to={`/product/${item.product_id}`} className="block h-full">
          {card}
        </Link>
      </li>
    );
  }

  return <li className={liClass}>{card}</li>;
}

export function NewArrivals() {
  const { data: items } = useVisibleNewArrivals();
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Mouse drag state (touch uses the native scroll + CSS snap instead).
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  // Set after a drag so the click that follows a drag doesn't navigate.
  const suppressClick = useRef(false);

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

  const handlePointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    // Mouse-only manual drag. Touch/trackpad use native scrolling + CSS snap.
    if (e.pointerType !== 'mouse') return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startScroll: trackRef.current?.scrollLeft ?? 0,
      moved: false,
    };
    suppressClick.current = false;
    setPaused(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore capture errors
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const track = trackRef.current;
    if (!d.down || !track || e.pointerType !== 'mouse') return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) d.moved = true;
    if (d.moved) {
      // Drag left (dx negative) → next product; drag right → previous.
      track.scrollLeft = d.startScroll - dx;
    }
  };

  const handlePointerEnd = () => {
    const d = drag.current;
    if (d.down && d.moved) suppressClick.current = true;
    drag.current.down = false;
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLUListElement>) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onClickCapture={handleClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [overscroll-behavior-x:contain] [user-select:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink/40 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <ArrivalCard key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
      </div>
    </section>
  );

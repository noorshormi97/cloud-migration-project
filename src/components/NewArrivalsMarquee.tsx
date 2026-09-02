import { Link } from "@/lib/router-compat";
import { ProductImage } from "./products/ProductImage";
import { useVisibleNewArrivals } from "@/hooks/useNewArrivals";
import { formatPrice } from "@/lib/store";
import { newArrivalImages, type NewArrival } from "@/lib/newArrivals";

function iconTypeFor(item: NewArrival): "banknote" | "coin" | "accessory" {
  const text = `${item.category} ${item.name}`.toLowerCase();
  if (text.includes("note")) return "banknote";
  if (text.includes("coin")) return "coin";
  return "accessory";
}

function Card({ item }: { item: NewArrival }) {
  const body = (
    <article className="group flex h-full flex-col border border-ink/10 bg-white shadow-[0_1px_0_rgba(17,17,17,0.04)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_20px_44px_-28px_rgba(17,17,17,0.5)]">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-ink/10 bg-white">
        <ProductImage
          path={newArrivalImages(item)[0]}
          alt={item.name}
          label="Image"
          iconType={iconTypeFor(item)}
          className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {item.is_new ? (
          <span className="absolute left-0 top-0 bg-ink px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
            New
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-ink/45">
          {item.category}
        </p>
        <h3 className="font-heading text-xl leading-snug tracking-tight text-ink">{item.name}</h3>
        <p className="font-sans text-xs font-light text-ink/60">
          {[item.country, item.year, item.condition].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-auto pt-3 font-sans text-base font-medium text-ink">
          {item.price > 0 ? formatPrice(item.price) : "Ask for Price"}
        </p>
      </div>
    </article>
  );

  // Every card opens the item's own detail page — New Arrivals is a
  // standalone section, separate from the shop.
  return (
    <li aria-hidden={undefined} className="w-[74vw] shrink-0 sm:w-[300px] lg:w-[320px]">
      <Link to={`/new-arrival/${item.id}`} className="block h-full">
        {body}
      </Link>
    </li>
  );
}

export function NewArrivalsMarquee() {
  const { data: items } = useVisibleNewArrivals();

  if (items.length === 0) return null;

  const loop = [...items, ...items];
  const duration = Math.max(28, items.length * 7);

  return (
    <section
      id="new-arrivals"
      aria-labelledby="new-arrivals-heading"
      className="mt-14 border-t border-ink/10 pt-12 md:mt-20 md:pt-16"
    >
      <div className="text-center">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-ink/45">
          Just In
        </p>
        <h2
          id="new-arrivals-heading"
          className="mt-2 font-heading text-3xl tracking-tight text-ink md:text-4xl"
        >
          New Arrivals
        </h2>
        <p className="mx-auto mt-2 max-w-md font-sans text-sm font-light leading-relaxed text-ink/60">
          Recently acquired pieces, photographed and graded this week.
        </p>
      </div>

      <div
        className="na-marquee relative mt-9 overflow-hidden"
        style={{ ["--na-duration" as string]: `${duration}s` }}
      >
        <ul role="list" aria-label="New arrivals" className="na-marquee-track flex w-max gap-6">
          {loop.map((item, index) => (
            <Card key={`${item.id}-${index}`} item={item} />
          ))}
        </ul>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-brand to-transparent md:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-brand to-transparent md:w-20" />
      </div>
    </section>
  );
}

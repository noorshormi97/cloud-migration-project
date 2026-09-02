import { motion } from "framer-motion";
import { Link } from "@/lib/router-compat";
import { ProductImage } from "./products/ProductImage";
import { useVisibleStartCollecting } from "@/hooks/useStartCollecting";
import { formatPrice } from "@/lib/store";
import { startCollectingImages, type StartCollectingItem } from "@/lib/startCollecting";

function Card({ item }: { item: StartCollectingItem }) {
  const image = startCollectingImages(item)[0];
  const outOfStock = item.price > 0 && (!item.available || item.stock <= 0);

  return (
    // Every card opens the item's own detail page — Start Collecting is a
    // standalone section with its own stock, separate from the shop.
    <Link to={`/start-collecting/${item.id}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-ink/10 bg-white">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-ink/10 bg-white">
          <ProductImage path={image} alt={item.name} iconType="coin" />
          {outOfStock ? (
            <span className="absolute left-0 top-0 bg-ink/80 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand">
              Out of stock
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4 md:p-5">
          <h3 className="line-clamp-2 font-heading text-base leading-snug tracking-tight text-ink md:text-lg">
            {item.name}
          </h3>
          <p className="mt-auto pt-3 font-sans text-sm font-medium text-ink">
            {item.price > 0 ? formatPrice(item.price) : "Ask for Price"}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function StartCollecting() {
  const { data: items } = useVisibleStartCollecting();

  if (items.length === 0) return null;

  return (
    <section
      id="start-collecting"
      aria-labelledby="start-collecting-heading"
      className="bg-brand px-6 py-8 md:py-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2
            id="start-collecting-heading"
            className="font-heading text-3xl tracking-tight text-ink md:text-4xl"
          >
            Start Collecting
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-ink/65">
            New collector? Here are some affordable collectible items to start your collection.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index, 8) * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card item={item} />
            </motion.li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-block border border-ink bg-ink px-7 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
          >
            More
          </Link>
        </div>
      </div>
    </section>
  );
}

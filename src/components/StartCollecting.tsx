import { motion } from 'framer-motion';
import { Link } from '@/lib/router-compat';
import { ProductImage } from './products/ProductImage';
import { useVisibleStartCollecting } from '@/hooks/useStartCollecting';
import { formatPrice } from '@/lib/store';
import type { StartCollectingItem } from '@/lib/startCollecting';

function Card({ item }: { item: StartCollectingItem }) {
  const body = (
    <article className="group flex h-full flex-col border border-ink/10 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_18px_40px_-28px_rgba(17,17,17,0.5)]">
      <div className="flex aspect-square items-center justify-center overflow-hidden border-b border-ink/10 bg-white">
        <ProductImage
          path={item.image}
          alt={item.name}
          iconType="coin"
          className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3 md:p-4">
        <h3 className="line-clamp-2 font-heading text-base leading-snug tracking-tight text-ink md:text-lg">
          {item.name}
        </h3>
        <p className="mt-auto pt-2 font-sans text-sm font-medium text-ink">
          {formatPrice(item.price)}
        </p>
      </div>
    </article>
  );

  return item.product_id ? (
    <Link to={`/product/${item.product_id}`} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

export function StartCollecting() {
  const { data: items } = useVisibleStartCollecting();

  if (items.length === 0) return null;

  return (
    <section
      id="start-collecting"
      aria-labelledby="start-collecting-heading"
      className="bg-brand px-6 py-14 md:py-20"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2
            id="start-collecting-heading"
            className="font-heading text-3xl tracking-tight text-ink md:text-4xl"
          >
            Start Collecting
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-ink/65">
            New collector? Here are some affordable collectible items to start your
            collection.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 md:gap-6">
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

        <div className="mt-10 text-center">
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

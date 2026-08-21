import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../data/products';
import { isInStock } from '@/lib/store';

function formatPrice(price: number) {
  return `৳${price.toLocaleString('en-BD')}`;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Compact product card — small square image, tight text, small button so many
// cards fit in the grid (2 columns on mobile). Keeps link + add-to-cart.
export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const inStock = isInStock(product);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(product.id, 1);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full w-full">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -3 }}
        className="flex h-full flex-col border border-ink/10 bg-paper transition-shadow duration-300 hover:shadow-md"
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden border-b border-ink/10 bg-paper">
          <ProductImage
            path={product.images[0]}
            alt={product.name}
            iconType={
              product.type === 'Banknote'
                ? 'banknote'
                : product.type === 'Coin'
                  ? 'coin'
                  : 'accessory'
            }
          />
          {!inStock ? (
            <span className="absolute left-0 top-0 bg-ink/85 px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-widest text-brand">
              Out of Stock
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-2.5 md:p-3">
          <p className="font-sans text-[9px] font-medium uppercase tracking-widest text-ink/50">
            {product.country}
          </p>
          <h3 className="font-heading text-sm leading-snug tracking-tight text-ink md:text-base">
            {product.name}
          </h3>
          <p className="font-sans text-[10px] font-light text-ink/60">
            {[product.denomination, product.year, product.condition]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <p className="mt-auto pt-1.5 font-heading text-sm font-medium text-ink md:text-base">
            {formatPrice(product.price)}
          </p>

          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="mt-1.5 flex items-center justify-center gap-1.5 border border-ink bg-transparent px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={12} strokeWidth={1.5} />
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </motion.article>
    </Link>
  );
}

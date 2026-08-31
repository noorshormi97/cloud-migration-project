import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
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
    toast.success(`${product.name} added to the cart.`, {
      duration: 2500,
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group block h-full w-full">
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: Math.min(index % 10, 8) * 0.07,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex h-full flex-col border border-ink/10 bg-paper"
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

          {/* Small "add to cart" icon in the image corner — keeps the card
              body as the one-tap navigation target (so the card opens on a
              single click anywhere except this small button). */}
          {inStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand/90 text-ink shadow-sm transition-colors hover:bg-ink hover:text-brand"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-0.5 p-2.5 md:p-3">
          <p className="truncate font-sans text-[9px] font-medium uppercase tracking-widest text-ink/50">
            {product.country}
          </p>
          <h3 className="truncate font-heading text-sm leading-snug tracking-tight text-ink md:text-base">
            {product.name}
          </h3>
          <p className="font-sans text-[10px] font-light text-ink/60">
            {[product.denomination, product.year, product.condition]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <p className="mt-1 font-heading text-sm font-medium text-ink md:text-base">
            {formatPrice(product.price)}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}

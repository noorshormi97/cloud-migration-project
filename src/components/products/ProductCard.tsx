import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { ProductImage } from './ProductImage';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../data/products';
import { isInStock } from '@/lib/store';
import { askForPriceUrl, useWhatsAppNumber } from '@/hooks/useWhatsApp';

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
  const whatsappNumber = useWhatsAppNumber();
  const askPrice = product.price <= 0 && whatsappNumber.length > 0;

  const handleAskForPrice = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(askForPriceUrl(whatsappNumber, product.name), '_blank', 'noopener,noreferrer');
  };

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
          <p className="mt-1 flex items-center gap-1 font-heading text-sm font-medium text-ink md:text-base">
            <ShoppingBag size={12} strokeWidth={1.5} className="shrink-0 text-ink/60" />
            {product.price > 0 ? formatPrice(product.price) : 'Ask for Price'}
          </p>

          {askPrice ? (
            <button
              type="button"
              onClick={handleAskForPrice}
              className="mt-1.5 flex items-center justify-center gap-1.5 border border-ink bg-ink px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-widest text-brand transition-colors hover:bg-ink/85"
            >
              <MessageCircle size={12} strokeWidth={1.5} />
              Ask for Price
            </button>
          ) : (
            <button
              type="button"
              disabled={!inStock}
              onClick={handleAddToCart}
              className="mt-1.5 flex items-center justify-center gap-1.5 border border-ink bg-transparent px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </motion.article>
    </Link>
  );
}

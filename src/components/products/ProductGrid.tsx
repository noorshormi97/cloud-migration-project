import { ProductCard } from './ProductCard';
import type { Product } from '../../data/products';

interface ProductGridProps {
  products: Product[];
}

// Compact product grid — 2 columns on mobile (like banknotecoinstamp.com),
// scaling up to 2 / 3 / 4 columns on larger screens. Tighter gaps so more
// cards are visible at once.
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

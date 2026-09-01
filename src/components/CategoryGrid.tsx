import type { ReactNode } from 'react';
import { CategoryCube } from './CategoryCube';
import { useVisibleCategories } from '@/hooks/useContent';

// Per-category images (uploaded product photos). Categories without a custom
// image fall back to the Flaticon icons below.
const CATEGORY_IMAGES: Record<string, string> = {
  'Foreign Banknotes': '/icons/foreign-banknotes.jpg',
  'Bangladeshi Coins': '/icons/bangladeshi-coins.jpg',
  'Bangladeshi Banknotes': '/icons/bangladeshi-banknotes.jpg',
  'Foreign Sets': '/icons/foreign-sets.jpg',
  'Foreign Coins': '/icons/foreign-coins.jpg',
  'Polymer Banknotes': '/icons/polymer-banknotes.jpg',
  'Fantasy Items': '/icons/fantasy-items.jpg',
  Accessories: '/icons/accessories.jpg',
};

const ICON_IMAGES: Record<string, string> = {
  banknote: '/icons/banknote.png',
  coin: '/icons/coins.png',
  accessory: '/icons/accessories.png',
};

function IconImage({ src, size = 44 }: { src: string; size?: number }) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className="object-contain"
    />
  );
}

const DESCRIPTIONS: Record<string, string> = {
  'Bangladeshi Coins': 'Local Currency',
  'Bangladeshi Banknotes': 'Paper Money',
  'Bangladeshi Stamps': 'Postal Heritage',
  'Foreign Banknotes': 'Global Paper',
  'Foreign Coins': 'World Metal',
  'Foreign Stamps': 'Worldwide Post',
  'Polymer Banknotes': 'Modern Notes',
  'Foreign Sets': 'Curated Collections',
  Accessories: 'Folders & More',
  'Fantasy Items': 'Novelty Collectibles',
};

function iconFor(name: string): ReactNode {
  // Custom photo for this category if one exists
  const custom = CATEGORY_IMAGES[name];
  if (custom) {
    return (
      <img
        src={custom}
        alt={name}
        width={72}
        height={72}
        className="object-contain"
      />
    );
  }
  // Fallback: Flaticon icons
  if (name.includes('Stamp')) return <IconImage src={ICON_IMAGES['accessory']!} />;
  if (name.includes('Banknote')) return <IconImage src={ICON_IMAGES['banknote']!} />;
  if (name.includes('Coin')) return <IconImage src={ICON_IMAGES['coin']!} />;
  return <IconImage src={ICON_IMAGES['accessory']!} />;
}

export function CategoryGrid() {
  const { data: categories } = useVisibleCategories();

  return (
    <section id="categories" className="bg-brand px-6 pb-7 pt-7 md:pb-8 md:pt-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-center font-sans text-sm font-medium uppercase tracking-[0.2em] text-ink/70 md:mb-8">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCube
              key={category.id}
              title={category.name}
              description={DESCRIPTIONS[category.name] ?? 'Collectibles'}
              icon={iconFor(category.name)}
              index={index}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

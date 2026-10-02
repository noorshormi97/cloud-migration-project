import { IMAGE_SIZES, imageUrl, type ImageTransform } from '@/lib/store';

interface ProductImageProps {
  path?: string | undefined;
  alt: string;
  className?: string;
  iconSize?: number;
  label?: string;
  // Which Flaticon placeholder to show when there's no photo.
  iconType?: 'banknote' | 'coin' | 'accessory' | 'generic';
  // Which stored size to request. Defaults to the card size, which covers
  // every grid card, cart row and admin thumbnail. Pass IMAGE_SIZES.detail for
  // the large image on a product page, or null for the untouched original.
  transform?: ImageTransform | null;
}

const ICONS: Record<string, string> = {
  banknote: '/icons/banknote.png',
  coin: '/icons/coins.png',
  accessory: '/icons/accessories.png',
  generic: '/icons/accessories.png',
};

export function ProductImage({
  path,
  alt,
  className = '',
  iconSize = 40,
  label,
  iconType = 'generic',
  transform = IMAGE_SIZES.card,
}: ProductImageProps) {
  // Public bucket URLs are built on the spot - no request, no loading state,
  // and the same photo keeps the same URL so the browser can cache it.
  const url = path ? imageUrl(path, transform ?? undefined) : null;

  if (url) {
    return (
      <img
        src={url}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const iconSrc = ICONS[iconType] ?? ICONS['generic']!;

  return (
    <div className="flex flex-col items-center gap-2 text-ink/30">
      <img
        src={iconSrc}
        alt=""
        style={{ width: iconSize, height: iconSize }}
        className="object-contain opacity-60"
      />
      {label ? (
        <span className="font-sans text-[10px] uppercase tracking-widest">{label}</span>
      ) : null}
    </div>
  );
}

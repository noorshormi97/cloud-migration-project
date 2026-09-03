import { useQuery } from '@tanstack/react-query';
import { fetchImageUrl } from '@/lib/store';

interface ProductImageProps {
  path?: string | undefined;
  alt: string;
  className?: string;
  iconSize?: number;
  label?: string;
  // Which Flaticon placeholder to show when there's no photo.
  iconType?: 'banknote' | 'coin' | 'accessory' | 'generic';
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
}: ProductImageProps) {
  const { data: url } = useQuery({
    queryKey: ['product-image', path],
    queryFn: () => fetchImageUrl(path as string),
    enabled: Boolean(path),
    staleTime: 1000 * 60 * 60,
  });

  if (path && url) {
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

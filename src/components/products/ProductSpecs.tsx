import type { Product } from '../../data/products';

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  // Only show spec rows that actually have a value — empty rows (e.g. a
  // missing Currency or Year) make the page look unfinished to customers
  // and to Google's content reviewers.
  const specs = [
    { label: 'Country', value: product.country },
    { label: 'Currency', value: product.currency },
    { label: 'Denomination', value: product.denomination },
    { label: 'Year', value: product.year },
    { label: 'Condition', value: product.condition },
    { label: 'Type', value: product.type },
  ].filter((spec) => spec.value && spec.value.trim().length > 0);

  const description = (product.description ?? '').trim();

  return (
    <div className="border-t border-ink/10 pt-10 md:pt-12">
      <h2 className="mb-4 font-heading text-2xl tracking-tight text-ink">
        About this collectible
      </h2>
      {description.length > 0 && (
        <p className="max-w-3xl font-sans text-base font-light leading-relaxed text-ink/80">
          {description}
        </p>
      )}

      <div className="mt-8 max-w-2xl">
        <h3 className="mb-3 font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
          Product Information
        </h3>
        <dl className="divide-y divide-ink/10 border-t border-ink/10">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between py-3 font-sans text-sm"
            >
              <dt className="font-medium uppercase tracking-wider text-ink/50">
                {spec.label}
              </dt>
              <dd className="font-light text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

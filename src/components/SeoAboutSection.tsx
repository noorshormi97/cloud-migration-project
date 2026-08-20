import { Link } from '@/lib/router-compat';

// On-page content section — gives Google real, keyword-rich text about the
// business on the homepage (helps the page rank for non-brand queries).
export function SeoAboutSection() {
  return (
    <section className="bg-brand px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-5 text-center font-sans text-sm font-medium uppercase tracking-[0.2em] text-ink/70 md:mb-8">
          Authentic Collectible Banknotes &amp; World Currency
        </h2>
        <div className="space-y-4 font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg">
          <p>
            <strong className="font-medium text-ink">Discovery of Coins</strong> is an
            authentic collectible banknote seller based in{' '}
            <strong className="font-medium text-ink">Dhaka, Bangladesh</strong>. We sell
            banknotes from countries all over the world, with thousands of varieties
            available for collectors to discover.
          </p>
          <p>
            Our focus is on <strong className="font-medium text-ink">authentic
            collectible banknotes and world currency</strong>, giving collectors a
            reliable place to explore notes from different nations, eras, and designs.
            From rare Bangladeshi banknotes to foreign currency from every corner of the
            globe, every note in our store is verified for authenticity before it goes on
            sale.
          </p>
          <p>
            Whether you are a seasoned numismatist or just starting your collection, we
            make it easy to buy banknotes online in Bangladesh — with delivery across the
            country and friendly support on{' '}
            <Link to="/contact" className="text-ink underline underline-offset-4 hover:text-ink/70">
              WhatsApp and Instagram
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

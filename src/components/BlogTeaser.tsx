import { Link } from '@/lib/router-compat';

export function BlogTeaser() {
  return (
    <section className="bg-brand px-6 py-8 md:py-10">
      <div className="mx-auto max-w-2xl border border-ink/10 bg-paper px-6 py-8 text-center md:px-8">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-ink/50">
          Discovery of Coins
        </p>
        <h2 className="mt-2 font-heading text-2xl tracking-tight text-ink md:text-3xl">
          Our Blog
        </h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm font-light leading-relaxed text-ink/70">
          Guides and stories on Bangladeshi taka notes, their value, and
          collecting world coins — in our own words.
        </p>
        <Link
          to="/blog"
          className="mt-5 inline-block border border-ink bg-ink px-7 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
        >
          Read the Blog
        </Link>
      </div>
    </section>
  );
}

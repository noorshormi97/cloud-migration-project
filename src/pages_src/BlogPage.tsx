import { Link } from '@/lib/router-compat';

// ============================================================================
// The Blog — Discovery of Coins.
//
// Purely additive content page rendered inside the existing public Layout
// (Navigation + Footer). Content is data-driven below so posts are easy to add.
//
// SEO: the /blog route head (src/routes/_site.blog.tsx) sets title, meta
// description, canonical URL and OG tags. Each post below opens with the real
// YouTube video from @discoveryofcoins, then a short natural article. Keywords
// are used once or twice in natural sentences — never stuffed — so the page
// ranks on Google without triggering spam filters.
// ============================================================================

interface BlogPost {
  id: string;
  title: string;
  metaDescription: string;
  date: string;
  videoTitle: string;
  /** Full embed URL for this video on @discoveryofcoins. */
  videoUrl: string;
  intro: string;
  body: { heading?: string; paragraphs: string[] }[];
  sources: { label: string; url: string }[];
}

const posts: BlogPost[] = [
  {
    id: 'takar-haat-bangladesh-note-market',
    title: 'Visiting the "Taka Haat" in Bangladesh: Inside the Market for Old Taka Notes',
    metaDescription:
      'What is a Takar Haat in Bangladesh? A look at the market where collectors buy and sell old Bangladeshi taka notes, plus tips for new currency collectors.',
    date: 'September 2026',
    videoTitle: '36 – The Taka Haat (Bangladeshi Banknote Market) — Discovery of Coins',
    videoUrl: 'https://www.youtube-nocookie.com/embed/LVHwjs8nKoE',
    intro:
      'In Bangladesh, serious collectors of old banknotes know that the real treasure hunt does not always happen online. It happens at the "Taka Haat" — the lively market where buyers and sellers of Bangladeshi taka notes gather. In this video we walk through one of these markets to show new collectors exactly how it works.',
    body: [
      {
        heading: 'What is the Taka Haat?',
        paragraphs: [
          'The Taka Haat is a gathering of currency dealers and collectors where people come to buy and sell old Bangladeshi banknotes, from common circulation notes to scarce early series. For someone who collects Bangladeshi currency, it is one of the best places to compare prices, inspect notes in person and meet others who share the hobby.',
        ],
      },
      {
        heading: 'What collectors look for',
        paragraphs: [
          'Dealers and collectors at the market pay attention to the same things that matter to any numismatist: condition, rarity, serial numbers and original printing. A crisp, uncirculated note is worth far more than a heavily used one, and notes from the 1970s are especially prized by collectors of rare taka notes.',
          'If you are new, go with a budget, inspect each note carefully against known genuine features, and do not be afraid to ask questions. Building a collection is as much about learning as it is about buying.',
        ],
      },
      {
        heading: 'Starting your own collection',
        paragraphs: [
          'You do not need to travel to a market to begin. Many early and modern Bangladeshi banknotes are available from our online shop, carefully inspected before listing. Whether you collect Bangladeshi taka notes or world currency, a good starting set teaches you the fundamentals quickly.',
        ],
      },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Video: @discoveryofcoins on YouTube', url: 'https://www.youtube.com/watch?v=LVHwjs8nKoE' },
    ],
  },
  {
    id: 'old-red-1-taka-note-value',
    title: 'How Much Is an Old Red 1 Taka Note Worth? Valuing Bangladeshi 1 Taka Notes',
    metaDescription:
      'How much is an old 1 taka note worth? A clear, honest guide to valuing the famous red 1 taka notes of Bangladesh and what really drives their price.',
    date: 'September 2026',
    videoTitle: '546 – Red 1 Taka worth 1 lakh? How much is one taka worth — Discovery of Coins',
    videoUrl: 'https://www.youtube-nocookie.com/embed/x5NuwOR-E84',
    intro:
      'The humble 1 Taka is the most collected note in Bangladesh, and the red 1 Taka holds a special place in collectors\u2019 hearts. Rumours sometimes claim an old one is worth a fortune. In this video we take a realistic look at how much a Bangladeshi 1 Taka note is actually worth and what determines its value.',
    body: [
      {
        heading: 'Why the 1 Taka is so popular',
        paragraphs: [
          'The 1 Taka was the first denomination of independent Bangladesh and carries a map of the country on its face. Because it was issued in many series, years and signatures, it is an easy and affordable way to start collecting Bangladeshi taka notes while still offering real variety and rarity in its scarcer varieties.',
        ],
      },
      {
        heading: 'A realistic look at value',
        paragraphs: [
          'As the video shows, dramatic claims about a single red 1 Taka being worth lakhs are almost always exaggerated. Real value depends on the exact series, year, serial number, condition and demand. A rare, uncirculated variety in the right signature can be worth a meaningful premium, but a common circulated note is not.',
          'Before you buy or sell, compare notes with genuine market prices and inspect the note carefully. That is the best way to avoid overpaying for common old taka notes.',
        ],
      },
      {
        heading: 'Building a genuine 1 Taka collection',
        paragraphs: [
          'A date-and-series run of Bangladeshi 1 Taka notes is a rewarding, beginner-friendly project. We list inspected 1 Taka and other Bangladeshi notes in our shop, so you can grow your collection of collectible currency in Bangladesh with confidence.',
        ],
      },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Video: @discoveryofcoins on YouTube', url: 'https://www.youtube.com/watch?v=x5NuwOR-E84' },
    ],
  },
  {
    id: '1984-one-pound-scottish-thistle-coin',
    title: 'The 1984 One Pound Coin with the Scottish Thistle: A Guide to Valuing UK Coins',
    metaDescription:
      'An introduction to the 1984 One Pound coin bearing the Scottish thistle, how to tell the Scottish design from the English one, and how to value collectible foreign coins.',
    date: 'September 2026',
    videoTitle: '17 – One Pound UK 1984 Scottish Thistle Value — Discovery of Coins',
    videoUrl: 'https://www.youtube-nocookie.com/embed/WDMu2T4LKEg',
    intro:
      'Collecting goes far beyond Bangladeshi notes. World coins are a fantastic branch of numismatics, and one classic example is the British One Pound coin introduced in 1983. In this video we look at the 1984 One Pound carrying the Scottish thistle and explain how collectors value UK coins.',
    body: [
      {
        heading: 'The Scottish thistle One Pound',
        paragraphs: [
          'When the UK introduced the round One Pound coin in 1983, it used different reverse designs for each nation — a thistle for Scotland, a leek for Wales, a flax plant for Northern Ireland and the royal arms for England. The 1984 Scottish thistle design is a popular piece for collectors of world coins and UK currency.',
        ],
      },
      {
        heading: 'How collectors value it',
        paragraphs: [
          'As with any coin, value is driven by condition, mintage and demand. Circulated 1984 One Pound coins are common and worth little above face value, while the finest uncirculated examples carry a small premium. Knowing the exact design and grading the coin honestly is the key to realistic foreign coin valuation.',
        ],
      },
      {
        heading: 'Expanding beyond one country',
        paragraphs: [
          'Combining Bangladeshi taka notes with world coins and banknotes makes a richer collection. Discovery of Coins specialises in collectible currency from Bangladesh and around the world, so whether you collect 1 Taka notes, commemorative Bangladeshi coins or British One Pound pieces, you can find pieces to add.',
        ],
      },
    ],
    sources: [
      { label: 'Royal Mint — One Pound coin', url: 'https://www.royalmint.com/one-pound-coin/' },
      { label: 'Video: @discoveryofcoins on YouTube', url: 'https://www.youtube.com/watch?v=WDMu2T4LKEg' },
    ],
  },
];

function VideoEmbed({ url, title }: { url: string; title: string }) {
  // Lazy-loaded, responsive iframe (16:9) so it never slows the page.
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-ink/5">
      <iframe
        src={url}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

export function BlogPage() {
  return (
    <section className="bg-brand px-6 py-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 md:mb-4">
          <Link
            to="/"
            className="inline-block font-sans text-xs font-medium uppercase tracking-widest text-ink/60 transition-colors hover:text-ink"
          >
            Home
          </Link>
        </div>

        <header className="text-center">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-ink/50">
            Discovery of Coins
          </p>
          <h1 className="mt-2 font-heading text-4xl tracking-tight text-ink md:text-5xl">
            The Blog
          </h1>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base">
            Guides and stories on Bangladeshi banknotes, taka note value and
            collecting world coins — from the Taka Haat to valuing old
            Bangladeshi notes and British One Pound coins.
          </p>
        </header>

        <div className="mt-10 space-y-14 md:mt-14">
          {posts.map((post) => (
            <article key={post.id} id={post.id} className="space-y-5">
              <VideoEmbed url={post.videoUrl} title={post.videoTitle} />

              <div>
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-ink/40">
                  {post.date}
                </p>
                <h2 className="mt-1.5 font-heading text-2xl leading-tight tracking-tight text-ink md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 font-sans text-base font-light leading-relaxed text-ink/75">
                  {post.intro}
                </p>
              </div>

              <div className="space-y-5">
                {post.body.map((section, i) => (
                  <div key={i} className="space-y-2">
                    {section.heading ? (
                      <h3 className="font-heading text-xl tracking-tight text-ink">
                        {section.heading}
                      </h3>
                    ) : null}
                    {section.paragraphs.map((para, j) => (
                      <p
                        key={j}
                        className="font-sans text-base font-light leading-relaxed text-ink/75"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t border-ink/10 pt-3">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink/40">
                  Sources
                </p>
                <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-ink/60">
                  {post.sources.map((s, i) => (
                    <span key={s.url}>
                      {i > 0 ? ' · ' : ''}
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 transition-colors hover:text-ink"
                      >
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

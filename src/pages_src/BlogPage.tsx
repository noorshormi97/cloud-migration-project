import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

/**
 * Editorial blog for Discovery of Coins.
 *
 * Posts are plain data below (no CMS/database call) so the page renders
 * fully on the server — that matters for SEO and for AdSense reviewers,
 * who must be able to read real article text without running JavaScript.
 *
 * To publish a new post: add an entry to POSTS. Newest first.
 */

interface BlogSection {
  heading: string;
  paragraphs: string[];
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  /** Short standfirst shown under the title. */
  intro: string;
  /** YouTube video id, e.g. "LVHwjs8nKoE". Omit for a text-only post. */
  youtubeId?: string;
  /** Accessible title for the embedded video. */
  videoTitle?: string;
  sections: BlogSection[];
  sources: { label: string; href: string }[];
}

const POSTS: BlogPost[] = [
  {
    slug: 'taka-haat-market-old-taka-notes',
    title:
      'Visiting the "Taka Haat" in Bangladesh: Inside the Market for Old Taka Notes',
    date: 'September 2026',
    intro:
      'In Bangladesh, serious collectors of old banknotes know that the real treasure hunt does not always happen online. It happens at the "Taka Haat" — the lively market where buyers and sellers of Bangladeshi taka notes gather. In this video we walk through one of these markets to show new collectors exactly how it works.',
    youtubeId: 'LVHwjs8nKoE',
    videoTitle:
      '36 – The Taka Haat (Bangladeshi Banknote Market) — Discovery of Coins',
    sections: [
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
      {
        label: 'Bangladesh Bank — Notes & Coins',
        href: 'https://www.bb.org.bd/en/index.php/currency/currency',
      },
      {
        label: 'Video: @discoveryofcoins on YouTube',
        href: 'https://www.youtube.com/watch?v=LVHwjs8nKoE',
      },
    ],
  },
  {
    slug: 'old-red-1-taka-note-value',
    title:
      'How Much Is an Old Red 1 Taka Note Worth? Valuing Bangladeshi 1 Taka Notes',
    date: 'September 2026',
    intro:
      'The humble 1 Taka is the most collected note in Bangladesh, and the red 1 Taka holds a special place in collectors\u2019 hearts. Rumours sometimes claim an old one is worth a fortune. In this video we take a realistic look at how much a Bangladeshi 1 Taka note is actually worth and what determines its value.',
    youtubeId: 'x5NuwOR-E84',
    videoTitle:
      '546 – Red 1 Taka worth 1 lakh? How much is one taka worth — Discovery of Coins',
    sections: [
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
      {
        label: 'Bangladesh Bank — Notes & Coins',
        href: 'https://www.bb.org.bd/en/index.php/currency/currency',
      },
      {
        label: 'Video: @discoveryofcoins on YouTube',
        href: 'https://www.youtube.com/watch?v=x5NuwOR-E84',
      },
    ],
  },
  {
    slug: '1984-one-pound-coin-scottish-thistle',
    title:
      'The 1984 One Pound Coin with the Scottish Thistle: A Guide to Valuing UK Coins',
    date: 'September 2026',
    intro:
      'Collecting goes far beyond Bangladeshi notes. World coins are a fantastic branch of numismatics, and one classic example is the British One Pound coin introduced in 1983. In this video we look at the 1984 One Pound carrying the Scottish thistle and explain how collectors value UK coins.',
    youtubeId: 'WDMu2T4LKEg',
    videoTitle:
      '17 – One Pound UK 1984 Scottish Thistle Value — Discovery of Coins',
    sections: [
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
      {
        label: 'Royal Mint — One Pound coin',
        href: 'https://www.royalmint.com/',
      },
      {
        label: 'Video: @discoveryofcoins on YouTube',
        href: 'https://www.youtube.com/watch?v=WDMu2T4LKEg',
      },
    ],
  },
];

function VideoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-ink/10 bg-ink/5">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute left-0 top-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}

function Article({ post }: { post: BlogPost }) {
  return (
    <article
      id={post.slug}
      className="border-t border-ink/10 pt-10 first:border-t-0 first:pt-0 md:pt-12"
    >
      <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
        {post.date}
      </p>

      <h2 className="mt-2 font-heading text-2xl tracking-tight text-ink md:text-3xl">
        {post.title}
      </h2>

      <p className="mt-4 font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg">
        {post.intro}
      </p>

      {post.youtubeId && (
        <VideoEmbed id={post.youtubeId} title={post.videoTitle ?? post.title} />
      )}

      <div className="mt-6 space-y-6">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="font-heading text-lg tracking-tight text-ink md:text-xl">
              {section.heading}
            </h3>
            <div className="mt-2 space-y-3.5 font-sans text-base font-light leading-relaxed tracking-wide text-ink/80">
              {section.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-6">
        <h4 className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
          Sources
        </h4>
        <ul className="mt-2 space-y-1 font-sans text-sm font-light text-ink/70">
          {post.sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-ink"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </article>
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
            Discovery of Coins
          </p>

          <h1 className="mt-2 font-heading text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            The Blog
          </h1>

          <p className="mt-4 font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg">
            Guides and stories on Bangladeshi banknotes, taka note value and
            collecting world coins — from the Taka Haat to valuing old
            Bangladeshi notes and British One Pound coins.
          </p>

          <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
            {POSTS.map((post) => (
              <Article key={post.slug} post={post} />
            ))}
          </div>

          <div className="mt-12 border-t border-ink/10 pt-8">
            <p className="font-sans text-base font-light leading-relaxed text-ink/80">
              Ready to start or grow your collection?{' '}
              <Link
                to="/shop"
                className="text-ink underline underline-offset-4 transition-colors hover:text-ink/70"
              >
                Browse the shop
              </Link>{' '}
              or{' '}
              <Link
                to="/contact"
                className="text-ink underline underline-offset-4 transition-colors hover:text-ink/70"
              >
                get in touch
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

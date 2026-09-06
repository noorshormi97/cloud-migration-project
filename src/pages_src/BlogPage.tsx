import { motion } from 'framer-motion';

// Blog posts — educational stories about Bangladeshi currency.
// Replace `youtubeId` with the real video IDs from the
// @discoveryofcoins YouTube channel as videos are published.
interface BlogSection {
  heading: string;
  paragraphs: string[];
}

interface BlogSource {
  label: string;
  url: string;
}

interface BlogPost {
  id: string;
  youtubeId: string;
  title: string;
  date: string;
  lead: string;
  sections: BlogSection[];
  sources: BlogSource[];
}

const posts: BlogPost[] = [
  {
    id: 'taka-notes-history',
    youtubeId: 'VIDEO_ID_1',
    title: 'The History of Bangladeshi Banknotes: From the First Taka to Today',
    date: 'September 2026',
    lead: 'The story of the Bangladeshi Taka is the story of a nation. Every Bangladeshi banknote carries more than a denomination — it carries moments of independence, heritage, and art. For anyone interested in Taka notes history or collectible currency in Bangladesh, understanding where these notes came from makes collecting them far more rewarding.',
    sections: [
      {
        heading: 'The First Taka Notes of 1972',
        paragraphs: [
          'After independence in December 1971, the new nation initially continued using Pakistani currency with stamped overprints while preparing its own. In March 1972, the Government of Bangladesh issued the first Bangladeshi Taka notes, and Bangladesh Bank, the central bank, opened its doors shortly after. The early notes, including the famous 1 Taka depicting a map of Bangladesh, are among the most sought-after old Bangladeshi notes by collectors today.',
        ],
      },
      {
        heading: 'Art, Heritage and National Identity on Paper',
        paragraphs: [
          'Bangladeshi banknotes are celebrated for their imagery: the National Martyrs\u2019 Memorial, the Sixty Dome Mosque in Bagerhat, the Star Mosque, rural landscapes, and the portrait of Bangabandhu Sheikh Mujibur Rahman on modern issues. Each design was chosen to reflect the country\u2019s culture and history, which is exactly why older series have become treasured collectibles.',
        ],
      },
      {
        heading: 'Why Collectors Look for Early Issues',
        paragraphs: [
          'Notes from the 1972 and 1973 series, especially in crisp uncirculated condition, are increasingly scarce. Short printing runs, heavy circulation in a cash economy, and decades of humid storage mean that surviving examples are far rarer than their face values suggest. Condition, serial numbers, and signatures all affect collectibility.',
        ],
      },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Bangladesh Bank Museum', url: 'https://museum.bb.org.bd' },
    ],
  },
  {
    id: 'bangladesh-coins-collecting',
    youtubeId: 'VIDEO_ID_2',
    title: 'Bangladesh Coins: A Beginner\u2019s Guide to Collecting Poisha and Taka',
    date: 'September 2026',
    lead: 'While banknotes often take the spotlight, Bangladesh coins are an accessible and fascinating entry point into numismatics. From humble aluminium poisha to commemorative Taka coins, Bangladesh coins collecting offers history you can hold in the palm of your hand — often at very friendly prices.',
    sections: [
      {
        heading: 'The First Coins of Independent Bangladesh',
        paragraphs: [
          'The first coins of Bangladesh were issued in 1973 in denominations of 5, 10, 25 and 50 poisha. These aluminium coins featured national symbols — the hilsa fish, sheaves of paddy, and the water lily, the national flower. Because they circulated heavily and were made of soft aluminium, well-preserved examples are surprisingly hard to find today.',
        ],
      },
      {
        heading: 'Commemorative and Modern Issues',
        paragraphs: [
          'Bangladesh Bank has issued commemorative coins for national milestones — Victory Day silver jubilees, the birth centenary of Bangabandhu, and international events such as the Cricket World Cup. Modern 1, 2 and 5 Taka coins continue the tradition of pairing practical currency with national imagery, and special issues are popular with collectors of collectible currency in Bangladesh.',
        ],
      },
      {
        heading: 'Tips for New Collectors',
        paragraphs: [
          'Start with circulation coins by year and denomination, then move toward commemoratives. Handle coins by their edges, store them in acid-free flips or capsules away from humidity, and never clean a collectible coin — cleaning removes original surfaces and reduces value. A simple magnifier and a reference catalogue go a long way.',
        ],
      },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Bangladesh Bank Museum', url: 'https://museum.bb.org.bd' },
    ],
  },
  {
    id: 'security-features-old-bangladeshi-notes',
    youtubeId: 'VIDEO_ID_3',
    title: 'How to Identify Genuine Old Bangladeshi Notes: Security Features Explained',
    date: 'September 2026',
    lead: 'Whether you collect old Bangladeshi notes or simply handle cash every day, knowing how to check a banknote\u2019s security features protects you from counterfeits — and helps you judge authenticity when buying collectibles. Here is a practical guide to the features Bangladesh Bank builds into its notes.',
    sections: [
      {
        heading: 'Watermark and Security Thread',
        paragraphs: [
          'Hold a note up to the light. Genuine Bangladeshi banknotes show a watermark — typically the portrait of Bangabandhu Sheikh Mujibur Rahman on modern notes — along with an embedded security thread that runs vertically through the paper. On many denominations the thread is a windowed type that appears as a broken line of silver dashes.',
        ],
      },
      {
        heading: 'Intaglio Print and Tactile Marks',
        paragraphs: [
          'Bangladeshi banknotes use intaglio (raised) printing on key areas, which you can feel with a fingertip. Higher denominations also include dots or marks to help visually impaired users identify values by touch. Counterfeits usually feel flat and smooth by comparison.',
        ],
      },
      {
        heading: 'Micro-Lettering and Colour-Shifting Features',
        paragraphs: [
          'Look closely and you will find micro-lettering — text far too small for ordinary printers to reproduce — along with see-through registration devices that align perfectly when held to light. Newer issues add optically variable elements that shift colour when tilted. When buying old Bangladeshi notes for your collection, checking these features against reference images from Bangladesh Bank is the safest habit you can build.',
        ],
      },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Bangladesh Bank — Counterfeit Detection', url: 'https://www.bb.org.bd' },
    ],
  },
];

function BlogVideo({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded border border-ink/10 bg-ink/5">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export function BlogPage() {
  return (
    <section className="bg-brand px-6 py-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-heading text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            The Blog
          </h1>
          <p className="mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base">
            Stories and guides on Bangladeshi banknotes, coins and collecting —
            from Taka notes history to identifying old Bangladeshi notes.
          </p>
        </motion.div>

        <div className="mt-10 space-y-14 md:mt-14">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index === 0 ? 0 : 0.05 }}
              className="border-t border-ink/10 pt-8"
            >
              <BlogVideo youtubeId={post.youtubeId} title={post.title} />

              <h2 className="mt-5 font-heading text-2xl tracking-tight text-ink md:text-3xl">
                {post.title}
              </h2>
              <p className="mt-1.5 font-sans text-xs font-medium uppercase tracking-widest text-ink/50">
                {post.date}
              </p>

              <p className="mt-4 font-sans text-base font-light leading-relaxed text-ink/80">
                {post.lead}
              </p>

              <div className="mt-6 space-y-5">
                {post.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="mb-1.5 font-heading text-xl tracking-tight text-ink md:text-2xl">
                      {section.heading}
                    </h3>
                    {section.paragraphs.map((p) => (
                      <p
                        key={p.slice(0, 40)}
                        className="font-sans text-base font-light leading-relaxed text-ink/80"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              <p className="mt-6 border-t border-ink/10 pt-4 font-sans text-xs font-light leading-relaxed text-ink/50">
                Sources:{' '}
                {post.sources.map((s, i) => (
                  <span key={s.url}>
                    {i > 0 && ' · '}
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
                {' '}· Video:{' '}
                <a
                  href="https://www.youtube.com/@discoveryofcoins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors hover:text-ink"
                >
                  @discoveryofcoins on YouTube
                </a>
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

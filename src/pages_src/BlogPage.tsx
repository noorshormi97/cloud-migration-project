import { Link } from '@/lib/router-compat';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  videoTitle: string;
  videoUrl: string;
  intro: string;
  body: { heading?: string; paragraphs: string[] }[];
  sources: { label: string; url: string }[];
}

const posts: BlogPost[] = [
  {
    id: 'history-of-bangladeshi-taka',
    title: 'The History of Bangladeshi Banknotes: From the First Taka to Today',
    date: 'September 2026',
    videoTitle: 'The History of Bangladeshi Banknotes',
    videoUrl: 'https://www.youtube.com/embed/REPLACE_WITH_VIDEO_ID_1',
    intro: 'The story of the Bangladeshi Taka is bound up with the story of the nation itself. Each note carries more than a value — it carries independence, heritage and art. For anyone interested in Taka notes history or collectible currency in Bangladesh, understanding where these notes came from makes collecting them far more rewarding.',
    body: [
      { heading: 'The first Taka notes of 1972', paragraphs: ['After independence in December 1971 the new nation first continued using Pakistani currency bearing hand-stamped overprints while it prepared its own money. In March 1972 the Government of Bangladesh issued the first Bangladeshi Taka notes, and Bangladesh Bank opened as the country\u2019s central bank soon afterwards.', 'The early issues — most famously the 1 Taka note featuring a map of the newly independent nation — are among the most sought-after old Bangladeshi notes held by collectors today.'] },
      { heading: 'Heritage and national identity on paper', paragraphs: ['Bangladeshi banknotes are celebrated for their imagery: the National Martyrs\u2019 Memorial, the Sixty Dome Mosque of Bagerhat, the Star Mosque, rural landscapes, and the portrait of Bangabandhu Sheikh Mujibur Rahman on modern issues. Each design was chosen to reflect the country\u2019s culture and history, which is exactly why the older series have become treasured collectibles.'] },
      { heading: 'Why collectors value early issues', paragraphs: ['Notes from the 1972 and 1973 series, especially in crisp uncirculated condition, are increasingly scarce. Short printing runs, heavy circulation in a cash economy and decades of humid storage mean the surviving examples are far rarer than their face values suggest. Condition, serial numbers and the signatures of the issuing officials all affect how collectible a note is.', 'Many of these early and modern Bangladeshi banknotes are available to buy from our shop — a good way to begin or grow your own Taka collection.'] },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Bangladesh Bank Museum', url: 'https://museum.bb.org.bd/' },
      { label: '@discoveryofcoins on YouTube', url: 'https://www.youtube.com/@discoveryofcoins' },
    ],
  },
  {
    id: 'bangladesh-coins-beginners-guide',
    title: 'Bangladesh Coins: A Beginner\u2019s Guide to Collecting Poisha and Taka',
    date: 'September 2026',
    videoTitle: 'Bangladesh Coins: A Beginner\u2019s Guide',
    videoUrl: 'https://www.youtube.com/embed/REPLACE_WITH_VIDEO_ID_2',
    intro: 'While banknotes often take the spotlight, Bangladesh coins are an accessible and fascinating entry point into numismatics. From humble aluminium poisha to commemorative Taka coins, Bangladesh coins collecting offers history you can hold in the palm of your hand — often at very friendly prices.',
    body: [
      { heading: 'The first coins of independent Bangladesh', paragraphs: ['The first coins of Bangladesh were issued in 1973 in denominations of 5, 10, 25 and 50 poisha. These aluminium coins carried national symbols — the hilsa fish, sheaves of paddy, and the water lily, the national flower. Because they circulated heavily and were struck in soft aluminium, well-preserved examples are surprisingly hard to find today.'] },
      { heading: 'Commemorative and modern issues', paragraphs: ['Bangladesh Bank has issued commemorative coins for national milestones — Victory Day jubilees, the birth centenary of Bangabandhu, and international events such as the Cricket World Cup. Modern 1, 2 and 5 Taka coins continue the tradition of pairing everyday currency with national imagery, and the special issues are popular with collectors of collectible currency in Bangladesh.'] },
      { heading: 'Tips for new collectors', paragraphs: ['Start with circulation coins by year and denomination, then move toward commemoratives. Handle coins by their edges, store them in acid-free flips or capsules away from humidity, and never clean a collectible coin — cleaning removes original surfaces and lowers its value. A simple magnifier and a reference catalogue go a long way.', 'If you are building a set, we stock individual coins and curated Bangladesh coin collections you can order directly.'] },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Bangladesh Bank Museum', url: 'https://museum.bb.org.bd/' },
      { label: '@discoveryofcoins on YouTube', url: 'https://www.youtube.com/@discoveryofcoins' },
    ],
  },
  {
    id: 'spotting-genuine-old-bangladeshi-notes',
    title: 'How to Identify Genuine Old Bangladeshi Notes: Security Features Explained',
    date: 'September 2026',
    videoTitle: 'Security Features on Bangladeshi Banknotes',
    videoUrl: 'https://www.youtube.com/embed/REPLACE_WITH_VIDEO_ID_3',
    intro: 'Whether you collect old Bangladeshi notes or simply handle cash every day, knowing how to check a banknote\u2019s security features protects you from counterfeits — and helps you judge authenticity when buying collectibles. Here is a practical guide to the features Bangladesh Bank builds into its notes.',
    body: [
      { heading: 'Watermark and security thread', paragraphs: ['Hold a note up to the light. Genuine Bangladeshi banknotes show a watermark — typically the portrait of Bangabandhu Sheikh Mujibur Rahman on modern notes — along with an embedded security thread running vertically through the paper. On many denominations the thread is a windowed type that appears as a broken line of silver dashes.'] },
      { heading: 'Intaglio print and tactile marks', paragraphs: ['Bangladeshi banknotes use intaglio (raised) printing on key areas that you can feel with a fingertip. Higher denominations also include dots or marks to help visually impaired users identify values by touch. Counterfeits usually feel flat and smooth by comparison.'] },
      { heading: 'Micro-lettering and colour-shifting features', paragraphs: ['Look closely and you will find micro-lettering — text far too small for ordinary printers to reproduce — along with see-through registration devices that align perfectly when held to light. Newer issues add optically variable elements that shift colour as you tilt the note.', 'When buying old Bangladeshi notes for your collection, checking these features against reference images from Bangladesh Bank is the safest habit you can build. Every note we list is inspected before it is offered for sale.'] },
    ],
    sources: [
      { label: 'Bangladesh Bank — Notes & Coins', url: 'https://www.bb.org.bd/en/index.php/note' },
      { label: 'Bangladesh Bank — Home', url: 'https://www.bb.org.bd/' },
      { label: '@discoveryofcoins on YouTube', url: 'https://www.youtube.com/@discoveryofcoins' },
    ],
  },
];

function VideoEmbed({ url, title }: { url: string; title: string }) {
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
          <Link to="/" className="inline-block font-sans text-xs font-medium uppercase tracking-widest text-ink/60 transition-colors hover:text-ink">
            Home
          </Link>
        </div>
        <header className="text-center">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-ink/50">Discovery of Coins</p>
          <h1 className="mt-2 font-heading text-4xl tracking-tight text-ink md:text-5xl">The Blog</h1>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base">
            Stories and guides on Bangladeshi banknotes, coins and collecting — from Taka notes history to identifying old Bangladeshi notes and building your own collectible currency collection.
          </p>
        </header>
        <div className="mt-10 space-y-14 md:mt-14">
          {posts.map((post) => (
            <article key={post.id} id={post.id} className="space-y-5">
              <VideoEmbed url={post.videoUrl} title={post.videoTitle} />
              <div>
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-ink/40">{post.date}</p>
                <h2 className="mt-1.5 font-heading text-2xl leading-tight tracking-tight text-ink md:text-3xl">{post.title}</h2>
                <p className="mt-3 font-sans text-base font-light leading-relaxed text-ink/75">{post.intro}</p>
              </div>
              <div className="space-y-5">
                {post.body.map((section, i) => (
                  <div key={i} className="space-y-2">
                    {section.heading ? <h3 className="font-heading text-xl tracking-tight text-ink">{section.heading}</h3> : null}
                    {section.paragraphs.map((para, j) => (
                      <p key={j} className="font-sans text-base font-light leading-relaxed text-ink/75">{para}</p>
                    ))}
                  </div>
                ))}
              </div>
              <div className="border-t border-ink/10 pt-3">
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink/40">Sources</p>
                <p className="mt-1.5 font-sans text-xs font-light leading-relaxed text-ink/60">
                  {post.sources.map((s, i) => (
                    <span key={s.url}>
                      {i > 0 ? ' · ' : ''}
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-colors hover:text-ink">{s.label}</a>
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

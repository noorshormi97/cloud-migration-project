import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

// Privacy Policy — what this store collects, why, and who else touches it.
// The Site carries no advertising, so there are no ad-network or
// ad-personalisation disclosures here. Keep it that way unless ads return.
const privacySections = [
  {
    title: 'Who We Are',
    body: [
      'Discovery of Coins ("we", "us", "our") is an online store based in Bangladesh selling authentic collectible coins, banknotes, stamps and collecting accessories at www.discoveryofcoins.store (the "Site").',
      'This Privacy Policy explains what information we collect when you use the Site, how we use it, and the choices you have. By using the Site you agree to this policy.',
    ],
  },
  {
    title: 'Information We Collect',
    body: [
      'Order details: when you place an order we collect your full name, phone number, delivery address, and any optional note you add. We do not require you to create an account, and we never see or store card or banking details.',
      'Messages: if you contact us through the Site, WhatsApp, or social media, we receive the contact information and message content you send us.',
      'Automatic data: like most websites, basic technical information (such as IP address, browser type, pages visited) may be collected automatically through cookies and similar technologies by us and by the third-party services described below.',
    ],
  },
  {
    title: 'How We Use Your Information',
    body: [
      'To process and deliver your orders, including sharing your name, phone number and address with our courier partners (currently Steadfast and Shundarban) solely so they can deliver your parcel.',
      'To contact you about your order, respond to your questions, and provide customer support.',
      'To operate, protect and improve the Site.',
      'We do not sell your personal information to anyone.',
    ],
  },
  {
    title: 'Cookies & Local Storage',
    body: [
      'The Site uses cookies and similar technologies (such as browser local storage) to remember your shopping cart between visits and to make the Site work properly.',
      'The Site shows no advertising and sets no advertising or ad-tracking cookies. What we store is limited to what the Site needs to function, such as your cart.',
      'You can control or delete cookies and local storage through your browser settings. The Site will still work, but some conveniences (like a saved cart) may be lost.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'We rely on a small number of trusted services to run the Site: Supabase (secure hosting of our product catalogue and order data), Vercel (website hosting, which processes technical request data such as IP addresses), and courier companies (delivery of your orders).',
      'Each of these providers processes data only as needed to provide their service to us, under their own privacy policies.',
    ],
  },
  {
    title: 'Data Retention & Security',
    body: [
      'We keep your order information only as long as it is needed to fulfil and deliver your order. Once your order has been successfully delivered and confirmed, we remove your personal information (name, phone number and address) from our database.',
      'We take reasonable technical measures to protect your information, including encrypted connections (HTTPS) and access controls on our systems. No method of transmission over the Internet is 100% secure, but we work to protect your data appropriately.',
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      'The Site is a general-audience online store and is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us personal information, contact us and we will delete it.',
    ],
  },
  {
    title: 'Your Choices & Rights',
    body: [
      'You may contact us at any time to ask what information we hold about you, to correct it, or to request deletion of your order information (subject to legitimate record-keeping needs).',
    ],
  },
  {
    title: 'Developer & Maintenance',
    body: [
      'This website was built and is maintained by Shohail Mahmud, a web developer based in Bangladesh (GitHub: https://github.com/shohail-mahmud, Instagram: https://instagram.com/shohailmahmud09).',
      'Maintenance means applying updates, fixing problems and improving the Site. There is no automated monitoring or alerting service watching the Site around the clock.',
      'Carrying out that work sometimes requires access to the systems where order data is stored. Your information is only ever accessed for the purpose of running and repairing the Site, is never used for anything else, and is never shared or sold.',
    ],
  },
  {
    title: 'Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the Site after changes means you accept the updated policy.',
    ],
  },
  {
    title: 'Contact Us',
    body: [
      'For any questions about this Privacy Policy or your personal information, reach us through the Contact page on this Site, on WhatsApp, or via our Instagram @discoveryofcoins.',
    ],
  },
];

// Render URLs inside body text as real links.
function withLinks(text: string) {
  // Stop before a closing bracket or trailing punctuation — a URL written
  // inside brackets, like (Instagram: https://…/name), used to swallow the
  // ')' into the href and produce a broken link.
  const parts = text.split(/(https?:\/\/[^\s)\]]*[^\s)\].,;:!?])/g);
  return parts.map((part, i) =>
    part.startsWith('http') ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-ink/30 underline-offset-2 transition-colors hover:decoration-ink"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export function PrivacyPage() {
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
          <h1 className="font-heading text-4xl tracking-tight text-ink md:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-3 font-sans text-sm font-light text-ink/60">
            Last updated: September 2, 2026
          </p>

          <div className="mt-8 space-y-6">
            {privacySections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-1.5 font-heading text-xl tracking-tight text-ink md:text-2xl">
                  {section.title}
                </h3>
                <div className="space-y-2.5">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="font-sans text-base font-light leading-relaxed text-ink/80"
                    >
                      {withLinks(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 border-t border-ink/10 pt-6 font-sans text-sm font-light text-ink/60">
            Placing an order? Read our{' '}
            <Link to="/terms" className="underline underline-offset-4 hover:text-ink">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}

import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';

// Store terms — pricing, payment, delivery and returns.
const policies = [
  {
    title: 'Fixed Price',
    content: 'All products are sold at fixed prices.',
  },
  {
    title: 'Price Changes',
    content:
      'We reserve the right to change product prices at any time. We aim to keep our pricing fair and reasonable. If an order is placed before a price change, the customer will be charged the price that was shown when the order was placed.',
  },
  {
    title: 'Payment',
    content: 'Cash on Delivery is not available.',
  },
  {
    title: 'Delivery',
    content:
      'Delivery may take approximately 2–3 days. Delivery time may vary depending on circumstances.',
  },
  {
    title: 'Shipping',
    content:
      'We currently ship only through Shundarban and Steadfast. There is currently no post office delivery option.',
  },
  {
    title: 'Return Policy',
    content: 'No return policy. Products cannot be returned after purchase.',
  },
];

// Privacy Policy — written to satisfy Google AdSense's required disclosures:
// third-party vendors (incl. Google) use cookies, the ad-personalisation
// opt-outs, plus what data this store itself collects and why.
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
      'Third parties listed below may also set cookies when you use the Site. You can control or delete cookies through your browser settings; the Site will still work, but some features (like a saved cart) may be lost.',
    ],
  },
  {
    title: 'Advertising & Google AdSense',
    body: [
      'We use Google AdSense to display advertising on the Site.',
      'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.',
      "Google's use of advertising cookies (including the DoubleClick cookie) enables it and its partners to serve ads to you based on your visits to this Site and/or other sites on the Internet.",
      'You may opt out of personalised advertising by visiting Google Ads Settings at https://www.google.com/settings/ads.',
      'Alternatively, you can opt out of some third-party vendors\u2019 use of cookies for personalised advertising by visiting https://www.aboutads.info/choices.',
      'You can learn more about how Google uses information from sites that use its services at https://policies.google.com/technologies/partner-sites.',
    ],
  },
  {
    title: 'Third-Party Services',
    body: [
      'We rely on a small number of trusted services to run the Site: Supabase (secure hosting of our product catalogue and order data), courier companies (delivery of your orders), and Google (advertising, as described above).',
      'Each of these providers processes data only as needed to provide their service to us, under their own privacy policies.',
    ],
  },
  {
    title: 'Data Retention & Security',
    body: [
      'Order records are kept as long as needed for order fulfilment, customer support and basic business record-keeping.',
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
      'You can opt out of personalised advertising using the links in the Advertising section above.',
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
  const parts = text.split(/(https?:\/\/[^\s.,]+(?:\.[^\s.,]+)*(?:\/[^\s,]*)?)/g);
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

export function TermsPage() {
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
            Terms &amp; Privacy Policy
          </h1>
          <p className="mt-3 font-sans text-sm font-light text-ink/60">
            Last updated: September 2, 2026
          </p>

          {/* ---------------- Store terms ---------------- */}
          <h2 className="mt-8 font-heading text-2xl tracking-tight text-ink md:text-3xl">
            Store Terms
          </h2>
          <div className="mt-4 space-y-5">
            {policies.map((policy) => (
              <div key={policy.title}>
                <h3 className="mb-1.5 font-heading text-xl tracking-tight text-ink md:text-2xl">
                  {policy.title}
                </h3>
                <p className="font-sans text-base font-light leading-relaxed text-ink/80">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>

          {/* ---------------- Privacy Policy ---------------- */}
          <h2
            id="privacy-policy"
            className="mt-12 border-t border-ink/10 pt-8 font-heading text-2xl tracking-tight text-ink md:text-3xl"
          >
            Privacy Policy
          </h2>
          <div className="mt-4 space-y-6">
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
        </motion.div>
      </div>
    </section>
  );
}

import { useQuery } from '@tanstack/react-query';
import { fetchContactDetails } from '@/lib/content';
import { SITE_NAME } from '@/lib/seo';

// Construction-style "Under Construction" sign, drawn inline so it stays crisp
// and matches the site's minimal editorial aesthetic (no external assets).
function ConstructionSign() {
  return (
    <svg
      viewBox="0 0 220 180"
      className="mx-auto h-28 w-36 drop-shadow-[0_12px_24px_rgba(17,17,17,0.18)] sm:h-36 sm:w-44"
      role="img"
      aria-label="Under construction"
    >
      {/* ground shadow */}
      <ellipse cx="110" cy="168" rx="70" ry="8" fill="#111111" opacity="0.12" />
      {/* two legs */}
      <line x1="70" y1="118" x2="60" y2="170" stroke="#111111" strokeWidth="9" strokeLinecap="round" />
      <line x1="150" y1="118" x2="160" y2="170" stroke="#111111" strokeWidth="9" strokeLinecap="round" />
      {/* plank / sign face */}
      <rect
        x="18"
        y="18"
        width="184"
        height="102"
        rx="6"
        fill="#111111"
        stroke="#111111"
        strokeWidth="3"
      />
      {/* hazard stripes */}
      <g stroke="#fae588" strokeWidth="10">
        <line x1="30" y1="34" x2="50" y2="16" />
        <line x1="52" y1="34" x2="72" y2="16" />
        <line x1="74" y1="34" x2="94" y2="16" />
      </g>
      {/* gear symbol */}
      <g transform="translate(110 68)">
        <circle cx="0" cy="0" r="9" fill="none" stroke="#fae588" strokeWidth="4" />
        <g stroke="#fae588" strokeWidth="4" strokeLinecap="round">
          <line x1="0" y1="-16" x2="0" y2="-11" />
          <line x1="14" y1="-8" x2="9.9" y2="-5.5" />
          <line x1="14" y1="8" x2="9.9" y2="5.5" />
          <line x1="0" y1="16" x2="0" y2="11" />
          <line x1="-14" y1="8" x2="-9.9" y2="5.5" />
          <line x1="-14" y1="-8" x2="-9.9" y2="-5.5" />
        </g>
      </g>
    </svg>
  );
}

export function MaintenancePage() {
  const { data } = useQuery({
    queryKey: ['contact-details'],
    queryFn: fetchContactDetails,
  });

  // Reuse the business's existing WhatsApp number from contact_details (the
  // same source the "Send a message" section uses). Never invent a number.
  const rawNumber = (data?.whatsapp_number ?? '').replace(/[^\d]/g, '');
  const waLink = rawNumber
    ? `https://wa.me/${rawNumber}?text=${encodeURIComponent(
        `Hello ${SITE_NAME}, I saw the website is under maintenance. I'd like to ask a question.`,
      )}`
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-brand">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <ConstructionSign />

          <h1 className="mt-10 font-heading text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] tracking-tight text-ink">
            The Website is
            <br />
            Under Maintenance
          </h1>

          <p className="mx-auto mt-6 max-w-md font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg">
            Sorry, we are currently working on the website. We’ll be back soon.
            Thank you for your patience.
          </p>

          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center justify-center gap-2 border border-ink bg-ink px-8 py-3.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Contact us on WhatsApp
            </a>
          ) : null}
        </div>
      </div>

      {/* Dev credit footer */}
      <footer className="border-t border-ink/10 px-6 py-6">
        <p className="text-center font-sans text-[11px] font-light uppercase tracking-[0.2em] text-ink/50">
          Built &amp; maintained by{' '}
          <a
            href="https://www.instagram.com/shohailmahmud09"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink/70 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
          >
            @shohailmahmud09
          </a>
        </p>
      </footer>
    </div>
  );
}

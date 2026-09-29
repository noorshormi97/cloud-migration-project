// DEVELOPER credit — the logo plus three profile links, no popup.
//
// Crawlability note: these are icon-only links, so the accessible name is what
// Google reads as the anchor text. Each one therefore carries BOTH an
// aria-label and an <title> inside the SVG, and the person's name is spelled
// out in every label. Nothing is hidden with `sr-only` — hidden links get
// discounted, which is exactly what made the old credit invisible to Google.
//
// IMPORTANT: this person is the DEVELOPER, not the logo designer. The word
// "designer" must not appear here — it misleads visitors and search engines.

const INSTAGRAM_URL = 'https://instagram.com/shohailmahmud09';
const GITHUB_URL = 'https://github.com/shohail-mahmud';
const DEV_NAME = 'Shohail Mahmud';

function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function GithubIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

interface DeveloperCreditProps {
  /** Wrapper classes (layout / visibility). */
  className?: string;
  /** Classes for the logo image. */
  logoClassName?: string;
  /** Show the developer's name under the logo. */
  showName?: boolean;
  /** Size of the profile icons. */
  iconClassName?: string;
  /**
   * 'column' stacks logo over links (desktop sidebar).
   * 'row' puts the logo on one side and the links on the other, filling the
   * width — used for the mobile block under WhatsApp.
   */
  orientation?: 'column' | 'row';
}

export function DeveloperCredit({
  className = '',
  logoClassName = 'h-14 w-14',
  showName = true,
  iconClassName = 'h-4 w-4',
  orientation = 'column',
}: DeveloperCreditProps) {
  const row = orientation === 'row';
  const links = [
    { href: INSTAGRAM_URL, label: `${DEV_NAME} on Instagram`, Icon: InstagramIcon },
    { href: GITHUB_URL, label: `${DEV_NAME} on GitHub`, Icon: GithubIcon },
  ];

  return (
    <div
      className={
        row
          ? `flex w-full items-center justify-between gap-4 ${className}`
          : `flex flex-col items-center ${className}`
      }
    >
      <div className={row ? 'flex items-center gap-3' : 'contents'}>
        <img
          src="/logo.png"
          alt={`Developed by ${DEV_NAME}`}
          className={`object-contain ${logoClassName}`}
        />

        {showName ? (
          <p
            className={`font-sans text-[11px] font-light text-ink/60 ${
              row ? '' : 'mt-2'
            }`}
          >
            {DEV_NAME}
          </p>
        ) : null}
      </div>

      <div className={`flex items-center gap-3 ${row ? '' : 'mt-2'}`}>
        {links.map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="author external me noopener"
            aria-label={label}
            title={label}
            className="text-ink/50 transition-colors hover:text-ink"
          >
            <Icon className={iconClassName} />
          </a>
        ))}
      </div>
    </div>
  );
}

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

// Brand glyphs are no longer shipped by lucide-react, so they are inlined.
function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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

// Designer credit — clicking the "A web by" logo opens an Instagram-note
// style popup with the designer's links and a handover note, instead of
// navigating straight to Instagram.

const INSTAGRAM_URL = 'https://instagram.com/shohailmahmud09';
const GITHUB_URL = 'https://github.com/shohail-mahmud';
const IG_HANDLE = '@shohailmahmud09';
const GH_HANDLE = '@shohail-mahmud';

const IG_GRADIENT =
  'linear-gradient(45deg, #feda75 0%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 100%)';

interface DesignerCreditProps {
  /** Tailwind classes for the trigger button (sizing/layout). */
  className?: string;
  /** Tailwind classes for the logo image inside the trigger. */
  logoClassName?: string;
}

export function DesignerCredit({ className = '', logoClassName = '' }: DesignerCreditProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        aria-label="About the designer"
        className={`block cursor-pointer transition-opacity hover:opacity-80 ${className}`}
      >
        <img
          src="/logo.png"
          alt="Designer logo — Shohail Mahmud"
          className={`object-contain ${logoClassName}`}
        />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2.5rem)] max-w-xs -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
          {/* The note bubble */}
          <div className="relative rounded-3xl bg-paper p-5 pb-6 shadow-[0_18px_45px_rgba(17,17,17,0.35)]">
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute right-3 top-3 cursor-pointer rounded-full p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>

            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-ink/50">
              A Web By
            </p>
            <DialogPrimitive.Title className="mt-1 font-heading text-2xl tracking-tight text-ink">
              Shohail Mahmud
            </DialogPrimitive.Title>

            <DialogPrimitive.Description asChild>
              <p className="mt-3 border-l-2 border-brand-dark pl-3 font-sans text-xs font-light leading-relaxed text-ink/75">
                Note: I left this project on 20 August 2026. Any changes after
                that were made by the owner — I don&apos;t know about the
                current design.
              </p>
            </DialogPrimitive.Description>

            <div className="mt-4 grid gap-2">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundImage: IG_GRADIENT }}
              >
                <InstagramIcon className="h-3.5 w-3.5" />
                Instagram · {IG_HANDLE}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 font-sans text-xs font-medium text-brand transition-opacity hover:opacity-90"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                GitHub · {GH_HANDLE}
              </a>
            </div>

            {/* Bubble tail pointing at the avatar below */}
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-paper"
            />
          </div>

          {/* Avatar with Instagram-style story ring */}
          <div
            className="mx-auto mt-4 h-16 w-16 rounded-full p-[3px]"
            style={{ backgroundImage: IG_GRADIENT }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-paper p-1.5">
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
    }

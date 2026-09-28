import { DeveloperCredit } from './DeveloperCredit';

export function CompactFooter() {
  return (
    <footer className="border-t border-ink/10 bg-brand px-6 py-4 md:py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading text-base tracking-tight text-ink md:text-lg">
            Discovery of Coins
          </p>
          <p className="max-w-xs truncate font-sans text-[10px] font-light leading-snug text-ink/70 md:max-w-2xl md:text-xs">
            Authentic collectible banknotes, coins and stamps from Bangladesh and around the world.
          </p>
          <p className="mt-0.5 font-sans text-[9px] font-light tracking-wide text-ink/40">
            © {new Date().getFullYear()} Discovery of Coins. All rights reserved.
          </p>
        </div>
        {/* Developer logo + the three profile links (no popup) */}
        <DeveloperCredit
          className="shrink-0"
          logoClassName="h-8 w-8 md:h-9 md:w-9"
          showName={false}
          iconClassName="h-3.5 w-3.5"
        />
      </div>
    </footer>
  );
}

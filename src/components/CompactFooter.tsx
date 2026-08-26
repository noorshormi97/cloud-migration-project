import { DesignerCredit } from './DesignerCredit';

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
          <p className="mt-0.5 font-sans text-[10px] font-light uppercase tracking-widest text-ink/40">
            © {new Date().getFullYear()} Discovery of Coins. All rights reserved.
          </p>
        </div>
        {/* Designer logo — opens the designer note popup */}
        <DesignerCredit className="h-8 w-8 shrink-0 md:h-9 md:w-9" logoClassName="h-full w-full" />
      </div>
    </footer>
  );
}

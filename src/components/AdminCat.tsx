import { useEffect, useMemo, useState } from 'react';
import { Lottie } from 'lottie-react';
import catAnimation from '@/assets/admin-cat.json';

const GREETINGS = ['Hi! 👋', 'Welcome back!', 'Meow!', 'Hey admin!'] as const;

const TAB_MESSAGES: Record<string, readonly string[]> = {
  Orders: ['New orders to check? 👀', 'Someone is buying!', 'Status update time.'],
  Products: ['Fresh stock?', 'Adding new items?', 'Nice collection!'],
  'New Arrivals': ['New finds!', 'Ooh, new pieces.'],
  'Start Collecting': ['Great starters here.', 'Beginner picks!'],
  Categories: ['Sort it out!', 'Grouping nicely.'],
  Combos: ['Great combos!', 'Bundle time!'],
  FAQs: ['Good questions!', 'Help is here.'],
  'Contact Details': ['Say hello!', 'Keep in touch.'],
  Maintenance: ['Quiet time?', 'Maintenance mode on.'],
};

const RANDOM = [
  'Coffee break? ☕',
  'Purr-fect work!',
  'You got this!',
  'Someone called? 🐾',
  'Counting coins…',
  'Keep it up!',
] as const;

function pick(arr: readonly string[]): string {
  return arr[Math.floor(Math.random() * arr.length)] ?? arr[0] ?? 'Meow!';
}

export function AdminCat({ tab }: { tab: string }) {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState<string>(GREETINGS[0]);

  useEffect(() => {
    setMessage(pick(GREETINGS));
    const t = setTimeout(() => setOpen(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const tabMessages = useMemo(() => TAB_MESSAGES[tab] ?? null, [tab]);

  useEffect(() => {
    if (!tabMessages) return;
    setOpen(true);
    setMessage(pick(tabMessages));
    const t = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(t);
  }, [tab, tabMessages]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setMessage('Meow! 🐾');
        }}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-paper text-xl shadow-lg transition-transform hover:scale-105"
        aria-label="Show the cat"
        title="Open cat"
      >
        🐱
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="max-w-[220px] rounded-xl border border-ink/10 bg-paper px-3 py-2 font-sans text-sm font-light text-ink shadow-lg">
        {message}
      </div>

      <div className="flex items-end gap-1">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mb-1 h-6 w-6 rounded-full border border-ink/10 bg-paper text-sm text-ink/60 transition-colors hover:text-ink"
          aria-label="Hide cat"
          title="Hide"
        >
          ×
        </button>
        <div className="pointer-events-none h-24 w-24 select-none">
          <Lottie src={catAnimation} loop autoplay className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

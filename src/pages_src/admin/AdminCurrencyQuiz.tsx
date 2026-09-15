import { useCallback, useMemo, useState } from 'react';

type Entry = { country: string; currency: string };

const DATA: Entry[] = [
  { country: 'Bangladesh', currency: 'Taka' },
  { country: 'India', currency: 'Indian Rupee' },
  { country: 'Pakistan', currency: 'Pakistani Rupee' },
  { country: 'Sri Lanka', currency: 'Sri Lankan Rupee' },
  { country: 'Nepal', currency: 'Nepalese Rupee' },
  { country: 'Bhutan', currency: 'Ngultrum' },
  { country: 'Myanmar', currency: 'Kyat' },
  { country: 'Thailand', currency: 'Baht' },
  { country: 'Vietnam', currency: 'Dong' },
  { country: 'Cambodia', currency: 'Riel' },
  { country: 'Laos', currency: 'Kip' },
  { country: 'Malaysia', currency: 'Ringgit' },
  { country: 'Indonesia', currency: 'Indonesian Rupiah' },
  { country: 'Philippines', currency: 'Philippine Peso' },
  { country: 'Japan', currency: 'Yen' },
  { country: 'China', currency: 'Renminbi (Yuan)' },
  { country: 'South Korea', currency: 'South Korean Won' },
  { country: 'Mongolia', currency: 'Tugrik' },
  { country: 'Kazakhstan', currency: 'Tenge' },
  { country: 'Uzbekistan', currency: 'Uzbekistani Som' },
  { country: 'Afghanistan', currency: 'Afghani' },
  { country: 'Iran', currency: 'Iranian Rial' },
  { country: 'Iraq', currency: 'Iraqi Dinar' },
  { country: 'Saudi Arabia', currency: 'Saudi Riyal' },
  { country: 'United Arab Emirates', currency: 'UAE Dirham' },
  { country: 'Qatar', currency: 'Qatari Riyal' },
  { country: 'Kuwait', currency: 'Kuwaiti Dinar' },
  { country: 'Oman', currency: 'Omani Rial' },
  { country: 'Bahrain', currency: 'Bahraini Dinar' },
  { country: 'Israel', currency: 'Shekel' },
  { country: 'Turkey', currency: 'Turkish Lira' },
  { country: 'Russia', currency: 'Russian Ruble' },
  { country: 'Ukraine', currency: 'Hryvnia' },
  { country: 'Poland', currency: 'Zloty' },
  { country: 'Czech Republic', currency: 'Czech Koruna' },
  { country: 'Hungary', currency: 'Forint' },
  { country: 'Romania', currency: 'Leu' },
  { country: 'Bulgaria', currency: 'Lev' },
  { country: 'Sweden', currency: 'Swedish Krona' },
  { country: 'Norway', currency: 'Norwegian Krone' },
  { country: 'Denmark', currency: 'Danish Krone' },
  { country: 'Iceland', currency: 'Icelandic Krona' },
  { country: 'Switzerland', currency: 'Swiss Franc' },
  { country: 'United Kingdom', currency: 'Pound Sterling' },
  { country: 'Germany', currency: 'Euro' },
  { country: 'United States', currency: 'US Dollar' },
  { country: 'Canada', currency: 'Canadian Dollar' },
  { country: 'Mexico', currency: 'Mexican Peso' },
  { country: 'Brazil', currency: 'Real' },
  { country: 'Argentina', currency: 'Argentine Peso' },
  { country: 'Chile', currency: 'Chilean Peso' },
  { country: 'Peru', currency: 'Sol' },
  { country: 'Colombia', currency: 'Colombian Peso' },
  { country: 'Venezuela', currency: 'Bolivar' },
  { country: 'Costa Rica', currency: 'Colon' },
  { country: 'Guatemala', currency: 'Quetzal' },
  { country: 'Panama', currency: 'Balboa' },
  { country: 'Haiti', currency: 'Gourde' },
  { country: 'Egypt', currency: 'Egyptian Pound' },
  { country: 'Morocco', currency: 'Moroccan Dirham' },
  { country: 'Algeria', currency: 'Algerian Dinar' },
  { country: 'Tunisia', currency: 'Tunisian Dinar' },
  { country: 'Libya', currency: 'Libyan Dinar' },
  { country: 'Nigeria', currency: 'Naira' },
  { country: 'Ghana', currency: 'Cedi' },
  { country: 'Kenya', currency: 'Kenyan Shilling' },
  { country: 'Tanzania', currency: 'Tanzanian Shilling' },
  { country: 'Uganda', currency: 'Ugandan Shilling' },
  { country: 'Ethiopia', currency: 'Birr' },
  { country: 'South Africa', currency: 'Rand' },
  { country: 'Botswana', currency: 'Pula' },
  { country: 'Zambia', currency: 'Kwacha' },
  { country: 'Angola', currency: 'Kwanza' },
  { country: 'Madagascar', currency: 'Ariary' },
  { country: 'Australia', currency: 'Australian Dollar' },
  { country: 'New Zealand', currency: 'New Zealand Dollar' },
  { country: 'Fiji', currency: 'Fijian Dollar' },
  { country: 'Papua New Guinea', currency: 'Kina' },
  { country: 'Maldives', currency: 'Rufiyaa' },
  { country: 'Singapore', currency: 'Singapore Dollar' },
];

type Question = { country: string; answer: string; options: string[] };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz(): Question[] {
  return shuffle(DATA)
    .slice(0, 10)
    .map((entry) => {
      const distractors = shuffle(
        DATA.filter((d) => d.currency !== entry.currency).map((d) => d.currency),
      );
      const unique: string[] = [];
      for (const c of distractors) {
        if (!unique.includes(c)) unique.push(c);
        if (unique.length === 3) break;
      }
      return {
        country: entry.country,
        answer: entry.currency,
        options: shuffle([entry.currency, ...unique]),
      };
    });
}

export function AdminCurrencyQuiz() {
  const [quiz, setQuiz] = useState<Question[]>(() => buildQuiz());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = quiz[index];
  const total = quiz.length;

  const restart = useCallback(() => {
    setQuiz(buildQuiz());
    setIndex(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }, []);

  const verdict = useMemo(() => {
    if (score === total) return 'Flawless. You really do know your stock.';
    if (score >= 7) return 'Solid — a collector’s memory.';
    if (score >= 4) return 'Not bad, but the cabinet knows more than you.';
    return 'Time to re-read your own product descriptions.';
  }, [score, total]);

  const choose = (option: string) => {
    if (picked) return;
    setPicked(option);
    if (option === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    if (index + 1 >= total) setDone(true);
    else setIndex((i) => i + 1);
  };

  return (
    <div className="max-w-2xl">
      <div className="border border-ink/10 bg-paper p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="font-heading text-2xl tracking-tight text-ink">
              Currency Quiz
            </h3>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed text-ink/70">
              How well do you actually know the things you&apos;re selling?
            </p>
          </div>
          {!done ? (
            <span className="border border-ink/20 bg-brand/60 px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-widest text-ink/70">
              Question {index + 1}/{total}
            </span>
          ) : null}
        </div>

        {done ? (
          <div className="mt-8">
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              Final score
            </p>
            <p className="mt-2 font-heading text-4xl tracking-tight text-ink">
              {score} / {total}
            </p>
            <p className="mt-3 font-sans text-sm font-light text-ink/70">
              {verdict}
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-6 border border-ink bg-ink px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors hover:bg-transparent hover:text-ink"
            >
              Play again
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              What is the currency of
            </p>
            <p className="mt-2 font-heading text-3xl tracking-tight text-ink">
              {current.country}?
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {current.options.map((option) => {
                const isAnswer = option === current.answer;
                const isPicked = option === picked;
                const state = !picked
                  ? 'border-ink/20 text-ink hover:border-ink/40'
                  : isAnswer
                    ? 'border-ink bg-ink text-brand'
                    : isPicked
                      ? 'border-red-800 bg-red-50 text-red-800'
                      : 'border-ink/10 text-ink/40';
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={Boolean(picked)}
                    onClick={() => choose(option)}
                    className={`border px-4 py-2.5 text-left font-sans text-xs font-medium uppercase tracking-widest transition-colors disabled:cursor-default ${state}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="font-sans text-xs font-light text-ink/50">
                Score: {score}
              </p>
              <button
                type="button"
                disabled={!picked}
                onClick={next}
                className="border border-ink px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-brand disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                {index + 1 === total ? 'See score' : 'Next question'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

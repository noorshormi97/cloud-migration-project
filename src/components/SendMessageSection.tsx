import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchContactDetails } from '@/lib/content';

type CatState = 'sleeping' | 'awake' | 'delivering';

const EASE = [0.22, 1, 0.36, 1] as const;

function CabinetCat({ state }: { state: CatState }) {
  const awake = state !== 'sleeping';

  return (
    <motion.div
      className="pointer-events-none select-none"
      animate={
        state === 'delivering'
          ? { x: '140%', y: -6, opacity: 0 }
          : { x: 0, y: 0, opacity: 1 }
      }
      transition={{ duration: state === 'delivering' ? 1.1 : 0.5, ease: EASE }}
      aria-hidden="true"
    >
      <motion.div
        animate={
          state === 'sleeping'
            ? { y: [0, -2.5, 0] }
            : state === 'awake'
              ? { y: [0, -1.5, 0] }
              : { y: [0, -4, 0] }
        }
        transition={{
          duration: state === 'sleeping' ? 3.4 : state === 'awake' ? 2.2 : 0.32,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          viewBox="0 0 220 150"
          className="h-28 w-40 drop-shadow-[0_10px_18px_rgba(17,17,17,0.12)] sm:h-32 sm:w-48"
        >
          <defs>
            <linearGradient id="furBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d8b78a" />
              <stop offset="100%" stopColor="#b98f5e" />
            </linearGradient>
            <linearGradient id="furHead" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e3c69c" />
              <stop offset="100%" stopColor="#c69c69" />
            </linearGradient>
          </defs>

          {/* shadow */}
          <ellipse cx="110" cy="132" rx="72" ry="8" fill="#111111" opacity="0.08" />

          {/* tail */}
          <motion.path
            d="M40 118 C 8 118, 6 92, 26 86"
            stroke="#b98f5e"
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
            animate={
              awake
                ? { d: ['M40 118 C 8 116, 4 88, 30 80', 'M40 118 C 10 122, 2 96, 22 84'] }
                : { d: ['M40 118 C 8 118, 6 92, 26 86', 'M40 118 C 10 119, 8 96, 28 90'] }
            }
            transition={{
              duration: awake ? 0.9 : 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />

          {/* body */}
          <ellipse cx="112" cy="106" rx="66" ry="26" fill="url(#furBody)" />

          {/* head */}
          <motion.g
            animate={awake ? { rotate: 0, y: 0 } : { rotate: -8, y: 6 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ originX: '150px', originY: '86px' }}
          >
            {/* ears */}
            <path d="M126 60 L132 32 L152 52 Z" fill="#c69c69" />
            <path d="M129 56 L133 41 L145 53 Z" fill="#f0cfd0" />
            <path d="M186 58 L188 32 L166 48 Z" fill="#c69c69" />
            <path d="M183 55 L184 42 L172 50 Z" fill="#f0cfd0" />

            <ellipse cx="157" cy="76" rx="36" ry="31" fill="url(#furHead)" />

            {/* eyes */}
            {awake ? (
              <>
                <ellipse cx="144" cy="74" rx="6" ry="7" fill="#2b2118" />
                <ellipse cx="171" cy="74" rx="6" ry="7" fill="#2b2118" />
                <circle cx="146" cy="71.5" r="2" fill="#fffdf2" />
                <circle cx="173" cy="71.5" r="2" fill="#fffdf2" />
              </>
            ) : (
              <>
                <path
                  d="M138 75 q6 6 12 0"
                  stroke="#2b2118"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M165 75 q6 6 12 0"
                  stroke="#2b2118"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* muzzle */}
            <path d="M157 84 l-4.5 4 h9 Z" fill="#8d6242" />
            <path
              d="M157 88 q-6 7 -11 2 M157 88 q6 7 11 2"
              stroke="#8d6242"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="139" cy="87" r="6" fill="#f2d9b6" opacity="0.55" />
            <circle cx="176" cy="87" r="6" fill="#f2d9b6" opacity="0.55" />

            {/* whiskers */}
            <g stroke="#7a5638" strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
              <path d="M128 84 L108 80" />
              <path d="M128 89 L108 91" />
              <path d="M186 84 L206 80" />
              <path d="M186 89 L206 91" />
            </g>

            {/* letter carried in mouth while delivering */}
            <AnimatePresence>
              {state === 'delivering' ? (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <rect x="141" y="94" width="32" height="21" rx="3" fill="#fffdf2" stroke="#c9a86b" />
                  <path d="M141 96 l16 12 l16 -12" stroke="#c9a86b" fill="none" strokeWidth="1.4" />
                </motion.g>
              ) : null}
            </AnimatePresence>
          </motion.g>

          {/* paws */}
          <ellipse cx="92" cy="126" rx="15" ry="8" fill="#e3c69c" />
          <ellipse cx="128" cy="126" rx="15" ry="8" fill="#e3c69c" />

          {/* envelope resting by the paws */}
          {state !== 'delivering' ? (
            <g>
              <rect x="46" y="106" width="38" height="25" rx="3" fill="#fffdf2" stroke="#c9a86b" />
              <path d="M46 108 l19 14 l19 -14" stroke="#c9a86b" fill="none" strokeWidth="1.4" />
            </g>
          ) : null}

          {/* sleeping z's */}
          <AnimatePresence>
            {state === 'sleeping' ? (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                fill="#111111"
                fillOpacity="0.35"
                fontFamily="'Times New Roman', serif"
              >
                <motion.text
                  x="188"
                  y="34"
                  fontSize="14"
                  animate={{ y: [34, 24], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                >
                  z
                </motion.text>
                <motion.text
                  x="200"
                  y="24"
                  fontSize="18"
                  animate={{ y: [24, 12], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: 0.9, ease: 'easeOut' }}
                >
                  z
                </motion.text>
              </motion.g>
            ) : null}
          </AnimatePresence>
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function SendMessageSection() {
  const { data } = useQuery({
    queryKey: ['contact-details'],
    queryFn: fetchContactDetails,
  });

  const [message, setMessage] = useState('');
  const [catState, setCatState] = useState<CatState>('sleeping');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const rawNumber = (data?.whatsapp_number ?? '').replace(/[^\d]/g, '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      setError('Please write your message first.');
      return;
    }
    if (!rawNumber) {
      setError('WhatsApp is not configured yet. Please try again later.');
      return;
    }
    setError('');

    const body = encodeURIComponent(`Website Message\n\n${text}`);
    window.open(`https://wa.me/${rawNumber}?text=${body}`, '_blank', 'noopener,noreferrer');

    setCatState('delivering');
    window.setTimeout(() => {
      setSent(true);
      setMessage('');
    }, 900);
    window.setTimeout(() => {
      setCatState('sleeping');
    }, 1600);
  };

  return (
    <section className="bg-brand px-6 py-12 md:py-[4.25rem]">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-center"
        >
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-ink/60 md:mb-4 md:text-sm">
            Get in touch
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-ink md:text-5xl">
            Send Us a Message
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base font-light leading-relaxed tracking-wide text-ink/75 md:text-lg">
            Can’t find a particular note you’re looking for? Tell us which note you want and send
            us a message. We’ll be happy to help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="relative mt-10 md:mt-14"
        >
          <div className="flex justify-center overflow-hidden pb-1 md:justify-end md:pr-6">
            <CabinetCat state={catState} />
          </div>

          <div className="rounded-[10px] border border-ink/10 bg-paper p-5 md:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="py-6 text-center"
                >
                  <p className="font-heading text-2xl tracking-tight text-ink md:text-3xl">
                    Thank you for sending us a message!
                  </p>
                  <p className="mt-3 font-sans text-sm font-light text-ink/70">
                    We’ve opened WhatsApp with your note — send it there and we’ll reply shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 border border-ink px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-ink transition-colors duration-300 hover:bg-ink hover:text-brand"
                  >
                    Write another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <label
                    htmlFor="dc-message"
                    className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/55"
                  >
                    Your message
                  </label>
                  <textarea
                    id="dc-message"
                    rows={5}
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      setCatState(event.target.value.trim() ? 'awake' : 'sleeping');
                    }}
                    onFocus={() => {
                      if (message.trim()) setCatState('awake');
                    }}
                    placeholder="Looking for a particular note? Tell us what you’re looking for…"
                    className="mt-2 w-full resize-none rounded-2xl border border-ink/15 bg-brand/10 px-4 py-3.5 font-sans text-base font-light leading-relaxed text-ink outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-ink/40 hover:border-ink/30 focus:border-ink/60 focus:bg-paper focus:shadow-[0_8px_24px_-14px_rgba(17,17,17,0.35)]"
                  />

                  {error ? (
                    <p className="mt-2 font-sans text-xs text-red-700">{error}</p>
                  ) : null}

                  <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="font-sans text-xs font-light tracking-wide text-ink/55">
                      Your message opens directly in WhatsApp.
                    </p>
                    <motion.button
                      type="submit"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="w-full rounded-full border border-ink bg-ink px-8 py-3 font-sans text-xs font-medium uppercase tracking-widest text-brand transition-colors duration-300 hover:bg-transparent hover:text-ink sm:w-auto"
                    >
                      Send Message
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

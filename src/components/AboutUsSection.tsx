import { motion } from 'framer-motion';

const stats = [
  { value: '100%', label: 'HAND VERIFIED' },
  { value: '150+', label: 'COUNTRIES REPRESENTED' },
  { value: 'Always', label: 'COLLECTOR FOCUSED' },
  { value: '7 days', label: 'SUPPORT AVAILABLE' },
];

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group rounded-[10px] border border-ink/10 bg-paper p-5 md:p-6"
    >
      <p className="font-heading text-2xl tracking-tight text-ink md:text-3xl">
        {value}
      </p>
      <p className="mt-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink/60 md:text-xs">
        {label}
      </p>
    </motion.div>
  );
}

export function AboutUsSection() {
  return (
    <section className="bg-brand px-6 py-8 md:py-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.25em] text-ink/60 md:mb-4 md:text-sm">
            ABOUT US
          </p>
          <h2 className="font-heading text-3xl tracking-tight text-ink md:text-5xl">
            About Discovery of Coins
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-center font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:mt-8 md:text-lg"
        >
          Discovery of Coins is an authentic numismatic store based in{' '}
          <strong className="font-medium text-ink">Dhaka, Bangladesh</strong>, specializing in
          collectible coins, banknotes and stamps from Bangladesh and around the world. Every
          piece we offer is carefully verified, so collectors can buy with confidence and build
          collections they are proud to own.
        </motion.p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

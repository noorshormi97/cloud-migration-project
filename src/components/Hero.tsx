export function Hero() {
  return (
    <section id="about" className="relative flex min-h-[46vh] py-8 md:min-h-[62vh] md:py-12 items-center justify-center overflow-hidden bg-brand px-6">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="font-heading text-[clamp(3.5rem,12vw,10rem)] leading-[0.9] tracking-tight text-ink">
          Discovery
          <br />
          of Coins
        </h1>

        <p className="mx-auto mt-4 max-w-xl font-sans text-base font-light leading-relaxed tracking-wide text-ink/80 md:text-lg">
          Discover and collect authentic banknotes, coins, and stamps from
          Bangladesh and around the world.
        </p>
      </div>
    </section>
  );
}

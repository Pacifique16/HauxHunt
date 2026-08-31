import { HeroAtmosphere } from "./hero-atmosphere";
import { HeroStatement } from "./hero-statement";

/**
 * A cinematic pre-launch property stage: the architecture supplies atmosphere
 * while the centered promise and waitlist navigation keep the page focused on
 * one action.
 */
export function Hero() {
  return (
    <section className="bg-carbon-950 relative">
      <div className="hero-dark bg-canvas relative isolate min-h-svh w-full overflow-hidden px-5 pt-32 pb-10 sm:px-6 sm:pt-36 lg:px-11 lg:pt-40 lg:pb-12 xl:px-[52px]">
        <HeroAtmosphere />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-10.5rem)] w-full max-w-[1562px] items-center justify-center text-center lg:min-h-[calc(100svh-13rem)]">
          <HeroStatement />
        </div>
      </div>
    </section>
  );
}

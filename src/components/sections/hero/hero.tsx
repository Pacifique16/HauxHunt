import { HeroAtmosphere } from "./hero-atmosphere";
import { HeroStatement } from "./hero-statement";
import { HeroReveal } from "./hero-reveal";
import { SearchWorkspace } from "./search-workspace";

/**
 * A cinematic property stage inspired by editorial real-estate search: the
 * architecture supplies atmosphere, the promise sits in its quiet sky, and
 * the intelligent search surface anchors the composition near the lower edge.
 */
export function Hero() {
  return (
    <section className="bg-carbon-950 relative">
      <div className="hero-dark bg-canvas relative isolate min-h-svh w-full overflow-hidden px-5 pt-32 pb-10 sm:px-6 sm:pt-36 lg:px-11 lg:pt-40 lg:pb-12 xl:px-[52px]">
        <HeroAtmosphere />

        <div className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-center px-11 text-center lg:flex">
          <HeroStatement />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-10.5rem)] w-full max-w-[1562px] flex-col items-center lg:min-h-[calc(100svh-13rem)]">
          <div className="w-full text-center lg:hidden">
            <HeroStatement />
          </div>

          <div className="mt-auto w-full max-w-[1120px] pt-8 lg:pt-10">
            <HeroReveal delay={0.38}>
              <div className="theme-paper hero-search-glass rounded-[1.5rem]">
                <SearchWorkspace />
              </div>
            </HeroReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

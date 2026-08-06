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
    <section className="bg-canvas px-5 pt-28 pb-8 sm:px-6 sm:pt-32 lg:px-11 lg:pt-32 lg:pb-12 xl:px-[52px]">
      <div className="hero-dark bg-canvas relative isolate mx-auto min-h-[560px] max-w-[1562px] overflow-hidden rounded-[1.25rem] px-4 py-10 sm:px-8 lg:min-h-[520px] lg:rounded-[1.5rem] lg:px-12">
        <HeroAtmosphere />

        <div className="relative z-10 flex min-h-[480px] flex-col items-center lg:min-h-[440px]">
          <div className="w-full text-center">
            <HeroStatement />
          </div>

          <div className="mt-auto w-full max-w-[1120px] pt-8 lg:pt-10">
            <HeroReveal delay={0.38}>
              <div className="theme-paper rounded-[1.5rem]">
                <SearchWorkspace />
              </div>
            </HeroReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

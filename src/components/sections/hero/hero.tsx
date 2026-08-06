import { HeroAtmosphere } from "./hero-atmosphere";
import { HeroProof } from "./hero-proof";
import { HeroStatement } from "./hero-statement";
import { HeroReveal } from "./hero-reveal";
import { SearchWorkspace } from "./search-workspace";
import { resolveHeroImage } from "@/lib/hero-image";

/**
 * The HauxHunt hero.
 *
 * Composition, in one paragraph: the canvas is Dark Green from edge to edge.
 * The house occupies the lower-right and bleeds off both of those edges, its
 * sky dissolved and its upper-left corner evaporating diagonally into the
 * background — which opens a wedge of empty atmosphere running from the top
 * left down to the optical centre. Everything readable lives in that wedge, in
 * a single left-aligned column that stops well short of the right margin.
 * Nothing is centred. The eye enters top-left, falls through the statement,
 * lands on the workspace, and only then discovers the architecture behind it.
 *
 * Two objects carry the section and neither is allowed to win: the house is
 * large but low-contrast and out of focus in the hierarchy; the workspace is
 * small but is the sharpest, most solid, most detailed thing on screen. Mass
 * versus precision.
 *
 * `min-h-svh` rather than `100vh` — the small-viewport unit doesn't jump when
 * mobile browser chrome retracts, which is the single most common source of
 * hero layout shift.
 */
export function Hero() {
  const heroImage = resolveHeroImage();

  return (
    <section className="bg-canvas relative isolate flex min-h-svh flex-col overflow-hidden">
      <HeroAtmosphere src={heroImage} />

      {/* Vertical rhythm is tuned so the whole composition resolves inside
          1440×860 with slack to spare — the product has to be graspable with
          zero scroll. `justify-center` then distributes the remaining height
          above and below rather than letting it pool at the bottom. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-6 pt-28 pb-14 sm:px-10 lg:px-16 lg:pt-32 lg:pb-16">
        <div className="grid grid-cols-12 gap-x-6">
          {/* The statement stops at 7 of 12 columns. The 5 columns of air to
              its right are not empty space left over — they are where the
              roofline sits, and they are why the composition reads as one
              image rather than as text beside a picture. */}
          <div className="col-span-12 lg:col-span-7">
            <HeroStatement />
          </div>

          {/* The workspace is deliberately wider than the statement and set on
              a longer delay. Widening as the eye travels down pulls it forward
              in the hierarchy without giving it a border, a glow or a badge. */}
          <div className="col-span-12 mt-12 lg:col-span-9 lg:mt-14 xl:col-span-8">
            <HeroReveal delay={0.55}>
              <SearchWorkspace />
            </HeroReveal>
          </div>

          <div className="col-span-12 mt-8 lg:col-span-9 lg:mt-10">
            <HeroReveal delay={0.75}>
              <HeroProof />
            </HeroReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

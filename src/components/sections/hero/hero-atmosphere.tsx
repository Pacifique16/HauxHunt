"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type HeroAtmosphereProps = {
  /**
   * Resolved at render time by the server component — `null` when no hero
   * photograph has been supplied yet, in which case the atmosphere renders on
   * its own as a deep luminous field. That state is a designed fallback, not a
   * broken one: nothing shifts, nothing flashes, and dropping the file in
   * later changes only what sits inside the existing light.
   */
  src: string | null;
  /**
   * Focal point, as a CSS `object-position`.
   *
   * Only the vertical value does any work: the source is taller than the frame
   * in every breakpoint, so `cover` scales it to the frame's width and the
   * overflow is entirely vertical. 24% lands the visible window on roughly the
   * top 8%–75% of the source — a sliver of sky, the full building, and the top
   * of the gate — while leaving the driveway and road outside the frame
   * altogether. Those read as estate-agent photography and are the first thing
   * that would break the premium register.
   */
  focalPoint?: string;
};

/**
 * The house, bedded into the HauxHunt world.
 *
 * Anchored bottom-right and bleeding off both of those edges, so the eye reads
 * it as a fragment of something larger rather than a picture that was placed.
 * Its upper-left dissolves diagonally into Dark Green, opening a clear corridor
 * of atmosphere for the type and the workspace — the composition's negative
 * space is cut *out of the photograph*, not left beside it.
 *
 * The photo scrolls slower than the page (a small, honest parallax) and the
 * implied light source drifts on a 26s loop. Both are transform-only and both
 * stop entirely under `prefers-reduced-motion`.
 */
export function HeroAtmosphere({
  src,
  focalPoint = "50% 24%",
}: HeroAtmosphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Deliberately small. The photo lags the page by at most 56px across a full
  // hero scroll — enough to separate the planes, not enough to notice as an
  // effect. Scale holds a hair above 1 so the parallax never exposes an edge.
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.55]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* --- The photograph --------------------------------------------- */}
      <motion.div
        style={reducedMotion ? undefined : { y: photoY, opacity: photoOpacity }}
        className={[
          "absolute overflow-hidden",
          // Mobile: a 4:3 band across the bottom. The ratio is explicit rather
          // than a percentage of the section, because a percentage happened to
          // land within a point of the source's own 2:3 — at which `cover` has
          // nothing to crop, so the frame filled with sky and road and the
          // house ended up hidden behind the workspace. A landscape ratio
          // forces the vertical crop that puts the architecture in frame.
          "inset-x-0 bottom-0 aspect-[4/3]",
          // Desktop: anchored bottom-right, bleeding off both edges. The frame
          // is near-square rather than wide because the source is a portrait
          // elevation — a landscape crop of it would throw away the building
          // and keep the driveway.
          // Desktop/tablet: anchored bottom-right, bleeding off both edges.
          // The frame's height comes from its own width, never from the
          // viewport's. Tying it to viewport height made the frame taller than
          // the source's 2:3 on portrait tablets, at which point `cover` crops
          // sideways instead of vertically and the driveway and road come back
          // into shot. An aspect ratio keeps the crop identical everywhere.
          "md:inset-x-auto md:right-0 md:aspect-[9/8] md:w-[58%]",
          "lg:w-[56%]",
        ].join(" ")}
      >
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            // `priority` is deprecated as of Next 16. The documented
            // replacement for an above-the-fold hero is eager loading plus a
            // high fetch priority — preferred over `preload`, which would add
            // a <link> to <head> that competes with the CSS for early
            // bandwidth on the one request path that decides LCP.
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 58vw, 100vw"
            style={{ objectPosition: focalPoint }}
            className="hero-photo scale-[1.03] object-cover"
          />
        ) : null}

        {/* Sky dissolve, edge fades and vignette, in one stacked layer. */}
        <div className="hero-atmosphere absolute inset-0" />
      </motion.div>

      {/* --- Implied light source --------------------------------------- */}
      <div className="hero-bloom animate-light-drift absolute inset-0" />

      {/* --- Mobile-only reading scrim ----------------------------------
          On desktop the type sits in dissolved atmosphere and needs nothing.
          Below `md` the content stacks over the image band, so this guarantees
          the same contrast the palette was audited at. */}
      <div className="hero-scrim absolute inset-x-0 top-0 h-[62%] md:hidden" />
    </div>
  );
}

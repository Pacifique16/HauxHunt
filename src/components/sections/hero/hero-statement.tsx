"use client";

import { motion } from "framer-motion";

import { heroContainer, heroRise } from "./hero-motion";

const HEADLINE_LINES = ["The home you describe", "is the home you'll find."];

/**
 * The editorial type stack: eyebrow, two-line statement, one supporting
 * sentence.
 *
 * The headline is the product promise compressed to a single sentence broken
 * across two lines — describe it, find it. It never says "AI"; the claim is
 * about the outcome, and the workspace below demonstrates the mechanism.
 *
 * Lines are separate block elements rather than wrapped text so the break is
 * deterministic at every width, and each one carries its own reveal.
 */
export function HeroStatement() {
  return (
    <motion.div initial="hidden" animate="visible" variants={heroContainer}>
      <motion.p
        variants={heroRise}
        className="text-label text-fg-tertiary uppercase"
      >
        Verified rentals · Rwanda &amp; Nigeria
      </motion.p>

      <h1 className="text-display-xl text-fg mt-7">
        {HEADLINE_LINES.map((line, index) => (
          <motion.span key={line} variants={heroRise} className="block">
            {/* The second line carries the resolution, so it gets the lighter
                weight — the eye lands on the promise, then settles. */}
            <span className={index === 1 ? "text-fg-secondary" : undefined}>
              {line}
            </span>
          </motion.span>
        ))}
      </h1>

      <motion.p
        variants={heroRise}
        className="text-body-l text-fg-secondary mt-7 max-w-[46ch]"
      >
        Write it the way you&apos;d say it out loud. Every home you see has been
        verified before it reaches you — no ghost listings, no surprises at the
        door.
      </motion.p>
    </motion.div>
  );
}

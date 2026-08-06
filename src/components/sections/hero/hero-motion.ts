import type { Variants } from "framer-motion";

/**
 * The hero's shared motion vocabulary.
 *
 * Kept in its own module rather than exported alongside a component, so a file
 * containing React components never also exports plain values — that mix is
 * what forces Fast Refresh into a full page reload during development.
 *
 * One curve and one rhythm for the whole section: the entrance should read as
 * a single considered movement, not as several elements each animating on
 * their own terms. `MotionConfig reducedMotion="user"` in the root layout
 * neutralises every transform here, so no component needs its own guard.
 */

/** A long, decelerating ease. Nothing in this brand overshoots or bounces. */
export const heroEase = [0.16, 1, 0.3, 1] as const;

export const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const heroRise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: heroEase } },
};

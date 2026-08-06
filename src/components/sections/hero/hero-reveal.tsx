"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { heroEase } from "./hero-motion";

type HeroRevealProps = {
  children: ReactNode;
  /** Seconds. Keeps the hero's entrance one continuous movement. */
  delay?: number;
};

/**
 * Entrance wrapper for the hero's lower half.
 *
 * A separate node from whatever it wraps, so this one-shot transform can never
 * contend with a child's own transform — the reason the previous build's idle
 * float and entrance animation had to be split across two elements.
 *
 * No `whileInView` here: the hero is above the fold by definition, and a
 * scroll trigger on a first-paint element produces a flash of missing content
 * whenever the observer resolves a frame late.
 */
export function HeroReveal({ children, delay = 0 }: HeroRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: heroEase }}
    >
      {children}
    </motion.div>
  );
}

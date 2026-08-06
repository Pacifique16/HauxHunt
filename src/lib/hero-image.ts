import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Where the hero photograph lives. Drop the file at any of these paths and the
 * hero picks it up on the next render — no code change, no config entry.
 *
 * Resolution happens on the server at render time, so the client never learns
 * about the miss and the markup is identical either way: the atmosphere layers
 * are always present, and the photograph either sits inside them or doesn't.
 * That is why an absent image costs zero layout shift.
 */
const CANDIDATES = [
  "images/hero-home.jpg",
  "images/hero-home.jpeg",
  "images/hero-home.png",
  "images/hero-home.webp",
  "images/hero-home.avif",
];

export function resolveHeroImage(): string | null {
  for (const relative of CANDIDATES) {
    if (existsSync(path.join(process.cwd(), "public", relative))) {
      return `/${relative}`;
    }
  }
  return null;
}

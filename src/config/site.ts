/**
 * Central site configuration.
 *
 * Single source of truth for site-wide metadata, URLs, and navigation.
 * Import from here instead of hardcoding strings across pages/components.
 */

export const siteConfig = {
  name: "HauxHunt",
  title: "HauxHunt — Find a home you can trust",
  description:
    "Search in plain language, see verified listings, and understand exactly why each match fits — in Rwanda and Nigeria.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hauxhunt.com",
  ogImage: "/images/og.png",
  links: {
    twitter: "",
    github: "",
    linkedin: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Primary navigation items for the marketing site header.
 *
 * Only `/` exists so far — the other three routes are declared here ahead of
 * their pages so the nav is built against the real information architecture
 * rather than against placeholders that would have to be found and replaced
 * later. They will 404 until those pages are built.
 */
export const navConfig: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Contact", href: "/contact" },
  { label: "About us", href: "/about" },
];

/** Account actions, right-aligned in the header. */
export const authConfig = {
  login: { label: "Log in", href: "/login" },
  signup: { label: "Sign up", href: "/signup" },
} as const;

/**
 * Central site configuration.
 *
 * Single source of truth for site-wide metadata, URLs, and navigation.
 * Import from here instead of hardcoding strings across pages/components.
 */

export const siteConfig = {
  name: "HauxHunt",
  title: "HauxHunt",
  description: "",
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
 * Populate as marketing pages/sections are built.
 */
export const navConfig: { label: string; href: string }[] = [];

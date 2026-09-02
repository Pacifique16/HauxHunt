export const siteConfig = {
  name: "HauxHunt",
  title: "HauxHunt — Find a home you can trust",
  description:
    "Search in plain language, see verified listings, and understand exactly why each match fits — in Rwanda, Nigeria, and Kenya.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hauxhunt.com",
  ogImage: "/images/og.png",
} as const;

export type SiteConfig = typeof siteConfig;

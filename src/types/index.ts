/**
 * Shared, app-wide TypeScript types.
 *
 * Keep cross-cutting types here (e.g. nav items, CMS content shapes).
 * Component-local types should stay colocated with their component.
 */

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** Currency codes for HauxHunt's launch markets (UIUX Brief §3). */
export type CurrencyCode = "USD";

/**
 * One parsed criterion from a natural-language search query, shown as an
 * editable filter chip (UIUX Brief Flow 3B — "what we understood," not a
 * chat response).
 */
export type ParsedFilter = {
  id: string;
  kind:
    | "location"
    | "bedrooms"
    | "maxPrice"
    | "purpose"
    | "amenity"
    | "availability"
    | "custom";
  label: string;
  /** Set when the parser flagged this fragment as low-confidence/unclear. */
  unclear?: boolean;
};

/**
 * FlatMat connection lifecycle (src/Flatmate.md §8, §20):
 * locked → pending_sent/pending_received → accepted (or declined, which
 * returns the profile to a privacy-safe locked state).
 */
export type ConnectionState =
  | "locked"
  | "pending_sent"
  | "pending_received"
  | "accepted"
  | "declined";

/**
 * A person interested in the same listing, shown across FlatMat's discovery
 * feed, apartment "People interested" tiles, connections list, chat, and
 * profile preview. Identity fields (`realName`, `realAvatarSrc`) must only
 * ever be rendered when the connection for this profile is "accepted" —
 * see `PrivacyAwareAvatar` / `PrivacyAwareProfile` in src/components/flatmates.
 */
export type FlatmateProfile = {
  id: string;
  /** Matches an id in DEMO_LISTINGS (src/data/hero-search-demo.ts). */
  listingId: string;
  anonymizedName: string;
  realName: string;
  realAvatarSrc?: string;
  age: number;
  isVerified: boolean;
  bio: string;
  /** Short interest tags, e.g. "Music", "Running", "Coffee". */
  interests: string[];
  /**
   * Specific, non-numeric compatibility signals (deliberately no match %,
   * per src/Flatmate.md §5) — e.g. "Budget matches", "Moving in September",
   * "Non-smoker", "Prefers a quiet home".
   */
  signals: string[];
};

export type PropertyPreview = {
  id: string;
  title: string;
  location: string;
  currency: CurrencyCode;
  price: number;
  purpose: "rent" | "sale";
  bedrooms: number;
  amenities: string[];
  verified: boolean;
  /** 0–100. Computed against the visitor's current filters, not fixed. */
  matchPercentage: number;
  /** Short, specific reasoning — evidence, not a marketing claim (Creative Direction). */
  whyItMatches: string;
};

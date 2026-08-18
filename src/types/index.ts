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

/**
 * Owner/property-manager billing tier (Tenanthistory.md), read by
 * `usePartnerPlan` (src/components/partner/use-partner-plan.ts). "free"
 * owners see the `UpgradePaywallModal` for paid-only tools like tenant
 * history; "pro" owners get the real thing.
 */
export type PartnerPlan = "free" | "pro";

/**
 * Renter/tenant billing tier, read by `useTenantPlan`
 * (src/components/renter/use-tenant-plan.ts) and rendered by
 * `TenantPricingPlans`. Mirrors `PartnerPlan`'s free/pro split on the owner
 * side — "free" tenants see capped agent contacts and standard viewing
 * fees, "paid" tenants get unlimited messaging, the map/reviews tools, and
 * a lower viewing-fee cap.
 */
export type TenantPlan = "free" | "paid";

/**
 * Where a tenant application sits in the owner's review workflow
 * (Tenanthistory.md). Not a strict funnel — an application can move
 * straight from "new" to "approved"/"declined".
 */
export type ApplicationStatus =
  | "new"
  | "under_review"
  | "ready_for_decision"
  | "approved"
  | "declined";

/**
 * A renter's application to a listing, shown on the partner dashboard's
 * Applications view (Tenanthistory.md). `propertyId` matches a
 * `PORTFOLIO_LISTINGS` title in dashboard-route-page.tsx — that dataset has
 * no separate id field, so (as with the rest of that file) the title is
 * the key.
 */
export type TenantApplication = {
  id: string;
  applicantId: string;
  applicantName: string;
  propertyId: string;
  propertyTitle: string;
  monthlyRent: string;
  status: ApplicationStatus;
  submittedAgo: string;
  occupation: string;
  monthlyIncome: string;
  moveInDate: string;
  /** Names of other people on the same application, if any. */
  coApplicants?: string[];
};

/**
 * One previous tenancy on an applicant's rental record, as shown in
 * `TenantHistoryDrawer` (Tenanthistory.md §4).
 */
export type TenantStay = {
  propertyTitle: string;
  location: string;
  durationMonths: number;
  /** 1–5. */
  landlordRating: number;
  landlordComment: string;
};

/**
 * An applicant's tenant history — previous stays, on-time payment
 * reliability, and past landlord feedback (Tenanthistory.md §4). Renters
 * with no rental history (e.g. first-time renters) simply have no entry;
 * `TenantHistoryDrawer` renders an empty state rather than a zeroed-out one.
 */
export type TenantHistoryRecord = {
  applicantId: string;
  applicantName: string;
  totalMonthsRented: number;
  propertiesRented: number;
  /** 0–100. */
  onTimePaymentRate: number;
  stays: TenantStay[];
};

export type PayoutStatus = "paid" | "pending" | "failed";

/**
 * One in-app rent payout on the "Rent collected" KPI card's destination,
 * `/partner-dashboard/finance` (KPI.md).
 */
export type PayoutRecord = {
  id: string;
  date: string;
  propertyTitle: string;
  tenantName: string;
  amount: string;
  status: PayoutStatus;
};

export type BillingScheduleStatus = "active" | "paused";

/**
 * One tenant's recurring in-app rent schedule, shown on the Finance page's
 * "Active Billing Schedules" tab (KPI.md).
 */
export type BillingSchedule = {
  id: string;
  tenantName: string;
  propertyTitle: string;
  monthlyRent: string;
  nextDueDate: string;
  status: BillingScheduleStatus;
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

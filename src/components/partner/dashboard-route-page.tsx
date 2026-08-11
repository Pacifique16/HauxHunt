"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Bath,
  Bell,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Expand,
  LayoutGrid,
  List,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  ShieldCheck,
  Sofa,
  X,
  type LucideIcon,
} from "lucide-react";

import type { ApplicationStatus } from "@/types";
import { DashboardShell } from "@/components/partner/dashboard-shell";
import { usePartnerRole } from "@/components/partner/use-partner-role";
import { ListingOptionsMenu } from "@/components/partner/listing-options-menu";
import { ApplicationCard } from "@/components/partner/application-card";
import { TENANT_APPLICATIONS } from "@/data/tenant-applications-demo";
import houseOne from "../../../house1.jpg";
import houseTwo from "../../../house2.jpg";
import houseThree from "../../../house3.jpg";
import houseFour from "../../../house4.jpg";
import houseFive from "../../../house5.jpg";
import houseSix from "../../../house6.jpeg";
import noDataIllustration from "../../../empty.png";

type ListingStatus = "Live" | "In review" | "Draft" | "Archived";

type PortfolioListing = {
  title: string;
  location: string;
  price: string;
  status: ListingStatus;
  updated: string;
  image: StaticImageData;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean | null;
};

const PORTFOLIO_LISTINGS: PortfolioListing[] = [
  {
    title: "Modern 3-bedroom house",
    location: "Kacyiru, Kigali",
    price: "USD 830 / month",
    status: "Live",
    updated: "08 Aug 2026",
    image: houseOne,
    bedrooms: 3,
    bathrooms: 2,
    area: 168,
    furnished: true,
  },
  {
    title: "Furnished city apartment",
    location: "Kigali City Centre",
    price: "USD 590 / month",
    status: "In review",
    updated: "08 Aug 2026",
    image: houseTwo,
    bedrooms: 2,
    bathrooms: 2,
    area: 94,
    furnished: true,
  },
  {
    title: "Untitled property draft",
    location: "Location not added",
    price: "Price not added",
    status: "Draft",
    updated: "08 Aug 2026",
    image: houseThree,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    furnished: null,
  },
  {
    title: "Family home with garden",
    location: "Gacuriro, Kigali",
    price: "USD 128,000",
    status: "Live",
    updated: "06 Aug 2026",
    image: houseFour,
    bedrooms: 4,
    bathrooms: 3,
    area: 240,
    furnished: false,
  },
  {
    title: "Compact studio apartment",
    location: "Nyarutarama, Kigali",
    price: "USD 290 / month",
    status: "Archived",
    updated: "01 Aug 2026",
    image: houseFive,
    bedrooms: 1,
    bathrooms: 1,
    area: 48,
    furnished: true,
  },
  {
    title: "Bright two-bedroom apartment",
    location: "Kilimani, Nairobi",
    price: "USD 720 / month",
    status: "Live",
    updated: "01 Aug 2026",
    image: houseOne,
    bedrooms: 2,
    bathrooms: 2,
    area: 102,
    furnished: true,
  },
  {
    title: "Quiet suburban townhouse",
    location: "Kibagabaga, Kigali",
    price: "USD 940 / month",
    status: "In review",
    updated: "01 Aug 2026",
    image: houseTwo,
    bedrooms: 3,
    bathrooms: 3,
    area: 186,
    furnished: false,
  },
  {
    title: "City-view penthouse",
    location: "Westlands, Nairobi",
    price: "USD 1,850 / month",
    status: "Live",
    updated: "30 Jul 2026",
    image: houseThree,
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    furnished: true,
  },
  {
    title: "Garden duplex",
    location: "Lekki, Lagos",
    price: "USD 2,100 / month",
    status: "Draft",
    updated: "29 Jul 2026",
    image: houseFour,
    bedrooms: 4,
    bathrooms: 4,
    area: 265,
    furnished: false,
  },
  {
    title: "Lake-view residence",
    location: "Gisenyi, Rwanda",
    price: "USD 680 / month",
    status: "Live",
    updated: "25 Jul 2026",
    image: houseFive,
    bedrooms: 2,
    bathrooms: 2,
    area: 124,
    furnished: true,
  },
  {
    title: "Modern family villa",
    location: "Maitama, Abuja",
    price: "USD 2,650 / month",
    status: "Archived",
    updated: "25 Jul 2026",
    image: houseOne,
    bedrooms: 5,
    bathrooms: 5,
    area: 340,
    furnished: false,
  },
  {
    title: "Serviced one-bedroom suite",
    location: "Kacyiru, Kigali",
    price: "USD 520 / month",
    status: "Live",
    updated: "18 Jul 2026",
    image: houseTwo,
    bedrooms: 1,
    bathrooms: 1,
    area: 68,
    furnished: true,
  },
  {
    title: "Spacious four-bedroom home",
    location: "Karen, Nairobi",
    price: "USD 2,300 / month",
    status: "In review",
    updated: "18 Jul 2026",
    image: houseThree,
    bedrooms: 4,
    bathrooms: 4,
    area: 298,
    furnished: false,
  },
  {
    title: "Waterfront apartment",
    location: "Ikoyi, Lagos",
    price: "USD 1,700 / month",
    status: "Live",
    updated: "08 Jul 2026",
    image: houseFour,
    bedrooms: 3,
    bathrooms: 3,
    area: 184,
    furnished: true,
  },
  {
    title: "Courtyard family house",
    location: "Nyarutarama, Kigali",
    price: "USD 1,120 / month",
    status: "Draft",
    updated: "08 Jul 2026",
    image: houseFive,
    bedrooms: 3,
    bathrooms: 2,
    area: 192,
    furnished: false,
  },
];

const LIVE_LISTING_PERFORMANCE: Record<
  string,
  { views: number; saves: number; enquiries: number; viewingRequests: number }
> = {
  "Modern 3-bedroom house": {
    views: 1248,
    saves: 118,
    enquiries: 31,
    viewingRequests: 14,
  },
  "Family home with garden": {
    views: 742,
    saves: 67,
    enquiries: 18,
    viewingRequests: 8,
  },
  "Bright two-bedroom apartment": {
    views: 382,
    saves: 29,
    enquiries: 8,
    viewingRequests: 4,
  },
  "City-view penthouse": {
    views: 615,
    saves: 54,
    enquiries: 15,
    viewingRequests: 6,
  },
  "Lake-view residence": {
    views: 418,
    saves: 31,
    enquiries: 9,
    viewingRequests: 4,
  },
  "Serviced one-bedroom suite": {
    views: 268,
    saves: 19,
    enquiries: 5,
    viewingRequests: 2,
  },
  "Waterfront apartment": {
    views: 229,
    saves: 16,
    enquiries: 4,
    viewingRequests: 2,
  },
};

const LISTING_PERFORMANCE_PERIODS: Record<string, number> = {
  "Last 7 days": 0.24,
  "Last 30 days": 1,
  "Last 90 days": 2.92,
  "This year": 10.8,
};

const LOCATION_COORDINATES: Record<string, [number, number]> = {
  Kigali: [-1.9441, 30.0619],
  Nairobi: [-1.2864, 36.8172],
  Lagos: [6.5244, 3.3792],
  Abuja: [9.0765, 7.3986],
  Gisenyi: [-1.7028, 29.2564],
};

function getListingDetails(listing: (typeof PORTFOLIO_LISTINGS)[number]) {
  const coordinateKey = Object.keys(LOCATION_COORDINATES).find((place) =>
    listing.location.includes(place),
  );
  const [latitude, longitude] = coordinateKey
    ? LOCATION_COORDINATES[coordinateKey]
    : LOCATION_COORDINATES.Kigali;
  const isApartment = /apartment|studio|penthouse|suite/i.test(listing.title);

  return {
    type: isApartment ? "Apartment" : "House",
    purpose: "For rent",
    availableFrom: listing.status === "Live" ? "Available now" : "On approval",
    minimumStay: "12 months",
    exactAddress: `${listing.location} · Property entrance verified`,
    latitude,
    longitude,
    amenities: [
      "Parking",
      "Security",
      "Backup power",
      "Water tank",
      "Hot water",
      "Fibre internet",
      ...(listing.furnished ? ["Fitted kitchen", "Built-in wardrobes"] : []),
      ...(listing.bedrooms >= 3 ? ["Garden", "Staff quarters"] : ["Balcony"]),
    ],
  };
}

const SECTIONS = {
  listings: {
    title: "Portfolio & listings",
    description: "Create, review, and manage every property in your portfolio.",
    icon: Building2,
    action: {
      label: "Add property",
      href: "/partner-dashboard/listings/new",
      icon: Plus,
    },
    stats: [
      ["Live listings", "12"],
      ["In review", "2"],
      ["Saved drafts", "3"],
    ],
  },
  performance: {
    title: "Listing performance",
    description:
      "Understand how property seekers discover and respond to your listings.",
    icon: BarChart3,
    stats: [
      ["Listing views", "4,286"],
      ["Saves", "386"],
      ["Viewing requests", "42"],
    ],
  },
  enquiries: {
    title: "Enquiries & calendar",
    description: "Reply to enquiries and organize upcoming property viewings.",
    icon: CalendarDays,
    stats: [
      ["New enquiries", "7"],
      ["Upcoming viewings", "5"],
      ["Awaiting confirmation", "3"],
    ],
  },
  applications: {
    title: "Applications",
    description:
      "Review applicants and co-applicants together in one workspace.",
    icon: ClipboardCheck,
    stats: [
      ["New applications", "8"],
      ["Under review", "5"],
      ["Ready for decision", "3"],
    ],
  },
  messages: {
    title: "Messages",
    description:
      "Keep property conversations clear, organized, and easy to follow.",
    icon: MessageSquare,
    stats: [
      ["Unread", "4"],
      ["Active conversations", "12"],
      ["Archived", "28"],
    ],
  },
  notifications: {
    title: "Notifications",
    description:
      "See important listing, enquiry, application, and account updates.",
    icon: Bell,
    stats: [
      ["Unread", "6"],
      ["Today", "9"],
      ["This week", "24"],
    ],
  },
  verification: {
    title: "Verification",
    description:
      "Complete verification to build trust and unlock every partner tool.",
    icon: ShieldCheck,
    stats: [
      ["Progress", "80%"],
      ["Completed steps", "4"],
      ["Remaining steps", "1"],
    ],
  },
} as const;

export type DashboardSection = keyof typeof SECTIONS;

// Computed from the applications demo dataset rather than hardcoded, so the
// header KPI cards never drift from what `AllApplications` actually lists
// below them (Tenanthistory.md).
const APPLICATION_STATUS_COUNTS = {
  new: TENANT_APPLICATIONS.filter((application) => application.status === "new").length,
  underReview: TENANT_APPLICATIONS.filter(
    (application) => application.status === "under_review",
  ).length,
  readyForDecision: TENANT_APPLICATIONS.filter(
    (application) => application.status === "ready_for_decision",
  ).length,
};

export function DashboardRoutePage({ section }: { section: DashboardSection }) {
  const content = SECTIONS[section];
  const role = usePartnerRole();
  const isAgent = role === "agent";
  const roleTitle = isAgent
    ? section === "listings"
      ? "Listings & mandates"
      : section === "enquiries"
        ? "Leads & calendar"
        : section === "applications"
          ? "Deals"
          : content.title
    : content.title;
  const roleDescription = isAgent
    ? section === "listings"
      ? "Manage the properties you are authorized to market and track every owner mandate."
      : section === "enquiries"
        ? "Qualify renter leads and organize property visits."
        : section === "applications"
          ? "Move qualified prospects from viewing to signed agreement and commission."
          : content.description
    : content.description;
  const roleStats: ReadonlyArray<readonly [string, string]> =
    isAgent && section === "enquiries"
      ? [
          ["New leads", "7"],
          ["Visits scheduled", "5"],
          ["Awaiting follow-up", "3"],
        ]
      : isAgent && section === "applications"
        ? [
            ["Active deals", String(TENANT_APPLICATIONS.length)],
            ["Negotiating", String(APPLICATION_STATUS_COUNTS.underReview)],
            ["Ready to close", String(APPLICATION_STATUS_COUNTS.readyForDecision)],
          ]
        : section === "applications"
          ? [
              ["New applications", String(APPLICATION_STATUS_COUNTS.new)],
              ["Under review", String(APPLICATION_STATUS_COUNTS.underReview)],
              ["Ready for decision", String(APPLICATION_STATUS_COUNTS.readyForDecision)],
            ]
          : content.stats;
  const Icon = content.icon;
  const action = "action" in content ? content.action : null;

  return (
    <DashboardShell initialSection={section}>
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="flex flex-col gap-6 border-b border-black/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full">
              {section !== "listings" && section !== "verification" ? (
                <span className="flex size-12 items-center justify-center rounded-full bg-black text-white">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              ) : null}
              <h1
                className={`dashboard-page-title text-carbon-900 ${section !== "listings" && section !== "verification" ? "mt-6" : ""}`}
              >
                {roleTitle}
              </h1>
              <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
                {roleDescription}
              </p>
            </div>
            {action ? (
              <Link
                href={action.href}
                className="font-bricolage inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80 lg:self-auto"
              >
                <action.icon aria-hidden="true" className="size-4" />
                {action.label}
              </Link>
            ) : null}
          </header>

          {section !== "listings" ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {roleStats.map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.045)]"
                >
                  <p className="text-carbon-500 text-sm">{label}</p>
                  <p className="font-bricolage text-carbon-900 mt-5 text-4xl font-medium tracking-[-0.045em]">
                    {value}
                  </p>
                </article>
              ))}
            </div>
          ) : null}

          {section === "listings" ? (
            <AllListings />
          ) : section === "applications" ? (
            <AllApplications isAgent={isAgent} />
          ) : (
            <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.055)] sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
                    Recent activity
                  </h2>
                  <p className="text-carbon-500 mt-2 text-sm">
                    Your latest {roleTitle.toLowerCase()} updates will appear
                    here.
                  </p>
                </div>
                <ArrowUpRight aria-hidden="true" className="size-5" />
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <ActivityItem icon={CheckCircle2} label="Completed" />
                <ActivityItem icon={Clock3} label="Needs attention" />
                <ActivityItem icon={Icon} label="Recently updated" />
              </div>
            </section>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

function AllListings() {
  const [status, setStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [view, setView] = useState<"list" | "cards">("list");
  const [page, setPage] = useState(1);
  const [deletedListings, setDeletedListings] = useState<string[]>([]);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, ListingStatus>
  >({});
  const [actionFeedback, setActionFeedback] = useState("");
  const [topBarStatusHost, setTopBarStatusHost] = useState<HTMLElement | null>(
    null,
  );
  const [previewListing, setPreviewListing] = useState<
    (typeof PORTFOLIO_LISTINGS)[number] | null
  >(null);
  const availableListings = PORTFOLIO_LISTINGS.filter(
    (listing) => !deletedListings.includes(listing.title),
  ).map((listing) => ({
    ...listing,
    status: statusOverrides[listing.title] ?? listing.status,
    updated:
      statusOverrides[listing.title] === "In review"
        ? "08 Aug 2026"
        : listing.updated,
  }));
  const filteredListings =
    status === "All"
      ? availableListings
      : availableListings.filter((listing) => listing.status === status);
  const listings = [...filteredListings].sort((first, second) => {
    const firstIndex =
      statusOverrides[first.title] === "In review"
        ? -1
        : PORTFOLIO_LISTINGS.findIndex(
            (listing) => listing.title === first.title,
          );
    const secondIndex =
      statusOverrides[second.title] === "In review"
        ? -1
        : PORTFOLIO_LISTINGS.findIndex(
            (listing) => listing.title === second.title,
          );
    return sortOrder === "newest"
      ? firstIndex - secondIndex
      : secondIndex - firstIndex;
  });
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(listings.length / pageSize));
  const paginatedListings = listings.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function deleteListing(title: string) {
    setDeletedListings((current) => [...current, title]);
    setPage(1);
  }

  function unarchiveListing(title: string) {
    setStatusOverrides((current) => ({ ...current, [title]: "In review" }));
    setActionFeedback("Listing unarchived");
  }

  function archiveListing(title: string) {
    setStatusOverrides((current) => ({ ...current, [title]: "Archived" }));
    setActionFeedback("Listing archived");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTitle = params.get("listing");
    const requestedListing = PORTFOLIO_LISTINGS.find(
      (listing) => listing.title === requestedTitle,
    );
    if (!requestedListing) return;
    const requestedAction = params.get("action");
    if (requestedAction === "archive" || requestedAction === "delete") {
      const applyAction = window.setTimeout(() => {
        if (requestedAction === "archive") {
          setStatusOverrides((current) => ({
            ...current,
            [requestedListing.title]: "Archived",
          }));
          setActionFeedback("Listing archived");
        } else {
          setDeletedListings((current) => [...current, requestedListing.title]);
        }
        window.history.replaceState({}, "", "/partner-dashboard/listings");
      }, 0);
      return () => window.clearTimeout(applyAction);
    }
    if (params.get("mode") !== "view") return;
    const openPreview = window.setTimeout(
      () => setPreviewListing(requestedListing),
      0,
    );
    return () => window.clearTimeout(openPreview);
  }, []);

  useEffect(() => {
    const connectHost = window.setTimeout(
      () => setTopBarStatusHost(document.body),
      0,
    );
    return () => window.clearTimeout(connectHost);
  }, []);

  useEffect(() => {
    if (!actionFeedback) return;
    const timer = window.setTimeout(() => setActionFeedback(""), 3000);
    return () => window.clearTimeout(timer);
  }, [actionFeedback]);

  if (previewListing) {
    return (
      <InlineListingPreview
        listing={previewListing}
        onClose={() => setPreviewListing(null)}
      />
    );
  }

  return (
    <div className="mt-8">
      {topBarStatusHost
        ? createPortal(
            <AnimatePresence>
              {actionFeedback ? (
                <motion.div
                  key={actionFeedback}
                  role="status"
                  initial={{ opacity: 0, y: 22, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed bottom-6 left-1/2 z-[120] min-w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-black px-5 py-4 text-center text-sm font-medium whitespace-nowrap text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]"
                >
                  {actionFeedback}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>,
            topBarStatusHost,
          )
        : null}
      <header className="flex items-end justify-between gap-5">
        <div>
          <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
            All listings
          </h2>
          <p className="text-carbon-500 mt-2 text-sm">
            Every property listing in your account.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-carbon-500 mr-2 text-sm whitespace-nowrap">
            Results:
            <span className="ml-1 font-medium text-black">
              {listings.length.toLocaleString()}
            </span>
          </p>
          <div className="flex h-11 items-center rounded-full bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex size-9 items-center justify-center rounded-full ${view === "list" ? "bg-black text-white" : "text-black/50 hover:text-black"}`}
            >
              <List aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("cards")}
              aria-label="Card view"
              aria-pressed={view === "cards"}
              className={`flex size-9 items-center justify-center rounded-full ${view === "cards" ? "bg-black text-white" : "text-black/50 hover:text-black"}`}
            >
              <LayoutGrid aria-hidden="true" className="size-4" />
            </button>
          </div>
          <label className="relative block shrink-0">
            <span className="sr-only">Filter listings by status</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
            >
              <option>All</option>
              <option>Live</option>
              <option>In review</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
            />
          </label>
          <label className="relative block shrink-0">
            <span className="sr-only">Sort listings by date</span>
            <select
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value as "newest" | "oldest");
                setPage(1);
              }}
              className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
            />
          </label>
        </div>
      </header>
      {listings.length === 0 ? (
        <section className="mt-5 flex min-h-[430px] flex-col items-center justify-center bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
          <Image
            src={noDataIllustration}
            alt="No listings found"
            className="h-40 w-auto object-contain"
          />
          <h3 className="font-bricolage text-carbon-900 mt-5 text-2xl font-medium">
            {status === "All"
              ? "No listings yet"
              : `No ${status.toLowerCase()} listings`}
          </h3>
          <p className="text-carbon-500 mt-2 max-w-md text-sm leading-6">
            {status === "All"
              ? "Add a property to begin building your portfolio."
              : `There are currently no listings matching the ${status} filter.`}
          </p>
          {status === "All" ? (
            <Link
              href="/partner-dashboard/listings/new"
              className="font-bricolage mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add property
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setStatus("All");
                setPage(1);
              }}
              className="font-bricolage mt-6 h-11 rounded-full bg-black px-5 text-sm font-medium text-white"
            >
              Show all listings
            </button>
          )}
        </section>
      ) : view === "list" ? (
        <section className="mt-5 overflow-visible bg-white px-6 shadow-[0_18px_55px_rgba(0,0,0,0.055)] sm:px-8">
          <div className="divide-y divide-black/8">
            {paginatedListings.map((listing) => (
              <article
                key={listing.title}
                role="button"
                tabIndex={0}
                aria-label={`View ${listing.title}`}
                onClick={() => setPreviewListing(listing)}
                onKeyDown={(event) => {
                  if (
                    event.currentTarget === event.target &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    setPreviewListing(listing);
                  }
                }}
                className="grid cursor-pointer gap-4 py-5 transition-colors hover:bg-black/[0.025] focus-visible:bg-black/[0.035] focus-visible:outline-none sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <h3 className="font-bricolage text-carbon-900 truncate font-medium">
                    {listing.title}
                  </h3>
                  <p className="text-carbon-500 mt-1 text-sm">
                    {listing.location} · {listing.price}
                  </p>
                  <p className="text-carbon-400 mt-1 text-xs">
                    {listing.updated}
                  </p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                    listing.status === "Live"
                      ? "bg-black text-white"
                      : listing.status === "In review"
                        ? "bg-black/10 text-black"
                        : "border border-black/12 text-black"
                  }`}
                >
                  {listing.status}
                </span>
                <div
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <ListingOptionsMenu
                    title={listing.title}
                    status={listing.status}
                    onView={() => setPreviewListing(listing)}
                    onDelete={() => deleteListing(listing.title)}
                    onUnarchive={() => unarchiveListing(listing.title)}
                    onArchive={() => archiveListing(listing.title)}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paginatedListings.map((listing) => (
            <article
              key={listing.title}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_14px_38px_rgba(0,0,0,0.055)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <button
                  type="button"
                  onClick={() => setPreviewListing(listing)}
                  aria-label={`View ${listing.title}`}
                  className="absolute inset-0 z-10 cursor-pointer"
                />
                <span
                  className={`pointer-events-none absolute top-4 left-4 z-20 w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                    listing.status === "Live"
                      ? "bg-black text-white"
                      : listing.status === "In review"
                        ? "bg-white/90 text-black backdrop-blur-sm"
                        : "border border-white/30 bg-black/45 text-white backdrop-blur-sm"
                  }`}
                >
                  {listing.status}
                </span>
              </div>
              <div className="absolute top-3 right-3 z-30 rounded-full bg-white/90 backdrop-blur-sm">
                <ListingOptionsMenu
                  title={listing.title}
                  status={listing.status}
                  onView={() => setPreviewListing(listing)}
                  onDelete={() => deleteListing(listing.title)}
                  onUnarchive={() => unarchiveListing(listing.title)}
                  onArchive={() => archiveListing(listing.title)}
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bricolage text-carbon-900 text-xl leading-tight font-medium tracking-[-0.025em]">
                      {listing.title}
                    </h3>
                    <p className="text-carbon-500 mt-2 flex items-center gap-1.5 text-sm">
                      <MapPin aria-hidden="true" className="size-4 shrink-0" />
                      {listing.location}
                    </p>
                  </div>
                  <p className="text-carbon-900 shrink-0 text-right text-sm font-medium">
                    {listing.price}
                  </p>
                </div>
                <div className="text-carbon-500 mt-5 flex items-center justify-between gap-2 border-t border-black/8 pt-4 text-xs">
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <BedDouble aria-hidden="true" className="size-4" />
                    {listing.bedrooms || "—"} beds
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Bath aria-hidden="true" className="size-4" />
                    {listing.bathrooms || "—"} baths
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Expand aria-hidden="true" className="size-4" />
                    {listing.area ? `${listing.area} m²` : "Not added"}
                  </span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Sofa aria-hidden="true" className="size-4" />
                    {listing.furnished === null
                      ? "Not added"
                      : listing.furnished
                        ? "Furnished"
                        : "Unfurnished"}
                  </span>
                </div>
                <p className="text-carbon-400 mt-4 text-xs">
                  {listing.updated}
                </p>
              </div>
            </article>
          ))}
        </section>
      )}
      {totalPages > 1 ? (
        <nav
          aria-label="Listings pagination"
          className="mt-7 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={page === pageNumber ? "page" : undefined}
                className={`flex size-10 items-center justify-center rounded-full text-sm font-medium ${page === pageNumber ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"}`}
              >
                {pageNumber}
              </button>
            ),
          )}
        </nav>
      ) : null}
    </div>
  );
}

const APPLICATION_STATUS_FILTERS = [
  "All",
  "New",
  "Under review",
  "Ready for decision",
  "Approved",
  "Declined",
] as const;

function statusFilterMatches(filter: string, status: ApplicationStatus): boolean {
  if (filter === "All") return true;
  return STATUS_FILTER_TO_STATUS[filter] === status;
}

const STATUS_FILTER_TO_STATUS: Record<string, ApplicationStatus> = {
  New: "new",
  "Under review": "under_review",
  "Ready for decision": "ready_for_decision",
  Approved: "approved",
  Declined: "declined",
};

/**
 * The Applications view's real content (Tenanthistory.md) — a decision-
 * ready `ApplicationCard` per applicant, replacing the section's previous
 * generic "Recent activity" placeholder. Decisions are kept as local state
 * only, same no-backend approach as `AllListings`' archive/delete actions.
 */
function AllApplications({ isAgent }: { isAgent: boolean }) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApplicationStatus>>({});

  const applications = TENANT_APPLICATIONS.map((application) => ({
    ...application,
    status: statusOverrides[application.id] ?? application.status,
  })).filter((application) => statusFilterMatches(statusFilter, application.status));

  function decide(applicationId: string, status: ApplicationStatus) {
    setStatusOverrides((current) => ({ ...current, [applicationId]: status }));
  }

  return (
    <div className="mt-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
            {isAgent ? "All deals" : "All applications"}
          </h2>
          <p className="text-carbon-500 mt-2 text-sm">
            {applications.length} {applications.length === 1 ? "result" : "results"}.
          </p>
        </div>
        <label className="relative block shrink-0">
          <span className="sr-only">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
          >
            {APPLICATION_STATUS_FILTERS.map((filter) => (
              <option key={filter}>{filter}</option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
          />
        </label>
      </header>

      {applications.length === 0 ? (
        <section className="mt-5 flex min-h-[320px] flex-col items-center justify-center bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
          <Image
            src={noDataIllustration}
            alt="No applications found"
            className="h-36 w-auto object-contain"
          />
          <h3 className="font-bricolage text-carbon-900 mt-5 text-2xl font-medium">
            No {statusFilter === "All" ? "" : `${statusFilter.toLowerCase()} `}applications
          </h3>
          <p className="text-carbon-500 mt-2 max-w-md text-sm leading-6">
            {statusFilter === "All"
              ? "New applications will show up here as renters apply."
              : `There are currently no applications matching the ${statusFilter} filter.`}
          </p>
        </section>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onApprove={(id) => decide(id, "approved")}
              onDecline={(id) => decide(id, "declined")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InlineListingPreview({
  listing,
  onClose,
}: {
  listing: (typeof PORTFOLIO_LISTINGS)[number];
  onClose: () => void;
}) {
  const details = getListingDetails(listing);
  const [performancePeriod, setPerformancePeriod] = useState("Last 30 days");
  const baseListingPerformance = LIVE_LISTING_PERFORMANCE[listing.title];
  const performanceMultiplier = LISTING_PERFORMANCE_PERIODS[performancePeriod];
  const listingPerformance = baseListingPerformance
    ? {
        views: Math.round(baseListingPerformance.views * performanceMultiplier),
        saves: Math.round(baseListingPerformance.saves * performanceMultiplier),
        enquiries: Math.round(
          baseListingPerformance.enquiries * performanceMultiplier,
        ),
        viewingRequests: Math.round(
          baseListingPerformance.viewingRequests * performanceMultiplier,
        ),
      }
    : null;
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const galleryImages = [
    listing.image,
    houseTwo,
    houseThree,
    houseFour,
    houseFive,
    houseSix,
  ];
  const mapDelta = 0.018;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${details.longitude - mapDelta}%2C${details.latitude - mapDelta}%2C${details.longitude + mapDelta}%2C${details.latitude + mapDelta}&layer=mapnik&marker=${details.latitude}%2C${details.longitude}`;

  return (
    <article className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          className="font-bricolage text-carbon-600 hover:text-carbon-900 inline-flex h-10 items-center gap-1.5 text-sm font-medium"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Link
            href={`/partner-dashboard/listings/edit?listing=${encodeURIComponent(listing.title)}`}
            aria-label="Edit listing"
            className="font-bricolage flex h-10 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium"
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit
          </Link>
        </div>
      </div>

      <div className="mt-5 grid h-[clamp(340px,48vw,560px)] grid-cols-[minmax(0,1.7fr)_minmax(220px,0.65fr)] gap-2 overflow-hidden">
        <button
          type="button"
          onClick={() => setActivePhoto(0)}
          aria-label={`Open photo of ${listing.title}`}
          className="relative overflow-hidden"
        >
          <Image
            src={galleryImages[0]}
            alt={listing.title}
            fill
            placeholder="blur"
            className="object-cover"
          />
        </button>
        <div className="grid grid-rows-2 gap-2">
          <button
            type="button"
            onClick={() => setActivePhoto(1)}
            aria-label={`Open second photo of ${listing.title}`}
            className="relative overflow-hidden"
          >
            <Image
              src={galleryImages[1]}
              alt=""
              fill
              placeholder="blur"
              className="scale-125 object-cover object-left"
            />
          </button>
          <button
            type="button"
            onClick={() => setActivePhoto(2)}
            aria-label={`Open third photo of ${listing.title}`}
            className="relative overflow-hidden"
          >
            <Image
              src={galleryImages[2]}
              alt=""
              fill
              placeholder="blur"
              className={`scale-125 object-cover object-right ${galleryImages.length > 3 ? "blur-[2px] brightness-50" : ""}`}
            />
            {galleryImages.length > 3 ? (
              <span className="font-bricolage absolute inset-0 flex items-center justify-center text-xl font-medium text-white">
                +{galleryImages.length - 3} more
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <div className="flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="w-full">
              <span className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
                {listing.status}
              </span>
              <h2 className="font-bricolage text-carbon-900 mt-5 text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.92] font-medium tracking-[-0.055em]">
                {listing.title}
              </h2>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                <p className="text-carbon-500 flex items-center gap-2">
                  <MapPin aria-hidden="true" className="size-4" />
                  {listing.location}
                </p>
                <p className="ml-auto shrink-0 text-right">
                  <span className="font-bricolage text-carbon-900 text-2xl font-medium tracking-[-0.035em]">
                    {listing.price.replace(" / month", "")}
                  </span>
                  {listing.price.includes("month") ? (
                    <span className="text-carbon-500 ml-2 text-sm">
                      per month
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <PreviewFact
              icon={BedDouble}
              label="Bedrooms"
              value={`${listing.bedrooms}`}
            />
            <PreviewFact
              icon={Bath}
              label="Bathrooms"
              value={`${listing.bathrooms}`}
            />
            <PreviewFact
              icon={Expand}
              label="Floor area"
              value={`${listing.area} m²`}
            />
            <PreviewFact
              icon={Sofa}
              label="Furnishing"
              value={
                listing.furnished === null
                  ? "Not added"
                  : listing.furnished
                    ? "Furnished"
                    : "Unfurnished"
              }
            />
            <PreviewFact
              icon={Building2}
              label="Property type"
              value={details.type}
            />
            <PreviewFact
              icon={CheckCircle2}
              label="Listing purpose"
              value={details.purpose}
            />
            <PreviewFact
              icon={CalendarDays}
              label="Available from"
              value={details.availableFrom}
            />
            <PreviewFact
              icon={Clock3}
              label="Minimum stay"
              value={details.minimumStay}
            />
          </dl>

          <section className="mt-10 border-t border-black/10 pt-8">
            <h3 className="font-bricolage text-carbon-900 text-2xl font-medium">
              About this home
            </h3>
            <p className="text-carbon-600 mt-4 max-w-3xl leading-8">
              A thoughtfully presented home with bright living spaces, practical
              room proportions, and convenient access to everyday essentials.
              The listing gives renters the details they need to decide whether
              this property feels right before requesting a viewing.
            </p>
          </section>

          <section className="mt-10 border-t border-black/10 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-bricolage text-carbon-900 text-2xl font-medium">
                  Amenities
                </h3>
                <p className="text-carbon-500 mt-2 text-sm">
                  {details.amenities.length} amenities included with this
                  property.
                </p>
              </div>
            </div>
            <ul className="mt-6 grid list-disc gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {details.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="text-carbon-700 ml-5 pl-1 text-sm marker:text-black/35"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          {listing.status === "Live" && listingPerformance ? (
            <section className="mt-10 border-t border-black/10 pt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="font-bricolage text-carbon-900 text-2xl font-medium">
                    Listing performance
                  </h3>
                  <p className="text-carbon-500 mt-2 text-sm">
                    Activity generated by this listing during the selected
                    period.
                  </p>
                </div>
                <label className="relative block shrink-0">
                  <span className="sr-only">
                    Select listing performance period
                  </span>
                  <select
                    value={performancePeriod}
                    onChange={(event) =>
                      setPerformancePeriod(event.target.value)
                    }
                    className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
                  >
                    {Object.keys(LISTING_PERFORMANCE_PERIODS).map((period) => (
                      <option key={period}>{period}</option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
                  />
                </label>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <ListingPerformanceMetric
                  label="Views"
                  value={listingPerformance.views}
                />
                <ListingPerformanceMetric
                  label="Saves"
                  value={listingPerformance.saves}
                />
                <ListingPerformanceMetric
                  label="Enquiries"
                  value={listingPerformance.enquiries}
                />
                <ListingPerformanceMetric
                  label="Viewing requests"
                  value={listingPerformance.viewingRequests}
                />
              </dl>
            </section>
          ) : null}

          <section className="mt-10 border-t border-black/10 pt-8">
            <h3 className="font-bricolage text-carbon-900 text-2xl font-medium">
              Exact location
            </h3>
            <p className="text-carbon-600 mt-3 flex items-start gap-2 text-sm">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              {details.exactAddress}
            </p>
            <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <iframe
                title={`Map showing ${listing.location}`}
                src={mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[320px] w-full border-0"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm">
                <span className="font-medium">{listing.location}</span>
                <span className="text-carbon-500">
                  {details.latitude.toFixed(4)}, {details.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
      {activePhoto !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${listing.title} photo gallery`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            aria-label="Close photo viewer"
            className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white text-black"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActivePhoto(
                (activePhoto - 1 + galleryImages.length) % galleryImages.length,
              )
            }
            aria-label="Previous photo"
            className="absolute left-4 z-10 flex size-11 items-center justify-center rounded-full bg-white text-black sm:left-8"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <div className="relative h-[min(78vh,760px)] w-[min(86vw,1200px)]">
            <Image
              src={galleryImages[activePhoto]}
              alt={`${listing.title}, photo ${activePhoto + 1}`}
              fill
              priority
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setActivePhoto((activePhoto + 1) % galleryImages.length)
            }
            aria-label="Next photo"
            className="absolute right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white text-black sm:right-8"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          <p className="absolute bottom-5 text-sm text-white/70">
            {activePhoto + 1} / {galleryImages.length}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function ListingPerformanceMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <dt className="text-carbon-500 text-xs">{label}</dt>
      <dd className="font-bricolage text-carbon-900 mt-3 text-3xl font-medium tracking-[-0.04em]">
        {value.toLocaleString("en-US")}
      </dd>
    </div>
  );
}

function PreviewFact({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <Icon aria-hidden="true" className="size-5" />
      <dt className="text-carbon-500 mt-4 text-xs">{label}</dt>
      <dd className="font-bricolage text-carbon-900 mt-1 font-medium">
        {value}
      </dd>
    </div>
  );
}

function ActivityItem({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-black/[0.035] p-4">
      <Icon aria-hidden="true" className="size-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

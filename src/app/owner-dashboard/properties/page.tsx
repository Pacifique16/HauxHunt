"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Archive,
  Bath,
  BedDouble,
  ChevronDown,
  Eye,
  Expand,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Sofa,
} from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { useOwnerEmptyMode } from "@/components/owner/use-owner-demo-mode";
import { StatusPill } from "@/components/owner/status-pill";
import {
  OWNER_LISTINGS,
  getOwnerProperties,
  subscribeToOwnerListings,
  subscribeToOwnerApplications,
  subscribeToOwnerRentals,
  subscribeToOwnerPayments,
  updateOwnerListingStatus,
} from "@/lib/owner-data";
import { subscribeToMaintenance } from "@/lib/maintenance-data";
import { subscribeToTeam } from "@/lib/team-data";
import {
  attentionReasonFor,
  getPropertyOperationalSummary,
} from "@/lib/owner-property-summary";
import noDataIllustration from "@/assets/images/empty.png";
import hidingIllustration from "@/assets/images/hiding-no-line.png";
import listingFolder from "@/assets/images/listing-folder.png";

const subscribeToHydration = () => () => {};

// Owner Properties phase (Phase 3) -- Properties is the portfolio
// workspace, not a second Listings page (Section 1/49): a card's job is
// "what do I own, who manages it, is anything happening" -- never views,
// saves, or listing performance. Listing status is read the same way
// Property Detail already reads it (listing?.status, falling back to the
// property's own fact) so the two screens can never disagree about the
// same property.

type Filter =
  | "All"
  | "Needs Attention"
  | "Draft"
  | "In Review"
  | "Live"
  | "Upcoming Rental"
  | "Occupied"
  | "Archived";
const FILTERS: Filter[] = [
  "All",
  "Needs Attention",
  "Draft",
  "In Review",
  "Live",
  "Upcoming Rental",
  "Occupied",
  "Archived",
];

export default function OwnerPropertiesPage() {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0);
  useEffect(() => subscribeToTeam(forceUpdate), []);
  useEffect(() => subscribeToOwnerApplications(forceUpdate), []);
  useEffect(() => subscribeToOwnerRentals(forceUpdate), []);
  useEffect(() => subscribeToOwnerPayments(forceUpdate), []);
  useEffect(() => subscribeToMaintenance(forceUpdate), []);
  useEffect(() => subscribeToOwnerListings(forceUpdate), []);

  const [filter, setFilter] = useState<Filter>("All");
  const [view] = useState<"list" | "cards">("list");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const emptyMode = useOwnerEmptyMode();

  if (!hydrated) {
    return (
      <OwnerDashboardShell>
        <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[1360px] animate-pulse">
            <div className="h-28 rounded-2xl bg-white" />
            <div className="mt-8 h-12 rounded-2xl bg-white" />
            <div className="mt-6 space-y-1">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 bg-white" />
              ))}
            </div>
          </div>
        </section>
      </OwnerDashboardShell>
    );
  }

  const properties = emptyMode ? [] : getOwnerProperties();

  const rows = properties.map((property) => {
    const listingStatus =
      OWNER_LISTINGS.find((item) => item.propertyId === property.id)?.status ??
      property.listingStatus;
    return {
      property,
      status:
        property.occupancy === "Upcoming"
          ? "Upcoming Rental"
          : property.occupancy === "Occupied"
            ? "Occupied"
            : listingStatus,
      summary: getPropertyOperationalSummary(property.id),
    };
  });

  const filtered = rows.filter(({ status, summary }) => {
    if (filter === "All") return true;
    if (filter === "Needs Attention") return summary.needsAttention;
    if (filter === "Occupied") return status === "Occupied";
    if (filter === "Draft") return status === "Draft";
    if (filter === "In Review") return status === "In Review";
    if (filter === "Live") return status === "Live";
    if (filter === "Upcoming Rental") return status === "Upcoming Rental";
    if (filter === "Archived") return status === "Archived";
    return true;
  });
  if (sortOrder === "oldest") filtered.reverse();

  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="pb-9">
            <div className="flex items-start justify-between gap-6">
              <h1 className="dashboard-page-title text-carbon-900">Listings</h1>
              <Link
                href="/owner-dashboard/properties/new"
                className="font-bricolage inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80"
              >
                <Plus aria-hidden="true" className="size-4" />
                Add Listing
              </Link>
            </div>
            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-carbon-600 max-w-2xl text-base leading-7 sm:text-lg">
                Add, verify, publish, and manage every home you offer to
                renters.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-carbon-500 mr-1 text-sm whitespace-nowrap">
                  Results:
                  <span className="ml-1 font-medium text-black">
                    {filtered.length}
                  </span>
                </p>
                <label className="relative block shrink-0">
                  <span className="sr-only">Filter listings by status</span>
                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value as Filter)
                    }
                    className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] outline-none"
                  >
                    {FILTERS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
                  />
                </label>
                <label className="relative block shrink-0">
                  <span className="sr-only">Sort listings</span>
                  <select
                    value={sortOrder}
                    onChange={(event) =>
                      setSortOrder(event.target.value as "newest" | "oldest")
                    }
                    className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] outline-none"
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
            </div>
          </header>

          {filtered.length === 0 ? (
            <section className="mt-6 flex min-h-[420px] flex-col items-center justify-center bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
              <Image
                src={noDataIllustration}
                alt=""
                className="h-40 w-auto object-contain"
              />
              <h3 className="font-bricolage text-carbon-900 mt-5 text-2xl font-medium">
                {properties.length === 0
                  ? "No listings yet"
                  : "No listings match these filters"}
              </h3>
              <p className="text-carbon-500 mt-2 max-w-md text-sm leading-6">
                {properties.length === 0
                  ? "Add your first listing, verify it, and publish it to renters when it is ready."
                  : "Try a different filter or search term."}
              </p>
              {properties.length === 0 ? (
                <Link
                  href="/owner-dashboard/properties/new"
                  className="font-bricolage mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Add Listing
                </Link>
              ) : null}
            </section>
          ) : true ? (
            <section className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(({ property, summary }) => (
                <article key={property.id} className="group relative min-w-0">
                  <Link
                    href={`/owner-dashboard/properties/${property.id}`}
                    aria-label={`Open ${property.title} listing folder`}
                    className="block focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  >
                    <div className="relative aspect-[4/3] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.025]">
                      <Image
                        src={listingFolder}
                        alt=""
                        fill
                        priority={false}
                        sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 29vw, (min-width: 640px) 46vw, 100vw"
                        className="object-contain"
                      />
                      <span className="text-carbon-700 pointer-events-none absolute top-[20%] left-[24%] -rotate-[12deg] text-left text-[5px] leading-none font-normal tracking-[0.04em] sm:text-[6px]">
                        Details
                      </span>
                      {summary.needsAttention ? (
                        <span
                          className="absolute -top-[3%] right-[14%] z-10 aspect-[1774/887] w-[28%] overflow-hidden"
                          aria-label="Needs attention"
                        >
                          <Image
                            src={hidingIllustration}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 7vw, (min-width: 1024px) 9vw, (min-width: 640px) 14vw, 28vw"
                            className="attention-folder-character-left-hand object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,0.25)]"
                          />
                          <Image
                            src={hidingIllustration}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 7vw, (min-width: 1024px) 9vw, (min-width: 640px) 14vw, 28vw"
                            className="attention-folder-character-right-hand object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,0.25)]"
                          />
                          <span className="attention-folder-character-head-viewport absolute inset-0">
                            <Image
                              src={hidingIllustration}
                              alt=""
                              fill
                              sizes="(min-width: 1280px) 7vw, (min-width: 1024px) 9vw, (min-width: 640px) 14vw, 28vw"
                              className="attention-folder-character-head object-contain drop-shadow-[0_3px_4px_rgba(0,0,0,0.25)]"
                            />
                          </span>
                        </span>
                      ) : null}
                      <div className="absolute bottom-[18%] left-[16%] max-w-[62%] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
                        <h2 className="font-bricolage truncate text-[9px] leading-none font-medium tracking-[-0.01em] sm:text-[10px]">
                          {property.title}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </section>
          ) : view === "list" ? (
            <section className="mt-6 overflow-visible bg-white shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
              <div className="hidden grid-cols-[minmax(260px,1.6fr)_110px_150px_minmax(150px,0.8fr)_auto] gap-5 border-b border-black/8 px-6 py-4 text-xs font-medium text-black/45 lg:grid">
                <span className="pl-20">Listing</span>
                <span className="justify-self-start text-left">Status</span>
                <span className="justify-self-start text-left">
                  Monthly rent
                </span>
                <span className="justify-self-start text-left">Managed by</span>
                <span className="sr-only">Options</span>
              </div>
              <div className="divide-y divide-black/8">
                {filtered.map(({ property, status, summary }) => {
                  return (
                    <article
                      key={property.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${property.title}`}
                      onClick={() =>
                        router.push(
                          `/owner-dashboard/properties/${property.id}`,
                        )
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          router.push(
                            `/owner-dashboard/properties/${property.id}`,
                          );
                        }
                      }}
                      className="grid cursor-pointer gap-4 px-5 py-5 transition-colors hover:bg-black/[0.02] focus-visible:bg-black/[0.035] focus-visible:outline-none sm:px-6 lg:grid-cols-[minmax(260px,1.6fr)_110px_150px_minmax(150px,0.8fr)_auto] lg:items-center lg:gap-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <Image
                          src={property.image}
                          alt=""
                          className="size-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/owner-dashboard/properties/${property.id}`}
                            className="font-bricolage text-carbon-900 block truncate font-medium hover:underline hover:underline-offset-4"
                          >
                            {property.title}
                          </Link>
                          <p className="text-carbon-500 mt-1 truncate text-sm">
                            {property.location}
                          </p>
                          <p className="text-carbon-400 mt-1 text-xs">
                            {property.bedrooms} bed · {property.bathrooms} bath
                            {summary.activeApplications > 0
                              ? ` · ${summary.activeApplications} applications`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="justify-self-start text-left lg:pl-2">
                        <span className="text-carbon-400 mr-2 text-xs lg:hidden">
                          Status
                        </span>
                        <StatusPill status={status} />
                      </div>
                      <div className="justify-self-start text-left text-sm font-medium lg:pl-4">
                        <span className="text-carbon-400 mr-2 text-xs lg:hidden">
                          Monthly rent
                        </span>
                        {property.rent?.replace(/\s*\/\s*month$/i, "") ?? "—"}
                      </div>
                      <div className="justify-self-start text-left text-sm lg:pl-4">
                        <span className="text-carbon-400 mr-2 text-xs lg:hidden">
                          Managed by
                        </span>
                        <span className="font-medium">
                          {property.propertyManager?.name ?? "Me"}
                        </span>
                      </div>
                      <div className="flex justify-start lg:justify-end">
                        <OwnerListingOptionsMenu
                          propertyId={property.id}
                          title={property.title}
                          status={status}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(({ property, status, summary }) => {
                const attentionReason = attentionReasonFor(summary);
                const signalNodes: ReactNode[] = [];
                if (summary.currentRental) {
                  signalNodes.push(
                    <span key="rental">
                      {summary.currentRental.status === "Upcoming"
                        ? "1 upcoming rental"
                        : "1 active rental"}
                    </span>,
                  );
                }
                if (summary.activeApplications > 0) {
                  signalNodes.push(
                    <Link
                      key="applications"
                      href={`/owner-dashboard/applications?propertyId=${property.id}`}
                      className="relative z-10 underline underline-offset-2 hover:no-underline"
                    >
                      {summary.activeApplications} application
                      {summary.activeApplications === 1 ? "" : "s"}
                    </Link>,
                  );
                }
                if (summary.openMaintenanceCount > 0) {
                  signalNodes.push(
                    <span key="maintenance">
                      {summary.openMaintenanceCount} open maintenance
                    </span>,
                  );
                }

                return (
                  <article
                    key={property.id}
                    className="listing-glass group relative overflow-hidden rounded-2xl"
                  >
                    <Link
                      href={`/owner-dashboard/properties/${property.id}`}
                      aria-label={`View ${property.title}`}
                      className="relative block aspect-[4/3] overflow-hidden"
                    >
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                        className="pointer-events-none object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                      <span className="absolute top-4 left-4">
                        <StatusPill status={status} />
                      </span>
                    </Link>
                    <div className="absolute top-3 right-3 z-20 rounded-full bg-white/90 backdrop-blur-sm">
                      <OwnerListingOptionsMenu
                        propertyId={property.id}
                        title={property.title}
                        status={status}
                      />
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                          <Link
                            href={`/owner-dashboard/properties/${property.id}`}
                            className="font-bricolage text-carbon-900 text-xl leading-tight font-medium tracking-[-0.02em] hover:underline hover:underline-offset-4"
                          >
                            {property.title}
                          </Link>
                          <p className="text-carbon-600 mt-2 flex items-center gap-1.5 text-sm">
                            <MapPin
                              aria-hidden="true"
                              className="size-4 shrink-0"
                            />
                            {property.location}
                          </p>
                        </div>
                        <p className="text-carbon-900 shrink-0 text-right">
                          <span className="font-bricolage block text-lg font-medium">
                            {property.rent?.replace(/\s*\/\s*month$/i, "") ??
                              "Rent not set"}
                          </span>
                          {property.rent ? (
                            <span className="text-carbon-500 text-xs">
                              per month
                            </span>
                          ) : null}
                        </p>
                      </div>

                      <dl className="border-carbon-900/10 text-carbon-600 mt-6 flex items-center justify-between gap-2 border-t pt-5 text-xs">
                        <ListingFact
                          icon={BedDouble}
                          value={`${property.bedrooms} beds`}
                        />
                        <ListingFact
                          icon={Bath}
                          value={`${property.bathrooms} baths`}
                        />
                        <ListingFact
                          icon={Expand}
                          value={`${property.size} m²`}
                        />
                        <ListingFact
                          icon={Sofa}
                          value={
                            property.amenities.includes("Furnished")
                              ? "Furnished"
                              : "Unfurnished"
                          }
                        />
                      </dl>

                      <dl className="mt-5 divide-y divide-black/8 border-t border-black/8 pt-2 text-sm">
                        <div className="flex items-center justify-between gap-4 py-2">
                          <dt className="text-carbon-500">Managed by</dt>
                          <dd className="text-carbon-900 text-right font-medium">
                            {property.propertyManager?.name ?? "Me"}
                          </dd>
                        </div>
                        {property.agent ? (
                          <div className="flex items-center justify-between gap-4 py-2">
                            <dt className="text-carbon-500">Leasing by</dt>
                            <dd className="text-carbon-900 text-right font-medium">
                              {property.agent.name}
                            </dd>
                          </div>
                        ) : null}
                      </dl>

                      {attentionReason ? (
                        <p className="text-carbon-900 mt-2 flex items-center gap-1.5 text-sm font-medium">
                          <AlertCircle
                            aria-hidden="true"
                            className="size-3.5 shrink-0"
                          />
                          {attentionReason}
                        </p>
                      ) : null}

                      {signalNodes.length > 0 ? (
                        <p className="text-carbon-500 mt-2 text-xs">
                          {signalNodes.map((node, i) => (
                            <span key={i}>
                              {i > 0 ? " · " : ""}
                              {node}
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

function ListingFact({
  icon: Icon,
  value,
}: {
  icon: typeof BedDouble;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
      <dt className="sr-only">Listing detail</dt>
      <dd>{value}</dd>
    </div>
  );
}

function OwnerListingOptionsMenu({
  propertyId,
  title,
  status,
}: {
  propertyId: string;
  title: string;
  status: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const primaryHref =
    status === "Occupied" || status === "Upcoming Rental"
      ? "/owner-dashboard/rentals"
      : status === "Draft"
        ? `/owner-dashboard/properties/${propertyId}/edit`
        : `/owner-dashboard/properties/${propertyId}?tab=details`;
  const primaryLabel =
    status === "Occupied" || status === "Upcoming Rental"
      ? "Manage rental"
      : status === "Draft"
        ? "Continue editing"
        : status === "In Review"
          ? "View submission"
          : "View listing";

  return (
    <div
      ref={menuRef}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      className={`relative ${open ? "z-30" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Options for ${title}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className="text-carbon-500 hover:text-carbon-900 flex size-9 items-center justify-center rounded-full hover:bg-black/5"
      >
        <MoreHorizontal aria-hidden="true" className="size-5" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-40 w-48 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
        >
          <Link
            href={primaryHref}
            role="menuitem"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-black/5"
          >
            <Eye aria-hidden="true" className="size-4" />
            {primaryLabel}
          </Link>
          {status !== "Occupied" &&
          status !== "Upcoming Rental" &&
          status !== "Draft" ? (
            <Link
              href={`/owner-dashboard/properties/${propertyId}/edit`}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-black/5"
            >
              <Pencil aria-hidden="true" className="size-4" />
              Edit listing
            </Link>
          ) : null}
          <div className="my-1 border-t border-black/8" />
          {status === "Archived" ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                updateOwnerListingStatus(propertyId, "Live");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-black/5"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Unarchive listing
            </button>
          ) : status !== "Occupied" && status !== "Upcoming Rental" ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                updateOwnerListingStatus(propertyId, "Archived");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-black/5"
            >
              <Archive aria-hidden="true" className="size-4" />
              Archive listing
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

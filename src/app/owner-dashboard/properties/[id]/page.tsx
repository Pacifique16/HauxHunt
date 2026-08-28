"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useReducer, useState, useSyncExternalStore } from "react";
import {
  BadgeCheck,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  Expand,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  UserRound,
  X,
} from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { StatusPill } from "@/components/owner/status-pill";
import { AssignPropertyManagerDialog } from "@/components/owner/assign-property-manager-dialog";
import {
  AssignAgentDialog,
  type AssignableMember,
} from "@/components/owner/assign-agent-dialog";
import { HistoryBackButton } from "@/components/navigation/history-back-button";
import {
  OWNER_LISTINGS,
  getOwnerApplications,
  getOwnerPayments,
  getOwnerProperty,
  getOwnerRentals,
  subscribeToOwnerApplications,
  subscribeToOwnerListings,
  subscribeToOwnerPayments,
  subscribeToOwnerRentals,
  RENTER_DEMO_NAME,
  type OwnerPayment,
  type OwnerRental,
  type PropertyManagerAssignment,
} from "@/lib/owner-data";
import {
  getMaintenanceRequests,
  subscribeToMaintenance,
  type MaintenanceRequest,
} from "@/lib/maintenance-data";
import {
  REGISTERED_PROFESSIONALS,
  TEAM_ID,
  getActiveMemberships,
  type ProfessionalRole,
} from "@/lib/team-data";
import {
  OWNER_PARTICIPANT_ID,
  RENTER_PARTICIPANT_ID,
  getOrCreateConversation,
} from "@/lib/messages-data";

const subscribeToHydration = () => () => {};

export default function OwnerPropertyDetailPage() {
  return <OwnerPropertyDetailPageInner />;
}

function OwnerPropertyDetailPageInner() {
  const params = useParams<{ id: string }>();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const property = getOwnerProperty(params.id);
  const [pickRole, setPickRole] = useState<ProfessionalRole | null>(null);
  const [assignTarget, setAssignTarget] = useState<{
    member: AssignableMember;
    role: ProfessionalRole;
  } | null>(null);
  const [, setRefreshKey] = useState(0);
  // Cross-Role Lifecycle Synchronization phase -- Section 32. Rentals,
  // Payments, and Maintenance now read through the same live getters PM's
  // dashboard reads, instead of the frozen base arrays, so a PM-created
  // Rental Setup / recorded Payment / status change is visible here too.
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0);
  useEffect(() => subscribeToOwnerApplications(forceUpdate), []);
  useEffect(() => subscribeToOwnerRentals(forceUpdate), []);
  useEffect(() => subscribeToOwnerPayments(forceUpdate), []);
  useEffect(() => subscribeToMaintenance(forceUpdate), []);
  useEffect(() => subscribeToOwnerListings(forceUpdate), []);
  useEffect(() => {
    if (!hydrated) return;
    const requestedSection = new URLSearchParams(window.location.search).get(
      "tab",
    );
    if (!requestedSection) return;

    const section =
      requestedSection === "listing" || requestedSection === "management"
        ? "details"
        : requestedSection;
    window.requestAnimationFrame(() => {
      document.getElementById(section)?.scrollIntoView();
    });
  }, [hydrated]);

  if (!hydrated) {
    return (
      <OwnerDashboardShell>
        <section className="px-5 pt-4 pb-24 sm:px-6 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[1360px] animate-pulse">
            <div className="h-32 rounded-2xl bg-white" />
            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="h-64 rounded-[1.5rem] bg-white" />
              <div className="h-64 rounded-[1.5rem] bg-white" />
            </div>
          </div>
        </section>
      </OwnerDashboardShell>
    );
  }

  if (!property) return notFound();

  const listing =
    OWNER_LISTINGS.find((l) => l.propertyId === property.id) ?? null;
  const rentals = getOwnerRentals().filter((r) => r.propertyId === property.id);
  const payments = getOwnerPayments().filter(
    (p) => p.propertyId === property.id,
  );
  const maintenance = getMaintenanceRequests().filter(
    (m) => m.propertyId === property.id,
  );
  const listingStatus = listing?.status ?? property.listingStatus;
  const displayStatus =
    property.occupancy === "Upcoming"
      ? "Upcoming Rental"
      : property.occupancy === "Occupied"
        ? "Occupied"
        : listingStatus;
  // Owner Properties phase -- Section 29/43: the Listing tab's applications
  // count previously read OWNER_LISTINGS' own static `applications` number,
  // a second, independently-maintained count that happened to agree with
  // the real records but had no mechanism keeping it that way. Derived live
  // from the same shared Applications the Properties card and the Phase 2
  // Applications screen already use, scoped by propertyId.
  const applicationsCount = getOwnerApplications().filter(
    (a) => a.propertyId === property.id,
  ).length;

  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-4 pb-24 sm:px-6 lg:px-10 lg:pt-5 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          {/* Header ---------------------------------------------------------- */}
          <header className="relative flex flex-col gap-6 border-b border-black/10 pb-8">
            <div className="min-w-0 flex-1">
              <HistoryBackButton
                fallbackHref="/owner-dashboard/properties"
                className="font-bricolage text-carbon-500 hover:text-carbon-900 inline-flex h-10 items-center gap-0.5 text-sm font-medium transition-colors"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Back
              </HistoryBackButton>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <h1 className="dashboard-page-title text-carbon-900">
                  {property.title}
                </h1>
                <StatusPill status={displayStatus} />
              </div>
              <p className="text-carbon-500 mt-3 flex items-center gap-1.5 text-base">
                <MapPin aria-hidden="true" className="size-4" />
                {property.location}
              </p>
            </div>
            <div className="lg:absolute lg:right-0 lg:bottom-8">
              <Link
                href={`/owner-dashboard/properties/${property.id}/edit`}
                className="font-bricolage inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-black shadow-[0_5px_16px_rgba(0,0,0,0.1)] transition-colors hover:bg-black/5"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
                Edit Listing
              </Link>
            </div>
          </header>

          <div className="mt-10 space-y-12">
            <section id="details" className="scroll-mt-24 space-y-6">
              <OverviewTab
                property={property}
                onPick={(role) => setPickRole(role)}
              />
              {displayStatus !== "Occupied" &&
              displayStatus !== "Upcoming Rental" ? (
                <div className="border-t border-black/10 pt-8">
                  <div className="mb-6">
                    <p className="text-carbon-400 text-xs font-medium tracking-wider uppercase">
                      Owner controls
                    </p>
                    <h2 className="font-bricolage text-carbon-900 mt-2 text-2xl font-medium">
                      Listing management
                    </h2>
                  </div>
                  <ListingTab
                    property={property}
                    listing={listing}
                    applicationsCount={applicationsCount}
                    operationalStatus={displayStatus}
                  />
                </div>
              ) : null}
            </section>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <section id="rental" className="scroll-mt-24">
                <RentalTab
                  rentals={rentals}
                  propertyManager={property.propertyManager}
                />
              </section>

              <section id="payments" className="scroll-mt-24">
                <PaymentsTab payments={payments} />
              </section>
            </div>

            <section id="maintenance" className="scroll-mt-24">
              <MaintenanceTab requests={maintenance} />
            </section>
          </div>
        </div>
      </section>

      {pickRole ? (
        <PickTeamMemberDialog
          role={pickRole}
          onClose={() => setPickRole(null)}
          onPick={(member) => {
            setAssignTarget({ member, role: pickRole });
            setPickRole(null);
          }}
        />
      ) : null}

      <AssignPropertyManagerDialog
        open={Boolean(assignTarget && assignTarget.role === "property_manager")}
        onClose={() => setAssignTarget(null)}
        member={
          assignTarget?.role === "property_manager" ? assignTarget.member : null
        }
        propertyId={property.id}
        onAssigned={() => setRefreshKey((k) => k + 1)}
      />
      <AssignAgentDialog
        open={Boolean(assignTarget && assignTarget.role === "agent")}
        onClose={() => setAssignTarget(null)}
        member={assignTarget?.role === "agent" ? assignTarget.member : null}
        propertyId={property.id}
        onAssigned={() => setRefreshKey((k) => k + 1)}
      />
    </OwnerDashboardShell>
  );
}

// A property's Team tab only ever offers ACTIVE team members, never the
// full registered-professional pool -- registering isn't the same as being
// on this Owner's team, so assigning a property must go through membership
// first (see Section 35 of the phase brief).
function PickTeamMemberDialog({
  role,
  onClose,
  onPick,
}: {
  role: ProfessionalRole;
  onClose: () => void;
  onPick: (member: AssignableMember) => void;
}) {
  const roleLabel = role === "agent" ? "Agent" : "Property Manager";
  const members = getActiveMemberships(TEAM_ID).filter((m) => m.role === role);

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-bricolage text-lg font-medium">
            Assign Team Member
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full hover:bg-black/5"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          <p className="text-carbon-500 text-xs font-medium tracking-widest uppercase">
            Select an active {roleLabel}
          </p>
          <div className="mt-4 space-y-2">
            {members.map((m) => {
              const professional = REGISTERED_PROFESSIONALS.find(
                (p) => p.id === m.professionalId,
              );
              if (!professional) return null;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    onPick({
                      professionalId: professional.id,
                      name: professional.name,
                      verified: professional.verified,
                      avatar: professional.avatar,
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-2xl border border-black/12 p-4 text-left transition-colors hover:border-black/30"
                >
                  <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black text-sm font-medium text-white">
                    {professional.avatar ? (
                      <Image
                        src={professional.avatar}
                        alt={`${professional.name} profile`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      professional.name.slice(0, 1)
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {professional.name}
                    {professional.verified ? (
                      <BadgeCheck
                        aria-label="Verified"
                        className="size-3.5 shrink-0 fill-black text-white"
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Details overview
// ---------------------------------------------------------------------------

function OverviewTab({
  property,
  onPick,
}: {
  property: NonNullable<ReturnType<typeof getOwnerProperty>>;
  onPick: (role: ProfessionalRole) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
          Property information
        </h2>
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Fact
            icon={BedDouble}
            label="Bedrooms"
            value={String(property.bedrooms)}
          />
          <Fact
            icon={Bath}
            label="Bathrooms"
            value={String(property.bathrooms)}
          />
          <Fact icon={Expand} label="Size" value={`${property.size} m²`} />
          <Fact label="Type" value={property.type} />
        </dl>
        {property.amenities.length > 0 ? (
          <div className="mt-5 border-t border-black/8 pt-5">
            <p className="text-carbon-400 text-xs font-medium tracking-wider uppercase">
              Amenities
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="text-carbon-700 flex items-center gap-3 text-sm"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <Check aria-hidden="true" className="size-2.5" />
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
          Assigned to
        </h2>
        <div className="mt-5 space-y-5">
          <AssignmentSummaryRow
            role="Property Manager"
            assignment={property.propertyManager}
            onAssign={() => onPick("property_manager")}
          />
          <AssignmentSummaryRow
            role="Agent"
            assignment={property.agent}
            onAssign={() => onPick("agent")}
          />
        </div>
      </section>
    </div>
  );
}

function AssignmentSummaryRow({
  role,
  assignment,
  onAssign,
}: {
  role: string;
  assignment: {
    professionalId: string;
    membershipId: string | null;
    name: string;
    verified: boolean;
  } | null;
  onAssign: () => void;
}) {
  const professional = assignment
    ? REGISTERED_PROFESSIONALS.find(
        (candidate) => candidate.id === assignment.professionalId,
      )
    : null;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        {assignment ? (
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black text-xs font-medium text-white">
              {professional?.avatar ? (
                <Image
                  src={professional.avatar}
                  alt={`${assignment.name} profile`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                assignment.name.slice(0, 1)
              )}
            </span>
            <div className="min-w-0">
              <p className="flex min-w-0 items-center gap-1 truncate text-sm font-medium">
                {assignment.name}
                {assignment.verified ? (
                  <BadgeCheck
                    aria-label="Verified"
                    className="size-3.5 shrink-0 fill-black text-white"
                  />
                ) : null}
              </p>
              <p className="text-carbon-400 mt-0.5 text-xs">{role}</p>
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black/6 text-black/45">
              <UserRound aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{role}</p>
              <p className="text-carbon-500 mt-0.5 text-xs">Not assigned</p>
            </div>
          </div>
        )}

        {assignment?.membershipId ? (
          <Link
            href={`/owner-dashboard/team/${assignment.membershipId}`}
            className="font-bricolage shrink-0 text-xs font-medium underline underline-offset-4 hover:no-underline"
          >
            Manage Access
          </Link>
        ) : !assignment ? (
          <button
            type="button"
            onClick={onAssign}
            className="font-bricolage shrink-0 text-xs font-medium underline underline-offset-4 hover:no-underline"
          >
            Assign
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof BedDouble;
  label: string;
  value: string;
}) {
  return (
    <div>
      {Icon ? (
        <Icon aria-hidden="true" className="size-4 text-black/40" />
      ) : null}
      <dt className="text-carbon-400 mt-2 text-xs">{label}</dt>
      <dd className="font-bricolage mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listing
// ---------------------------------------------------------------------------

function ListingTab({
  property,
  listing,
  applicationsCount,
  operationalStatus,
}: {
  property: NonNullable<ReturnType<typeof getOwnerProperty>>;
  listing: (typeof OWNER_LISTINGS)[number] | null;
  applicationsCount: number;
  operationalStatus: string;
}) {
  if (
    operationalStatus === "Occupied" ||
    operationalStatus === "Upcoming Rental"
  ) {
    const upcoming = operationalStatus === "Upcoming Rental";
    return (
      <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <StatusPill status={operationalStatus} />
            <h3 className="font-bricolage text-carbon-900 mt-4 text-xl font-medium">
              {upcoming
                ? "This home has an upcoming rental"
                : "This home is currently occupied"}
            </h3>
            <p className="text-carbon-500 mt-2 max-w-xl text-sm leading-6">
              {upcoming
                ? "The renter has not moved in yet. Manage the agreement, payments, deposit, and move-in from the Rental tab."
                : "The listing is unavailable to new renters while the tenancy is active. Manage the renter and agreement from the Rental tab."}
            </p>
          </div>
          <Link
            href="#rental"
            className="font-bricolage inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white"
          >
            Manage Rental
          </Link>
        </div>
      </section>
    );
  }

  const isUnpublished = !listing || listing.status === "Draft";
  if (isUnpublished) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white px-6 py-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <h3 className="font-bricolage text-xl font-medium">
          This listing is still a draft
        </h3>
        <p className="text-carbon-500 mt-2 max-w-sm text-sm leading-6">
          Finish and submit the listing for verification before it is published
          to renters.
        </p>
        <Link
          href={`/owner-dashboard/properties/${property.id}/edit`}
          className="font-bricolage mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white"
        >
          <Plus aria-hidden="true" className="size-4" />
          Continue Listing
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
              {property.title}
            </h2>
            <p className="text-carbon-500 mt-1 text-sm">{property.location}</p>
          </div>
          <StatusPill status={listing.status} />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-carbon-400 text-xs">Managed by</dt>
            <dd className="mt-1 font-medium">
              {property.propertyManager?.name ?? "Me"}
            </dd>
          </div>
          <div>
            <dt className="text-carbon-400 text-xs">Marketing agent</dt>
            <dd className="mt-1 font-medium">
              {property.agent?.name ?? "None"}
            </dd>
          </div>
          <div>
            <dt className="text-carbon-400 text-xs">Applications</dt>
            <dd className="mt-1 font-medium">
              <Link
                href={`/owner-dashboard/applications?propertyId=${property.id}`}
                className="underline underline-offset-4 hover:no-underline"
              >
                {applicationsCount}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-carbon-400 text-xs">Rent</dt>
            <dd className="mt-1 font-medium">{property.rent ?? "Not set"}</dd>
          </div>
        </dl>
      </section>

      {listing.views !== null ? (
        <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
          <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
            Listing performance
          </h2>
          <p className="text-carbon-500 mt-1 text-sm">
            How property seekers are responding to this listing.
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Metric label="Views" value={listing.views} />
            <Metric label="Saves" value={listing.saves ?? 0} />
            <Metric label="Enquiries" value={listing.enquiries ?? 0} />
          </dl>
        </section>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-black/3 p-4">
      <dt className="text-carbon-500 text-xs">{label}</dt>
      <dd className="font-bricolage text-carbon-900 mt-2 text-2xl font-medium">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rental
// ---------------------------------------------------------------------------

function RentalTab({
  rentals,
  propertyManager,
}: {
  rentals: OwnerRental[];
  propertyManager: PropertyManagerAssignment | null;
}) {
  if (rentals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white px-6 py-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <h3 className="font-bricolage text-xl font-medium">No rentals yet</h3>
        <p className="text-carbon-500 mt-2 max-w-sm text-sm leading-6">
          This property has no rental history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rentals.map((rental) => (
        <section
          key={rental.id}
          className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]"
        >
          <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
            Rental information
          </h2>
          <div>
            <div className="mt-5">
              <h3 className="font-bricolage text-lg font-medium">
                {rental.renter}
              </h3>
              <p className="text-carbon-500 mt-1 text-sm">
                {rental.start} – {rental.end}
              </p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-carbon-400 text-xs">Monthly rent</dt>
              <dd className="mt-1">
                <span className="font-medium">
                  {rental.rent.replace(/\s*\/\s*month$/i, "")}
                </span>{" "}
                <span className="text-carbon-500 text-xs font-normal">
                  per month
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-carbon-400 text-xs">Agreement</dt>
              <dd className="mt-1">
                <StatusPill status={rental.agreementStatus} />
              </dd>
            </div>
            <div>
              <dt className="text-carbon-400 text-xs">Deposit</dt>
              <dd className="mt-1">
                <StatusPill status={rental.depositStatus} />
              </dd>
            </div>
          </dl>
          <p className="text-carbon-500 mt-5 border-t border-black/8 pt-4 text-sm">
            {rental.note}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(() => {
              // Messages Synchronization phase -- Section 37/83: resolves
              // the SAME participant/conversation as the standalone
              // Rentals workspace's own Message action, using stable ids
              // instead of the PM's display name.
              const target = propertyManager
                ? {
                    id: propertyManager.professionalId,
                    name: propertyManager.name,
                  }
                : rental.renter === RENTER_DEMO_NAME
                  ? { id: RENTER_PARTICIPANT_ID, name: rental.renter }
                  : null;
              if (!target) return null;
              const conversation = getOrCreateConversation(
                OWNER_PARTICIPANT_ID,
                target.id,
                {
                  type: "rental",
                  propertyId: rental.propertyId,
                  rentalId: rental.id,
                  label: "Rental",
                },
              );
              if (!conversation) return null;
              return (
                <Link
                  href={`/owner-dashboard/messages?open=${conversation.id}`}
                  className="font-bricolage inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-medium hover:border-black"
                >
                  <MessageSquare aria-hidden="true" className="size-4" />
                  Message {target.name}
                </Link>
              );
            })()}
          </div>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

const PAYMENT_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function paymentDateValue(date: string) {
  const match = date.match(
    /(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/,
  );
  if (!match) return 0;

  return Date.UTC(
    Number(match[3]),
    PAYMENT_MONTHS.indexOf(match[2]),
    Number(match[1]),
  );
}

function PaymentsTab({ payments }: { payments: OwnerPayment[] }) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white px-6 py-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <h3 className="font-bricolage text-xl font-medium">No payments yet</h3>
        <p className="text-carbon-500 mt-2 max-w-sm text-sm leading-6">
          Rent payments for this property will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
      <h2 className="font-bricolage text-carbon-900 px-5 pt-6 text-lg font-medium">
        Payment history
      </h2>
      <div className="mt-2 divide-y divide-black/8">
        {[...payments]
          .sort(
            (first, second) =>
              paymentDateValue(second.date) - paymentDateValue(first.date),
          )
          .map((payment) => (
            <div key={payment.id} className="flex flex-col gap-3 p-5">
              <div>
                <p className="font-medium">{payment.purpose}</p>
                <p className="text-carbon-500 mt-1 text-sm">
                  {payment.renter} · {payment.date}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bricolage text-lg font-medium">
                  {payment.amount}
                </span>
                <StatusPill status={payment.status} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Maintenance
// ---------------------------------------------------------------------------

function MaintenanceTab({ requests }: { requests: MaintenanceRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white px-6 py-16 text-center shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <h3 className="font-bricolage text-xl font-medium">
          No maintenance requests
        </h3>
        <p className="text-carbon-500 mt-2 max-w-sm text-sm leading-6">
          Nothing has been reported for this property.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
      <h2 className="font-bricolage text-carbon-900 px-5 pt-6 text-lg font-medium">
        Maintenance requests
      </h2>
      <div className="mt-2 divide-y divide-black/8">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="flex items-center gap-2 font-medium">
                {request.title}
                {request.urgency === "Urgent" ? (
                  <StatusPill status="Urgent" />
                ) : null}
              </p>
              <p className="text-carbon-500 mt-1 text-sm">
                Reported by {request.reportedBy} · Managed by{" "}
                {request.managedBy ?? "You"}
                {request.scheduledVisit
                  ? ` · ${request.scheduledVisit.contact}`
                  : ""}
              </p>
            </div>
            <StatusPill status={request.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Team — who owns this property and who's actively delegated to work on it.
// "Assign Team Member" only ever offers ACTIVE team members (see
// PickTeamMemberDialog above); a registered professional who hasn't joined
// this Owner's team can't be assigned here at all.
// ---------------------------------------------------------------------------

function TeamTab({
  property,
  onPick,
  onInvite,
}: {
  property: NonNullable<ReturnType<typeof getOwnerProperty>>;
  onPick: (role: ProfessionalRole) => void;
  onInvite: () => void;
}) {
  const hasAgentsOnTeam = getActiveMemberships(TEAM_ID).some(
    (m) => m.role === "agent",
  );
  const hasPmsOnTeam = getActiveMemberships(TEAM_ID).some(
    (m) => m.role === "property_manager",
  );
  const propertyManagerProfessional = property.propertyManager
    ? REGISTERED_PROFESSIONALS.find(
        (professional) =>
          professional.id === property.propertyManager?.professionalId,
      )
    : null;
  const agentProfessional = property.agent
    ? REGISTERED_PROFESSIONALS.find(
        (professional) => professional.id === property.agent?.professionalId,
      )
    : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
          <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
            Property Manager
          </h2>
          {property.propertyManager ? (
            <>
              <div className="mt-5 flex items-center gap-3">
                <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-black text-sm font-medium text-white">
                  {propertyManagerProfessional?.avatar ? (
                    <Image
                      src={propertyManagerProfessional.avatar}
                      alt={`${property.propertyManager.name} profile`}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    property.propertyManager.name.slice(0, 1)
                  )}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-medium">
                    {property.propertyManager.name}
                    {property.propertyManager.verified ? (
                      <BadgeCheck
                        aria-label="Verified"
                        className="size-4 fill-black text-white"
                      />
                    ) : null}
                  </p>
                </div>
              </div>
              <p className="text-carbon-400 mt-4 text-xs">Responsibilities</p>
              <ul className="text-carbon-600 mt-2 space-y-1.5 text-sm">
                {property.propertyManager.responsibilities.map(
                  (responsibility) => (
                    <li key={responsibility} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-black"
                      />
                      <span>{responsibility}</span>
                    </li>
                  ),
                )}
              </ul>
              <p className="text-carbon-500 mt-3 text-xs">
                Manage Agents:{" "}
                <span className="text-carbon-900 font-medium">
                  {property.propertyManager.canManageAgents
                    ? "Allowed"
                    : "Not allowed"}
                </span>
              </p>
              <div className="mt-5">
                {property.propertyManager.membershipId ? (
                  <Link
                    href={`/owner-dashboard/team/${property.propertyManager.membershipId}`}
                    className="font-bricolage inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-sm font-medium hover:border-black"
                  >
                    Manage Access
                  </Link>
                ) : null}
              </div>
            </>
          ) : hasPmsOnTeam ? (
            <>
              <p className="text-carbon-500 mt-4 text-sm">
                No Property Manager assigned. You are managing this property
                yourself.
              </p>
              <button
                type="button"
                onClick={() => onPick("property_manager")}
                className="font-bricolage mt-5 inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
              >
                Assign Team Member
              </button>
            </>
          ) : (
            <>
              <p className="text-carbon-500 mt-4 text-sm">
                No Property Managers are currently on your team.
              </p>
              <button
                type="button"
                onClick={onInvite}
                className="font-bricolage mt-5 inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
              >
                Invite Property Manager
              </button>
            </>
          )}
        </section>

        <section className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
          <h2 className="font-bricolage text-carbon-900 text-lg font-medium">
            Agent
          </h2>
          {property.agent ? (
            <>
              <div className="mt-5 flex items-center gap-3">
                <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-black text-sm font-medium text-white">
                  {agentProfessional?.avatar ? (
                    <Image
                      src={agentProfessional.avatar}
                      alt={`${property.agent.name} profile`}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    property.agent.name.slice(0, 1)
                  )}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-medium">
                    {property.agent.name}
                    {property.agent.verified ? (
                      <BadgeCheck
                        aria-label="Verified"
                        className="size-4 fill-black text-white"
                      />
                    ) : null}
                  </p>
                </div>
              </div>
              <p className="text-carbon-400 mt-4 text-xs">Responsibilities</p>
              <ul className="text-carbon-600 mt-2 space-y-1.5 text-sm">
                {property.agent.responsibilities.map((responsibility) => (
                  <li key={responsibility} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-black"
                    />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
              <p className="text-carbon-400 mt-3 text-xs">
                Assigned by{" "}
                <span className="text-carbon-600 font-medium">
                  {property.agent.assignedBy}
                </span>
                {property.agent.assignedByProfessionalId
                  ? " · Property Manager"
                  : ""}
              </p>
              <div className="mt-5">
                {property.agent.membershipId ? (
                  <Link
                    href={`/owner-dashboard/team/${property.agent.membershipId}`}
                    className="font-bricolage inline-flex h-10 items-center rounded-full border border-black/15 px-4 text-sm font-medium hover:border-black"
                  >
                    Manage Access
                  </Link>
                ) : null}
              </div>
            </>
          ) : hasAgentsOnTeam ? (
            <>
              <p className="text-carbon-500 mt-4 text-sm">
                No Agent is currently assigned to this property.
              </p>
              <button
                type="button"
                onClick={() => onPick("agent")}
                className="font-bricolage mt-5 inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
              >
                Assign Team Member
              </button>
            </>
          ) : (
            <>
              <p className="text-carbon-500 mt-4 text-sm">
                No Agents are currently on your team.
              </p>
              <button
                type="button"
                onClick={onInvite}
                className="font-bricolage mt-5 inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
              >
                Invite Agent
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

// Kept temporarily for the existing assignment workflow while the compact
// Assigned To card is the only rendered team surface on this page.
void TeamTab;

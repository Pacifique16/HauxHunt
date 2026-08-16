"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPinned,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import house1 from "@/assets/images/house1.jpg";
import house2 from "@/assets/images/house2.jpg";
import house3 from "@/assets/images/house3.jpg";
import house4 from "@/assets/images/house4.jpg";
import house5 from "@/assets/images/house5.jpg";
import house6 from "@/assets/images/house6.jpeg";
import emptyIllustration from "@/assets/images/empty.png";
import julienProfile from "@/assets/images/julien.jpg";
import scheduleIllustration from "@/assets/images/schedule.png";
import cancelIllustration from "@/assets/images/cancel.png";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { useViewingRequests } from "@/hooks/use-viewing-requests";

type Tab = "upcoming" | "pending" | "past";
type ViewingStatus =
  | "Confirmed"
  | "Awaiting Confirmation"
  | "New Time Suggested"
  | "Reschedule Requested"
  | "Completed"
  | "Cancelled"
  | "Viewing unavailable"
  | "Not interested";
type Viewing = {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: ViewingStatus;
  tab: Tab;
  host: string;
  role: string;
  image: StaticImageData;
  suggestedTime?: string;
  cancelledBy?: string;
  note?: string;
};
type StatusFilter = "all" | ViewingStatus;
const STATUS_OPTIONS: StatusFilter[] = [
  "all",
  "Confirmed",
  "Awaiting Confirmation",
  "New Time Suggested",
  "Reschedule Requested",
  "Completed",
  "Cancelled",
  "Viewing unavailable",
  "Not interested",
];
const tabForStatus = (status: ViewingStatus): Tab =>
  status === "Confirmed"
    ? "upcoming"
    : [
          "Awaiting Confirmation",
          "New Time Suggested",
          "Reschedule Requested",
        ].includes(status)
      ? "pending"
      : "past";

const INITIAL_VIEWINGS: Viewing[] = [
  {
    id: "confirmed-kacyiru",
    propertyId: "kacyiru-2br",
    title: "Kacyiru Residence",
    location: "Kacyiru, Kigali",
    date: "Saturday, 22 August",
    time: "10:30 AM",
    status: "Confirmed",
    tab: "upcoming",
    host: "Jean Mugisha",
    role: "Property Manager",
    image: house1,
    note: "Ask about parking and whether utilities are included.",
  },
  {
    id: "confirmed-nyarutarama",
    propertyId: "nyarutarama-2br",
    title: "Nyarutarama Garden Apartment",
    location: "Nyarutarama, Kigali",
    date: "Wednesday, 26 August",
    time: "3:30 PM",
    status: "Confirmed",
    tab: "upcoming",
    host: "Aline Uwase",
    role: "Verified Agent",
    image: house2,
  },
  {
    id: "pending-kimihurura",
    propertyId: "remera-3br",
    title: "Modern Apartment in Kimihurura",
    location: "Kimihurura, Kigali",
    date: "Monday, 24 August",
    time: "2:00 PM",
    status: "Awaiting Confirmation",
    tab: "pending",
    host: "Sarah Uwase",
    role: "Verified Agent",
    image: house3,
  },
  {
    id: "suggested-kacyiru",
    propertyId: "kibagabaga-modern-family-home",
    title: "Kacyiru Heights",
    location: "Kacyiru, Kigali",
    date: "Tuesday, 25 August",
    time: "11:00 AM",
    suggestedTime: "2:30 PM",
    status: "New Time Suggested",
    tab: "pending",
    host: "Jean Mugisha",
    role: "Property Manager",
    image: house4,
  },
  {
    id: "completed-kibagabaga",
    propertyId: "kibagabaga-modern-family-home",
    title: "Kibagabaga Apartment",
    location: "Kibagabaga, Kigali",
    date: "12 August 2026",
    time: "11:00 AM",
    status: "Completed",
    tab: "past",
    host: "Julien Mugisha",
    role: "Property Manager",
    image: house5,
  },
  {
    id: "cancelled-nyarutarama",
    propertyId: "nyarutarama-garden-penthouse",
    title: "Nyarutarama Family Home",
    location: "Nyarutarama, Kigali",
    date: "9 August 2026",
    time: "3:00 PM",
    status: "Cancelled",
    tab: "past",
    host: "Aline Uwase",
    role: "Agent",
    image: house6,
    cancelledBy: "Cancelled by you",
  },
  {
    id: "declined-kimihurura",
    propertyId: "remera-3br",
    title: "Kimihurura Loft",
    location: "Kimihurura, Kigali",
    date: "7 August 2026",
    time: "1:00 PM",
    status: "Viewing unavailable",
    tab: "past",
    host: "Sarah Uwase",
    role: "Agent",
    image: house3,
  },
];

type Dialog = {
  type: "details" | "reschedule" | "cancel" | "not-interested";
  viewing: Viewing;
} | null;

export default function MyViewingsPage() {
  const requests = useViewingRequests();
  const requestedViewings = useMemo<Viewing[]>(
    () =>
      requests.map((request) => ({
        ...request,
        status: "Awaiting Confirmation",
        tab: "pending",
        host: "Julien Mugisha",
        role: "Property Manager",
        image: house1,
      })),
    [requests],
  );
  const [viewings, setViewings] = useState(INITIAL_VIEWINGS);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [propertySearch, setPropertySearch] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);
  const allViewings = [...requestedViewings, ...viewings];
  const normalizedSearch = propertySearch.trim().toLocaleLowerCase();
  const filtersActive = statusFilter !== "all" || normalizedSearch.length > 0;
  const shown = allViewings.filter(
    (viewing) =>
      (filtersActive || viewing.tab === tab) &&
      (statusFilter === "all" || viewing.status === statusFilter) &&
      (!normalizedSearch ||
        viewing.title.toLocaleLowerCase().includes(normalizedSearch)),
  );
  const counts = {
    upcoming: allViewings.filter((item) => item.tab === "upcoming").length,
    pending: allViewings.filter((item) => item.tab === "pending").length,
    past: allViewings.filter((item) => item.tab === "past").length,
  };

  function updateViewing(id: string, updates: Partial<Viewing>) {
    setViewings((items) =>
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="bg-carbon-50 px-5 pt-9 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <h1 className="dashboard-page-title">My Viewings</h1>
            <p className="text-carbon-500 mt-3 max-w-2xl text-sm leading-6">
              Manage your upcoming property visits and keep track of homes
              you&apos;ve already viewed.
            </p>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div className="flex gap-7 overflow-x-auto">
                {(["upcoming", "pending", "past"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setTab(item);
                      setStatusFilter("all");
                      setPropertySearch("");
                    }}
                    className={`relative flex h-12 items-center gap-2 text-sm font-medium capitalize ${tab === item ? "text-black" : "text-black/45"}`}
                  >
                    {item}
                    <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-xs">
                      {counts[item]}
                    </span>
                    {tab === item ? (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="flex w-full gap-3 pb-2 md:w-auto">
                <label className="relative block min-w-0 flex-1 md:w-72 md:flex-none">
                  <span className="sr-only">Search by property name</span>
                  <Search
                    aria-hidden="true"
                    className="text-carbon-500 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                  />
                  <input
                    type="search"
                    value={propertySearch}
                    onChange={(event) => setPropertySearch(event.target.value)}
                    placeholder="Search by property name"
                    className="h-10 w-full rounded-full bg-white pr-4 pl-11 text-sm outline-none"
                  />
                </label>
                <label className="relative block w-44 sm:w-56">
                  <span className="sr-only">Filter by viewing status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      const status = event.target.value as StatusFilter;
                      setStatusFilter(status);
                      if (status !== "all") setTab(tabForStatus(status));
                    }}
                    className="h-10 w-full appearance-none rounded-full bg-white pr-10 pl-4 text-sm outline-none"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All statuses" : status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="text-carbon-500 pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>
        <section className="px-5 pt-5 pb-9 sm:px-6 lg:px-11 lg:pb-12 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            {shown.length ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {shown.map((viewing) => (
                  <ViewingCard
                    key={viewing.id}
                    viewing={viewing}
                    onDetails={() => setDialog({ type: "details", viewing })}
                    onReschedule={() =>
                      setDialog({ type: "reschedule", viewing })
                    }
                    onCancel={() => setDialog({ type: "cancel", viewing })}
                    onNotInterested={() =>
                      setDialog({ type: "not-interested", viewing })
                    }
                    onAccept={() =>
                      updateViewing(viewing.id, {
                        status: "Confirmed",
                        tab: "upcoming",
                        time: viewing.suggestedTime ?? viewing.time,
                      })
                    }
                  />
                ))}
              </div>
            ) : filtersActive ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                <Image
                  src={emptyIllustration}
                  alt=""
                  className="h-40 w-auto object-contain"
                />
                <h2 className="font-bricolage mt-5 text-2xl font-medium">
                  No matching viewings
                </h2>
                <p className="text-carbon-500 mt-2 text-sm">
                  Try another property name or viewing status.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPropertySearch("");
                    setStatusFilter("all");
                  }}
                  className="mt-6 rounded-full border border-black/15 px-5 py-3 text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <EmptyState tab={tab} />
            )}
          </div>
        </section>
      </main>
      {dialog ? (
        <ViewingDialog
          dialog={dialog}
          onClose={() => setDialog(null)}
          onUpdate={(updates) => {
            updateViewing(dialog.viewing.id, updates);
            setDialog(null);
          }}
        />
      ) : null}
    </>
  );
}

function ViewingCard({
  viewing,
  onDetails,
  onReschedule,
  onCancel,
  onNotInterested,
  onAccept,
}: {
  viewing: Viewing;
  onDetails: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onNotInterested: () => void;
  onAccept: () => void;
}) {
  const messageHref = `/renter-dashboard/messages?property=${encodeURIComponent(viewing.title)}&host=${encodeURIComponent(viewing.host)}&viewing=${encodeURIComponent(`${viewing.status} · ${viewing.date} · ${viewing.time}`)}`;
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-white/70 backdrop-blur-xl sm:grid sm:grid-cols-[210px_1fr]">
      <Image
        src={viewing.image}
        alt={viewing.title}
        className="h-40 w-full object-cover sm:h-full"
      />
      <div className="flex min-w-0 flex-col p-4">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:pr-40">
          <div>
            <p className="text-carbon-500 text-sm">{viewing.location}</p>
            <h2 className="font-bricolage mt-1 text-2xl font-medium tracking-[-0.03em]">
              {viewing.title}
            </h2>
          </div>
          <Status label={viewing.status} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4" />
            {viewing.date}
          </p>
          <p className="flex items-center gap-2 text-sm font-medium">
            <Clock3 className="size-4" />
            {viewing.time}
          </p>
        </div>
        {viewing.status === "New Time Suggested" ? (
          <div className="mt-3 rounded-2xl bg-black/[0.045] p-3 text-sm">
            <p className="text-carbon-500">New time suggested</p>
            <p className="mt-1 font-medium">
              {viewing.date} · {viewing.suggestedTime}
            </p>
          </div>
        ) : null}
        {viewing.status === "Awaiting Confirmation" ? (
          <p className="text-carbon-500 mt-3 text-sm">
            The property representative has not confirmed this viewing yet.
          </p>
        ) : null}
        <div className="mt-3 flex items-center gap-3">
          <Image
            src={julienProfile}
            alt=""
            className="size-9 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{viewing.host}</p>
            <p className="text-carbon-500 flex items-center gap-1 text-xs">
              <BadgeCheck className="size-3.5" />
              {viewing.role}
            </p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {viewing.status === "Confirmed" ? (
            <>
              <button
                onClick={onDetails}
                className="h-10 rounded-full bg-black px-4 text-sm font-medium text-white"
              >
                View Details
              </button>
              <ActionLink
                href={messageHref}
                label="Message"
                icon={MessageCircle}
              />
              <a
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(viewing.location)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm"
              >
                <MapPinned className="size-4" />
                Get Directions
              </a>
              <button
                onClick={onReschedule}
                className="h-10 rounded-full border border-black/15 px-4 text-sm"
              >
                Reschedule
              </button>
              <button
                onClick={onCancel}
                className="h-10 px-2 text-sm text-red-600"
              >
                Cancel Viewing
              </button>
            </>
          ) : null}
          {viewing.status === "Awaiting Confirmation" ||
          viewing.status === "Reschedule Requested" ? (
            <>
              <ActionLink
                href={`/properties/${viewing.propertyId}?from=renter`}
                label="View Listing"
              />
              <ActionLink href={messageHref} label="Message" />
              <button
                onClick={onReschedule}
                className="h-10 rounded-full border border-black/15 px-4 text-sm"
              >
                Change Requested Time
              </button>
              <button
                onClick={onCancel}
                className="h-10 px-2 text-sm text-red-600"
              >
                Cancel Request
              </button>
            </>
          ) : null}
          {viewing.status === "New Time Suggested" ? (
            <>
              <button
                onClick={onAccept}
                className="h-10 rounded-full bg-black px-4 text-sm text-white"
              >
                Accept New Time
              </button>
              <button
                onClick={onReschedule}
                className="h-10 rounded-full border border-black/15 px-4 text-sm"
              >
                Suggest Another Time
              </button>
              <ActionLink href={messageHref} label="Message" />
            </>
          ) : null}
          {viewing.status === "Completed" ? (
            <>
              <ActionLink
                href={`/renter-dashboard/applications/new?property=${viewing.propertyId}`}
                label="Apply Now"
                primary
              />
              <ActionLink
                href={`/properties/${viewing.propertyId}?from=renter`}
                label="View Listing"
              />
              <button onClick={onNotInterested} className="h-10 px-3 text-sm">
                Not Interested
              </button>
            </>
          ) : null}
          {viewing.status === "Cancelled" ||
          viewing.status === "Viewing unavailable" ||
          viewing.status === "Not interested" ? (
            <>
              <ActionLink
                href={`/properties/${viewing.propertyId}?from=renter`}
                label="View Listing"
              />
              {viewing.status === "Viewing unavailable" ? (
                <button
                  onClick={onReschedule}
                  className="h-10 rounded-full border border-black/15 px-4 text-sm"
                >
                  Request Another Time
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Status({ label }: { label: ViewingStatus }) {
  const dark = label === "Confirmed" || label === "Completed";
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap sm:absolute sm:top-4 sm:right-4 ${dark ? "bg-black text-white" : "bg-black/[0.06] text-black"}`}
    >
      {label}
    </span>
  );
}
function ActionLink({
  href,
  label,
  primary = false,
  icon: Icon,
}: {
  href: string;
  label: string;
  primary?: boolean;
  icon?: typeof MessageCircle;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm ${primary ? "border-black bg-black text-white" : "border-black/15"}`}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </Link>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const copy =
    tab === "upcoming"
      ? [
          "No upcoming viewings",
          "Found a home you like? Request a viewing to see it in person.",
          "Browse Listings",
        ]
      : tab === "pending"
        ? [
            "No viewing requests waiting",
            "Any viewing requests awaiting confirmation will appear here.",
            "",
          ]
        : [
            "No viewing history yet",
            "Properties you've visited will appear here.",
            "Find a Home",
          ];
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
      <Image src={emptyIllustration} alt="" className="h-40 w-auto" />
      <h2 className="font-bricolage mt-5 text-2xl font-medium">{copy[0]}</h2>
      <p className="text-carbon-500 mt-2 text-sm">{copy[1]}</p>
      {copy[2] ? (
        <Link
          href="/renter-dashboard/properties"
          className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
        >
          {copy[2]}
        </Link>
      ) : null}
    </div>
  );
}

function ViewingDialog({
  dialog,
  onClose,
  onUpdate,
}: {
  dialog: NonNullable<Dialog>;
  onClose: () => void;
  onUpdate: (updates: Partial<Viewing>) => void;
}) {
  const [date, setDate] = useState("2026-08-28");
  const [time, setTime] = useState("10:30 AM");
  const [note, setNote] = useState(dialog.viewing.note ?? "");
  const [reason, setReason] = useState("");
  const titles = {
    details: "Viewing Details",
    reschedule: "Choose another date and time",
    cancel: "Cancel this viewing?",
    "not-interested": "Mark as not interested?",
  };
  if (dialog.type === "reschedule") {
    return (
      <RescheduleDialog
        viewing={dialog.viewing}
        date={date}
        time={time}
        onDateChange={setDate}
        onTimeChange={setTime}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    );
  }
  if (dialog.type === "cancel") {
    return (
      <CancelViewingDialog
        viewing={dialog.viewing}
        onClose={onClose}
        onUpdate={onUpdate}
      />
    );
  }
  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/35 p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between gap-4">
          <div>
            <h2 className="font-bricolage text-3xl font-medium">
              {titles[dialog.type]}
            </h2>
            <p className="text-carbon-500 mt-2 text-sm">
              {dialog.viewing.title} · {dialog.viewing.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-black/15"
          >
            <X className="size-4" />
          </button>
        </div>
        {dialog.type === "details" ? (
          <div className="mt-7 space-y-5">
            <Image
              src={dialog.viewing.image}
              alt=""
              className="h-48 w-full rounded-2xl object-cover"
            />
            <section>
              <h3 className="text-sm font-medium">Viewing</h3>
              <p className="text-carbon-500 mt-2 text-sm">
                {dialog.viewing.status} · {dialog.viewing.date} ·{" "}
                {dialog.viewing.time}
              </p>
            </section>
            <section className="flex items-center gap-3">
              <Image
                src={julienProfile}
                alt=""
                className="size-11 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{dialog.viewing.host}</p>
                <p className="text-carbon-500 text-sm">
                  {dialog.viewing.role} · Verified
                </p>
              </div>
            </section>
            <label>
              <span className="mb-2 block text-sm font-medium">Notes</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-black/15 p-4 text-sm"
              />
            </label>
            <div className="flex gap-3">
              <ActionLink
                href={`/properties/${dialog.viewing.propertyId}?from=renter`}
                label="View Full Listing"
                primary
              />
              <button
                onClick={() => onUpdate({ note })}
                className="h-10 rounded-full border border-black/15 px-4 text-sm"
              >
                Save Note
              </button>
            </div>
          </div>
        ) : null}
        {dialog.type === "not-interested" ? (
          <div className="mt-7">
            <p className="text-carbon-500 text-sm">
              This helps keep your viewing history organized. A reason is
              optional.
            </p>
            <span className="relative mt-5 block">
              <select
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="h-11 w-full appearance-none rounded-full border border-black/15 pr-11 pl-4 text-sm"
              >
                <option value="">No reason</option>
                {[
                  "Too expensive",
                  "Location",
                  "Property condition",
                  "Size/layout",
                  "Found another property",
                  "Other",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-black/55" />
            </span>
            <DialogActions
              onClose={onClose}
              action="Mark Not Interested"
              onAction={() => onUpdate({ status: "Not interested" })}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CancelViewingDialog({
  viewing,
  onClose,
  onUpdate,
}: {
  viewing: Viewing;
  onClose: () => void;
  onUpdate: (updates: Partial<Viewing>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/25 p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-viewing-title"
        className="grid w-full max-w-xl overflow-hidden bg-white text-left shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-48 items-center justify-center bg-black/[0.06] p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cancel viewing dialog"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-black/20 text-black/55 hover:border-black/40 hover:text-black"
          >
            <X className="size-5" />
          </button>
          <Image
            src={cancelIllustration}
            alt="Cancelled appointment illustration"
            className="h-40 w-auto object-contain"
          />
        </div>
        <div className="p-6 sm:p-8">
          <h2
            id="cancel-viewing-title"
            className="font-bricolage text-2xl font-medium"
          >
            Cancel this viewing?
          </h2>
          <p className="text-carbon-500 mt-2 text-sm">
            {viewing.title} · {viewing.date} · {viewing.time}
          </p>
          <p className="text-carbon-600 mt-5 text-sm leading-6">
            The property representative will be notified that you can no longer
            attend.
          </p>
          <DialogActions
            onClose={onClose}
            action="Cancel Viewing"
            destructive
            onAction={() =>
              onUpdate({
                status: "Cancelled",
                tab: "past",
                cancelledBy: "Cancelled by you",
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function RescheduleDialog({
  viewing,
  date,
  time,
  onDateChange,
  onTimeChange,
  onClose,
  onUpdate,
}: {
  viewing: Viewing;
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onClose: () => void;
  onUpdate: (updates: Partial<Viewing>) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[180] flex items-center justify-center bg-black/25 p-5"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-viewing-title"
        className="grid max-h-[92svh] w-full max-w-xl overflow-y-auto bg-white text-left shadow-[0_30px_90px_rgba(0,0,0,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-48 items-center justify-center bg-black/[0.06] p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reschedule dialog"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-black/20 text-black/55 hover:border-black/40 hover:text-black"
          >
            <X className="size-5" />
          </button>
          <Image
            src={scheduleIllustration}
            alt="Calendar and clock illustration"
            className="h-40 w-auto object-contain"
          />
        </div>
        <div className="p-6 sm:p-8">
          <h2
            id="reschedule-viewing-title"
            className="font-bricolage text-2xl font-medium"
          >
            Choose another date and time
          </h2>
          <p className="text-carbon-500 mt-2 text-sm">
            {viewing.title} · {viewing.location}
          </p>
          <p className="mt-5 bg-black/[0.045] p-4 text-sm">
            Current: {viewing.date} · {viewing.time}
          </p>
          <input
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
            className="mt-5 h-11 w-full rounded-2xl border border-black/15 px-4"
          />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {["09:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"].map((slot) => (
              <button
                key={slot}
                onClick={() => onTimeChange(slot)}
                className={`h-10 rounded-full border text-sm ${time === slot ? "bg-black text-white" : "border-black/15"}`}
              >
                {slot}
              </button>
            ))}
          </div>
          <p className="text-carbon-500 mt-4 text-sm">
            The property representative will need to confirm the new time.
          </p>
          <DialogActions
            onClose={onClose}
            action="Request New Time"
            onAction={() =>
              onUpdate({
                date,
                time,
                status: "Reschedule Requested",
                tab: "pending",
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

function DialogActions({
  onClose,
  action,
  onAction,
  destructive = false,
}: {
  onClose: () => void;
  action: string;
  onAction: () => void;
  destructive?: boolean;
}) {
  return (
    <div className="mt-7 flex justify-end gap-3">
      <button
        onClick={onClose}
        className="h-11 rounded-full border border-black/15 px-5 text-sm"
      >
        Cancel
      </button>
      <button
        onClick={onAction}
        className={`h-11 rounded-full px-6 text-sm font-medium text-white ${destructive ? "bg-red-600" : "bg-black"}`}
      >
        {action}
      </button>
    </div>
  );
}

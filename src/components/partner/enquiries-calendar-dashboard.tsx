"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Send,
} from "lucide-react";

type EnquiryStatus = "New" | "Awaiting reply" | "Viewing booked" | "Replied";

type Enquiry = {
  id: number;
  name: string;
  initials: string;
  email: string;
  phone: string;
  property: string;
  location: string;
  received: string;
  status: EnquiryStatus;
  message: string;
  moveIn: string;
  occupants: string;
  viewing: string | null;
};

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 1,
    name: "Aline Uwase",
    initials: "AU",
    email: "aline.uwase@example.com",
    phone: "+250 788 204 118",
    property: "Modern 3-bedroom house",
    location: "Kacyiru, Kigali",
    received: "12 min ago",
    status: "New",
    message:
      "Hello, is the house still available? We are relocating to Kigali and would like to view it this week if possible.",
    moveIn: "01 Sep 2026",
    occupants: "2 adults, 1 child",
    viewing: null,
  },
  {
    id: 2,
    name: "David Kimani",
    initials: "DK",
    email: "david.kimani@example.com",
    phone: "+254 712 480 306",
    property: "Bright two-bedroom apartment",
    location: "Kilimani, Nairobi",
    received: "38 min ago",
    status: "Awaiting reply",
    message:
      "Could you confirm whether utilities and parking are included in the monthly rent? I am available after work.",
    moveIn: "15 Aug 2026",
    occupants: "2 adults",
    viewing: null,
  },
  {
    id: 3,
    name: "Chidera Okafor",
    initials: "CO",
    email: "chidera.okafor@example.com",
    phone: "+234 803 114 7290",
    property: "Waterfront apartment",
    location: "Ikoyi, Lagos",
    received: "Yesterday",
    status: "Viewing booked",
    message:
      "Thank you for the details. Friday afternoon works well for me and my partner. Please share the entrance instructions.",
    moveIn: "01 Oct 2026",
    occupants: "2 adults",
    viewing: "Fri, 14 Aug · 2:30 PM",
  },
  {
    id: 4,
    name: "Maya Thompson",
    initials: "MT",
    email: "maya.thompson@example.com",
    phone: "+250 783 641 920",
    property: "Lake-view residence",
    location: "Gisenyi, Rwanda",
    received: "Yesterday",
    status: "Replied",
    message:
      "Is a six-month lease possible? I am looking for a furnished home while completing a project in Rwanda.",
    moveIn: "20 Aug 2026",
    occupants: "1 adult",
    viewing: null,
  },
  {
    id: 5,
    name: "Eric Mugisha",
    initials: "EM",
    email: "eric.mugisha@example.com",
    phone: "+250 790 332 504",
    property: "Family home with garden",
    location: "Gacuriro, Kigali",
    received: "02 Aug 2026",
    status: "Viewing booked",
    message:
      "We would like to see the garden and understand the maintenance arrangements before applying.",
    moveIn: "01 Sep 2026",
    occupants: "2 adults, 2 children",
    viewing: "Mon, 10 Aug · 10:00 AM",
  },
];

const VIEWINGS = [
  {
    day: 1,
    time: "10:00",
    name: "Eric Mugisha",
    property: "Family home with garden",
    tone: "black",
  },
  {
    day: 2,
    time: "16:30",
    name: "Aline Uwase",
    property: "Modern 3-bedroom house",
    tone: "light",
  },
  {
    day: 4,
    time: "11:00",
    name: "David Kimani",
    property: "Bright two-bedroom apartment",
    tone: "light",
  },
  {
    day: 5,
    time: "14:30",
    name: "Chidera Okafor",
    property: "Waterfront apartment",
    tone: "black",
  },
  {
    day: 6,
    time: "09:30",
    name: "Maya Thompson",
    property: "Lake-view residence",
    tone: "light",
  },
] as const;

export function EnquiriesCalendarDashboard() {
  const [view, setView] = useState<"enquiries" | "calendar">("enquiries");
  const [enquiries, setEnquiries] = useState(INITIAL_ENQUIRIES);
  const [selectedId, setSelectedId] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All enquiries");
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const selected =
    enquiries.find((enquiry) => enquiry.id === selectedId) ?? enquiries[0];
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesStatus =
      statusFilter === "All enquiries" || enquiry.status === statusFilter;
    const searchValue =
      `${enquiry.name} ${enquiry.property} ${enquiry.location}`.toLowerCase();
    return matchesStatus && searchValue.includes(query.toLowerCase());
  });
  const weekDays = useMemo(() => {
    const start = new Date(2026, 7, 9 + weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [weekOffset]);

  function markReplied() {
    if (!reply.trim()) return;
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === selected.id
          ? { ...enquiry, status: "Replied" }
          : enquiry,
      ),
    );
    setReply("");
  }

  function scheduleViewing() {
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === selected.id
          ? {
              ...enquiry,
              status: "Viewing booked",
              viewing: "Tue, 11 Aug · 4:30 PM",
            }
          : enquiry,
      ),
    );
    setView("calendar");
  }

  return (
    <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
      <div className="mx-auto max-w-[1360px]">
        <header className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-bricolage text-carbon-900 text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.92] font-medium tracking-[-0.055em]">
              Enquiries &amp; calendar
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Respond quickly, qualify renter interest, and keep property
              viewings organised.
            </p>
          </div>
          <div className="flex w-fit border border-black/12 bg-white p-1">
            {(["enquiries", "calendar"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={`h-10 px-5 text-sm font-medium capitalize transition-colors ${view === item ? "bg-black text-white" : "text-black/50 hover:text-black"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <div className="grid border-b border-black/10 sm:grid-cols-3">
          <StatusRail
            label="Needs attention"
            value="7"
            note="New and awaiting reply"
          />
          <StatusRail
            label="Viewings this week"
            value="5"
            note="Across four properties"
          />
          <StatusRail
            label="Response time"
            value="1h 24m"
            note="18 minutes faster this week"
          />
        </div>

        {view === "enquiries" ? (
          <div className="mt-8 grid min-h-[680px] overflow-hidden border border-black/10 bg-white xl:grid-cols-[minmax(330px,0.72fr)_minmax(0,1.28fr)]">
            <aside className="border-b border-black/10 xl:border-r xl:border-b-0">
              <div className="flex gap-2 border-b border-black/10 p-4">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Search enquiries</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search enquiries"
                    className="h-11 w-full bg-black/[0.035] pr-10 pl-4 text-sm outline-none"
                  />
                  <Search className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-black/35" />
                </label>
                <label className="relative shrink-0">
                  <span className="sr-only">Filter enquiries</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-11 max-w-36 appearance-none bg-black/[0.035] pr-9 pl-3 text-xs font-medium outline-none"
                  >
                    <option>All enquiries</option>
                    <option>New</option>
                    <option>Awaiting reply</option>
                    <option>Viewing booked</option>
                    <option>Replied</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
                </label>
              </div>
              <div className="max-h-[610px] overflow-y-auto">
                {filteredEnquiries.map((enquiry) => (
                  <button
                    key={enquiry.id}
                    type="button"
                    onClick={() => setSelectedId(enquiry.id)}
                    className={`relative block w-full border-b border-black/8 p-5 text-left transition-colors ${selected.id === enquiry.id ? "bg-black/[0.055] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-black" : "hover:bg-black/[0.025]"}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                        {enquiry.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <strong className="truncate text-sm font-medium">
                            {enquiry.name}
                          </strong>
                          <span className="shrink-0 text-[0.68rem] text-black/38">
                            {enquiry.received}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-black/45">
                          {enquiry.property}
                        </span>
                        <span className="mt-3 inline-flex border border-black/10 px-2 py-1 text-[0.65rem] font-medium">
                          {enquiry.status}
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
                {filteredEnquiries.length === 0 ? (
                  <p className="p-8 text-center text-sm text-black/45">
                    No enquiries match this filter.
                  </p>
                ) : null}
              </div>
            </aside>

            <EnquirySheet
              enquiry={selected}
              reply={reply}
              onReplyChange={setReply}
              onSend={markReplied}
              onSchedule={scheduleViewing}
            />
          </div>
        ) : (
          <CalendarWorkspace
            days={weekDays}
            weekOffset={weekOffset}
            onPrevious={() => setWeekOffset((offset) => offset - 1)}
            onNext={() => setWeekOffset((offset) => offset + 1)}
            onToday={() => setWeekOffset(0)}
          />
        )}
      </div>
    </section>
  );
}

function StatusRail({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-5 border-black/10 py-5 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0">
      <span className="font-bricolage text-3xl font-medium tracking-[-0.04em]">
        {value}
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-xs text-black/42">{note}</span>
      </span>
    </div>
  );
}

function EnquirySheet({
  enquiry,
  reply,
  onReplyChange,
  onSend,
  onSchedule,
}: {
  enquiry: Enquiry;
  reply: string;
  onReplyChange: (value: string) => void;
  onSend: () => void;
  onSchedule: () => void;
}) {
  return (
    <section className="relative min-w-0 p-6 sm:p-8 lg:p-10">
      <div className="bg-carbon-50 absolute top-0 right-0 size-12 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
      <div className="flex flex-col gap-6 border-b border-black/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
            {enquiry.initials}
          </span>
          <div>
            <h2 className="font-bricolage text-2xl font-medium">
              {enquiry.name}
            </h2>
            <p className="mt-1 text-sm text-black/45">
              {enquiry.email} · {enquiry.phone}
            </p>
          </div>
        </div>
        <span className="w-fit border border-black/12 px-3 py-2 text-xs font-medium">
          {enquiry.status}
        </span>
      </div>

      <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <p className="text-xs font-medium tracking-[0.12em] text-black/38 uppercase">
            Enquiry message
          </p>
          <blockquote className="font-bricolage mt-4 max-w-2xl text-[clamp(1.35rem,2.2vw,2rem)] leading-[1.35] tracking-[-0.025em]">
            “{enquiry.message}”
          </blockquote>
        </div>
        <dl className="divide-y divide-black/10 border-y border-black/10">
          <SheetFact label="Preferred move-in" value={enquiry.moveIn} />
          <SheetFact label="Household" value={enquiry.occupants} />
          <SheetFact
            label="Viewing"
            value={enquiry.viewing ?? "Not scheduled"}
          />
        </dl>
      </div>

      <div className="border-y border-black/10 py-5">
        <p className="text-xs font-medium tracking-[0.12em] text-black/38 uppercase">
          Property
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-medium">{enquiry.property}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-black/45">
              <MapPin className="size-3.5" />
              {enquiry.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onSchedule}
            className="h-11 bg-black px-5 text-sm font-medium text-white"
          >
            Schedule viewing
          </button>
        </div>
      </div>

      <div className="mt-7">
        <label
          htmlFor="enquiry-reply"
          className="text-xs font-medium tracking-[0.12em] text-black/38 uppercase"
        >
          Reply
        </label>
        <textarea
          id="enquiry-reply"
          value={reply}
          onChange={(event) => onReplyChange(event.target.value)}
          placeholder={`Reply to ${enquiry.name.split(" ")[0]}`}
          className="mt-3 min-h-32 w-full resize-y bg-black/[0.035] p-4 text-sm leading-6 outline-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onSend}
            disabled={!reply.trim()}
            className="flex h-11 items-center gap-2 bg-black px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Send className="size-4" />
            Send reply
          </button>
        </div>
      </div>
    </section>
  );
}

function SheetFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4">
      <dt className="text-xs text-black/38">{label}</dt>
      <dd className="mt-1.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

function CalendarWorkspace({
  days,
  weekOffset,
  onPrevious,
  onNext,
  onToday,
}: {
  days: Date[];
  weekOffset: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  const label = `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  return (
    <section className="mt-8 border border-black/10 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 p-5 sm:px-7">
        <div>
          <p className="text-xs font-medium tracking-[0.12em] text-black/38 uppercase">
            Viewing calendar
          </p>
          <h2 className="font-bricolage mt-2 text-2xl font-medium">{label}</h2>
        </div>
        <div className="flex items-center border border-black/10">
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous week"
            className="flex size-10 items-center justify-center hover:bg-black/[0.04]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="h-10 border-x border-black/10 px-4 text-sm font-medium"
          >
            {weekOffset === 0 ? "This week" : "Today"}
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next week"
            className="flex size-10 items-center justify-center hover:bg-black/[0.04]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[980px] grid-cols-7">
          {days.map((day, index) => (
            <div
              key={day.toISOString()}
              className="min-h-[520px] border-r border-black/10 last:border-r-0"
            >
              <div
                className={`border-b border-black/10 p-4 ${weekOffset === 0 && index === 0 ? "bg-black text-white" : ""}`}
              >
                <p className="text-xs opacity-50">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="font-bricolage mt-1 text-2xl font-medium">
                  {day.getDate()}
                </p>
              </div>
              <div className="space-y-3 p-3">
                {weekOffset === 0 &&
                  VIEWINGS.filter((viewing) => viewing.day === index).map(
                    (viewing) => (
                      <article
                        key={`${viewing.name}-${viewing.time}`}
                        className={`border-l-4 p-3 ${viewing.tone === "black" ? "border-black bg-black text-white" : "border-black/25 bg-black/[0.045]"}`}
                      >
                        <p className="flex items-center gap-1.5 text-[0.68rem] opacity-55">
                          <Clock3 className="size-3" />
                          {viewing.time}
                        </p>
                        <p className="mt-3 text-xs font-medium">
                          {viewing.name}
                        </p>
                        <p className="mt-1 text-[0.68rem] leading-4 opacity-55">
                          {viewing.property}
                        </p>
                      </article>
                    ),
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-6 border-t border-black/10 px-5 py-4 text-xs text-black/45 sm:px-7">
        <span className="flex items-center gap-2">
          <CalendarDays className="size-3.5" />5 confirmed viewings
        </span>
        <span className="flex items-center gap-2">
          <Mail className="size-3.5" />3 awaiting confirmation
        </span>
        <span className="flex items-center gap-2">
          <Check className="size-3.5" />
          No scheduling conflicts
        </span>
        <span className="flex items-center gap-2">
          <MessageSquare className="size-3.5" />
          Reminders sent automatically
        </span>
      </div>
    </section>
  );
}

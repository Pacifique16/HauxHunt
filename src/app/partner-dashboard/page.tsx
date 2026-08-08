import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Inbox,
  MessageSquare,
  Plus,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { DashboardShell } from "@/components/partner/dashboard-shell";
import { ListingOptionsMenu } from "@/components/partner/listing-options-menu";

export const metadata: Metadata = {
  title: "Partner dashboard | HauxHunt",
  description:
    "Manage HauxHunt listings, property requests, enquiries, verification, drafts, and listing performance.",
};

const STATS = [
  {
    label: "Live listings",
    value: "12",
    change: "This month",
    icon: Building2,
  },
  {
    label: "Listing views",
    value: "4,286",
    change: "Last 30 days",
    icon: Eye,
  },
  {
    label: "New enquiries",
    value: "24",
    change: "7 need a reply",
    icon: MessageSquare,
  },
  {
    label: "Matched requests",
    value: "16",
    change: "5 new today",
    icon: Users,
  },
] as const;

const LISTINGS = [
  {
    title: "Modern 3-bedroom house",
    location: "Kacyiru, Kigali",
    price: "USD 830 / month",
    status: "Live",
    views: "1,248",
    enquiries: "11",
    activity: "Approved and went live · 08 Aug 2026",
  },
  {
    title: "Furnished city apartment",
    location: "Kigali City Centre",
    price: "USD 590 / month",
    status: "In review",
    views: "—",
    enquiries: "—",
    activity: "Submitted for review · 08 Aug 2026",
  },
  {
    title: "Untitled property draft",
    location: "Saved from listing form",
    price: "Continue editing",
    status: "Draft",
    views: "—",
    enquiries: "—",
    activity: "Draft saved · 08 Aug 2026",
  },
] as const;

const REQUESTS = [
  {
    need: "2-bedroom apartment",
    place: "Kibagabaga",
    budget: "Up to USD 485",
    age: "12 min",
  },
  {
    need: "Family house",
    place: "Kacyiru or Gacuriro",
    budget: "Up to USD 1,040",
    age: "1 hr",
  },
  {
    need: "Studio apartment",
    place: "Nyarutarama",
    budget: "Up to USD 310",
    age: "3 hrs",
  },
] as const;

export default function PartnerDashboardPage() {
  return (
    <DashboardShell>
      <section className="px-5 pt-10 pb-24 sm:px-6 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-bricolage text-carbon-900 text-[clamp(3rem,6vw,5.5rem)] leading-[0.9] font-medium tracking-[-0.06em]">
                Partner dashboard
              </h1>
              <p className="text-carbon-600 mt-7 max-w-3xl text-lg leading-7">
                Manage listings, property requests, enquiries, verification,
                saved drafts, and listing performance.
              </p>
            </div>
            <Link
              href="/partner-dashboard/listings/new"
              className="font-bricolage inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80 lg:self-auto"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add property
            </Link>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
            <div className="space-y-8">
              <section
                id="listings"
                className="relative rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]"
              >
                <SectionHeader
                  title="Your listings"
                  description="Your most recent listing activity, newest first."
                  action="View all"
                  actionHref="/partner-dashboard/listings"
                />
                <div className="divide-y divide-black/10">
                  {LISTINGS.map((listing) => (
                    <article
                      key={listing.title}
                      className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white">
                          <Building2 aria-hidden="true" className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bricolage text-carbon-900 truncate font-medium">
                            {listing.title}
                          </h3>
                          <p className="text-carbon-500 mt-1 text-sm">
                            {listing.location} · {listing.price}
                          </p>
                          <p className="text-carbon-400 mt-1 text-xs">
                            {listing.activity}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={listing.status} />
                      <div className="flex gap-7 text-sm lg:justify-end">
                        <Metric label="Views" value={listing.views} />
                        <Metric label="Enquiries" value={listing.enquiries} />
                      </div>
                      <ListingOptionsMenu
                        title={listing.title}
                        status={listing.status}
                      />
                    </article>
                  ))}
                </div>
              </section>

              <section
                id="enquiries"
                className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]"
              >
                <SectionHeader
                  title="Recent property requests"
                  description="Respond where your properties are a good fit."
                  action="Browse requests"
                />
                <div className="divide-y divide-black/10">
                  {REQUESTS.map((request) => (
                    <article
                      key={`${request.need}-${request.place}`}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div>
                        <h3 className="font-bricolage text-carbon-900 font-medium">
                          {request.need}
                        </h3>
                        <p className="text-carbon-500 mt-1 text-sm">
                          {request.place} · {request.budget}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-carbon-500 text-xs">
                          {request.age} ago
                        </span>
                        <button
                          type="button"
                          className="font-bricolage inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-medium transition-colors hover:border-black hover:bg-black hover:text-white"
                        >
                          View request
                          <ArrowUpRight aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section
                id="applications"
                className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]"
              >
                <SectionHeader
                  title="Application review"
                  description="Review every applicant and co-applicant together."
                  action="Open workspace"
                />
                <article className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-carbon-500 text-xs font-medium tracking-[0.1em] uppercase">
                        Modern 3-bedroom house
                      </p>
                      <h3 className="font-bricolage text-carbon-900 mt-2 text-xl font-medium tracking-[-0.025em]">
                        Group application · 3 applicants
                      </h3>
                      <p className="text-carbon-500 mt-1 text-sm">
                        Submitted today · USD 830 monthly rent
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-black/10 px-3 py-1.5 text-xs font-medium text-black">
                      Awaiting review
                    </span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <ApplicantStatus
                      name="Aline M."
                      role="Primary"
                      status="Verified"
                    />
                    <ApplicantStatus
                      name="Eric N."
                      role="Co-applicant"
                      status="Verified"
                    />
                    <ApplicantStatus
                      name="Divine K."
                      role="Co-applicant"
                      status="Pending"
                    />
                  </div>
                </article>
              </section>
            </div>

            <aside className="space-y-8">
              <section
                id="verification"
                className="relative overflow-hidden rounded-[1.75rem] bg-black p-7 text-white shadow-[0_18px_48px_rgba(0,0,0,0.14)]"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px] opacity-15"
                />
                <div className="relative z-10">
                  <span className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <ShieldCheck aria-hidden="true" className="size-5" />
                  </span>
                  <p className="mt-7 text-xs font-medium tracking-[0.12em] text-white/50 uppercase">
                    Partner verification
                  </p>
                  <h2 className="font-bricolage mt-3 text-3xl font-medium tracking-[-0.04em]">
                    Almost verified
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/65">
                    Complete one final identity check to publish listings and
                    respond to every matched request.
                  </p>
                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-4/5 rounded-full bg-white" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-white/45">
                    <span>4 of 5 steps</span>
                    <span>80%</span>
                  </div>
                  <button
                    type="button"
                    className="font-bricolage mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/85"
                  >
                    Continue verification
                  </button>
                </div>
              </section>

              <section
                id="performance"
                className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)]"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">
                      Listing performance
                    </h2>
                    <p className="text-carbon-500 mt-1 text-sm">Last 30 days</p>
                  </div>
                  <TrendingUp aria-hidden="true" className="size-5" />
                </div>
                <div
                  className="mt-7 flex h-36 items-end gap-2"
                  aria-label="Listing views increased over the last 30 days"
                >
                  {[38, 52, 44, 68, 61, 76, 70, 92, 83, 100, 88, 96].map(
                    (height, index) => (
                      <span
                        key={`${height}-${index}`}
                        aria-hidden="true"
                        className="flex-1 rounded-t-md bg-black"
                        style={{
                          height: `${height}%`,
                          opacity: 0.28 + index * 0.055,
                        }}
                      />
                    ),
                  )}
                </div>
                <div className="mt-5 flex items-end justify-between border-t border-black/10 pt-5">
                  <div>
                    <p className="text-carbon-500 text-xs">Total views</p>
                    <p className="font-bricolage text-carbon-900 mt-1 text-2xl font-medium">
                      4,286
                    </p>
                  </div>
                  <span className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
                    +18%
                  </span>
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">
                  Inbox and drafts
                </h2>
                <div className="mt-6 space-y-3">
                  <QuickLink icon={Inbox} label="Unread enquiries" value="7" />
                  <QuickLink icon={FileText} label="Saved drafts" value="3" />
                  <QuickLink icon={Clock3} label="Awaiting review" value="2" />
                  <QuickLink
                    icon={CheckCircle2}
                    label="Approved this month"
                    value="5"
                  />
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.045)]">
      <div className="flex items-start justify-between gap-5">
        <p className="text-carbon-500 text-sm">{label}</p>
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <p className="font-bricolage text-carbon-900 mt-5 text-4xl font-medium tracking-[-0.045em]">
        {value}
      </p>
      <p className="text-carbon-500 mt-2 text-xs">{change}</p>
    </article>
  );
}

function SectionHeader({
  title,
  description,
  action,
  actionHref,
}: {
  title: string;
  description: string;
  action: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-black/10 p-5 sm:p-6">
      <div>
        <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">
          {title}
        </h2>
        <p className="text-carbon-500 mt-1 text-sm">{description}</p>
      </div>
      {actionHref ? (
        <Link
          href={actionHref}
          className="font-bricolage shrink-0 text-sm font-medium underline underline-offset-4"
        >
          {action}
        </Link>
      ) : (
        <button
          type="button"
          className="font-bricolage shrink-0 text-sm font-medium underline underline-offset-4"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Live"
      ? "bg-black text-white"
      : status === "In review"
        ? "bg-black/10 text-black"
        : "border border-black/15 text-black";
  return (
    <span
      className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-carbon-400 text-xs">{label}</p>
      <p className="text-carbon-900 mt-1 font-medium">{value}</p>
    </div>
  );
}

function ApplicantStatus({
  name,
  role,
  status,
}: {
  name: string;
  role: string;
  status: "Pending" | "Verified";
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-black text-white">
          <UserRound aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bricolage text-carbon-900 truncate text-sm font-medium">
            {name}
          </p>
          <p className="text-carbon-500 text-xs">{role}</p>
        </div>
      </div>
      <p
        className={`mt-3 text-xs font-medium ${status === "Verified" ? "text-carbon-900" : "text-carbon-500"}`}
      >
        {status === "Verified" ? "Identity verified" : "Verification pending"}
      </p>
    </div>
  );
}

function QuickLink({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-2xl border border-black/10 p-3 text-left transition-colors hover:border-black/30 hover:bg-black/[0.025]"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-black text-white">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="font-bricolage text-carbon-900 flex-1 text-sm font-medium">
        {label}
      </span>
      <span className="font-bricolage text-carbon-900 text-sm font-medium">
        {value}
      </span>
    </button>
  );
}

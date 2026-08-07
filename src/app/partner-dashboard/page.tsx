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
  MoreHorizontal,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Partner dashboard | HauxHunt",
  description:
    "Manage HauxHunt listings, property requests, enquiries, verification, drafts, and listing performance.",
};

const STATS = [
  {
    label: "Live listings",
    value: "12",
    change: "+2 this month",
    icon: Building2,
  },
  {
    label: "Total views",
    value: "4,286",
    change: "+18% this month",
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
    price: "RWF 1,200,000 / month",
    status: "Live",
    views: "1,248",
    enquiries: "11",
  },
  {
    title: "Furnished city apartment",
    location: "Kigali City Centre",
    price: "RWF 850,000 / month",
    status: "In review",
    views: "—",
    enquiries: "—",
  },
  {
    title: "Family home with garden",
    location: "Gacuriro, Kigali",
    price: "RWF 185,000,000",
    status: "Draft",
    views: "—",
    enquiries: "—",
  },
] as const;

const REQUESTS = [
  {
    need: "2-bedroom apartment",
    place: "Kibagabaga",
    budget: "Up to RWF 700k",
    age: "12 min",
  },
  {
    need: "Family house",
    place: "Kacyiru or Gacuriro",
    budget: "Up to RWF 1.5m",
    age: "1 hr",
  },
  {
    need: "Studio apartment",
    place: "Nyarutarama",
    budget: "Up to RWF 450k",
    age: "3 hrs",
  },
] as const;

export default function PartnerDashboardPage() {
  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-24">
        <section className="px-5 pt-14 pb-24 sm:px-6 sm:pt-16 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1360px]">
            <header className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="font-bricolage text-carbon-500 text-sm font-medium tracking-[0.12em] uppercase">
                  Partner workspace
                </p>
                <h1 className="font-bricolage text-carbon-900 mt-4 text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.9] font-medium tracking-[-0.06em]">
                  Partner dashboard
                </h1>
                <p className="text-carbon-600 mt-7 max-w-3xl text-lg leading-7">
                  Manage listings, property requests, enquiries, verification,
                  saved drafts, and listing performance.
                </p>
              </div>
              <Link
                href="/landlords"
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
                <section className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                  <SectionHeader
                    title="Your listings"
                    description="Track status, reach, and enquiries."
                    action="View all"
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
                          </div>
                        </div>
                        <StatusBadge status={listing.status} />
                        <div className="flex gap-7 text-sm lg:justify-end">
                          <Metric label="Views" value={listing.views} />
                          <Metric label="Enquiries" value={listing.enquiries} />
                        </div>
                        <button
                          type="button"
                          aria-label={`More options for ${listing.title}`}
                          className="text-carbon-500 hover:text-carbon-900 flex size-9 items-center justify-center rounded-full hover:bg-black/5"
                        >
                          <MoreHorizontal
                            aria-hidden="true"
                            className="size-5"
                          />
                        </button>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
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
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-4"
                            />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <section className="relative overflow-hidden rounded-[1.75rem] bg-black p-7 text-white shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
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

                <section className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">
                        Listing performance
                      </h2>
                      <p className="text-carbon-500 mt-1 text-sm">
                        Last 30 days
                      </p>
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
                    <QuickLink
                      icon={Inbox}
                      label="Unread enquiries"
                      value="7"
                    />
                    <QuickLink icon={FileText} label="Saved drafts" value="3" />
                    <QuickLink
                      icon={Clock3}
                      label="Awaiting review"
                      value="2"
                    />
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
      </main>
      <Footer />
    </>
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
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-black/10 p-5 sm:p-6">
      <div>
        <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">
          {title}
        </h2>
        <p className="text-carbon-500 mt-1 text-sm">{description}</p>
      </div>
      <button
        type="button"
        className="font-bricolage shrink-0 text-sm font-medium underline underline-offset-4"
      >
        {action}
      </button>
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

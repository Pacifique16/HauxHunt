"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileSignature,
  Home,
  Plus,
  Wrench,
} from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { StatusPill } from "@/components/owner/status-pill";
import {
  OWNER,
  OWNER_APPLICATIONS,
  OWNER_PAYMENTS,
  OWNER_MAINTENANCE,
  OWNER_RECENT_ACTIVITY,
  OWNER_RENTALS,
  formatRwf,
  getOwnerProperties,
  managementStatusFor,
  rentReceivedThisMonth,
  propertyTitle,
} from "@/lib/owner-data";

export default function OwnerOverviewPage() {
  const properties = getOwnerProperties();
  const occupied = properties.filter((p) => p.occupancy === "Occupied").length;
  const vacant = properties.filter((p) => p.occupancy === "Vacant").length;
  const maintenanceOpen = OWNER_MAINTENANCE.filter((m) => m.status !== "Resolved").length;

  const approvalsNeeded = OWNER_APPLICATIONS.filter((a) => a.requiresOwnerApproval);
  const agreementsNeeded = OWNER_RENTALS.filter((r) => r.agreementStatus === "Awaiting Owner Approval");
  const overduePayments = OWNER_PAYMENTS.filter((p) => p.status === "Overdue");
  const urgentMaintenance = OWNER_MAINTENANCE.filter((m) => m.priority === "Urgent" && m.status !== "Resolved");
  const attentionCount = approvalsNeeded.length + agreementsNeeded.length + overduePayments.length + urgentMaintenance.length;

  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-10 pb-24 sm:px-6 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="flex flex-col gap-8 border-b border-black/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">Welcome back, {OWNER.name.split(" ")[0]}</h1>
              <p className="text-carbon-600 mt-7 max-w-3xl text-lg leading-7">
                What you own, who manages it, and what needs your attention right now.
              </p>
            </div>
            <Link
              href="/owner-dashboard/properties/new"
              className="font-bricolage inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80 lg:self-auto"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add Property
            </Link>
          </header>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard icon={Building2} label="Total properties" value={String(properties.length)} change={`${vacant} available`} />
            <StatCard icon={Home} label="Occupied" value={String(occupied)} change={`${properties.length - occupied} not occupied`} />
            <StatCard icon={Home} label="Available" value={String(vacant)} change={`${occupied} currently occupied`} />
            <StatCard icon={CreditCard} label="Rent received" value={formatRwf(rentReceivedThisMonth())} change="August 2026" />
            <StatCard icon={Wrench} label="Open maintenance" value={String(maintenanceOpen)} change="Open or in progress" />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)]">
            <div className="space-y-8">
              {/* Needs Your Attention -------------------------------------------------- */}
              <section className="relative rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                <div className="flex items-start justify-between gap-5 border-b border-black/10 p-5 sm:p-6">
                  <div>
                    <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">Needs Your Attention</h2>
                    <p className="text-carbon-500 mt-1 text-sm">{attentionCount > 0 ? `${attentionCount} item${attentionCount === 1 ? "" : "s"} need a decision from you.` : "Nothing needs your attention right now."}</p>
                  </div>
                </div>
                {attentionCount > 0 ? (
                  <div className="divide-y divide-black/10">
                    {approvalsNeeded.map((a) => (
                      <AttentionRow
                        key={a.id}
                        icon={ClipboardCheck}
                        title="Application awaiting your approval"
                        heading={propertyTitle(a.propertyId)}
                        detail={`${a.applicant} · Submitted ${a.submitted}`}
                        cta="Review Application"
                        href={`/owner-dashboard/applications?open=${a.id}`}
                      />
                    ))}
                    {agreementsNeeded.map((r) => (
                      <AttentionRow
                        key={r.id}
                        icon={FileSignature}
                        title="Rental agreement awaiting your approval"
                        heading={propertyTitle(r.propertyId)}
                        detail={`Starts ${r.start}`}
                        cta="Review Agreement"
                        href={`/owner-dashboard/rentals?open=${r.id}`}
                      />
                    ))}
                    {overduePayments.map((p) => (
                      <AttentionRow
                        key={p.id}
                        icon={CreditCard}
                        title="Rent overdue"
                        heading={propertyTitle(p.propertyId)}
                        detail={`${p.amount} · ${p.date.replace("Due 1 August 2026 · ", "")}`}
                        cta="View Payment"
                        href={`/owner-dashboard/payments?open=${p.id}`}
                      />
                    ))}
                    {urgentMaintenance.map((m) => (
                      <AttentionRow
                        key={m.id}
                        icon={Wrench}
                        title="Urgent maintenance issue"
                        heading={m.title}
                        detail={propertyTitle(m.propertyId)}
                        cta="View Request"
                        href={`/owner-dashboard/maintenance?open=${m.id}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                    <CheckCircle2 className="size-8 text-black/25" />
                    <p className="text-carbon-500 text-sm">You&apos;re all caught up.</p>
                  </div>
                )}
              </section>

              {/* Property Portfolio ------------------------------------------------------ */}
              <section className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                <div className="flex items-start justify-between gap-5 border-b border-black/10 p-5 sm:p-6">
                  <div>
                    <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">Property Portfolio</h2>
                    <p className="text-carbon-500 mt-1 text-sm">Who&apos;s managing, marketing, and renting each property.</p>
                  </div>
                  <Link href="/owner-dashboard/properties" className="font-bricolage shrink-0 text-sm font-medium underline underline-offset-4">
                    View all
                  </Link>
                </div>
                <div className="divide-y divide-black/10">
                  {properties.slice(0, 4).map((property) => {
                    const rental = OWNER_RENTALS.find((r) => r.propertyId === property.id && (r.status === "Active" || r.status === "Ending Soon"));
                    return (
                      <Link
                        key={property.id}
                        href={`/owner-dashboard/properties/${property.id}`}
                        className="grid gap-4 p-5 transition-colors hover:bg-black/2 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <Image src={property.image} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <h3 className="font-bricolage text-carbon-900 truncate font-medium">{property.title}</h3>
                            <p className="text-carbon-500 mt-1 text-sm">{property.location}</p>
                            <p className="text-carbon-400 mt-1 text-xs">
                              {property.propertyManager ? `Managed by ${property.propertyManager.name}` : property.agent ? "Self-managed rental" : "Self-managed"}
                              {property.agent ? ` · Marketed by ${property.agent.name}` : ""}
                              {rental ? ` · Renter: ${rental.renter}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                          <StatusPill status={property.occupancy} />
                          {rental ? <StatusPill status={rental.paymentStatus} /> : null}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <section className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                <div className="flex items-start justify-between gap-5">
                  <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">Recent Activity</h2>
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </div>
                <p className="text-carbon-500 mt-1 text-sm">What the people you&apos;ve delegated to have been doing.</p>
                <ul className="mt-6 space-y-5">
                  {OWNER_RECENT_ACTIVITY.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-black/30" />
                      <div>
                        <p className="text-sm leading-6">{item.text}</p>
                        <p className="text-carbon-400 mt-0.5 text-xs">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
                <h2 className="font-bricolage text-carbon-900 text-xl font-medium tracking-[-0.025em]">Delegation</h2>
                <p className="text-carbon-500 mt-1 text-sm">How your portfolio is managed today.</p>
                <div className="mt-5 space-y-3">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-carbon-700 truncate">{property.title}</span>
                      <span className="text-carbon-400 shrink-0 text-xs">{managementStatusFor(property)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_12px_35px_rgba(0,0,0,0.045)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-carbon-500 truncate text-xs">{label}</p>
        <Icon aria-hidden="true" className="size-4 shrink-0" />
      </div>
      <p className="font-bricolage text-carbon-900 mt-3 truncate text-2xl font-medium tracking-tight">{value}</p>
      <p className="text-carbon-500 mt-1 truncate text-xs">{change}</p>
    </article>
  );
}

function AttentionRow({
  icon: Icon,
  title,
  heading,
  detail,
  cta,
  href,
}: {
  icon: typeof Wrench;
  title: string;
  heading: string;
  detail: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center text-black">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-carbon-500 text-xs font-medium tracking-wider uppercase">{title}</p>
          <p className="font-bricolage text-carbon-900 mt-1 font-medium">{heading}</p>
          <p className="text-carbon-500 mt-0.5 text-sm">{detail}</p>
        </div>
      </div>
      <Link
        href={href}
        className="font-bricolage inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-medium transition-colors hover:border-black hover:bg-black hover:text-white"
      >
        {cta}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

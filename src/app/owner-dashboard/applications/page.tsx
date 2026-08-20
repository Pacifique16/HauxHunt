"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Check, MessageSquare } from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { StatusPill } from "@/components/owner/status-pill";
import { OWNER_APPLICATIONS, propertyLocation, propertyTitle } from "@/lib/owner-data";

export default function OwnerApplicationsPage() {
  return (
    <Suspense>
      <OwnerApplicationsPageInner />
    </Suspense>
  );
}

function OwnerApplicationsPageInner() {
  const searchParams = useSearchParams();
  const openParam = searchParams.get("open");
  const [selectedId, setSelectedId] = useState(openParam ?? OWNER_APPLICATIONS[0]?.id ?? null);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const selected = OWNER_APPLICATIONS.find((a) => a.id === selectedId) ?? null;
  const approvalsNeeded = OWNER_APPLICATIONS.filter((a) => a.requiresOwnerApproval && !approvedIds.includes(a.id));

  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="border-b border-black/10 pb-8">
            <h1 className="dashboard-page-title text-carbon-900">Applications</h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Applications submitted for your properties. Your Property Manager or Agent reviews most of
              these — you&apos;ll only be asked to approve where that matters.
            </p>
          </header>

          {approvalsNeeded.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-black/15 bg-black/3 p-5">
              <p className="text-sm font-medium">{approvalsNeeded.length} application{approvalsNeeded.length === 1 ? "" : "s"} awaiting your approval.</p>
            </div>
          ) : null}

          <div className="mt-6 grid overflow-hidden rounded-[1.5rem] border border-black/10 bg-white lg:grid-cols-[minmax(280px,0.65fr)_minmax(0,1.35fr)]">
            <div className="divide-y divide-black/8 border-b border-black/10 lg:border-r lg:border-b-0">
              {OWNER_APPLICATIONS.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => setSelectedId(application.id)}
                  className={`block w-full p-5 text-left transition-colors ${selectedId === application.id ? "bg-black/4.5" : "hover:bg-black/2"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{application.applicant}</p>
                      <p className="text-carbon-500 mt-1 truncate text-sm">{propertyTitle(application.propertyId)}</p>
                    </div>
                    {application.requiresOwnerApproval && !approvedIds.includes(application.id) ? (
                      <span className="mt-0.5 size-2 shrink-0 rounded-full bg-black" aria-label="Needs your approval" />
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <StatusPill status={approvedIds.includes(application.id) ? "Approved" : application.status} />
                  </div>
                </button>
              ))}
            </div>

            <div className="min-w-0 p-6 sm:p-8">
              {selected ? (
                <ApplicationDetail
                  application={selected}
                  approved={approvedIds.includes(selected.id)}
                  onApprove={() => setApprovedIds((current) => [...current, selected.id])}
                />
              ) : (
                <p className="text-carbon-500 text-sm">Select an application to view details.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

function ApplicationDetail({
  application,
  approved,
  onApprove,
}: {
  application: (typeof OWNER_APPLICATIONS)[number];
  approved: boolean;
  onApprove: () => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <h2 className="font-bricolage text-xl font-medium">{application.applicant}</h2>
          <p className="text-carbon-500 mt-1 text-sm">
            {propertyTitle(application.propertyId)} · {propertyLocation(application.propertyId)}
          </p>
        </div>
        <StatusPill status={approved ? "Approved" : application.status} />
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-carbon-400 text-xs">Submitted</dt>
          <dd className="mt-1 font-medium">{application.submitted}</dd>
        </div>
        <div>
          <dt className="text-carbon-400 text-xs">Proposed rent</dt>
          <dd className="mt-1 font-medium">{application.proposedRent}</dd>
        </div>
        <div>
          <dt className="text-carbon-400 text-xs">Move-in</dt>
          <dd className="mt-1 font-medium">{application.moveIn}</dd>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-carbon-400 text-xs">Handled by</dt>
          <dd className="mt-1 font-medium">{application.handledBy} · {application.handledByRole}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-2xl bg-black/3 p-4">
        <p className="text-sm leading-6">{application.note}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {application.requiresOwnerApproval && !approved ? (
          <button type="button" onClick={onApprove} className="font-bricolage inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white">
            <Check aria-hidden="true" className="size-4" />
            Approve
          </button>
        ) : null}
        <a
          href={`/owner-dashboard/messages?context=${encodeURIComponent(application.handledBy)}`}
          className="font-bricolage inline-flex h-11 items-center gap-2 rounded-full border border-black/15 px-5 text-sm font-medium hover:border-black"
        >
          <MessageSquare aria-hidden="true" className="size-4" />
          Message {application.handledBy}
        </a>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Plus } from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { AssignPropertyManagerDialog } from "@/components/owner/assign-property-manager-dialog";
import { AVAILABLE_PROPERTY_MANAGERS, getOwnerProperties } from "@/lib/owner-data";

export default function PropertyManagersPage() {
  const [assignOpen, setAssignOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const properties = getOwnerProperties();

  const managers = AVAILABLE_PROPERTY_MANAGERS.map((manager) => ({
    ...manager,
    properties: properties.filter((p) => p.propertyManager?.name === manager.name),
  })).filter((manager) => manager.properties.length > 0);

  return (
    <OwnerDashboardShell>
      <section key={refreshKey} className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="flex flex-col gap-6 border-b border-black/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">Property Managers</h1>
              <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
                People currently managing properties on your behalf.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="font-bricolage inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80 sm:self-auto"
            >
              <Plus aria-hidden="true" className="size-4" />
              Assign Property Manager
            </button>
          </header>

          {managers.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
              <h3 className="font-bricolage text-xl font-medium">No Property Managers assigned</h3>
              <p className="text-carbon-500 mt-2 max-w-sm text-sm leading-6">You&apos;re managing every property yourself right now.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {managers.map((manager) => (
                <article key={manager.name} className="rounded-2xl border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-black text-sm font-medium text-white">{manager.name.slice(0, 1)}</span>
                    <div>
                      <p className="flex items-center gap-1.5 font-medium">
                        {manager.name}
                        {manager.verified ? <BadgeCheck aria-label="Verified" className="size-4 fill-black text-white" /> : null}
                      </p>
                      <p className="text-carbon-500 text-xs">Property Manager</p>
                    </div>
                  </div>
                  <p className="text-carbon-500 mt-4 text-sm">Managing {manager.properties.length} propert{manager.properties.length === 1 ? "y" : "ies"}</p>
                  <ul className="mt-2 space-y-1">
                    {manager.properties.map((p) => (
                      <li key={p.id} className="text-sm">
                        <Link href={`/owner-dashboard/properties/${p.id}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-black/8 pt-4">
                    <button
                      type="button"
                      onClick={() => setAssignOpen(true)}
                      className="font-bricolage inline-flex h-9 items-center rounded-full border border-black/15 px-4 text-xs font-medium hover:border-black"
                    >
                      Manage Assignments
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AssignPropertyManagerDialog open={assignOpen} onClose={() => setAssignOpen(false)} onAssigned={() => setRefreshKey((k) => k + 1)} />
    </OwnerDashboardShell>
  );
}

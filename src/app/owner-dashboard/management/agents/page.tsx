"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Plus } from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { AssignAgentDialog } from "@/components/owner/assign-agent-dialog";
import { AVAILABLE_AGENTS, OWNER_APPLICATIONS, getOwnerProperties } from "@/lib/owner-data";

export default function AgentsPage() {
  const [assignOpen, setAssignOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const properties = getOwnerProperties();

  const agents = AVAILABLE_AGENTS.map((agent) => ({
    ...agent,
    properties: properties.filter((p) => p.agent?.name === agent.name),
    applications: OWNER_APPLICATIONS.filter((a) => a.handledBy === agent.name).length,
  })).filter((agent) => agent.properties.length > 0);

  return (
    <OwnerDashboardShell>
      <section key={refreshKey} className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="flex flex-col gap-6 border-b border-black/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">Agents</h1>
              <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
                People currently marketing your listings and helping find renters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="font-bricolage inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80 sm:self-auto"
            >
              <Plus aria-hidden="true" className="size-4" />
              Assign Agent
            </button>
          </header>

          {agents.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
              <h3 className="font-bricolage text-xl font-medium">No Agents assigned</h3>
              <p className="text-carbon-500 mt-2 max-w-sm text-sm leading-6">None of your listings are currently marketed by an Agent.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {agents.map((agent) => (
                <article key={agent.name} className="rounded-2xl border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-full">
                      <Image src={agent.avatar} alt="" fill className="object-cover" />
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 font-medium">
                        {agent.name}
                        {agent.verified ? <BadgeCheck aria-label="Verified" className="size-4 fill-black text-white" /> : null}
                      </p>
                      <p className="text-carbon-500 text-xs">Agent</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-6 text-sm">
                    <div>
                      <p className="text-carbon-400 text-xs">Representing</p>
                      <p className="mt-0.5 font-medium">{agent.properties.length} listing{agent.properties.length === 1 ? "" : "s"}</p>
                    </div>
                    <div>
                      <p className="text-carbon-400 text-xs">Applications</p>
                      <p className="mt-0.5 font-medium">{agent.applications}</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {agent.properties.map((p) => (
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

      <AssignAgentDialog open={assignOpen} onClose={() => setAssignOpen(false)} onAssigned={() => setRefreshKey((k) => k + 1)} />
    </OwnerDashboardShell>
  );
}

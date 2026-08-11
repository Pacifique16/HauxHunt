"use client";

import { useState } from "react";
import { CalendarClock, Crown, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/partner/dashboard-shell";
import { usePartnerPlan } from "@/components/partner/use-partner-plan";
import { UpgradePaywallModal } from "@/components/partner/upgrade-paywall-modal";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PAYOUT_HISTORY, BILLING_SCHEDULES } from "@/data/finance-demo";
import type { BillingScheduleStatus, PayoutStatus } from "@/types";

const TABS = ["Payout history", "Active billing schedules"] as const;
type FinanceTab = (typeof TABS)[number];

const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

const PAYOUT_STATUS_VARIANT: Record<PayoutStatus, BadgeProps["variant"]> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

const SCHEDULE_STATUS_LABEL: Record<BillingScheduleStatus, string> = {
  active: "Active",
  paused: "Paused",
};

const SCHEDULE_STATUS_VARIANT: Record<BillingScheduleStatus, BadgeProps["variant"]> = {
  active: "success",
  paused: "neutral",
};

/**
 * The "Rent collected" KPI card's destination (KPI.md) — in-app rent
 * payout history and active billing schedules. Free-tier owners see the
 * same layout with sample data blurred behind an upgrade banner, rather
 * than a different page, so upgrading doesn't change what the feature
 * looks like — only whether it's real.
 */
export default function FinancePage() {
  const [tab, setTab] = useState<FinanceTab>("Payout history");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const plan = usePartnerPlan();
  const isPaid = plan === "pro";

  return (
    <DashboardShell initialSection="finance">
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1120px]">
          <header className="border-b border-black/10 pb-8">
            <span className="flex size-12 items-center justify-center rounded-full bg-black text-white">
              <Wallet aria-hidden="true" className="size-5" />
            </span>
            <h1 className="dashboard-page-title text-carbon-900 mt-6">Rent & Finance</h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Track in-app rent collection, active billing schedules, and past payouts.
            </p>
          </header>

          {!isPaid ? (
            <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-black/10 bg-black/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Crown aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
                <p className="text-carbon-700 text-sm leading-6">
                  <strong className="font-medium">In-app Rent Collection</strong> is a
                  HauxHunt Paid feature. Upgrade to collect rent directly on platform.
                </p>
              </div>
              <Button
                type="button"
                variant="solid"
                size="pill"
                className="shrink-0"
                onClick={() => setPaywallOpen(true)}
              >
                Upgrade now
              </Button>
            </div>
          ) : null}

          <div className="mt-8 flex h-11 w-fit items-center rounded-full bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            {TABS.map((tabOption) => (
              <button
                key={tabOption}
                type="button"
                onClick={() => setTab(tabOption)}
                aria-pressed={tab === tabOption}
                className={`h-9 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === tabOption ? "bg-black text-white" : "text-black/55 hover:text-black"
                }`}
              >
                {tabOption}
              </button>
            ))}
          </div>

          <div className="relative mt-5">
            {!isPaid ? (
              <Badge
                variant="neutral"
                className="absolute top-4 right-4 z-10 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
              >
                Sample data
              </Badge>
            ) : null}
            <div className={!isPaid ? "pointer-events-none blur-[3px] select-none" : undefined}>
              {tab === "Payout history" ? <PayoutHistoryTable /> : <BillingSchedulesTable />}
            </div>
          </div>
        </div>
      </section>

      <UpgradePaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureName="In-app Rent Collection"
        description="Collect rent directly on platform, get automatic payout history, and manage every tenant's billing schedule from one place."
      />
    </DashboardShell>
  );
}

function PayoutHistoryTable() {
  return (
    <div className="overflow-x-auto rounded-[1.5rem] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.045)]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="text-carbon-500 border-b border-black/8 text-xs">
            <th scope="col" className="px-6 py-4 font-medium">
              Date
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Property
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Tenant
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Amount
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/8">
          {PAYOUT_HISTORY.map((payout) => (
            <tr key={payout.id}>
              <td className="text-carbon-500 px-6 py-4 whitespace-nowrap">{payout.date}</td>
              <td className="text-carbon-900 px-6 py-4 font-medium">{payout.propertyTitle}</td>
              <td className="text-carbon-600 px-6 py-4">{payout.tenantName}</td>
              <td className="text-carbon-900 px-6 py-4 font-medium whitespace-nowrap">
                {payout.amount}
              </td>
              <td className="px-6 py-4">
                <Badge variant={PAYOUT_STATUS_VARIANT[payout.status]}>
                  {PAYOUT_STATUS_LABEL[payout.status]}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BillingSchedulesTable() {
  return (
    <div className="overflow-x-auto rounded-[1.5rem] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.045)]">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="text-carbon-500 border-b border-black/8 text-xs">
            <th scope="col" className="px-6 py-4 font-medium">
              Tenant
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Property
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Monthly rent
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock aria-hidden="true" className="size-3.5" />
                Next due date
              </span>
            </th>
            <th scope="col" className="px-6 py-4 font-medium">
              Automated collection
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/8">
          {BILLING_SCHEDULES.map((schedule) => (
            <tr key={schedule.id}>
              <td className="text-carbon-900 px-6 py-4 font-medium">{schedule.tenantName}</td>
              <td className="text-carbon-600 px-6 py-4">{schedule.propertyTitle}</td>
              <td className="text-carbon-900 px-6 py-4 font-medium whitespace-nowrap">
                {schedule.monthlyRent}
              </td>
              <td className="text-carbon-500 px-6 py-4 whitespace-nowrap">
                {schedule.nextDueDate}
              </td>
              <td className="px-6 py-4">
                <Badge variant={SCHEDULE_STATUS_VARIANT[schedule.status]}>
                  {SCHEDULE_STATUS_LABEL[schedule.status]}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

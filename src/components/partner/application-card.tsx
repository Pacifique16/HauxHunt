"use client";

import { useState } from "react";
import { Briefcase, Check, History, Users, Wallet, X } from "lucide-react";

import type { ApplicationStatus, TenantApplication } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePartnerPlan } from "@/components/partner/use-partner-plan";
import { UpgradePaywallModal } from "@/components/partner/upgrade-paywall-modal";
import { TenantHistoryDrawer } from "@/components/partner/tenant-history-drawer";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "New",
  under_review: "Under review",
  ready_for_decision: "Ready for decision",
  approved: "Approved",
  declined: "Declined",
};

const STATUS_VARIANT: Record<ApplicationStatus, BadgeProps["variant"]> = {
  new: "neutral",
  under_review: "info",
  ready_for_decision: "warning",
  approved: "success",
  declined: "danger",
};

export interface ApplicationCardProps {
  application: TenantApplication;
  onApprove: (applicationId: string) => void;
  onDecline: (applicationId: string) => void;
}

/**
 * A single tenant application in the partner dashboard's Applications view
 * (Tenanthistory.md §1). Owns its own "View Tenant History" click-handling
 * (Tenanthistory.md §2) rather than pushing the tier check up to a parent —
 * same self-contained pattern as `ConnectionButton`'s connect-confirmation
 * dialog.
 */
export function ApplicationCard({ application, onApprove, onDecline }: ApplicationCardProps) {
  const plan = usePartnerPlan();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const decided = application.status === "approved" || application.status === "declined";

  function handleViewHistory() {
    if (plan === "free") {
      setPaywallOpen(true);
    } else {
      setHistoryOpen(true);
    }
  }

  return (
    <article className="rounded-[1.5rem] bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.045)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <Avatar alt={application.applicantName} size="lg" fallback={getInitials(application.applicantName)} />
          <div className="min-w-0">
            <p className="font-bricolage text-carbon-900 text-base font-medium">
              {application.applicantName}
            </p>
            <p className="text-carbon-500 mt-1 text-sm">
              Applied for {application.propertyTitle}
            </p>
            <p className="text-carbon-400 mt-0.5 text-xs">
              {application.monthlyRent} · Submitted {application.submittedAgo.toLowerCase()}
            </p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[application.status]}>
          {STATUS_LABEL[application.status]}
        </Badge>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-black/8 pt-5">
        <Fact icon={Briefcase} label="Occupation" value={application.occupation} />
        <Fact icon={Wallet} label="Monthly income" value={application.monthlyIncome} />
        <Fact icon={Users} label="Move-in date" value={application.moveInDate} />
      </dl>

      {application.coApplicants?.length ? (
        <p className="text-carbon-500 mt-4 text-xs">
          + {application.coApplicants.length === 1 ? "co-applicant" : "co-applicants"}:{" "}
          {application.coApplicants.join(", ")}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">
        {decided ? (
          <p className="text-carbon-500 text-sm">
            {application.status === "approved"
              ? "You approved this application."
              : "You declined this application."}
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline-solid"
              size="pill"
              onClick={() => onDecline(application.id)}
            >
              <X aria-hidden="true" className="size-4" /> Decline
            </Button>
            <Button
              type="button"
              variant="solid"
              size="pill"
              onClick={() => onApprove(application.id)}
            >
              <Check aria-hidden="true" className="size-4" /> Approve
            </Button>
          </div>
        )}

        <Button
          type="button"
          variant="outline-solid"
          size="pill"
          onClick={handleViewHistory}
          aria-haspopup="dialog"
        >
          <History aria-hidden="true" className="size-4" /> View tenant history
        </Button>
      </div>

      <UpgradePaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureName="Tenant History"
      />
      <TenantHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        applicantId={application.applicantId}
        applicantName={application.applicantName}
      />
    </article>
  );
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-carbon-500 flex items-center gap-1.5 text-[0.68rem]">
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
        {label}
      </dt>
      <dd className="text-carbon-900 mt-1 truncate text-sm font-medium">{value}</dd>
    </div>
  );
}

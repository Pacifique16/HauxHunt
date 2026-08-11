"use client";

import { Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { setPartnerPlan, usePartnerPlan } from "@/components/partner/use-partner-plan";

/**
 * Lets an owner see and switch their billing tier (Tenanthistory.md). There
 * is no billing backend yet, so this doubles as the demo control for
 * testing both the `UpgradePaywallModal` (free) and unlocked (pro) states
 * of paid tools like tenant history — same role `PartnerDetailsFields`'
 * partner-type select plays for `usePartnerRole`.
 */
export function PartnerPlanFields() {
  const plan = usePartnerPlan();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {plan === "pro" ? (
          <Badge variant="solid">
            <Crown aria-hidden="true" className="size-3" /> Pro
          </Badge>
        ) : (
          <Badge variant="neutral">Free</Badge>
        )}
        <p className="text-carbon-600 text-sm">
          {plan === "pro"
            ? "You have full access to paid tools like tenant history."
            : "Upgrade to unlock paid tools like tenant history."}
        </p>
      </div>
      <div className="flex h-11 shrink-0 items-center rounded-full bg-black/[0.045] p-1">
        <button
          type="button"
          onClick={() => setPartnerPlan("free")}
          aria-pressed={plan === "free"}
          className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
            plan === "free" ? "bg-black text-white" : "text-black/55 hover:text-black"
          }`}
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => setPartnerPlan("pro")}
          aria-pressed={plan === "pro"}
          className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
            plan === "pro" ? "bg-black text-white" : "text-black/55 hover:text-black"
          }`}
        >
          Pro
        </button>
      </div>
    </div>
  );
}

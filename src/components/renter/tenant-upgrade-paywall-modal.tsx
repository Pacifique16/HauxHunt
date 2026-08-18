"use client";

import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { setTenantPlan } from "@/components/renter/use-tenant-plan";

export type TenantUpgradePaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** e.g. "the interactive map" — used in the header. */
  featureName: string;
  /** Override the body copy for a feature other than the map. */
  description?: string;
};

/**
 * Renter-side counterpart to `UpgradePaywallModal` (src/components/partner)
 * — same reusable-paywall idea, but for Free-tier tenants hitting a
 * Paid-only tool (Tenant Pricing Plans). There is no billing backend yet,
 * so "Upgrade Now" simulates a completed upgrade via `setTenantPlan`, same
 * as the owner-side modal does with `setPartnerPlan`.
 */
export function TenantUpgradePaywallModal({
  isOpen,
  onClose,
  featureName,
  description = "Upgrade to the Paid plan for unlimited messaging, instant WhatsApp alerts, house reviews, and viewing fees capped at RWF 5,000.",
}: TenantUpgradePaywallModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} labelledBy="tenant-upgrade-paywall-title">
      <div className="p-7 sm:p-9">
        <Badge variant="solid">
          <Lock aria-hidden="true" className="size-3" /> Paid feature
        </Badge>

        <h2
          id="tenant-upgrade-paywall-title"
          className="font-bricolage text-carbon-900 mt-4 text-2xl leading-tight font-medium tracking-[-0.03em]"
        >
          Unlock {featureName}
        </h2>
        <p className="text-carbon-600 mt-3 text-sm leading-6">{description}</p>

        <div className="mt-7 flex flex-col gap-2.5">
          <Button
            type="button"
            variant="solid"
            size="pill-lg"
            onClick={() => {
              // Simulates a completed upgrade — there is no billing backend
              // yet, so this plays the same role a real checkout redirect
              // would.
              setTenantPlan("paid");
              onClose();
            }}
          >
            Upgrade Now
          </Button>
          <Button type="button" variant="ghost" size="pill-lg" onClick={onClose}>
            Maybe later
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

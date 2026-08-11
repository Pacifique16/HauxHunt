"use client";

import { Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { setPartnerPlan } from "@/components/partner/use-partner-plan";

export type UpgradePaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** e.g. "Tenant History" — used in the header and, by default, aria label. */
  featureName: string;
  /** Override the body copy for a feature other than tenant history. */
  description?: string;
};

/**
 * Reusable upgrade prompt for any paid-only owner tool (Tenanthistory.md
 * §3) — not tenant-history-specific, so later paywalled features can reuse
 * it with a different `featureName`/`description`. Built on the shared
 * `Dialog` primitive rather than a new modal implementation.
 */
export function UpgradePaywallModal({
  isOpen,
  onClose,
  featureName,
  description = "Access previous landlord reviews, past payment reliability, and rental history records to make informed tenant decisions.",
}: UpgradePaywallModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} labelledBy="upgrade-paywall-title">
      <div className="p-7 sm:p-9">
        <Badge variant="solid">
          <Crown aria-hidden="true" className="size-3" /> Pro feature
        </Badge>

        <h2
          id="upgrade-paywall-title"
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
              // would (unlocks the feature immediately, same as
              // `useFlatmateConnections`/`usePartnerRole` simulate their
              // own state elsewhere in the app).
              setPartnerPlan("pro");
              onClose();
            }}
          >
            Upgrade to Pro
          </Button>
          <Button type="button" variant="ghost" size="pill-lg" onClick={onClose}>
            Maybe later
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

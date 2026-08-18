"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTenantPlan } from "@/components/renter/use-tenant-plan";
import { TenantUpgradePaywallModal } from "@/components/renter/tenant-upgrade-paywall-modal";

/**
 * The property-detail "Location" map, gated behind Tenant Pricing Plans'
 * Paid tier the same way the catalogue map is (see `RenterMapCatalogue`'s
 * `gateMapForTenantPlan`) — renter-only; guests viewing a public listing
 * page always see the map.
 */
export function PropertyLocationMap({
  mapUrl,
  location,
  gateForTenantPlan,
}: {
  mapUrl: string;
  location: string;
  gateForTenantPlan: boolean;
}) {
  const tenantPlan = useTenantPlan();
  const locked = gateForTenantPlan && tenantPlan === "free";
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <>
      <div className="relative mt-5 h-[320px] overflow-hidden border border-black/8 bg-white shadow-sm">
        <iframe
          title={`Map showing ${location}`}
          src={mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
        {locked ? (
          // Sits on top of the real (still rendered) map so it stays
          // visible — just dimmed and frosted — behind the upgrade prompt,
          // and blocks the iframe from receiving clicks/scroll.
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 p-6 text-center backdrop-blur-[2px]">
            <div className="relative max-w-xs rounded-2xl bg-white/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-black text-white">
                <Lock aria-hidden="true" className="size-5" />
              </span>
              <h3 className="font-bricolage mt-3 text-lg font-medium">
                Map location is a Paid feature
              </h3>
              <p className="text-carbon-600 mt-2 text-sm leading-6">
                Upgrade to see exactly where this property is and get a
                direct location link.
              </p>
              <Button
                type="button"
                variant="solid"
                size="pill-lg"
                onClick={() => setPaywallOpen(true)}
                className="mt-4"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      <TenantUpgradePaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureName="the property map & location"
        description="See exactly where this property is on the map and get a direct location link — part of the Paid plan, alongside unlimited messaging and viewing fees capped at RWF 5,000."
      />
    </>
  );
}

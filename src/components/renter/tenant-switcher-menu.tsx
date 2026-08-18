"use client";

import { Check } from "lucide-react";

import {
  DEMO_TENANTS,
  getPlanFor,
  setActiveTenant,
  setTenantPlan,
  useTenantPlan,
  type DemoTenant,
} from "@/components/renter/use-tenant-plan";
import { TenantAvatar } from "@/components/renter/tenant-avatar";

/**
 * Demo-only tenant switcher for the profile menu — lets you flip between
 * the app's renter personas to compare the Free vs. Paid experience (Tenant
 * Pricing Plans) without a real multi-account backend. Each persona
 * remembers its own plan independently (see use-tenant-plan.ts). Also
 * surfaces a quick upgrade/downgrade toggle for whichever tenant is active,
 * so switching plans doesn't require a trip to the Plan page.
 */
export function TenantSwitcherMenu({
  activeTenant,
}: {
  activeTenant: DemoTenant;
}) {
  const activePlan = useTenantPlan();
  const hasMultipleTenants = DEMO_TENANTS.length > 1;

  return (
    <div
      role="group"
      aria-label="Demo plan"
      className="border-b border-black/10 p-2"
    >
      {hasMultipleTenants ? (
        <>
          <p className="text-carbon-400 px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide uppercase">
            Switch demo tenant
          </p>
          {DEMO_TENANTS.map((tenant) => {
            const isActive = tenant.id === activeTenant.id;
            const plan = getPlanFor(tenant.id);
            return (
              <button
                key={tenant.id}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => setActiveTenant(tenant.id)}
                className="flex h-12 w-full items-center gap-2.5 rounded-xl px-3 text-left text-sm transition-colors hover:bg-black/[0.055]"
              >
                <TenantAvatar tenant={tenant} className="size-7" />
                <span className={`flex-1 truncate ${isActive ? "font-medium" : "text-black/70"}`}>
                  {tenant.name}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    plan === "paid"
                      ? "bg-black text-white"
                      : "bg-black/[0.055] text-black/55"
                  }`}
                >
                  {plan === "paid" ? "Paid" : "Free"}
                </span>
                {isActive ? (
                  <Check aria-hidden="true" className="size-4 shrink-0" />
                ) : (
                  <span className="size-4 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </>
      ) : null}

      <div
        className={`flex items-center justify-between gap-3 px-3 py-1.5 ${
          hasMultipleTenants ? "mt-1 border-t border-black/10 pt-3" : ""
        }`}
      >
        <span className="text-carbon-500 text-xs font-medium">
          {activeTenant.name.split(" ")[0]}&rsquo;s plan
        </span>
        <div className="flex h-8 shrink-0 items-center rounded-full bg-black/[0.045] p-1">
          <button
            type="button"
            onClick={() => setTenantPlan("free")}
            aria-pressed={activePlan === "free"}
            className={`h-6 rounded-full px-3 text-[11px] font-medium transition-colors ${
              activePlan === "free"
                ? "bg-black text-white"
                : "text-black/55 hover:text-black"
            }`}
          >
            Free
          </button>
          <button
            type="button"
            onClick={() => setTenantPlan("paid")}
            aria-pressed={activePlan === "paid"}
            className={`h-6 rounded-full px-3 text-[11px] font-medium transition-colors ${
              activePlan === "paid"
                ? "bg-black text-white"
                : "text-black/55 hover:text-black"
            }`}
          >
            Paid
          </button>
        </div>
      </div>
    </div>
  );
}

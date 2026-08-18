"use client";

import { useSyncExternalStore } from "react";
import type { StaticImageData } from "next/image";

import type { TenantPlan } from "@/types";
import julienProfile from "@/assets/images/julien.jpg";

export type DemoTenantId = "julien";

export type DemoTenant = {
  id: DemoTenantId;
  name: string;
  email: string;
  avatar: StaticImageData | null;
};

/**
 * The app's one demo renter persona. This used to be a list of two (Julien
 * + a second "Diane" tenant) so both ends of Tenant Pricing Plans could be
 * seen side by side without a real multi-account backend — that second
 * persona was removed, but the plan/tenant infra here stays keyed by
 * tenant id so a persona could be added back the same way later.
 */
export const DEMO_TENANTS: DemoTenant[] = [
  {
    id: "julien",
    name: "Julien Mugisha",
    email: "renter@gmail.com",
    avatar: julienProfile,
  },
];

// Seeds this demo with Julien on Paid.
const DEFAULT_PLANS: Record<DemoTenantId, TenantPlan> = {
  julien: "paid",
};

const TENANT_EVENT = "hauxhunt-active-tenant-change";
const TENANT_KEY = "hauxhunt-active-tenant";
const PLAN_EVENT = "hauxhunt-tenant-plan-change";

function planKey(tenantId: DemoTenantId) {
  return `hauxhunt-tenant-plan-${tenantId}`;
}

function isTenantId(value: string | null): value is DemoTenantId {
  return DEMO_TENANTS.some((tenant) => tenant.id === value);
}

function getActiveTenantId(): DemoTenantId {
  const saved = window.localStorage.getItem(TENANT_KEY);
  return isTenantId(saved) ? saved : "julien";
}

/** Non-reactive read of any tenant's plan — for showing both personas' plan badges in the same switcher menu without subscribing to each individually. */
export function getPlanFor(tenantId: DemoTenantId): TenantPlan {
  const saved = window.localStorage.getItem(planKey(tenantId));
  return saved === "free" || saved === "paid" ? saved : DEFAULT_PLANS[tenantId];
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(TENANT_EVENT, callback);
  window.addEventListener(PLAN_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TENANT_EVENT, callback);
    window.removeEventListener(PLAN_EVENT, callback);
  };
}

export function setActiveTenant(id: DemoTenantId) {
  window.localStorage.setItem(TENANT_KEY, id);
  window.dispatchEvent(new Event(TENANT_EVENT));
}

export function useActiveTenant(): DemoTenant {
  const id = useSyncExternalStore(
    subscribe,
    getActiveTenantId,
    (): DemoTenantId => "julien",
  );
  return DEMO_TENANTS.find((tenant) => tenant.id === id) ?? DEMO_TENANTS[0];
}

/** Sets a plan for the given tenant, or the active tenant when omitted. */
export function setTenantPlan(plan: TenantPlan, tenantId?: DemoTenantId) {
  window.localStorage.setItem(planKey(tenantId ?? getActiveTenantId()), plan);
  window.dispatchEvent(new Event(PLAN_EVENT));
}

/** The active tenant's plan — reactive to both tenant switches and plan changes. */
export function useTenantPlan(): TenantPlan {
  return useSyncExternalStore(
    subscribe,
    () => getPlanFor(getActiveTenantId()),
    (): TenantPlan => "free",
  );
}

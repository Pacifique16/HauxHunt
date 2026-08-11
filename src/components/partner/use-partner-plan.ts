"use client";

import { useSyncExternalStore } from "react";

import type { PartnerPlan } from "@/types";

const PLAN_EVENT = "hauxhunt-partner-plan-change";
const PLAN_KEY = "hauxhunt-partner-plan";

// Defaults to "free" so the paywall is what a new owner actually sees first
// (Tenanthistory.md) — same localStorage + custom-event idiom as
// `usePartnerRole`, since there is no billing backend to check against yet.
function getPlan(): PartnerPlan {
  return window.localStorage.getItem(PLAN_KEY) === "pro" ? "pro" : "free";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PLAN_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PLAN_EVENT, callback);
  };
}

export function setPartnerPlan(plan: PartnerPlan) {
  window.localStorage.setItem(PLAN_KEY, plan);
  window.dispatchEvent(new Event(PLAN_EVENT));
}

export function usePartnerPlan(): PartnerPlan {
  return useSyncExternalStore(subscribe, getPlan, (): PartnerPlan => "free");
}

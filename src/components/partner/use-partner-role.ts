"use client";

import { useSyncExternalStore } from "react";

export type PartnerRole = "property_manager" | "agent";

const ROLE_EVENT = "hauxhunt-partner-role-change";

function getRole(): PartnerRole {
  return window.localStorage.getItem("hauxhunt-partner-role") === "agent"
    ? "agent"
    : "property_manager";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ROLE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ROLE_EVENT, callback);
  };
}

export function setPartnerRole(role: PartnerRole) {
  window.localStorage.setItem("hauxhunt-partner-role", role);
  window.dispatchEvent(new Event(ROLE_EVENT));
}

export function usePartnerRole(): PartnerRole {
  return useSyncExternalStore(
    subscribe,
    getRole,
    (): PartnerRole => "property_manager",
  );
}

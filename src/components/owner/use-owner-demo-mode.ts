"use client";

import { useSyncExternalStore } from "react";

export const OWNER_EMPTY_SESSION_KEY = "hauxhunt-owner-empty-state";

export function setOwnerEmptyMode(empty: boolean) {
  if (empty) window.sessionStorage.setItem(OWNER_EMPTY_SESSION_KEY, "1");
  else window.sessionStorage.removeItem(OWNER_EMPTY_SESSION_KEY);
}

export function useOwnerEmptyMode() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return (
    mounted && window.sessionStorage.getItem(OWNER_EMPTY_SESSION_KEY) === "1"
  );
}

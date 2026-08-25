"use client";

import { useSyncExternalStore } from "react";
import {
  DEMO_AGENT_ID,
  DEMO_PM_ID,
  getProfessional,
  type ProfessionalRole,
  type RegisteredProfessional,
} from "@/lib/team-data";

export const PROFESSIONAL_SESSION_KEY = "hauxhunt-professional-id";

export function setSessionProfessional(professionalId: string) {
  window.sessionStorage.setItem(PROFESSIONAL_SESSION_KEY, professionalId);
}

export function clearSessionProfessional() {
  window.sessionStorage.removeItem(PROFESSIONAL_SESSION_KEY);
}

// Cross-Role Lifecycle Synchronization phase (hydration fix) -- deliberately
// its own client-only file, not part of team-data.ts. team-data.ts is
// plain data/logic with real Server Component consumers (e.g.
// owner-dashboard/account); pulling useSyncExternalStore into it would
// break every Server Component that imports it, even indirectly.
//
// resolveDemoProfessional() reads sessionStorage-backed team data through
// the pending-invitation fallback. The server cannot see that state, so the
// client must initially use the same seeded identity as the server.
//
// useDemoProfessional is the hook every Agent/PM page should call instead
// of the plain function during render: before mount it returns exactly
// what the server would (the hard demo default, ignoring all browser
// storage) so the client's first render matches byte-for-byte; the real,
// possibly-different resolved professional then appears in a normal
// post-mount update, never during hydration itself.
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useDemoProfessional(
  role: ProfessionalRole,
): RegisteredProfessional | undefined {
  const mounted = useMounted();
  const defaultId = role === "agent" ? DEMO_AGENT_ID : DEMO_PM_ID;
  if (!mounted) return getProfessional(defaultId);
  const selectedId = window.sessionStorage.getItem(PROFESSIONAL_SESSION_KEY);
  const selected = selectedId ? getProfessional(selectedId) : undefined;
  return selected?.role === role ? selected : getProfessional(defaultId);
}

"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { ConnectionState } from "@/types";

/**
 * FlatMat connection/save state — the single source of truth read by every
 * FlatMat surface (discovery cards, apartment tiles, connections inbox,
 * chat, profile preview) so the locked/pending/accepted state stays
 * consistent everywhere (src/Flatmate.md §20). Same `localStorage` +
 * `useSyncExternalStore` idiom as `use-partner-role.ts` and
 * `save-property-button.tsx` — there is no backend in this app yet, so
 * this plays the same role a real connections table would.
 */

export type ConnectionsMap = Record<string, ConnectionState>;

const CONNECTIONS_KEY = "hauxhunt-flatmate-connections";
const SAVED_KEY = "hauxhunt-saved-flatmates";
const CHANGE_EVENT = "hauxhunt-flatmate-connections-change";

// Seeded once, on first load, purely so the UI has something to show for
// every state (locked/pending received/accepted) without a second real
// user to round-trip a request with. Real actions (connect/accept/decline)
// overwrite this via localStorage from then on.
const DEFAULT_CONNECTIONS: ConnectionsMap = {
  "sam-m": "accepted",
  "jordan-k": "pending_received",
  "morgan-b": "pending_sent",
};

const EMPTY_CONNECTIONS: ConnectionsMap = {};
const EMPTY_SAVED: string[] = [];

let cachedConnectionsRaw: string | null | undefined;
let cachedConnections: ConnectionsMap = EMPTY_CONNECTIONS;

let cachedSavedRaw: string | null | undefined;
let cachedSaved: string[] = EMPTY_SAVED;

function readConnectionsSnapshot(): ConnectionsMap {
  if (typeof window === "undefined") return EMPTY_CONNECTIONS;
  const raw = window.localStorage.getItem(CONNECTIONS_KEY);
  if (raw === cachedConnectionsRaw) return cachedConnections;
  cachedConnectionsRaw = raw;
  cachedConnections = raw ? (JSON.parse(raw) as ConnectionsMap) : EMPTY_CONNECTIONS;
  return cachedConnections;
}

function readSavedSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_SAVED;
  const raw = window.localStorage.getItem(SAVED_KEY);
  if (raw === cachedSavedRaw) return cachedSaved;
  cachedSavedRaw = raw;
  cachedSaved = raw ? (JSON.parse(raw) as string[]) : EMPTY_SAVED;
  return cachedSaved;
}

function writeConnections(next: ConnectionsMap) {
  window.localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function writeSaved(next: string[]) {
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function getConnectionState(flatmateId: string): ConnectionState {
  return readConnectionsSnapshot()[flatmateId] ?? "locked";
}

export function requestConnection(flatmateId: string) {
  writeConnections({ ...readConnectionsSnapshot(), [flatmateId]: "pending_sent" });
}

export function acceptConnection(flatmateId: string) {
  writeConnections({ ...readConnectionsSnapshot(), [flatmateId]: "accepted" });
}

export function declineConnection(flatmateId: string) {
  writeConnections({ ...readConnectionsSnapshot(), [flatmateId]: "declined" });
}

export function toggleSavedFlatmate(flatmateId: string) {
  const saved = readSavedSnapshot();
  const next = saved.includes(flatmateId)
    ? saved.filter((id) => id !== flatmateId)
    : [...saved, flatmateId];
  writeSaved(next);
}

export function useFlatmateConnections() {
  // Seed demo defaults once, client-side only, after the first paint — so
  // the server-rendered/initial-hydration snapshot is always "everyone
  // locked" (matching getServerSnapshot below) and the UI updates to the
  // seeded pending/accepted states right after mount, the same way
  // SavePropertyButton reveals its saved state post-mount rather than
  // risking a hydration mismatch.
  useEffect(() => {
    if (window.localStorage.getItem(CONNECTIONS_KEY) === null) {
      writeConnections(DEFAULT_CONNECTIONS);
    }
  }, []);

  const connections = useSyncExternalStore(
    subscribe,
    readConnectionsSnapshot,
    () => EMPTY_CONNECTIONS,
  );
  const saved = useSyncExternalStore(subscribe, readSavedSnapshot, () => EMPTY_SAVED);

  return {
    connections,
    saved,
    getState: (flatmateId: string): ConnectionState =>
      connections[flatmateId] ?? "locked",
    isSaved: (flatmateId: string) => saved.includes(flatmateId),
  };
}

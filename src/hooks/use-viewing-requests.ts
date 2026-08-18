"use client";

import { useEffect, useState } from "react";

export type ViewingRequest = {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  date: string;
  time: string;
  note: string;
};

const KEY = "hauxhunt-viewing-requests";
const EVENT = "hauxhunt-viewing-requests-change";

function readRequests(): ViewingRequest[] {
  try {
    const parsed: unknown = JSON.parse(
      window.localStorage.getItem(KEY) ?? "[]",
    );
    return Array.isArray(parsed) ? (parsed as ViewingRequest[]) : [];
  } catch {
    return [];
  }
}

export function addViewingRequest(request: Omit<ViewingRequest, "id">) {
  const current = readRequests();
  const existing = current.find(
    (item) => item.propertyId === request.propertyId,
  );
  if (existing) {
    return { created: false, request: existing };
  }
  const createdRequest = { ...request, id: `viewing-${Date.now()}` };
  const requests = [createdRequest, ...current];
  window.localStorage.setItem(KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event(EVENT));
  return { created: true, request: createdRequest };
}

export function useViewingRequests() {
  const [requests, setRequests] = useState<ViewingRequest[]>([]);
  useEffect(() => {
    const sync = () => setRequests(readRequests());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return requests;
}

"use client";

import { useEffect, useState } from "react";

export type PropertyRequest = {
  id: string;
  submittedAt: string;
  purpose: string;
  country: string;
  city: string;
  neighbourhood?: string;
  propertyType: string;
  bedrooms: string;
  minimumBudget: string;
  maximumBudget: string;
  moveInDate: string;
  furnishing?: string;
  fullName: string;
  phone: string;
  email: string;
  notes?: string;
};

const KEY = "hauxhunt:property-requests";

function load(): PropertyRequest[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function usePropertyRequests() {
  const [requests, setRequests] = useState<PropertyRequest[]>([]);

  useEffect(() => {
    setRequests(load());
  }, []);

  function addRequest(data: Omit<PropertyRequest, "id" | "submittedAt">) {
    const next: PropertyRequest = {
      ...data,
      id: `HH-REQ-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    const updated = [next, ...load()];
    localStorage.setItem(KEY, JSON.stringify(updated));
    setRequests(updated);
    return next;
  }

  function removeRequest(id: string) {
    const updated = load().filter((r) => r.id !== id);
    localStorage.setItem(KEY, JSON.stringify(updated));
    setRequests(updated);
  }

  return { requests, addRequest, removeRequest };
}

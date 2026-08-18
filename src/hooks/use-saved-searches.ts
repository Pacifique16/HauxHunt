"use client";

import { useCallback, useEffect, useState } from "react";

export type AlertFrequency = "instant" | "daily" | "weekly" | "paused";

export type SavedSearch = {
  id: string;
  name: string;
  location: string;
  type: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  extras: string[];
  matches: number;
  newMatches: number;
  alert: AlertFrequency;
};

const STORAGE_KEY = "hauxhunt-saved-searches";
const CHANGE_EVENT = "hauxhunt-saved-searches-change";

export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "kacyiru-two-bedroom",
    name: "2-bedroom apartments in Kacyiru",
    location: "Kacyiru, Kigali",
    type: "Apartment",
    price: "Up to RWF 900,000",
    bedrooms: "2+ Beds",
    bathrooms: "2+ Bathrooms",
    extras: ["Furnished", "Verified"],
    matches: 15,
    newMatches: 3,
    alert: "instant",
  },
  {
    id: "nyarutarama-family-homes",
    name: "Family homes in Nyarutarama",
    location: "Nyarutarama, Kigali",
    type: "House",
    price: "Any Price",
    bedrooms: "3+ Beds",
    bathrooms: "2+ Bathrooms",
    extras: ["Parking", "Verified"],
    matches: 8,
    newMatches: 0,
    alert: "daily",
  },
  {
    id: "kigali-cbd-studios",
    name: "Affordable studios near Kigali CBD",
    location: "Kigali CBD / nearby",
    type: "Studio apartment",
    price: "Up to RWF 450,000",
    bedrooms: "1 Bed",
    bathrooms: "1 Bathroom",
    extras: ["Furnished"],
    matches: 6,
    newMatches: 0,
    alert: "paused",
  },
];

function readSearches() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) return MOCK_SAVED_SEARCHES;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed)
      ? (parsed as SavedSearch[])
      : MOCK_SAVED_SEARCHES;
  } catch {
    return MOCK_SAVED_SEARCHES;
  }
}

function writeSearches(searches: SavedSearch[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function addSavedSearch(search: Omit<SavedSearch, "id">) {
  const next = [{ ...search, id: `search-${Date.now()}` }, ...readSearches()];
  writeSearches(next);
}

export function useSavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    const sync = () => setSearches(readSearches());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const updateSearch = useCallback(
    (id: string, updates: Partial<SavedSearch>) => {
      writeSearches(
        readSearches().map((search) =>
          search.id === id ? { ...search, ...updates } : search,
        ),
      );
    },
    [],
  );

  const deleteSearch = useCallback((id: string) => {
    writeSearches(readSearches().filter((search) => search.id !== id));
  }, []);

  return { searches, updateSearch, deleteSearch };
}

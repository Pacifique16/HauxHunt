"use client";

import { useCallback, useEffect, useState } from "react";

export const SAVED_PROPERTIES_KEY = "hauxhunt-saved-properties";
const SAVED_PROPERTIES_EVENT = "hauxhunt-saved-properties-change";

function readSavedProperties() {
  try {
    const stored = window.localStorage.getItem(SAVED_PROPERTIES_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeSavedProperties(propertyIds: string[]) {
  window.localStorage.setItem(
    SAVED_PROPERTIES_KEY,
    JSON.stringify(Array.from(new Set(propertyIds))),
  );
  window.dispatchEvent(new Event(SAVED_PROPERTIES_EVENT));
}

export function saveProperty(propertyId: string) {
  const current = readSavedProperties();
  if (current.includes(propertyId)) return false;
  writeSavedProperties([...current, propertyId]);
  return true;
}

export function useSavedProperties() {
  const [propertyIds, setPropertyIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setPropertyIds(readSavedProperties());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(SAVED_PROPERTIES_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(SAVED_PROPERTIES_EVENT, sync);
    };
  }, []);

  const toggleProperty = useCallback((propertyId: string) => {
    const current = readSavedProperties();
    const saved = current.includes(propertyId);
    writeSavedProperties(
      saved
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId],
    );
    return !saved;
  }, []);

  return { propertyIds, toggleProperty };
}

export function useSavedProperty(propertyId: string) {
  const { propertyIds, toggleProperty } = useSavedProperties();
  return {
    saved: propertyIds.includes(propertyId),
    toggleSaved: () => toggleProperty(propertyId),
  };
}

"use client";

import { Bell, BookmarkPlus, Check, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  addSavedSearch,
  type AlertFrequency,
} from "@/hooks/use-saved-searches";

type SaveSearchActionProps = {
  location: string;
  type: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
};

export function SaveSearchAction(criteria: SaveSearchActionProps) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [frequency, setFrequency] =
    useState<Exclude<AlertFrequency, "paused">>("instant");
  const suggestedName = useMemo(() => {
    const home = criteria.type || "homes";
    const place = criteria.location || "your preferred areas";
    return `${criteria.bedrooms ? `${criteria.bedrooms}-bedroom ` : ""}${home.toLowerCase()} in ${place}`;
  }, [criteria]);
  const [name, setName] = useState(suggestedName);

  function save() {
    addSavedSearch({
      name: name.trim() || suggestedName,
      location: criteria.location || "All locations",
      type: criteria.type || "Any Home Type",
      price: criteria.price || "Any Price",
      bedrooms: criteria.bedrooms
        ? `${criteria.bedrooms}+ Beds`
        : "Any Bedrooms",
      bathrooms: criteria.bathrooms
        ? `${criteria.bathrooms}+ Bathrooms`
        : "Any Bathrooms",
      extras: [],
      matches: 8,
      newMatches: 0,
      alert: alertsEnabled ? frequency : "paused",
    });
    setOpen(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setName(suggestedName);
          setOpen(true);
        }}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-black/15 px-4 text-sm font-medium transition-colors hover:bg-black/[0.055]"
      >
        <BookmarkPlus className="size-4" /> Save this search
      </button>
      {saved ? (
        <div
          role="status"
          className="feedback-toast flex items-center justify-center gap-3"
        >
          <Check className="size-4" />
          <span>
            <strong className="font-medium">Search saved.</strong> We&apos;ll
            let you know when new homes match.
          </span>
        </div>
      ) : null}
      {open ? (
        <div
          className="fixed inset-0 z-[170] flex items-center justify-center bg-black/35 p-5"
          onMouseDown={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-search-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-7 text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:p-9"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2
                  id="save-search-title"
                  className="font-bricolage text-3xl font-medium tracking-[-0.035em]"
                >
                  Save this search
                </h2>
                <p className="text-carbon-500 mt-2 text-sm">
                  Return to these filters and hear about new matches.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-full border border-black/15"
              >
                <X className="size-4" />
              </button>
            </div>
            <label className="mt-7 block">
              <span className="mb-2 block text-sm font-medium">
                Search name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-2xl border border-black/15 px-4 text-sm outline-none focus:border-black"
              />
            </label>
            <div className="mt-6 rounded-2xl bg-black/[0.04] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Bell className="size-4" /> Notify me when new properties
                  match
                </span>
                <input
                  type="checkbox"
                  checked={alertsEnabled}
                  onChange={(event) => setAlertsEnabled(event.target.checked)}
                  className="size-4 accent-black"
                />
              </label>
              {alertsEnabled ? (
                <div className="mt-4 flex gap-2">
                  {(["instant", "daily", "weekly"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFrequency(option)}
                      className={`rounded-full border px-4 py-2 text-sm capitalize ${frequency === option ? "border-black bg-black text-white" : "border-black/15 bg-white"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 rounded-full border border-black/15 px-5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="h-11 rounded-full bg-black px-6 text-sm font-medium text-white"
              >
                Save Search
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

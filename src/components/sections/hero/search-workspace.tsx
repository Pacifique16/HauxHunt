"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";

import { FilterToken } from "./filter-token";
import { MatchRow } from "./match-row";
import { heroEase } from "./hero-motion";
import { matchListings, parseQuery } from "@/data/hero-search-demo";
import type { ParsedFilter, PropertyPreview } from "@/types";

type Stage = "idle" | "parsed" | "results";

const LOCATIONS = [
  "Kigali",
  "Kibagabaga",
  "Kacyiru",
  "Nyarutarama",
  "Remera",
  "Gisenyi",
  "Musanze",
  "Lagos",
  "Lekki",
  "Ikoyi",
  "Abuja",
  "Wuse",
] as const;

const PROPERTY_TYPES = [
  "Apartment",
  "Duplex",
  "Single room",
  "Penthouse",
  "Shared apartment",
  "Studio apartment",
  "Mansion",
  "Villa",
  "Hotel",
] as const;

const CRITERIA = ["For rent", "For sale"] as const;

const PRICE_RANGES = [
  "$50 – $100",
  "$100 – $150",
  "$150 – $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000+",
] as const;

const reveal = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.35, ease: heroEase },
};

/**
 * The workspace — the composition's centre of gravity.
 *
 * It is not a search bar, a form, a dashboard or a chat. It is one quiet
 * surface that accepts a sentence, shows what it understood as material you
 * can correct, and then resolves into homes. The intelligence is demonstrated
 * by that sequence; it is never announced. No "AI" label appears anywhere,
 * there are no conversation bubbles, and nothing pretends to talk back.
 *
 * The interaction model is unchanged from the approved Flow 3B spec — only its
 * form is new.
 */
export function SearchWorkspace() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [filters, setFilters] = useState<ParsedFilter[]>([]);
  const [results, setResults] = useState<PropertyPreview[]>([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [criteria, setCriteria] = useState("");
  const [pricing, setPricing] = useState("");
  const understoodRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function runParse(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setFilters(parseQuery(trimmed));
    setResults([]);
    setStage("parsed");
    requestAnimationFrame(() => understoodRef.current?.focus());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) {
      runParse(query);
      return;
    }

    const structuredFilters: ParsedFilter[] = [
      location
        ? { id: "structured-location", kind: "location", label: location }
        : null,
      propertyType
        ? { id: "structured-type", kind: "custom", label: propertyType }
        : null,
      criteria
        ? { id: "structured-criteria", kind: "custom", label: criteria }
        : null,
      pricing
        ? { id: "structured-pricing", kind: "custom", label: pricing }
        : null,
    ].filter((filter): filter is ParsedFilter => filter !== null);

    if (structuredFilters.length === 0) return;
    setFilters(structuredFilters);
    setResults([]);
    setStage("parsed");
    requestAnimationFrame(() => understoodRef.current?.focus());
  }

  function handleRemoveFilter(id: string) {
    setFilters((prev) => prev.filter((filter) => filter.id !== id));
  }

  function handleUpdateFilter(id: string, label: string) {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === id ? { ...filter, label, unclear: false } : filter,
      ),
    );
  }

  function handleAddFilter(label: string) {
    setFilters((prev) => [
      ...prev,
      { id: `custom-${prev.length}-${label}`, kind: "custom", label },
    ]);
  }

  function handleShowMatches() {
    setResults(matchListings(filters));
    setStage("results");
  }

  function handleStartOver() {
    setQuery("");
    setFilters([]);
    setResults([]);
    setLocation("");
    setPropertyType("");
    setCriteria("");
    setPricing("");
    setStage("idle");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const announcement = useMemo(() => {
    if (stage === "idle") return "";
    if (stage === "parsed") {
      const understood = filters.filter((f) => !f.unclear).length;
      const unclear = filters.some((f) => f.unclear);
      return `Understood ${understood} filter${understood === 1 ? "" : "s"}${
        unclear ? ", with one part unclear" : ""
      }. Review them, then show matches.`;
    }
    return `Showing ${results.length} matching home${
      results.length === 1 ? "" : "s"
    }.`;
  }, [stage, filters, results]);

  const hasSearchInput =
    query.trim().length > 0 ||
    Boolean(location || propertyType || criteria || pricing);

  return (
    <div
      id="search"
      className="workspace-surface scroll-mt-28 overflow-hidden rounded-[1.5rem]"
    >
      {/* --- The sentence ------------------------------------------------ */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="focus-within:border-border-interactive flex min-w-0 flex-1 items-center gap-3 border-b border-transparent transition-colors duration-150">
            <Search
              aria-hidden="true"
              className="text-fg-muted size-5 shrink-0"
            />
            <label htmlFor={inputId} className="sr-only">
              Describe the home you are looking for
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="A quiet 2-bedroom in Lagos, under 900,000…"
              autoComplete="off"
              className="search-query-input text-body-l text-fg placeholder:text-fg-muted min-w-0 flex-1 bg-transparent px-1 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={!hasSearchInput}
            className="bg-action-primary text-fg-on-brand text-body-s hover:bg-action-primary-hover active:bg-action-primary-active inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-6 font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-35"
          >
            <Search aria-hidden="true" className="size-4" />
            Search
          </button>
        </div>

        {stage === "idle" ? (
          <div className="border-border-subtle mt-4 grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <SearchSelect
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Choose location"
              options={LOCATIONS}
            />
            <SearchSelect
              label="Type"
              value={propertyType}
              onChange={setPropertyType}
              placeholder="Choose property type"
              options={PROPERTY_TYPES}
            />
            <SearchSelect
              label="Criteria"
              value={criteria}
              onChange={setCriteria}
              placeholder="Choose criteria"
              options={CRITERIA}
            />
            <SearchSelect
              label="Pricing"
              value={pricing}
              onChange={setPricing}
              placeholder="Choose pricing"
              options={PRICE_RANGES}
            />
          </div>
        ) : null}
      </form>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* --- What we understood ------------------------------------------ */}
      <AnimatePresence initial={false}>
        {stage !== "idle" ? (
          <motion.div
            key="understood"
            {...reveal}
            className="border-border-subtle border-t px-4 pt-5 pb-4 sm:px-6"
          >
            <h3
              ref={understoodRef}
              tabIndex={-1}
              className="text-label text-fg-muted uppercase"
            >
              What we understood
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <FilterToken
                  key={filter.id}
                  filter={filter}
                  onRemove={handleRemoveFilter}
                  onUpdate={handleUpdateFilter}
                />
              ))}
              <AddFilter onAdd={handleAddFilter} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={handleShowMatches}
                className="border-border-interactive text-body-s text-fg hover:bg-subtle inline-flex h-11 items-center rounded-lg border px-5 font-medium transition-colors duration-150"
              >
                {stage === "results" ? "Update matches" : "Show matches"}
              </button>
              <button
                type="button"
                onClick={handleStartOver}
                className="text-body-s text-fg-muted hover:text-fg rounded transition-colors duration-150"
              >
                Start over
              </button>
            </div>

            {/* --- Matches ----------------------------------------------- */}
            <AnimatePresence initial={false}>
              {stage === "results" ? (
                <motion.div key="results" {...reveal} className="mt-6">
                  {results.map((property) => (
                    <MatchRow key={property.id} property={property} />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

type SearchSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly string[];
};

function SearchSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
}: SearchSelectProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="border-border-interactive bg-canvas flex min-w-0 flex-col gap-2 rounded-lg border px-4 py-3"
    >
      <span className="text-caption text-fg-muted">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-body-s text-fg min-w-0 cursor-pointer bg-transparent font-medium"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type AddFilterProps = {
  onAdd: (label: string) => void;
};

/** Inline control for adding a criterion the sentence didn't cover. */
function AddFilter({ onAdd }: AddFilterProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="border-border-subtle text-body-s text-fg-muted hover:border-border-default hover:text-fg inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed px-3 transition-colors duration-150"
      >
        <Plus aria-hidden="true" className="size-3.5" />
        Add
      </button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (trimmed) {
          onAdd(trimmed);
          setValue("");
        }
        setOpen(false);
      }}
      className="border-border-interactive bg-wash inline-flex h-9 items-center rounded-full border pr-1 pl-3"
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => {
          if (!value.trim()) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setValue("");
            setOpen(false);
          }
        }}
        placeholder="e.g. balcony"
        aria-label="Add a criterion"
        className="text-body-s text-fg placeholder:text-fg-muted w-28 bg-transparent"
      />
      <button
        type="submit"
        aria-label="Add criterion"
        className="text-fg-muted hover:bg-subtle hover:text-fg flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150"
      >
        <Plus aria-hidden="true" className="size-3.5" />
      </button>
    </form>
  );
}

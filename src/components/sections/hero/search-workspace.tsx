"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

import { FilterToken } from "./filter-token";
import { MatchRow } from "./match-row";
import { heroEase } from "./hero-motion";
import {
  SUGGESTED_QUERIES,
  matchListings,
  parseQuery,
} from "@/data/hero-search-demo";
import type { ParsedFilter, PropertyPreview } from "@/types";

type Stage = "idle" | "parsed" | "results";

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
    runParse(query);
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

  return (
    <div
      id="search"
      className="workspace-surface scroll-mt-28 rounded-[1.75rem] p-2"
    >
      {/* --- The sentence ------------------------------------------------ */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:py-3 sm:pr-3 sm:pl-6"
      >
        <label htmlFor={inputId} className="sr-only">
          Describe the home you are looking for
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="A quiet 2-bedroom in Kigali, under 900,000 a month…"
          autoComplete="off"
          className="text-body-l text-fg placeholder:text-fg-muted min-w-0 flex-1 bg-transparent py-2"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="bg-action-primary text-fg-on-brand text-body-s hover:bg-action-primary-hover active:bg-action-primary-active inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-35"
        >
          Search
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </form>

      {/* --- Suggestions, before anything has been asked ------------------ */}
      {stage === "idle" ? (
        <div className="border-border-subtle flex flex-col gap-x-6 gap-y-2 border-t px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
          <span className="text-label text-fg-muted uppercase">Try</span>
          {SUGGESTED_QUERIES.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => runParse(suggestion)}
              className="text-body-s text-fg-tertiary hover:text-fg rounded text-left transition-colors duration-150"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

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
                className="border-border-strong text-body-s text-fg hover:bg-subtle inline-flex h-11 items-center rounded-full border px-5 font-medium transition-colors duration-150"
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

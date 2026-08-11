"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

import type { FlatmateProfile } from "@/types";
import { cn } from "@/lib/utils";
import { INTEREST_EMOJI } from "@/components/flatmates/interest-tag";
import { PrivacyAwareProfile } from "@/components/flatmates/flatmate-profile";

const INTEREST_OPTIONS = Object.keys(INTEREST_EMOJI);

const SIGNAL_OPTIONS = [
  "Non-smoker",
  "Pet-friendly",
  "Prefers a quiet home",
  "Social lifestyle",
  "Very tidy",
  "Flexible schedule",
  "Early riser",
  "Night owl",
];

const MOVE_IN_OPTIONS = ["As soon as possible", "Next month", "In 2-3 months", "Flexible"];

function ToggleChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const emoji = INTEREST_EMOJI[label];
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        selected
          ? "border-black bg-black text-white"
          : "border-black/15 bg-white text-black/70 hover:bg-black/5",
      )}
    >
      {emoji ? <span aria-hidden="true">{emoji} </span> : null}
      {label}
    </button>
  );
}

/**
 * FlatMat's addition to the existing renter profile: roommate preferences
 * plus a live "How others see me" preview (src/Flatmate.md §13, §14). Not
 * persisted to a backend — matches this app's existing settings forms
 * (e.g. partner-dashboard/settings), which are local-state-only too.
 */
export function RenterFlatmatePreferences() {
  const [bio, setBio] = useState(
    "Product-minded and easygoing. Home most evenings, tidy shared spaces, always up for a coffee.",
  );
  const [interests, setInterests] = useState<string[]>(["Music", "Coffee", "Running"]);
  const [signals, setSignals] = useState<string[]>(["Non-smoker", "Prefers a quiet home"]);
  const [moveIn, setMoveIn] = useState(MOVE_IN_OPTIONS[1]);
  const [budgetMin, setBudgetMin] = useState("400");
  const [budgetMax, setBudgetMax] = useState("650");
  const [saved, setSaved] = useState(false);

  function toggle(list: string[], setList: (next: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  const previewProfile: FlatmateProfile = useMemo(
    () => ({
      id: "me",
      listingId: "",
      anonymizedName: "Hidden Name",
      realName: "Julien Mugisha",
      age: 27,
      isVerified: true,
      bio,
      interests,
      signals: [
        `Budget ${budgetMin}–${budgetMax} USD`,
        `Moving in: ${moveIn}`,
        ...signals,
      ],
    }),
    [bio, interests, signals, moveIn, budgetMin, budgetMax],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)] sm:p-8"
      >
        <div className="mb-7 flex gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-bricolage text-carbon-900 text-xl font-medium">
              Flatmate preferences
            </h2>
            <p className="text-carbon-500 mt-1 text-sm">
              Shown to other renters on the same listing once you connect.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium" htmlFor="flatmate-bio">
          Bio
        </label>
        <textarea
          id="flatmate-bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={3}
          className="border-border-default mt-2 w-full resize-none rounded-2xl border p-4 text-sm outline-none focus:border-black/30"
        />

        <p className="mt-6 text-sm font-medium">Interests</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((option) => (
            <ToggleChip
              key={option}
              label={option}
              selected={interests.includes(option)}
              onToggle={() => toggle(interests, setInterests, option)}
            />
          ))}
        </div>

        <p className="mt-6 text-sm font-medium">Lifestyle</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SIGNAL_OPTIONS.map((option) => (
            <ToggleChip
              key={option}
              label={option}
              selected={signals.includes(option)}
              onToggle={() => toggle(signals, setSignals, option)}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium" htmlFor="budget-min">
              Budget range (USD/month)
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="budget-min"
                type="number"
                min={0}
                value={budgetMin}
                onChange={(event) => setBudgetMin(event.target.value)}
                className="border-border-default w-full rounded-full border px-4 py-2.5 text-sm outline-none focus:border-black/30"
              />
              <span className="text-carbon-400 text-sm">–</span>
              <input
                aria-label="Budget max"
                type="number"
                min={0}
                value={budgetMax}
                onChange={(event) => setBudgetMax(event.target.value)}
                className="border-border-default w-full rounded-full border px-4 py-2.5 text-sm outline-none focus:border-black/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="move-in">
              Move-in timeframe
            </label>
            <select
              id="move-in"
              value={moveIn}
              onChange={(event) => setMoveIn(event.target.value)}
              className="border-border-default mt-2 w-full rounded-full border px-4 py-2.5 text-sm outline-none focus:border-black/30"
            >
              {MOVE_IN_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          {saved ? (
            <p role="status" className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 aria-hidden="true" className="size-4" /> Saved
            </p>
          ) : null}
          <button
            type="submit"
            className="font-bricolage h-11 rounded-full bg-black px-6 text-sm font-medium text-white transition-opacity hover:opacity-75"
          >
            Save changes
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        <div>
          <p className="font-bricolage text-carbon-900 text-lg font-medium">
            How others see me
          </p>
          <p className="text-carbon-500 mt-1 text-sm">
            Before and after a connection is accepted.
          </p>
        </div>
        <div className="border-border-default rounded-3xl border bg-white p-5">
          <p className="text-carbon-400 mb-3 text-xs font-medium tracking-wide uppercase">
            Before connecting
          </p>
          <PrivacyAwareProfile
            profile={previewProfile}
            state="locked"
            saved={false}
            showActions={false}
          />
        </div>
        <div className="border-border-default rounded-3xl border bg-white p-5">
          <p className="text-carbon-400 mb-3 text-xs font-medium tracking-wide uppercase">
            After connecting
          </p>
          <PrivacyAwareProfile
            profile={previewProfile}
            state="accepted"
            saved={false}
            showActions={false}
          />
        </div>
      </div>
    </div>
  );
}

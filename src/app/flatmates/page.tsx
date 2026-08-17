import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import emptyIllustration from "@/assets/images/empty.png";
import { CurrencyFilterSelect } from "@/components/currency/currency-selector";
import { FlatmateAuthAction } from "@/components/flatmates/flatmate-auth-action";
import { FlatmatePortrait } from "@/components/flatmates/flatmate-portrait";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AutoSubmitFilterForm } from "@/components/listings/auto-submit-filter-form";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import { PUBLIC_FLATMATES, type PublicFlatmate } from "@/data/public-flatmates";

export const metadata: Metadata = {
  title: "Find a flatmate | HauxHunt",
  description:
    "Find someone compatible to share a home and rent with across Rwanda, Kenya, and Nigeria.",
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function FlatmatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const location = valueOf(params.location).trim();
  const budget = valueOf(params.budget);
  const moveIn = valueOf(params.moveIn);
  const situation = valueOf(params.situation);
  const gender = valueOf(params.gender);
  const occupation = valueOf(params.occupation);
  const smoking = valueOf(params.smoking);
  const lifestyle = valueOf(params.lifestyle);
  const showAll = valueOf(params.view) === "all";

  const filtered = PUBLIC_FLATMATES.filter((flatmate) => {
    const searchableLocation =
      `${flatmate.city} ${flatmate.country} ${flatmate.areas.join(" ")}`.toLowerCase();
    const locationMatch =
      !location || searchableLocation.includes(location.toLowerCase());
    const budgetMatch =
      !budget ||
      (budget === "under-300" && flatmate.budgetMin < 300000) ||
      (budget === "300-450" &&
        flatmate.budgetMin <= 450000 &&
        flatmate.budgetMax >= 300000) ||
      (budget === "450-600" &&
        flatmate.budgetMin <= 600000 &&
        flatmate.budgetMax >= 450000) ||
      (budget === "above-600" && flatmate.budgetMax > 600000);
    return (
      locationMatch &&
      budgetMatch &&
      (!moveIn || flatmate.moveInValue === moveIn) &&
      (!situation || flatmate.situation === situation) &&
      (!gender || flatmate.gender === gender) &&
      (!occupation ||
        flatmate.occupation.toLowerCase().includes(occupation.toLowerCase())) &&
      (!smoking || flatmate.smoking === smoking) &&
      (!lifestyle || flatmate.lifestyle === lifestyle)
    );
  });

  const visible = showAll ? filtered : filtered.slice(0, 6);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({
    location,
    budget,
    moveIn,
    situation,
    gender,
    occupation,
    smoking,
    lifestyle,
  })) {
    if (value) query.set(key, value);
  }
  const allQuery = new URLSearchParams(query);
  allQuery.set("view", "all");

  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="bg-carbon-50 px-5 pt-8 pb-6 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <h1 className="dashboard-page-title text-carbon-900">
              Find a Flatmate
            </h1>
            <p className="text-carbon-600 mt-3 max-w-3xl text-base leading-6">
              Find people whose budget, location, move-in plans, and lifestyle
              could work with yours.
            </p>
          </div>
        </section>

        <section
          id="flatmate-filters"
          className="bg-carbon-50 px-5 py-4 sm:px-6 lg:px-11 xl:px-[52px]"
        >
          <AutoSubmitFilterForm
            action="/flatmates"
            className="mx-auto grid max-w-[1562px] gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <label className="catalogue-location-filter flex h-12 items-center gap-2 bg-white px-4 shadow-[0_6px_18px_rgba(0,0,0,0.09)]">
              <Search aria-hidden="true" className="text-carbon-500 size-4" />
              <input
                name="location"
                defaultValue={location}
                data-no-auto-submit="true"
                data-submit-when-empty="true"
                placeholder="Location"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm shadow-none ring-0 outline-none"
              />
              <VoiceInputButton />
            </label>
            <CurrencyFilterSelect
              name="budget"
              label="Monthly Budget"
              value={budget}
              placeholder="Budget"
              hideLabel
              pill
              ranges={[
                { value: "under-300", minimumUsd: null, maximumUsd: 215 },
                { value: "300-450", minimumUsd: 215, maximumUsd: 325 },
                { value: "450-600", minimumUsd: 325, maximumUsd: 430 },
                { value: "above-600", minimumUsd: 430, maximumUsd: null },
              ]}
            />
            <FilterSelect
              name="moveIn"
              label="Move-in"
              value={moveIn}
              options={[
                ["2026-08", "Available now"],
                ["2026-09", "September 2026"],
                ["2026-10", "October 2026"],
                ["2026-11", "November 2026"],
              ]}
            />
            <FilterSelect
              name="situation"
              label="Housing Situation"
              value={situation}
              options={[
                ["", "Any"],
                ["looking", "Looking for a place"],
                ["has-place", "Already has a place"],
              ]}
            />
            <details className="group relative z-20">
              <summary className="flex h-12 cursor-pointer list-none items-center justify-between rounded-full bg-white px-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.09)] [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal aria-hidden="true" className="size-4" />
                  More Filters
                </span>
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute top-[calc(100%+0.65rem)] right-0 grid w-[min(88vw,560px)] gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:grid-cols-2">
                <FilterSelect
                  name="gender"
                  label="Gender preference"
                  value={gender}
                  options={[
                    ["female", "Female"],
                    ["male", "Male"],
                  ]}
                />
                <FilterSelect
                  name="occupation"
                  label="Occupation"
                  value={occupation}
                  options={[
                    ["professional", "Professional"],
                    ["engineer", "Engineer"],
                    ["designer", "Designer"],
                    ["student", "Student"],
                  ]}
                />
                <FilterSelect
                  name="smoking"
                  label="Smoking"
                  value={smoking}
                  options={[
                    ["non-smoker", "Non-smoker"],
                    ["outdoor-only", "Outdoor only"],
                  ]}
                />
                <FilterSelect
                  name="lifestyle"
                  label="Lifestyle"
                  value={lifestyle}
                  options={[
                    ["quiet", "Quiet"],
                    ["balanced", "Balanced"],
                    ["social", "Social"],
                  ]}
                />
              </div>
            </details>
          </AutoSubmitFilterForm>
        </section>

        <section className="px-5 py-8 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            {query.size ? (
              <div className="mb-5 flex justify-end">
                <Link
                  href="/flatmates"
                  className="inline-flex h-11 items-center rounded-full border border-black/20 px-5 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                >
                  Clear Filters
                </Link>
              </div>
            ) : null}

            {visible.length ? (
              <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((flatmate, index) => (
                  <FlatmateCard
                    key={flatmate.id}
                    flatmate={flatmate}
                    priority={index < 3}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
                <Image src={emptyIllustration} alt="" className="h-40 w-auto" />
                <h3 className="font-bricolage mt-5 text-2xl font-medium">
                  No Flatmates Match These Filters
                </h3>
                <p className="text-carbon-500 mt-2 text-sm">
                  Try adjusting your location, budget, move-in date, or
                  preferences.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/flatmates"
                    className="h-11 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
                  >
                    Clear Filters
                  </Link>
                  <a
                    href="#flatmate-filters"
                    className="h-11 rounded-full border border-black/20 px-5 py-3 text-sm font-medium"
                  >
                    Adjust Filters
                  </a>
                </div>
              </div>
            )}

            {filtered.length > 6 ? (
              <div className="mt-9 flex justify-center">
                <Link
                  href={
                    showAll
                      ? `/flatmates${query.size ? `?${query}` : ""}`
                      : `/flatmates?${allQuery}`
                  }
                  className="inline-flex h-11 items-center px-6 text-sm font-medium transition-opacity hover:opacity-55"
                >
                  {showAll ? "Show fewer" : "View more people"}
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        <section className="px-5 pb-14 sm:px-6 lg:px-11 lg:pb-20 xl:px-[52px]">
          <div className="mx-auto flex max-w-[1562px] flex-col items-start justify-between gap-6 rounded-3xl bg-black px-7 py-9 text-white sm:px-10 sm:py-11 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-bricolage text-3xl font-medium tracking-[-0.035em]">
                Looking for someone to share rent with?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Create your Flatmate Profile and tell people what kind of living
                arrangement you&apos;re looking for.
              </p>
            </div>
            <FlatmateAuthAction
              label="Create Flatmate Profile"
              returnTo="/flatmates"
              title="Sign in to create your profile"
              className="font-bricolage h-12 shrink-0 rounded-full bg-white px-6 font-medium text-black"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FlatmateCard({
  flatmate,
  priority,
}: {
  flatmate: PublicFlatmate;
  priority: boolean;
}) {
  const isLooking = flatmate.situation === "looking";
  const compactBudget = (value: number) =>
    `${Math.round(value / 1000).toLocaleString("en-US")}K`;
  return (
    <Link
      href={`/flatmates/${flatmate.id}`}
      aria-label={`View ${flatmate.firstName}'s profile`}
      className="group block h-full"
    >
      <article className="relative h-full min-h-[460px] overflow-hidden rounded-[2rem] bg-black shadow-[0_14px_42px_rgba(0,0,0,0.13)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_55px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.025]">
          <FlatmatePortrait
            src={flatmate.portrait}
            name={flatmate.firstName}
            priority={priority}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <div className="min-w-0">
            <h3 className="font-bricolage flex items-center gap-1.5 text-xl leading-none font-medium tracking-[-0.03em]">
              <span>
                {flatmate.firstName}, {flatmate.age}
              </span>
              <BadgeCheck
                aria-label="Verified profile"
                className="size-[18px] shrink-0 fill-white text-[#242424] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              />
            </h3>
            <p className="mt-0.5 truncate text-xs text-white/72">
              {flatmate.occupation} · {flatmate.city}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="inline-flex rounded-full border border-white/25 bg-white/12 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
              {isLooking ? "Looking for a place" : "Already has a place"}
            </span>
            <p className="flex shrink-0 items-baseline gap-1 text-sm font-medium">
              <span>
                {isLooking
                  ? `RWF ${compactBudget(flatmate.budgetMin)}–${compactBudget(flatmate.budgetMax)}`
                  : `~ RWF ${compactBudget(flatmate.budgetMin)}`}
              </span>
              <span className="text-[9px] font-normal text-white/60">
                Per month
              </span>
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {flatmate.lifestyleTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/14 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: Array<[string, string]>;
}) {
  return (
    <label className="relative block">
      <select
        aria-label={label}
        name={name}
        defaultValue={value}
        className="catalogue-filter-control h-12 w-full appearance-none rounded-full border-0 bg-white pr-11 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.09)] ring-0 outline-none focus:ring-0"
      >
        <option value="">{label}</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={`${name}-${optionValue || "any"}`} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-black/55"
      />
    </label>
  );
}

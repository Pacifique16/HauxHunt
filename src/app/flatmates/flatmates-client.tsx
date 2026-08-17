"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import emptyIllustration from "@/assets/images/empty.png";
import { CurrencyFilterSelect } from "@/components/currency/currency-selector";
import { FlatmateBanner } from "@/components/flatmates/flatmate-banner";
import { FlatmateCard } from "@/components/flatmates/flatmate-card";
import { FlatmatesNavigation } from "@/components/flatmates/flatmates-navigation";
import { Footer } from "@/components/layout/footer";
import { AutoSubmitFilterForm } from "@/components/listings/auto-submit-filter-form";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import { PUBLIC_FLATMATES, type PublicFlatmate } from "@/data/public-flatmates";

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function FlatmatesPageClient({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = use(searchParams);
  const renterView = valueOf(params.from) === "renter";
  const location = valueOf(params.location).trim();
  const budget = valueOf(params.budget);
  const moveIn = valueOf(params.moveIn);
  const situation = valueOf(params.situation);
  const gender = valueOf(params.gender);
  const occupation = valueOf(params.occupation);
  const smoking = valueOf(params.smoking);
  const lifestyle = valueOf(params.lifestyle);
  const showAll = valueOf(params.view) === "all";
  const country = valueOf(params.country);

  // Client states
  const [hasProfile, setHasProfile] = useState(false);
  const [customProfileData, setCustomProfileData] = useState<any>(null);

  useEffect(() => {
    const published = window.sessionStorage.getItem("hauxhunt-has-flatmate-profile") === "true";
    setHasProfile(published);
    if (published) {
      const saved = window.sessionStorage.getItem("hauxhunt-flatmate-profile-data");
      if (saved) {
        try {
          setCustomProfileData(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const filtered = PUBLIC_FLATMATES.filter((flatmate) => {
    // If it's Julien, we override with client-side details if custom profile exists,
    // otherwise use default fields.
    const f = (flatmate.id === "julien" && customProfileData) ? {
      ...flatmate,
      firstName: customProfileData.firstName || flatmate.firstName,
      age: Number(customProfileData.age) || flatmate.age,
      occupation: customProfileData.occupation || flatmate.occupation,
      city: customProfileData.city || flatmate.city,
      country: customProfileData.country || flatmate.country,
      situation: customProfileData.situation || flatmate.situation,
      budgetMin: Number(customProfileData.budget) || flatmate.budgetMin,
      budgetMax: Number(customProfileData.budget) || flatmate.budgetMax,
      areas: customProfileData.areas || flatmate.areas,
      lifestyleTags: customProfileData.lifestyleTags || flatmate.lifestyleTags,
      gender: customProfileData.gender || flatmate.gender,
    } : flatmate;

    // Filter logic
    const searchableLocation =
      `${f.city} ${f.country} ${f.areas.join(" ")}`.toLowerCase();
    const locationMatch =
      !location || searchableLocation.includes(location.toLowerCase());
    const countryMatch = !country || f.country.toLowerCase() === country.toLowerCase();
    const budgetMatch =
      !budget ||
      (budget === "under-300" && f.budgetMin < 300000) ||
      (budget === "300-450" &&
        f.budgetMin <= 450000 &&
        f.budgetMax >= 300000) ||
      (budget === "450-600" &&
        f.budgetMin <= 600000 &&
        f.budgetMax >= 450000) ||
      (budget === "above-600" && f.budgetMax > 600000);
    return (
      locationMatch &&
      countryMatch &&
      budgetMatch &&
      (!moveIn || f.moveInValue === moveIn) &&
      (!situation || f.situation === situation) &&
      (!gender || f.gender === gender) &&
      (!occupation ||
        f.occupation.toLowerCase().includes(occupation.toLowerCase())) &&
      (!smoking || f.smoking === smoking) &&
      (!lifestyle || f.lifestyle === lifestyle)
    );
  });

  // Filter out Julien if profile not published
  const withoutUnpublishedJulien = filtered.filter(
    (flatmate) => flatmate.id !== "julien" || hasProfile
  );

  // Compute "People matching your needs" — only when viewer has a published profile
  const suggestedFlatmates = hasProfile && customProfileData
    ? PUBLIC_FLATMATES.filter((f) => {
        if (f.id === "julien") return false; // exclude self
        const viewerBudget = Number(customProfileData.budget) || 450000;
        const viewerAreas: string[] = customProfileData.areas || [];
        const viewerTags: string[] = customProfileData.lifestyleTags || [];
        const viewerSituation: string = customProfileData.situation || "looking";
        const budgetOverlap = f.budgetMin <= viewerBudget * 1.3 && f.budgetMax >= viewerBudget * 0.7;
        const areaOverlap = viewerAreas.length === 0 || f.areas.some((a) => viewerAreas.includes(a));
        const tagOverlap = viewerTags.length === 0 || f.lifestyleTags.some((t) => viewerTags.includes(t));
        const situationMatch = viewerSituation === "looking" ? f.situation === "looking" : f.situation === "looking";
        return budgetOverlap && areaOverlap && tagOverlap && situationMatch;
      }).slice(0, 4)
    : [];

  const visible = showAll ? withoutUnpublishedJulien : withoutUnpublishedJulien.slice(0, 6);
  const hasFilters = Boolean(
    location ||
      country ||
      budget ||
      moveIn ||
      situation ||
      gender ||
      occupation ||
      smoking ||
      lifestyle
  );
  const query = new URLSearchParams();
  if (renterView) query.set("from", "renter");
  for (const [key, value] of Object.entries({
    location,
    country,
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

  const finalFlatmates = visible.map((flatmate) => {
    if (flatmate.id === "julien" && customProfileData) {
      return {
        ...flatmate,
        firstName: customProfileData.firstName || flatmate.firstName,
        age: Number(customProfileData.age) || flatmate.age,
        occupation: customProfileData.occupation || flatmate.occupation,
        city: customProfileData.city || flatmate.city,
        country: customProfileData.country || flatmate.country,
        situation: customProfileData.situation || flatmate.situation,
        portrait: customProfileData.profileImage || flatmate.portrait,
        budgetMin: Number(customProfileData.budget) || flatmate.budgetMin,
        budgetMax: Number(customProfileData.budget) || flatmate.budgetMax,
        areas: customProfileData.areas || flatmate.areas,
        lifestyleTags: customProfileData.lifestyleTags || flatmate.lifestyleTags,
      };
    }
    return flatmate;
  });

  return (
    <>
      <FlatmatesNavigation initialRenterView={renterView} />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="bg-carbon-50 px-5 pt-8 pb-4 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto flex max-w-[1562px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">
                Find a Flatmate
              </h1>
              <p className="text-carbon-600 mt-3 max-w-3xl text-base leading-6">
                Find people whose budget, location, move-in plans, and lifestyle
                could work with yours.
              </p>
            </div>
            {hasFilters ? (
              <Link
                href={renterView ? "/flatmates?from=renter" : "/flatmates"}
                className="inline-flex h-10 shrink-0 items-center rounded-full border border-black/20 bg-white px-5 text-xs font-medium text-black transition-colors hover:bg-black hover:text-white"
              >
                Clear Filters
              </Link>
            ) : null}
          </div>
        </section>

        <section
          id="flatmate-filters"
          className="bg-carbon-50 px-5 py-4 sm:px-6 lg:px-11 xl:px-[52px]"
        >
          <AutoSubmitFilterForm
            action="/flatmates"
            className="mx-auto grid max-w-[1562px] gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr]"
          >
            {renterView ? <input type="hidden" name="from" value="renter" /> : null}
            <label className="catalogue-location-filter flex h-10 items-center gap-2 bg-white px-4 shadow-[0_8px_24px_rgba(0,0,0,0.09)]">
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
              name="country"
              label="Country"
              value={country}
              options={[
                ["Rwanda", "Rwanda"],
                ["Kenya", "Kenya"],
                ["Nigeria", "Nigeria"],
                ["Uganda", "Uganda"],
              ]}
            />
            <details className="group relative z-20 block w-full">
              <summary className="flex h-10 w-full cursor-pointer list-none items-center justify-between rounded-full bg-white px-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.09)] ring-0 outline-none [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2 truncate">
                  <SlidersHorizontal aria-hidden="true" className="size-4 shrink-0 text-carbon-500" />
                  <span>More Filters</span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-black/55 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute top-[calc(100%+0.65rem)] right-0 grid w-[min(88vw,560px)] gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:grid-cols-2">
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
            {finalFlatmates.length ? (
              <>
                <div className="mb-5">
                  <h2 className="font-bricolage text-xl font-semibold text-neutral-900">People looking for flatmates</h2>
                </div>
                <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {finalFlatmates.map((flatmate, index) => (
                  <FlatmateCard
                    key={flatmate.id}
                    flatmate={flatmate}
                    priority={index < 3}
                    renterView={renterView}
                  />
                ))}
              </div>
              </>
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
                    href={renterView ? "/flatmates?from=renter" : "/flatmates"}
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

            {withoutUnpublishedJulien.length > 6 ? (
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

        {suggestedFlatmates.length > 0 && (
          <section className="px-5 pb-10 sm:px-6 lg:px-11 xl:px-[52px]">
            <div className="mx-auto max-w-[1562px]">
              <div className="mb-5">
                <h2 className="font-bricolage text-xl font-semibold text-neutral-900">People matching your needs in a flatmate</h2>
              </div>
              <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {suggestedFlatmates.map((flatmate, index) => (
                  <FlatmateCard
                    key={flatmate.id}
                    flatmate={flatmate}
                    priority={false}
                    renterView={renterView}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <FlatmateBanner initialRenterView={renterView} />
      </main>
      {renterView ? null : <Footer />}
    </>
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
        className="catalogue-filter-control h-10 w-full appearance-none rounded-full border-0 bg-white pr-11 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.09)] ring-0 outline-none focus:ring-0"
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

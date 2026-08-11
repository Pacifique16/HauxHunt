import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AutoSubmitFilterForm } from "@/components/listings/auto-submit-filter-form";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import { Button } from "@/components/ui/button";
import { FlatmateFeedGrid, type FlatmateFeedItem } from "@/components/flatmates/flatmate-feed-grid";
import { DEMO_LISTINGS } from "@/data/hero-search-demo";
import { FLATMATE_PROFILES } from "@/data/flatmates-demo";

export const metadata: Metadata = {
  title: "Find a flatmate | HauxHunt",
  description:
    "Discover and connect with compatible flatmates across Rwanda, Nigeria, and Kenya.",
};

// Every interest tag that shows up in the demo data — kept dynamic rather
// than hardcoded so the filter never drifts from what profiles actually have.
const ALL_INTERESTS = Array.from(
  new Set(FLATMATE_PROFILES.flatMap((profile) => profile.interests)),
).sort();

// Lifestyle-style signals only (excludes "Budget matches" and "Moving in
// ___", which are match facts rather than a preference someone would filter
// a person by).
const LIFESTYLE_SIGNALS = Array.from(
  new Set(
    FLATMATE_PROFILES.flatMap((profile) => profile.signals).filter(
      (signal) => !/^(budget matches|moving in)/i.test(signal),
    ),
  ),
).sort();

export default async function FlatmatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const valueOf = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  const locationFilter = valueOf(params.location).trim().toLowerCase();
  const interestFilter = valueOf(params.interest);
  const lifestyleFilter = valueOf(params.lifestyle);
  const verifiedOnly = valueOf(params.verified) === "1";

  const items: FlatmateFeedItem[] = FLATMATE_PROFILES.filter((profile) => {
    const listing = DEMO_LISTINGS.find((demo) => demo.id === profile.listingId);
    const locationMatches =
      !locationFilter || Boolean(listing?.location.toLowerCase().includes(locationFilter));
    const interestMatches = !interestFilter || profile.interests.includes(interestFilter);
    const lifestyleMatches = !lifestyleFilter || profile.signals.includes(lifestyleFilter);
    const verifiedMatches = !verifiedOnly || profile.isVerified;
    return locationMatches && interestMatches && lifestyleMatches && verifiedMatches;
  }).map((profile) => ({
    profile,
    listing: DEMO_LISTINGS.find((demo) => demo.id === profile.listingId),
  }));

  const hasFilters = Boolean(locationFilter || interestFilter || lifestyleFilter || verifiedOnly);

  const cityCount = new Set(
    FLATMATE_PROFILES.map(
      (profile) => DEMO_LISTINGS.find((demo) => demo.id === profile.listingId)?.location,
    ).filter(Boolean),
  ).size;
  const verifiedCount = FLATMATE_PROFILES.filter((profile) => profile.isVerified).length;

  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-16">
        <section className="bg-white px-5 pt-10 pb-8 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <h1 className="dashboard-page-title text-carbon-900">Find a flatmate</h1>
            <p className="text-carbon-600 mt-4 max-w-3xl text-lg leading-7">
              Meet renters across Rwanda, Nigeria, and Kenya who are looking for someone to
              share a home with. Get to know each other and agree to connect first —
              identities stay hidden until you both do, then you can pick an apartment
              together.
            </p>
            <p className="text-carbon-500 mt-4 text-sm">
              {FLATMATE_PROFILES.length} people looking for a flatmate · {verifiedCount}{" "}
              verified · {cityCount} {cityCount === 1 ? "city" : "cities"}
            </p>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white px-5 py-5 sm:px-6 lg:px-11 xl:px-[52px]">
          <AutoSubmitFilterForm
            action="/flatmates"
            className="mx-auto grid max-w-[1562px] gap-3 md:grid-cols-2 xl:grid-cols-4"
          >
            <label className="flex h-12 items-center gap-2 rounded-2xl bg-black/[0.045] px-4">
              <input
                name="location"
                defaultValue={valueOf(params.location)}
                data-no-auto-submit="true"
                data-submit-when-empty="true"
                placeholder="Location"
                style={{ border: 0, boxShadow: "none", outline: "none" }}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm shadow-none ring-0 outline-none focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
              <VoiceInputButton />
            </label>
            <FilterSelect
              name="interest"
              label="Interest"
              value={interestFilter}
              options={ALL_INTERESTS.map((interest) => [interest, interest] as [string, string])}
            />
            <FilterSelect
              name="lifestyle"
              label="Lifestyle"
              value={lifestyleFilter}
              options={LIFESTYLE_SIGNALS.map(
                (signal) => [signal, signal] as [string, string],
              )}
            />
            <label className="flex h-12 items-center gap-2.5 rounded-2xl bg-black/[0.045] px-4 text-sm">
              <input
                type="checkbox"
                name="verified"
                value="1"
                defaultChecked={verifiedOnly}
                className="size-4 rounded border-black/20"
              />
              Verified only
            </label>
          </AutoSubmitFilterForm>
        </section>

        <section className="px-5 py-10 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
                  People looking for a flatmate
                </h2>
                <p className="text-carbon-500 mt-1 text-sm">
                  {items.length} {items.length === 1 ? "person" : "people"} match your filters.
                  Interests and lifestyle signals help you tell whether you&apos;d work well
                  together — identities unlock once you both agree to connect.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {hasFilters ? (
                  <Button asChild variant="outline-solid" size="pill">
                    <Link href="/flatmates">Clear filters</Link>
                  </Button>
                ) : null}
                <Button asChild variant="solid" size="pill">
                  <Link href="/renter-dashboard/profile">Set up your flatmate profile</Link>
                </Button>
              </div>
            </div>

            <FlatmateFeedGrid items={items} />
          </div>
        </section>
      </main>
      <Footer />
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
        className="h-12 w-full appearance-none rounded-2xl border-0 bg-black/[0.045] pr-11 pl-4 text-sm ring-0 outline-none focus:ring-0 focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
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

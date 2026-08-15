import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  Bath,
  BedDouble,
  CalendarDays,
  ChevronDown,
  MapPin,
  Ruler,
  Search,
  Sofa,
  UsersRound,
} from "lucide-react";

import house1 from "../../../house1.jpg";
import house2 from "../../../house2.jpg";
import house3 from "../../../house3.jpg";
import house4 from "../../../house4.jpg";
import house5 from "../../../house5.jpg";
import house6 from "../../../house6.jpeg";
import emptyIllustration from "../../../empty.png";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AutoSubmitFilterForm } from "@/components/listings/auto-submit-filter-form";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import {
  CurrencyAmount,
  CurrencyFilterSelect,
} from "@/components/currency/currency-selector";

export const metadata: Metadata = {
  title: "Find a flatmate | HauxHunt",
  description:
    "Find compatible flatmates and shared rental homes across Rwanda, Nigeria, and Kenya.",
};

const SHARED_HOMES: Array<{
  title: string;
  location: string;
  price: string;
  available: string;
  household: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  likes: string[];
  dislikes: string[];
  genderPreference: "any" | "female" | "male";
  occupationPreference: "any" | "student" | "professional" | "remote-worker";
  image: StaticImageData;
}> = [
  {
    title: "Room in a calm 3-bedroom apartment",
    location: "Kacyiru, Kigali",
    price: "USD 280 / month",
    available: "Available 1 Sep",
    household: "2 people currently living here",
    bedrooms: 3,
    bathrooms: 2,
    area: 118,
    amenities: ["Furnished", "Wi-Fi", "Parking"],
    likes: ["Quiet evenings", "Shared cooking"],
    dislikes: ["Smoking", "Loud parties"],
    genderPreference: "any",
    occupationPreference: "student",
    image: house1,
  },
  {
    title: "Share a furnished apartment near town",
    location: "Kilimani, Nairobi",
    price: "USD 340 / month",
    available: "Available now",
    household: "1 person currently living here",
    bedrooms: 2,
    bathrooms: 2,
    area: 94,
    amenities: ["Furnished", "Gym", "Security"],
    likes: ["Clean shared spaces", "Social weekends"],
    dislikes: ["Indoor smoking", "Unannounced guests"],
    genderPreference: "female",
    occupationPreference: "professional",
    image: house2,
  },
  {
    title: "Private room in a secure compound",
    location: "Lekki, Lagos",
    price: "USD 420 / month",
    available: "Available 15 Sep",
    household: "2 people currently living here",
    bedrooms: 4,
    bathrooms: 3,
    area: 176,
    amenities: ["Backup power", "Parking", "Air conditioning"],
    likes: ["Professionals", "Occasional visitors"],
    dislikes: ["Smoking", "Poor communication"],
    genderPreference: "male",
    occupationPreference: "professional",
    image: house3,
  },
  {
    title: "Bright room close to offices and transit",
    location: "Remera, Kigali",
    price: "USD 230 / month",
    available: "Available now",
    household: "1 person currently living here",
    bedrooms: 2,
    bathrooms: 1,
    area: 82,
    amenities: ["Wi-Fi", "Water tank", "Balcony"],
    likes: ["Early mornings", "Quiet home"],
    dislikes: ["Pets", "Late-night noise"],
    genderPreference: "any",
    occupationPreference: "student",
    image: house4,
  },
  {
    title: "Room in a modern shared duplex",
    location: "Wuse II, Abuja",
    price: "USD 390 / month",
    available: "Available 5 Oct",
    household: "3 people currently living here",
    bedrooms: 5,
    bathrooms: 4,
    area: 214,
    amenities: ["Furnished", "Backup power", "Security"],
    likes: ["Social dinners", "Shared cooking"],
    dislikes: ["Smoking indoors", "Messy common areas"],
    genderPreference: "any",
    occupationPreference: "professional",
    image: house5,
  },
  {
    title: "Lake-side home seeking one flatmate",
    location: "Gisenyi, Rwanda",
    price: "USD 260 / month",
    available: "Available 20 Sep",
    household: "1 person currently living here",
    bedrooms: 3,
    bathrooms: 2,
    area: 126,
    amenities: ["Lake view", "Furnished", "Parking"],
    likes: ["Remote workers", "Quiet routines"],
    dislikes: ["Smoking", "Frequent parties"],
    genderPreference: "any",
    occupationPreference: "remote-worker",
    image: house6,
  },
];

export default async function FlatmatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const valueOf = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
  const locationFilter = valueOf(params.location).trim().toLowerCase();
  const typeFilter = valueOf(params.type).trim().toLowerCase();
  const priceRangeFilter = valueOf(params.priceRange);
  const budgetFilter = valueOf(params.budget);
  const genderFilter = valueOf(params.gender);
  const bedroomsFilter = valueOf(params.bedrooms);
  const occupationFilter = valueOf(params.occupation);
  const showAll =
    (Array.isArray(params.view) ? params.view[0] : params.view) === "all";
  const filteredHomes = SHARED_HOMES.filter((home) => {
    const monthlyContribution = Number(home.price.replace(/[^0-9]/g, ""));
    const searchableHomeType =
      `${home.title} ${home.amenities.join(" ")}`.toLowerCase();
    const locationMatches =
      !locationFilter || home.location.toLowerCase().includes(locationFilter);
    const typeMatches =
      !typeFilter || searchableHomeType.includes(typeFilter.toLowerCase());
    const priceRangeMatches =
      !priceRangeFilter ||
      (priceRangeFilter === "USD 50 – 100" && monthlyContribution <= 100) ||
      (priceRangeFilter === "USD 100 – 150" &&
        monthlyContribution >= 100 &&
        monthlyContribution <= 150) ||
      (priceRangeFilter === "USD 150 – 250" &&
        monthlyContribution >= 150 &&
        monthlyContribution <= 250) ||
      (priceRangeFilter === "USD 250 – 500" &&
        monthlyContribution >= 250 &&
        monthlyContribution <= 500) ||
      (priceRangeFilter === "USD 500 – 1,000" &&
        monthlyContribution >= 500 &&
        monthlyContribution <= 1000) ||
      (priceRangeFilter === "USD 1,000+" && monthlyContribution >= 1000);
    const budgetMatches =
      !budgetFilter ||
      (budgetFilter === "under-250" && monthlyContribution < 250) ||
      (budgetFilter === "250-400" &&
        monthlyContribution >= 250 &&
        monthlyContribution <= 400) ||
      (budgetFilter === "above-400" && monthlyContribution > 400);
    const genderMatches =
      !genderFilter ||
      genderFilter === "any" ||
      home.genderPreference === "any" ||
      home.genderPreference === genderFilter;
    const bedroomsMatches =
      !bedroomsFilter ||
      (bedroomsFilter === "4+"
        ? home.bedrooms >= 4
        : home.bedrooms === Number(bedroomsFilter));
    const occupationMatches =
      !occupationFilter ||
      occupationFilter === "any" ||
      home.occupationPreference === "any" ||
      home.occupationPreference === occupationFilter;

    return (
      locationMatches &&
      typeMatches &&
      priceRangeMatches &&
      budgetMatches &&
      genderMatches &&
      bedroomsMatches &&
      occupationMatches
    );
  });
  const visibleHomes = showAll ? filteredHomes : filteredHomes.slice(0, 4);
  const filterQuery = new URLSearchParams();
  if (locationFilter) filterQuery.set("location", valueOf(params.location));
  if (typeFilter) filterQuery.set("type", valueOf(params.type));
  if (priceRangeFilter) filterQuery.set("priceRange", priceRangeFilter);
  if (budgetFilter) filterQuery.set("budget", budgetFilter);
  if (genderFilter) filterQuery.set("gender", genderFilter);
  if (bedroomsFilter) filterQuery.set("bedrooms", bedroomsFilter);
  if (occupationFilter) filterQuery.set("occupation", occupationFilter);
  const showAllQuery = new URLSearchParams(filterQuery);
  showAllQuery.set("view", "all");
  const hasFilters = Boolean(
    locationFilter ||
    typeFilter ||
    priceRangeFilter ||
    budgetFilter ||
    (genderFilter && genderFilter !== "any") ||
    bedroomsFilter ||
    (occupationFilter && occupationFilter !== "any"),
  );

  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-16">
        <section className="bg-white px-5 pt-10 pb-8 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <h1 className="dashboard-page-title text-carbon-900">
              Find a flatmate
            </h1>
            <p className="text-carbon-600 mt-4 max-w-3xl text-lg leading-7">
              Join a shared rental posted by the people already living there,
              compare your contribution, and understand the home and household
              before deciding.
            </p>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white px-5 py-5 sm:px-6 lg:px-11 xl:px-[52px]">
          <AutoSubmitFilterForm
            action="/flatmates"
            className="mx-auto grid max-w-[1562px] gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <input type="hidden" name="type" value={valueOf(params.type)} />
            <input type="hidden" name="priceRange" value={priceRangeFilter} />
            <label className="catalogue-location-filter flex items-center gap-2 px-4">
              <Search aria-hidden="true" className="text-carbon-500 size-4" />
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
              name="gender"
              label="Gender"
              value={genderFilter}
              options={[
                ["any", "Any gender"],
                ["female", "Female"],
                ["male", "Male"],
              ]}
            />
            <CurrencyFilterSelect
              name="budget"
              label="Monthly budget"
              value={budgetFilter}
              placeholder="Monthly budget"
              filled
              ranges={[
                { value: "under-250", minimumUsd: null, maximumUsd: 250 },
                { value: "250-400", minimumUsd: 250, maximumUsd: 400 },
                { value: "above-400", minimumUsd: 400, maximumUsd: null },
              ]}
            />
            <FilterSelect
              name="bedrooms"
              label="Bedrooms"
              value={bedroomsFilter}
              options={[
                ["1", "1 bedroom"],
                ["2", "2 bedrooms"],
                ["3", "3 bedrooms"],
                ["4+", "4+ bedrooms"],
              ]}
            />
            <FilterSelect
              name="occupation"
              label="Occupation"
              value={occupationFilter}
              options={[
                ["any", "Any occupation"],
                ["student", "Student"],
                ["professional", "Professional"],
                ["remote-worker", "Remote worker"],
                ["self-employed", "Self-employed"],
              ]}
            />
          </AutoSubmitFilterForm>
        </section>

        <section className="px-5 py-10 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
                  Shared homes looking for a flatmate
                </h2>
                <p className="text-carbon-500 mt-1 text-sm">
                  {filteredHomes.length}{" "}
                  {filteredHomes.length === 1 ? "home" : "homes"} match your
                  filters. Discuss routines, budgets, and house rules before
                  deciding.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {hasFilters ? (
                  <Link
                    href="/flatmates"
                    className="inline-flex h-11 items-center rounded-full border border-black/20 px-5 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                  >
                    Clear filters
                  </Link>
                ) : null}
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white"
                >
                  Post a shared home
                </Link>
              </div>
            </div>

            {visibleHomes.length > 0 ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {visibleHomes.map((home) => (
                  <article
                    key={`${home.location}-${home.title}`}
                    className="flex overflow-hidden rounded-2xl border border-black/10 bg-white"
                  >
                    <div className="flex w-full flex-col">
                      <div className="relative h-52 shrink-0">
                        <Image
                          src={home.image}
                          alt={home.title}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm">
                          <CalendarDays
                            aria-hidden="true"
                            className="size-3.5"
                          />
                          {home.available}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="border-b border-black/10 pb-4">
                          <p className="text-carbon-500 text-[0.68rem] font-medium tracking-[0.12em] uppercase">
                            Your share of the rent
                          </p>
                          <p className="font-bricolage mt-1 text-xl font-medium">
                            <CurrencyAmount
                              usdAmount={Number(
                                home.price.replace(/[^0-9.]/g, ""),
                              )}
                            />{" "}
                            / month
                          </p>
                        </div>

                        <h3 className="font-bricolage mt-4 text-xl leading-6 font-medium">
                          {home.title}
                        </h3>
                        <p className="text-carbon-500 mt-2 flex items-center gap-2 text-sm">
                          <MapPin
                            aria-hidden="true"
                            className="size-4 shrink-0"
                          />
                          {home.location}
                        </p>

                        <div className="text-carbon-600 mt-4 grid grid-cols-4 text-xs">
                          <span className="flex flex-col items-center gap-1 px-2 py-3">
                            <BedDouble aria-hidden="true" className="size-4" />
                            {home.bedrooms} beds
                          </span>
                          <span className="flex flex-col items-center gap-1 px-2 py-3">
                            <Bath aria-hidden="true" className="size-4" />
                            {home.bathrooms} baths
                          </span>
                          <span className="flex flex-col items-center gap-1 px-2 py-3">
                            <Ruler aria-hidden="true" className="size-4" />
                            {home.area} m²
                          </span>
                          <span className="flex flex-col items-center gap-1 px-2 py-3 text-center">
                            <Sofa aria-hidden="true" className="size-4" />
                            {home.amenities.includes("Furnished")
                              ? "Furnished"
                              : "Unfurnished"}
                          </span>
                        </div>

                        <div className="mt-4 border-t border-black/10 pt-4">
                          <p className="text-carbon-500 text-[0.68rem] font-medium tracking-[0.1em] uppercase">
                            Current household
                          </p>
                          <p className="mt-2 flex items-start gap-2 text-sm leading-5 font-medium">
                            <UsersRound
                              aria-hidden="true"
                              className="mt-0.5 size-4 shrink-0"
                            />
                            {home.household}
                          </p>
                        </div>

                        <div className="mt-4 border-t border-black/10 pt-4">
                          <p className="text-carbon-500 text-[0.68rem] font-medium tracking-[0.1em] uppercase">
                            House includes
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {home.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="rounded-full bg-black/[0.055] px-2.5 py-1 text-xs"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/10 pt-4 text-xs">
                          <p className="text-carbon-500 col-span-2 text-[0.68rem] font-medium tracking-[0.1em] uppercase">
                            Likes and dislikes
                          </p>
                          <div>
                            <p className="font-medium text-black">They like</p>
                            <ul className="text-carbon-500 mt-2 space-y-1.5 leading-4">
                              {home.likes.map((like) => (
                                <li key={like}>+ {like}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-black">
                              They don&apos;t like
                            </p>
                            <ul className="text-carbon-500 mt-2 space-y-1.5 leading-4">
                              {home.dislikes.map((dislike) => (
                                <li key={dislike}>– {dislike}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-black/10 pt-4 text-xs">
                          <p className="text-carbon-500 text-[0.68rem] font-medium tracking-[0.1em] uppercase">
                            Preferred flatmate
                          </p>
                          <dl className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <dt className="text-carbon-500">Gender needed</dt>
                              <dd className="mt-1 font-medium text-black">
                                {home.genderPreference === "any"
                                  ? "Any gender"
                                  : home.genderPreference === "female"
                                    ? "Female"
                                    : "Male"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-carbon-500">
                                Occupation needed
                              </dt>
                              <dd className="mt-1 font-medium text-black">
                                {home.occupationPreference === "any"
                                  ? "Any occupation"
                                  : home.occupationPreference ===
                                      "remote-worker"
                                    ? "Remote worker"
                                    : home.occupationPreference
                                        .charAt(0)
                                        .toUpperCase() +
                                      home.occupationPreference.slice(1)}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <Link
                          href="/login"
                          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-black text-sm font-medium text-white transition-opacity hover:opacity-75"
                        >
                          View home & household
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <Image
                  src={emptyIllustration}
                  alt="No shared homes found"
                  className="h-36 w-auto object-contain"
                />
                <h3 className="font-bricolage mt-5 text-2xl font-medium">
                  No shared homes match these filters
                </h3>
                <p className="text-carbon-500 mt-2 text-sm">
                  Try another location, budget, bedroom count, or occupation.
                </p>
              </div>
            )}
            {filteredHomes.length > 4 ? (
              <div className="mt-8 flex justify-center">
                <Link
                  href={
                    showAll
                      ? `/flatmates${filterQuery.size ? `?${filterQuery.toString()}` : ""}`
                      : `/flatmates?${showAllQuery.toString()}`
                  }
                  className="inline-flex h-11 items-center justify-center px-6 text-sm font-medium text-black transition-opacity hover:opacity-60"
                >
                  {showAll ? "Show fewer" : "View all"}
                </Link>
              </div>
            ) : null}
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
        className="catalogue-filter-control h-12 w-full appearance-none rounded-2xl border-0 bg-black/[0.045] pr-11 pl-4 text-sm ring-0 outline-none focus:ring-0 focus:outline-none"
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

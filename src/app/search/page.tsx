import type { StaticImageData } from "next/image";
import Link from "next/link";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

import house1 from "../../../house1.jpg";
import house2 from "../../../house2.jpg";
import house3 from "../../../house3.jpg";
import house4 from "../../../house4.jpg";
import house5 from "../../../house5.jpg";
import house6 from "../../../house6.jpeg";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ListingCard } from "@/components/sections/featured-listings/listing-card";
import { matchListings, parseQuery } from "@/data/hero-search-demo";
import type { PropertyPreview } from "@/types";

const RESULT_IMAGES: Record<string, StaticImageData> = {
  "kacyiru-2br": house1,
  "nyarutarama-2br": house2,
  "remera-3br": house3,
  "wuse-1br": house4,
  "lekki-2br": house5,
  "ikoyi-3br": house6,
  "kibagabaga-modern-family-home": house1,
  "lekki-contemporary-duplex": house2,
  "gisenyi-lakefront-residence": house3,
  "nyarutarama-garden-penthouse": house4,
  "maitama-quiet-city-villa": house5,
  "ikoyi-waterfront-apartment": house6,
  "karongi-hillside-family-house": house2,
  "gisenyi-lake-view-apartment": house3,
};

const CATEGORY_RESULTS: Record<
  string,
  { label: string; propertyIds: string[] }
> = {
  "houses-for-rent": {
    label: "Houses for rent",
    propertyIds: [
      "remera-3br",
      "kibagabaga-modern-family-home",
      "gisenyi-lakefront-residence",
      "maitama-quiet-city-villa",
      "karongi-hillside-family-house",
    ],
  },
  apartments: {
    label: "Apartments",
    propertyIds: [
      "kacyiru-2br",
      "nyarutarama-2br",
      "wuse-1br",
      "lekki-2br",
      "ikoyi-3br",
      "ikoyi-waterfront-apartment",
    ],
  },
  studios: {
    label: "Studio apartments",
    propertyIds: ["wuse-1br", "gisenyi-lake-view-apartment"],
  },
  "shared-apartments": {
    label: "Shared apartments",
    propertyIds: ["kacyiru-2br", "wuse-1br", "gisenyi-lake-view-apartment"],
  },
  "villas-and-mansions": {
    label: "Villas and mansions",
    propertyIds: [
      "maitama-quiet-city-villa",
      "lekki-contemporary-duplex",
      "karongi-hillside-family-house",
    ],
  },
  "houses-for-sale": {
    label: "Houses for sale",
    propertyIds: [
      "kibagabaga-modern-family-home",
      "remera-3br",
      "gisenyi-lakefront-residence",
    ],
  },
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-24">
        <SearchResults searchParams={searchParams} />
      </main>
      <Footer />
    </>
  );
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const queryValue = params.q;
  const query = Array.isArray(queryValue) ? queryValue[0] : (queryValue ?? "");
  const categoryValue = params.category;
  const categoryKey = Array.isArray(categoryValue)
    ? categoryValue[0]
    : categoryValue;
  const category = categoryKey ? CATEGORY_RESULTS[categoryKey] : undefined;
  const filters = query ? parseQuery(query) : [];
  const allResults = matchListings([]);
  const results = query
    ? matchListings(filters)
    : category
      ? allResults.filter((property) =>
          category.propertyIds.includes(property.id),
        )
      : [];
  const resultLabel = query || category?.label || "";

  return (
    <>
      <section
        aria-label="Search filters"
        className="border-border-subtle bg-white px-5 py-6 sm:px-6 lg:px-11 xl:px-[52px]"
      >
        <form
          action="/search"
          className="mx-auto grid max-w-[1562px] gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_0.85fr_auto] xl:items-end"
        >
          <label className="min-w-0">
            <span className="font-bricolage text-carbon-900 mb-2 block text-sm font-medium">
              What are you looking for?
            </span>
            <span className="border-border-default flex h-13 items-center gap-3 rounded-xl border bg-white px-4">
              <Search aria-hidden="true" className="text-carbon-500 size-5" />
              <input
                name="q"
                defaultValue={query}
                placeholder="2 bedrooms in Kigali under 800,000"
                className="text-carbon-900 placeholder:text-carbon-400 min-w-0 flex-1 bg-transparent text-base outline-none"
              />
            </span>
          </label>
          <SearchSelect
            label="Property type"
            name="type"
            options={["Any type", "Apartment", "House", "Villa", "Studio"]}
          />
          <SearchSelect
            label="Price range"
            name="price"
            options={[
              "Any price",
              "Under 500,000",
              "Under 1,000,000",
              "1,000,000+",
            ]}
          />
          <SearchSelect
            label="Bedrooms"
            name="bedrooms"
            options={["Any", "1", "2", "3", "4+"]}
          />
          <button
            type="submit"
            className="font-bricolage bg-carbon-900 h-13 rounded-xl px-6 font-medium text-white transition-colors hover:bg-black"
          >
            Search
          </button>
        </form>
      </section>

      {results.length > 0 ? (
        <ResultsGrid query={resultLabel} results={results} />
      ) : (
        <EmptyResults hasQuery={Boolean(query || category)} />
      )}
    </>
  );
}

function SearchSelect({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label>
      <span className="font-bricolage text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <select
        name={name}
        className="border-border-default text-carbon-900 h-13 w-full rounded-xl border bg-white px-4 text-base"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ResultsGrid({
  query,
  results,
}: {
  query: string;
  results: PropertyPreview[];
}) {
  return (
    <section
      aria-labelledby="search-results-title"
      className="px-5 py-10 sm:px-6 lg:px-11 xl:px-[52px]"
    >
      <div className="mx-auto max-w-[1562px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-carbon-500 text-sm">Results for “{query}”</p>
            <h1
              id="search-results-title"
              className="font-bricolage text-carbon-900 mt-1 text-3xl font-medium tracking-[-0.03em]"
            >
              {results.length} matching{" "}
              {results.length === 1 ? "home" : "homes"}
            </h1>
          </div>
          <label className="flex items-center gap-3">
            <span className="text-carbon-700 text-sm font-medium">Sort</span>
            <select className="border-border-default h-11 rounded-xl border bg-white px-4 text-sm">
              <option>Best match</option>
              <option>Lowest price</option>
              <option>Newest</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((property, index) => {
            const furnished = property.amenities.some((amenity) =>
              amenity.toLowerCase().includes("furnished"),
            );

            return (
              <ListingCard
                key={property.id}
                title={property.title}
                location={property.location}
                price={`${property.currency} ${property.price.toLocaleString()}`}
                period="per month"
                bedrooms={property.bedrooms}
                bathrooms={Math.max(1, property.bedrooms - 1)}
                area={62 + index * 18}
                furnished={furnished}
                saves={[62, 12, 45, 27, 81, 34, 19, 56][index % 8]}
                image={RESULT_IMAGES[property.id] ?? house1}
                href={`/properties/${property.id}`}
                focalPoint="50% 52%"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmptyResults({ hasQuery }: { hasQuery: boolean }) {
  return (
    <section className="px-5 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
        <div className="bg-carbon-900 flex size-24 items-center justify-center rounded-full text-white">
          <MapPin aria-hidden="true" className="size-10" />
        </div>
        <h1 className="font-bricolage text-carbon-900 mt-8 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-medium tracking-[-0.04em]">
          {hasQuery ? "Nothing here… yet." : "Start your home search"}
        </h1>
        <p className="text-carbon-600 mt-4 max-w-[48ch] text-lg">
          {hasQuery
            ? "Nothing matched your criteria. Try adjusting your search or post a property request so the right property partner can reach you."
            : "Describe the home you need above and we’ll show the closest available matches."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/search"
            className="border-carbon-900 font-bricolage text-carbon-900 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 font-medium"
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Clear filters
          </Link>
          <Link
            href="/property-request"
            className="bg-carbon-900 font-bricolage inline-flex h-12 items-center justify-center rounded-full px-6 font-medium text-white"
          >
            Post property request
          </Link>
        </div>
      </div>
    </section>
  );
}

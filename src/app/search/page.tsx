import type { StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronDown, MapPin, Search, SlidersHorizontal } from "lucide-react";

import house1 from "../../../house1.jpg";
import house2 from "../../../house2.jpg";
import house3 from "../../../house3.jpg";
import house4 from "../../../house4.jpg";
import house5 from "../../../house5.jpg";
import house6 from "../../../house6.jpeg";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AutoSubmitFilterForm } from "@/components/listings/auto-submit-filter-form";
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
  "kibagabaga-family-home-sale": house1,
  "remera-garden-house-sale": house3,
  "gisenyi-lake-residence-sale": house2,
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
      "kibagabaga-family-home-sale",
      "remera-garden-house-sale",
      "gisenyi-lake-residence-sale",
    ],
  },
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? "");
}

function propertyType(property: PropertyPreview) {
  const title = property.title.toLowerCase();
  if (title.includes("studio")) return "Studio apartment";
  if (title.includes("apartment")) return "Apartment";
  if (title.includes("villa")) return "Villa";
  if (title.includes("duplex")) return "Duplex";
  return "House";
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-16">
        <SearchResults searchParams={searchParams} />
      </main>
      <Footer />
    </>
  );
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = valueOf(params.q);
  const type = valueOf(params.type);
  const priceRange = valueOf(params.price);
  const bedroomsValue = valueOf(params.bedrooms);
  const bathroomsValue = valueOf(params.bathrooms);
  const sort = valueOf(params.sort);
  const categoryValue = params.category;
  const categoryKey = Array.isArray(categoryValue)
    ? categoryValue[0]
    : categoryValue;
  const category = categoryKey ? CATEGORY_RESULTS[categoryKey] : undefined;
  const filters = query ? parseQuery(query) : [];
  const allResults = matchListings([]);
  const baseResults = query
    ? matchListings(filters)
    : category
      ? allResults.filter((property) =>
          category.propertyIds.includes(property.id),
        )
      : [];
  const bedrooms = Number.parseInt(bedroomsValue, 10) || 0;
  const bathrooms = Number.parseInt(bathroomsValue, 10) || 0;
  const results = baseResults
    .filter((property) => !type || propertyType(property) === type)
    .filter((property) => {
      if (!priceRange) return true;
      const [minimum, maximum] = priceRange
        .split("-")
        .map((value) => Number(value));
      return (
        property.price >= minimum &&
        (!Number.isFinite(maximum) || property.price <= maximum)
      );
    })
    .filter((property) =>
      !bedrooms
        ? true
        : bedroomsValue === "5+"
          ? property.bedrooms >= 5
          : property.bedrooms === bedrooms,
    )
    .filter((property) => {
      const propertyBathrooms = Math.max(1, property.bedrooms - 1);
      return !bathrooms
        ? true
        : bathroomsValue === "5+"
          ? propertyBathrooms >= 5
          : propertyBathrooms === bathrooms;
    })
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return a.id.localeCompare(b.id);
    });
  const resultLabel = query || category?.label || "";

  return (
    <>
      <section
        aria-label="Search filters"
        className="border-border-subtle bg-white px-5 py-6 sm:px-6 lg:px-11 xl:px-[52px]"
      >
        <AutoSubmitFilterForm
          key={`${query}|${categoryKey}|${type}|${priceRange}|${bedroomsValue}|${bathroomsValue}`}
          action="/search"
          className="mx-auto grid max-w-[1562px] items-end gap-4 md:grid-cols-2 xl:grid-cols-[minmax(250px,1.5fr)_repeat(4,minmax(135px,0.7fr))]"
        >
          {categoryKey ? (
            <input type="hidden" name="category" value={categoryKey} />
          ) : null}
          <label className="min-w-0 md:col-span-2 xl:col-span-1">
            <span className="text-carbon-900 mb-2 block text-sm font-medium">
              What are you looking for?
            </span>
            <span className="flex h-12 items-center gap-3 rounded-xl border border-black/15 px-4 transition-colors focus-within:border-black">
              <Search aria-hidden="true" className="text-carbon-500 size-5" />
              <input
                name="q"
                defaultValue={query}
                placeholder="2 bedrooms in Kigali under USD 800"
                className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </span>
          </label>
          <SearchSelect
            label="Property type"
            name="type"
            placeholder="Any Type"
            value={type}
            options={[
              "House",
              "Apartment",
              "Duplex",
              "Studio apartment",
              "Villa",
            ]}
          />
          <SearchSelect
            label="Price range"
            name="price"
            placeholder="Any Price"
            value={priceRange}
            options={["0-500", "501-1000", "1001-2000", "2001-Infinity"]}
            optionLabels={{
              "0-500": "Under USD 500",
              "501-1000": "USD 500 – 1,000",
              "1001-2000": "USD 1,000 – 2,000",
              "2001-Infinity": "Above USD 2,000",
            }}
          />
          <SearchSelect
            label="Bedrooms"
            name="bedrooms"
            placeholder="Any"
            value={bedroomsValue}
            options={["1", "2", "3", "4", "5+"]}
          />
          <SearchSelect
            label="Bathrooms"
            name="bathrooms"
            placeholder="Any"
            value={bathroomsValue}
            options={["1", "2", "3", "4", "5+"]}
          />
        </AutoSubmitFilterForm>
      </section>

      {results.length > 0 ? (
        <ResultsGrid
          query={resultLabel}
          results={results}
          filters={{
            query,
            categoryKey,
            type,
            priceRange,
            bedroomsValue,
            bathroomsValue,
            sort,
          }}
        />
      ) : (
        <EmptyResults hasQuery={Boolean(query || category)} />
      )}
    </>
  );
}

function SearchSelect({
  label,
  name,
  placeholder,
  value,
  options,
  optionLabels = {},
}: {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
}) {
  return (
    <label>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <span className="relative block">
        <select
          name={name}
          defaultValue={value}
          className="catalogue-filter-control text-carbon-900 h-12 w-full appearance-none rounded-xl border border-black/15 bg-white pr-11 pl-4 text-sm transition-colors outline-none focus:border-black"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {optionLabels[option] ?? option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-black/55"
        />
      </span>
    </label>
  );
}

function ResultsGrid({
  query,
  results,
  filters,
}: {
  query: string;
  results: PropertyPreview[];
  filters: {
    query: string;
    categoryKey?: string;
    type: string;
    priceRange: string;
    bedroomsValue: string;
    bathroomsValue: string;
    sort: string;
  };
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
          <AutoSubmitFilterForm
            key={`sort-${filters.sort}`}
            action="/search"
            className="flex items-center gap-2"
          >
            <input type="hidden" name="q" value={filters.query} />
            {filters.categoryKey ? (
              <input
                type="hidden"
                name="category"
                value={filters.categoryKey}
              />
            ) : null}
            <input type="hidden" name="type" value={filters.type} />
            <input type="hidden" name="price" value={filters.priceRange} />
            <input
              type="hidden"
              name="bedrooms"
              value={filters.bedroomsValue}
            />
            <input
              type="hidden"
              name="bathrooms"
              value={filters.bathroomsValue}
            />
            <label htmlFor="search-sort" className="text-sm font-medium">
              Sort:
            </label>
            <span className="relative block">
              <select
                id="search-sort"
                name="sort"
                defaultValue={filters.sort}
                className="catalogue-filter-control h-11 appearance-none rounded-xl border border-black/15 bg-white pr-10 pl-4 text-sm transition-colors outline-none focus:border-black"
              >
                <option value="">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-black/55"
              />
            </span>
          </AutoSubmitFilterForm>
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
                period={
                  property.purpose === "sale" ? "total price" : "per month"
                }
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

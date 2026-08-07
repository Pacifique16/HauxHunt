import type { StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

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
import { DEMO_LISTINGS, type MockListing } from "@/data/hero-search-demo";

const LISTING_IMAGES: Record<string, StaticImageData> = {
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

export type CatalogueSearchParams = Record<
  string,
  string | string[] | undefined
>;

type CataloguePageProps = {
  purpose: "rent" | "sale";
  searchParams: CatalogueSearchParams;
};

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? "");
}

function listingType(listing: MockListing) {
  const text = listing.title.toLowerCase();
  if (text.includes("shared apartment")) return "Shared apartment";
  if (text.includes("studio")) return "Studio apartment";
  if (text.includes("penthouse")) return "Penthouse";
  if (text.includes("single room")) return "Single room";
  if (text.includes("mansion")) return "Mansion";
  if (text.includes("hotel")) return "Hotel";
  if (text.includes("apartment")) return "Apartment";
  if (text.includes("duplex")) return "Duplex";
  if (text.includes("villa")) return "Villa";
  return "House";
}

export function CataloguePage({ purpose, searchParams }: CataloguePageProps) {
  const locationValue = valueOf(searchParams.location);
  const location = locationValue.toLowerCase();
  const type = valueOf(searchParams.type);
  const priceRange = valueOf(searchParams.price);
  const bedroomsValue = valueOf(searchParams.bedrooms);
  const bathroomsValue = valueOf(searchParams.bathrooms);
  const sort = valueOf(searchParams.sort);
  const requestedPage = Number.parseInt(valueOf(searchParams.page), 10) || 1;
  const bedrooms = Number.parseInt(bedroomsValue, 10) || 0;
  const bathrooms = Number.parseInt(bathroomsValue, 10) || 0;
  const pathname = purpose === "rent" ? "/rent" : "/buy";

  const listings = DEMO_LISTINGS.filter(
    (listing) => (listing.purpose ?? "rent") === purpose,
  )
    .filter(
      (listing) =>
        !location ||
        listing.location.toLowerCase().includes(location) ||
        listing.matchLocations.some((item) => item.includes(location)),
    )
    .filter((listing) => !type || listingType(listing) === type)
    .filter((listing) => {
      if (!priceRange) return true;
      const [minimum, maximum] = priceRange
        .split("-")
        .map((value) => Number(value));
      return (
        listing.price >= minimum &&
        (!Number.isFinite(maximum) || listing.price <= maximum)
      );
    })
    .filter(
      (listing) =>
        !bedrooms ||
        (bedroomsValue === "5+"
          ? listing.bedrooms >= 5
          : listing.bedrooms === bedrooms),
    )
    .filter(
      (listing) =>
        !bathrooms ||
        (bathroomsValue === "5+"
          ? Math.max(1, listing.bedrooms - 1) >= 5
          : Math.max(1, listing.bedrooms - 1) === bathrooms),
    )
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return a.id.localeCompare(b.id);
    });

  const hasFilters = Boolean(
    location || type || priceRange || bedrooms || bathrooms,
  );
  const listingsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(listings.length / listingsPerPage));
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const pageStart = (currentPage - 1) * listingsPerPage;
  const visibleListings = listings.slice(
    pageStart,
    pageStart + listingsPerPage,
  );

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (locationValue) params.set("location", locationValue);
    if (type) params.set("type", type);
    if (priceRange) params.set("price", priceRange);
    if (bedroomsValue) params.set("bedrooms", bedroomsValue);
    if (bathroomsValue) params.set("bathrooms", bathroomsValue);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  const priceOptions =
    purpose === "rent"
      ? ["0-500", "501-1000", "1001-2000", "2001-Infinity"]
      : ["0-100000", "100001-150000", "150001-Infinity"];
  const priceLabels: Record<string, string> =
    purpose === "rent"
      ? {
          "0-500": "Under USD 500",
          "501-1000": "USD 500 – 1,000",
          "1001-2000": "USD 1,000 – 2,000",
          "2001-Infinity": "Above USD 2,000",
        }
      : {
          "0-100000": "Under USD 100,000",
          "100001-150000": "USD 100,000 – 150,000",
          "150001-Infinity": "Above USD 150,000",
        };

  const title = purpose === "rent" ? "Houses for rent" : "Houses for sale";
  const description =
    purpose === "rent"
      ? "Explore long-term rentals across Rwanda and Nigeria, with clear details and trusted property representatives."
      : "Discover houses and apartments available to buy across Rwanda and Nigeria.";

  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-16">
        <section className="bg-white px-5 pt-8 pb-12 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <h1 className="font-bricolage text-carbon-900 text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.94] font-medium tracking-[-0.055em]">
              {title}
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-lg leading-7">
              {description}
            </p>
          </div>
        </section>

        <section
          aria-label={`${title} filters`}
          className="border-b border-black/10 bg-white px-5 py-5 sm:px-6 lg:px-11 xl:px-[52px]"
        >
          <AutoSubmitFilterForm
            key={`${locationValue}|${type}|${priceRange}|${bedroomsValue}|${bathroomsValue}`}
            action={pathname}
            className="mx-auto grid max-w-[1562px] items-end gap-4 md:grid-cols-2 xl:grid-cols-[minmax(250px,1.5fr)_repeat(4,minmax(135px,0.7fr))]"
          >
            <label className="md:col-span-2 xl:col-span-1">
              <span className="text-carbon-900 mb-2 block text-sm font-medium">
                Location
              </span>
              <span className="flex h-12 items-center gap-3 rounded-xl border border-black/15 px-4 transition-colors focus-within:border-black">
                <Search aria-hidden="true" className="text-carbon-500 size-5" />
                <input
                  name="location"
                  defaultValue={locationValue}
                  placeholder="Search city, town, or district"
                  className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </span>
            </label>

            <FilterSelect
              label="Property type"
              placeholder="Any Type"
              name="type"
              value={type}
              options={[
                "House",
                "Apartment",
                "Duplex",
                "Single room",
                "Penthouse",
                "Shared apartment",
                "Studio apartment",
                "Mansion",
                "Villa",
                "Hotel",
              ]}
            />
            <FilterSelect
              label="Price range"
              placeholder="Any Price"
              name="price"
              value={priceRange}
              options={priceOptions}
              optionLabels={priceLabels}
            />
            <FilterSelect
              label="Bedrooms"
              placeholder="Any"
              name="bedrooms"
              value={bedroomsValue}
              options={["1", "2", "3", "4", "5+"]}
            />
            <FilterSelect
              label="Bathrooms"
              placeholder="Any"
              name="bathrooms"
              value={bathroomsValue}
              options={["1", "2", "3", "4", "5+"]}
            />
          </AutoSubmitFilterForm>
        </section>

        <section className="px-5 pt-8 pb-14 sm:px-6 lg:px-11 lg:pt-10 lg:pb-20 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-bricolage text-carbon-900 text-2xl font-medium">
                  {listings.length} {listings.length === 1 ? "house" : "houses"}
                </p>
                <p className="text-carbon-500 mt-1 text-sm">
                  {location
                    ? `Showing properties matching “${locationValue}”`
                    : "Available across Rwanda and Nigeria"}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                {hasFilters && listings.length > 0 && (
                  <Link
                    href={pathname}
                    className="rounded-full border border-black/20 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black hover:text-white"
                  >
                    Clear filters
                  </Link>
                )}
                <AutoSubmitFilterForm
                  key={`sort-${sort}`}
                  action={pathname}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="location" value={locationValue} />
                  <input type="hidden" name="type" value={type} />
                  <input type="hidden" name="price" value={priceRange} />
                  <input type="hidden" name="bedrooms" value={bedroomsValue} />
                  <input
                    type="hidden"
                    name="bathrooms"
                    value={bathroomsValue}
                  />
                  <label
                    htmlFor="catalogue-sort"
                    className="text-sm font-medium"
                  >
                    Sort:
                  </label>
                  <span className="relative block">
                    <select
                      id="catalogue-sort"
                      name="sort"
                      defaultValue={sort}
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
            </div>

            {listings.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {visibleListings.map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    title={listing.title}
                    location={listing.location}
                    price={`${listing.currency} ${listing.price.toLocaleString()}`}
                    period={purpose === "rent" ? "per month" : "total price"}
                    bedrooms={listing.bedrooms}
                    bathrooms={Math.max(1, listing.bedrooms - 1)}
                    area={Math.max(60, listing.bedrooms * 52)}
                    furnished={listing.amenities.includes("Furnished")}
                    saves={12 + (((pageStart + index) * 17) % 71)}
                    image={LISTING_IMAGES[listing.id] ?? house1}
                    href={`/properties/${listing.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-black/10 bg-white px-6 py-20 text-center shadow-sm">
                <h2 className="font-bricolage text-carbon-900 text-3xl font-medium">
                  No houses match these filters
                </h2>
                <p className="text-carbon-600 mx-auto mt-3 max-w-md">
                  Try another location or broaden the property details to see
                  more available houses.
                </p>
                <Link
                  href={pathname}
                  className="mt-7 inline-flex h-11 items-center rounded-full bg-black px-6 font-medium text-white"
                >
                  Clear filters
                </Link>
              </div>
            )}

            {listings.length > listingsPerPage && (
              <nav
                aria-label="Listing pages"
                className="mt-12 flex items-center justify-center gap-2"
              >
                <PaginationArrow
                  href={pageHref(currentPage - 1)}
                  label="Previous page"
                  disabled={currentPage === 1}
                  icon={ChevronLeft}
                />
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <Link
                      key={page}
                      href={pageHref(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`flex size-11 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                        page === currentPage
                          ? "border-black bg-black text-white"
                          : "border-black/15 bg-white text-black hover:border-black"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}
                <PaginationArrow
                  href={pageHref(currentPage + 1)}
                  label="Next page"
                  disabled={currentPage === totalPages}
                  icon={ChevronRight}
                />
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

type PaginationArrowProps = {
  href: string;
  label: string;
  disabled: boolean;
  icon: typeof ChevronLeft;
};

function PaginationArrow({
  href,
  label,
  disabled,
  icon: Icon,
}: PaginationArrowProps) {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="flex size-11 items-center justify-center rounded-full border border-black/10 text-black/25"
      >
        <Icon className="size-4" />
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-black/15 bg-white transition-colors hover:border-black hover:bg-black hover:text-white"
    >
      <Icon aria-hidden="true" className="size-4" />
    </Link>
  );
}

type FilterSelectProps = {
  label: string;
  placeholder: string;
  name: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
};

function FilterSelect({
  label,
  placeholder,
  name,
  value,
  options,
  optionLabels = {},
}: FilterSelectProps) {
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

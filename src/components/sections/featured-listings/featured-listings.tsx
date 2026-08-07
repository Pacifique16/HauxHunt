import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import houseOne from "../../../../house1.jpg";
import houseTwo from "../../../../house2.jpg";
import houseThree from "../../../../house3.jpg";
import houseFour from "../../../../house4.jpg";
import houseFive from "../../../../house5.jpg";
import houseSix from "../../../../house6.jpeg";
import cityHome from "../../../../image.png";
import heroHome from "../../../../landing.png";
import { ListingCard } from "./listing-card";

const LISTINGS = [
  {
    title: "Modern family home",
    location: "Kibagabaga, Kigali",
    price: "USD 830",
    period: "per month",
    bedrooms: 3,
    bathrooms: 2,
    area: 168,
    furnished: true,
    saves: 62,
    image: houseOne,
    href: "/properties/kibagabaga-modern-family-home",
    focalPoint: "50% 52%",
  },
  {
    title: "Contemporary duplex",
    location: "Lekki Phase 1, Lagos",
    price: "USD 2,100",
    period: "per month",
    bedrooms: 4,
    bathrooms: 4,
    area: 240,
    furnished: false,
    saves: 12,
    image: houseTwo,
    href: "/properties/lekki-contemporary-duplex",
    focalPoint: "50% 46%",
  },
  {
    title: "Lakefront residence",
    location: "Gisenyi, Rwanda",
    price: "USD 590",
    period: "per month",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    furnished: true,
    saves: 45,
    image: houseThree,
    href: "/properties/gisenyi-lakefront-residence",
    focalPoint: "50% 50%",
  },
  {
    title: "Garden penthouse",
    location: "Nyarutarama, Kigali",
    price: "USD 1,140",
    period: "per month",
    bedrooms: 3,
    bathrooms: 3,
    area: 196,
    furnished: true,
    saves: 27,
    image: houseFour,
    href: "/properties/nyarutarama-garden-penthouse",
    focalPoint: "50% 48%",
  },
  {
    title: "Quiet city villa",
    location: "Maitama, Abuja",
    price: "USD 2,500",
    period: "per month",
    bedrooms: 5,
    bathrooms: 5,
    area: 310,
    furnished: false,
    saves: 81,
    image: houseFive,
    href: "/properties/maitama-quiet-city-villa",
    focalPoint: "50% 58%",
  },
  {
    title: "Waterfront apartment",
    location: "Ikoyi, Lagos",
    price: "USD 1,700",
    period: "per month",
    bedrooms: 3,
    bathrooms: 3,
    area: 184,
    furnished: true,
    saves: 34,
    image: houseSix,
    href: "/properties/ikoyi-waterfront-apartment",
    focalPoint: "50% 55%",
  },
  {
    title: "Hillside family house",
    location: "Karongi, Rwanda",
    price: "USD 500",
    period: "per month",
    bedrooms: 3,
    bathrooms: 2,
    area: 146,
    furnished: false,
    saves: 19,
    image: heroHome,
    href: "/properties/karongi-hillside-family-house",
    focalPoint: "50% 56%",
  },
  {
    title: "Lake-view apartment",
    location: "Gisenyi, Rwanda",
    price: "USD 445",
    period: "per month",
    bedrooms: 2,
    bathrooms: 1,
    area: 98,
    furnished: true,
    saves: 56,
    image: cityHome,
    href: "/properties/gisenyi-lake-view-apartment",
    focalPoint: "50% 58%",
  },
] as const;

export function FeaturedListings() {
  return (
    <section
      aria-labelledby="featured-listings-title"
      className="listings-atmosphere px-5 py-20 sm:px-6 sm:py-24 lg:px-11 xl:px-[52px]"
    >
      <div className="mx-auto max-w-[1562px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="featured-listings-title"
              className="font-bricolage text-carbon-900 text-[clamp(2.25rem,4vw,3.75rem)] leading-none font-normal tracking-[-0.04em]"
            >
              Featured Listings
            </h2>
            <p className="text-body-m text-carbon-600 mt-4 max-w-[52ch]">
              A closer look at homes available across Rwanda and Nigeria.
            </p>
          </div>

          <Link
            href="/rent"
            className="font-bricolage border-carbon-900 text-carbon-900 hover:bg-muted inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border px-5 text-base font-medium transition-colors duration-150 sm:self-auto"
          >
            View all listings
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {LISTINGS.map((listing) => (
            <ListingCard key={listing.href} {...listing} />
          ))}
        </div>

        <div className="listing-request-glass relative mt-12 flex flex-col gap-7 overflow-hidden rounded-2xl p-6 sm:mt-16 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          <svg
            aria-hidden="true"
            viewBox="0 0 1400 280"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.12]"
          >
            <defs>
              <path
                id="request-wave"
                d="M-100 35 C230 -55 410 30 625 155 S1010 310 1500 75"
              />
            </defs>
            <g fill="none" stroke="currentColor" strokeWidth="1">
              {Array.from({ length: 12 }, (_, index) => (
                <use
                  key={`request-wave-${index}`}
                  href="#request-wave"
                  transform={`translate(0 ${index * 13})`}
                />
              ))}
            </g>
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/50"
          />

          <div className="relative z-10">
            <h3 className="font-bricolage text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-normal tracking-[-0.035em] text-white">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-body-m mt-3 max-w-[68ch] text-white/65">
              Post a property request and real estate agents with properties
              that meet your criteria will get in touch with you.
            </p>
          </div>

          <Link
            href="/property-request"
            className="font-bricolage bg-carbon-0 text-carbon-900 hover:bg-carbon-100 relative z-10 inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full px-6 text-base font-medium transition-colors duration-150 lg:self-auto"
          >
            Request property
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

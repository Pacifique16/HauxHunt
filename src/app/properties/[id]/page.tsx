import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  Check,
  Heart,
  House,
  MapPin,
  Ruler,
  Share2,
} from "lucide-react";

import house1 from "../../../../house1.jpg";
import house2 from "../../../../house2.jpg";
import house3 from "../../../../house3.jpg";
import house4 from "../../../../house4.jpg";
import house5 from "../../../../house5.jpg";
import house6 from "../../../../house6.jpeg";
import julienProfile from "../../../../julien.jpg";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ContactLandlordForm } from "@/components/properties/contact-landlord-form";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { DEMO_LISTINGS } from "@/data/hero-search-demo";

const HOUSE_IMAGES = [house1, house2, house3, house4, house5, house6];

const FEATURED_AMENITY_PRIORITY = [
  "Backup power",
  "Solar power",
  "Borehole",
  "Swimming pool",
  "Security",
  "CCTV",
  "Wheelchair access",
  "EV charging",
  "Beach access",
  "Gym",
];

const DETAILS: Record<
  string,
  {
    bathrooms: number;
    area: number;
    furnished: boolean;
    type: string;
    coordinates: { latitude: number; longitude: number };
  }
> = {
  "kacyiru-2br": {
    bathrooms: 2,
    area: 96,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: -1.943, longitude: 30.082 },
  },
  "nyarutarama-2br": {
    bathrooms: 2,
    area: 112,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: -1.934, longitude: 30.101 },
  },
  "remera-3br": {
    bathrooms: 2,
    area: 168,
    furnished: false,
    type: "House",
    coordinates: { latitude: -1.958, longitude: 30.107 },
  },
  "wuse-1br": {
    bathrooms: 1,
    area: 72,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: 9.0765, longitude: 7.465 },
  },
  "lekki-2br": {
    bathrooms: 2,
    area: 118,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: 6.4474, longitude: 3.472 },
  },
  "ikoyi-3br": {
    bathrooms: 3,
    area: 186,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: 6.4541, longitude: 3.424 },
  },
  "kibagabaga-modern-family-home": {
    bathrooms: 2,
    area: 168,
    furnished: true,
    type: "House",
    coordinates: { latitude: -1.953, longitude: 30.127 },
  },
  "lekki-contemporary-duplex": {
    bathrooms: 4,
    area: 240,
    furnished: false,
    type: "Duplex",
    coordinates: { latitude: 6.4474, longitude: 3.472 },
  },
  "gisenyi-lakefront-residence": {
    bathrooms: 2,
    area: 120,
    furnished: true,
    type: "House",
    coordinates: { latitude: -1.7028, longitude: 29.2564 },
  },
  "nyarutarama-garden-penthouse": {
    bathrooms: 3,
    area: 196,
    furnished: true,
    type: "Penthouse",
    coordinates: { latitude: -1.934, longitude: 30.101 },
  },
  "maitama-quiet-city-villa": {
    bathrooms: 5,
    area: 310,
    furnished: false,
    type: "Villa",
    coordinates: { latitude: 9.0895, longitude: 7.4951 },
  },
  "ikoyi-waterfront-apartment": {
    bathrooms: 3,
    area: 184,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: 6.4541, longitude: 3.424 },
  },
  "karongi-hillside-family-house": {
    bathrooms: 2,
    area: 146,
    furnished: false,
    type: "House",
    coordinates: { latitude: -2.0597, longitude: 29.3482 },
  },
  "gisenyi-lake-view-apartment": {
    bathrooms: 1,
    area: 98,
    furnished: true,
    type: "Apartment",
    coordinates: { latitude: -1.7028, longitude: 29.2564 },
  },
  "kibagabaga-family-home-sale": {
    bathrooms: 3,
    area: 224,
    furnished: false,
    type: "House",
    coordinates: { latitude: -1.953, longitude: 30.127 },
  },
  "remera-garden-house-sale": {
    bathrooms: 2,
    area: 182,
    furnished: false,
    type: "House",
    coordinates: { latitude: -1.958, longitude: 30.107 },
  },
  "gisenyi-lake-residence-sale": {
    bathrooms: 3,
    area: 205,
    furnished: false,
    type: "House",
    coordinates: { latitude: -1.7028, longitude: 29.2564 },
  },
};

type PropertyPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return DEMO_LISTINGS.map((listing) => ({ id: listing.id }));
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = DEMO_LISTINGS.find((listing) => listing.id === id);
  if (!property) notFound();

  const detail = DETAILS[id] ?? {
    bathrooms: Math.max(1, property.bedrooms - 1),
    area: Math.max(60, property.bedrooms * 55),
    furnished: property.amenities.includes("Furnished"),
    type: "House",
    coordinates: property.matchLocations.some((location) =>
      ["lagos", "lekki", "ikoyi", "abuja", "wuse", "maitama"].includes(
        location,
      ),
    )
      ? { latitude: 6.5244, longitude: 3.3792 }
      : { latitude: -1.9441, longitude: 30.0619 },
  };
  const startIndex = DEMO_LISTINGS.findIndex((listing) => listing.id === id);
  const gallery = Array.from(
    { length: 4 },
    (_, index) => HOUSE_IMAGES[(startIndex + index) % HOUSE_IMAGES.length],
  );
  const { latitude, longitude } = detail.coordinates;
  const mapDelta = 0.018;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - mapDelta}%2C${latitude - mapDelta}%2C${longitude + mapDelta}%2C${latitude + mapDelta}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const orderedAmenities = [...property.amenities].sort((first, second) => {
    const firstRank = FEATURED_AMENITY_PRIORITY.indexOf(first);
    const secondRank = FEATURED_AMENITY_PRIORITY.indexOf(second);
    return (
      (firstRank === -1 ? Number.MAX_SAFE_INTEGER : firstRank) -
      (secondRank === -1 ? Number.MAX_SAFE_INTEGER : secondRank)
    );
  });
  const highlightedAmenities = orderedAmenities.slice(0, 8);
  const remainingAmenities = orderedAmenities.slice(8);

  return (
    <>
      <Navbar />
      <main className="bg-canvas pt-24">
        <div className="mx-auto max-w-[1562px] px-5 pt-7 pb-20 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/search"
              className="text-carbon-600 hover:text-carbon-900 inline-flex items-center gap-2 rounded-sm text-sm"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to search
            </Link>
            <div className="flex gap-2">
              <ActionButton label="Share property" icon={Share2} />
              <ActionButton label="Save property" icon={Heart} />
            </div>
          </div>

          <section aria-label="Property photos" className="mt-6">
            <PropertyGallery images={gallery} title={property.title} />
          </section>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                      {property.purpose === "sale" ? "For sale" : "For rent"}
                    </span>
                    <span className="text-carbon-600 inline-flex items-center gap-1.5 text-sm">
                      <BadgeCheck aria-hidden="true" className="size-4" />
                      Verified listing
                    </span>
                  </div>
                  <h1 className="font-bricolage text-carbon-900 mt-4 text-[clamp(2.25rem,4.5vw,4rem)] leading-[0.98] font-medium tracking-[-0.045em]">
                    {property.title}
                  </h1>
                  <p className="text-carbon-600 mt-4 flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-5" />
                    {property.location}
                  </p>
                </div>
                <p className="font-bricolage text-carbon-900 shrink-0 text-3xl font-medium">
                  {property.currency} {property.price.toLocaleString()}
                  <span className="text-carbon-500 mt-1 block text-right text-sm font-normal">
                    {property.purpose === "sale" ? "total price" : "per month"}
                  </span>
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-3 border-b border-black/10 py-8 sm:grid-cols-5">
                <Fact
                  icon={BedDouble}
                  label="Bedrooms"
                  value={property.bedrooms}
                />
                <Fact icon={Bath} label="Bathrooms" value={detail.bathrooms} />
                <Fact
                  icon={Ruler}
                  label="Floor area"
                  value={`${detail.area} m²`}
                />
                <Fact icon={House} label="Property type" value={detail.type} />
                <Fact
                  icon={Check}
                  label="Furnishing"
                  value={detail.furnished ? "Furnished" : "Unfurnished"}
                />
              </dl>

              <section aria-labelledby="description-title" className="py-9">
                <h2
                  id="description-title"
                  className="font-bricolage text-carbon-900 text-2xl font-medium"
                >
                  About this home
                </h2>
                <p className="text-carbon-600 mt-4 max-w-[72ch] leading-7">
                  A thoughtfully presented long-term home in {property.location}
                  , offering comfortable living spaces, practical finishes, and
                  a calm residential setting. The property is ready for serious
                  {property.purpose === "sale"
                    ? "buyers looking for a clear, dependable purchase experience."
                    : "renters looking for a clear, dependable move-in experience."}
                </p>
              </section>

              <section
                aria-labelledby="amenities-title"
                className="border-t border-black/10 py-9"
              >
                <h2
                  id="amenities-title"
                  className="font-bricolage text-carbon-900 text-2xl font-medium"
                >
                  What this home offers
                </h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {highlightedAmenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="text-carbon-700 flex items-center gap-3"
                    >
                      <span className="flex size-8 items-center justify-center rounded-full bg-black text-white">
                        <Check aria-hidden="true" className="size-4" />
                      </span>
                      {amenity}
                    </li>
                  ))}
                </ul>
                {remainingAmenities.length > 0 ? (
                  <details className="mt-6 rounded-2xl bg-black/[0.035] px-5 py-4">
                    <summary className="font-bricolage cursor-pointer list-none font-medium marker:hidden">
                      Show all {property.amenities.length} amenities
                    </summary>
                    <ul className="mt-5 grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-2">
                      {remainingAmenities.map((amenity) => (
                        <li
                          key={amenity}
                          className="text-carbon-700 flex items-center gap-3"
                        >
                          <span className="flex size-8 items-center justify-center rounded-full bg-black text-white">
                            <Check aria-hidden="true" className="size-4" />
                          </span>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </section>

              <section className="border-t border-black/10 py-9">
                <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
                  Location
                </h2>
                <div className="mt-5 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
                  <iframe
                    title={`Map showing ${property.location}`}
                    src={mapUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[320px] w-full border-0"
                  />
                  <div className="flex items-center gap-2 px-5 py-4">
                    <MapPin aria-hidden="true" className="size-4" />
                    <p className="font-bricolage text-carbon-900 text-sm font-medium">
                      {property.location}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="border-border-default sticky top-24 rounded-3xl border bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.09)] sm:p-7">
              <div className="flex items-center gap-3">
                <Image
                  src={julienProfile}
                  alt="Julien Mugisha"
                  width={48}
                  height={48}
                  placeholder="blur"
                  className="size-12 rounded-full object-cover shadow-[0_8px_22px_rgba(0,0,0,0.2)] ring-2 ring-white"
                />
                <div>
                  <p className="font-bricolage text-carbon-900 font-medium">
                    Julien Mugisha
                  </p>
                  <p className="text-carbon-500 text-sm">Landlord</p>
                </div>
              </div>

              <p className="text-carbon-600 mt-6 text-sm leading-6">
                Ask a question or arrange a viewing. Your details stay private
                until you choose to share them.
              </p>

              <ContactLandlordForm landlordName="Julien" />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-black/[0.035] p-4">
      <Icon aria-hidden="true" className="text-carbon-900 size-5" />
      <dt className="text-carbon-500 mt-3 text-xs">{label}</dt>
      <dd className="font-bricolage text-carbon-900 mt-1 font-medium">
        {value}
      </dd>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
}: {
  label: string;
  icon: typeof Heart;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="border-border-default text-carbon-900 flex size-10 items-center justify-center rounded-full border bg-white transition-colors hover:bg-black/5"
    >
      <Icon aria-hidden="true" className="size-[18px]" />
    </button>
  );
}

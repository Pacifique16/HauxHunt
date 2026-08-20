"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { StatusPill } from "@/components/owner/status-pill";
import { getOwnerProperties, managementStatusFor } from "@/lib/owner-data";
import noDataIllustration from "@/assets/images/empty.png";

type Filter = "All" | "Occupied" | "Vacant" | "Listed" | "Unlisted";
const FILTERS: Filter[] = ["All", "Occupied", "Vacant", "Listed", "Unlisted"];

export default function MyPropertiesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const properties = getOwnerProperties();

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      const matchesQuery = query.trim()
        ? `${property.title} ${property.location}`.toLowerCase().includes(query.trim().toLowerCase())
        : true;
      if (!matchesQuery) return false;
      if (filter === "All") return true;
      if (filter === "Occupied") return property.occupancy === "Occupied";
      if (filter === "Vacant") return property.occupancy === "Vacant";
      if (filter === "Listed") return property.listingStatus === "Live" || property.listingStatus === "In Review";
      if (filter === "Unlisted") return property.listingStatus === "Not Listed" || property.listingStatus === "Draft" || property.listingStatus === "Paused" || property.listingStatus === "Archived";
      return true;
    });
  }, [properties, query, filter]);

  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="flex flex-col gap-6 border-b border-black/10 pb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">My Properties</h1>
              <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
                Manage the properties you own and the people assigned to them.
              </p>
            </div>
            <Link
              href="/owner-dashboard/properties/new"
              className="font-bricolage inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-black px-6 font-medium text-white transition-colors hover:bg-black/80 sm:self-auto"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add Property
            </Link>
          </header>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="block w-full max-w-sm">
              <span className="sr-only">Search your properties</span>
              <span className="catalogue-location-filter flex items-center gap-2 px-4">
                <Search aria-hidden="true" className="text-carbon-500 size-4 shrink-0" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or location"
                  className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  className={`h-9 rounded-full px-3.5 text-xs font-medium transition-colors ${filter === item ? "bg-black text-white" : "bg-black/4.5 text-black/60 hover:text-black"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <section className="mt-6 flex min-h-[420px] flex-col items-center justify-center bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
              <Image src={noDataIllustration} alt="No properties found" className="h-40 w-auto object-contain" />
              <h3 className="font-bricolage text-carbon-900 mt-5 text-2xl font-medium">
                {properties.length === 0 ? "You haven't added any properties yet" : "No properties match this filter"}
              </h3>
              <p className="text-carbon-500 mt-2 max-w-md text-sm leading-6">
                {properties.length === 0
                  ? "Add your first property to start listing or managing it on HauxHunt."
                  : "Try a different filter or search term."}
              </p>
              {properties.length === 0 ? (
                <Link href="/owner-dashboard/properties/new" className="font-bricolage mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white">
                  <Plus aria-hidden="true" className="size-4" />
                  Add Property
                </Link>
              ) : null}
            </section>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((property) => (
                <Link
                  key={property.id}
                  href={`/owner-dashboard/properties/${property.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-[0_14px_38px_rgba(0,0,0,0.055)] transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.09)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      <StatusPill status={property.occupancy} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bricolage text-carbon-900 text-lg font-medium tracking-[-0.02em]">{property.title}</h3>
                    <p className="text-carbon-500 mt-1.5 flex items-center gap-1.5 text-sm">
                      <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
                      {property.location}
                    </p>
                    <dl className="text-carbon-500 mt-4 grid grid-cols-2 gap-y-2 border-t border-black/8 pt-4 text-xs">
                      <div>
                        <dt className="text-carbon-400">Type</dt>
                        <dd className="text-carbon-900 mt-0.5 font-medium">{property.type}</dd>
                      </div>
                      <div>
                        <dt className="text-carbon-400">Listing</dt>
                        <dd className="text-carbon-900 mt-0.5 font-medium">{property.listingStatus}</dd>
                      </div>
                      <div>
                        <dt className="text-carbon-400">Managed by</dt>
                        <dd className="text-carbon-900 mt-0.5 truncate font-medium">{property.propertyManager?.name ?? "You"}</dd>
                      </div>
                      <div>
                        <dt className="text-carbon-400">Agent</dt>
                        <dd className="text-carbon-900 mt-0.5 truncate font-medium">{property.agent?.name ?? "None"}</dd>
                      </div>
                    </dl>
                    {property.rent ? (
                      <p className="mt-4 border-t border-black/8 pt-4 text-sm font-medium">{property.rent}</p>
                    ) : null}
                    <p className="text-carbon-400 mt-3 text-xs">{managementStatusFor(property)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

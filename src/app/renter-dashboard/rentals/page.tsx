"use client";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { BadgeCheck, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import house1 from "@/assets/images/house1.jpg";
import house2 from "@/assets/images/house2.jpg";
import house3 from "@/assets/images/house3.jpg";
import house4 from "@/assets/images/house4.jpg";
import emptyIllustration from "@/assets/images/empty.png";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { RENTER_RENTALS, type RentalStatus } from "@/data/renter-rentals";
const images: StaticImageData[] = [house1, house2, house3, house4];
type RentalTab = "current" | "past";
type StatusFilter = "all" | RentalStatus;
const STATUS_OPTIONS: StatusFilter[] = [
  "all",
  "Upcoming",
  "Active",
  "Ending Soon",
  "Ended",
];
const tabFor = (status: RentalStatus): RentalTab =>
  status === "Ended" ? "past" : "current";

export default function RentalsPage() {
  const [tab, setTab] = useState<RentalTab>("current");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [propertySearch, setPropertySearch] = useState("");
  const normalizedSearch = propertySearch.trim().toLocaleLowerCase();
  const filtersActive = statusFilter !== "all" || normalizedSearch.length > 0;
  const rentals = RENTER_RENTALS.filter(
    (rental) =>
      (filtersActive || tabFor(rental.status) === tab) &&
      (statusFilter === "all" || rental.status === statusFilter) &&
      (!normalizedSearch ||
        rental.title.toLocaleLowerCase().includes(normalizedSearch)),
  );
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <header className="bg-carbon-50 px-5 pt-9 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <h1 className="dashboard-page-title">My Rentals</h1>
            <p className="text-carbon-500 mt-2 text-sm">
              Manage the homes you&apos;re currently renting and review your
              rental history.
            </p>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div className="flex gap-7">
                {(["current", "past"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setTab(item);
                      setStatusFilter("all");
                      setPropertySearch("");
                    }}
                    className={`relative h-12 text-sm font-medium capitalize ${tab === item ? "text-black" : "text-black/45"}`}
                  >
                    {item}
                    {tab === item ? (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black" />
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="flex w-full gap-3 pb-2 md:w-auto">
                <label className="relative block min-w-0 flex-1 md:w-72 md:flex-none">
                  <span className="sr-only">Search by property name</span>
                  <Search
                    aria-hidden="true"
                    className="text-carbon-500 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                  />
                  <input
                    type="search"
                    value={propertySearch}
                    onChange={(event) => setPropertySearch(event.target.value)}
                    placeholder="Search by property name"
                    className="h-10 w-full rounded-full bg-white pr-4 pl-11 text-sm outline-none"
                  />
                </label>
                <label className="relative block w-44 sm:w-52">
                  <span className="sr-only">Filter by rental status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      const status = event.target.value as StatusFilter;
                      setStatusFilter(status);
                      if (status !== "all") setTab(tabFor(status));
                    }}
                    className="h-11 w-full appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All statuses" : status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="text-carbon-500 pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
                  />
                </label>
              </div>
            </div>
          </div>
        </header>
        <section className="px-5 pt-5 pb-9 sm:px-6 lg:px-11 xl:px-[52px]">
          {rentals.length ? (
            <section className="mx-auto max-w-[1562px] overflow-x-auto bg-white shadow-[0_18px_55px_rgba(0,0,0,0.055)]">
              <table className="w-full min-w-[980px] text-left">
                <thead className="border-b border-black/8 text-xs text-black">
                  <tr>
                    {[
                      "Property",
                      "Status",
                      "Monthly rent",
                      "Next payment",
                      "Rental period",
                      "Managed by",
                      "",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-4 font-bold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/8">
                  {rentals.map((r) => (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-black/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={images[r.image]}
                            alt={r.title}
                            className="size-14 shrink-0 object-cover"
                          />
                          <div>
                            <p className="font-medium">{r.title}</p>
                            <p className="text-carbon-500 mt-1 text-xs">
                              {r.location} · {r.beds} bed · {r.baths} bath
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-black">
                          {r.status === "Active"
                            ? "Active Rental"
                            : r.status === "Upcoming"
                              ? "Upcoming Rental"
                              : r.status === "Ended"
                                ? "Rental Ended"
                                : r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        {r.rent}
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        {r.nextPayment}
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap">
                        <p>{r.start}</p>
                        <p className="text-carbon-500 mt-1 text-xs">
                          to {r.end}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                          <BadgeCheck className="size-4" />
                          {r.manager}
                        </p>
                        <p className="text-carbon-500 mt-1 text-xs">{r.role}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/renter-dashboard/rentals/${r.id}`}
                          className="inline-flex h-10 items-center gap-1 rounded-full bg-black px-4 text-sm whitespace-nowrap text-white"
                        >
                          View More Info
                          <ChevronRight className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : filtersActive ? (
            <div className="mx-auto flex min-h-[430px] max-w-[1562px] flex-col items-center justify-center bg-white px-6 text-center">
              <Image
                src={emptyIllustration}
                alt=""
                className="h-40 w-auto object-contain"
              />
              <h2 className="font-bricolage mt-5 text-2xl font-medium">
                No matching rentals
              </h2>
              <p className="text-carbon-500 mt-2 text-sm">
                Try another property name or rental status.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPropertySearch("");
                  setStatusFilter("all");
                }}
                className="mt-6 rounded-full border border-black/15 px-5 py-3 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <RentalEmptyState past={tab === "past"} />
          )}
        </section>
      </main>
    </>
  );
}

function RentalEmptyState({ past }: { past: boolean }) {
  return (
    <div className="mx-auto flex min-h-[430px] max-w-[1562px] flex-col items-center justify-center bg-white px-6 text-center">
      <Image
        src={emptyIllustration}
        alt=""
        className="h-40 w-auto object-contain"
      />
      <h2 className="font-bricolage mt-5 text-2xl font-medium">
        {past ? "No Past Rentals" : "No Rentals Yet"}
      </h2>
      <p className="text-carbon-500 mt-2 max-w-lg text-sm leading-6">
        {past
          ? "Your previous HauxHunt rentals will appear here once a rental ends."
          : "Once you're invited to complete a rental agreement or manage rent through HauxHunt, your home will appear here."}
      </p>
      {!past ? (
        <div className="mt-6 flex gap-3">
          <Link
            href="/renter-dashboard/properties"
            className="h-10 rounded-full bg-black px-5 py-2.5 text-sm text-white"
          >
            Find a Home
          </Link>
          <Link
            href="/renter-dashboard/applications"
            className="h-10 rounded-full border border-black/15 px-5 py-2.5 text-sm"
          >
            View Applications
          </Link>
        </div>
      ) : null}
    </div>
  );
}

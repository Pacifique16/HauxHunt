"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronDown,
  Download,
  Eye,
  Heart,
  MessageSquare,
  MousePointerClick,
} from "lucide-react";

import houseOne from "@/assets/images/house1.jpg";
import houseTwo from "@/assets/images/house2.jpg";
import houseThree from "@/assets/images/house3.jpg";
import houseFour from "@/assets/images/house4.jpg";
import houseFive from "@/assets/images/house5.jpg";
import houseSix from "@/assets/images/house6.jpeg";

const METRICS = [
  {
    label: "Listing views",
    value: "4,286",
    change: "+12.4%",
    direction: "up",
    note: "vs previous 30 days",
    icon: Eye,
  },
  {
    label: "Unique viewers",
    value: "3,124",
    change: "+8.7%",
    direction: "up",
    note: "72.9% of all views",
    icon: MousePointerClick,
  },
  {
    label: "Saves",
    value: "386",
    change: "+5.2%",
    direction: "up",
    note: "9.0% save rate",
    icon: Heart,
  },
  {
    label: "Enquiries",
    value: "96",
    change: "-2.1%",
    direction: "down",
    note: "2.2% enquiry rate",
    icon: MessageSquare,
  },
] as const;

const PERIOD_METRICS: Record<
  string,
  Array<{
    value: string;
    change: string;
    direction: "up" | "down";
    note: string;
  }>
> = {
  "Last 7 days": [
    {
      value: "1,046",
      change: "+6.8%",
      direction: "up",
      note: "vs previous 7 days",
    },
    {
      value: "812",
      change: "+5.4%",
      direction: "up",
      note: "77.6% of all views",
    },
    { value: "93", change: "+3.1%", direction: "up", note: "8.9% save rate" },
    {
      value: "24",
      change: "+4.3%",
      direction: "up",
      note: "2.3% enquiry rate",
    },
  ],
  "Last 30 days": METRICS.map(({ value, change, direction, note }) => ({
    value,
    change,
    direction,
    note,
  })),
  "Last 90 days": [
    {
      value: "12,774",
      change: "+15.8%",
      direction: "up",
      note: "vs previous 90 days",
    },
    {
      value: "9,245",
      change: "+11.6%",
      direction: "up",
      note: "72.4% of all views",
    },
    {
      value: "1,106",
      change: "+9.7%",
      direction: "up",
      note: "8.7% save rate",
    },
    {
      value: "284",
      change: "-1.4%",
      direction: "down",
      note: "2.2% enquiry rate",
    },
  ],
  "This year": [
    {
      value: "48,920",
      change: "+22.1%",
      direction: "up",
      note: "vs previous year",
    },
    {
      value: "35,681",
      change: "+18.3%",
      direction: "up",
      note: "72.9% of all views",
    },
    {
      value: "4,318",
      change: "+14.6%",
      direction: "up",
      note: "8.8% save rate",
    },
    {
      value: "1,124",
      change: "+7.2%",
      direction: "up",
      note: "2.3% enquiry rate",
    },
  ],
};

const DEMAND_SIGNALS_BY_PERIOD: Record<
  string,
  {
    location: string;
    propertyType: string;
    budget: string;
    summary: string;
  }
> = {
  "Last 7 days": {
    location: "Kimihurura",
    propertyType: "Studio apartment",
    budget: "USD 500–750",
    summary: "Compact furnished homes drew the strongest recent interest.",
  },
  "Last 30 days": {
    location: "Kibagabaga",
    propertyType: "3-bedroom house",
    budget: "USD 700–1,000",
    summary: "Family homes with parking led renter searches this month.",
  },
  "Last 90 days": {
    location: "Nyarutarama",
    propertyType: "Furnished apartment",
    budget: "USD 800–1,200",
    summary: "Move-in-ready apartments remained the clearest demand signal.",
  },
  "This year": {
    location: "Gacuriro",
    propertyType: "3-bedroom house",
    budget: "USD 750–1,300",
    summary: "Secure family homes with outdoor space led annual demand.",
  },
};

const INSIGHTS_BY_PERIOD: Record<
  string,
  {
    health: number;
    healthDescription: string;
    rentedHomes: string;
    rentalDescription: string;
    liveListings: string;
    availableListings: string;
  }
> = {
  "Last 7 days": {
    health: 83,
    healthDescription:
      "Ten of twelve listings are complete and current. Two need availability updates.",
    rentedHomes: "2 homes rented",
    rentalDescription:
      "Two live listings secured tenants during the last 7 days.",
    liveListings: "12",
    availableListings: "10",
  },
  "Last 30 days": {
    health: 75,
    healthDescription:
      "Nine of twelve listings are complete and current. Three need attention.",
    rentedHomes: "5 homes rented",
    rentalDescription:
      "Five of your live listings secured tenants during the last 30 days.",
    liveListings: "12",
    availableListings: "7",
  },
  "Last 90 days": {
    health: 67,
    healthDescription:
      "Eight of twelve listings stayed complete and current throughout this period.",
    rentedHomes: "9 homes rented",
    rentalDescription:
      "Nine live listings secured tenants during the last 90 days.",
    liveListings: "21",
    availableListings: "12",
  },
  "This year": {
    health: 58,
    healthDescription:
      "Seven of twelve listings remained complete and current across the year.",
    rentedHomes: "18 homes rented",
    rentalDescription:
      "Eighteen live listings secured tenants during the current year.",
    liveListings: "37",
    availableListings: "19",
  },
};

type PerformanceListing = {
  title: string;
  location: string;
  image: StaticImageData;
  views: string;
  saves: string;
  enquiries: string;
  conversion: string;
};

const PERFORMANCE_PREVIEW_TITLES: Record<string, string> = {
  "Garden studio apartment": "Compact studio apartment",
  "Renovated family townhouse": "Quiet suburban townhouse",
  "Compact city loft": "Bright two-bedroom apartment",
  "Quiet hillside apartment": "Waterfront apartment",
  "Lakeside family villa": "Lake-view residence",
  "Luxury hillside penthouse": "City-view penthouse",
  "Two-bedroom city apartment": "Bright two-bedroom apartment",
  "Contemporary family duplex": "Garden duplex",
  "Quiet residential bungalow": "Courtyard family house",
  "Furnished executive studio": "Serviced one-bedroom suite",
  "Hillside apartment with view": "City-view penthouse",
  "Spacious four-bedroom villa": "Spacious four-bedroom home",
  "Compact one-bedroom home": "Serviced one-bedroom suite",
};

const LISTINGS_BY_PERIOD: Record<string, PerformanceListing[]> = {
  "Last 7 days": [
    {
      title: "Garden studio apartment",
      location: "Kimihurura, Kigali",
      image: houseFive,
      views: "312",
      saves: "31",
      enquiries: "9",
      conversion: "2.9%",
    },
    {
      title: "Renovated family townhouse",
      location: "Kacyiru, Kigali",
      image: houseThree,
      views: "274",
      saves: "25",
      enquiries: "7",
      conversion: "2.6%",
    },
    {
      title: "Modern 3-bedroom house",
      location: "Kibagabaga, Kigali",
      image: houseOne,
      views: "238",
      saves: "21",
      enquiries: "5",
      conversion: "2.1%",
    },
    {
      title: "Compact city loft",
      location: "Kiyovu, Kigali",
      image: houseTwo,
      views: "126",
      saves: "10",
      enquiries: "2",
      conversion: "1.6%",
    },
    {
      title: "Quiet hillside apartment",
      location: "Rebero, Kigali",
      image: houseFour,
      views: "96",
      saves: "6",
      enquiries: "1",
      conversion: "1.0%",
    },
  ],
  "Last 30 days": [
    {
      title: "Modern 3-bedroom house",
      location: "Kibagabaga, Kigali",
      image: houseOne,
      views: "1,248",
      saves: "118",
      enquiries: "31",
      conversion: "2.5%",
    },
    {
      title: "Furnished city apartment",
      location: "Nyarutarama, Kigali",
      image: houseTwo,
      views: "986",
      saves: "94",
      enquiries: "27",
      conversion: "2.7%",
    },
    {
      title: "Family home with garden",
      location: "Kacyiru, Kigali",
      image: houseThree,
      views: "742",
      saves: "67",
      enquiries: "18",
      conversion: "2.4%",
    },
    {
      title: "Garden studio apartment",
      location: "Kimihurura, Kigali",
      image: houseFive,
      views: "536",
      saves: "42",
      enquiries: "11",
      conversion: "2.1%",
    },
    {
      title: "Lakeside family villa",
      location: "Gacuriro, Kigali",
      image: houseSix,
      views: "418",
      saves: "31",
      enquiries: "9",
      conversion: "2.2%",
    },
  ],
  "Last 90 days": [
    {
      title: "Luxury hillside penthouse",
      location: "Rebero, Kigali",
      image: houseFour,
      views: "3,158",
      saves: "286",
      enquiries: "72",
      conversion: "2.3%",
    },
    {
      title: "Modern 3-bedroom house",
      location: "Kibagabaga, Kigali",
      image: houseOne,
      views: "2,854",
      saves: "249",
      enquiries: "65",
      conversion: "2.3%",
    },
    {
      title: "Lakeside family villa",
      location: "Gacuriro, Kigali",
      image: houseSix,
      views: "2,310",
      saves: "204",
      enquiries: "52",
      conversion: "2.3%",
    },
    {
      title: "Furnished city apartment",
      location: "Nyarutarama, Kigali",
      image: houseTwo,
      views: "1,842",
      saves: "151",
      enquiries: "41",
      conversion: "2.2%",
    },
    {
      title: "Garden studio apartment",
      location: "Kimihurura, Kigali",
      image: houseFive,
      views: "1,426",
      saves: "116",
      enquiries: "30",
      conversion: "2.1%",
    },
  ],
  "This year": [
    {
      title: "Lakeside family villa",
      location: "Gacuriro, Kigali",
      image: houseSix,
      views: "12,460",
      saves: "1,120",
      enquiries: "302",
      conversion: "2.4%",
    },
    {
      title: "Luxury hillside penthouse",
      location: "Rebero, Kigali",
      image: houseFour,
      views: "10,582",
      saves: "908",
      enquiries: "246",
      conversion: "2.3%",
    },
    {
      title: "Furnished city apartment",
      location: "Nyarutarama, Kigali",
      image: houseTwo,
      views: "8,890",
      saves: "762",
      enquiries: "198",
      conversion: "2.2%",
    },
    {
      title: "Renovated family townhouse",
      location: "Kacyiru, Kigali",
      image: houseThree,
      views: "6,742",
      saves: "561",
      enquiries: "154",
      conversion: "2.3%",
    },
    {
      title: "Garden studio apartment",
      location: "Kimihurura, Kigali",
      image: houseFive,
      views: "4,936",
      saves: "412",
      enquiries: "108",
      conversion: "2.2%",
    },
  ],
};

const ADDITIONAL_LISTING_DETAILS = [
  ["Two-bedroom city apartment", "Kicukiro, Kigali", houseTwo],
  ["Contemporary family duplex", "Gisozi, Kigali", houseThree],
  ["Quiet residential bungalow", "Kanombe, Kigali", houseOne],
  ["Furnished executive studio", "Kacyiru, Kigali", houseFive],
  ["Hillside apartment with view", "Rebero, Kigali", houseFour],
  ["Spacious four-bedroom villa", "Gacuriro, Kigali", houseSix],
  ["Compact one-bedroom home", "Remera, Kigali", houseFive],
] as const;

const ADDITIONAL_PERFORMANCE: Record<string, number[][]> = {
  "Last 7 days": [
    [84, 6, 1],
    [72, 5, 1],
    [61, 4, 1],
    [52, 4, 0],
    [44, 3, 0],
    [36, 2, 0],
    [29, 1, 0],
  ],
  "Last 30 days": [
    [382, 29, 8],
    [344, 26, 7],
    [306, 23, 6],
    [268, 19, 5],
    [229, 16, 4],
    [194, 12, 3],
    [158, 9, 2],
  ],
  "Last 90 days": [
    [1_284, 102, 27],
    [1_136, 89, 24],
    [982, 75, 20],
    [836, 63, 17],
    [714, 51, 14],
    [602, 42, 11],
    [488, 31, 8],
  ],
  "This year": [
    [4_382, 358, 94],
    [3_916, 316, 82],
    [3_448, 274, 71],
    [2_986, 229, 60],
    [2_514, 188, 49],
    [2_068, 149, 38],
    [1_642, 112, 29],
  ],
};

const ADDITIONAL_LISTINGS_BY_PERIOD = Object.fromEntries(
  Object.entries(ADDITIONAL_PERFORMANCE).map(([period, performance]) => [
    period,
    ADDITIONAL_LISTING_DETAILS.map(
      ([title, location, image], index): PerformanceListing => {
        const [views, saves, enquiries] = performance[index];
        return {
          title,
          location,
          image,
          views: views.toLocaleString("en-US"),
          saves: saves.toLocaleString("en-US"),
          enquiries: enquiries.toLocaleString("en-US"),
          conversion: `${((enquiries / views) * 100).toFixed(1)}%`,
        };
      },
    ),
  ]),
) as Record<string, PerformanceListing[]>;

export function PerformanceDashboard() {
  const [range, setRange] = useState("Last 30 days");
  const [metric, setMetric] = useState("Views");
  const [showAllListings, setShowAllListings] = useState(false);
  const [listingSortMetric, setListingSortMetric] = useState("Views");
  const [listingSortOrder, setListingSortOrder] = useState("High to low");
  const [listingPage, setListingPage] = useState(1);
  const visibleMetrics = METRICS.map((item, index) => ({
    ...item,
    ...PERIOD_METRICS[range][index],
  }));
  const visibleListings = LISTINGS_BY_PERIOD[range];
  const listingSortKey = listingSortMetric.toLowerCase() as
    "views" | "saves" | "enquiries";
  const displayedListings = showAllListings
    ? [...visibleListings, ...ADDITIONAL_LISTINGS_BY_PERIOD[range]].sort(
        (first, second) => {
          const firstValue = Number(first[listingSortKey].replaceAll(",", ""));
          const secondValue = Number(
            second[listingSortKey].replaceAll(",", ""),
          );
          return listingSortOrder === "High to low"
            ? secondValue - firstValue
            : firstValue - secondValue;
        },
      )
    : visibleListings;
  const listingsPerPage = 20;
  const totalListingPages = Math.max(
    1,
    Math.ceil(displayedListings.length / listingsPerPage),
  );
  const currentListingPage = Math.min(listingPage, totalListingPages);
  const paginatedListings = displayedListings.slice(
    (currentListingPage - 1) * listingsPerPage,
    currentListingPage * listingsPerPage,
  );
  const firstListingNumber =
    displayedListings.length === 0
      ? 0
      : (currentListingPage - 1) * listingsPerPage + 1;
  const lastListingNumber = Math.min(
    currentListingPage * listingsPerPage,
    displayedListings.length,
  );
  const visibleInsights = INSIGHTS_BY_PERIOD[range];
  const demandSignals = DEMAND_SIGNALS_BY_PERIOD[range];

  if (showAllListings) {
    return (
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <button
            type="button"
            onClick={() => setShowAllListings(false)}
            className="mb-7 inline-flex items-center gap-1 text-sm font-medium text-black/55 transition-colors hover:text-black"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Back
          </button>
          <header className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">
                All listing performance
              </h1>
              <p className="text-carbon-600 mt-4 text-base">
                Compare performance across every listing in your portfolio.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SelectControl
                value={range}
                onChange={(value) => {
                  setRange(value);
                  setListingPage(1);
                }}
                options={[
                  "Last 7 days",
                  "Last 30 days",
                  "Last 90 days",
                  "This year",
                ]}
              />
              <SelectControl
                value={listingSortMetric}
                onChange={(value) => {
                  setListingSortMetric(value);
                  setListingPage(1);
                }}
                options={["Views", "Enquiries", "Saves"]}
              />
              <SelectControl
                value={listingSortOrder}
                onChange={(value) => {
                  setListingSortOrder(value);
                  setListingPage(1);
                }}
                options={["High to low", "Low to high"]}
              />
            </div>
          </header>

          <section className="mt-8 w-full overflow-hidden bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
            <div className="flex flex-wrap items-end justify-between gap-3 px-6 pt-6 pb-5 sm:px-7 sm:pt-7">
              <div>
                <h2 className="font-bricolage text-2xl font-medium tracking-[-0.035em]">
                  Your portfolio
                </h2>
                <p className="text-carbon-500 mt-1 text-sm">
                  Sorted by {listingSortMetric.toLowerCase()},{" "}
                  {listingSortOrder.toLowerCase()} during {range.toLowerCase()}
                </p>
              </div>
              <p className="text-sm font-medium">
                {displayedListings.length} listings
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="border-y border-black/8 bg-black/[0.025] text-xs text-black/45">
                  <tr>
                    <th className="px-7 py-3 font-medium">Listing</th>
                    <th className="px-4 py-3 font-medium">Views</th>
                    <th className="px-4 py-3 font-medium">Saves</th>
                    <th className="px-4 py-3 font-medium">Enquiries</th>
                    <th className="px-7 py-3 text-right font-medium">
                      Conversion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedListings.map((listing) => (
                    <ListingRow key={listing.title} {...listing} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-4 border-t border-black/8 px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-black/45">
                <span>20 per page</span>
                <span>
                  Showing {firstListingNumber}–{lastListingNumber} of{" "}
                  {displayedListings.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setListingPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentListingPage === 1}
                  className="h-9 px-3 font-medium transition-colors hover:bg-black/[0.05] disabled:cursor-not-allowed disabled:text-black/25 disabled:hover:bg-transparent"
                >
                  Previous
                </button>
                {Array.from({ length: totalListingPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setListingPage(page)}
                      aria-current={
                        page === currentListingPage ? "page" : undefined
                      }
                      className={`flex size-9 items-center justify-center font-medium transition-colors ${page === currentListingPage ? "bg-black text-white" : "hover:bg-black/[0.05]"}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    setListingPage((page) =>
                      Math.min(totalListingPages, page + 1),
                    )
                  }
                  disabled={currentListingPage === totalListingPages}
                  className="h-9 px-3 font-medium transition-colors hover:bg-black/[0.05] disabled:cursor-not-allowed disabled:text-black/25 disabled:hover:bg-transparent"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
      <div className="mx-auto max-w-[1360px]">
        <header className="flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="dashboard-page-title text-carbon-900">
              Listing performance
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              See how property seekers discover, save, and respond to your
              listings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SelectControl
              value={range}
              onChange={setRange}
              options={[
                "Last 7 days",
                "Last 30 days",
                "Last 90 days",
                "This year",
              ]}
            />
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-medium transition-colors hover:border-black/25"
            >
              <Download aria-hidden="true" className="size-4" />
              Export report
            </button>
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visibleMetrics.map((item) => (
            <MetricCard key={item.label} {...item} />
          ))}
        </div>

        <div className="mt-6 grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.75fr)]">
          <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-bricolage text-2xl font-medium tracking-[-0.035em]">
                  Performance trend
                </h2>
                <p className="text-carbon-500 mt-1 text-sm">
                  Daily activity across all live listings
                </p>
              </div>
              <div className="flex rounded-full bg-black/[0.04] p-1">
                {["Views", "Saves", "Enquiries"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMetric(item)}
                    className={`h-9 rounded-full px-4 text-xs font-medium transition-colors ${metric === item ? "bg-black text-white" : "text-black/45 hover:text-black"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <TrendChart metric={metric} range={range} />
          </section>

          <section className="flex flex-col rounded-[1.75rem] bg-black p-6 text-white shadow-[0_16px_45px_rgba(0,0,0,0.1)] sm:p-7">
            <p className="text-xs font-medium tracking-[0.13em] text-white/45 uppercase">
              Renter demand
            </p>
            <h2 className="font-bricolage mt-3 text-2xl font-medium tracking-[-0.035em]">
              What renters are looking for
            </h2>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              <DemandSignal
                label="Top location"
                value={demandSignals.location}
              />
              <DemandSignal
                label="Preferred home"
                value={demandSignals.propertyType}
              />
              <DemandSignal
                label="Typical budget"
                value={demandSignals.budget}
              />
            </div>
            <div className="mt-auto border-t border-white/10 pt-6">
              <p className="text-sm leading-6 text-white/65">
                {demandSignals.summary}
              </p>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
          <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
            <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-6 pb-5 sm:px-7 sm:pt-7">
              <div>
                <h2 className="font-bricolage text-2xl font-medium tracking-[-0.035em]">
                  Top-performing listings
                </h2>
                <p className="text-carbon-500 mt-1 text-sm">
                  Ranked by enquiries during {range.toLowerCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllListings(true)}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                View all listings
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="border-y border-black/8 bg-black/[0.025] text-xs text-black/45">
                  <tr>
                    <th className="px-7 py-3 font-medium">Listing</th>
                    <th className="px-4 py-3 font-medium">Views</th>
                    <th className="px-4 py-3 font-medium">Saves</th>
                    <th className="px-4 py-3 font-medium">Enquiries</th>
                    <th className="px-7 py-3 text-right font-medium">
                      Conversion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedListings.map((listing) => (
                    <ListingRow key={listing.title} {...listing} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <InsightCard
              title="Listing health"
              value={`${visibleInsights.health}%`}
              description={visibleInsights.healthDescription}
              progress={visibleInsights.health}
            />
            <section className="rounded-[1.75rem] bg-white p-6 shadow-[0_16px_45px_rgba(0,0,0,0.055)]">
              <p className="text-xs font-medium tracking-[0.12em] text-black/40 uppercase">
                Rental outcomes
              </p>
              <h3 className="font-bricolage mt-4 text-2xl font-medium tracking-[-0.035em]">
                {visibleInsights.rentedHomes}
              </h3>
              <p className="text-carbon-500 mt-2 text-sm leading-6">
                {visibleInsights.rentalDescription}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-black/8 pt-5">
                <div>
                  <p className="font-bricolage text-xl font-medium">
                    {visibleInsights.liveListings}
                  </p>
                  <p className="text-carbon-500 mt-1 text-xs">Live listings</p>
                </div>
                <div>
                  <p className="font-bricolage text-xl font-medium">
                    {visibleInsights.availableListings}
                  </p>
                  <p className="text-carbon-500 mt-1 text-xs">
                    Still available
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  change,
  direction,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  direction: "up" | "down";
  note: string;
  icon: (typeof METRICS)[number]["icon"];
}) {
  const DirectionIcon = direction === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_14px_40px_rgba(0,0,0,0.045)] sm:p-6">
      <div className="flex items-start justify-between">
        <Icon aria-hidden="true" className="size-5 text-black/45" />
        <span className="flex items-center gap-1 text-xs font-medium">
          <DirectionIcon className="size-3.5" />
          {change}
        </span>
      </div>
      <p className="font-bricolage mt-8 text-4xl font-medium tracking-[-0.05em]">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="text-carbon-500 mt-1 text-xs">{note}</p>
    </article>
  );
}

function SelectControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="relative">
      <span className="sr-only">Reporting period</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-5 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
      >
        <>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </>
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
      />
    </label>
  );
}

function TrendChart({ metric, range }: { metric: string; range: string }) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const periodTotals: Record<string, Record<string, string>> = {
    "Last 7 days": { Views: "1,046", Saves: "93", Enquiries: "24" },
    "Last 30 days": { Views: "4,286", Saves: "386", Enquiries: "96" },
    "Last 90 days": { Views: "12,774", Saves: "1,106", Enquiries: "284" },
    "This year": { Views: "48,920", Saves: "4,318", Enquiries: "1,124" },
  };
  const today = new Date();
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const formatFullDate = (date: Date) =>
    `${date.toLocaleDateString("en-GB", { weekday: "long" })} ${date.getDate()}, ${date.toLocaleDateString("en-GB", { month: "short" })} ${date.getFullYear()}`;
  const dayDates = (span: number) =>
    Array.from({ length: 12 }, (_, index) => {
      const date = new Date(today);
      const daysBeforeToday = Math.round(span - (index * span) / 11);
      date.setDate(today.getDate() - daysBeforeToday);
      return date;
    });
  const periodAxis: Record<string, { interval: string; dates: Date[] }> = {
    "Last 7 days": { interval: "Daily", dates: dayDates(11) },
    "Last 30 days": { interval: "Daily", dates: dayDates(29) },
    "Last 90 days": { interval: "Weekly", dates: dayDates(89) },
    "This year": {
      interval: "Monthly",
      dates: Array.from(
        { length: 12 },
        (_, index) =>
          new Date(today.getFullYear(), today.getMonth() - (11 - index), 1),
      ),
    },
  };
  const axis = periodAxis[range];
  const axisLabels = axis.dates.map((date) =>
    range === "This year"
      ? date.toLocaleDateString("en-GB", { month: "short" })
      : formatDate(date),
  );
  const weights = {
    Views: [6, 7, 6, 8, 7, 9, 8, 10, 8, 9, 10, 12],
    Saves: [5, 6, 7, 6, 8, 7, 9, 8, 10, 9, 11, 12],
    Enquiries: [4, 5, 4, 7, 6, 5, 8, 7, 9, 8, 10, 11],
  } as const;
  const distributeTotal = (
    formattedTotal: string,
    distribution: readonly number[],
  ) => {
    const total = Number(formattedTotal.replaceAll(",", ""));
    const weightTotal = distribution.reduce((sum, value) => sum + value, 0);
    const values = distribution.map((value) =>
      Math.round((total * value) / weightTotal),
    );
    values[values.length - 1] +=
      total - values.reduce((sum, value) => sum + value, 0);
    return values;
  };
  const series = {
    Views: distributeTotal(periodTotals[range].Views, weights.Views),
    Saves: distributeTotal(periodTotals[range].Saves, weights.Saves),
    Enquiries: distributeTotal(
      periodTotals[range].Enquiries,
      weights.Enquiries,
    ),
  };
  const activeSeries = series[metric as keyof typeof series];
  const largestDailyValue = Math.max(
    ...series.Views,
    ...series.Saves,
    ...series.Enquiries,
  );
  const magnitude = 10 ** Math.floor(Math.log10(largestDailyValue));
  const chartMaximum = Math.ceil(largestDailyValue / magnitude) * magnitude;
  const points = activeSeries.map((value, index) => ({
    x: (index / (activeSeries.length - 1)) * 800,
    y: 212 - (value / Math.max(chartMaximum, 1)) * 174,
  }));
  const yAxisValues = Array.from({ length: 5 }, (_, index) =>
    Math.round(chartMaximum - (chartMaximum * index) / 4),
  );
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M${point.x} ${point.y}`;
    const previous = points[index - 1];
    const beforePrevious = points[Math.max(0, index - 2)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const controlOneX = previous.x + (point.x - beforePrevious.x) / 6;
    const controlOneY = previous.y + (point.y - beforePrevious.y) / 6;
    const controlTwoX = point.x - (next.x - previous.x) / 6;
    const controlTwoY = point.y - (next.y - previous.y) / 6;
    return `${path} C${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${point.x} ${point.y}`;
  }, "");
  const hoveredValues =
    hoveredPoint === null
      ? null
      : {
          date: formatFullDate(axis.dates[hoveredPoint]),
          views: series.Views[hoveredPoint],
          saves: series.Saves[hoveredPoint],
          enquiries: series.Enquiries[hoveredPoint],
        };
  const hoveredRatio = hoveredPoint === null ? 0 : hoveredPoint / 11;
  const hoveredLeft = `calc(${hoveredRatio * 100}% + ${(1 - hoveredRatio) * 3}rem)`;

  return (
    <div className="mt-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="font-bricolage text-3xl font-medium">
            {periodTotals[range][metric]}
          </p>
          <p className="text-carbon-500 mt-1 text-xs">
            Total {metric.toLowerCase()} in selected period
          </p>
        </div>
        <span className="text-xs font-medium">{axis.interval}</span>
      </div>
      <div
        className="relative h-64 overflow-hidden"
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const plotWidth = Math.max(bounds.width - 48, 1);
          const position = event.clientX - bounds.left - 48;
          if (position < 0) {
            setHoveredPoint(null);
            return;
          }
          setHoveredPoint(
            Math.round((Math.min(position, plotWidth) / plotWidth) * 11),
          );
        }}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <div className="absolute inset-y-0 left-0 z-10 flex w-10 flex-col justify-between bg-white/75 py-0 text-right text-[0.62rem] text-black/35 backdrop-blur-[1px]">
          {yAxisValues.map((value, index) => (
            <span key={`${value}-${index}`}>
              {value.toLocaleString("en-US")}
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 right-0 left-12 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="block border-t border-black/[0.055]" />
          ))}
        </div>
        <svg
          key={`${metric}-${range}`}
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
          className="relative z-10 ml-12 h-full w-[calc(100%-3rem)] overflow-visible"
        >
          <defs>
            <linearGradient id="performanceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="black" stopOpacity="0.14" />
              <stop offset="100%" stopColor="black" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${linePath} L800 240 L0 240 Z`}
            fill="url(#performanceArea)"
          />
          <path
            d={linePath}
            fill="none"
            stroke="black"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {hoveredPoint !== null && hoveredValues ? (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-20 w-px bg-black/15"
              style={{ left: hoveredLeft }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-30 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-black shadow-md"
              style={{
                left: hoveredLeft,
                top: `${(points[hoveredPoint].y / 240) * 100}%`,
              }}
            />
            <div
              className={`pointer-events-none absolute top-3 z-40 w-56 border border-black/10 bg-white p-4 text-black shadow-[0_16px_40px_rgba(0,0,0,0.16)] ${hoveredPoint < 3 ? "translate-x-0" : hoveredPoint > 8 ? "-translate-x-full" : "-translate-x-1/2"}`}
              style={{ left: hoveredLeft }}
            >
              <p className="text-xs font-medium text-black/45">
                {hoveredValues.date}
              </p>
              <div className="mt-3 space-y-2 text-xs">
                <TooltipRow label="Views" value={hoveredValues.views} />
                <TooltipRow label="Saves" value={hoveredValues.saves} />
                <TooltipRow label="Enquiries" value={hoveredValues.enquiries} />
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-12 pl-12 text-[0.58rem] text-black/35 sm:text-[0.65rem]">
        {axisLabels.map((label, index) => (
          <span
            key={`${label}-${index}`}
            className={`${index === 0 ? "text-left" : index === axisLabels.length - 1 ? "text-right" : "text-center"}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function TooltipRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-black/50">{label}</span>
      <span className="font-medium">{value.toLocaleString("en-US")}</span>
    </div>
  );
}

function DemandSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="max-w-[58%] text-right font-medium">{value}</span>
    </div>
  );
}

function ListingRow({
  title,
  location,
  image,
  views,
  saves,
  enquiries,
  conversion,
}: {
  title: string;
  location: string;
  image: StaticImageData;
  views: string;
  saves: string;
  enquiries: string;
  conversion: string;
}) {
  const router = useRouter();
  const previewTitle = PERFORMANCE_PREVIEW_TITLES[title] ?? title;
  const previewHref = `/partner-dashboard/listings?mode=view&listing=${encodeURIComponent(previewTitle)}`;
  const openPreview = () => router.push(previewHref);

  return (
    <tr
      role="link"
      tabIndex={0}
      aria-label={`View ${title}`}
      onClick={openPreview}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPreview();
        }
      }}
      className="cursor-pointer border-b border-black/8 transition-colors last:border-0 hover:bg-black/[0.025] focus-visible:bg-black/[0.04] focus-visible:outline-none"
    >
      <td className="px-7 py-4">
        <div className="flex items-center gap-3">
          <Image src={image} alt="" className="size-12 object-cover" />
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-carbon-500 mt-1 text-xs">{location}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 font-medium">{views}</td>
      <td className="px-4 py-4">{saves}</td>
      <td className="px-4 py-4">{enquiries}</td>
      <td className="px-7 py-4 text-right font-medium">{conversion}</td>
    </tr>
  );
}

function InsightCard({
  title,
  value,
  description,
  progress,
}: {
  title: string;
  value: string;
  description: string;
  progress: number;
}) {
  return (
    <section className="rounded-[1.75rem] bg-[linear-gradient(145deg,#050505_0%,#242424_100%)] p-6 text-white">
      <p className="text-xs font-medium tracking-[0.12em] text-white/45 uppercase">
        {title}
      </p>
      <p className="font-bricolage mt-6 text-5xl font-medium tracking-[-0.055em]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>
    </section>
  );
}

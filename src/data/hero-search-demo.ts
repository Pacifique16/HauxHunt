import type { CurrencyCode, ParsedFilter, PropertyPreview } from "@/types";

/**
 * Simulated search demo for the hero's natural-language search workspace
 * (UIUX Brief Flow 3B). Everything here runs client-side against a small
 * local dataset — no network call, no backend, no "AI" branding. It exists
 * to demonstrate the *behavior* (query → understood filters → real-feeling
 * results) the launch feature actually promises, per the 2026-08-05 decision.
 */

export const SUGGESTED_QUERIES = [
  "Quiet 2-bedroom in Kigali under RWF 900,000",
  "Furnished 1-bedroom in Abuja, move-in now",
  "3-bedroom near Lekki with parking and a garden",
];

type MockListing = {
  id: string;
  title: string;
  location: string;
  matchLocations: string[];
  currency: CurrencyCode;
  price: number;
  bedrooms: number;
  amenities: string[];
  verified: boolean;
};

const LISTINGS: MockListing[] = [
  {
    id: "kacyiru-2br",
    title: "Garden-level 2-bedroom apartment",
    location: "Kacyiru, Kigali",
    matchLocations: ["kigali", "kacyiru"],
    currency: "RWF",
    price: 850_000,
    bedrooms: 2,
    amenities: ["Quiet street", "Furnished", "Parking", "Backup generator"],
    verified: true,
  },
  {
    id: "nyarutarama-2br",
    title: "Modern 2-bedroom with compound pool access",
    location: "Nyarutarama, Kigali",
    matchLocations: ["kigali", "nyarutarama"],
    currency: "RWF",
    price: 950_000,
    bedrooms: 2,
    amenities: ["Pool access", "Gym", "Secure compound"],
    verified: true,
  },
  {
    id: "remera-3br",
    title: "3-bedroom family home with garden",
    location: "Remera, Kigali",
    matchLocations: ["kigali", "remera"],
    currency: "RWF",
    price: 780_000,
    bedrooms: 3,
    amenities: ["Quiet compound", "Garden", "Parking"],
    verified: true,
  },
  {
    id: "wuse-1br",
    title: "Furnished 1-bedroom close to the city centre",
    location: "Wuse II, Abuja",
    matchLocations: ["abuja", "wuse"],
    currency: "NGN",
    price: 950_000,
    bedrooms: 1,
    amenities: ["Furnished", "24/7 power", "Secure compound"],
    verified: true,
  },
  {
    id: "lekki-2br",
    title: "2-bedroom apartment with private parking",
    location: "Lekki Phase 1, Lagos",
    matchLocations: ["lagos", "lekki"],
    currency: "NGN",
    price: 1_800_000,
    bedrooms: 2,
    amenities: ["Parking", "Furnished", "Gym"],
    verified: true,
  },
  {
    id: "ikoyi-3br",
    title: "Quiet waterfront 3-bedroom apartment",
    location: "Ikoyi, Lagos",
    matchLocations: ["lagos", "ikoyi"],
    currency: "NGN",
    price: 3_200_000,
    bedrooms: 3,
    amenities: ["Quiet waterfront", "Garden", "24/7 power", "Parking"],
    verified: false,
  },
];

const KNOWN_LOCATIONS = [
  "kigali",
  "kacyiru",
  "nyarutarama",
  "remera",
  "lagos",
  "lekki",
  "ikoyi",
  "abuja",
  "wuse",
];

const AMENITY_KEYWORDS: Record<string, string> = {
  quiet: "Quiet area",
  furnished: "Furnished",
  pet: "Pet-friendly",
  pets: "Pet-friendly",
  parking: "Parking",
  pool: "Pool access",
  gym: "Gym",
  garden: "Garden",
  secure: "Secure compound",
  security: "Secure compound",
  generator: "Backup power",
  power: "Backup power",
  wifi: "Wi-Fi",
  internet: "Wi-Fi",
  balcony: "Balcony",
};

const STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "in",
  "near",
  "close",
  "to",
  "with",
  "and",
  "for",
  "of",
  "apartment",
  "apartments",
  "flat",
  "home",
  "house",
  "find",
  "me",
  "under",
  "below",
  "max",
  "maximum",
  "less",
  "than",
  "bed",
  "beds",
  "bedroom",
  "bedrooms",
  "rwf",
  "frw",
  "ngn",
  "now",
  "move-in",
  "available",
]);

let filterIdCounter = 0;
function nextId(kind: string) {
  filterIdCounter += 1;
  return `${kind}-${filterIdCounter}`;
}

/**
 * Turns free-text into structured, editable filters — "what we understood,"
 * not a chat reply (Flow 3B). Deliberately a small heuristic parser, not a
 * remote/AI call: no network dependency, instant, and honest about what it
 * is (see 2026-08-05 decision: demonstrate intelligence through behavior).
 */
export function parseQuery(rawQuery: string): ParsedFilter[] {
  const query = rawQuery.trim();
  const lower = query.toLowerCase();
  const filters: ParsedFilter[] = [];
  const consumed: string[] = [];

  const bedroomMatch = lower.match(/(\d+)\s*[-\s]?\s*bed(?:room)?s?/);
  if (bedroomMatch) {
    filters.push({
      id: nextId("bedrooms"),
      kind: "bedrooms",
      label: `${bedroomMatch[1]} bedroom${bedroomMatch[1] === "1" ? "" : "s"}`,
    });
    consumed.push(bedroomMatch[0]);
  }

  const priceMatch = lower.match(
    /(?:under|below|less than|max(?:imum)?)\s*(?:rwf|frw|ngn|₦)?\s*([\d,]+)/,
  );
  if (priceMatch) {
    const amount = priceMatch[1];
    const currency: CurrencyCode = /ngn|₦/.test(priceMatch[0]) ? "NGN" : "RWF";
    filters.push({
      id: nextId("maxPrice"),
      kind: "maxPrice",
      label: `Max ${currency} ${amount}`,
    });
    consumed.push(priceMatch[0]);
  }

  const foundLocation = KNOWN_LOCATIONS.find((loc) => lower.includes(loc));
  if (foundLocation) {
    filters.push({
      id: nextId("location"),
      kind: "location",
      label: foundLocation[0].toUpperCase() + foundLocation.slice(1),
    });
    consumed.push(foundLocation);
  }

  const foundAmenities = new Set<string>();
  for (const [keyword, label] of Object.entries(AMENITY_KEYWORDS)) {
    if (lower.includes(keyword)) {
      foundAmenities.add(label);
      consumed.push(keyword);
    }
  }
  for (const label of foundAmenities) {
    filters.push({ id: nextId("amenity"), kind: "amenity", label });
  }

  const availabilityLabel = /next month|flexible|later/.test(lower)
    ? "Move-in: flexible"
    : "Available now";
  filters.push({
    id: nextId("availability"),
    kind: "availability",
    label: availabilityLabel,
  });

  // Anything left over, once known tokens are stripped, gets flagged rather
  // than silently dropped (Flow 3B: "clearly flags what it couldn't [parse]").
  let remainder = lower;
  for (const token of consumed) {
    remainder = remainder.replaceAll(token, " ");
  }
  const leftoverWords = remainder
    .replace(/[.,!?]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

  if (leftoverWords.length > 0) {
    filters.push({
      id: nextId("unclear"),
      kind: "custom",
      label: `Unclear: "${leftoverWords.join(" ")}"`,
      unclear: true,
    });
  }

  return filters;
}

const WEIGHTS = { location: 2, bedrooms: 2, maxPrice: 2, amenity: 1 };

/**
 * Scores the local demo dataset against the current (editable) filter set
 * and returns the top 1–2 previews, each with a real, criteria-specific
 * explanation — "evidence, not a marketing claim" (Creative Direction).
 */
export function matchListings(filters: ParsedFilter[]): PropertyPreview[] {
  const location = filters.find((f) => f.kind === "location" && !f.unclear);
  const bedrooms = filters.find((f) => f.kind === "bedrooms" && !f.unclear);
  const maxPrice = filters.find((f) => f.kind === "maxPrice" && !f.unclear);
  const amenities = filters.filter((f) => f.kind === "amenity" && !f.unclear);

  const bedroomCount = bedrooms
    ? Number(bedrooms.label.match(/\d+/)?.[0])
    : undefined;
  const maxPriceAmount = maxPrice
    ? Number(maxPrice.label.replace(/[^\d]/g, ""))
    : undefined;
  const maxPriceCurrency = maxPrice?.label.match(/RWF|NGN/)?.[0] as
    CurrencyCode | undefined;

  const totalPossible =
    (location ? WEIGHTS.location : 0) +
    (bedrooms ? WEIGHTS.bedrooms : 0) +
    (maxPrice ? WEIGHTS.maxPrice : 0) +
    amenities.length * WEIGHTS.amenity;

  const scored = LISTINGS.map((listing) => {
    const matchedReasons: string[] = [];
    let weight = 0;

    if (location) {
      const hit = listing.matchLocations.includes(location.label.toLowerCase());
      if (hit) {
        weight += WEIGHTS.location;
        matchedReasons.push(`in ${location.label}`);
      }
    }
    if (bedroomCount && listing.bedrooms === bedroomCount) {
      weight += WEIGHTS.bedrooms;
      matchedReasons.push(`${bedroomCount}-bedroom`);
    }
    if (
      maxPriceAmount &&
      maxPriceCurrency &&
      listing.currency === maxPriceCurrency &&
      listing.price <= maxPriceAmount
    ) {
      weight += WEIGHTS.maxPrice;
      matchedReasons.push(
        `${listing.currency} ${listing.price.toLocaleString()} is within your ${listing.currency} ${maxPriceAmount.toLocaleString()} budget`,
      );
    }
    for (const amenity of amenities) {
      if (
        listing.amenities.some((a) =>
          a.toLowerCase().includes(amenity.label.toLowerCase().split(" ")[0]),
        )
      ) {
        weight += WEIGHTS.amenity;
        matchedReasons.push(amenity.label.toLowerCase());
      }
    }

    const matchPercentage =
      totalPossible > 0 ? Math.round((weight / totalPossible) * 100) : 72; // no concrete criteria parsed yet — a plain, un-hyped default

    const whyItMatches =
      matchedReasons.length > 0
        ? `Matches ${matchedReasons.join(", ")}.`
        : "A verified, well-reviewed listing in your launch market.";

    return { listing, weight, matchPercentage, whyItMatches };
  });

  // Location is a hard constraint, not a weighted signal. Scoring it like any
  // other criterion let a well-matched home in the wrong city outrank a
  // correct-city one — which reads as broken to anyone who searched a place by
  // name, however honest the accompanying explanation is. Falls back to the
  // full set if nothing matches, so the workspace never dead-ends.
  const inLocation = location
    ? scored.filter(({ listing }) =>
        listing.matchLocations.includes(location.label.toLowerCase()),
      )
    : scored;
  const pool = inLocation.length > 0 ? inLocation : scored;

  pool.sort(
    (a, b) => b.weight - a.weight || b.matchPercentage - a.matchPercentage,
  );
  const top = pool.slice(0, 2);

  return top.map(({ listing, matchPercentage, whyItMatches }) => ({
    id: listing.id,
    title: listing.title,
    location: listing.location,
    currency: listing.currency,
    price: listing.price,
    bedrooms: listing.bedrooms,
    amenities: listing.amenities,
    verified: listing.verified,
    matchPercentage: Math.max(matchPercentage, 40),
    whyItMatches,
  }));
}

import type { FlatmateProfile } from "@/types";

/**
 * FlatMat demo data — people interested in the same regular property
 * listings (`DEMO_LISTINGS` ids in ./hero-search-demo.ts), following the
 * same "small local dataset, no network call" approach used for search.
 *
 * No real profile photos exist in this repo for people other than the
 * hardcoded "Julien Mugisha" identity already used for the logged-in
 * renter elsewhere in the app, so unlocked avatars fall back to initials
 * (`Avatar`'s `fallback` prop) rather than reusing Julien's photo for a
 * different person.
 */
export const FLATMATE_PROFILES: FlatmateProfile[] = [
  {
    id: "alex-m",
    listingId: "kacyiru-2br",
    anonymizedName: "Alex M.",
    realName: "Alex Morgan",
    age: 26,
    isVerified: true,
    bio: "Product designer who works from home most days and keeps a calm, tidy apartment.",
    interests: ["Music", "Running", "Coffee"],
    signals: [
      "Budget matches",
      "Moving in September",
      "Non-smoker",
      "Prefers a quiet home",
    ],
  },
  {
    id: "jordan-k",
    listingId: "kacyiru-2br",
    anonymizedName: "Jordan K.",
    realName: "Jordan Kaze",
    age: 29,
    isVerified: false,
    bio: "Software engineer, early riser, usually out of the house by 8am.",
    interests: ["Cycling", "Cooking", "Podcasts"],
    signals: [
      "Similar move-in timeframe",
      "Non-smoker",
      "Tidy shared spaces",
      "Quiet on weekdays",
    ],
  },
  {
    id: "sam-m",
    listingId: "kacyiru-2br",
    anonymizedName: "Sam M.",
    realName: "Sam Mutoni",
    age: 24,
    isVerified: true,
    bio: "Grad student, home most evenings, loves hosting a low-key dinner once a week.",
    interests: ["Reading", "Cooking", "Football"],
    signals: [
      "Budget matches",
      "Moving in September",
      "Pet-friendly",
      "Social on weekends",
    ],
  },
  {
    id: "taylor-r",
    listingId: "nyarutarama-2br",
    anonymizedName: "Taylor R.",
    realName: "Taylor Rugamba",
    age: 31,
    isVerified: true,
    bio: "Works night shifts a few days a week, otherwise keeps a relaxed schedule.",
    interests: ["Gaming", "Coffee", "Hiking"],
    signals: [
      "Budget matches",
      "Non-smoker",
      "Flexible schedule",
      "Prefers a quiet home",
    ],
  },
  {
    id: "morgan-b",
    listingId: "nyarutarama-2br",
    anonymizedName: "Morgan B.",
    realName: "Morgan Bizimana",
    age: 27,
    isVerified: false,
    bio: "Marketing associate, social on weekends, tidy common areas matter a lot.",
    interests: ["Yoga", "Music", "Brunch"],
    signals: [
      "Similar move-in timeframe",
      "Non-smoker",
      "Very tidy",
      "Social on weekends",
    ],
  },
  {
    id: "casey-n",
    listingId: "remera-3br",
    anonymizedName: "Casey N.",
    realName: "Casey Niyonzima",
    age: 25,
    isVerified: true,
    bio: "Remote worker, quiet during the day, likes a well-organized kitchen.",
    interests: ["Photography", "Coffee", "Running"],
    signals: [
      "Budget matches",
      "Moving in October",
      "Non-smoker",
      "Prefers a quiet home",
    ],
  },
  {
    id: "riley-h",
    listingId: "lekki-2br",
    anonymizedName: "Riley H.",
    realName: "Riley Hassan",
    age: 28,
    isVerified: true,
    bio: "Works in finance, travels often, wants a low-maintenance shared setup.",
    interests: ["Travel", "Football", "Coffee"],
    signals: [
      "Budget matches",
      "Moving in September",
      "Non-smoker",
      "Flexible schedule",
    ],
  },
];

export function getFlatmateProfilesForListing(listingId: string): FlatmateProfile[] {
  return FLATMATE_PROFILES.filter((profile) => profile.listingId === listingId);
}

export function getFlatmateProfileById(id: string): FlatmateProfile | undefined {
  return FLATMATE_PROFILES.find((profile) => profile.id === id);
}

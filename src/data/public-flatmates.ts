import type { StaticImageData } from "next/image";

import alinePortrait from "@/assets/images/flatmate-aline.png";
import gracePortrait from "@/assets/images/flatmate-grace.png";
import patrickPortrait from "@/assets/images/flatmate-patrick.png";
import julienPortrait from "@/assets/images/julien.jpg";

export type HousingSituation = "looking" | "has-place";

export type PublicFlatmate = {
  id: string;
  firstName: string;
  age: number;
  occupation: string;
  city: string;
  country: string;
  situation: HousingSituation;
  portrait: StaticImageData;
  budgetMin: number;
  budgetMax: number;
  moveIn: string;
  moveInValue: string;
  areas: string[];
  lifestyleTags: string[];
  gender: "female" | "male";
  smoking: "non-smoker" | "outdoor-only";
  lifestyle: "quiet" | "balanced" | "social";
  about: string;
  preferredProperty: string;
  furnishing: string;
  stay: string;
  lifestyleDetails: Array<[string, string]>;
  lookingFor: string[];
  livingArrangement?: {
    area: string;
    flatmatesWanted: number;
    contribution: number;
    availableFrom: string;
    room: string;
    sharedSpaces: string[];
    householdSize: number;
    furnishing: string;
    householdStyle: string[];
  };
};

export const PUBLIC_FLATMATES: PublicFlatmate[] = [
  {
    id: "aline",
    firstName: "Aline",
    age: 24,
    occupation: "Product Designer",
    city: "Kigali",
    country: "Rwanda",
    situation: "looking",
    portrait: alinePortrait,
    budgetMin: 350000,
    budgetMax: 450000,
    moveIn: "September 2026",
    moveInValue: "2026-09",
    areas: ["Kacyiru", "Kimihurura", "Remera"],
    lifestyleTags: ["Non-smoker", "Very tidy", "Quiet weekdays"],
    gender: "female",
    smoking: "non-smoker",
    lifestyle: "quiet",
    about:
      "I'm a young professional working in Kigali and looking for a clean, peaceful home to share with another working professional.",
    preferredProperty: "Apartment",
    furnishing: "Furnished preferred",
    stay: "12+ months",
    lifestyleDetails: [
      ["Cleanliness", "Very tidy"],
      ["Smoking", "Non-smoker"],
      ["Pets", "Okay with cats"],
      ["Social style", "Quiet weekdays, social weekends"],
      ["Sleep schedule", "Early sleeper"],
      ["Work / study", "Office-based professional"],
      ["Guests", "Occasional visitors"],
    ],
    lookingFor: [
      "Respectful of shared spaces",
      "Similar monthly budget",
      "Non-smoker",
      "Good communication",
      "Long-term housing arrangement",
    ],
  },
  {
    id: "patrick",
    firstName: "Patrick",
    age: 27,
    occupation: "Software Engineer",
    city: "Kigali",
    country: "Rwanda",
    situation: "has-place",
    portrait: patrickPortrait,
    budgetMin: 300000,
    budgetMax: 300000,
    moveIn: "September 2026",
    moveInValue: "2026-09",
    areas: ["Kibagabaga"],
    lifestyleTags: ["Quiet", "Tidy", "No indoor smoking"],
    gender: "male",
    smoking: "outdoor-only",
    lifestyle: "quiet",
    about:
      "I work in technology and value a calm home, clear communication, and keeping shared spaces comfortable for everyone.",
    preferredProperty: "Private bedroom",
    furnishing: "Furnished",
    stay: "12+ months",
    lifestyleDetails: [
      ["Cleanliness", "Clean shared spaces"],
      ["Smoking", "No indoor smoking"],
      ["Pets", "No pets currently"],
      ["Social style", "Quiet home"],
      ["Sleep schedule", "Regular weekday routine"],
      ["Work / study", "Hybrid professional"],
      ["Guests", "Occasional visitors"],
    ],
    lookingFor: [
      "Reliable contribution to shared costs",
      "Respectful of quiet hours",
      "Tidy in shared spaces",
      "Open communication",
    ],
    livingArrangement: {
      area: "Kibagabaga, Kigali",
      flatmatesWanted: 1,
      contribution: 300000,
      availableFrom: "September 2026",
      room: "Private bedroom",
      sharedSpaces: ["Kitchen", "Living room"],
      householdSize: 1,
      furnishing: "Furnished",
      householdStyle: ["Quiet", "Clean shared spaces", "No indoor smoking"],
    },
  },
  {
    id: "grace",
    firstName: "Grace",
    age: 28,
    occupation: "Communications Consultant",
    city: "Nairobi",
    country: "Kenya",
    situation: "looking",
    portrait: gracePortrait,
    budgetMin: 420000,
    budgetMax: 560000,
    moveIn: "October 2026",
    moveInValue: "2026-10",
    areas: ["Kilimani", "Kileleshwa", "Lavington"],
    lifestyleTags: ["Non-smoker", "Balanced", "Clean"],
    gender: "female",
    smoking: "non-smoker",
    lifestyle: "balanced",
    about:
      "I'm a communications consultant looking for a considerate flatmate and a comfortable long-term home near central Nairobi.",
    preferredProperty: "Apartment",
    furnishing: "Either",
    stay: "12+ months",
    lifestyleDetails: [
      ["Cleanliness", "Clean and organised"],
      ["Smoking", "Non-smoker"],
      ["Pets", "Okay with small pets"],
      ["Social style", "Balanced"],
      ["Sleep schedule", "Flexible"],
      ["Work / study", "Hybrid professional"],
      ["Guests", "Friends occasionally"],
    ],
    lookingFor: [
      "Similar move-in timing",
      "Clean shared spaces",
      "Direct communication",
      "Long-term home search",
    ],
  },
  {
    id: "eric",
    firstName: "Eric",
    age: 30,
    occupation: "Financial Analyst",
    city: "Kigali",
    country: "Rwanda",
    situation: "has-place",
    portrait: julienPortrait,
    budgetMin: 260000,
    budgetMax: 260000,
    moveIn: "Available now",
    moveInValue: "2026-08",
    areas: ["Remera"],
    lifestyleTags: ["Early riser", "Tidy", "Non-smoker"],
    gender: "male",
    smoking: "non-smoker",
    lifestyle: "quiet",
    about:
      "I'm an early-rising professional with a simple routine, looking for one considerate person to share an established home.",
    preferredProperty: "Private bedroom",
    furnishing: "Furnished",
    stay: "6–12 months",
    lifestyleDetails: [
      ["Cleanliness", "Tidy"],
      ["Smoking", "Non-smoker"],
      ["Pets", "No pets"],
      ["Social style", "Quiet weekdays"],
      ["Sleep schedule", "Early riser"],
      ["Work / study", "Office-based professional"],
      ["Guests", "Occasional"],
    ],
    lookingFor: [
      "Steady weekday routine",
      "Respectful of shared spaces",
      "Non-smoker",
      "Six months or longer",
    ],
    livingArrangement: {
      area: "Remera, Kigali",
      flatmatesWanted: 1,
      contribution: 260000,
      availableFrom: "Available now",
      room: "Private bedroom",
      sharedSpaces: ["Kitchen", "Living room", "Balcony"],
      householdSize: 1,
      furnishing: "Furnished",
      householdStyle: ["Early routine", "Tidy", "Non-smoker"],
    },
  },
  {
    id: "nadia",
    firstName: "Nadia",
    age: 26,
    occupation: "Architect",
    city: "Abuja",
    country: "Nigeria",
    situation: "looking",
    portrait: alinePortrait,
    budgetMin: 380000,
    budgetMax: 500000,
    moveIn: "November 2026",
    moveInValue: "2026-11",
    areas: ["Wuse II", "Maitama"],
    lifestyleTags: ["Creative", "Tidy", "Social weekends"],
    gender: "female",
    smoking: "non-smoker",
    lifestyle: "social",
    about:
      "I'm an architect relocating within Abuja and hoping to find a thoughtful flatmate before choosing a home together.",
    preferredProperty: "Apartment or duplex",
    furnishing: "Furnished preferred",
    stay: "12+ months",
    lifestyleDetails: [
      ["Cleanliness", "Tidy"],
      ["Smoking", "Non-smoker"],
      ["Pets", "Okay with dogs"],
      ["Social style", "Social weekends"],
      ["Sleep schedule", "Flexible"],
      ["Work / study", "Studio-based professional"],
      ["Guests", "Occasional visitors"],
    ],
    lookingFor: [
      "Similar budget",
      "Creative professional",
      "Tidy",
      "Good communication",
    ],
  },
  {
    id: "david",
    firstName: "David",
    age: 29,
    occupation: "Operations Manager",
    city: "Nairobi",
    country: "Kenya",
    situation: "has-place",
    portrait: patrickPortrait,
    budgetMin: 360000,
    budgetMax: 360000,
    moveIn: "October 2026",
    moveInValue: "2026-10",
    areas: ["Westlands"],
    lifestyleTags: ["Balanced", "Clean", "Outdoor smoking only"],
    gender: "male",
    smoking: "outdoor-only",
    lifestyle: "balanced",
    about:
      "I manage operations for a local company and am looking for one calm, responsible person to join my current living arrangement.",
    preferredProperty: "Private bedroom",
    furnishing: "Furnished",
    stay: "6–12 months",
    lifestyleDetails: [
      ["Cleanliness", "Clean"],
      ["Smoking", "Outdoor only"],
      ["Pets", "No pets currently"],
      ["Social style", "Balanced"],
      ["Sleep schedule", "Regular"],
      ["Work / study", "Office-based professional"],
      ["Guests", "Occasional"],
    ],
    lookingFor: [
      "Responsible",
      "Clean",
      "Good communication",
      "Longer stay preferred",
    ],
    livingArrangement: {
      area: "Westlands, Nairobi",
      flatmatesWanted: 1,
      contribution: 360000,
      availableFrom: "October 2026",
      room: "Private bedroom",
      sharedSpaces: ["Kitchen", "Living room"],
      householdSize: 1,
      furnishing: "Furnished",
      householdStyle: ["Balanced", "Clean", "Outdoor smoking only"],
    },
  },
];

export function getPublicFlatmate(id: string) {
  return PUBLIC_FLATMATES.find((flatmate) => flatmate.id === id);
}

export function formatRwf(value: number) {
  return `RWF ${value.toLocaleString("en-US")}`;
}

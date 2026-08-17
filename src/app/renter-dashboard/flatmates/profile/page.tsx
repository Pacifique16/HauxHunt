"use client";

import Link from "next/link";
import {
  ChevronLeft,
  BadgeCheck,
  Check,
  Eye,
  Plus,
  Save,
  Sparkles,
  User,
  X,
  Smartphone,
  MapPin,
  Briefcase,
  Calendar,
  Home,
  Trash2,
  Compass,
  Camera,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Mic,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import julienPhoto from "@/assets/images/julien.jpg";
import phoneImage from "@/assets/images/phone.png";
import macbookImage from "@/assets/images/macbook.png";
import alinePortrait from "@/assets/images/flatmate-aline.png";
import gracePortrait from "@/assets/images/flatmate-grace.png";
import patrickPortrait from "@/assets/images/flatmate-patrick.png";
import Image from "next/image";
import { PUBLIC_FLATMATES } from "@/data/public-flatmates";

const AVAILABLE_AREAS = [
  // Kigali, Rwanda
  "Kacyiru",
  "Kimihurura",
  "Remera",
  "Kibagabaga",
  "Nyarutarama",
  "Gacuriro",
  "Kiyovu",
  "Kanombe",
  // Nairobi, Kenya
  "Kilimani",
  "Westlands",
  "Karen",
  "Lavington",
  // Lagos, Nigeria
  "Lekki",
  "Victoria Island",
  "Ikeja",
  "Yaba",
];

const AVAILABLE_TAGS = [
  "Non-smoker",
  "Hybrid professional",
  "Respectful of privacy",
  "Fitness enthusiast",
  "Cooks at home",
  "Remote worker",
  "Vegetarian",
];

export default function RenterFlatmateProfilePage() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [savedToast, setSavedToast] = useState(false);
  const [mockView, setMockView] = useState<"card" | "detail">("card");
  const [previewDevice, setPreviewDevice] = useState<"phone" | "macbook">("phone");

  // Image upload state
  const [profileImage, setProfileImage] = useState<any>(julienPhoto);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form states
  const [firstName, setFirstName] = useState("Julien");
  const [age, setAge] = useState("26");
  const [gender, setGender] = useState("male");
  const [occupation, setOccupation] = useState("Product Designer");
  const [city, setCity] = useState("Kigali");
  const [country, setCountry] = useState("Rwanda");
  const [situation, setSituation] = useState<"looking" | "has-place">("looking");
  const [budget, setBudget] = useState("450000");
  const [moveIn, setMoveIn] = useState("September 2026");
  const [preferredProperty, setPreferredProperty] = useState("Apartment");
  const [furnishing, setFurnishing] = useState("Furnished");
  const [stay, setStay] = useState("12+ months");
  const [genderPreference, setGenderPreference] = useState("female");
  const [selectedRentalId, setSelectedRentalId] = useState("kibagabaga-modern-family-home");

  // Lifestyle details
  const [cleanliness, setCleanliness] = useState("Very tidy");
  const [pets, setPets] = useState("Okay with cats");
  const [socialStyle, setSocialStyle] = useState("Quiet weekdays, social weekends");
  const [sleepSchedule, setSleepSchedule] = useState("Early sleeper");
  const [guests, setGuests] = useState("Occasional visitors");

  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "Kacyiru",
    "Kimihurura",
    "Remera",
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Non-smoker",
    "Hybrid professional",
    "Respectful of privacy",
  ]);
  const [about, setAbout] = useState(
    "I'm a designer based in Kigali who values a clean, quiet home environment on weekdays and enjoys sharing meals or socializing on weekends.",
  );
  const [lookingFor, setLookingFor] = useState<string[]>([
    "Respectful of shared spaces",
    "Similar monthly budget",
    "Non-smoker",
    "Clear communicator",
    "Long-term housing arrangement",
  ]);
  const [newLookingForItem, setNewLookingForItem] = useState("");
  const [customArea, setCustomArea] = useState("");

  const addCustomArea = () => {
    const trimmed = customArea.trim();
    if (!trimmed) return;
    if (!selectedAreas.includes(trimmed)) {
      setSelectedAreas((prev) => [...prev, trimmed]);
    }
    setCustomArea("");
  };

  const [customTag, setCustomTag] = useState("");

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    if (!selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
    }
    setCustomTag("");
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const addLookingForItem = () => {
    if (!newLookingForItem.trim()) return;
    setLookingFor((prev) => [...prev, newLookingForItem.trim()]);
    setNewLookingForItem("");
  };

  const removeLookingForItem = (index: number) => {
    setLookingFor((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const saved = window.sessionStorage.getItem("hauxhunt-flatmate-profile-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.firstName) setFirstName(data.firstName);
        if (data.age) setAge(String(data.age));
        if (data.gender) setGender(data.gender);
        if (data.occupation) setOccupation(data.occupation);
        if (data.city) setCity(data.city);
        if (data.country) setCountry(data.country);
        if (data.situation) setSituation(data.situation);
        if (data.budget) setBudget(String(data.budget));
        if (data.moveIn) setMoveIn(data.moveIn);
        if (data.preferredProperty) setPreferredProperty(data.preferredProperty);
        if (data.furnishing) setFurnishing(data.furnishing);
        if (data.stay) setStay(data.stay);
        if (data.genderPreference) setGenderPreference(data.genderPreference);
        if (data.areas) setSelectedAreas(data.areas);
        if (data.lifestyleTags) setSelectedTags(data.lifestyleTags);
        if (data.about) setAbout(data.about);
        if (data.lookingFor) setLookingFor(data.lookingFor);
        if (data.profileImage) setProfileImage(data.profileImage);
        if (data.selectedRentalId) setSelectedRentalId(data.selectedRentalId);
        if (data.cleanliness) setCleanliness(data.cleanliness);
        if (data.pets) setPets(data.pets);
        if (data.socialStyle) setSocialStyle(data.socialStyle);
        if (data.sleepSchedule) setSleepSchedule(data.sleepSchedule);
        if (data.guests) setGuests(data.guests);
      } catch (err) {
        console.error("Error loading saved flatmate profile:", err);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);

    const profileData = {
      firstName,
      age: Number(age),
      gender,
      occupation,
      city,
      country,
      situation,
      budget: Number(budget),
      moveIn,
      preferredProperty,
      furnishing,
      stay,
      genderPreference,
      selectedRentalId,
      areas: selectedAreas,
      lifestyleTags: selectedTags,
      about,
      lookingFor,
      profileImage,
      cleanliness,
      pets,
      socialStyle,
      sleepSchedule,
      guests
    };

    window.sessionStorage.setItem("hauxhunt-flatmate-profile-data", JSON.stringify(profileData));
    window.sessionStorage.setItem("hauxhunt-has-flatmate-profile", "true");
    window.dispatchEvent(new Event("storage"));
    window.setTimeout(() => setSavedToast(false), 3500);
  };

  const compactBudget = (val: string | number) => {
    const num = Number(val);
    if (isNaN(num)) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <div className="mx-auto px-4 py-8 sm:px-6 max-w-[1400px] lg:px-8 xl:px-12">
          {/* Header row */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-6">
            <div>
              <Link
                href="/flatmates?from=renter"
                className="mb-6 inline-flex items-center gap-1 text-sm text-black/65 transition-colors hover:text-black"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
                Back to Browse Flatmates
              </Link>
              <h1 className="font-bricolage text-3xl font-semibold tracking-tight sm:text-4xl">
                My Flatmate Profile
              </h1>
              <p className="text-carbon-600 mt-1 text-sm">
                Set up your housing preferences and lifestyle compatibility so potential flatmates can find you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Responsive tab selector (mobile/tablet only) */}
              <div className="flex rounded-full border border-black/10 bg-white p-1 shadow-sm lg:hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    activeTab === "edit"
                      ? "bg-black text-white"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    activeTab === "preview"
                      ? "bg-black text-white"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  <Eye className="size-3.5" />
                  Live Preview
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="font-bricolage inline-flex h-11 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:bg-neutral-800 active:scale-95 transition-all"
              >
                <Save className="size-4" />
                Publish Profile
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {savedToast && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 right-6 z-[250] flex items-center gap-2.5 rounded-2xl bg-black px-5 py-4 text-sm font-semibold text-white shadow-2xl"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="size-3 text-white" />
                </div>
                Your Flatmate Profile is published and active!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Split Builder Layout */}
          <div className="mt-8 lg:grid lg:grid-cols-[1.25fr_0.75fr] xl:grid-cols-[1.3fr_0.7fr] lg:gap-8">
            
            {/* 1. Left Column: Form Editor */}
            <div className={`${activeTab === "edit" ? "block" : "hidden lg:block"} space-y-8`}>
              
              {/* Basic Information section */}
              <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/60 backdrop-blur-xl sm:p-8">
                <div>
                  <h2 className="font-bricolage text-xl font-medium tracking-tight">
                    Basic Profile Details
                  </h2>
                  <p className="text-carbon-500 text-xs">
                    Public information shown to potential flatmates
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <label
                    htmlFor="profile-image-upload"
                    className="group relative size-24 shrink-0 overflow-hidden rounded-3xl border border-black/10 bg-black/5 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer block"
                  >
                    <Image
                      src={profileImage}
                      alt="Julien's photo"
                      fill
                      className="object-cover"
                    />
                    {/* Camera icon badge overlay */}
                    <div className="absolute bottom-1.5 right-1.5 flex size-7 items-center justify-center rounded-xl bg-white text-black shadow-md border border-black/5 transition-transform group-hover:scale-110">
                      <Camera className="size-4" />
                    </div>
                  </label>
                  <input
                    type="file"
                    id="profile-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div>
                    <h3 className="font-bricolage text-lg font-medium flex items-center gap-1.5">
                      <span>{firstName} Mugisha</span>
                      <BadgeCheck className="size-5 shrink-0 text-[#242424] fill-white" />
                    </h3>
                    <p className="text-carbon-500 text-xs mt-1">
                      Verified renter profile photo · Kigali, Rwanda
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="profile-field-control mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-normal outline-none focus:border-black transition-colors"
                      placeholder="e.g. Julien"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="profile-field-control mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-normal outline-none focus:border-black transition-colors"
                      placeholder="e.g. 26"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Your Gender
                    </label>
                    <span className="relative block mt-1.5">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="profile-field-control mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-normal outline-none focus:border-black transition-colors"
                      placeholder="e.g. Product Designer"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Current City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="profile-field-control mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-normal outline-none focus:border-black transition-colors"
                      placeholder="e.g. Kigali"
                    />
                  </div>
                </div>
              </section>

              {/* Housing Situation & Budget section */}
              <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/60 backdrop-blur-xl sm:p-8">
                <div>
                  <h2 className="font-bricolage text-xl font-medium tracking-tight">
                    Housing Situation & Budget
                  </h2>
                  <p className="text-carbon-500 text-xs">
                    What kind of living arrangement are you looking for?
                  </p>
                </div>

                <div className="mt-8">
                  <label className="text-carbon-700 text-xs font-semibold">
                    Your Current Situation
                  </label>
                  <div className="mt-2.5 grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSituation("looking")}
                      className={`group flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                        situation === "looking"
                          ? "border-black bg-black text-white shadow-md shadow-black/5"
                          : "border-black/15 bg-white text-black hover:border-black/35 hover:bg-neutral-50/50"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-bricolage text-base font-semibold">
                          Looking for a place
                        </span>
                        <div className={`flex size-4 items-center justify-center rounded-full border transition-colors ${situation === "looking" ? "border-white bg-white text-black" : "border-black/20"}`}>
                          {situation === "looking" && <Check className="size-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <span className={`mt-2.5 text-xs leading-5 ${situation === "looking" ? "text-white/70" : "text-carbon-500"}`}>
                        I want to find flatmates and search for a home together.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSituation("has-place")}
                      className={`group flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                        situation === "has-place"
                          ? "border-black bg-black text-white shadow-md shadow-black/5"
                          : "border-black/15 bg-white text-black hover:border-black/35 hover:bg-neutral-50/50"
                      }`}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-bricolage text-base font-semibold">
                          Already have a place
                        </span>
                        <div className={`flex size-4 items-center justify-center rounded-full border transition-colors ${situation === "has-place" ? "border-white bg-white text-black" : "border-black/20"}`}>
                          {situation === "has-place" && <Check className="size-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <span className={`mt-2.5 text-xs leading-5 ${situation === "has-place" ? "text-white/70" : "text-carbon-500"}`}>
                        I currently rent a place and have a room available.
                      </span>
                    </button>
                  </div>
                </div>

                {situation === "has-place" && (
                  <div className="mt-6 border-t border-black/5 pt-6">
                    <label className="text-carbon-700 text-xs font-semibold">
                      Active Rental (Accommodating Property)
                    </label>
                    <span className="relative block mt-1.5 max-w-md">
                      <select
                        value={selectedRentalId}
                        onChange={(e) => setSelectedRentalId(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="kibagabaga-modern-family-home">Modern family home (Kibagabaga, Kigali)</option>
                        <option value="nyarutarama-2br">Modern 2-bedroom (Nyarutarama, Kigali)</option>
                        <option value="remera-3br">3-bedroom family home with garden (Remera, Kigali)</option>
                        <option value="lekki-2br">2-bedroom apartment with private parking (Lekki, Lagos)</option>
                        <option value="lekki-contemporary-duplex">Contemporary duplex (Lekki, Lagos)</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                    <p className="mt-2 text-xs text-carbon-450 leading-normal">
                      Select which of your active rental listings you want to find flatmates for.
                    </p>
                  </div>
                )}

                <div className="mt-8 grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Monthly Budget (RWF)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="profile-field-control mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-normal outline-none focus:border-black transition-colors"
                      placeholder="e.g. 450000"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Target Move-In
                    </label>
                    <span className="relative block mt-1.5">
                      <select
                        value={moveIn}
                        onChange={(e) => setMoveIn(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="Available now">Available now</option>
                        <option value="September 2026">September 2026</option>
                        <option value="October 2026">October 2026</option>
                        <option value="November 2026">November 2026</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Preferred Stay
                    </label>
                    <span className="relative block mt-1.5">
                      <select
                        value={stay}
                        onChange={(e) => setStay(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="6–12 months">6–12 months</option>
                        <option value="12+ months">12+ months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Preferred Property Type
                    </label>
                    <span className="relative block mt-1.5">
                      <select
                        value={preferredProperty}
                        onChange={(e) => setPreferredProperty(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="House / Villa">House / Villa</option>
                        <option value="Shared Duplex">Shared Duplex</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Furnishing
                    </label>
                    <span className="relative block mt-1.5">
                      <select
                        value={furnishing}
                        onChange={(e) => setFurnishing(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="Furnished">Furnished preferred</option>
                        <option value="Semi-furnished">Semi-furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-semibold">
                      Gender Preference
                    </label>
                    <span className="relative block mt-1.5">
                      <select
                        value={genderPreference}
                        onChange={(e) => setGenderPreference(e.target.value)}
                        className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                      >
                        <option value="any">Any</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                      <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                    </span>
                  </div>
                </div>

                {/* Preferred areas */}
                <div className="mt-8">
                  <label className="text-carbon-700 text-xs font-semibold">
                    Preferred Areas / Neighborhoods
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from(new Set([...AVAILABLE_AREAS, ...selectedAreas])).map((area) => {
                      const isSelected = selectedAreas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleArea(area)}
                          className={`group flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 active:scale-95 ${
                            isSelected
                              ? "bg-black/5 border border-black/35 text-black shadow-sm"
                              : "border border-black/15 bg-white text-black/75 hover:border-black/35 hover:bg-neutral-50/50"
                          }`}
                        >
                          <span className="flex items-center justify-center">
                            {isSelected ? (
                              <Check className="size-3 text-black" />
                            ) : (
                              <Plus className="size-3 text-black/40 group-hover:text-black" />
                            )}
                          </span>
                          {area}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add custom area control */}
                  <div className="mt-4 flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Add other area/neighborhood..."
                      value={customArea}
                      onChange={(e) => setCustomArea(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomArea();
                        }
                      }}
                      className="profile-field-control h-10 flex-1 rounded-xl border border-black/15 bg-white px-3.5 text-xs outline-none focus:border-black transition-colors font-normal"
                    />
                    <button
                      type="button"
                      onClick={addCustomArea}
                      className="inline-flex h-10 items-center gap-1 rounded-xl bg-black px-4 text-xs font-semibold text-white hover:bg-neutral-800 active:scale-95 transition-all"
                    >
                      <Plus className="size-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </section>

              {/* Lifestyle & Compatibility section */}
              <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/60 backdrop-blur-xl sm:p-8">
                <div>
                  <h2 className="font-bricolage text-xl font-medium tracking-tight">
                    Lifestyle & Compatibility Tags
                  </h2>
                  <p className="text-carbon-500 text-xs">
                    Choose the tags that best describe your lifestyle routine and habits.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {Array.from(new Set([...AVAILABLE_TAGS, ...selectedTags])).map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`group flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 active:scale-95 ${
                          isSelected
                            ? "bg-black/5 border border-black/35 text-black shadow-sm"
                            : "border border-black/15 bg-white text-black/75 hover:border-black/35 hover:bg-neutral-50/50"
                        }`}
                      >
                        <span className="flex items-center justify-center">
                          {isSelected ? (
                            <Check className="size-3 text-black" />
                          ) : (
                            <Plus className="size-3 text-black/40 group-hover:text-black" />
                          )}
                        </span>
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Add custom lifestyle tag control */}
                <div className="mt-4 flex gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add other lifestyle tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomTag();
                      }
                    }}
                    className="profile-field-control h-10 flex-1 rounded-xl border border-black/15 bg-white px-3.5 text-xs outline-none focus:border-black transition-colors font-normal"
                  />
                  <button
                    type="button"
                    onClick={addCustomTag}
                    className="inline-flex h-10 items-center gap-1 rounded-xl bg-black px-4 text-xs font-semibold text-white hover:bg-neutral-800 active:scale-95 transition-all"
                  >
                    <Plus className="size-3.5" />
                    Add
                  </button>
                </div>

                {/* Lifestyle Details Dropdowns */}
                <div className="mt-8">
                  <h3 className="font-bricolage text-base font-semibold text-black/85 mb-3">
                    Lifestyle Profile Details
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="text-carbon-700 text-xs font-semibold">
                        Cleanliness
                      </label>
                      <span className="relative block mt-1.5">
                        <select
                          value={cleanliness}
                          onChange={(e) => setCleanliness(e.target.value)}
                          className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                        >
                          <option value="Very tidy">Very tidy</option>
                          <option value="Clean shared spaces">Clean shared spaces</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                        <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                      </span>
                    </div>

                    <div>
                      <label className="text-carbon-700 text-xs font-semibold">
                        Pets Preference
                      </label>
                      <span className="relative block mt-1.5">
                        <select
                          value={pets}
                          onChange={(e) => setPets(e.target.value)}
                          className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                        >
                          <option value="Okay with small pets">Okay with small pets</option>
                          <option value="Okay with cats">Okay with cats</option>
                          <option value="Okay with dogs">Okay with dogs</option>
                          <option value="No pets">No pets</option>
                        </select>
                        <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                      </span>
                    </div>

                    <div>
                      <label className="text-carbon-700 text-xs font-semibold">
                        Social Style
                      </label>
                      <span className="relative block mt-1.5">
                        <select
                          value={socialStyle}
                          onChange={(e) => setSocialStyle(e.target.value)}
                          className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                        >
                          <option value="Quiet weekdays, social weekends">Quiet weekdays, social weekends</option>
                          <option value="Quiet home">Quiet home</option>
                          <option value="Balanced">Balanced</option>
                          <option value="Social home / Enjoys hosting">Social home / Enjoys hosting</option>
                        </select>
                        <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                      </span>
                    </div>

                    <div>
                      <label className="text-carbon-700 text-xs font-semibold">
                        Sleep Schedule
                      </label>
                      <span className="relative block mt-1.5">
                        <select
                          value={sleepSchedule}
                          onChange={(e) => setSleepSchedule(e.target.value)}
                          className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                        >
                          <option value="Early sleeper">Early sleeper</option>
                          <option value="Early riser">Early riser</option>
                          <option value="Flexible">Flexible</option>
                          <option value="Night owl">Night owl</option>
                        </select>
                        <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                      </span>
                    </div>

                    <div>
                      <label className="text-carbon-700 text-xs font-semibold">
                        Guests Preference
                      </label>
                      <span className="relative block mt-1.5">
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="profile-field-control h-11 w-full rounded-xl border border-black/15 bg-white pl-3.5 pr-10 text-sm font-normal outline-none focus:border-black appearance-none transition-colors"
                        >
                          <option value="Occasional visitors">Occasional visitors</option>
                          <option value="Friends occasionally">Friends occasionally</option>
                          <option value="No overnight guests">No overnight guests</option>
                        </select>
                        <ChevronDown className="text-black/40 pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <label className="text-carbon-700 text-xs font-semibold">
                      About You (Bio)
                    </label>
                    <span className="text-[10px] text-carbon-400">
                      {about.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="profile-field-control mt-2 w-full rounded-2xl border border-black/15 bg-white p-4 text-sm leading-6 font-normal outline-none focus:border-black transition-colors"
                    placeholder="Tell potential flatmates about your routine, hobbies, and what you value in a shared home..."
                  />
                </div>

                <div className="mt-8">
                  <label className="text-carbon-700 text-xs font-semibold">
                    What You Look for in a Flatmate
                  </label>
                  
                  <div className="mt-3 space-y-2.5">
                    <AnimatePresence initial={false}>
                      {lookingFor.map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="flex items-center justify-between rounded-2xl border border-black/[0.04] bg-black/[0.03] px-4 py-3 text-xs font-medium text-black/85"
                        >
                          <span className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-black/40" />
                            {item}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLookingForItem(index)}
                            className="text-black/40 hover:text-black active:scale-90 transition-transform"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add a requirement..."
                        value={newLookingForItem}
                        onChange={(e) => setNewLookingForItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addLookingForItem();
                          }
                        }}
                        className="profile-field-control h-11 flex-1 rounded-xl border border-black/15 bg-white px-3.5 text-xs outline-none focus:border-black transition-colors"
                      />
                      <button
                        type="button"
                        onClick={addLookingForItem}
                        className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-black px-5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                      >
                        <Plus className="size-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* 2. Right Column: Sticky Live Profile Card Preview */}
            <div className={`${activeTab === "preview" ? "block" : "hidden lg:block"} lg:col-span-1 lg:w-full`}>
              <div className="sticky top-20 self-start w-full flex flex-col items-center">
                
                {/* Title */}
                <div className="text-center mb-6">
                  <h2 className="font-bricolage text-xl font-bold text-black/85">
                    Profile Card Preview
                  </h2>
                  <p className="text-xs text-black/55 mt-1">
                    This is how your card appears to others in search results.
                  </p>
                </div>

                {/* Card Container */}
                <div className="relative w-full max-w-[340px] aspect-[3/4.2] overflow-hidden rounded-[2rem] bg-black shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-left">
                  <div className="absolute inset-0">
                    <Image
                      src={profileImage}
                      alt="Julien portrait preview"
                      fill
                      className="object-cover"
                      priority
                      quality={100}
                    />
                  </div>
                  
                  {/* Shadow overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" />
                  
                  {/* Details Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="min-w-0">
                      <h3 className="font-bricolage flex items-center gap-1.5 text-[20px] leading-none font-medium tracking-tight">
                        <span>
                          {firstName || "Julien"}, {age || 26}
                        </span>
                        <BadgeCheck className="size-5 shrink-0 fill-white text-[#242424]" />
                      </h3>
                      <p className="mt-1 truncate text-[12px] text-white/72">
                        {occupation || "Product Designer"} · {city || "Kigali"}
                      </p>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        {situation === "looking" ? "Looking for a place" : "Already has a place"}
                      </span>
                      <p className="flex shrink-0 items-baseline gap-0.5 text-[12px] font-semibold">
                        <span>
                          {situation === "looking"
                            ? `RWF ${compactBudget(budget)}`
                            : `– RWF ${compactBudget(budget)}`}
                        </span>
                        <span className="text-[9px] font-normal text-white/50 ml-0.5">Per month</span>
                      </p>
                    </div>

                    <div className="mt-3.5 flex flex-wrap gap-1 leading-none">
                      {selectedTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-black/45 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

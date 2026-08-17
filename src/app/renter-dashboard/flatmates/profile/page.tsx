"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Eye,
  Plus,
  Save,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import julienPhoto from "@/assets/images/julien.jpg";
import Image from "next/image";

const AVAILABLE_AREAS = [
  "Kacyiru",
  "Kimihurura",
  "Remera",
  "Kibagabaga",
  "Nyarutarama",
  "Gacuriro",
  "Kiyovu",
  "Kanombe",
];

const AVAILABLE_TAGS = [
  "Non-smoker",
  "Very tidy",
  "Quiet weekdays",
  "Social weekends",
  "Early riser",
  "Hybrid professional",
  "Respectful of privacy",
  "Pet friendly",
  "Fitness enthusiast",
  "Cooks at home",
];

export default function RenterFlatmateProfilePage() {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [savedToast, setSavedToast] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("Julien");
  const [age, setAge] = useState("26");
  const [occupation, setOccupation] = useState("Product Designer");
  const [city, setCity] = useState("Kigali");
  const [country, setCountry] = useState("Rwanda");
  const [situation, setSituation] = useState<"looking" | "has-place">("looking");
  const [budgetMin, setBudgetMin] = useState("350000");
  const [budgetMax, setBudgetMax] = useState("500000");
  const [moveIn, setMoveIn] = useState("September 2026");
  const [preferredProperty, setPreferredProperty] = useState("Apartment");
  const [furnishing, setFurnishing] = useState("Furnished");
  const [stay, setStay] = useState("12+ months");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "Kacyiru",
    "Kimihurura",
    "Remera",
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Non-smoker",
    "Very tidy",
    "Quiet weekdays",
    "Hybrid professional",
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-6 lg:px-11 xl:px-[52px]">
          {/* Header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/flatmates?from=renter"
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-black/60 transition-colors hover:text-black"
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" />
                Back to Browse Flatmates
              </Link>
              <h1 className="font-bricolage text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                My Flatmate Profile
              </h1>
              <p className="text-carbon-600 mt-1.5 text-sm">
                Set up your housing preferences and lifestyle compatibility so
                potential flatmates can find you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-full border border-black/15 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
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
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === "preview"
                      ? "bg-black text-white"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  <Eye className="size-3.5" />
                  Public Preview
                </button>
              </div>

              {activeTab === "edit" ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className="font-bricolage inline-flex h-10 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white shadow-md transition-colors hover:bg-black/80"
                >
                  <Save className="size-4" />
                  Publish Profile
                </button>
              ) : null}
            </div>
          </div>

          {/* Toast Notification */}
          {savedToast ? (
            <div className="fixed bottom-6 right-6 z-[250] flex items-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-medium text-white shadow-2xl">
              <Check className="size-4 text-emerald-400" />
              Your Flatmate Profile is published and active!
            </div>
          ) : null}

          {activeTab === "edit" ? (
            <form onSubmit={handleSave} className="mt-8 space-y-8">
              {/* 1. Basic Information */}
              <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-black text-white">
                    <User className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-bricolage text-xl font-medium">
                      Basic Profile Details
                    </h2>
                    <p className="text-carbon-500 text-xs">
                      Public information shown to potential flatmates
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-sm">
                    <Image
                      src={julienPhoto}
                      alt="Julien's photo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bricolage text-lg font-medium">
                      {firstName} Mugisha
                    </h3>
                    <p className="text-carbon-500 text-xs">
                      Verified renter profile photo · Kigali, Rwanda
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <BadgeCheck className="size-3.5" />
                      ID Verified
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-medium outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-medium outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Occupation
                    </label>
                    <input
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-medium outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Current City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-medium outline-none focus:border-black"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Housing Situation & Budget */}
              <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-black text-white">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-bricolage text-xl font-medium">
                      Housing Situation & Budget
                    </h2>
                    <p className="text-carbon-500 text-xs">
                      What kind of living arrangement are you looking for?
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="text-carbon-700 text-xs font-medium">
                    Your Current Situation
                  </label>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setSituation("looking")}
                      className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                        situation === "looking"
                          ? "border-black bg-black text-white shadow-md"
                          : "border-black/15 bg-white text-black hover:border-black/30"
                      }`}
                    >
                      <span className="font-bricolage text-base font-medium">
                        Looking for a place
                      </span>
                      <span
                        className={`mt-1 text-xs ${
                          situation === "looking"
                            ? "text-white/70"
                            : "text-carbon-500"
                        }`}
                      >
                        I want to find flatmates and search for a home together.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSituation("has-place")}
                      className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                        situation === "has-place"
                          ? "border-black bg-black text-white shadow-md"
                          : "border-black/15 bg-white text-black hover:border-black/30"
                      }`}
                    >
                      <span className="font-bricolage text-base font-medium">
                        Already have a place
                      </span>
                      <span
                        className={`mt-1 text-xs ${
                          situation === "has-place"
                            ? "text-white/70"
                            : "text-carbon-500"
                        }`}
                      >
                        I currently rent a place and have a room available.
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Min Monthly Budget (RWF)
                    </label>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-medium outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Max Monthly Budget (RWF)
                    </label>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3.5 text-sm font-medium outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Target Move-In
                    </label>
                    <select
                      value={moveIn}
                      onChange={(e) => setMoveIn(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm font-medium outline-none focus:border-black"
                    >
                      <option value="Available now">Available now</option>
                      <option value="September 2026">September 2026</option>
                      <option value="October 2026">October 2026</option>
                      <option value="November 2026">November 2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Preferred Stay
                    </label>
                    <select
                      value={stay}
                      onChange={(e) => setStay(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm font-medium outline-none focus:border-black"
                    >
                      <option value="6–12 months">6–12 months</option>
                      <option value="12+ months">12+ months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Preferred Property Type
                    </label>
                    <select
                      value={preferredProperty}
                      onChange={(e) => setPreferredProperty(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm font-medium outline-none focus:border-black"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House / Villa">House / Villa</option>
                      <option value="Shared Duplex">Shared Duplex</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-carbon-700 text-xs font-medium">
                      Furnishing
                    </label>
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm font-medium outline-none focus:border-black"
                    >
                      <option value="Furnished">Furnished preferred</option>
                      <option value="Semi-furnished">Semi-furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>

                {/* Preferred areas */}
                <div className="mt-6">
                  <label className="text-carbon-700 text-xs font-medium">
                    Preferred Areas / Neighborhoods
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {AVAILABLE_AREAS.map((area) => {
                      const isSelected = selectedAreas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleArea(area)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-black text-white"
                              : "border border-black/15 bg-white text-black/75 hover:border-black/30"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* 3. Lifestyle & Compatibility */}
              <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                <h2 className="font-bricolage text-xl font-medium">
                  Lifestyle & Compatibility Tags
                </h2>
                <p className="text-carbon-500 text-xs">
                  Choose the tags that best describe your lifestyle routine and habits.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-black text-white"
                            : "border border-black/15 bg-white text-black/75 hover:border-black/30"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <label className="text-carbon-700 text-xs font-medium">
                    About You (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-black/15 bg-white p-3.5 text-sm leading-6 font-medium outline-none focus:border-black"
                  />
                </div>

                <div className="mt-6">
                  <label className="text-carbon-700 text-xs font-medium">
                    What You Look for in a Flatmate
                  </label>
                  <div className="mt-2 space-y-2">
                    {lookingFor.map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl bg-black/[0.04] px-3.5 py-2 text-xs font-medium text-black/85"
                      >
                        <span>• {item}</span>
                        <button
                          type="button"
                          onClick={() => removeLookingForItem(index)}
                          className="text-black/40 hover:text-black"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
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
                        className="h-10 flex-1 rounded-xl border border-black/15 bg-white px-3 text-xs outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={addLookingForItem}
                        className="inline-flex h-10 items-center gap-1 rounded-xl bg-black px-4 text-xs font-medium text-white"
                      >
                        <Plus className="size-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-3 pb-12">
                <Link
                  href="/flatmates?from=renter"
                  className="flex h-12 items-center rounded-full border border-black/20 px-6 text-sm font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="font-bricolage inline-flex h-12 items-center gap-2 rounded-full bg-black px-8 font-medium text-white shadow-lg transition-colors hover:bg-black/80"
                >
                  <Save className="size-4" />
                  Save & Publish Profile
                </button>
              </div>
            </form>
          ) : (
            /* Preview View */
            <div className="mt-8 space-y-6 pb-14">
              <header className="grid overflow-hidden rounded-3xl bg-white shadow-[0_14px_45px_rgba(0,0,0,0.07)] lg:grid-cols-[390px_1fr]">
                <div className="relative h-[430px] lg:h-full lg:min-h-[460px]">
                  <Image
                    src={julienPhoto}
                    alt={`${firstName}'s photo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                      situation === "looking"
                        ? "bg-black text-white"
                        : "bg-black/[0.07]"
                    }`}
                  >
                    {situation === "looking"
                      ? "Looking for a place"
                      : "Already has a place"}
                  </span>
                  <h2 className="font-bricolage mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
                    {firstName}, {age}
                  </h2>
                  <p className="mt-3 text-lg">{occupation}</p>
                  <p className="text-carbon-500 mt-1">
                    {city}, {country}
                  </p>
                  <div className="mt-7 flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <BadgeCheck aria-hidden="true" className="size-4" />
                    Verified HauxHunt Flatmate Profile
                  </div>
                </div>
              </header>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                    <h3 className="font-bricolage mb-4 text-2xl font-medium">
                      About Me
                    </h3>
                    <p className="text-carbon-600 leading-7">“{about}”</p>
                  </section>

                  <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                    <h3 className="font-bricolage mb-5 text-2xl font-medium">
                      Housing Plans
                    </h3>
                    <dl className="grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <dt className="text-carbon-500 text-xs">Preferred areas</dt>
                        <dd className="mt-1 font-medium">
                          {selectedAreas.join(" · ")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-carbon-500 text-xs">
                          Monthly budget contribution
                        </dt>
                        <dd className="mt-1 font-medium">
                          RWF {Number(budgetMin).toLocaleString()} – RWF{" "}
                          {Number(budgetMax).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-carbon-500 text-xs">Move-in</dt>
                        <dd className="mt-1 font-medium">{moveIn}</dd>
                      </div>
                      <div>
                        <dt className="text-carbon-500 text-xs">Property type</dt>
                        <dd className="mt-1 font-medium">{preferredProperty}</dd>
                      </div>
                      <div>
                        <dt className="text-carbon-500 text-xs">Furnishing</dt>
                        <dd className="mt-1 font-medium">{furnishing}</dd>
                      </div>
                    </dl>
                  </section>
                </div>

                <aside className="space-y-6">
                  <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                    <h3 className="font-bricolage mb-4 text-2xl font-medium">
                      Lifestyle
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-black/[0.05] px-3 py-1 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
                    <h3 className="font-bricolage mb-4 text-2xl font-medium">
                      What I&apos;m Looking For
                    </h3>
                    <ul className="space-y-2.5 text-sm">
                      {lookingFor.map((req) => (
                        <li key={req} className="flex items-center gap-2">
                          <Check className="size-4 shrink-0 text-black/60" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </aside>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

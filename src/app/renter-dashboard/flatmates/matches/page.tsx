"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MessageSquare, X, Info, HelpCircle } from "lucide-react";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { PUBLIC_FLATMATES, type PublicFlatmate, formatRwf } from "@/data/public-flatmates";
import emptyImage from "@/assets/images/empty.png";
import matchImage from "@/assets/images/match.png";

export default function RenterFlatmateMatchesPage() {
  const [activeTab, setActiveTab] = useState<"matches" | "received" | "sent">("matches");
  const [interests, setInterests] = useState<string[]>([]);
  const [received, setReceived] = useState<string[]>([]);
  const [notForMe, setNotForMe] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [modalFlatmate, setModalFlatmate] = useState<PublicFlatmate | null>(null);

  // User details from profile editor
  const [userSituation, setUserSituation] = useState<"looking" | "has-place">("looking");
  const [userBudget, setUserBudget] = useState(450000);
  const [userAreas, setUserAreas] = useState<string[]>(["Kacyiru", "Kimihurura"]);

  // Load and sync states
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Seed default incoming interests if not present
      const savedReceived = window.sessionStorage.getItem("hauxhunt-flatmate-received-interests");
      if (!savedReceived) {
        window.sessionStorage.setItem("hauxhunt-flatmate-received-interests", JSON.stringify(["aline", "nadia"]));
      }

      // Load user profile properties
      const savedProfile = window.sessionStorage.getItem("hauxhunt-flatmate-profile-data");
      if (savedProfile) {
        try {
          const data = JSON.parse(savedProfile);
          if (data.situation) setUserSituation(data.situation);
          if (data.budget) setUserBudget(Number(data.budget));
          if (data.areas) setUserAreas(data.areas);
        } catch (e) {
          console.error(e);
        }
      }

      const sync = () => {
        const iStr = window.sessionStorage.getItem("hauxhunt-flatmate-interests") || "[]";
        const rStr = window.sessionStorage.getItem("hauxhunt-flatmate-received-interests") || "[]";
        const nStr = window.sessionStorage.getItem("hauxhunt-flatmate-not-for-me") || "[]";
        try {
          setInterests(JSON.parse(iStr));
          setReceived(JSON.parse(rStr));
          setNotForMe(JSON.parse(nStr));
        } catch (e) {
          console.error(e);
        }
      };

      sync();
      window.addEventListener("storage", sync);
      return () => window.removeEventListener("storage", sync);
    }
  }, []);

  // Update sessionStorage helpers
  const saveInterests = (newInterests: string[]) => {
    setInterests(newInterests);
    window.sessionStorage.setItem("hauxhunt-flatmate-interests", JSON.stringify(newInterests));
    window.dispatchEvent(new Event("storage"));
  };

  const saveNotForMe = (newNotForMe: string[]) => {
    setNotForMe(newNotForMe);
    window.sessionStorage.setItem("hauxhunt-flatmate-not-for-me", JSON.stringify(newNotForMe));
    window.dispatchEvent(new Event("storage"));
  };

  // State calculators
  const matchedFlatmates = PUBLIC_FLATMATES.filter(
    (f) => interests.includes(f.id) && received.includes(f.id)
  );

  const incomingInterests = PUBLIC_FLATMATES.filter(
    (f) => received.includes(f.id) && !interests.includes(f.id) && !notForMe.includes(f.id)
  );

  const outgoingInterests = PUBLIC_FLATMATES.filter(
    (f) => interests.includes(f.id) && !received.includes(f.id)
  );

  // Action triggers
  const handleLike = (flatmate: PublicFlatmate) => {
    const updated = [...interests];
    if (!updated.includes(flatmate.id)) {
      updated.push(flatmate.id);
      saveInterests(updated);

      // Trigger visual co-living match modal
      if (received.includes(flatmate.id)) {
        setModalFlatmate(flatmate);
        setShowMatchModal(true);
      }
    }
  };

  const handlePass = (id: string) => {
    const updated = [...notForMe];
    if (!updated.includes(id)) {
      updated.push(id);
      saveNotForMe(updated);
    }
  };

  const handleRemoveInterest = (id: string) => {
    const updated = interests.filter((interestId) => interestId !== id);
    saveInterests(updated);
  };

  const openCoLivingDetailsModal = (flatmate: PublicFlatmate) => {
    setModalFlatmate(flatmate);
    setShowMatchModal(true);
  };

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="bg-carbon-50 px-5 pt-9 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1280px]">
            <Link
              href="/flatmates?from=renter"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-black/65 transition-colors hover:text-black font-semibold"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Back to Catalog
            </Link>

            <div className="flex flex-col gap-2">
              <h1 className="dashboard-page-title text-carbon-900">
                Matches & Interests
              </h1>
              <p className="text-sm text-carbon-600 max-w-xl leading-relaxed">
                Connect with compatible flatmates who share your budget, housing choices, and lifestyle expectations.
              </p>
            </div>

            {/* Tabs Row */}
            <div className="mt-8 border-b border-black/10 flex gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("matches")}
                className={`pb-3 relative transition-all ${
                  activeTab === "matches" ? "text-black" : "text-neutral-450 hover:text-black"
                }`}
              >
                <span>Matches</span>
                {matchedFlatmates.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                    {matchedFlatmates.length}
                  </span>
                )}
                {activeTab === "matches" && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-black" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("received")}
                className={`pb-3 relative transition-all ${
                  activeTab === "received" ? "text-black" : "text-neutral-450 hover:text-black"
                }`}
              >
                <span>Interested in You</span>
                {incomingInterests.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                    {incomingInterests.length}
                  </span>
                )}
                {activeTab === "received" && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-black" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("sent")}
                className={`pb-3 relative transition-all ${
                  activeTab === "sent" ? "text-black" : "text-neutral-450 hover:text-black"
                }`}
              >
                <span>Your Interests</span>
                {outgoingInterests.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                    {outgoingInterests.length}
                  </span>
                )}
                {activeTab === "sent" && (
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-black" />
                )}
              </button>
            </div>

            {/* Tab Panels */}
            <div className="mt-8 pb-16">
              {activeTab === "matches" && (
                <>
                  {matchedFlatmates.length === 0 ? (
                    <EmptyState
                      title="No Matches Yet"
                      description="When you and another person are both interested in living together, they'll appear here."
                    />
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {matchedFlatmates.map((flatmate) => {
                        const isBothLooking = flatmate.situation === "looking" && userSituation === "looking";
                        return (
                          <div
                            key={flatmate.id}
                            className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex gap-4 items-center">
                                <div className="relative size-14 rounded-full overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
                                  <Image
                                    src={flatmate.portrait}
                                    alt={flatmate.firstName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bricolage text-lg font-bold text-neutral-900 truncate">
                                    {flatmate.firstName}, {flatmate.age}
                                  </h3>
                                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                                    {flatmate.occupation} · {flatmate.city}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-150 px-2.5 py-0.5 text-[10px] font-semibold text-green-700">
                                Matched today
                              </div>

                              {/* Overlap parameters */}
                              <div className="mt-4 rounded-xl bg-neutral-50 p-4.5 space-y-2.5 text-xs">
                                <div className="flex justify-between gap-2">
                                  <span className="text-neutral-450">Housing Plan</span>
                                  <span className="font-medium text-neutral-800">
                                    {flatmate.situation === "looking" ? "Looking for a place" : "Already has a place"}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <span className="text-neutral-450">Monthly Budget</span>
                                  <span className="font-medium text-neutral-850">
                                    {flatmate.situation === "looking"
                                      ? `${formatRwf(flatmate.budgetMin)}–${formatRwf(flatmate.budgetMax)}`
                                      : `${formatRwf(flatmate.budgetMin)} / month`}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <span className="text-neutral-450">Move-in Date</span>
                                  <span className="font-medium text-neutral-855">{flatmate.moveIn}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2.5">
                              <Link
                                href={`/renter-dashboard/messages?chat=${flatmate.id}`}
                                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-black text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm"
                              >
                                <MessageSquare className="size-3.5" />
                                <span>Message</span>
                              </Link>
                              {isBothLooking ? (
                                <button
                                  onClick={() => openCoLivingDetailsModal(flatmate)}
                                  className="flex h-10 w-full items-center justify-center rounded-full border border-black/15 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                                >
                                  Browse Homes Together
                                </button>
                              ) : (
                                <button
                                  onClick={() => openCoLivingDetailsModal(flatmate)}
                                  className="flex h-10 w-full items-center justify-center rounded-full border border-black/15 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                                >
                                  Discuss Living Arrangement
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {activeTab === "received" && (
                <>
                  {incomingInterests.length === 0 ? (
                    <EmptyState
                      title="No New Interests"
                      description="People interested in being flatmates with you will appear here."
                    />
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {incomingInterests.map((flatmate) => (
                        <div
                          key={flatmate.id}
                          className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex gap-4 items-center">
                              <div className="relative size-14 rounded-full overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
                                <Image
                                  src={flatmate.portrait}
                                  alt={flatmate.firstName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bricolage text-lg font-bold text-neutral-900 truncate">
                                  {flatmate.firstName}, {flatmate.age}
                                </h3>
                                <p className="text-xs text-neutral-500 truncate mt-0.5">
                                  {flatmate.occupation} · {flatmate.city}
                                </p>
                              </div>
                            </div>

                            <p className="mt-4 text-xs font-medium text-black/75 flex items-center gap-1.5 bg-neutral-50 border border-neutral-150 px-3 py-2 rounded-xl">
                              <Info className="size-3.5 text-neutral-500 shrink-0" />
                              <span>Interested in being flatmates with you</span>
                            </p>
                          </div>

                          <div className="mt-6 flex flex-col gap-2.5">
                            <Link
                              href={`/flatmates/${flatmate.id}?from=renter`}
                              className="flex h-10 w-full items-center justify-center rounded-full border border-black/15 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                            >
                              View Profile
                            </Link>
                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                onClick={() => handleLike(flatmate)}
                                className="flex h-10 items-center justify-center rounded-full bg-black text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                              >
                                I&apos;m Interested Too
                              </button>
                              <button
                                onClick={() => handlePass(flatmate.id)}
                                className="flex h-10 items-center justify-center rounded-full border border-red-200 text-red-650 bg-red-50/50 hover:bg-red-50 text-xs font-semibold transition-colors"
                              >
                                Not for Me
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "sent" && (
                <>
                  {outgoingInterests.length === 0 ? (
                    <EmptyState
                      title="You Haven't Expressed Interest Yet"
                      description="Browse Flatmates and let someone know when you think you could be a good fit."
                    />
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {outgoingInterests.map((flatmate) => (
                        <div
                          key={flatmate.id}
                          className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex gap-4 items-center">
                              <div className="relative size-14 rounded-full overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
                                <Image
                                  src={flatmate.portrait}
                                  alt={flatmate.firstName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bricolage text-lg font-bold text-neutral-900 truncate">
                                  {flatmate.firstName}, {flatmate.age}
                                </h3>
                                <p className="text-xs text-neutral-500 truncate mt-0.5">
                                  {flatmate.occupation} · {flatmate.city}
                                </p>
                              </div>
                            </div>

                            <p className="mt-4 text-xs font-medium text-neutral-500 flex items-center gap-1.5 bg-neutral-50 border border-neutral-100 px-3 py-2 rounded-xl">
                              <HelpCircle className="size-3.5 text-neutral-400 shrink-0" />
                              <span>Waiting for response</span>
                            </p>
                          </div>

                          <div className="mt-6 grid grid-cols-2 gap-2.5">
                            <Link
                              href={`/flatmates/${flatmate.id}?from=renter`}
                              className="flex h-10 items-center justify-center rounded-full border border-black/15 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                            >
                              View Profile
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(flatmate.id)}
                              className="flex h-10 items-center justify-center rounded-full border border-red-200 text-red-650 bg-red-50/50 hover:bg-red-50 text-xs font-semibold transition-colors"
                            >
                              Remove Interest
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Mutual Match Modal Popup */}
      {showMatchModal && modalFlatmate && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/35 p-5">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.3)]">
            <div className="relative flex min-h-48 items-center justify-center bg-black/[0.06] p-6">
              <button
                type="button"
                onClick={() => setShowMatchModal(false)}
                aria-label="Close"
                className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-black/20 text-black/55 hover:border-black/40 hover:text-black"
              >
                <X className="size-5" />
              </button>
              <Image
                src={matchImage}
                alt="You're a match illustration"
                className="h-40 w-auto object-contain"
              />
            </div>

            <div className="p-8">
            <span className="text-[10px] tracking-[0.15em] font-extrabold text-neutral-400 uppercase block">
              Co-living Connection
            </span>
            <h2 className="font-bricolage text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              You&apos;re a Match!
            </h2>
            <p className="mt-3.5 text-sm leading-relaxed text-neutral-600">
              You and {modalFlatmate.firstName} are both interested in exploring living together.
            </p>

            {/* Context Details Card */}
            <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-100 p-5 space-y-4">
              {modalFlatmate.situation === "looking" && userSituation === "looking" ? (
                <>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-450 block">
                      Preferred Areas Overlap
                    </span>
                    <span className="text-sm font-semibold text-neutral-800 mt-1 block">
                      {userAreas.filter(a => modalFlatmate.areas.includes(a)).join(" · ") || `${userAreas[0] || "Kacyiru"} · ${modalFlatmate.areas[0] || "Kimihurura"}`}
                    </span>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-450 block">
                      Potential Combined Budget
                    </span>
                    <span className="font-bricolage text-xl font-extrabold text-black mt-1 block">
                      {formatRwf(userBudget + modalFlatmate.budgetMax)} / month
                    </span>
                    <span className="text-[10px] text-neutral-400 font-normal block mt-0.5">
                      Combined discovery estimate (RWF {userBudget.toLocaleString()} + RWF {modalFlatmate.budgetMax.toLocaleString()})
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-450 block">
                      Living Arrangement Area
                    </span>
                    <span className="text-sm font-semibold text-neutral-800 mt-1 block">
                      {modalFlatmate.areas[0] || modalFlatmate.city}
                    </span>
                  </div>
                  <div className="border-t border-neutral-100 pt-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-450 block">
                      Expected Monthly Share
                    </span>
                    <span className="font-bricolage text-xl font-extrabold text-black mt-1 block">
                      {formatRwf(modalFlatmate.budgetMin)} / month
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col gap-3">
              <Link
                href={`/renter-dashboard/messages?chat=${modalFlatmate.id}`}
                onClick={() => setShowMatchModal(false)}
                className="flex h-12 items-center justify-center rounded-full bg-black font-semibold text-white hover:bg-neutral-800 active:scale-95 transition-all shadow-md"
              >
                Start Chat
              </Link>
              {modalFlatmate.situation === "looking" && userSituation === "looking" ? (
                <Link
                  href={`/flatmates?from=renter&view=all&budget=450-600&location=${modalFlatmate.areas[0] || ""}`}
                  onClick={() => setShowMatchModal(false)}
                  className="flex h-12 items-center justify-center rounded-full border border-black/15 bg-white font-semibold text-black hover:bg-neutral-50 active:scale-95 transition-all"
                >
                  Browse Homes Together
                </Link>
              ) : (
                <button
                  onClick={() => setShowMatchModal(false)}
                  className="flex h-12 items-center justify-center rounded-full border border-black/15 bg-white font-semibold text-black hover:bg-neutral-50 active:scale-95 transition-all"
                >
                  Close
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-transparent border-none">
      <div className="relative w-44 h-44 mb-4">
        <Image
          src={emptyImage}
          alt="No results found"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="font-bricolage text-xl font-bold text-neutral-850">
        {title}
      </h3>
      <p className="text-neutral-500 mt-2 text-sm max-w-[40ch] leading-relaxed">
        {description}
      </p>
      <Link
        href="/flatmates?from=renter"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-black px-5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-sm"
      >
        Browse Flatmates
      </Link>
    </div>
  );
}

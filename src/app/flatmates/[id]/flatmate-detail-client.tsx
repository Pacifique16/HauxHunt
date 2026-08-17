"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Briefcase, MapPin, BadgeCheck, Home } from "lucide-react";
import { FlatmateAuthAction } from "@/components/flatmates/flatmate-auth-action";
import { FlatmatePhotoStatus } from "@/components/flatmates/flatmate-photo-status";
import { FlatmatePortrait } from "@/components/flatmates/flatmate-portrait";
import { FlatmatesNavigation } from "@/components/flatmates/flatmates-navigation";
import { Footer } from "@/components/layout/footer";
import { formatRwf, type PublicFlatmate } from "@/data/public-flatmates";
import { DEMO_LISTINGS } from "@/data/hero-search-demo";

export function FlatmateDetailClient({
  initialFlatmate,
  id,
  renterView,
}: {
  initialFlatmate: PublicFlatmate;
  id: string;
  renterView: boolean;
}) {
  const [flatmate, setFlatmate] = useState<PublicFlatmate>(initialFlatmate);

  useEffect(() => {
    if (id === "julien") {
      const saved = window.sessionStorage.getItem("hauxhunt-flatmate-profile-data");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setFlatmate({
            id: "julien",
            firstName: data.firstName || initialFlatmate.firstName,
            age: Number(data.age) || initialFlatmate.age,
            gender: data.gender || initialFlatmate.gender,
            occupation: data.occupation || initialFlatmate.occupation,
            city: data.city || initialFlatmate.city,
            country: data.country || initialFlatmate.country,
            situation: data.situation || initialFlatmate.situation,
            portrait: data.profileImage || initialFlatmate.portrait,
            budgetMin: Number(data.budget) || initialFlatmate.budgetMin,
            budgetMax: Number(data.budget) || initialFlatmate.budgetMax,
            moveIn: data.moveIn || initialFlatmate.moveIn,
            moveInValue: initialFlatmate.moveInValue,
            areas: data.areas || initialFlatmate.areas,
            lifestyleTags: data.lifestyleTags || initialFlatmate.lifestyleTags,
            smoking: data.lifestyleTags?.includes("Non-smoker") ? "non-smoker" : "outdoor-only",
            lifestyle: initialFlatmate.lifestyle,
            about: data.about || initialFlatmate.about,
            preferredProperty: data.preferredProperty || initialFlatmate.preferredProperty,
            furnishing: data.furnishing || initialFlatmate.furnishing,
            stay: data.stay || initialFlatmate.stay,
            lifestyleDetails: [
              ["Cleanliness", data.cleanliness || "Very tidy"],
              ["Smoking", data.lifestyleTags?.includes("Non-smoker") ? "Non-smoker" : "Outdoor only"],
              ["Pets", data.pets || "Okay with cats"],
              ["Social style", data.socialStyle || "Quiet weekdays, social weekends"],
              ["Sleep schedule", data.sleepSchedule || "Early sleeper"],
              ["Work / study", data.occupation || "Product Designer"],
              ["Guests", data.guests || "Occasional visitors"],
            ],
            lookingFor: data.lookingFor || initialFlatmate.lookingFor,
            selectedRentalId: data.selectedRentalId || initialFlatmate.selectedRentalId,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [id, initialFlatmate]);

  const looking = flatmate.situation === "looking";

  return (
    <>
      <FlatmatesNavigation initialRenterView={renterView} />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="px-5 pt-8 pb-14 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1280px]">
            <Link
              href={renterView ? "/flatmates?from=renter" : "/flatmates"}
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-black/65 transition-colors hover:text-black font-semibold"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Back to Flatmates
            </Link>

            <header className="grid overflow-hidden rounded-3xl bg-white border border-black/5 shadow-[0_14px_45px_rgba(0,0,0,0.06)] lg:grid-cols-[280px_1fr]">
              <div className="h-[280px] lg:h-full lg:min-h-[380px]">
                <FlatmatePortrait
                  src={flatmate.portrait}
                  name={flatmate.firstName}
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                
                <h1 className="font-bricolage mt-5 text-4xl font-medium tracking-[-0.04em] sm:text-5xl flex items-center gap-2">
                  <span>{flatmate.firstName}, {flatmate.age}</span>
                  <BadgeCheck className="size-8 text-[#242424] fill-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.06)]" />
                </h1>

                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-6 text-sm text-carbon-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="size-4 text-carbon-450 shrink-0" />
                    {flatmate.occupation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-carbon-450 shrink-0" />
                    {flatmate.city}, {flatmate.country}
                  </span>
                </div>

                {/* Sub Tags highlight */}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {flatmate.lifestyleTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/5 bg-black/[0.04] px-2.5 py-0.5 text-xs font-medium text-black/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-6 text-neutral-600 text-sm leading-relaxed max-w-xl italic">
                  “{flatmate.about}”
                </p>

                <FlatmateAuthAction
                  label="Express Interest"
                  returnTo={`/flatmates/${flatmate.id}${renterView ? "?from=renter" : ""}`}
                  className="font-bricolage mt-7 h-12 w-fit rounded-full bg-black px-7 font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg active:scale-95"
                />
              </div>
            </header>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                {looking ? (
                  <ProfileSection title="Housing Plans">
                    <dl className="grid gap-5 sm:grid-cols-2">
                      <Detail
                        label="Preferred areas"
                        value={flatmate.areas.join(" · ") || "None specified"}
                        wide
                      />
                      <Detail
                        label="Personal monthly budget contribution"
                        value={formatRwf(flatmate.budgetMin)}
                      />
                      <Detail label="Move-in" value={flatmate.moveIn} />
                      <Detail
                        label="Preferred property"
                        value={flatmate.preferredProperty}
                      />
                      <Detail label="Furnishing" value={flatmate.furnishing} />
                      <Detail label="Stay" value={flatmate.stay} />
                    </dl>
                    <p className="text-carbon-500 mt-6 border-t border-black/10 pt-5 text-xs leading-5">
                      This is {flatmate.firstName}&apos;s personal budget
                      contribution, not the total rent for a property.
                    </p>
                  </ProfileSection>
                ) : flatmate.selectedRentalId ? (
                  (() => {
                    const selectedRental = DEMO_LISTINGS.find(item => item.id === flatmate.selectedRentalId);
                    if (!selectedRental) return null;
                    return (
                      <ProfileSection title="Current Living Arrangement">
                        <p className="text-carbon-600 mb-6 leading-7">
                          {flatmate.firstName} currently has accommodation at <span className="font-semibold text-black">{selectedRental.title}</span> in {selectedRental.location}.
                        </p>
                        
                        {/* Interactive Property Preview Card */}
                        <div className="group relative overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-white to-neutral-50/50 p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-black/15 flex flex-col md:flex-row md:items-center gap-5">
                          
                          {/* Mock Photo block */}
                          <div className="relative w-full md:w-32 aspect-[4/3] md:h-24 rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-center overflow-hidden shrink-0 border border-black/5 shadow-inner">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                            <Home className="size-8 text-white/40 group-hover:scale-110 transition-transform duration-300" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] px-2.5 py-0.5 text-[9px] font-bold text-[#2E7D32] uppercase tracking-wider leading-none">
                                Active Rental
                              </span>
                            </div>
                            <h4 className="font-bricolage text-lg font-bold text-black/85 mt-2 tracking-tight">
                              {selectedRental.title}
                            </h4>
                            <p className="text-xs text-carbon-500 mt-1 flex items-center gap-1">
                              <MapPin className="size-3 text-carbon-400 shrink-0" />
                              <span>{selectedRental.location}</span>
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-medium text-black/75">
                                {selectedRental.bedrooms} Bedrooms
                              </span>
                              {selectedRental.amenities.slice(0, 3).map((a) => (
                                <span key={a} className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] text-black/75">
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Share details and explore button */}
                          <div className="flex flex-col items-start md:items-end gap-3.5 shrink-0 border-t md:border-t-0 md:border-l border-black/5 pt-4 md:pt-0 md:pl-5">
                            <div className="text-left md:text-right">
                              <span className="text-[9px] text-carbon-450 block uppercase font-bold tracking-wider">
                                Expected share
                              </span>
                              <span className="font-bricolage text-2xl font-black text-black leading-none">
                                {selectedRental.currency} {selectedRental.price}
                              </span>
                              <span className="text-[10px] text-carbon-400 font-normal"> / month</span>
                            </div>

                            <Link
                              href={`/properties/${selectedRental.id}`}
                              className="inline-flex items-center justify-center rounded-full bg-black text-white px-5 py-2.5 text-xs font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-sm"
                            >
                              Explore Property
                            </Link>
                          </div>
                        </div>
                      </ProfileSection>
                    );
                  })()
                ) : !looking && flatmate.livingArrangement ? (
                  <ProfileSection title="Current Living Arrangement">
                    <p className="text-carbon-600 mb-6 leading-7">
                      {flatmate.firstName} currently has accommodation in{" "}
                      {flatmate.livingArrangement.area}.
                    </p>
                    <dl className="grid gap-5 sm:grid-cols-2">
                      <Detail
                        label="Looking for"
                        value={`${flatmate.livingArrangement.flatmatesWanted} flatmate`}
                      />
                      <Detail
                        label="Expected contribution"
                        value={`Around ${formatRwf(flatmate.livingArrangement.contribution)} / month`}
                      />
                      <Detail
                        label="Available from"
                        value={flatmate.livingArrangement.availableFrom}
                      />
                      <Detail
                        label="Room arrangement"
                        value={flatmate.livingArrangement.room}
                      />
                      <Detail
                        label="Shared spaces"
                        value={flatmate.livingArrangement.sharedSpaces.join(
                          " · ",
                        )}
                      />
                      <Detail
                        label="Current household"
                        value={`${flatmate.livingArrangement.householdSize} person`}
                      />
                      <Detail
                        label="Furnishing"
                        value={flatmate.livingArrangement.furnishing}
                      />
                      <Detail
                        label="Household style"
                        value={flatmate.livingArrangement.householdStyle.join(
                          " · ",
                        )}
                        wide
                      />
                    </dl>
                    <p className="text-carbon-500 mt-6 border-t border-black/10 pt-5 text-xs leading-5">
                      Living arrangement details are provided by this member and
                      do not represent a HauxHunt property listing.
                    </p>
                  </ProfileSection>
                ) : null}

                <ProfileSection title="Lifestyle">
                  <dl className="grid gap-5 sm:grid-cols-2">
                    {flatmate.lifestyleDetails.map(([label, value]) => (
                      <Detail key={label} label={label} value={value} />
                    ))}
                  </dl>
                </ProfileSection>
              </div>

              <aside className="space-y-6">
                <ProfileSection title="What I'm Looking For">
                  <ul className="space-y-4">
                    {flatmate.lookingFor.map((item) => (
                      <li key={item} className="flex items-start gap-3.5 text-sm leading-relaxed text-black/75">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          <Check className="size-3 stroke-[2.5]" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </ProfileSection>
                
                <section className="rounded-3xl bg-neutral-950 p-7 text-white sm:p-8 border border-neutral-800 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 size-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
                  <h2 className="font-bricolage text-2xl font-semibold tracking-tight relative z-10">
                    Connect when you&apos;re ready
                  </h2>
                  <p className="mt-3.5 text-sm leading-6 text-neutral-400 relative z-10">
                    Sign in to view clear photos, express interest, and connect
                    if the interest is mutual.
                  </p>
                  <FlatmateAuthAction
                    label="Express Interest"
                    returnTo={`/flatmates/${flatmate.id}`}
                    className="font-bricolage mt-6 h-11 w-full rounded-full bg-white px-6 font-semibold text-black hover:bg-neutral-100 transition-all active:scale-95 relative z-10 shadow-md"
                  />
                </section>
              </aside>
            </div>
          </div>
        </section>
      </main>
      {renterView ? null : <Footer />}
    </>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
      <h2 className="font-bricolage mb-6 text-2xl font-semibold tracking-tight text-black/85">{title}</h2>
      {children}
    </section>
  );
}

function Detail({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`p-4 rounded-2xl bg-black/[0.02] border border-black/[0.03] transition-all hover:bg-black/[0.03] ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="text-carbon-500 text-[11px] font-bold uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-black/85 leading-relaxed">{value}</dd>
    </div>
  );
}

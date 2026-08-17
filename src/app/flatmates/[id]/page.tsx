import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronLeft, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";

import { FlatmateAuthAction } from "@/components/flatmates/flatmate-auth-action";
import { FlatmatePhotoStatus } from "@/components/flatmates/flatmate-photo-status";
import { FlatmatePortrait } from "@/components/flatmates/flatmate-portrait";
import { FlatmatesNavigation } from "@/components/flatmates/flatmates-navigation";
import { Footer } from "@/components/layout/footer";
import {
  formatRwf,
  getPublicFlatmate,
  PUBLIC_FLATMATES,
} from "@/data/public-flatmates";

export function generateStaticParams() {
  return PUBLIC_FLATMATES.map(({ id }) => ({ id }));
}

type FlatmateProfileProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const flatmate = getPublicFlatmate(id);
  return flatmate
    ? {
        title: `${flatmate.firstName}'s flatmate profile | HauxHunt`,
        description: `View ${flatmate.firstName}'s public housing preferences and flatmate profile.`,
      }
    : { title: "Flatmate profile | HauxHunt" };
}

export default async function PublicFlatmateProfile({
  params,
  searchParams,
}: FlatmateProfileProps) {
  const { id } = await params;
  const renterView = (await searchParams).from === "renter";
  const flatmate = getPublicFlatmate(id);
  if (!flatmate) notFound();
  const looking = flatmate.situation === "looking";

  return (
    <>
      <FlatmatesNavigation initialRenterView={renterView} />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="px-5 pt-8 pb-14 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1280px]">
            <Link
              href={renterView ? "/flatmates?from=renter" : "/flatmates"}
              className="mb-6 inline-flex items-center gap-1 text-sm text-black/65 transition-colors hover:text-black"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Back to Flatmates
            </Link>

            <header className="grid overflow-hidden rounded-3xl bg-white shadow-[0_14px_45px_rgba(0,0,0,0.07)] lg:grid-cols-[390px_1fr]">
              <div className="h-[430px] lg:h-full lg:min-h-[500px]">
                <FlatmatePortrait
                  src={flatmate.portrait}
                  name={flatmate.firstName}
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${looking ? "bg-black text-white" : "bg-black/[0.07]"}`}
                >
                  {looking ? "Looking for a place" : "Already has a place"}
                </span>
                <h1 className="font-bricolage mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
                  {flatmate.firstName}, {flatmate.age}
                </h1>
                <p className="mt-3 text-lg">{flatmate.occupation}</p>
                <p className="text-carbon-500 mt-1">
                  {flatmate.city}, {flatmate.country}
                </p>
                <FlatmatePhotoStatus
                  firstName={flatmate.firstName}
                  initialRenterView={renterView}
                />
                <FlatmateAuthAction
                  label="I'm Interested"
                  returnTo={`/flatmates/${flatmate.id}${renterView ? "?from=renter" : ""}`}
                  className="font-bricolage mt-7 h-12 w-fit rounded-full bg-black px-7 font-medium text-white"
                />
              </div>
            </header>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <ProfileSection title="About Me">
                  <p className="text-carbon-600 leading-7">
                    “{flatmate.about}”
                  </p>
                </ProfileSection>

                {looking ? (
                  <ProfileSection title="Housing Plans">
                    <dl className="grid gap-5 sm:grid-cols-2">
                      <Detail
                        label="Preferred areas"
                        value={flatmate.areas.join(" · ")}
                        wide
                      />
                      <Detail
                        label="Personal monthly budget contribution"
                        value={`${formatRwf(flatmate.budgetMin)} – ${formatRwf(flatmate.budgetMax)}`}
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
                ) : flatmate.livingArrangement ? (
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
                  <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
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
                      <li key={item} className="flex gap-3 text-sm leading-6">
                        <Check
                          aria-hidden="true"
                          className="mt-1 size-4 shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </ProfileSection>
                <section className="rounded-3xl bg-black p-7 text-white sm:p-8">
                  <h2 className="font-bricolage text-2xl font-medium">
                    Connect when you&apos;re ready
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Sign in to view clear photos, express interest, and connect
                    if the interest is mutual.
                  </p>
                  <FlatmateAuthAction
                    label="I'm Interested"
                    returnTo={`/flatmates/${flatmate.id}`}
                    className="font-bricolage mt-6 h-11 rounded-full bg-white px-6 font-medium text-black"
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
    <section className="rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
      <h2 className="font-bricolage mb-6 text-2xl font-medium">{title}</h2>
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
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-carbon-500 text-xs">{label}</dt>
      <dd className="mt-1.5 leading-6 font-medium">{value}</dd>
    </div>
  );
}

"use client";

import Image from "next/image";

import type { FlatmateProfile } from "@/types";
import type { MockListing } from "@/data/hero-search-demo";
import { useFlatmateConnections } from "@/lib/flatmate-connections";
import { FlatmateFeedCard } from "@/components/flatmates/flatmate-feed-card";
import emptyIllustration from "../../../empty.png";

export type FlatmateFeedItem = {
  profile: FlatmateProfile;
  listing?: MockListing;
};

/**
 * Grid of the community feed's people cards. A client component (like
 * `ApartmentInterestedSection`) purely so it can read the shared
 * locked/pending/accepted state from `useFlatmateConnections` — filtering
 * itself stays server-side in the page.
 */
export function FlatmateFeedGrid({ items }: { items: FlatmateFeedItem[] }) {
  const { getState, isSaved } = useFlatmateConnections();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Image
          src={emptyIllustration}
          alt="No flatmates found"
          className="h-36 w-auto object-contain"
        />
        <h3 className="font-bricolage mt-5 text-2xl font-medium">
          No one matches these filters yet
        </h3>
        <p className="text-carbon-500 mt-2 text-sm">
          Try another location, interest, or lifestyle preference.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ profile, listing }) => (
        <FlatmateFeedCard
          key={profile.id}
          profile={profile}
          listing={listing}
          state={getState(profile.id)}
          saved={isSaved(profile.id)}
        />
      ))}
    </div>
  );
}

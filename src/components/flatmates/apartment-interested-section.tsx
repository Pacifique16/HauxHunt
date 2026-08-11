"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { FlatmateProfile } from "@/types";
import { useFlatmateConnections } from "@/lib/flatmate-connections";
import { FlatmateInterestTile } from "@/components/flatmates/flatmate-interest-tile";

export type ApartmentInterestedSectionProps = {
  listingId: string;
  profiles: FlatmateProfile[];
};

/**
 * "People interested in this apartment" — the FlatMat layer added to the
 * existing property detail page (src/Flatmate.md §10). The listing itself
 * stays the source of truth; this is additive, not a replacement section.
 */
export function ApartmentInterestedSection({ listingId, profiles }: ApartmentInterestedSectionProps) {
  const { getState } = useFlatmateConnections();

  if (profiles.length === 0) return null;

  return (
    <section aria-labelledby="flatmates-title" className="border-t border-black/10 py-9">
      <div className="flex items-center justify-between gap-4">
        <h2 id="flatmates-title" className="font-bricolage text-carbon-900 text-2xl font-medium">
          People interested in this apartment
        </h2>
        <Link
          href={`/properties/${listingId}/flatmates`}
          className="text-carbon-600 hover:text-carbon-900 inline-flex shrink-0 items-center gap-1.5 text-sm font-medium"
        >
          See all
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <p className="text-carbon-500 mt-2 max-w-[60ch] text-sm">
        Other renters looking at this listing who might be a good flatmate. Identities
        stay hidden until you both agree to connect.
      </p>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {profiles.map((profile) => (
          <FlatmateInterestTile
            key={profile.id}
            profile={profile}
            state={getState(profile.id)}
            href={`/properties/${listingId}/flatmates?focus=${encodeURIComponent(profile.id)}`}
          />
        ))}
      </div>
    </section>
  );
}

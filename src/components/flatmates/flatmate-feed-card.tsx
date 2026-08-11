import Link from "next/link";
import { Home } from "lucide-react";

import type { ConnectionState, FlatmateProfile } from "@/types";
import type { MockListing } from "@/data/hero-search-demo";
import { PrivacyAwareProfile } from "@/components/flatmates/flatmate-profile";

export type FlatmateFeedCardProps = {
  profile: FlatmateProfile;
  state: ConnectionState;
  saved: boolean;
  /** The listing this person is interested in — shown as context, not the subject of the card. */
  listing?: MockListing;
};

/**
 * A single post in the community discovery feed (top-level `/flatmates`).
 * The apartment is a context chip on top of the same `PrivacyAwareProfile`
 * every other FlatMat surface renders — the person, not the listing, is
 * what the card is about.
 */
export function FlatmateFeedCard({ profile, state, saved, listing }: FlatmateFeedCardProps) {
  return (
    <article className="border-border-default flex flex-col gap-4 rounded-3xl border bg-white p-6 transition-colors hover:border-black/20">
      {listing ? (
        <Link
          href={`/properties/${listing.id}`}
          className="text-carbon-500 hover:text-carbon-900 -mt-1 inline-flex w-fit items-center gap-1.5 self-start rounded-full bg-black/[0.045] px-3 py-1.5 text-xs font-medium transition-colors"
        >
          <Home aria-hidden="true" className="size-3.5 shrink-0" />
          Interested in {listing.title} · {listing.location}
        </Link>
      ) : null}

      <PrivacyAwareProfile
        profile={profile}
        state={state}
        saved={saved}
        avatarSize="lg"
        chatHref="/renter-dashboard/messages"
      />
    </article>
  );
}

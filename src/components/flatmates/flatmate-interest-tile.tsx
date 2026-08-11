import Link from "next/link";

import type { ConnectionState, FlatmateProfile } from "@/types";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { InterestTag } from "@/components/flatmates/interest-tag";
import { LockedProfileBadge } from "@/components/flatmates/locked-profile-badge";
import { PrivacyAwareAvatar } from "@/components/flatmates/privacy-aware-avatar";

export type FlatmateInterestTileProps = {
  profile: FlatmateProfile;
  state: ConnectionState;
  href: string;
};

/**
 * Compact tile for the apartment detail page's "People interested in this
 * apartment" horizontal scroll (src/Flatmate.md §10).
 */
export function FlatmateInterestTile({ profile, state, href }: FlatmateInterestTileProps) {
  const locked = state !== "accepted";
  const displayName = locked ? profile.anonymizedName : profile.realName;

  return (
    <Link
      href={href}
      className="border-border-default flex w-[190px] shrink-0 flex-col gap-3 rounded-2xl border bg-white p-4 transition-colors hover:bg-black/[0.02]"
    >
      <PrivacyAwareAvatar
        locked={locked}
        realName={profile.realName}
        realAvatarSrc={profile.realAvatarSrc}
        size="lg"
      />
      <div>
        <p className="font-bricolage truncate text-sm font-medium">{displayName}</p>
        {locked ? (
          <LockedProfileBadge className="mt-1.5" />
        ) : profile.isVerified ? (
          <VerifiedBadge className="mt-1.5 py-0.5" />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-1">
        {profile.interests.slice(0, 2).map((interest) => (
          <InterestTag key={interest} label={interest} />
        ))}
      </div>
    </Link>
  );
}

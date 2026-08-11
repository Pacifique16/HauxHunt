import type { ConnectionState, FlatmateProfile } from "@/types";
import { cn } from "@/lib/utils";
import type { AvatarProps } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ConnectionButton } from "@/components/flatmates/connection-button";
import { InterestTag } from "@/components/flatmates/interest-tag";
import { LockedProfileBadge } from "@/components/flatmates/locked-profile-badge";
import { PrivacyAwareAvatar } from "@/components/flatmates/privacy-aware-avatar";

export type PrivacyAwareProfileProps = {
  profile: FlatmateProfile;
  state: ConnectionState;
  saved: boolean;
  avatarSize?: AvatarProps["size"];
  onPass?: () => void;
  chatHref?: string;
  showBio?: boolean;
  showActions?: boolean;
  className?: string;
};

/**
 * The single profile component every FlatMat surface renders — discovery
 * cards, apartment tiles, the connections list, and the "How others see
 * me" preview all use this with a different `state`, not separate locked
 * and unlocked designs (src/Flatmate.md §7).
 */
export function PrivacyAwareProfile({
  profile,
  state,
  saved,
  avatarSize = "lg",
  onPass,
  chatHref,
  showBio = true,
  showActions = true,
  className,
}: PrivacyAwareProfileProps) {
  const locked = state !== "accepted";
  const displayName = locked ? profile.anonymizedName : profile.realName;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <PrivacyAwareAvatar
          locked={locked}
          realName={profile.realName}
          realAvatarSrc={profile.realAvatarSrc}
          size={avatarSize}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bricolage truncate text-base font-medium">{displayName}</p>
            {!locked && profile.isVerified ? <VerifiedBadge /> : null}
          </div>
          <p className="text-carbon-500 text-sm">{profile.age} years old</p>
        </div>
      </div>

      {locked ? <LockedProfileBadge /> : null}

      <div className="flex flex-wrap gap-1.5">
        {profile.interests.map((interest) => (
          <InterestTag key={interest} label={interest} />
        ))}
      </div>

      {showBio && !locked ? (
        <p className="text-carbon-600 text-sm leading-6">{profile.bio}</p>
      ) : null}

      <ul className="text-carbon-600 flex flex-col gap-1.5 text-sm">
        {profile.signals.map((signal) => (
          <li key={signal} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-black/40" />
            {signal}
          </li>
        ))}
      </ul>

      {showActions ? (
        <ConnectionButton
          flatmateId={profile.id}
          displayName={profile.anonymizedName}
          state={state}
          saved={saved}
          onPass={onPass}
          chatHref={chatHref}
        />
      ) : null}
    </div>
  );
}

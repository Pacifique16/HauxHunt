import { Lock } from "lucide-react";

import type { ConnectionState, FlatmateProfile } from "@/types";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { PrivacyAwareAvatar } from "@/components/flatmates/privacy-aware-avatar";

export type PrivacyAwareChatHeaderProps = {
  profile: FlatmateProfile;
  state: ConnectionState;
  online?: boolean;
};

/**
 * Extends the chat surface with FlatMat's privacy states (src/Flatmate.md
 * §12) — "Locked Chat · Pending Approval" before acceptance, real
 * name/photo/verified/online after.
 */
export function PrivacyAwareChatHeader({ profile, state, online }: PrivacyAwareChatHeaderProps) {
  const locked = state !== "accepted";
  const displayName = locked ? profile.anonymizedName : profile.realName;

  return (
    <div className="flex items-center gap-3">
      <PrivacyAwareAvatar
        locked={locked}
        realName={profile.realName}
        realAvatarSrc={profile.realAvatarSrc}
        size="md"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-bricolage truncate text-base font-medium">{displayName}</p>
          {!locked && profile.isVerified ? <VerifiedBadge className="py-0.5" /> : null}
        </div>
        <p className="text-carbon-500 flex items-center gap-1.5 text-xs">
          {locked ? (
            <>
              <Lock aria-hidden="true" className="size-3" /> Locked Chat · Pending Approval
            </>
          ) : online ? (
            <>
              <span aria-hidden="true" className="bg-lime-500 size-1.5 rounded-full" /> Online
            </>
          ) : (
            "Offline"
          )}
        </p>
      </div>
    </div>
  );
}

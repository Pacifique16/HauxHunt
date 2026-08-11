import { Lock, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, type AvatarProps } from "@/components/ui/avatar";

const LOCK_BADGE_SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-7",
};

const LOCK_ICON_SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-2.5",
  md: "size-3",
  lg: "size-3.5",
  xl: "size-4",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export type PrivacyAwareAvatarProps = {
  /** True until the connection for this profile is "accepted". */
  locked: boolean;
  realName: string;
  realAvatarSrc?: string;
  size?: AvatarProps["size"];
  className?: string;
};

/**
 * The one avatar component every FlatMat surface renders — locked shows a
 * generic silhouette with a lock badge, accepted shows the real photo (or
 * initials, when no photo asset exists). Never pass a real photo/name in
 * when `locked` is true (src/Flatmate.md §6).
 */
export function PrivacyAwareAvatar({
  locked,
  realName,
  realAvatarSrc,
  size = "md",
  className,
}: PrivacyAwareAvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <Avatar
        alt={locked ? "Locked profile" : realName}
        size={size}
        src={locked ? undefined : realAvatarSrc}
        fallback={
          locked ? (
            <UserRound aria-hidden="true" className="size-[55%] text-black/35" />
          ) : (
            getInitials(realName)
          )
        }
        className={locked ? "bg-black/[0.08]" : undefined}
      />
      {locked ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute -right-0.5 -bottom-0.5 flex items-center justify-center rounded-full bg-black text-white ring-2 ring-white",
            LOCK_BADGE_SIZE[size],
          )}
        >
          <Lock className={LOCK_ICON_SIZE[size]} />
        </span>
      ) : null}
    </span>
  );
}

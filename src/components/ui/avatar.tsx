import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
};

export type AvatarProps = {
  src?: string | StaticImageData;
  alt: string;
  size?: AvatarSize;
  /** Shown when there is no `src` — initials text, or an icon node. */
  fallback?: ReactNode;
  className?: string;
};

/**
 * Generic profile-photo avatar. Nothing like this existed before FlatMat —
 * every avatar in the app was a raw `next/image` tag hand-styled with
 * `rounded-full object-cover` at each call site. This is the shared base;
 * `PrivacyAwareAvatar` (src/components/flatmates) builds the locked/unlocked
 * behaviour on top of it.
 */
export function Avatar({ src, alt, size = "md", fallback, className }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/[0.06] font-medium text-black/60",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes="96px" className="object-cover" />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  );
}

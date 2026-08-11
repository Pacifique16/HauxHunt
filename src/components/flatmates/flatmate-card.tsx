"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";

import type { ConnectionState, FlatmateProfile } from "@/types";
import { cn } from "@/lib/utils";
import { toggleSavedFlatmate } from "@/lib/flatmate-connections";
import { PrivacyAwareProfile } from "@/components/flatmates/flatmate-profile";

const SWIPE_THRESHOLD = 120;

export type FlatmateCardProps = {
  profile: FlatmateProfile;
  state: ConnectionState;
  saved: boolean;
  onPass: () => void;
  className?: string;
};

/**
 * Discovery card — drag-to-swipe using framer-motion (the app's existing
 * motion library; no swipe/gesture library exists to reuse) plus the same
 * Pass/Save/Connect buttons for anyone who'd rather tap. Swipe left to
 * pass, right to save; sending a connection request stays an explicit
 * button tap, since it notifies another person and shouldn't happen from
 * an accidental drag.
 */
export function FlatmateCard({ profile, state, saved, onPass, className }: FlatmateCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const opacity = useTransform(x, [-220, -40, 0, 40, 220], [0.4, 1, 1, 1, 0.4]);

  function handleDragEnd(info: PanInfo) {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      onPass();
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      toggleSavedFlatmate(profile.id);
    }
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => handleDragEnd(info)}
      className={cn(
        "border-border-default touch-none rounded-3xl border bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <PrivacyAwareProfile
        profile={profile}
        state={state}
        saved={saved}
        onPass={onPass}
        avatarSize="xl"
      />
    </motion.div>
  );
}

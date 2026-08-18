"use client";

import { useMemo, useState } from "react";

import type { FlatmateProfile } from "@/types";
import { useFlatmateConnections } from "@/lib/flatmate-connections";
import { PrivacyAwareProfile } from "@/components/flatmates/flatmate-profile";

export type FlatmateDiscoveryDeckProps = {
  profiles: FlatmateProfile[];
  /** Bring this profile to the front of the deck (from the apartment tile). */
  focusId?: string;
};

/**
 * The Screen 1 discovery feed (src/Flatmate.md §9) — a small card stack for
 * one listing's interested flatmates. "Pass" only affects this local
 * browsing queue; Save/Connect write through to the shared connections
 * store so they're reflected everywhere else in the app.
 */
export function FlatmateDiscoveryDeck({ profiles, focusId }: FlatmateDiscoveryDeckProps) {
  const ordered = useMemo(() => {
    if (!focusId) return profiles;
    const focused = profiles.find((profile) => profile.id === focusId);
    if (!focused) return profiles;
    return [focused, ...profiles.filter((profile) => profile.id !== focusId)];
  }, [profiles, focusId]);

  const [queue, setQueue] = useState(() => ordered.map((profile) => profile.id));
  const { getState, isSaved } = useFlatmateConnections();

  function handlePass(id: string) {
    setQueue((current) => current.filter((queuedId) => queuedId !== id));
  }

  const visible = queue
    .map((id) => ordered.find((profile) => profile.id === id))
    .filter((profile): profile is FlatmateProfile => Boolean(profile))
    .slice(0, 3);

  if (visible.length === 0) {
    return (
      <div className="border-border-default flex flex-col items-center gap-2 rounded-3xl border bg-white p-12 text-center">
        <p className="font-bricolage text-carbon-900 text-lg font-medium">
          You&apos;ve seen everyone interested in this listing
        </p>
        <p className="text-carbon-500 text-sm">
          Check back later, or review who you&apos;ve saved or connected with in Messages.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto h-[600px] w-full max-w-sm">
      {visible
        .slice()
        .reverse()
        .map((profile, indexFromBack) => {
          const stackIndex = visible.length - 1 - indexFromBack; // 0 = front card
          const isTop = stackIndex === 0;
          return (
            <div
              key={profile.id}
              className="absolute inset-0 transition-transform duration-200"
              style={{
                zIndex: visible.length - stackIndex,
                transform: `translateY(${stackIndex * 10}px) scale(${1 - stackIndex * 0.03})`,
                pointerEvents: isTop ? "auto" : "none",
              }}
            >
              <div className="border-border-default h-full overflow-y-auto rounded-3xl border bg-white p-6 shadow-[0_14px_42px_rgba(0,0,0,0.13)]">
                <PrivacyAwareProfile
                  profile={profile}
                  state={getState(profile.id)}
                  saved={isSaved(profile.id)}
                  onPass={() => handlePass(profile.id)}
                  chatHref="/renter-dashboard/messages"
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}

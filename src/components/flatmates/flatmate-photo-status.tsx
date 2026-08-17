"use client";

import { Check, LockKeyhole } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function FlatmatePhotoStatus({
  firstName,
  initialRenterView = false,
}: {
  firstName: string;
  initialRenterView?: boolean;
}) {
  const role = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem("hauxhunt-authenticated-role"),
    () => (initialRenterView ? "renter" : null),
  );

  const isGuest = !initialRenterView && !role;

  if (isGuest) {
    return (
      <div className="mt-7 flex items-center gap-2 text-sm text-black/60">
        <LockKeyhole aria-hidden="true" className="size-4" />
        Sign in to view {firstName}&apos;s photo
      </div>
    );
  }

  return (
    <div className="mt-7 flex items-center gap-2 text-sm text-emerald-700 font-medium">
      <Check aria-hidden="true" className="size-4" />
      Verified profile photo unlocked
    </div>
  );
}

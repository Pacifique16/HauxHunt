"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { FlatmateAuthAction } from "./flatmate-auth-action";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function FlatmateBanner({
  initialRenterView = false,
}: {
  initialRenterView?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem("hauxhunt-authenticated-role"),
    () => (initialRenterView ? "renter" : null),
  );

  const hasProfile = useSyncExternalStore(
    subscribe,
    () =>
      window.sessionStorage.getItem("hauxhunt-has-flatmate-profile") === "true",
    () => false,
  );

  if (!mounted) {
    return null;
  }

  const isLoggedIn = role === "renter";
  if (isLoggedIn && hasProfile) {
    return null;
  }

  return (
    <section className="px-5 pb-14 sm:px-6 lg:px-11 lg:pb-20 xl:px-[52px]">
      <div className="listing-request-glass relative mx-auto flex max-w-[1562px] flex-col gap-7 overflow-hidden rounded-2xl p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
        <svg
          aria-hidden="true"
          viewBox="0 0 1400 280"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.12]"
        >
          <defs>
            <path
              id="flatmate-request-wave"
              d="M-100 35 C230 -55 410 30 625 155 S1010 310 1500 75"
            />
          </defs>
          <g fill="none" stroke="currentColor" strokeWidth="1">
            {Array.from({ length: 12 }, (_, index) => (
              <use
                key={`flatmate-wave-${index}`}
                href="#flatmate-request-wave"
                transform={`translate(0 ${index * 13})`}
              />
            ))}
          </g>
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/50"
        />

        <div className="relative z-10">
          <h2 className="font-bricolage text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-medium tracking-[-0.035em] text-white">
            Looking for someone to share rent with?
          </h2>
          <p className="text-body-m mt-3 max-w-[68ch] text-white/65">
            Create your Flatmate Profile and tell people what kind of living
            arrangement you&apos;re looking for.
          </p>
        </div>
        <FlatmateAuthAction
          label="Create Flatmate Profile"
          returnTo="/renter-dashboard/flatmates/profile"
          title="Sign in to create your profile"
          className="font-bricolage bg-carbon-0 text-carbon-900 hover:bg-carbon-100 relative z-10 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 font-medium text-black transition-colors duration-150"
        />
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import loginIllustration from "@/assets/images/login.png";
import { FlatmatePortrait } from "./flatmate-portrait";
import type { PublicFlatmate } from "@/data/public-flatmates";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function FlatmateCard({
  flatmate,
  priority,
  renterView = false,
}: {
  flatmate: PublicFlatmate;
  priority: boolean;
  renterView?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const role = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem("hauxhunt-authenticated-role"),
    () => (renterView ? "renter" : null),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = renterView || Boolean(role);
  const isLooking = flatmate.situation === "looking";
  const compactBudget = (value: number) =>
    `${Math.round(value / 1000).toLocaleString("en-US")}K`;

  const targetHref = `/flatmates/${flatmate.id}${isAuthenticated ? "?from=renter" : ""}`;
  const encodedReturnTo = encodeURIComponent(targetHref);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`flatmate-card-auth-${flatmate.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/35 p-5"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex h-48 items-center justify-center bg-black/[0.045] px-8 pt-3">
              <Image
                src={loginIllustration}
                alt=""
                className="h-full w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full border border-black/15 bg-white/80"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="p-7 sm:p-9">
              <h2
                id={`flatmate-card-auth-${flatmate.id}`}
                className="font-bricolage text-3xl leading-tight font-medium tracking-[-0.035em]"
              >
                Sign in to view {flatmate.firstName}&apos;s profile
              </h2>
              <p className="text-carbon-600 mt-3 text-sm leading-6">
                Create an account or log in to view full housing preferences,
                unblurred photos, and connect with flatmates.
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <Link
                  href={`/register?returnTo=${encodedReturnTo}`}
                  className="font-bricolage flex h-12 items-center justify-center rounded-full border border-black/20 px-5 font-medium"
                >
                  Create Account
                </Link>
                <Link
                  href={`/login?returnTo=${encodedReturnTo}`}
                  className="font-bricolage flex h-12 items-center justify-center rounded-full bg-black px-5 font-medium text-white"
                >
                  Log In
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <Link
        href={targetHref}
        onClick={handleClick}
        aria-label={`View ${flatmate.firstName}'s profile`}
        className="group block h-full cursor-pointer"
      >
        <article className="relative h-full min-h-[460px] overflow-hidden rounded-[2rem] bg-black shadow-[0_14px_42px_rgba(0,0,0,0.13)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_55px_rgba(0,0,0,0.18)]">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.025]">
            <FlatmatePortrait
              src={flatmate.portrait}
              name={flatmate.firstName}
              priority={priority}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
            <div className="min-w-0">
              <h3 className="font-bricolage flex items-center gap-1.5 text-xl leading-none font-medium tracking-[-0.03em]">
                <span>
                  {flatmate.firstName}, {flatmate.age}
                </span>
                <BadgeCheck
                  aria-label="Verified profile"
                  className="size-[18px] shrink-0 fill-white text-[#242424] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                />
              </h3>
              <p className="mt-0.5 truncate text-xs text-white/72">
                {flatmate.occupation} · {flatmate.city}
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="inline-flex rounded-full border border-white/25 bg-white/12 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                {isLooking ? "Looking for a place" : "Already has a place"}
              </span>
              <p className="flex shrink-0 items-baseline gap-1 text-sm font-medium">
                <span>
                  {isLooking
                    ? flatmate.budgetMin === flatmate.budgetMax
                      ? `RWF ${compactBudget(flatmate.budgetMin)}`
                      : `RWF ${compactBudget(flatmate.budgetMin)}–${compactBudget(flatmate.budgetMax)}`
                    : `~ RWF ${compactBudget(flatmate.budgetMin)}`}
                </span>
                <span className="text-[9px] font-normal text-white/60">
                  Per month
                </span>
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {flatmate.lifestyleTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] text-white/85 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </Link>

      {mounted && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}

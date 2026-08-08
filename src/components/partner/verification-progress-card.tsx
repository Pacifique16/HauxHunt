"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STEP_NAMES = [
  "Personal identity",
  "Partner information",
  "Contact and address",
  "Supporting documents",
  "Review and submit",
] as const;

export function VerificationProgressCard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<"in-progress" | "submitted">(
    "in-progress",
  );

  useEffect(() => {
    const syncProgress = () => {
      const savedStep = Number(
        window.localStorage.getItem("hauxhunt-partner-verification-step") ?? 1,
      );
      const safeStep = Math.min(Math.max(savedStep, 1), STEP_NAMES.length);
      const submittedFromUrl =
        new URLSearchParams(window.location.search).get("verification") ===
        "submitted";
      const submittedFromStorage =
        window.localStorage.getItem("hauxhunt-partner-verification-status") ===
        "submitted";

      if (submittedFromUrl) {
        window.localStorage.setItem(
          "hauxhunt-partner-verification-status",
          "submitted",
        );
      }
      setCurrentStep(safeStep);
      setStatus(
        submittedFromUrl || submittedFromStorage ? "submitted" : "in-progress",
      );
    };
    const timer = window.setTimeout(syncProgress, 0);
    window.addEventListener("pageshow", syncProgress);
    window.addEventListener("focus", syncProgress);
    window.addEventListener("storage", syncProgress);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", syncProgress);
      window.removeEventListener("focus", syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  const isSubmitted = status === "submitted";
  const visibleStep = isSubmitted ? STEP_NAMES.length : currentStep;
  const percentage = Math.round((visibleStep / STEP_NAMES.length) * 100);

  return (
    <section
      id="verification"
      className="verification-glass relative overflow-hidden rounded-[1.75rem] p-7 text-white"
    >
      <div className="relative z-10">
        <p className="text-xs font-medium tracking-[0.12em] text-white/50 uppercase">
          Partner verification
        </p>
        <h2 className="font-bricolage mt-3 text-3xl font-medium tracking-[-0.04em]">
          {isSubmitted
            ? "Verification under review"
            : currentStep >= 4
              ? "Almost verified"
              : "Verification in progress"}
        </h2>
        <p className="mt-4 text-sm leading-6 text-white/65">
          {isSubmitted
            ? "Your submission has been received. We will notify you when the review is complete or if more information is needed."
            : `Continue from ${STEP_NAMES[currentStep - 1].toLowerCase()} to complete your partner verification.`}
        </p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-white/45">
          <span>
            {visibleStep} of {STEP_NAMES.length} steps
          </span>
          <span>{percentage}%</span>
        </div>
        <Link
          href="/partner-dashboard/verification"
          className="font-bricolage mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/85"
        >
          {isSubmitted ? "View verification status" : "Continue verification"}
        </Link>
      </div>
    </section>
  );
}

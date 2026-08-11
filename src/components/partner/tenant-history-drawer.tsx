"use client";

import { useEffect, useState } from "react";
import { Star, UserRoundX } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { getTenantHistory } from "@/data/tenant-history-demo";

export type TenantHistoryDrawerProps = {
  open: boolean;
  onClose: () => void;
  applicantId: string;
  applicantName: string;
};

/**
 * The paid-tier "View Tenant History" view (Tenanthistory.md §4) — previous
 * stay duration, on-time payment reliability, and past landlord feedback.
 * There is no `GET /api/tenants/:id/history` yet, so this simulates the
 * fetch's loading state against the local demo dataset rather than
 * rendering the (already-available) data instantly.
 */
export function TenantHistoryDrawer({
  open,
  onClose,
  applicantId,
  applicantName,
}: TenantHistoryDrawerProps) {
  // Tracks the last applicant whose "fetch" finished, rather than a plain
  // loading flag reset inside the effect — avoids calling setState
  // synchronously in the effect body while still re-showing the loading
  // state whenever a different applicant's history is opened.
  const [loadedApplicantId, setLoadedApplicantId] = useState<string | null>(null);
  const loading = open && loadedApplicantId !== applicantId;

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setLoadedApplicantId(applicantId), 500);
    return () => window.clearTimeout(timer);
  }, [open, applicantId]);

  const history = getTenantHistory(applicantId);

  return (
    <Dialog open={open} onClose={onClose} labelledBy="tenant-history-title" className="max-w-xl">
      <div className="max-h-[80vh] overflow-y-auto p-7 sm:p-9">
        <p className="text-carbon-500 text-xs font-medium tracking-[0.1em] uppercase">
          Tenant history
        </p>
        <h2
          id="tenant-history-title"
          className="font-bricolage text-carbon-900 mt-2 text-2xl leading-tight font-medium tracking-[-0.03em]"
        >
          {applicantName}
        </h2>

        {loading ? (
          <div className="mt-7 flex flex-col gap-3" aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading tenant history…</span>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-black/[0.05]" />
              ))}
            </div>
            <div className="h-24 animate-pulse rounded-2xl bg-black/[0.05]" />
            <div className="h-24 animate-pulse rounded-2xl bg-black/[0.05]" />
          </div>
        ) : history ? (
          <div className="mt-7">
            <dl className="grid grid-cols-3 gap-3">
              <HistoryMetric
                label="Rental history"
                value={`${history.totalMonthsRented} mo.`}
                detail={`Across ${history.propertiesRented} ${history.propertiesRented === 1 ? "property" : "properties"}`}
              />
              <HistoryMetric
                label="On-time payments"
                value={`${history.onTimePaymentRate}%`}
              />
              <HistoryMetric
                label="Average rating"
                value={averageRating(history.stays).toFixed(1)}
                detail="out of 5"
              />
            </dl>

            <h3 className="font-bricolage text-carbon-900 mt-8 text-base font-medium">
              Previous landlord feedback
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {history.stays.map((stay) => (
                <li
                  key={`${stay.propertyTitle}-${stay.location}`}
                  className="border-border-default rounded-2xl border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bricolage text-sm font-medium">{stay.propertyTitle}</p>
                      <p className="text-carbon-500 text-xs">
                        {stay.location} · {stay.durationMonths} months
                      </p>
                    </div>
                    <StarRating rating={stay.landlordRating} />
                  </div>
                  <p className="text-carbon-600 mt-3 text-sm leading-6">
                    &ldquo;{stay.landlordComment}&rdquo;
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-7 flex flex-col items-center gap-2 rounded-2xl bg-black/[0.03] p-10 text-center">
            <UserRoundX aria-hidden="true" className="size-8 text-black/30" />
            <p className="font-bricolage text-carbon-900 mt-1 font-medium">
              No rental history yet
            </p>
            <p className="text-carbon-500 max-w-[36ch] text-sm">
              {applicantName} has no previous tenancies on record — likely a first-time
              renter. Consider requesting references directly.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}

function averageRating(stays: { landlordRating: number }[]): number {
  if (stays.length === 0) return 0;
  return stays.reduce((sum, stay) => sum + stay.landlordRating, 0) / stays.length;
}

function HistoryMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl bg-black/[0.035] p-3.5">
      <dt className="text-carbon-500 text-[0.68rem] leading-4">{label}</dt>
      <dd className="font-bricolage text-carbon-900 mt-1 text-lg font-medium tracking-[-0.02em]">
        {value}
      </dd>
      {detail ? <p className="text-carbon-400 mt-0.5 text-[0.68rem]">{detail}</p> : null}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`size-3.5 ${index < rating ? "fill-black text-black" : "text-black/15"}`}
        />
      ))}
    </div>
  );
}

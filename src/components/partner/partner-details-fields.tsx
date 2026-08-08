"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const PARTNER_TYPES = [
  "Individual landlord",
  "Broker",
  "Property manager",
  "Real estate agency",
] as const;

type PartnerType = (typeof PARTNER_TYPES)[number];

export function PartnerDetailsFields() {
  const [partnerType, setPartnerType] =
    useState<PartnerType>("Property manager");
  const [phoneCountry, setPhoneCountry] = useState("+250");
  const showsBusiness = partnerType !== "Individual landlord";
  const isCompany = partnerType === "Property manager";
  const businessRequired =
    partnerType === "Property manager" || partnerType === "Real estate agency";

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SettingsField
        label="Full name"
        name="fullName"
        defaultValue="Alex Partner"
      />
      <SettingsField
        label="Email address"
        name="email"
        type="email"
        defaultValue="partner@gmail.com"
      />
      <label>
        <span className="text-carbon-900 mb-2 block text-sm font-medium">
          Phone number
        </span>
        <div className="flex gap-2">
          <span className="relative block w-20 shrink-0">
            <select
              name="phoneCountry"
              value={phoneCountry}
              onChange={(event) => setPhoneCountry(event.target.value)}
              aria-label="Phone country code"
              className="h-12 w-full appearance-none rounded-xl border-0 bg-black/[0.035] pr-8 pl-3 text-sm ring-0 transition-colors outline-none focus:bg-black/[0.055] focus:ring-0"
            >
              <option value="+250">RW</option>
              <option value="+234">NG</option>
              <option value="+254">KE</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2"
            />
          </span>
          <div className="flex h-12 min-w-0 flex-1 items-center rounded-xl bg-black/[0.035] px-4 transition-colors focus-within:bg-black/[0.055]">
            <span className="text-carbon-600 mr-2 shrink-0 text-sm font-medium">
              {phoneCountry}
            </span>
            <input
              name="phone"
              type="tel"
              defaultValue="788 123 456"
              inputMode="tel"
              aria-label="Phone number"
              style={{ border: 0, boxShadow: "none", outline: "none" }}
              className="h-full min-w-0 flex-1 appearance-none rounded-none border-0 bg-transparent shadow-none ring-0 outline-none focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none focus-visible:outline-none"
            />
          </div>
        </div>
      </label>
      <label>
        <span className="text-carbon-900 mb-2 block text-sm font-medium">
          Partner type
        </span>
        <span className="relative block">
          <select
            name="partnerType"
            value={partnerType}
            onChange={(event) =>
              setPartnerType(event.target.value as PartnerType)
            }
            className="h-12 w-full appearance-none rounded-xl border-0 bg-black/[0.035] pr-11 pl-4 ring-0 transition-colors outline-none focus:bg-black/[0.055] focus:ring-0"
          >
            {PARTNER_TYPES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
          />
        </span>
      </label>

      {showsBusiness ? (
        <SettingsField
          key={partnerType}
          label={`${isCompany ? "Company" : "Agency"} name${businessRequired ? "" : " (optional)"}`}
          name="company"
          defaultValue={isCompany ? "Kigali Homes Ltd." : ""}
          required={businessRequired}
          className="sm:col-span-2"
        />
      ) : null}
    </div>
  );
}

function SettingsField({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={className}>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <input
        {...props}
        className="h-12 w-full rounded-xl border-0 bg-black/[0.035] px-4 ring-0 transition-colors outline-none focus:bg-black/[0.055] focus:ring-0"
      />
    </label>
  );
}

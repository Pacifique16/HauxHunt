"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  setPartnerRole,
  usePartnerRole,
} from "@/components/partner/use-partner-role";

const PARTNER_TYPES = ["Property manager", "Agent"] as const;
const WORK_ARRANGEMENTS = ["Independent", "Agency"] as const;

type PartnerType = (typeof PARTNER_TYPES)[number];

export function PartnerDetailsFields() {
  const savedRole = usePartnerRole();
  const partnerType: PartnerType =
    savedRole === "agent" ? "Agent" : "Property manager";
  const [workArrangement, setWorkArrangement] = useState("Independent");
  const [phoneCountry, setPhoneCountry] = useState("+250");

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
            onChange={(event) => {
              const nextType = event.target.value as PartnerType;
              setPartnerRole(
                nextType === "Agent" ? "agent" : "property_manager",
              );
            }}
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
      <label>
        <span className="text-carbon-900 mb-2 block text-sm font-medium">
          Work arrangement
        </span>
        <span className="relative block">
          <select
            name="workArrangement"
            value={workArrangement}
            onChange={(event) => setWorkArrangement(event.target.value)}
            className="h-12 w-full appearance-none rounded-xl border-0 bg-black/[0.035] pr-11 pl-4 ring-0 outline-none focus:bg-black/[0.055] focus:ring-0"
          >
            {WORK_ARRANGEMENTS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
        </span>
      </label>
      {partnerType === "Property manager" ? (
        <label>
          <span className="text-carbon-900 mb-2 block text-sm font-medium">
            Property relationship
          </span>
          <span className="relative block">
            <select
              name="propertyRelationship"
              className="h-12 w-full appearance-none rounded-xl border-0 bg-black/[0.035] pr-11 pl-4 ring-0 outline-none focus:bg-black/[0.055] focus:ring-0"
            >
              <option>I own the properties I manage</option>
              <option>I manage properties for owners</option>
              <option>Both</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
          </span>
        </label>
      ) : null}
      {workArrangement === "Agency" ? (
        <SettingsField
          label="Agency name"
          name="agencyName"
          required
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

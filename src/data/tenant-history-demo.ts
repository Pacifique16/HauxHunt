import type { TenantHistoryRecord } from "@/types";

/**
 * Tenant history demo data for `TenantHistoryDrawer` (Tenanthistory.md §4).
 * Keyed by `applicantId` (matches `TENANT_APPLICATIONS`). Applicants not in
 * this map are first-time renters with no rental record — the drawer shows
 * an empty state for them rather than a zeroed-out one.
 */
const TENANT_HISTORY_BY_APPLICANT: Record<string, TenantHistoryRecord> = {
  "aline-mukamana": {
    applicantId: "aline-mukamana",
    applicantName: "Aline Mukamana",
    totalMonthsRented: 24,
    propertiesRented: 2,
    onTimePaymentRate: 96,
    stays: [
      {
        propertyTitle: "Sunset Court Apartments",
        location: "Nyamirambo, Kigali",
        durationMonths: 14,
        landlordRating: 5,
        landlordComment:
          "Always paid on time and kept the apartment spotless. Would rent to her again without hesitation.",
      },
      {
        propertyTitle: "Kimisagara Residences",
        location: "Kimisagara, Kigali",
        durationMonths: 10,
        landlordRating: 4,
        landlordComment:
          "Reliable tenant. One late payment during the whole stay, but she always let us know in advance.",
      },
    ],
  },
  "grace-wanjiru": {
    applicantId: "grace-wanjiru",
    applicantName: "Grace Wanjiru",
    totalMonthsRented: 36,
    propertiesRented: 1,
    onTimePaymentRate: 100,
    stays: [
      {
        propertyTitle: "Kilimani Heights",
        location: "Kilimani, Nairobi",
        durationMonths: 36,
        landlordRating: 5,
        landlordComment:
          "Three years, never a single late payment. Left the unit in better condition than she found it.",
      },
    ],
  },
  "diane-uwase": {
    applicantId: "diane-uwase",
    applicantName: "Diane Uwase",
    totalMonthsRented: 18,
    propertiesRented: 2,
    onTimePaymentRate: 83,
    stays: [
      {
        propertyTitle: "Remera Court",
        location: "Remera, Kigali",
        durationMonths: 8,
        landlordRating: 3,
        landlordComment:
          "Payments were often a few days late, though rent was always paid in full eventually.",
      },
      {
        propertyTitle: "Kabeza Apartments",
        location: "Kabeza, Kigali",
        durationMonths: 10,
        landlordRating: 4,
        landlordComment: "Quiet, respectful tenant. No issues with the neighbours.",
      },
    ],
  },
  "kevin-otieno": {
    applicantId: "kevin-otieno",
    applicantName: "Kevin Otieno",
    totalMonthsRented: 30,
    propertiesRented: 2,
    onTimePaymentRate: 90,
    stays: [
      {
        propertyTitle: "Westlands Court",
        location: "Westlands, Nairobi",
        durationMonths: 20,
        landlordRating: 5,
        landlordComment:
          "Excellent tenant — remote worker who was home often and reported maintenance issues promptly.",
      },
      {
        propertyTitle: "Parklands Suites",
        location: "Parklands, Nairobi",
        durationMonths: 10,
        landlordRating: 4,
        landlordComment: "Good tenant overall, moved out early due to a job relocation.",
      },
    ],
  },
  "peter-nkurunziza": {
    applicantId: "peter-nkurunziza",
    applicantName: "Peter Nkurunziza",
    totalMonthsRented: 12,
    propertiesRented: 1,
    onTimePaymentRate: 75,
    stays: [
      {
        propertyTitle: "Kicukiro Residences",
        location: "Kicukiro, Kigali",
        durationMonths: 12,
        landlordRating: 3,
        landlordComment:
          "Rent was paid in full every month, but frequently a week or more after the due date.",
      },
    ],
  },
};

export function getTenantHistory(applicantId: string): TenantHistoryRecord | undefined {
  return TENANT_HISTORY_BY_APPLICANT[applicantId];
}

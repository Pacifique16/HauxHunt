import type { BillingSchedule, PayoutRecord } from "@/types";

/**
 * Finance page demo data (KPI.md) — same small local dataset, no network
 * call approach used across the app (hero-search-demo.ts, flatmates-demo.ts,
 * tenant-applications-demo.ts). Property titles reuse the
 * `PORTFOLIO_LISTINGS` strings from dashboard-route-page.tsx for narrative
 * consistency across the dashboard.
 */
export const PAYOUT_HISTORY: PayoutRecord[] = [
  {
    id: "payout-1",
    date: "08 Aug 2026",
    propertyTitle: "Modern 3-bedroom house",
    tenantName: "Aline Mukamana",
    amount: "USD 830",
    status: "paid",
  },
  {
    id: "payout-2",
    date: "05 Aug 2026",
    propertyTitle: "Bright two-bedroom apartment",
    tenantName: "Grace Wanjiru",
    amount: "USD 720",
    status: "paid",
  },
  {
    id: "payout-3",
    date: "01 Aug 2026",
    propertyTitle: "Lake-view residence",
    tenantName: "Kevin Otieno",
    amount: "USD 680",
    status: "paid",
  },
  {
    id: "payout-4",
    date: "28 Jul 2026",
    propertyTitle: "Serviced one-bedroom suite",
    tenantName: "Peter Nkurunziza",
    amount: "USD 520",
    status: "pending",
  },
  {
    id: "payout-5",
    date: "22 Jul 2026",
    propertyTitle: "Waterfront apartment",
    tenantName: "Fatima Bello",
    amount: "USD 1,700",
    status: "failed",
  },
  {
    id: "payout-6",
    date: "08 Jul 2026",
    propertyTitle: "Courtyard family house",
    tenantName: "Diane Uwase",
    amount: "USD 710",
    status: "paid",
  },
];

export const BILLING_SCHEDULES: BillingSchedule[] = [
  {
    id: "schedule-1",
    tenantName: "Aline Mukamana",
    propertyTitle: "Modern 3-bedroom house",
    monthlyRent: "USD 830 / month",
    nextDueDate: "1 Sep 2026",
    status: "active",
  },
  {
    id: "schedule-2",
    tenantName: "Grace Wanjiru",
    propertyTitle: "Bright two-bedroom apartment",
    monthlyRent: "USD 720 / month",
    nextDueDate: "1 Sep 2026",
    status: "active",
  },
  {
    id: "schedule-3",
    tenantName: "Kevin Otieno",
    propertyTitle: "Lake-view residence",
    monthlyRent: "USD 680 / month",
    nextDueDate: "1 Sep 2026",
    status: "active",
  },
  {
    id: "schedule-4",
    tenantName: "Peter Nkurunziza",
    propertyTitle: "Serviced one-bedroom suite",
    monthlyRent: "USD 520 / month",
    nextDueDate: "10 Sep 2026",
    status: "paused",
  },
  {
    id: "schedule-5",
    tenantName: "Diane Uwase",
    propertyTitle: "Courtyard family house",
    monthlyRent: "USD 710 / month",
    nextDueDate: "8 Sep 2026",
    status: "active",
  },
];

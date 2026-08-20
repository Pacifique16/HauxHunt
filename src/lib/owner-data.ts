// Property Owner / Landlord mock data model.
//
// This is the fourth HauxHunt role, distinct from Renter, Agent, and
// Property Manager:
//
//   OWNER owns the asset.
//   PROPERTY MANAGER operates the asset (day-to-day, on the owner's behalf).
//   AGENT markets the asset (finds and qualifies renters).
//   RENTER occupies the asset.
//
// An owner does not have to delegate anything — they may self-manage, hand
// a property to a Property Manager, hand marketing to an Agent, both, or
// neither. That flexibility is the point of this file: every property below
// demonstrates a different combination, and the identities (renter, PM,
// agent) are the SAME people already used across the renter dashboard and
// Messages, not a disconnected new cast — see renter-rentals.ts,
// renter-applications.ts, maintenance-data.ts, and the Messages seed data in
// renter-dashboard/messages/page.tsx.

import type { StaticImageData } from "next/image";

import house1 from "@/assets/images/house1.jpg";
import house2 from "@/assets/images/house2.jpg";
import house3 from "@/assets/images/house3.jpg";
import house4 from "@/assets/images/house4.jpg";
import house5 from "@/assets/images/house5.jpg";
import jeanPortrait from "@/assets/images/flatmate-joseph.jpg";
import patrickPortrait from "@/assets/images/flatmate-patrick.png";
import gracePortrait from "@/assets/images/flatmate-linda.jpg";
import kevinPortrait from "@/assets/images/flatmate-jackson.jpg";
import alinePortrait from "@/assets/images/flatmate-aline.png";
import sarahPortrait from "@/assets/images/flatmate-queen.jpg";

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

export const OWNER = {
  name: "Pacifique Harerimana",
  email: "owner@gmail.com",
  role: "Property Owner",
};

// ---------------------------------------------------------------------------
// Shared status vocabulary — kept identical to the words the renter side
// already uses (Listings / Applications / Rentals / Payments / Maintenance),
// so nothing on the owner side invents a second name for the same state.
// ---------------------------------------------------------------------------

export type ListingStatus = "Draft" | "In Review" | "Live" | "Paused" | "Archived";
export type ApplicationStatus =
  | "Submitted"
  | "Under Review"
  | "Action Required"
  | "Decision Pending"
  | "Approved"
  | "Not Selected";
export type RentalStatus = "Upcoming" | "Active" | "Ending Soon" | "Ended";
export type PaymentStatus = "Due" | "Pending" | "Paid" | "Failed" | "Overdue";
export type MaintenanceStatus = "Open" | "Scheduled" | "In Progress" | "Resolved";

export type ManagementStatus =
  | "Self-managed"
  | "Managed"
  | "Agent represented"
  | "Managed + Agent represented";

export type OccupancyStatus = "Occupied" | "Vacant" | "Upcoming";

// ---------------------------------------------------------------------------
// Delegation — a Property Manager or Agent assigned to a property, with the
// responsibilities the owner granted them. Kept as simple string checklists
// on purpose: this communicates the intended permission model without
// building a real RBAC backend.
// ---------------------------------------------------------------------------

export type PropertyManagerAssignment = {
  name: string;
  verified: boolean;
  responsibilities: string[];
};

export type AgentAssignment = {
  name: string;
  verified: boolean;
  responsibilities: string[];
};

export const PM_RESPONSIBILITIES = [
  "Manage listing",
  "Manage enquiries & viewings",
  "Review applications",
  "Manage rental setup",
  "Manage active rentals",
  "Track rent payments",
  "Handle maintenance",
  "Communicate with renters",
] as const;

export const AGENT_RESPONSIBILITIES = [
  "Manage listing",
  "Respond to enquiries",
  "Manage viewings",
  "Assist with applications",
] as const;

// People available to assign — a small realistic roster, not a full
// workforce directory. Jean Mugisha, Patrick, Kevin Nshuti, Aline Uwase and
// Sarah Uwase already exist elsewhere in the product as the property
// managers and agents renters deal with; two extra names round out the
// picker without introducing a new relationship anywhere else.
export const AVAILABLE_PROPERTY_MANAGERS: { name: string; verified: boolean; avatar: StaticImageData; blurb: string }[] = [
  { name: "Jean Mugisha", verified: true, avatar: jeanPortrait, blurb: "Currently managing 1 of your properties" },
  { name: "Patrick", verified: false, avatar: patrickPortrait, blurb: "Currently managing 1 of your properties" },
  { name: "Grace Umutoni", verified: true, avatar: gracePortrait, blurb: "Manages 7 properties on HauxHunt" },
];

export const AVAILABLE_AGENTS: { name: string; verified: boolean; avatar: StaticImageData; blurb: string }[] = [
  { name: "Kevin Nshuti", verified: true, avatar: kevinPortrait, blurb: "Currently representing 1 of your listings" },
  { name: "Aline Uwase", verified: true, avatar: alinePortrait, blurb: "Currently representing 1 of your listings" },
  { name: "Sarah Uwase", verified: true, avatar: sarahPortrait, blurb: "Currently representing 1 of your listings" },
];

// ---------------------------------------------------------------------------
// Properties — the physical assets the owner holds. PROPERTY is distinct
// from LISTING (its public advert, see OWNER_LISTINGS) and from RENTAL (an
// active renter relationship, see OWNER_RENTALS). A property can exist
// without either of the other two.
// ---------------------------------------------------------------------------

export type OwnerProperty = {
  id: string;
  title: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number; // m²
  amenities: string[];
  image: StaticImageData;
  rent: string | null;
  occupancy: OccupancyStatus;
  listingStatus: ListingStatus | "Not Listed";
  propertyManager: PropertyManagerAssignment | null;
  agent: AgentAssignment | null;
};

export const BASE_OWNER_PROPERTIES: OwnerProperty[] = [
  {
    id: "kacyiru-2br",
    title: "Kacyiru Residence",
    location: "Kacyiru, Kigali",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    size: 96,
    amenities: ["Furnished", "Parking", "Backup generator", "Quiet street"],
    image: house1,
    rent: "RWF 850,000 / month",
    occupancy: "Occupied",
    listingStatus: "Not Listed",
    propertyManager: {
      name: "Jean Mugisha",
      verified: true,
      responsibilities: [
        "Manage enquiries & viewings",
        "Review applications",
        "Manage rental setup",
        "Manage active rentals",
        "Track rent payments",
        "Handle maintenance",
        "Communicate with renters",
      ],
    },
    agent: null,
  },
  {
    id: "nyarutarama-2br",
    title: "Nyarutarama Garden Apartment",
    location: "Nyarutarama, Kigali",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    size: 104,
    amenities: ["Pool access", "Gym", "Secure compound"],
    image: house2,
    rent: "RWF 920,000 / month",
    occupancy: "Upcoming",
    listingStatus: "Paused",
    propertyManager: null,
    agent: {
      name: "Aline Uwase",
      verified: true,
      responsibilities: ["Manage listing", "Respond to enquiries", "Manage viewings", "Assist with applications"],
    },
  },
  {
    id: "remera-3br",
    title: "Remera Family House",
    location: "Remera, Kigali",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    size: 168,
    amenities: ["Garden", "Quiet compound", "Parking"],
    image: house3,
    rent: "RWF 780,000 / month",
    occupancy: "Occupied",
    listingStatus: "Not Listed",
    propertyManager: null,
    agent: {
      name: "Sarah Uwase",
      verified: true,
      responsibilities: ["Manage listing", "Respond to enquiries", "Manage viewings", "Assist with applications"],
    },
  },
  {
    id: "kibagabaga-modern-family-home",
    title: "Modern Family Home",
    location: "Kibagabaga, Kigali",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    size: 186,
    amenities: ["Furnished", "Parking", "Garden", "Backup power"],
    image: house4,
    rent: "RWF 830,000 / month",
    occupancy: "Vacant",
    listingStatus: "Live",
    propertyManager: { name: "Patrick", verified: false, responsibilities: ["Review applications", "Communicate with renters"] },
    agent: {
      name: "Kevin Nshuti",
      verified: true,
      responsibilities: ["Manage listing", "Respond to enquiries", "Manage viewings"],
    },
  },
  {
    id: "kimironko-1br",
    title: "Kimironko Apartment",
    location: "Kimironko, Kigali",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    size: 52,
    amenities: ["Balcony", "Water tank"],
    image: house5,
    rent: null,
    occupancy: "Vacant",
    listingStatus: "Draft",
    propertyManager: null,
    agent: null,
  },
];

export function managementStatusFor(property: Pick<OwnerProperty, "propertyManager" | "agent">): ManagementStatus {
  if (property.propertyManager && property.agent) return "Managed + Agent represented";
  if (property.propertyManager) return "Managed";
  if (property.agent) return "Agent represented";
  return "Self-managed";
}

// ---------------------------------------------------------------------------
// Assignment overrides — local, session-only state so "Assign Property
// Manager" / "Assign Agent" have a visible effect immediately. Stored
// separately from the seed data so the seed always reflects the seven
// starting relationships above; overrides layer on top.
// ---------------------------------------------------------------------------

const OVERRIDES_KEY = "hauxhunt-owner-assignments";
const OVERRIDES_EVENT = "hauxhunt-owner-assignments-changed";

type EditableDetails = Pick<OwnerProperty, "title" | "location" | "type" | "bedrooms" | "bathrooms" | "size" | "rent">;

type Overrides = Record<
  string,
  { propertyManager?: PropertyManagerAssignment | null; agent?: AgentAssignment | null; details?: Partial<EditableDetails> }
>;

function readOverrides(): Overrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : {};
  } catch {
    return {};
  }
}

function writeOverrides(overrides: Overrides) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  } catch {
    // Storage full or unavailable — the change still applies for this tab's
    // in-memory state via the dispatched event below.
  }
  window.dispatchEvent(new Event(OVERRIDES_EVENT));
}

export function subscribeToOwnerAssignments(callback: () => void) {
  window.addEventListener(OVERRIDES_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(OVERRIDES_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function assignPropertyManager(propertyId: string, manager: PropertyManagerAssignment) {
  const overrides = readOverrides();
  overrides[propertyId] = { ...overrides[propertyId], propertyManager: manager };
  writeOverrides(overrides);
}

export function assignAgent(propertyId: string, agent: AgentAssignment) {
  const overrides = readOverrides();
  overrides[propertyId] = { ...overrides[propertyId], agent };
  writeOverrides(overrides);
}

export function unassignPropertyManager(propertyId: string) {
  const overrides = readOverrides();
  overrides[propertyId] = { ...overrides[propertyId], propertyManager: null };
  writeOverrides(overrides);
}

export function unassignAgent(propertyId: string) {
  const overrides = readOverrides();
  overrides[propertyId] = { ...overrides[propertyId], agent: null };
  writeOverrides(overrides);
}

export function updateProperty(propertyId: string, details: Partial<EditableDetails>) {
  const overrides = readOverrides();
  overrides[propertyId] = { ...overrides[propertyId], details: { ...overrides[propertyId]?.details, ...details } };
  writeOverrides(overrides);
}

export function getOwnerProperties(): OwnerProperty[] {
  const overrides = readOverrides();
  return BASE_OWNER_PROPERTIES.map((property) => {
    const override = overrides[property.id];
    if (!override) return property;
    return {
      ...property,
      ...override.details,
      propertyManager: override.propertyManager !== undefined ? override.propertyManager : property.propertyManager,
      agent: override.agent !== undefined ? override.agent : property.agent,
    };
  });
}

export function getOwnerProperty(id: string): OwnerProperty | undefined {
  return getOwnerProperties().find((property) => property.id === id);
}

// ---------------------------------------------------------------------------
// Listings — the public advert for a property. Not every property has one.
// ---------------------------------------------------------------------------

export type OwnerListing = {
  propertyId: string;
  status: ListingStatus | "Not Listed";
  views: number | null;
  saves: number | null;
  enquiries: number | null;
  applications: number;
};

export const OWNER_LISTINGS: OwnerListing[] = [
  { propertyId: "kacyiru-2br", status: "Not Listed", views: null, saves: null, enquiries: null, applications: 1 },
  { propertyId: "nyarutarama-2br", status: "Paused", views: 618, saves: 54, enquiries: 12, applications: 1 },
  { propertyId: "remera-3br", status: "Not Listed", views: null, saves: null, enquiries: null, applications: 1 },
  { propertyId: "kibagabaga-modern-family-home", status: "Live", views: 742, saves: 67, enquiries: 18, applications: 2 },
  { propertyId: "kimironko-1br", status: "Draft", views: null, saves: null, enquiries: null, applications: 0 },
];

// ---------------------------------------------------------------------------
// Applications — visible to the owner, operated by whoever is assigned.
// ---------------------------------------------------------------------------

export type OwnerApplication = {
  id: string;
  propertyId: string;
  applicant: string;
  status: ApplicationStatus;
  submitted: string;
  handledBy: string;
  handledByRole: string;
  proposedRent: string;
  moveIn: string;
  requiresOwnerApproval: boolean;
  note: string;
};

export const OWNER_APPLICATIONS: OwnerApplication[] = [
  {
    id: "HH-APP-0241",
    propertyId: "kacyiru-2br",
    applicant: "Julien Mugisha",
    status: "Under Review",
    submitted: "10 August 2026",
    handledBy: "Jean Mugisha",
    handledByRole: "Property Manager",
    proposedRent: "RWF 850,000 / month",
    moveIn: "1 September 2026",
    requiresOwnerApproval: false,
    note: "Jean Mugisha is reviewing references and identity documents.",
  },
  {
    id: "HH-APP-0248",
    propertyId: "nyarutarama-2br",
    applicant: "Julien Mugisha",
    status: "Action Required",
    submitted: "13 August 2026",
    handledBy: "Aline Uwase",
    handledByRole: "Agent",
    proposedRent: "RWF 920,000 / month",
    moveIn: "1 September 2026",
    requiresOwnerApproval: false,
    note: "Aline Uwase requested an updated reference document from the applicant.",
  },
  {
    id: "HH-APP-0250",
    propertyId: "remera-3br",
    applicant: "Julien Mugisha",
    status: "Decision Pending",
    submitted: "14 August 2026",
    handledBy: "Sarah Uwase",
    handledByRole: "Agent",
    proposedRent: "RWF 780,000 / month",
    moveIn: "1 September 2026",
    requiresOwnerApproval: true,
    note: "Sarah Uwase recommends approving this renewal — the current tenancy is ending soon.",
  },
  {
    id: "HH-APP-0239",
    propertyId: "kibagabaga-modern-family-home",
    applicant: "Divine Keza",
    status: "Submitted",
    submitted: "15 August 2026",
    handledBy: "Patrick",
    handledByRole: "Property Manager",
    proposedRent: "RWF 830,000 / month",
    moveIn: "5 September 2026",
    requiresOwnerApproval: false,
    note: "Patrick has received the application and has not started review yet.",
  },
  {
    id: "HH-APP-0198",
    propertyId: "kibagabaga-modern-family-home",
    applicant: "Eric Niyonzima",
    status: "Not Selected",
    submitted: "2 August 2026",
    handledBy: "Patrick",
    handledByRole: "Property Manager",
    proposedRent: "RWF 830,000 / month",
    moveIn: "1 August 2026",
    requiresOwnerApproval: false,
    note: "This application was not selected.",
  },
];

// ---------------------------------------------------------------------------
// Rentals — an active relationship between a property and a renter.
// ---------------------------------------------------------------------------

export type OwnerRental = {
  id: string;
  propertyId: string;
  renter: string;
  status: RentalStatus;
  rent: string;
  start: string;
  end: string;
  agreementStatus: string;
  depositStatus: string;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  note: string;
};

export const OWNER_RENTALS: OwnerRental[] = [
  {
    id: "HH-RENT-104",
    propertyId: "kacyiru-2br",
    renter: "Julien Mugisha",
    status: "Active",
    rent: "RWF 850,000 / month",
    start: "1 September 2025",
    end: "31 August 2027",
    agreementStatus: "Signed",
    depositStatus: "Paid",
    paymentStatus: "Paid",
    note: "Next rent payment due 1 September 2026.",
  },
  {
    id: "HH-RENT-112",
    propertyId: "nyarutarama-2br",
    renter: "Julien Mugisha",
    status: "Upcoming",
    rent: "RWF 920,000 / month",
    start: "1 September 2026",
    end: "31 August 2027",
    agreementStatus: "Awaiting Owner Approval",
    depositStatus: "Pending",
    paymentStatus: "Pending",
    note: "Aline Uwase prepared the agreement. It needs your approval before the deposit is requested.",
  },
  {
    id: "HH-RENT-087",
    propertyId: "remera-3br",
    renter: "Julien Mugisha",
    status: "Ending Soon",
    rent: "RWF 780,000 / month",
    start: "1 September 2025",
    end: "31 August 2026",
    agreementStatus: "Signed",
    depositStatus: "Paid",
    paymentStatus: "Overdue",
    note: "This tenancy ends in 16 days. A renewal application is awaiting your approval.",
  },
  {
    id: "HH-RENT-041",
    propertyId: "kibagabaga-modern-family-home",
    renter: "Divine Keza",
    status: "Ended",
    rent: "RWF 650,000 / month",
    start: "1 January 2025",
    end: "31 December 2025",
    agreementStatus: "Completed",
    depositStatus: "Refunded",
    paymentStatus: "Paid",
    note: "This 12-month tenancy was completed.",
  },
];

// ---------------------------------------------------------------------------
// Payments — rental payments only. Not HauxHunt platform billing.
// ---------------------------------------------------------------------------

export type OwnerPayment = {
  id: string;
  propertyId: string;
  rentalId: string;
  renter: string;
  purpose: string;
  amount: string;
  amountValue: number;
  status: PaymentStatus;
  date: string;
  method: string;
  reference: string;
  managedBy: string | null;
};

export const OWNER_PAYMENTS: OwnerPayment[] = [
  {
    id: "HH-PAY-20551",
    propertyId: "kacyiru-2br",
    rentalId: "HH-RENT-104",
    renter: "Julien Mugisha",
    purpose: "August Rent",
    amount: "RWF 850,000",
    amountValue: 850_000,
    status: "Paid",
    date: "1 August 2026",
    method: "Mobile Money",
    reference: "HH-PAY-20551",
    managedBy: "Jean Mugisha",
  },
  {
    id: "HH-PAY-20481",
    propertyId: "nyarutarama-2br",
    rentalId: "HH-RENT-112",
    renter: "Julien Mugisha",
    purpose: "Rental Setup — Deposit & First Month",
    amount: "RWF 1,700,000",
    amountValue: 1_700_000,
    status: "Pending",
    date: "Requested once the agreement is approved",
    method: "Bank Transfer",
    reference: "HH-PAY-20481",
    managedBy: "Aline Uwase",
  },
  {
    id: "HH-PAY-20397",
    propertyId: "remera-3br",
    rentalId: "HH-RENT-087",
    renter: "Julien Mugisha",
    purpose: "August Rent",
    amount: "RWF 780,000",
    amountValue: 780_000,
    status: "Overdue",
    date: "Due 1 August 2026 · 5 days overdue",
    method: "—",
    reference: "HH-PAY-20397",
    managedBy: "Sarah Uwase",
  },
  {
    id: "HH-PAY-20602",
    propertyId: "kacyiru-2br",
    rentalId: "HH-RENT-104",
    renter: "Julien Mugisha",
    purpose: "September Rent",
    amount: "RWF 850,000",
    amountValue: 850_000,
    status: "Due",
    date: "Due 1 September 2026",
    method: "—",
    reference: "HH-PAY-20602",
    managedBy: "Jean Mugisha",
  },
  {
    id: "HH-PAY-19998",
    propertyId: "kibagabaga-modern-family-home",
    rentalId: "HH-RENT-041",
    renter: "Divine Keza",
    purpose: "December Rent (final month)",
    amount: "RWF 650,000",
    amountValue: 650_000,
    status: "Paid",
    date: "1 December 2025",
    method: "Card",
    reference: "HH-PAY-19998",
    managedBy: "Patrick",
  },
];

// ---------------------------------------------------------------------------
// Maintenance — visibility for the owner; operations belong to whoever is
// assigned. Reframed from the same requests the renter filed and the
// technicians already named in maintenance-data.ts, so the same issue reads
// identically from either side.
// ---------------------------------------------------------------------------

export type OwnerMaintenanceRequest = {
  id: string;
  propertyId: string;
  title: string;
  reportedBy: string;
  managedBy: string | null;
  technician: string | null;
  status: MaintenanceStatus;
  priority: "Normal" | "Urgent";
  submitted: string;
  description: string;
  scheduledVisit: { date: string; time: string } | null;
};

export const OWNER_MAINTENANCE: OwnerMaintenanceRequest[] = [
  {
    id: "HH-MNT-1042",
    propertyId: "kacyiru-2br",
    title: "Leaking kitchen tap",
    reportedBy: "Julien Mugisha",
    managedBy: "Jean Mugisha",
    technician: "Moses Habimana",
    status: "In Progress",
    priority: "Normal",
    submitted: "14 August 2026",
    description: "The kitchen tap has been leaking continuously. Water is collecting under the sink.",
    scheduledVisit: { date: "17 August 2026", time: "10:00 AM – 11:00 AM" },
  },
  {
    id: "HH-MNT-1050",
    propertyId: "remera-3br",
    title: "No water in apartment",
    reportedBy: "Julien Mugisha",
    managedBy: "Sarah Uwase",
    technician: null,
    status: "Open",
    priority: "Urgent",
    submitted: "16 August 2026",
    description: "There has been no running water in the house since noon.",
    scheduledVisit: null,
  },
  {
    id: "HH-MNT-1039",
    propertyId: "kacyiru-2br",
    title: "Bathroom door lock sticking",
    reportedBy: "Julien Mugisha",
    managedBy: "Jean Mugisha",
    technician: "Claude Mutabazi",
    status: "Scheduled",
    priority: "Normal",
    submitted: "12 August 2026",
    description: "The bathroom lock is difficult to open from inside.",
    scheduledVisit: { date: "18 August 2026", time: "2:00 PM – 3:00 PM" },
  },
  {
    id: "HH-MNT-1024",
    propertyId: "kacyiru-2br",
    title: "Bedroom light not working",
    reportedBy: "Julien Mugisha",
    managedBy: "Jean Mugisha",
    technician: null,
    status: "Resolved",
    priority: "Normal",
    submitted: "2 August 2026",
    description: "The ceiling light stopped turning on. The faulty fitting was replaced and tested.",
    scheduledVisit: null,
  },
];

// ---------------------------------------------------------------------------
// Recent activity — lets the owner see what the people they delegated to
// have been doing, without performing every step personally.
// ---------------------------------------------------------------------------

export type OwnerActivityItem = {
  id: string;
  text: string;
  time: string;
};

export const OWNER_RECENT_ACTIVITY: OwnerActivityItem[] = [
  { id: "act-1", text: "Sarah Uwase requested your approval on a renewal application for Remera Family House.", time: "2 hr ago" },
  { id: "act-2", text: "Jean Mugisha confirmed a maintenance visit at Kacyiru Residence.", time: "5 hr ago" },
  { id: "act-3", text: "Aline Uwase signed the rental agreement for Nyarutarama Garden Apartment.", time: "Yesterday" },
  { id: "act-4", text: "August rent received for Kacyiru Residence.", time: "Yesterday" },
  { id: "act-5", text: "Kevin Nshuti published the Modern Family Home listing.", time: "3 days ago" },
  { id: "act-6", text: "Patrick reviewed a new application for Modern Family Home.", time: "3 days ago" },
];

// ---------------------------------------------------------------------------
// Small formatting helpers shared by the owner pages.
// ---------------------------------------------------------------------------

export function propertyTitle(propertyId: string): string {
  return BASE_OWNER_PROPERTIES.find((property) => property.id === propertyId)?.title ?? propertyId;
}

export function propertyLocation(propertyId: string): string {
  return BASE_OWNER_PROPERTIES.find((property) => property.id === propertyId)?.location ?? "";
}

export function rentReceivedThisMonth(): number {
  return OWNER_PAYMENTS.filter(
    (payment) => payment.status === "Paid" && payment.purpose.toLowerCase().includes("rent") && payment.date.includes("August 2026"),
  ).reduce((total, payment) => total + payment.amountValue, 0);
}

export function formatRwf(amount: number): string {
  return `RWF ${amount.toLocaleString("en-US")}`;
}

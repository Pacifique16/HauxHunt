export type MaintenanceStatus =
  | "Submitted"
  | "Under Review"
  | "Scheduled"
  | "In Progress"
  | "Waiting for Renter"
  | "Resolved"
  | "Cancelled";

export type MaintenanceRequest = {
  id: string;
  title: string;
  property: string;
  propertyId: string;
  location: string;
  category: string;
  area: string;
  urgency: "Normal" | "Urgent";
  status: MaintenanceStatus;
  submitted: string;
  completed?: string;
  description: string;
  latestUpdate: string;
  informationNeeded?: string;
  resolution?: string;
  scheduledVisit?: {
    date: string;
    time: string;
    contact: string;
    role: string;
  };
};

export const ACTIVE_RENTALS = [
  {
    id: "HH-RENT-104",
    propertyId: "kacyiru-2br",
    title: "Kacyiru Residence",
    location: "Kacyiru, Kigali",
  },
  {
    id: "HH-RENT-087",
    propertyId: "remera-3br",
    title: "Remera Family House",
    location: "Remera, Kigali",
  },
];

export const MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: "HH-MNT-1042",
    title: "Leaking kitchen tap",
    property: "Kacyiru Residence",
    propertyId: "kacyiru-2br",
    location: "Kacyiru, Kigali",
    category: "Plumbing",
    area: "Kitchen",
    urgency: "Normal",
    status: "In Progress",
    submitted: "14 August 2026",
    description:
      "The kitchen tap has been leaking continuously since yesterday. Water is collecting under the sink.",
    latestUpdate: "Technician scheduled for tomorrow at 10:00 AM",
    scheduledVisit: {
      date: "17 August 2026",
      time: "10:00 AM – 11:00 AM",
      contact: "Eric N.",
      role: "Maintenance Technician",
    },
  },
  {
    id: "HH-MNT-1050",
    title: "No water in apartment",
    property: "Remera Family House",
    propertyId: "remera-3br",
    location: "Remera, Kigali",
    category: "Water / Leak",
    area: "Entire property",
    urgency: "Urgent",
    status: "Under Review",
    submitted: "16 August 2026",
    description: "There has been no running water in the house since noon.",
    latestUpdate: "Property manager is reviewing the request",
  },
  {
    id: "HH-MNT-1048",
    title: "Loose bedroom socket",
    property: "Kacyiru Residence",
    propertyId: "kacyiru-2br",
    location: "Kacyiru, Kigali",
    category: "Electrical",
    area: "Main Bedroom",
    urgency: "Normal",
    status: "Waiting for Renter",
    submitted: "15 August 2026",
    description: "The wall socket moves when a plug is removed.",
    latestUpdate: "Property manager requested another photo",
    informationNeeded: "Please upload a clear photo of the socket and wall.",
  },
  {
    id: "HH-MNT-1039",
    title: "Bathroom door lock sticking",
    property: "Kacyiru Residence",
    propertyId: "kacyiru-2br",
    location: "Kacyiru, Kigali",
    category: "Doors & Locks",
    area: "Main Bathroom",
    urgency: "Normal",
    status: "Scheduled",
    submitted: "12 August 2026",
    description: "The bathroom lock is difficult to open from inside.",
    latestUpdate: "Visit scheduled for 18 August at 2:00 PM",
    scheduledVisit: {
      date: "18 August 2026",
      time: "2:00 PM – 3:00 PM",
      contact: "Claude M.",
      role: "Maintenance Technician",
    },
  },
  {
    id: "HH-MNT-1024",
    title: "Bedroom light not working",
    property: "Kacyiru Residence",
    propertyId: "kacyiru-2br",
    location: "Kacyiru, Kigali",
    category: "Electrical",
    area: "Bedroom",
    urgency: "Normal",
    status: "Resolved",
    submitted: "2 August 2026",
    completed: "5 August 2026",
    description: "The ceiling light stopped turning on.",
    latestUpdate: "Light fitting replaced",
    resolution: "The faulty light fitting was replaced and tested.",
  },
  {
    id: "HH-MNT-1017",
    title: "Loose kitchen cabinet handle",
    property: "Kacyiru Residence",
    propertyId: "kacyiru-2br",
    location: "Kacyiru, Kigali",
    category: "Kitchen",
    area: "Kitchen",
    urgency: "Normal",
    status: "Cancelled",
    submitted: "25 July 2026",
    description: "One cabinet handle became loose.",
    latestUpdate: "Request cancelled by renter",
  },
];

export const ISSUE_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Heating / Cooling",
  "Appliance",
  "Doors & Locks",
  "Bathroom",
  "Kitchen",
  "Water / Leak",
  "Internet / Utilities",
  "Pest",
  "Structural",
  "Cleaning / Common Area",
  "Other",
];

export const PROPERTY_AREAS = [
  "Kitchen",
  "Main Bathroom",
  "Bedroom",
  "Living Room",
  "Balcony",
  "Entrance",
  "Common Area",
  "Other",
];

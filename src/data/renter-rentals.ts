export type RentalStatus = "Upcoming" | "Active" | "Ending Soon" | "Ended";
export type RenterRental = {
  id: string;
  propertyId: string;
  title: string;
  location: string;
  status: RentalStatus;
  beds: number;
  baths: number;
  furnishing: string;
  rent: string;
  nextPayment: string;
  start: string;
  end: string;
  manager: string;
  role: string;
  image: number;
  note: string;
};
export const RENTER_RENTALS: RenterRental[] = [
  {
    id: "HH-RENT-104",
    propertyId: "kacyiru-2br",
    title: "Kacyiru Residence",
    location: "Kacyiru, Kigali",
    status: "Active",
    beds: 2,
    baths: 2,
    furnishing: "Furnished",
    rent: "RWF 850,000",
    nextPayment: "1 September 2026",
    start: "1 September 2025",
    end: "31 August 2027",
    manager: "Jean Mugisha",
    role: "Verified Property Manager",
    image: 0,
    note: "Your home is active and the next rent payment is due soon.",
  },
  {
    id: "HH-RENT-112",
    propertyId: "nyarutarama-2br",
    title: "Nyarutarama Garden Apartment",
    location: "Nyarutarama, Kigali",
    status: "Upcoming",
    beds: 2,
    baths: 2,
    furnishing: "Furnished",
    rent: "RWF 920,000",
    nextPayment: "1 September 2026",
    start: "1 September 2026",
    end: "31 August 2027",
    manager: "Aline Uwase",
    role: "Verified Agent",
    image: 1,
    note: "Complete your move-in setup before 1 September.",
  },
  {
    id: "HH-RENT-087",
    propertyId: "remera-3br",
    title: "Remera Family House",
    location: "Remera, Kigali",
    status: "Ending Soon",
    beds: 3,
    baths: 2,
    furnishing: "Unfurnished",
    rent: "RWF 780,000",
    nextPayment: "1 September 2026",
    start: "1 September 2025",
    end: "31 August 2026",
    manager: "Sarah Uwase",
    role: "Verified Agent",
    image: 2,
    note: "Your rental ends in 16 days.",
  },
  {
    id: "HH-RENT-041",
    propertyId: "kibagabaga-modern-family-home",
    title: "Kibagabaga Apartment",
    location: "Kibagabaga, Kigali",
    status: "Ended",
    beds: 2,
    baths: 1,
    furnishing: "Furnished",
    rent: "RWF 650,000",
    nextPayment: "No payment due",
    start: "1 January 2025",
    end: "31 December 2025",
    manager: "Sarah Uwase",
    role: "Property Manager",
    image: 3,
    note: "This 12-month rental was completed.",
  },
];

"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  FileText,
  Home,
  MessageCircle,
  Wrench,
} from "lucide-react";
import house1 from "../../../../../house1.jpg";
import house2 from "../../../../../house2.jpg";
import house3 from "../../../../../house3.jpg";
import house4 from "../../../../../house4.jpg";
import managerAvatar from "../../../../../julien.jpg";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { RENTER_RENTALS } from "@/data/renter-rentals";
const images = [house1, house2, house3, house4];
export default function RentalDetail() {
  const { id } = useParams<{ id: string }>();
  const r = RENTER_RENTALS.find((x) => x.id === id) ?? RENTER_RENTALS[0];
  const ended = r.status === "Ended";
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <header className="bg-white px-5 py-8 sm:px-6 lg:px-11">
          <div className="mx-auto max-w-[1200px]">
            <Link
              href="/renter-dashboard/rentals"
              className="inline-flex items-center gap-1 text-sm text-black/60"
            >
              <ChevronLeft className="size-4" />
              My Rentals
            </Link>
            <div className="mt-5 grid gap-5 sm:grid-cols-[150px_1fr]">
              <Image
                src={images[r.image]}
                alt={r.title}
                className="h-32 w-full object-cover"
              />
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-bricolage text-3xl font-medium">
                      {r.title}
                    </h1>
                    <p className="text-carbon-500 mt-1">{r.location}</p>
                  </div>
                  <span className="rounded-full bg-black px-3 py-1.5 text-xs text-white">
                    {r.status === "Active"
                      ? "Active Rental"
                      : r.status === "Upcoming"
                        ? "Upcoming Rental"
                        : r.status === "Ended"
                          ? "Rental Ended"
                          : r.status}
                  </span>
                </div>
                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/properties/${r.propertyId}?from=renter`}
                    className="h-10 rounded-full border border-black/15 px-4 py-2.5 text-sm"
                  >
                    View Property
                  </Link>
                  <Link
                    href={`/renter-dashboard/messages?host=${encodeURIComponent(r.manager)}&rental=${r.id}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-sm text-white"
                  >
                    <MessageCircle className="size-4" />
                    Message Manager
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto grid max-w-[1200px] gap-6 px-5 py-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section title="Rental overview">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {[
                  ["Monthly Rent", r.rent],
                  ["Next Payment", r.nextPayment],
                  ["Rental Start", r.start],
                  ["Rental End", r.end],
                  ["Deposit", r.rent],
                  ["Occupants", "2"],
                ].map(([a, b]) => (
                  <div key={a}>
                    <p className="text-carbon-500 text-xs">{a}</p>
                    <p className="mt-1 font-medium">{b}</p>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Rental timeline">
              <div className="grid gap-3 sm:grid-cols-5">
                {[
                  "Application approved",
                  "Rental confirmed",
                  "Move-in",
                  "Active rental",
                  "Lease end",
                ].map((x, i) => (
                  <div key={x} className="flex gap-2 sm:block">
                    <span
                      className={`flex size-6 items-center justify-center rounded-full ${i < (ended ? 5 : r.status === "Upcoming" ? 2 : 4) ? "bg-black text-white" : "border border-black/20"}`}
                    >
                      {i < (ended ? 5 : r.status === "Upcoming" ? 2 : 4) ? (
                        <Check className="size-3" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <p className="mt-2 text-xs">{x}</p>
                  </div>
                ))}
              </div>
            </Section>
            {r.status === "Upcoming" ? (
              <Section title="Move-in">
                <p className="text-sm">
                  <strong>Move-in date:</strong> {r.start}
                </p>
                <p className="text-carbon-500 mt-2 text-sm">
                  Contact {r.manager} on arrival to collect the keys.
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    "Rental agreement reviewed",
                    "Deposit paid",
                    "First rent paid",
                    "Move-in inspection pending",
                    "Keys pending",
                  ].map((x, i) => (
                    <p key={x} className="flex items-center gap-2 text-sm">
                      <Check
                        className={`size-4 ${i < 3 ? "text-black" : "text-black/25"}`}
                      />
                      {x}
                    </p>
                  ))}
                </div>
              </Section>
            ) : null}
            <div className="grid gap-6 sm:grid-cols-2">
              <Section title="Payments">
                <p className="font-medium">{r.rent} / month</p>
                <p className="text-carbon-500 mt-2 text-sm">
                  Next due: {r.nextPayment}
                </p>
                <Link
                  href="/renter-dashboard/payments"
                  className="mt-5 inline-flex text-sm underline"
                >
                  View All Payments
                </Link>
                {!ended ? (
                  <Link
                    href="/renter-dashboard/payments"
                    className="ml-5 text-sm underline"
                  >
                    Make Payment
                  </Link>
                ) : null}
              </Section>
              <Section title="Maintenance">
                <p className="font-medium">
                  {ended ? "No open requests" : "1 open request"}
                </p>
                <p className="text-carbon-500 mt-2 text-sm">
                  {ended
                    ? "Maintenance history available"
                    : "Leaking kitchen tap · In Progress"}
                </p>
                <Link
                  href="/renter-dashboard/maintenance"
                  className="mt-5 inline-flex items-center gap-2 text-sm underline"
                >
                  <Wrench className="size-4" />
                  View Maintenance
                </Link>
              </Section>
            </div>
            <Section title="Documents">
              <div className="divide-y divide-black/10">
                {[
                  ["Rental agreement", "Signed"],
                  [
                    "Move-in report",
                    r.status === "Upcoming" ? "Pending" : "Available",
                  ],
                  ["Deposit receipt", "Available"],
                  ["Payment receipts", "Available"],
                ].map(([a, b]) => (
                  <div
                    key={a}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-4" />
                      {a}
                    </span>
                    <span>
                      <span className="text-carbon-500 mr-4 text-xs">{b}</span>
                      <button className="underline">View</button>
                    </span>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Recent activity">
              <div className="space-y-4 text-sm">
                {[
                  ["15 Aug", "Rental agreement added"],
                  ["12 Aug", "Deposit marked as received"],
                  ["10 Aug", "Application approved"],
                  ["8 Aug", "Viewing completed"],
                ].map(([a, b]) => (
                  <div key={a + b} className="grid grid-cols-[60px_1fr]">
                    <strong>{a}</strong>
                    <span className="text-carbon-500">{b}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
          <aside className="space-y-6">
            <Section title="Managed by">
              <div className="flex items-center gap-3">
                <Image
                  src={managerAvatar}
                  alt={r.manager}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{r.manager}</p>
                  <p className="text-carbon-500 mt-1 flex items-center gap-1 text-sm">
                    <BadgeCheck className="size-4" />
                    {r.role}
                  </p>
                </div>
              </div>
              <p className="text-carbon-500 mt-4 text-sm">
                +250 788 000 000
                <br />
                manager@hauxhunt.rw
              </p>
            </Section>
            <Section title="Property">
              <p className="text-sm">
                {r.beds} bedrooms · {r.baths} bathrooms
              </p>
              <p className="text-carbon-500 mt-2 text-sm">
                {r.furnishing} · Residential home
              </p>
              <Link
                href={`/properties/${r.propertyId}?from=renter`}
                className="mt-5 inline-flex items-center gap-2 text-sm underline"
              >
                <Home className="size-4" />
                View Full Property
              </Link>
            </Section>
          </aside>
        </div>
      </main>
    </>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[0_3px_12px_rgba(0,0,0,.025)]">
      <h2 className="font-bricolage mb-5 text-xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

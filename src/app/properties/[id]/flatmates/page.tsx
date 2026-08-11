import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { HistoryBackButton } from "@/components/navigation/history-back-button";
import { FlatmateDiscoveryDeck } from "@/components/flatmates/flatmate-discovery-deck";
import { DEMO_LISTINGS } from "@/data/hero-search-demo";
import { getFlatmateProfilesForListing } from "@/data/flatmates-demo";

type FlatmateDiscoveryPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; focus?: string }>;
};

export function generateStaticParams() {
  return DEMO_LISTINGS.map((listing) => ({ id: listing.id }));
}

export default async function FlatmateDiscoveryPage({
  params,
  searchParams,
}: FlatmateDiscoveryPageProps) {
  const { id } = await params;
  const { from, focus } = await searchParams;
  const renterView = from === "renter";
  const property = DEMO_LISTINGS.find((listing) => listing.id === id);
  if (!property) notFound();

  const profiles = getFlatmateProfilesForListing(property.id);

  return (
    <>
      {renterView ? <RenterCatalogueTopBar /> : <Navbar />}
      <main className="bg-canvas pt-24">
        <div className="mx-auto max-w-[720px] px-5 pt-7 pb-20 sm:px-6">
          <HistoryBackButton
            fallbackHref={`/properties/${property.id}${renterView ? "?from=renter" : ""}`}
            className="text-carbon-600 hover:text-carbon-900 inline-flex items-center gap-2 rounded-sm text-sm"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            Back to listing
          </HistoryBackButton>

          <div className="mt-6 text-center">
            <h1 className="font-bricolage text-carbon-900 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
              Flatmates for {property.title}
            </h1>
            <p className="text-carbon-500 mt-2 text-sm">
              Swipe or use the buttons below — pass, save, or send a connection request.
              Identities stay hidden until you both agree to connect.
            </p>
          </div>

          <div className="mt-10">
            <FlatmateDiscoveryDeck profiles={profiles} focusId={focus} />
          </div>
        </div>
      </main>
      {renterView ? null : <Footer />}
    </>
  );
}

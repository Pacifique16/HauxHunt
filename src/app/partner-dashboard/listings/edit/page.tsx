import type { Metadata } from "next";

import { DashboardShell } from "@/components/partner/dashboard-shell";
import { EditListingForm } from "@/components/partner/edit-listing-form";

export const metadata: Metadata = {
  title: "Edit listing | Partner dashboard | HauxHunt",
  description: "Update a property listing in the HauxHunt partner dashboard.",
};

export default async function EditListingPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string }>;
}) {
  const { listing } = await searchParams;

  return (
    <DashboardShell initialSection="listings">
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[980px]">
          <header className="border-b border-black/10 pb-8">
            <h1 className="dashboard-page-title text-carbon-900">
              Edit listing
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Update the property details renters see. Your changes will be
              reviewed before they replace the live listing.
            </p>
          </header>
          <EditListingForm listingTitle={listing ?? "Property listing"} />
        </div>
      </section>
    </DashboardShell>
  );
}

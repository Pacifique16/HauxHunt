import type { Metadata } from "next";

import { DashboardShell } from "@/components/partner/dashboard-shell";
import { ListPropertyForm } from "@/components/properties/list-property-form";

export const metadata: Metadata = {
  title: "Add property | Partner dashboard | HauxHunt",
  description: "Create a property listing from the HauxHunt partner dashboard.",
};

export default function NewPartnerListingPage() {
  return (
    <DashboardShell initialSection="listings">
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="mx-auto max-w-[980px] border-b border-black/10 pb-8">
            <h1 className="font-bricolage text-carbon-900 text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.92] font-medium tracking-[-0.055em]">
              List a property
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Add the property details, pricing, availability, and photos. You
              can review everything before submitting the listing.
            </p>
          </header>

          <div className="mx-auto mt-8 max-w-[980px]">
            <ListPropertyForm authenticatedPartner />
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

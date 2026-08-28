import type { Metadata } from "next";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { ListPropertyForm } from "@/components/properties/list-property-form";

export const metadata: Metadata = {
  title: "Add listing | Owner dashboard | HauxHunt",
  description: "Add and verify a home listing on HauxHunt.",
};

export default function NewOwnerPropertyPage() {
  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[1360px]">
          <header className="mx-auto max-w-[980px] border-b border-black/10 pb-8">
            <h1 className="dashboard-page-title text-carbon-900">
              Add Listing
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Add the home details, pricing, availability, and photos, then
              provide proof that you own it. You can save the listing as a draft
              before submitting it for verification and publication.
            </p>
          </header>
          <div className="mx-auto mt-8 max-w-[980px]">
            <ListPropertyForm
              authenticatedPartner
              returnPath="/owner-dashboard/properties"
            />
          </div>
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

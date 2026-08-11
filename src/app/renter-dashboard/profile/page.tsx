import type { Metadata } from "next";

import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { RenterFlatmatePreferences } from "@/components/flatmates/renter-flatmate-preferences";

export const metadata: Metadata = {
  title: "Account settings | Renter dashboard | HauxHunt",
  description: "Manage your HauxHunt profile and flatmate preferences.",
};

export default function RenterProfilePage() {
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-canvas min-h-screen pt-24">
        <div className="mx-auto max-w-[1180px] px-5 pt-7 pb-24 sm:px-6">
          <header className="border-b border-black/10 pb-8">
            <h1 className="font-bricolage text-carbon-900 text-3xl font-medium tracking-[-0.03em]">
              Account settings
            </h1>
            <p className="text-carbon-600 mt-4 max-w-2xl text-base leading-7">
              Manage your profile and flatmate preferences. Your name and photo are only
              shown to other renters after you both accept a connection.
            </p>
          </header>

          <div className="mt-8">
            <RenterFlatmatePreferences />
          </div>
        </div>
      </main>
    </>
  );
}

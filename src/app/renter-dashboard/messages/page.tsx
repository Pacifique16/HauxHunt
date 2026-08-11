import type { Metadata } from "next";

import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { RenterMessagesWorkspace } from "@/components/flatmates/renter-messages-workspace";

export const metadata: Metadata = {
  title: "Messages | Renter dashboard | HauxHunt",
  description: "Flatmate connection requests and conversations.",
};

export default function RenterMessagesPage() {
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-canvas min-h-screen pt-24">
        <div className="mx-auto max-w-[1000px] px-5 pt-7 pb-20 sm:px-6">
          <h1 className="font-bricolage text-carbon-900 text-3xl font-medium tracking-[-0.03em]">
            Messages
          </h1>
          <p className="text-carbon-500 mt-2 text-sm">
            Flatmate connection requests and conversations, kept private until you both
            agree to connect.
          </p>
          <div className="mt-8">
            <RenterMessagesWorkspace />
          </div>
        </div>
      </main>
    </>
  );
}

import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PropertyRequestForm } from "@/components/properties/property-request-form";

export const metadata: Metadata = {
  title: "Property request | HauxHunt",
  description:
    "Tell HauxHunt what property you need and let verified property partners respond with relevant options.",
};

export default function PropertyRequestPage() {
  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-24">
        <section className="px-5 pt-14 pb-12 sm:px-6 sm:pt-16 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1120px] text-center">
            <h1 className="font-bricolage text-carbon-900 text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.9] font-medium tracking-[-0.06em]">
              Property request
            </h1>
            <p className="text-carbon-600 mx-auto mt-7 max-w-2xl text-lg leading-7">
              Can&apos;t find the right house? Share what you need and let
              verified property partners respond with relevant options.
            </p>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1180px]">
            <PropertyRequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

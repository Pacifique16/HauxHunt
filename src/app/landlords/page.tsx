import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ListPropertyForm } from "@/components/properties/list-property-form";

export const metadata: Metadata = {
  title: "List a property | HauxHunt",
  description:
    "List a rental or sale property on HauxHunt as a landlord, broker, or real estate agency.",
};

export default function LandlordsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-24">
        <section className="px-5 pt-16 pb-12 sm:px-6 sm:pt-20 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1120px] text-center">
            <p className="font-bricolage text-carbon-500 text-sm font-medium tracking-[0.12em] uppercase">
              For property partners
            </p>
            <h1 className="font-bricolage text-carbon-900 mt-5 text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.9] font-medium tracking-[-0.06em]">
              List a property
            </h1>
            <p className="text-carbon-600 mx-auto mt-7 max-w-2xl text-lg leading-7">
              A clear multi-step form for landlords, brokers, and agencies to
              upload photos, property information, pricing, and availability.
            </p>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[980px]">
            <ListPropertyForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

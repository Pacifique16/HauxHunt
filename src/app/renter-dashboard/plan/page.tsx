import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { TenantPricingPlans } from "@/components/renter/tenant-pricing-plans";

export default function TenantPlanPage() {
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="bg-carbon-50 px-5 pt-9 pb-14 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <div className="max-w-2xl border-b border-black/10 pb-7">
              <h1 className="dashboard-page-title text-carbon-900">My Plan</h1>
              <p className="text-carbon-500 mt-3 text-sm leading-6">
                Choose the plan that fits how you search. Switch any time — no
                long-term commitment.
              </p>
            </div>

            <div className="mx-auto max-w-4xl pt-9">
              <TenantPricingPlans />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

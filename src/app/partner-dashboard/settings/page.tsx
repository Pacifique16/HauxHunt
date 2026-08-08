import type { Metadata } from "next";
import Image from "next/image";
import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";

import { DashboardShell } from "@/components/partner/dashboard-shell";
import { PartnerDetailsFields } from "@/components/partner/partner-details-fields";
import { SaveSettingsButton } from "@/components/partner/save-settings-button";
import julienProfile from "../../../../julien.jpg";

export const metadata: Metadata = {
  title: "Account settings | Partner dashboard | HauxHunt",
  description: "Manage your HauxHunt partner profile and business details.",
};

export default function PartnerSettingsPage() {
  return (
    <DashboardShell initialSection="settings">
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[980px]">
          <header className="border-b border-black/10 pb-8">
            <h1 className="font-bricolage text-carbon-900 text-[clamp(2.75rem,5vw,4.75rem)] leading-[0.92] font-medium tracking-[-0.055em]">
              Account settings
            </h1>
            <p className="text-carbon-600 mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              Keep your personal and business information current. HauxHunt uses
              these details when you create listings and contact clients.
            </p>
          </header>

          <form className="mt-8 space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)] sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={julienProfile}
                    alt=""
                    className="size-16 rounded-full object-cover shadow-[0_5px_18px_rgba(0,0,0,0.15)]"
                  />
                  <div>
                    <h2 className="font-bricolage text-carbon-900 text-xl font-medium">
                      Profile photo
                    </h2>
                    <p className="text-carbon-500 mt-1 text-sm">
                      Displayed to property seekers and applicants.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="font-bricolage h-10 rounded-full bg-black px-5 text-sm font-medium text-white"
                >
                  Change photo
                </button>
              </div>
            </section>

            <SettingsCard
              icon={Building2}
              title="Personal and business details"
              description="These details are reused when you create a property listing."
            >
              <PartnerDetailsFields />
            </SettingsCard>

            <SettingsCard
              icon={ShieldCheck}
              title="Verification"
              description="Verification builds trust and unlocks listing publication."
            >
              <div className="flex items-center gap-3 rounded-2xl bg-black/[0.035] p-4">
                <CheckCircle2 aria-hidden="true" className="size-5" />
                <div className="flex-1">
                  <p className="font-medium">Contact details confirmed</p>
                  <p className="text-carbon-500 mt-0.5 text-sm">
                    Identity verification has one remaining step.
                  </p>
                </div>
                <span className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
                  80%
                </span>
              </div>
            </SettingsCard>

            <div className="flex justify-end">
              <SaveSettingsButton />
            </div>
          </form>
        </div>
      </section>
    </DashboardShell>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)] sm:p-8">
      <div className="mb-7 flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="font-bricolage text-carbon-900 text-xl font-medium">
            {title}
          </h2>
          <p className="text-carbon-500 mt-1 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

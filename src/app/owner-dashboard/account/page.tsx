import type { Metadata } from "next";
import Image from "next/image";
import { Bell, Building2, Lock, UserRound } from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import ownerProfile from "@/assets/images/flatmate-billy.jpg";
import { OWNER } from "@/lib/owner-data";

export const metadata: Metadata = {
  title: "Account | Owner dashboard | HauxHunt",
  description: "Manage your HauxHunt property owner profile.",
};

export default function OwnerAccountPage() {
  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-8 pb-24 sm:px-6 lg:px-10 lg:pt-10 xl:px-12">
        <div className="mx-auto max-w-[720px]">
          <header className="border-b border-black/10 pb-8">
            <h1 className="dashboard-page-title text-carbon-900">Account</h1>
            <p className="text-carbon-600 mt-5 text-base leading-7">Your personal profile, login, and notification preferences.</p>
          </header>

          <div className="mt-8 space-y-6">
            <section className="rounded-[1.5rem] border border-black/10 bg-white p-6">
              <div className="flex items-center gap-4">
                <Image src={ownerProfile} alt="" className="size-16 rounded-full object-cover" />
                <div>
                  <p className="font-bricolage text-lg font-medium">{OWNER.name}</p>
                  <p className="text-carbon-500 text-sm">{OWNER.email}</p>
                  <p className="text-carbon-400 mt-0.5 text-xs">{OWNER.role}</p>
                </div>
              </div>
            </section>

            <SettingsCard icon={UserRound} title="Personal information" description="Your name, phone number, and country.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" defaultValue={OWNER.name} />
                <Field label="Email" defaultValue={OWNER.email} />
                <Field label="Phone number" defaultValue="+250 788 000 000" />
                <Field label="Country" defaultValue="Rwanda" />
              </div>
            </SettingsCard>

            <SettingsCard icon={Lock} title="Login &amp; security" description="Password and sign-in preferences.">
              <div className="flex items-center justify-between rounded-2xl bg-black/3.5 p-4">
                <p className="text-sm">Password last changed 3 months ago</p>
                <button type="button" className="font-bricolage text-sm font-medium underline underline-offset-4">Change</button>
              </div>
            </SettingsCard>

            <SettingsCard icon={Bell} title="Notifications &amp; preferences" description="How you want to hear about approvals, rent, and maintenance.">
              <div className="space-y-3">
                {["Application approvals", "Rent payments", "Maintenance issues", "Delegation updates"].map((item) => (
                  <label key={item} className="flex items-center justify-between rounded-xl border border-black/10 p-3.5">
                    <span className="text-sm">{item}</span>
                    <input type="checkbox" defaultChecked className="size-4 accent-black" />
                  </label>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard icon={Building2} title="Owner information" description="Used when your properties are represented to renters.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Display name" defaultValue={OWNER.name} />
                <Field label="Preferred contact method" defaultValue="Messages" />
              </div>
            </SettingsCard>

            <div className="flex justify-end">
              <button type="button" className="font-bricolage inline-flex h-12 items-center justify-center rounded-full bg-black px-7 text-sm font-medium text-white hover:bg-black/80">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white p-6">
      <div className="mb-6 flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h2 className="font-bricolage text-carbon-900 text-lg font-medium">{title}</h2>
          <p className="text-carbon-500 mt-1 text-sm">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-carbon-900 mb-2 block text-sm font-medium">{label}</span>
      <input
        defaultValue={defaultValue}
        className="contact-field-control border-border-default h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none focus:border-black"
      />
    </label>
  );
}

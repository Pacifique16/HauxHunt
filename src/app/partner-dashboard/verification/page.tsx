import type { Metadata } from "next";

import { DashboardShell } from "@/components/partner/dashboard-shell";
import { PartnerVerificationForm } from "@/components/partner/partner-verification-form";

export const metadata: Metadata = {
  title: "Verification | Partner dashboard | HauxHunt",
  description:
    "Submit your identity and listing authority for HauxHunt verification.",
};

export default function PartnerVerificationPage() {
  return (
    <DashboardShell initialSection="verification">
      <PartnerVerificationForm />
    </DashboardShell>
  );
}

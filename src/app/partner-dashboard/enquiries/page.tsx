import { DashboardShell } from "@/components/partner/dashboard-shell";
import { EnquiriesCalendarDashboard } from "@/components/partner/enquiries-calendar-dashboard";

export default function Page() {
  return (
    <DashboardShell initialSection="enquiries">
      <EnquiriesCalendarDashboard />
    </DashboardShell>
  );
}

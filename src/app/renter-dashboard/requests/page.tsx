import { redirect } from "next/navigation";

export default function RequestsPage() {
  redirect("/renter-dashboard/saved-searches?tab=requests");
}

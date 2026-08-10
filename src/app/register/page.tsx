import type { Metadata } from "next";

import { AuthenticationPage } from "@/components/auth/authentication-page";

export const metadata: Metadata = {
  title: "Create an account | HauxHunt",
  description:
    "Create a HauxHunt account as a renter, property manager, or agent.",
};

export default function RegisterPage() {
  return <AuthenticationPage mode="register" />;
}

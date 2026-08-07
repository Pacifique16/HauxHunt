import type { Metadata } from "next";

import { AuthenticationPage } from "@/components/auth/authentication-page";

export const metadata: Metadata = {
  title: "Create an account | HauxHunt",
  description:
    "Create a HauxHunt account as a renter, landlord, broker, or real estate agency.",
};

export default function RegisterPage() {
  return <AuthenticationPage mode="register" />;
}

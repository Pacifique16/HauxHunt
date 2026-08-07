import type { Metadata } from "next";

import { AuthenticationPage } from "@/components/auth/authentication-page";

export const metadata: Metadata = {
  title: "Login | HauxHunt",
  description: "Login to your HauxHunt account.",
};

export default function LoginPage() {
  return <AuthenticationPage mode="login" />;
}

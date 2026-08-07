import { Landmark } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AuthenticationForm } from "@/components/auth/authentication-form";

type AuthenticationPageProps = {
  mode: "login" | "register";
};

export function AuthenticationPage({ mode }: AuthenticationPageProps) {
  const isRegister = mode === "register";

  return (
    <>
      <Navbar />
      <main className="bg-carbon-50 min-h-svh pt-24">
        <section className="px-5 py-14 sm:px-6 sm:py-20 lg:px-11 xl:px-[52px]">
          <div className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="relative overflow-hidden bg-black p-8 text-white sm:p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:18px_18px] opacity-20"
              />
              <div className="relative z-10 flex h-full min-h-72 flex-col">
                <span className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <Landmark aria-hidden="true" className="size-5" />
                </span>
                <h1 className="font-bricolage mt-8 text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.055em]">
                  {isRegister ? "Join HauxHunt." : "Welcome back."}
                </h1>
                <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
                  {isRegister
                    ? "One trusted account for finding houses, listing properties, and working with serious renters and buyers."
                    : "Continue your property search, manage saved houses, or return to your listings."}
                </p>
                <p className="mt-auto pt-10 text-xs leading-5 text-white/45">
                  Accounts for renters, landlords, brokers, and real estate
                  agencies.
                </p>
              </div>
            </aside>

            <div className="p-6 sm:p-10 lg:p-12">
              <AuthenticationForm mode={mode} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

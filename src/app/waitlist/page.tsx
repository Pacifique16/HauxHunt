"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";

import agreedImage from "@/assets/images/agreed.png";
import peopleImage from "@/assets/images/waitlist1.png";
import waitlistImage from "@/assets/images/waitlist.png";
import { Wordmark } from "@/components/layout/wordmark";
import { HistoryBackButton } from "@/components/navigation/history-back-button";

type WaitlistDetails = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

const EMPTY_DETAILS: WaitlistDetails = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
};

export default function WaitlistPage() {
  const [joined, setJoined] = useState(false);
  const [details, setDetails] = useState(EMPTY_DETAILS);

  function joinWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    setJoined(true);
  }

  function updateDetail(field: keyof WaitlistDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="relative h-svh overflow-hidden bg-white text-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-[48rem] w-[min(72vw,64rem)] opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.09) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(ellipse at 100% 0%, black 0%, rgba(0,0,0,.85) 26%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 100% 0%, black 0%, rgba(0,0,0,.85) 26%, transparent 72%)",
        }}
      />

      <header className="relative z-10 mx-auto flex h-[86px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="HauxHunt home" className="w-fit">
          <Wordmark height={42} />
        </Link>
        <HistoryBackButton
          fallbackHref="/"
          className="font-bricolage inline-flex h-10 items-center gap-0.5 text-sm font-medium text-black/60 transition-colors hover:text-black"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Back
        </HistoryBackButton>
      </header>

      <section className="relative z-10 h-[calc(100svh-86px)] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto grid h-full w-full max-w-[1500px] items-center gap-8 py-4 sm:py-6 lg:grid-cols-[1.2fr_0.8fr] xl:gap-14">
          <div
            aria-label="HauxHunt feature cards"
            className="relative hidden h-[min(40svh,390px)] min-h-[320px] -translate-y-28 lg:block xl:-translate-y-32"
          >
            <div className="waitlist-cube-scene absolute top-[2%] left-[29%]">
              <div className="waitlist-feature-cube">
                <FeatureCard
                  label="HauxHunt"
                  title="Find your fit."
                  tone="lime"
                  face="front"
                />
                <FeatureCard
                  label="Clear details"
                  title="Know before you go."
                  tone="green"
                  face="right"
                />
                <FeatureCard
                  label="Saved homes"
                  title="Keep favourites close."
                  tone="white"
                  face="back"
                />
                <FeatureCard
                  label="Trusted listings"
                  title="Move with clarity."
                  tone="lime"
                  face="left"
                />
                <FeatureCard
                  label="Your next move"
                  title="Start somewhere good."
                  tone="dark"
                  face="top"
                />
                <FeatureCard
                  label="24/7 access"
                  title="Welcome home."
                  tone="green"
                  face="bottom"
                />
              </div>
            </div>
            <Image
              src={peopleImage}
              alt="People joining the HauxHunt community"
              className="absolute top-[110%] left-[14%] h-44 w-auto translate-y-8 object-contain xl:h-52"
            />
          </div>

          <div className="relative mx-auto w-full max-w-md">
            {joined ? (
              <div className="py-8 text-center" role="status">
                <Image
                  src={agreedImage}
                  alt="Waitlist registration confirmed"
                  className="mx-auto h-52 w-auto object-contain sm:h-64"
                />
                <h2 className="font-bricolage text-carbon-900 mt-5 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                  You&apos;re on the list.
                </h2>
                <p className="text-carbon-600 mx-auto mt-4 max-w-md leading-7">
                  Thanks, {details.fullName}. We&apos;ll send launch and
                  early-access updates to {details.email}.
                </p>
              </div>
            ) : (
              <div>
                <Image
                  src={waitlistImage}
                  alt=""
                  className="absolute -top-32 -left-36 h-44 w-auto rotate-[20deg] object-contain object-left xl:-top-40 xl:-left-44 xl:h-52"
                />
                <h2 className="font-bricolage text-carbon-900 text-[clamp(2.8rem,5vw,4.7rem)] leading-[0.92] font-medium tracking-[-0.055em]">
                  Join the waitlist.
                </h2>
                <p className="text-carbon-500 mt-4 max-w-md text-sm leading-6">
                  Be first in line. We&apos;ll notify you when HauxHunt is ready
                  for you.
                </p>

                <form onSubmit={joinWaitlist} className="mt-7 space-y-3.5">
                  <WaitlistField
                    label="Full name"
                    name="fullName"
                    autoComplete="name"
                    value={details.fullName}
                    onChange={(value) => updateDetail("fullName", value)}
                    placeholder="Your full name"
                  />
                  <WaitlistField
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={details.email}
                    onChange={(value) => updateDetail("email", value)}
                    placeholder="you@example.com"
                  />
                  <WaitlistField
                    label="Phone number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={(value) => updateDetail("phone", value)}
                    placeholder="+250 7XX XXX XXX"
                  />
                  <label className="block">
                    <span className="text-carbon-700 mb-1.5 block text-sm font-medium">
                      Role
                    </span>
                    <span className="relative block">
                      <select
                        name="role"
                        value={details.role}
                        onChange={(event) =>
                          updateDetail("role", event.target.value)
                        }
                        required
                        className="h-10 w-full appearance-none rounded-lg border-0 bg-black/[0.035] px-3.5 pr-10 text-sm text-black transition-colors outline-none focus:bg-black/[0.055] focus:ring-0"
                      >
                        <option value="" disabled>
                          Select your role
                        </option>
                        <option value="renter">Renter</option>
                        <option value="owner">Property owner</option>
                        <option value="property_manager">
                          Property manager
                        </option>
                        <option value="agent">Agent</option>
                      </select>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
                      />
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="font-bricolage mt-1 h-11 w-full rounded-full bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-black/80"
                  >
                    Join the waitlist
                  </button>
                </form>
                <p className="text-carbon-400 mt-5 text-center text-xs">
                  No spam. We&apos;ll only contact you about HauxHunt access and
                  launch updates.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  label,
  tone,
  face,
}: {
  title: string;
  label: string;
  tone: "dark" | "green" | "lime" | "white";
  face: "front" | "right" | "back" | "left" | "top" | "bottom";
}) {
  const toneClass =
    tone === "lime"
      ? "bg-[#d9ff35] text-black"
      : tone === "green"
        ? "bg-[#00f58a] text-black"
        : tone === "white"
          ? "bg-white text-black"
          : "bg-[#151515] text-white";

  return (
    <article
      className={`waitlist-cube-face waitlist-cube-face--${face} overflow-hidden rounded-[1.75rem] ${toneClass}`}
    >
      <div className="flex h-full flex-col justify-between p-4 xl:p-5">
        <p className="font-bricolage text-[10px] font-medium tracking-[0.12em] uppercase opacity-45 xl:text-xs">
          {label}
        </p>
        <h2 className="font-bricolage mt-1 text-3xl leading-[0.95] font-medium tracking-[-0.04em] xl:text-4xl">
          {title}
        </h2>
      </div>
    </article>
  );
}

function WaitlistField({
  label,
  name,
  type = "text",
  autoComplete,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-carbon-700 mb-1.5 block text-sm font-medium">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="h-10 w-full rounded-lg border-0 bg-black/[0.035] px-3.5 text-sm text-black transition-colors outline-none placeholder:text-black/30 focus:bg-black/[0.055] focus:ring-0"
      />
    </label>
  );
}

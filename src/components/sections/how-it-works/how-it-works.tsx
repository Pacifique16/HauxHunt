import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Download,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

import appleStoreBadge from "../../../../Apple store badge.png";
import googlePlayBadge from "../../../../google play store badge.png";

const STEPS = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Describe your ideal home naturally or choose a location, property type, budget, and listing criteria.",
    icon: Search,
  },
  {
    number: "02",
    title: "Compare the right homes",
    description:
      "Review relevant listings with clear prices, furnishing details, floor area, and everything needed to decide.",
    icon: SlidersHorizontal,
  },
  {
    number: "03",
    title: "Connect and move forward",
    description:
      "Contact the property manager or agent behind the property and arrange your next step with confidence.",
    icon: UsersRound,
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="bg-canvas px-5 py-20 sm:px-6 sm:py-24 lg:px-11 xl:px-[52px]"
    >
      <div className="mx-auto max-w-[1562px]">
        <div className="max-w-[720px]">
          <h2
            id="how-it-works-title"
            className="font-bricolage text-carbon-900 text-[clamp(2.25rem,4vw,3.75rem)] leading-none font-normal tracking-[-0.04em]"
          >
            A simpler way to find your next home
          </h2>
          <p className="text-body-m text-carbon-600 mt-4 max-w-[58ch]">
            Search, compare, and connect in one clear experience—from your first
            idea to the right property.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {STEPS.map(({ number, title, description, icon: Icon }) => (
            <li
              key={number}
              className="border-border-default rounded-2xl border bg-white p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-bricolage text-carbon-500 text-sm font-medium">
                  {number}
                </span>
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="text-carbon-900 size-7"
                />
              </div>
              <h3 className="font-bricolage text-carbon-900 mt-10 text-2xl font-medium tracking-[-0.025em]">
                {title}
              </h3>
              <p className="text-body-m text-carbon-600 mt-3">{description}</p>
            </li>
          ))}
        </ol>

        <div className="partner-app-panel mt-16 grid overflow-hidden rounded-3xl lg:grid-cols-2">
          <div className="border-b border-white/12 p-7 sm:p-10 lg:border-r lg:border-b-0 lg:p-12">
            <Building2
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-8 text-white"
            />
            <h3 className="font-bricolage mt-8 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-normal tracking-[-0.035em] text-white">
              Grow your property business with HauxHunt
            </h3>
            <p className="text-body-m mt-4 max-w-[54ch] text-white/65">
              Property managers and agents can reach serious home seekers,
              manage listings, and respond to property requests in one place.
            </p>
            <Link
              href="/register"
              className="font-bricolage bg-carbon-0 text-carbon-900 hover:bg-carbon-100 mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-base font-medium transition-colors duration-150"
            >
              Join us now
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <Download
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-8 text-white"
            />
            <h3 className="font-bricolage mt-8 text-[clamp(1.75rem,3vw,2.75rem)] leading-tight font-normal tracking-[-0.035em] text-white">
              Take your home search anywhere
            </h3>
            <p className="text-body-m mt-4 max-w-[52ch] text-white/65">
              Save listings, receive new-match alerts, and contact property
              professionals wherever you are with the HauxHunt app.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/download/android"
                aria-label="Get HauxHunt on Google Play"
                className="relative h-11 w-40 overflow-hidden rounded-lg transition-transform duration-150 hover:-translate-y-0.5"
              >
                <Image
                  src={googlePlayBadge}
                  alt="Get it on Google Play"
                  placeholder="blur"
                  className="absolute top-[-59px] left-[-48px] h-[171px] w-64 max-w-none"
                />
              </Link>
              <Link
                href="/download/ios"
                aria-label="Download HauxHunt on the App Store"
                className="relative h-[46px] w-40 overflow-hidden rounded-lg transition-transform duration-150 hover:-translate-y-0.5"
              >
                <Image
                  src={appleStoreBadge}
                  alt="Download on the App Store"
                  placeholder="blur"
                  className="absolute top-[-40px] left-[-19px] h-[132px] w-[198px] max-w-none"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Apple,
  Building2,
  Download,
  Play,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

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
      "Contact the landlord, broker, or agency behind the property and arrange your next step with confidence.",
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
              Brokers, real estate agencies, and landlords can reach serious
              home seekers, manage listings, and respond to property requests in
              one place.
            </p>
            <Link
              href="/partners"
              className="font-bricolage bg-carbon-0 text-carbon-900 hover:bg-carbon-100 mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-base font-medium transition-colors duration-150"
            >
              Join as a partner
              <ArrowRight aria-hidden="true" className="size-4" />
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/download/ios"
                aria-label="Download HauxHunt on the App Store"
                className="hover:bg-carbon-950 inline-flex h-16 min-w-[210px] items-center gap-3 rounded-xl border border-white/25 bg-black px-4 text-white shadow-sm transition-colors duration-150"
              >
                <Apple
                  aria-hidden="true"
                  className="size-8 shrink-0"
                  fill="currentColor"
                />
                <span className="text-left">
                  <span className="block text-[10px] leading-none tracking-wide text-white/75">
                    Download on the
                  </span>
                  <span className="font-bricolage mt-1 block text-xl leading-none font-medium">
                    App Store
                  </span>
                </span>
              </Link>
              <Link
                href="/download/android"
                aria-label="Get HauxHunt on Google Play"
                className="hover:bg-carbon-950 order-first inline-flex h-16 min-w-[210px] items-center gap-3 rounded-xl border border-white/25 bg-black px-4 text-white shadow-sm transition-colors duration-150"
              >
                <Play
                  aria-hidden="true"
                  className="size-8 shrink-0"
                  fill="currentColor"
                />
                <span className="text-left">
                  <span className="block text-[10px] leading-none tracking-wide text-white/75">
                    GET IT ON
                  </span>
                  <span className="font-bricolage mt-1 block text-xl leading-none font-medium">
                    Google Play
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

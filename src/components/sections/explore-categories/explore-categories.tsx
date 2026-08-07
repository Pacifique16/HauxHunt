import {
  Building2,
  Castle,
  DoorOpen,
  House,
  KeyRound,
  UsersRound,
} from "lucide-react";

import { CategoryCard } from "./category-card";

const CATEGORIES = [
  {
    title: "Houses for rent",
    count: 286,
    href: "/search?category=houses-for-rent",
    icon: KeyRound,
  },
  {
    title: "Apartments",
    count: 341,
    href: "/search?category=apartments",
    icon: Building2,
  },
  {
    title: "Studio apartments",
    count: 128,
    href: "/search?category=studios",
    icon: DoorOpen,
  },
  {
    title: "Shared apartments",
    count: 94,
    href: "/search?category=shared-apartments",
    icon: UsersRound,
  },
  {
    title: "Villas & mansions",
    count: 67,
    href: "/search?category=villas-and-mansions",
    icon: Castle,
  },
  {
    title: "Houses for sale",
    count: 152,
    href: "/search?category=houses-for-sale",
    icon: House,
  },
] as const;

export function ExploreCategories() {
  return (
    <section
      aria-labelledby="explore-categories-title"
      className="category-atmosphere relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 lg:px-11 xl:px-[52px]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1600 650"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] w-full text-black opacity-[0.1]"
      >
        <defs>
          <path
            id="category-wave-a"
            d="M-120 105 C260 20 470 80 700 330 S1090 575 1720 205"
          />
          <path
            id="category-wave-b"
            d="M-100 490 C250 285 430 640 790 505 S1080 160 1710 330"
          />
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {Array.from({ length: 14 }, (_, index) => (
            <use
              key={`wave-a-${index}`}
              href="#category-wave-a"
              transform={`translate(0 ${index * 14})`}
            />
          ))}
          {Array.from({ length: 11 }, (_, index) => (
            <use
              key={`wave-b-${index}`}
              href="#category-wave-b"
              transform={`translate(0 ${index * 13})`}
            />
          ))}
        </g>
      </svg>

      <div className="relative z-10 mx-auto max-w-[1562px]">
        <h2
          id="explore-categories-title"
          className="font-bricolage text-carbon-900 text-[clamp(2rem,3vw,3rem)] leading-none font-normal tracking-[-0.035em]"
        >
          Explore by Category
        </h2>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}

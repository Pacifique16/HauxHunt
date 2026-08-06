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
    href: "/rent?type=house",
    icon: KeyRound,
  },
  {
    title: "Apartments",
    count: 341,
    href: "/rent?type=apartment",
    icon: Building2,
  },
  {
    title: "Studio apartments",
    count: 128,
    href: "/rent?type=studio",
    icon: DoorOpen,
  },
  {
    title: "Shared apartments",
    count: 94,
    href: "/rent?type=shared-apartment",
    icon: UsersRound,
  },
  {
    title: "Villas & mansions",
    count: 67,
    href: "/rent?type=villa",
    icon: Castle,
  },
  {
    title: "Houses for sale",
    count: 152,
    href: "/buy?type=house",
    icon: House,
  },
] as const;

export function ExploreCategories() {
  return (
    <section
      aria-labelledby="explore-categories-title"
      className="category-atmosphere px-5 py-16 sm:px-6 sm:py-20 lg:px-11 xl:px-[52px]"
    >
      <div className="mx-auto max-w-[1562px]">
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

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type CategoryCardProps = {
  title: string;
  count: number;
  href: string;
  icon: LucideIcon;
};

export function CategoryCard({
  title,
  count,
  href,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      aria-label={`Explore ${count}+ available properties in ${title}`}
      className="category-glass hover:border-carbon-900 group flex min-h-[170px] flex-col rounded-2xl p-6 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className="text-carbon-900 size-7"
      />

      <h3 className="font-bricolage text-carbon-900 mt-7 text-xl font-medium tracking-[-0.02em]">
        {title}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-4 pt-3">
        <p className="text-body-s text-carbon-600">
          {count.toLocaleString()}+ properties available
        </p>
        <ArrowRight
          aria-hidden="true"
          className="text-carbon-600 size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

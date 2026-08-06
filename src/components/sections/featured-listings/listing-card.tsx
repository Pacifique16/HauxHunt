"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Bath, BedDouble, Expand, Heart, MapPin, Sofa } from "lucide-react";

type ListingCardProps = {
  title: string;
  location: string;
  price: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: boolean;
  saves: number;
  image: StaticImageData;
  href: string;
  focalPoint?: string;
};

export function ListingCard({
  title,
  location,
  price,
  period,
  bedrooms,
  bathrooms,
  area,
  furnished,
  saves,
  image,
  href,
  focalPoint = "50% 55%",
}: ListingCardProps) {
  const [liked, setLiked] = useState(false);
  const [savedCount, setSavedCount] = useState(saves);

  function toggleSaved() {
    setLiked((current) => {
      setSavedCount((count) => count + (current ? -1 : 1));
      return !current;
    });
  }

  return (
    <article className="listing-glass group relative overflow-hidden rounded-2xl">
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            style={{ objectPosition: focalPoint }}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <h3 className="font-bricolage text-carbon-900 text-xl leading-tight font-medium tracking-[-0.02em]">
                {title}
              </h3>
              <p className="text-carbon-600 mt-2 flex items-center gap-1.5 text-sm">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                {location}
              </p>
            </div>
            <p className="text-carbon-900 shrink-0 text-right">
              <span className="font-bricolage block text-lg font-medium">
                {price}
              </span>
              <span className="text-carbon-500 text-xs">{period}</span>
            </p>
          </div>

          <dl className="border-carbon-900/10 text-carbon-600 mt-6 flex items-center justify-between gap-2 border-t pt-5 text-xs">
            <Fact icon={BedDouble} value={`${bedrooms} beds`} />
            <Fact icon={Bath} value={`${bathrooms} baths`} />
            <Fact icon={Expand} value={`${area} m²`} />
            <Fact icon={Sofa} value={furnished ? "Furnished" : "Unfurnished"} />
          </dl>
        </div>
      </Link>

      <button
        type="button"
        aria-label={liked ? `Remove ${title} from favorites` : `Save ${title}`}
        aria-pressed={liked}
        onClick={toggleSaved}
        className="absolute top-4 right-4 z-10 flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-white/35 bg-black/40 px-3 text-white opacity-100 backdrop-blur-md transition-[background-color,transform,opacity] duration-150 hover:scale-105 hover:bg-black/60 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
      >
        <Heart
          aria-hidden="true"
          className="size-5"
          fill={liked ? "currentColor" : "none"}
        />
        <span className="font-bricolage text-xs tabular-nums">
          {savedCount}
        </span>
      </button>
    </article>
  );
}

type FactProps = {
  icon: typeof BedDouble;
  value: string;
};

function Fact({ icon: Icon, value }: FactProps) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
      <dt className="sr-only">Property detail</dt>
      <dd>{value}</dd>
    </div>
  );
}

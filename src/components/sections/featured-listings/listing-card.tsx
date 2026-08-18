"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  MapPin,
  Sofa,
  X,
} from "lucide-react";
import loginIllustration from "@/assets/images/login.png";
import { CurrencyAmount } from "@/components/currency/currency-selector";
import { useSavedProperty } from "@/hooks/use-saved-properties";

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
  images?: StaticImageData[];
  href: string;
  focalPoint?: string;
  requiresLogin?: boolean;
  propertyId?: string;
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
  images,
  href,
  focalPoint = "50% 55%",
  requiresLogin = false,
  propertyId,
}: ListingCardProps) {
  const slides = images && images.length > 0 ? images : [image];
  const hasMultipleSlides = slides.length > 1;
  const [activeSlide, setActiveSlide] = useState(0);
  const usdAmount = Number(price.replace(/[^0-9.]/g, ""));
  const resolvedPropertyId =
    propertyId ?? href.match(/\/properties\/([^?/#]+)/)?.[1] ?? href;
  const { saved: persistedSaved, toggleSaved: persistSaved } =
    useSavedProperty(resolvedPropertyId);
  const liked = !requiresLogin && persistedSaved;
  const [feedback, setFeedback] = useState("");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [feedbackHost, setFeedbackHost] = useState<HTMLElement | null>(null);

  function showPreviousSlide(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNextSlide(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setActiveSlide((current) => (current + 1) % slides.length);
  }

  function showSlide(event: React.MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    setActiveSlide(index);
  }

  useEffect(() => {
    const connectHost = window.setTimeout(
      () => setFeedbackHost(document.body),
      0,
    );
    return () => window.clearTimeout(connectHost);
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 3000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function toggleSaved() {
    if (requiresLogin) {
      setAuthPromptOpen(true);
      return;
    }

    const nextSaved = persistSaved();
    setFeedback(
      nextSaved
        ? "Home added to your favourites"
        : "Home removed from your favourites",
    );
  }

  return (
    <article className="listing-glass group relative overflow-hidden rounded-2xl">
      {feedbackHost
        ? createPortal(
            <>
              <AnimatePresence>
                {feedback ? (
                  <motion.div
                    key={feedback}
                    role="status"
                    initial={{ opacity: 0, y: 22, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="feedback-toast"
                  >
                    {feedback}
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <AnimatePresence>
                {authPromptOpen ? (
                  <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="save-auth-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[160] flex items-center justify-center bg-black/35 p-5"
                    onClick={() => setAuthPromptOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="relative flex h-48 items-center justify-center bg-black/[0.045] px-8 pt-3">
                        <Image
                          src={loginIllustration}
                          alt=""
                          className="h-full w-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setAuthPromptOpen(false)}
                          aria-label="Close"
                          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full border border-black/15 bg-white/80"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="p-7 sm:p-9">
                        <h2
                          id="save-auth-title"
                          className="font-bricolage text-3xl leading-tight font-medium tracking-[-0.035em]"
                        >
                          Keep favourite homes with an account.
                        </h2>
                        <p className="text-carbon-600 mt-3 text-sm leading-6">
                          Log in or create a HauxHunt account to add this home
                          to your favourites and find it again from any device.
                        </p>
                        <div className="mt-7 flex gap-3">
                          <Link
                            href={`/register?returnTo=${encodeURIComponent("/renter-dashboard/saved")}&save=${encodeURIComponent(resolvedPropertyId)}${persistedSaved ? "&already=1" : ""}`}
                            className="font-bricolage flex h-12 flex-1 items-center justify-center rounded-full border border-black/20 px-5 font-medium"
                          >
                            Sign up
                          </Link>
                          <Link
                            href={`/login?returnTo=${encodeURIComponent("/renter-dashboard/saved")}&save=${encodeURIComponent(resolvedPropertyId)}${persistedSaved ? "&already=1" : ""}`}
                            className="font-bricolage flex h-12 flex-1 items-center justify-center rounded-full bg-black px-5 font-medium text-white"
                          >
                            Log in
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </>,
            feedbackHost,
          )
        : null}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={href}
          aria-label={`View details for ${title}`}
          className="absolute inset-0 block"
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {slides.map((slideImage, index) => (
              <div key={index} className="relative h-full w-full shrink-0">
                <Image
                  src={slideImage}
                  alt={`${title} photo ${index + 1} of ${slides.length}`}
                  fill
                  placeholder="blur"
                  priority={index === 0}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  style={{ objectPosition: focalPoint }}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </Link>

        {hasMultipleSlides ? (
          <>
            <button
              type="button"
              onClick={showPreviousSlide}
              aria-label="Previous photo"
              className="absolute top-1/2 left-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur-md transition-[background-color,opacity] duration-150 hover:bg-black/65 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={showNextSlide}
              aria-label="Next photo"
              className="absolute top-1/2 right-2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-100 backdrop-blur-md transition-[background-color,opacity] duration-150 hover:bg-black/65 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
            <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => showSlide(event, index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === activeSlide}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <Link href={href} className="block">
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
                {Number.isFinite(usdAmount) ? (
                  <CurrencyAmount usdAmount={usdAmount} />
                ) : (
                  price
                )}
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

          <span className="font-bricolage text-carbon-900 mt-5 flex items-center gap-1.5 text-sm font-medium">
            View property
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </span>
        </div>
      </Link>

      <button
        type="button"
        aria-label={
          liked
            ? `Remove ${title} from favourites`
            : `Add ${title} to favourites`
        }
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
          {saves + (liked ? 1 : 0)}
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

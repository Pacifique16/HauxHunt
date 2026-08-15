"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function PropertyGallery({
  images,
  title,
}: {
  images: StaticImageData[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="grid h-[420px] gap-3 overflow-hidden md:grid-cols-2 lg:h-[560px]">
        <GalleryButton
          image={images[0]}
          title={title}
          index={0}
          priority
          className="relative md:row-span-2"
          onOpen={setActiveIndex}
        />
        <div className="hidden grid-cols-2 gap-3 md:grid">
          <GalleryButton
            image={images[1]}
            title={title}
            index={1}
            onOpen={setActiveIndex}
          />
          <GalleryButton
            image={images[2]}
            title={title}
            index={2}
            onOpen={setActiveIndex}
          />
        </div>
        <GalleryButton
          image={images[3]}
          title={title}
          index={3}
          className="relative hidden md:block"
          onOpen={setActiveIndex}
        >
          <span className="pointer-events-none absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-medium text-white">
            +{Math.max(0, images.length - 4)} more photos
          </span>
        </GalleryButton>
      </div>

      {activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo preview`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-[1px] sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close photo preview"
            autoFocus
            className="absolute top-4 right-4 z-20 flex size-12 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black sm:top-6 sm:right-6"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <div
            className="relative aspect-[4/3] overflow-visible"
            style={{ width: "min(900px, 82vw, calc(72vh * 4 / 3))" }}
          >
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + images.length) % images.length,
                )
              }
              aria-label="Previous photo"
              className="absolute top-1/2 left-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black sm:-left-16"
            >
              <ChevronLeft aria-hidden="true" className="size-6" />
            </button>

            <div className="relative size-full overflow-hidden rounded-xl bg-black shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
              <Image
                src={images[activeIndex]}
                alt={`${title} property view ${activeIndex + 1}`}
                fill
                priority
                sizes="(min-width: 1024px) 900px, 82vw"
                className="object-cover"
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-md">
                {activeIndex + 1} / {images.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              aria-label="Next photo"
              className="absolute top-1/2 right-3 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black sm:-right-16"
            >
              <ChevronRight aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function GalleryButton({
  image,
  title,
  index,
  onOpen,
  priority = false,
  className = "relative",
  children,
}: {
  image: StaticImageData;
  title: string;
  index: number;
  onOpen: (index: number) => void;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Preview ${title} photo ${index + 1}`}
      className={`${className} group overflow-hidden text-left`}
    >
      <Image
        src={image}
        alt={`${title} property view`}
        fill
        priority={priority}
        placeholder="blur"
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
      />
      {children}
    </button>
  );
}

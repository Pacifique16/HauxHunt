"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronLeft, Plus, X } from "lucide-react";

import { PROPERTY_AMENITIES } from "@/components/properties/list-property-form";
import houseOne from "@/assets/images/house1.jpg";
import houseTwo from "@/assets/images/house2.jpg";
import houseThree from "@/assets/images/house3.jpg";
import houseFour from "@/assets/images/house4.jpg";
import houseFive from "@/assets/images/house5.jpg";
import houseSix from "@/assets/images/house6.jpeg";

const SELECTED_AMENITIES = [
  "Parking",
  "Security",
  "Backup power",
  "Water tank",
  "Hot water",
  "Fibre internet",
  "Fitted kitchen",
  "Built-in wardrobes",
];

const CURRENT_PHOTOS = [
  { id: "current-1", src: houseOne, name: "Exterior" },
  { id: "current-2", src: houseTwo, name: "Living room" },
  { id: "current-3", src: houseThree, name: "Bedroom" },
  { id: "current-4", src: houseFour, name: "Kitchen" },
  { id: "current-5", src: houseFive, name: "Bathroom" },
  { id: "current-6", src: houseSix, name: "Garden" },
];

export function EditListingForm({ listingTitle }: { listingTitle: string }) {
  const router = useRouter();
  const [amenities, setAmenities] = useState(SELECTED_AMENITIES);
  const [photos, setPhotos] =
    useState<
      Array<{ id: string; src: StaticImageData | string; name: string }>
    >(CURRENT_PHOTOS);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const availableSlots = Math.max(0, 10 - photos.length);
    if (files.length > availableSlots) {
      setPhotoError(
        availableSlots === 0
          ? "This listing already has the maximum of 10 photos."
          : `You can add only ${availableSlots} more ${availableSlots === 1 ? "photo" : "photos"}.`,
      );
    } else {
      setPhotoError("");
    }
    const additions = Array.from(files)
      .slice(0, availableSlots)
      .map((file) => ({
        id: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        name: file.name,
      }));
    setPhotos((current) => [...current, ...additions]);
  }

  function removePhoto(photoId: string) {
    setPhotoError("");
    setPhotos((current) => {
      const photo = current.find((item) => item.id === photoId);
      if (photo && typeof photo.src === "string")
        URL.revokeObjectURL(photo.src);
      return current.filter((item) => item.id !== photoId);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => router.push("/partner-dashboard/listings"), 900);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="font-bricolage text-carbon-600 hover:text-carbon-900 mt-6 inline-flex h-10 items-center gap-1.5 text-sm font-medium"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        Back
      </button>
      <form
        onSubmit={handleSubmit}
        className="mt-3 rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-10 lg:p-12"
      >
        <EditSection title="Property details">
          <div className="grid gap-5 sm:grid-cols-2">
            <EditField
              label="Listing title"
              name="title"
              defaultValue={listingTitle}
              className="sm:col-span-2"
              required
            />
            <EditSelect
              label="Property type"
              name="propertyType"
              defaultValue="House"
              options={["House", "Apartment", "Duplex", "Studio", "Villa"]}
            />
            <EditSelect
              label="Furnishing"
              name="furnishing"
              defaultValue="Furnished"
              options={["Furnished", "Partly furnished", "Unfurnished"]}
            />
            <EditField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              defaultValue="3"
              required
            />
            <EditField
              label="Bathrooms"
              name="bathrooms"
              type="number"
              defaultValue="2"
              required
            />
            <EditField
              label="Floor area (m²)"
              name="area"
              type="number"
              defaultValue="168"
            />
          </div>
        </EditSection>

        <EditSection title="Pricing and availability">
          <div className="grid gap-5 sm:grid-cols-2">
            <EditSelect
              label="Listing purpose"
              name="purpose"
              defaultValue="For rent"
              options={["For rent"]}
            />
            <EditSelect
              label="Currency"
              name="currency"
              defaultValue="USD"
              options={["USD"]}
            />
            <EditField
              label="Price"
              name="price"
              type="number"
              defaultValue="830"
              required
            />
            <EditSelect
              label="Payment period"
              name="paymentPeriod"
              defaultValue="Per month"
              options={["Per month", "Per year"]}
            />
            <EditField
              label="Available from"
              name="availableFrom"
              type="date"
              defaultValue="2026-08-08"
              required
            />
            <EditField
              label="Minimum stay (months)"
              name="minimumStay"
              type="number"
              defaultValue="12"
            />
          </div>
        </EditSection>

        <EditSection title="Exact location">
          <div className="grid gap-5 sm:grid-cols-2">
            <EditSelect
              label="Country"
              name="country"
              defaultValue="Rwanda"
              options={["Rwanda", "Nigeria", "Kenya"]}
            />
            <EditField
              label="City"
              name="city"
              defaultValue="Kigali"
              required
            />
            <EditField
              label="Neighbourhood"
              name="neighbourhood"
              defaultValue="Kacyiru"
              required
            />
            <EditField
              label="Street address"
              name="streetAddress"
              defaultValue="KG 5 Avenue"
              required
            />
            <EditField
              label="Latitude"
              name="latitude"
              type="number"
              defaultValue="-1.9441"
              required
            />
            <EditField
              label="Longitude"
              name="longitude"
              type="number"
              defaultValue="30.0619"
              required
            />
          </div>
        </EditSection>

        <EditSection
          title="Amenities"
          headerAside={
            <span className="text-carbon-500 text-xs">
              {amenities.length} selected
            </span>
          }
        >
          <div className="grid w-full max-w-full min-w-0 touch-pan-x snap-x auto-cols-[210px] grid-flow-col grid-rows-3 gap-2 overflow-x-auto overscroll-x-contain pb-3 [contain:inline-size]">
            {PROPERTY_AMENITIES.map((amenity) => {
              const selected = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  aria-pressed={selected}
                  onClick={() =>
                    setAmenities((current) =>
                      current.includes(amenity)
                        ? current.filter((item) => item !== amenity)
                        : [...current, amenity],
                    )
                  }
                  className={`flex h-12 snap-start items-center gap-3 rounded-xl px-4 text-left text-sm whitespace-nowrap ${selected ? "bg-black text-white" : "bg-black/[0.035] text-black"}`}
                >
                  <span
                    className={`flex size-5 items-center justify-center rounded-full ${selected ? "bg-white text-black" : "bg-black/10"}`}
                  >
                    {selected ? <Check className="size-3" /> : null}
                  </span>
                  {amenity}
                </button>
              );
            })}
          </div>
          <p className="text-carbon-500 mt-2 text-xs leading-5">
            Only keep amenities that are currently available and working. Scroll
            sideways to see all options.
          </p>
          {amenities.map((amenity) => (
            <input
              key={amenity}
              type="hidden"
              name="amenities"
              value={amenity}
            />
          ))}
        </EditSection>

        <EditSection title="Description and photos" showBorder={false}>
          <label>
            <span className="text-carbon-900 mb-2 block text-sm font-medium">
              Property description
            </span>
            <textarea
              name="description"
              rows={6}
              defaultValue="A thoughtfully presented home with bright living spaces, practical room proportions, and convenient access to everyday essentials."
              className="w-full resize-y rounded-xl border-0 bg-black/[0.035] px-4 py-3 outline-none focus:bg-black/[0.055]"
            />
          </label>
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm font-medium">Property photos</p>
            <p className="text-carbon-500 text-xs">
              {photos.length} of 10 photos
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <figure
                key={photo.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/[0.04]"
              >
                <Image
                  src={photo.src}
                  alt={photo.name}
                  fill
                  unoptimized={typeof photo.src === "string"}
                  className="object-cover"
                />
                {index === 0 ? (
                  <div className="absolute inset-x-0 bottom-0 flex items-center bg-gradient-to-t from-black/70 to-transparent px-3 pt-8 pb-3 text-white">
                    <span className="text-xs">Cover photo</span>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove ${photo.name}`}
                  className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white text-black shadow-md"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </figure>
            ))}
            {photos.length < 10 ? (
              <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-black/[0.025] text-center transition-colors hover:bg-black/[0.05]">
                <span className="flex size-10 items-center justify-center rounded-full bg-black text-white">
                  <Plus aria-hidden="true" className="size-5" />
                </span>
                <span className="font-bricolage mt-3 text-sm font-medium">
                  Add photos
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    addPhotos(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
            ) : null}
          </div>
          <p className="text-carbon-500 mt-3 text-xs">
            Remove only the outdated photos, then add their replacements. The
            first image is used as the cover.
          </p>
          {photoError ? (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600">
              {photoError}
            </p>
          ) : null}
        </EditSection>

        <div className="mt-10 flex items-center justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-bricolage h-12 px-5 font-medium text-black/60 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="font-bricolage h-12 rounded-full bg-black px-7 font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving changes…" : "Save changes"}
          </button>
        </div>
      </form>
    </>
  );
}

function EditSection({
  title,
  headerAside,
  showBorder = true,
  children,
}: {
  title: string;
  headerAside?: React.ReactNode;
  showBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`py-8 first:pt-0 last:pb-0 ${showBorder ? "border-b border-black/10" : ""}`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-bricolage text-carbon-900 text-2xl font-medium">
          {title}
        </h2>
        {headerAside}
      </div>
      {children}
    </section>
  );
}

function EditField({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <input
        {...props}
        className="h-12 w-full rounded-xl border-0 bg-black/[0.035] px-4 outline-none focus:bg-black/[0.055]"
      />
    </label>
  );
}

function EditSelect({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) {
  return (
    <label>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <span className="relative block">
        <select
          {...props}
          className="h-12 w-full appearance-none rounded-xl border-0 bg-black/[0.035] pr-11 pl-4 outline-none focus:bg-black/[0.055]"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
      </span>
    </label>
  );
}

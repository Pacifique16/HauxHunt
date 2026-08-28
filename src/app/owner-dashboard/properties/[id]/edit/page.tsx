"use client";

import { notFound, useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { ChevronLeft } from "lucide-react";

import { HistoryBackButton } from "@/components/navigation/history-back-button";
import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import {
  EditListingForm,
  type EditListingValues,
} from "@/components/partner/edit-listing-form";
import { getOwnerProperty, updateProperty } from "@/lib/owner-data";

const subscribeToHydration = () => () => {};

export default function EditOwnerPropertyPage() {
  const params = useParams<{ id: string }>();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const property = getOwnerProperty(params.id);

  if (!hydrated) {
    return (
      <OwnerDashboardShell>
        <section className="px-5 pt-5 pb-24 sm:px-6 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[980px] animate-pulse">
            <div className="h-10 w-52 rounded-lg bg-black/6" />
            <div className="mt-8 h-160 rounded-[2rem] bg-white" />
          </div>
        </section>
      </OwnerDashboardShell>
    );
  }

  if (!property) return notFound();

  const [neighbourhood = "", city = "Kigali"] = property.location
    .split(",")
    .map((part) => part.trim());
  const rentMatch = property.rent?.match(/^([A-Z]{3})\s+([\d,]+)/);

  function saveListing(values: EditListingValues) {
    if (!property) return;
    const numericPrice = Number(values.price.replace(/,/g, ""));
    const formattedPrice = Number.isFinite(numericPrice)
      ? numericPrice.toLocaleString("en-US")
      : values.price;

    updateProperty(property.id, {
      title: values.title,
      location: [values.neighbourhood, values.city].filter(Boolean).join(", "),
      type: values.propertyType,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      size: values.area,
      amenities: values.amenities,
      rent: `${values.currency} ${formattedPrice} / ${values.paymentPeriod
        .replace(/^Per\s+/i, "")
        .toLowerCase()}`,
    });
  }

  return (
    <OwnerDashboardShell>
      <section className="px-5 pt-5 pb-24 sm:px-6 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-[980px]">
          <header className="border-b border-black/10 pb-7">
            <HistoryBackButton
              fallbackHref={`/owner-dashboard/properties/${property.id}`}
              className="font-bricolage text-carbon-500 hover:text-carbon-900 inline-flex h-10 items-center gap-0.5 text-sm font-medium transition-colors"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Back
            </HistoryBackButton>
            <h1 className="dashboard-page-title text-carbon-900 mt-2">
              Edit Listing
            </h1>
            <p className="text-carbon-600 mt-3 text-base leading-7">
              Update the full listing for {property.title}. Your previously
              approved ownership documents remain attached to this listing.
            </p>
          </header>

          <EditListingForm
            listingTitle={property.title}
            initialImage={property.image}
            returnPath={`/owner-dashboard/properties/${property.id}`}
            onSave={saveListing}
            initialValues={{
              title: property.title,
              propertyType: property.type,
              furnishing: property.amenities.includes("Furnished")
                ? "Furnished"
                : "Unfurnished",
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              area: property.size,
              currency: rentMatch?.[1] ?? "RWF",
              price: rentMatch?.[2]?.replace(/,/g, "") ?? "",
              paymentPeriod: "Per month",
              availableFrom: "2026-09-01",
              minimumStay: "12",
              country: "Rwanda",
              city,
              neighbourhood,
              streetAddress: "",
              latitude: "",
              longitude: "",
              amenities: property.amenities,
              description: `A well-presented ${property.type.toLowerCase()} in ${property.location}, with practical living spaces and convenient access to local amenities.`,
            }}
          />
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

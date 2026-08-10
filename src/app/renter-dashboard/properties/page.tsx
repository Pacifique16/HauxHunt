import type { Metadata } from "next";

import {
  CataloguePage,
  type CatalogueSearchParams,
} from "@/components/listings/catalogue-page";

export const metadata: Metadata = {
  title: "Explore houses | Renter dashboard | HauxHunt",
  description: "Explore all available HauxHunt houses as a signed-in renter.",
};

export default async function RenterPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  return (
    <CataloguePage
      purpose="all"
      audience="renter"
      searchParams={await searchParams}
    />
  );
}

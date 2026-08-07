import type { Metadata } from "next";

import {
  CataloguePage,
  type CatalogueSearchParams,
} from "@/components/listings/catalogue-page";

export const metadata: Metadata = {
  title: "Houses for sale | HauxHunt",
  description: "Discover houses available to buy across Rwanda and Nigeria.",
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<CatalogueSearchParams>;
}) {
  return <CataloguePage purpose="sale" searchParams={await searchParams} />;
}

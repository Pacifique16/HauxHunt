"use client";

import { useSyncExternalStore } from "react";
import { Navbar } from "@/components/layout/navbar";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function FlatmatesNavigation({
  initialRenterView = false,
}: {
  initialRenterView?: boolean;
}) {
  const role = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem("hauxhunt-authenticated-role"),
    () => (initialRenterView ? "renter" : null),
  );

  const isRenter = initialRenterView || role === "renter";

  return isRenter ? <RenterCatalogueTopBar /> : <Navbar />;
}

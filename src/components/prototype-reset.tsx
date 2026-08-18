"use client";

import { useEffect } from "react";

export function PrototypeReset() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const isReload = navigation && navigation.type === "reload";

      if (isReload) {
        window.sessionStorage.setItem("hauxhunt-flatmate-interests", "[]");
        window.sessionStorage.setItem("hauxhunt-flatmate-not-for-me", "[]");
        window.sessionStorage.setItem("hauxhunt-flatmate-received-interests", JSON.stringify(["aline", "nadia"]));
        
        // Dispatch storage event to sync all client hooks
        window.dispatchEvent(new Event("storage"));
        console.log("Prototype co-living state reset. Starting fresh!");
      }
    }
  }, []);

  return null;
}

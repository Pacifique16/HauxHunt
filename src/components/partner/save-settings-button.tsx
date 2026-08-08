"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export function SaveSettingsButton() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const redirect = window.setTimeout(() => {
      router.push("/partner-dashboard");
    }, 1400);
    return () => window.clearTimeout(redirect);
  }, [router, saved]);

  return (
    <div className="flex flex-col items-end gap-3">
      {saved ? (
        <p
          role="status"
          className="flex items-center gap-2 text-sm font-medium text-black"
        >
          <CheckCircle2 aria-hidden="true" className="size-4" />
          Changes saved successfully. Returning to Overview…
        </p>
      ) : null}
      <button
        type="button"
        disabled={saved}
        onClick={() => setSaved(true)}
        className="font-bricolage h-12 rounded-full bg-black px-7 font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-default disabled:bg-black/65"
      >
        {saved ? "Saved" : "Save changes"}
      </button>
    </div>
  );
}

"use client";

import Image, { type StaticImageData } from "next/image";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function FlatmatePortrait({
  src,
  name,
  priority = false,
}: {
  src: StaticImageData;
  name: string;
  priority?: boolean;
}) {
  const role = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem("hauxhunt-authenticated-role"),
    () => null,
  );
  const isGuest = !role;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black/[0.06]">
      <Image
        src={src}
        alt={isGuest ? "Private profile photo" : `${name}'s profile photo`}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 30vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover transition-[filter,transform] duration-500 ${isGuest ? "scale-110 blur-xl" : "blur-0 scale-100"}`}
      />
    </div>
  );
}

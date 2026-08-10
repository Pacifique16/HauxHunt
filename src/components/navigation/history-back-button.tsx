"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type HistoryBackButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type"
> & {
  fallbackHref: string;
  children: ReactNode;
};

export function HistoryBackButton({
  fallbackHref,
  children,
  ...props
}: HistoryBackButtonProps) {
  const router = useRouter();

  return (
    <button
      {...props}
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
    >
      {children}
    </button>
  );
}

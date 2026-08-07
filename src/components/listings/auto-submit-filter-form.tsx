"use client";

import { useEffect, useRef } from "react";
import type { FormEvent, ReactNode } from "react";

type AutoSubmitFilterFormProps = {
  action: string;
  className: string;
  children: ReactNode;
};

export function AutoSubmitFilterForm({
  action,
  className,
  children,
}: AutoSubmitFilterFormProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const target = event.target as HTMLInputElement | HTMLSelectElement;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (target.tagName === "INPUT") {
      timerRef.current = setTimeout(() => form.requestSubmit(), 450);
      return;
    }

    form.requestSubmit();
  }

  return (
    <form action={action} className={className} onChange={handleChange}>
      {children}
    </form>
  );
}

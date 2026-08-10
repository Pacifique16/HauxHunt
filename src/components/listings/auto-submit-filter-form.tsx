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

    const fieldToClear = target.dataset.clearField;
    if (fieldToClear) {
      const field = form.elements.namedItem(fieldToClear);
      if (field instanceof HTMLInputElement) field.value = "";
    }

    if (target.dataset.noAutoSubmit === "true") {
      if (target.dataset.submitWhenEmpty === "true" && !target.value.trim()) {
        form.requestSubmit();
      }
      return;
    }

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

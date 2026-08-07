"use client";

import { useState, type FormEvent } from "react";
import { Check, ChevronDown, MessageCircle } from "lucide-react";

export function ContactLandlordForm({
  landlordName,
}: {
  landlordName: string;
}) {
  const [sent, setSent] = useState(false);
  const [country, setCountry] = useState<"UG" | "RW" | "NG">("UG");
  const countryCodes = { UG: "+256", RW: "+250", NG: "+234" } as const;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setCountry("UG");
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="font-bricolage text-carbon-900 mb-2 block text-sm font-medium">
          Your name
        </span>
        <input
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          className="contact-field-control border-border-default text-carbon-900 placeholder:text-carbon-400 h-11 w-full rounded-xl border bg-white px-4 text-sm transition-colors outline-none focus:border-black"
        />
      </label>

      <fieldset>
        <legend className="font-bricolage text-carbon-900 mb-2 text-sm font-medium">
          Phone number
        </legend>
        <div className="grid grid-cols-[82px_1fr] gap-2">
          <label className="sr-only" htmlFor="contact-country">
            Country
          </label>
          <span className="relative">
            <select
              id="contact-country"
              name="country"
              value={country}
              onChange={(event) =>
                setCountry(event.target.value as "UG" | "RW" | "NG")
              }
              className="contact-field-control border-border-default text-carbon-900 h-11 w-full appearance-none rounded-xl border bg-white py-0 pr-8 pl-3 text-sm outline-none focus:border-black"
            >
              <option value="UG">UG</option>
              <option value="RW">RW</option>
              <option value="NG">NG</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="text-carbon-500 pointer-events-none absolute top-1/2 left-10 size-4 -translate-y-1/2"
            />
          </span>
          <label className="border-border-default flex h-11 min-w-0 items-center rounded-xl border bg-white focus-within:border-black">
            <span className="border-border-subtle text-carbon-500 border-r px-3 text-sm">
              {countryCodes[country]}
            </span>
            <span className="sr-only">Phone number</span>
            <input
              name="phone"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="700000000"
              className="contact-field-control text-carbon-900 placeholder:text-carbon-400 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />
          </label>
        </div>
      </fieldset>

      <label className="block">
        <span className="font-bricolage text-carbon-900 mb-2 block text-sm font-medium">
          Your message
        </span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={`Write a message to ${landlordName}`}
          className="contact-field-control border-border-default text-carbon-900 w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-6 transition-colors outline-none focus:border-black"
        />
      </label>

      <button
        type="submit"
        className="font-bricolage bg-carbon-900 flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 font-medium text-white transition-colors hover:bg-black"
      >
        {sent ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <MessageCircle aria-hidden="true" className="size-4" />
        )}
        {sent ? "Message sent" : "Send message"}
      </button>

      {sent ? (
        <p role="status" className="text-center text-sm text-emerald-700">
          Julien will receive your enquiry and contact you shortly.
        </p>
      ) : null}
    </form>
  );
}

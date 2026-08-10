"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type DisplayCurrency = "USD" | "RWF" | "NGN" | "KES";

const CURRENCY_EVENT = "hauxhunt-currency-change";
const CURRENCIES: Array<{
  code: DisplayCurrency;
  name: string;
  symbol: string;
}> = [
  { code: "RWF", name: "Rwandan Franc", symbol: "RWF" },
  { code: "USD", name: "US Dollar", symbol: "USD" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KES" },
  { code: "NGN", name: "Nigerian Naira", symbol: "NGN" },
];

// Prototype display rates. Production should replace these with a dated rate API.
const USD_RATES: Record<DisplayCurrency, number> = {
  USD: 1,
  RWF: 1450,
  NGN: 1600,
  KES: 129,
};

function getCurrency(): DisplayCurrency {
  const saved = window.localStorage.getItem("hauxhunt-display-currency");
  return CURRENCIES.some((currency) => currency.code === saved)
    ? (saved as DisplayCurrency)
    : "USD";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CURRENCY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CURRENCY_EVENT, callback);
  };
}

export function useDisplayCurrency() {
  return useSyncExternalStore(subscribe, getCurrency, () => "USD" as const);
}

export function formatDisplayPrice(
  usdAmount: number,
  currency: DisplayCurrency,
) {
  const converted = usdAmount * USD_RATES[currency];
  const rounded = currency === "USD" ? Math.round(converted) : Math.round(converted);
  return `${currency} ${rounded.toLocaleString("en-US")}`;
}

export function formatCurrencyRange(
  minimumUsd: number | null,
  maximumUsd: number | null,
  currency: DisplayCurrency,
) {
  const minimum = minimumUsd == null ? null : formatDisplayPrice(minimumUsd, currency);
  const maximum = maximumUsd == null ? null : formatDisplayPrice(maximumUsd, currency);
  if (minimum === null && maximum) return `Under ${maximum}`;
  if (maximum === null && minimum) return `${minimum}+`;
  return `${minimum} – ${maximum}`;
}

export type CurrencyRange = {
  value: string;
  minimumUsd: number | null;
  maximumUsd: number | null;
};

export function CurrencyFilterSelect({
  name,
  value,
  label = "Price range",
  placeholder = "Any Price",
  ranges,
  filled = false,
  hideLabel = false,
}: {
  name: string;
  value: string;
  label?: string;
  placeholder?: string;
  ranges: CurrencyRange[];
  filled?: boolean;
  hideLabel?: boolean;
}) {
  const currency = useDisplayCurrency();

  const select = (
    <span className="relative block">
      <select
        aria-label={label}
        name={name}
        defaultValue={value}
        className={`h-12 w-full appearance-none pr-11 pl-4 text-sm ring-0 outline-none focus:ring-0 focus:outline-none ${
          filled
            ? "rounded-2xl border-0 bg-black/[0.045]"
            : "rounded-2xl border border-black/15 bg-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {ranges.map((range) => (
          <option key={range.value} value={range.value}>
            {formatCurrencyRange(
              range.minimumUsd,
              range.maximumUsd,
              currency,
            )}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-black/55"
      />
    </span>
  );

  if (filled) return <label className="block">{select}</label>;

  return (
    <label>
      <span
        className={
          hideLabel
            ? "sr-only"
            : "text-carbon-900 mb-2 block text-sm font-medium"
        }
      >
        {label}
      </span>
      {select}
    </label>
  );
}

export function CurrencyAmount({ usdAmount }: { usdAmount: number }) {
  const currency = useDisplayCurrency();
  return <>{formatDisplayPrice(usdAmount, currency)}</>;
}

export function CurrencySelector({
  inverse = false,
}: {
  inverse?: boolean;
}) {
  const currency = useDisplayCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function chooseCurrency(nextCurrency: DisplayCurrency) {
    window.localStorage.setItem("hauxhunt-display-currency", nextCurrency);
    window.dispatchEvent(new Event(CURRENCY_EVENT));
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-flex h-10 items-center">
      <button
        type="button"
        aria-label="Choose display currency"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex h-10 items-center border-0 bg-transparent p-0 text-sm font-normal shadow-none outline-none ${inverse ? "text-white" : "text-black"}`}
      >
        <span>{currency}</span>
        <ChevronDown
          aria-hidden="true"
          className={`ml-1 size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label="Currency"
          className={`absolute top-[calc(100%+0.5rem)] right-0 z-[100] w-64 overflow-hidden rounded-2xl px-2 py-2 font-sans text-black shadow-[0_18px_50px_rgba(0,0,0,0.14)] ${
            inverse
              ? "border border-white/50 bg-white/55 backdrop-blur-xl backdrop-saturate-110"
              : "border border-black/10 bg-white"
          }`}
        >
          <p className="px-3 pb-1.5 text-[11px] font-medium tracking-[0.08em] text-black/45">
            CURRENCY
          </p>
          <div className="space-y-0.5">
            {CURRENCIES.map((option) => (
              <button
                key={option.code}
                type="button"
                role="option"
                aria-selected={currency === option.code}
                onClick={() => chooseCurrency(option.code)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left font-sans transition-colors hover:bg-black/[0.045] focus-visible:bg-black/[0.045] focus-visible:outline-none"
              >
                <span>
                  <span className="block text-sm font-medium leading-5">
                    {option.name}
                  </span>
                </span>
                <span className="pl-5 text-sm text-black/45">{option.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

import { Wordmark } from "@/components/layout/wordmark";
import { CurrencySelector } from "@/components/currency/currency-selector";
import julienProfile from "../../../julien.jpg";

const RENTER_LINKS = [
  ["Discover", "/renter-dashboard"],
  ["Saved homes", "/renter-dashboard/saved"],
  ["My requests", "/renter-dashboard/requests"],
  ["Visits", "/renter-dashboard/visits"],
  ["Messages", "/renter-dashboard/messages"],
] as const;

export function RenterCatalogueTopBar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="nav-surface border-border-subtle fixed inset-x-0 top-0 z-50 h-16 border-b text-black">
      <div className="mx-auto grid h-full w-[calc(100%-2.5rem)] max-w-[1562px] grid-cols-[auto_1fr_auto] items-center gap-4 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-5.5rem)] lg:grid-cols-[1fr_auto_1fr] lg:gap-10 xl:w-[calc(100%-6.5rem)]">
        <Link href="/renter-dashboard" aria-label="HauxHunt renter home">
          <Wordmark height={38} />
        </Link>
        <nav className="hidden h-full items-center gap-8 justify-self-center text-sm font-medium lg:flex xl:gap-10">
          {RENTER_LINKS.map(([label, href]) => {
            const active =
              pathname === href ||
              (href === "/renter-dashboard" &&
                pathname.startsWith("/renter-dashboard/properties")) ||
              (href !== "/renter-dashboard" && pathname.startsWith(`${href}/`));

            return (
              <Link
                key={label}
                href={href}
                className="relative inline-flex items-center transition-opacity hover:opacity-55"
              >
                {label}
                {active ? (
                  <span className="absolute top-[calc(100%+0.28rem)] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-black" />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="relative flex items-center gap-2 justify-self-end">
          <CurrencySelector />
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-11 items-center justify-center rounded-full hover:bg-black/[0.055]"
          >
            <Bell className="size-5" />
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-black text-[0.55rem] font-bold text-white">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className="flex h-12 items-center gap-2 rounded-full pl-1 sm:pr-2"
          >
            <Image
              src={julienProfile}
              alt="Julien Mugisha"
              className="size-10 rounded-full object-cover ring-2 ring-black/10"
            />
            <span className="hidden text-sm font-medium sm:block">Julien</span>
            <ChevronDown className="hidden size-4 sm:block" />
          </button>
          {profileOpen ? (
            <div className="absolute top-[calc(100%+0.75rem)] right-0 w-72 overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)]">
              <div className="border-b border-black/10 p-5">
                <p className="font-bricolage text-lg font-medium">
                  Julien Mugisha
                </p>
                <p className="text-carbon-500 text-sm">renter@gmail.com</p>
              </div>
              <div className="p-2">
                <Link
                  href="/renter-dashboard"
                  className="flex h-11 items-center rounded-xl px-3 text-sm hover:bg-black/[0.055]"
                >
                  Renter dashboard
                </Link>
                <Link
                  href="/login"
                  onClick={() => {
                    window.sessionStorage.removeItem(
                      "hauxhunt-authenticated-role",
                    );
                  }}
                  className="flex h-11 items-center rounded-xl px-3 text-sm hover:bg-black/[0.055]"
                >
                  Sign out
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

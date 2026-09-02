"use client";

import Link from "next/link";
import { Wordmark } from "./wordmark";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 lg:h-24">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full w-[calc(100%-2.5rem)] max-w-[1562px] items-center justify-between sm:w-[calc(100%-3rem)] lg:w-[calc(100%-5.5rem)] xl:w-[calc(100%-6.5rem)]"
      >
        <Link href="/" aria-label="HauxHunt — home" className="w-fit invert">
          <Wordmark height={48} />
        </Link>
        <Link
          href="/waitlist"
          className="font-bricolage inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/85"
        >
          Join waitlist
        </Link>
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Wordmark } from "./wordmark";
import { useScrolled } from "@/hooks/use-scrolled";
import { authConfig, navConfig } from "@/config/site";

/**
 * Primary navigation: lockup left, sections centred, account actions right.
 *
 * The three zones are a grid rather than `justify-between`, because with
 * space-between the centre group only lands in the middle when the logo and
 * the account buttons happen to be the same width — which they are not, and
 * which would drift again the moment a label changed. `1fr auto 1fr` centres
 * the sections optically no matter what sits either side of them.
 *
 * At rest the bar is pure structure — no background, no border — so the canvas
 * runs unbroken to the top edge. Past 40px it condenses onto the same glass
 * the workspace is made of, one step denser, reading as the same material at a
 * nearer depth rather than as a second design language.
 */
export function Navbar() {
  const { scrolled, sentinelRef, threshold } = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // The panel closes from the links' own click handlers rather than from an
  // effect watching the pathname: navigation is the event, so handling it at
  // the source avoids a second render pass just to undo state.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Zero-width sentinel at the top of document flow. Once it leaves the
          viewport the nav has earned its surface. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-px"
        style={{ height: threshold }}
      />

      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,height] duration-300 ease-out",
          scrolled || menuOpen
            ? "nav-surface border-border-subtle h-16"
            : "h-20 border-transparent bg-transparent lg:h-24",
        ].join(" ")}
      >
        <nav
          aria-label="Primary"
          className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 sm:px-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:px-16"
        >
          <Link
            href="/"
            className="flex items-center justify-self-start rounded-sm"
            aria-label="HauxHunt — home"
          >
            {/* Shrinks with the bar so the lockup keeps its breathing room in
                both states rather than crowding the condensed nav. */}
            <Wordmark height={scrolled ? 44 : 60} />
          </Link>

          {/* --- Sections, centred --------------------------------------- */}
          <ul className="hidden items-center gap-9 justify-self-center lg:flex">
            {navConfig.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={[
                    "text-body-s rounded-sm transition-colors duration-150",
                    isCurrent(item.href)
                      ? "text-fg font-medium"
                      : "text-fg-tertiary hover:text-fg",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* --- Account actions, right ---------------------------------- */}
          <div className="flex items-center gap-2 justify-self-end sm:gap-5">
            <Link
              href={authConfig.login.href}
              className="text-body-s text-fg-tertiary hover:text-fg hidden rounded-sm transition-colors duration-150 sm:inline"
            >
              {authConfig.login.label}
            </Link>
            <Link
              href={authConfig.signup.href}
              className="bg-action-primary text-fg-on-brand text-body-s hover:bg-action-primary-hover active:bg-action-primary-active inline-flex h-10 items-center rounded-full px-5 font-medium transition-colors duration-150"
            >
              {authConfig.signup.label}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="text-fg hover:bg-subtle -mr-2 flex size-10 items-center justify-center rounded-full transition-colors duration-150 lg:hidden"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* --- Small-viewport panel --------------------------------------------
          The sections have to go somewhere below `lg`; hiding them with no
          disclosure would leave the site with no navigation at all on a phone,
          which is the viewport most of these visitors arrive on. */}
      {menuOpen ? (
        <div
          id="primary-menu"
          className="nav-surface border-border-subtle fixed inset-x-0 top-16 z-40 border-b lg:hidden"
        >
          <ul className="mx-auto flex w-full max-w-[1440px] flex-col px-6 py-2 sm:px-10">
            {navConfig.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={[
                    "text-body-l border-border-subtle block border-b py-4 transition-colors duration-150",
                    isCurrent(item.href)
                      ? "text-fg font-medium"
                      : "text-fg-secondary hover:text-fg",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="sm:hidden">
              <Link
                href={authConfig.login.href}
                onClick={() => setMenuOpen(false)}
                className="text-body-l text-fg-secondary hover:text-fg block py-4 transition-colors duration-150"
              >
                {authConfig.login.label}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}

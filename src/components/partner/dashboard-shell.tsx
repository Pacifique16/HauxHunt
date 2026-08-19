"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Wordmark } from "@/components/layout/wordmark";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import appIllustration from "@/assets/images/illustrated-black-man-using-mobile-phone.png";
import julienProfile from "@/assets/images/julien.jpg";
import { usePartnerRole } from "@/components/partner/use-partner-role";

type DashboardNavItem = {
  label: string;
  href: string;
  section: string;
  icon: LucideIcon;
  badge?: string;
};

const PROPERTY_MANAGER_NAV: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/partner-dashboard",
    section: "overview",
    icon: LayoutDashboard,
  },
  {
    label: "Portfolio & listings",
    href: "/partner-dashboard/listings",
    section: "listings",
    icon: Building2,
  },
  {
    label: "Performance",
    href: "/partner-dashboard/performance",
    section: "performance",
    icon: BarChart3,
  },
  {
    label: "Enquiries & calendar",
    href: "/partner-dashboard/enquiries",
    section: "enquiries",
    icon: CalendarDays,
    badge: "7",
  },
  {
    label: "Applications",
    href: "/partner-dashboard/applications",
    section: "applications",
    icon: ClipboardCheck,
    badge: "8",
  },
  {
    label: "Messages",
    href: "/partner-dashboard/messages",
    section: "messages",
    icon: MessageSquare,
    badge: "4",
  },
] as const;

const AGENT_NAV: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/partner-dashboard",
    section: "overview",
    icon: LayoutDashboard,
  },
  {
    label: "Listings & mandates",
    href: "/partner-dashboard/listings",
    section: "listings",
    icon: Building2,
  },
  {
    label: "Performance",
    href: "/partner-dashboard/performance",
    section: "performance",
    icon: BarChart3,
  },
  {
    label: "Leads & calendar",
    href: "/partner-dashboard/enquiries",
    section: "enquiries",
    icon: CalendarDays,
    badge: "7",
  },
  {
    label: "Deals",
    href: "/partner-dashboard/applications",
    section: "applications",
    icon: ClipboardCheck,
    badge: "8",
  },
  {
    label: "Messages",
    href: "/partner-dashboard/messages",
    section: "messages",
    icon: MessageSquare,
    badge: "4",
  },
];

const ACCOUNT_NAV = [
  {
    label: "Verification",
    href: "/partner-dashboard/verification",
    section: "verification",
    icon: ShieldCheck,
  },
] as const;

let rememberedSidebarCollapsed = false;

export function DashboardShell({
  children,
  initialSection = "overview",
}: {
  children: ReactNode;
  initialSection?: string;
}) {
  const [collapsed, setCollapsed] = useState(rememberedSidebarCollapsed);
  const [activeSection, setActiveSection] = useState(initialSection);
  const role = usePartnerRole();
  const dashboardNav = role === "agent" ? AGENT_NAV : PROPERTY_MANAGER_NAV;

  useEffect(() => {
    const syncHash = () =>
      setActiveSection(window.location.hash.slice(1) || initialSection);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [initialSection]);

  return (
    <main className="bg-carbon-50 min-h-svh lg:fixed lg:inset-0 lg:block lg:min-h-0 lg:overflow-hidden lg:bg-black">
      <DashboardSidebar
        dashboardNav={dashboardNav}
        collapsed={collapsed}
        activeSection={activeSection}
        onCollapse={() =>
          setCollapsed((value) => {
            rememberedSidebarCollapsed = !value;
            return !value;
          })
        }
        onNavigate={setActiveSection}
      />
      <div
        className={`bg-carbon-50 min-h-svh min-w-0 lg:absolute lg:inset-y-0 lg:right-0 lg:min-h-0 lg:overflow-x-clip lg:overflow-y-auto lg:overscroll-contain lg:rounded-tl-[2rem] lg:rounded-bl-[2rem] lg:transition-[left] lg:duration-300 ${collapsed ? "lg:left-[84px]" : "lg:left-[280px]"}`}
      >
        <MobileDashboardNav
          dashboardNav={dashboardNav}
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />
        <DashboardTopBar role={role} onNavigate={setActiveSection} />
        {children}
      </div>
    </main>
  );
}

function DashboardTopBar({
  role,
  onNavigate,
}: {
  role: "property_manager" | "agent";
  onNavigate: (section: string) => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-carbon-50/95 sticky top-0 z-30 hidden h-20 px-6 backdrop-blur-md lg:block lg:px-10 xl:px-12">
      <div className="relative mx-auto flex h-full w-full max-w-[1360px] items-center justify-end gap-2 border-b border-black/8">
        <div
          id="dashboard-topbar-status"
          className="pointer-events-none absolute top-0 left-1/2 z-40 -translate-x-1/2"
        />
        <label className="mr-auto block w-full max-w-sm">
          <span className="sr-only">Search dashboard</span>
          <span className="catalogue-location-filter flex items-center gap-2 px-4">
            <Search aria-hidden="true" className="text-carbon-500 size-4 shrink-0" />
            <input
              type="search"
              placeholder="Search"
              className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <VoiceInputButton />
          </span>
        </label>
        <Link
          href="/partner-dashboard/notifications"
          onClick={() => onNavigate("notifications")}
          aria-label="Notifications"
          className="relative mr-4 flex size-11 items-center justify-center rounded-full bg-transparent text-black"
        >
          <Bell aria-hidden="true" className="size-5" />
          <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-black text-[0.6rem] font-medium text-white ring-2 ring-white">
            6
          </span>
        </Link>
        <div className="relative ml-1">
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex size-12 items-center justify-center rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
          >
            <Image
              src={julienProfile}
              alt=""
              className="size-12 rounded-full object-cover"
            />
          </button>

          {profileOpen ? (
            <div
              role="menu"
              className="absolute top-[calc(100%+0.75rem)] right-0 w-[min(360px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-[0_20px_55px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-center gap-4 border-b border-black/10 p-5">
                <Image
                  src={julienProfile}
                  alt=""
                  className="size-12 shrink-0 rounded-full object-cover shadow-[0_4px_14px_rgba(0,0,0,0.14)]"
                />
                <div className="min-w-0">
                  <p className="font-bricolage truncate text-lg font-medium">
                    {role === "agent" ? "Alex Agent" : "Alex Partner"}
                  </p>
                  <p className="text-carbon-500 truncate text-sm">
                    {role === "agent" ? "agent@gmail.com" : "partner@gmail.com"}
                  </p>
                  <p className="text-carbon-400 mt-0.5 text-xs">
                    {role === "agent" ? "Agent" : "Property manager"}
                  </p>
                </div>
              </div>

              <div className="border-b border-black/10 p-2">
                <Link
                  href="/partner-dashboard/settings"
                  role="menuitem"
                  onClick={() => {
                    onNavigate("settings");
                    setProfileOpen(false);
                  }}
                  className="flex h-12 items-center rounded-xl bg-black/[0.045] px-3 font-medium transition-colors hover:bg-black/[0.08]"
                >
                  Account settings
                </Link>
                <Link
                  href="#terms"
                  role="menuitem"
                  onClick={() => setProfileOpen(false)}
                  className="flex h-12 items-center rounded-xl px-3 font-medium transition-colors hover:bg-black/[0.045]"
                >
                  Terms &amp; conditions
                </Link>
              </div>

              <div className="p-2">
                <Link
                  href="/login"
                  role="menuitem"
                  onClick={() => {
                    window.sessionStorage.removeItem(
                      "hauxhunt-authenticated-role",
                    );
                  }}
                  className="flex h-12 items-center justify-between rounded-xl px-3 font-medium transition-colors hover:bg-black/[0.045]"
                >
                  Log out
                  <LogOut
                    aria-hidden="true"
                    className="text-carbon-500 size-4"
                  />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function DashboardSidebar({
  dashboardNav,
  collapsed,
  activeSection,
  onCollapse,
  onNavigate,
}: {
  dashboardNav: DashboardNavItem[];
  collapsed: boolean;
  activeSection: string;
  onCollapse: () => void;
  onNavigate: (section: string) => void;
}) {
  return (
    <aside
      className={`sticky top-0 z-30 hidden h-full min-h-0 shrink-0 flex-col bg-black py-6 text-white transition-[width,padding] duration-300 lg:flex ${collapsed ? "w-[84px] overflow-visible px-3" : "w-[280px] overflow-hidden px-5"}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.07]" />
      </div>
      <div
        className={`relative z-20 flex items-center ${collapsed ? "flex-col justify-center gap-4" : "justify-between"}`}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Expand sidebar"
            className="group relative flex size-10 shrink-0 items-center justify-center"
          >
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 group-hover:opacity-0">
              <span className="invert">
                <Wordmark height={32} />
              </span>
            </span>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <PanelLeftOpen className="size-5 text-white" />
            </span>
            <span className="pointer-events-none absolute top-1/2 left-[calc(100%+1.6rem)] z-50 -translate-x-1 -translate-y-1/2 rounded-full border border-white/10 bg-[#242424] px-4 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              Expand sidebar
            </span>
          </button>
        ) : (
          <>
            <Link
              href="/"
              aria-label="HauxHunt home"
              className="shrink-0 invert transition-all w-auto"
            >
              <Wordmark height={42} />
            </Link>
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse sidebar"
              className="group relative flex size-9 shrink-0 items-center justify-center text-white/65 transition-colors hover:text-white"
            >
              <PanelLeftClose className="size-5" />
              <span className="pointer-events-none absolute top-[calc(100%+0.65rem)] right-0 z-50 -translate-y-1 rounded-full border border-white/10 bg-[#242424] px-4 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                Collapse sidebar
              </span>
            </button>
          </>
        )}
      </div>

      <nav aria-label="Partner dashboard" className="relative z-10 mt-7 flex-1">
        <ul className={`${collapsed ? "space-y-2" : "mt-2 space-y-1"}`}>
          {dashboardNav.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
              active={activeSection === item.section}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
        <ul className="mt-2 space-y-2">
          {ACCOUNT_NAV.map((item) => (
            <NavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
              active={activeSection === item.section}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      {!collapsed ? (
        <section className="relative z-10 mt-5 min-h-56 shrink-0 overflow-hidden rounded-[1.5rem] bg-[#00f58a] p-5 text-black">
          <svg
            aria-hidden="true"
            viewBox="0 0 240 224"
            className="pointer-events-none absolute inset-0 z-0 size-full translate-y-4 opacity-25"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M-24 116C33 73 73 164 134 126C178 98 205 73 264 96M-24 176C33 133 73 224 134 186C178 158 205 133 264 156"
              stroke="black"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          </svg>
          <div className="relative z-10 max-w-[135px]">
            <p className="font-bricolage text-lg leading-5 font-medium tracking-[-0.025em]">
              HauxHunt on the go.
            </p>
            <p className="mt-2 text-xs leading-4 text-black/55">
              Manage listings and enquiries anywhere.
            </p>
          </div>
          <button
            type="button"
            className="font-bricolage absolute bottom-5 left-5 z-10 inline-flex h-9 items-center justify-center rounded-full bg-black px-4 text-xs font-medium text-white"
          >
            Download App
          </button>
          <Image
            src={appIllustration}
            alt="Person using the HauxHunt mobile app"
            className="absolute -right-32 -bottom-32 z-10 h-96 w-auto max-w-none object-contain"
          />
        </section>
      ) : null}
    </aside>
  );
}

function NavItem({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: DashboardNavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate: (section: string) => void;
}) {
  return (
    <li>
      <Link
        href={item.href}
        onClick={() => onNavigate(item.section)}
        aria-current={active ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        className={`group relative flex h-11 items-center text-sm ${collapsed ? "justify-center px-0" : "gap-3 px-3"} ${
          active
            ? `bg-carbon-50 rounded-l-full rounded-r-none text-black before:absolute before:-top-5 before:right-0 before:size-5 before:rounded-br-full before:shadow-[7px_7px_0_7px_var(--color-carbon-50)] after:absolute after:right-0 after:-bottom-5 after:size-5 after:rounded-tr-full after:shadow-[7px_-7px_0_7px_var(--color-carbon-50)] ${collapsed ? "w-[calc(100%+0.75rem)] pr-3 pl-0" : "w-[calc(100%+1.25rem)] pr-8"}`
            : `text-white/58 hover:bg-white/[0.1] hover:text-white ${collapsed ? "rounded-[1rem]" : "rounded-xl"}`
        }`}
      >
        <item.icon
          aria-hidden="true"
          className={`size-[18px] shrink-0 transition-transform duration-200 ${collapsed && !active ? "group-hover:scale-110" : ""}`}
        />
        {!collapsed && (
          <span className="flex-1 whitespace-nowrap">{item.label}</span>
        )}
        {collapsed ? (
          <span className="pointer-events-none absolute top-1/2 left-[calc(100%+0.85rem)] z-50 -translate-x-1 -translate-y-1/2 rounded-full border border-white/10 bg-[#242424] px-4 py-2 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
            {item.label}
          </span>
        ) : null}
        {"badge" in item &&
          (!collapsed ? (
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-medium ${active ? "bg-black text-white" : "bg-white/10 text-white/65"}`}
            >
              {item.badge}
            </span>
          ) : (
            <span
              className={`absolute top-1 right-1 size-2 rounded-full ${active ? "bg-black" : "bg-white"}`}
            />
          ))}
      </Link>
    </li>
  );
}

function MobileDashboardNav({
  dashboardNav,
  activeSection,
  onNavigate,
}: {
  dashboardNav: DashboardNavItem[];
  activeSection: string;
  onNavigate: (section: string) => void;
}) {
  return (
    <div className="border-b border-black/10 bg-white lg:hidden">
      <div className="flex items-center justify-between px-5 py-4 sm:px-6">
        <Link href="/" aria-label="HauxHunt home">
          <Wordmark height={36} />
        </Link>
        <div className="flex items-center gap-1.5">
          <Link
            href="/partner-dashboard/notifications"
            onClick={() => onNavigate("notifications")}
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full border border-black/10"
          >
            <Bell aria-hidden="true" className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-black ring-2 ring-white" />
          </Link>
          <Link
            href="/partner-dashboard/settings"
            onClick={() => onNavigate("settings")}
            aria-label="Settings"
            className="flex size-9 items-center justify-center rounded-full border border-black/10"
          >
            <Settings aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="#profile"
            onClick={() => onNavigate("profile")}
            aria-label="Profile"
            className="flex size-9 items-center justify-center rounded-full bg-black text-white"
          >
            <UserRound aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
      <nav
        aria-label="Partner dashboard"
        className="overflow-x-auto px-5 pb-3 sm:px-6"
      >
        <ul className="flex min-w-max gap-2">
          {dashboardNav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => onNavigate(item.section)}
                aria-current={
                  activeSection === item.section ? "page" : undefined
                }
                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium ${activeSection === item.section ? "bg-black text-white" : "border border-black/10 bg-white text-black"}`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

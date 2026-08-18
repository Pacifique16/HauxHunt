"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore, useCallback } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CreditCard,
  FileText,
  Heart,
  Home,
  Key,
  Search,
  Settings,
  Shield,
  Users,
  Wrench,
} from "lucide-react";

import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  subscribeToNotifications,
  type Notification,
  type NotificationCategory,
} from "@/lib/notifications";

// ---------------------------------------------------------------------------
// Category icon map
// ---------------------------------------------------------------------------

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  search: Search,
  viewing: CalendarDays,
  application: FileText,
  "rental-setup": Key,
  rental: Home,
  payment: CreditCard,
  maintenance: Wrench,
  flatmate: Users,
  message: BookOpen,
  security: Shield,
};

// ---------------------------------------------------------------------------
// Time grouping
// ---------------------------------------------------------------------------

type Group = "Today" | "Yesterday" | "Earlier";

function getGroup(timestamp: number): Group {
  const now = new Date();
  const date = new Date(timestamp);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86_400_000;
  if (timestamp >= todayStart) return "Today";
  if (timestamp >= yesterdayStart) return "Yesterday";
  return "Earlier";
}

function formatTimestamp(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Filter = "all" | "unread";

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = useSyncExternalStore(
    subscribeToNotifications,
    getNotifications,
    getNotifications,
  );

  const unreadCount = useSyncExternalStore(
    subscribeToNotifications,
    getUnreadNotificationCount,
    getUnreadNotificationCount,
  );

  // Read filter from URL hash so it survives navigation
  const hash =
    typeof window !== "undefined" ? window.location.hash.slice(1) : "";
  const filter: Filter = hash === "unread" ? "unread" : "all";

  const setFilter = useCallback(
    (f: Filter) => {
      router.replace(
        f === "unread"
          ? "/renter-dashboard/notifications#unread"
          : "/renter-dashboard/notifications",
        { scroll: false },
      );
    },
    [router],
  );

  const handleClick = useCallback(
    (n: Notification) => {
      markNotificationRead(n.id);
      if (n.actionHref) router.push(n.actionHref);
    },
    [router],
  );

  const shown =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  // Group
  const groups: Group[] = ["Today", "Yesterday", "Earlier"];
  const grouped = groups
    .map((g) => ({ group: g, items: shown.filter((n) => getGroup(n.timestamp) === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <div className="mx-auto max-w-[760px] px-5 pt-9 pb-16 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="dashboard-page-title">Notifications</h1>
              <p className="text-carbon-500 mt-2 text-sm">
                Stay updated on your searches, applications, rentals, payments,
                maintenance, and flatmate activity.
              </p>
            </div>
            <Link
              href="/renter-dashboard/account#preferences"
              className="text-carbon-500 mt-1 flex items-center gap-1.5 text-xs hover:text-black"
              aria-label="Notification settings"
            >
              <Settings className="size-3.5" />
              Notification settings
            </Link>
          </div>

          {/* Filters + Mark all */}
          <div className="mt-7 flex items-center justify-between gap-4">
            <div className="flex gap-1">
              {(["all", "unread"] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-black text-white"
                      : "bg-black/[0.055] text-black hover:bg-black/10"
                  }`}
                >
                  {f === "all" ? "All" : "Unread"}
                  {f === "unread" && unreadCount > 0 ? (
                    <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-white text-[0.6rem] font-bold text-black">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-carbon-500 text-xs font-medium underline underline-offset-4 hover:text-black"
              >
                Mark all as read
              </button>
            ) : null}
          </div>

          {/* Feed */}
          <div className="mt-6">
            {grouped.length > 0 ? (
              grouped.map(({ group, items }) => (
                <section key={group} className="mb-8">
                  <h2 className="mb-3 text-xs font-semibold tracking-wider text-black/40 uppercase">
                    {group}
                  </h2>
                  <div className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                    {items.map((n, index) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        isLast={index === items.length - 1}
                        onClick={() => handleClick(n)}
                        onMarkRead={() => markNotificationRead(n.id)}
                      />
                    ))}
                  </div>
                </section>
              ))
            ) : filter === "unread" ? (
              <UnreadEmptyState />
            ) : (
              <AllEmptyState />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Notification row
// ---------------------------------------------------------------------------

function NotificationRow({
  notification: n,
  isLast,
  onClick,
  onMarkRead,
}: {
  notification: Notification;
  isLast: boolean;
  onClick: () => void;
  onMarkRead: () => void;
}) {
  const Icon = CATEGORY_ICONS[n.category];

  return (
    <article
      className={`relative flex gap-4 px-5 py-4 transition-colors hover:bg-black/[0.025] focus-within:bg-black/[0.025] ${
        !n.read ? "bg-black/[0.035]" : "bg-white"
      } ${!isLast ? "border-b border-black/[0.07]" : ""}`}
    >
      {/* Unread dot */}
      {!n.read ? (
        <span
          aria-label="Unread"
          className="absolute top-5 left-2 size-1.5 rounded-full bg-black"
        />
      ) : null}

      {/* Icon */}
      <div
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
          !n.read ? "bg-black text-white" : "bg-black/[0.07] text-black"
        }`}
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {n.urgentLabel ? (
          <p className="mb-1 text-[0.65rem] font-semibold tracking-wide text-black/50 uppercase">
            {n.urgentLabel}
          </p>
        ) : null}
        <p
          className={`text-sm leading-snug ${!n.read ? "font-semibold" : "font-medium"}`}
        >
          {n.title}
        </p>
        <p className="text-carbon-500 mt-0.5 text-sm leading-relaxed">
          {n.body}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="text-carbon-400 text-xs">
            {formatTimestamp(n.timestamp)}
          </span>
          {n.actionLabel && n.actionHref ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="text-xs font-medium underline underline-offset-4 hover:text-black/70"
            >
              {n.actionLabel} →
            </button>
          ) : null}
          {!n.read ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead();
              }}
              className="text-carbon-400 text-xs hover:text-black"
            >
              Mark as read
            </button>
          ) : null}
        </div>
      </div>

      {/* Full-row click target (keyboard accessible) */}
      <button
        type="button"
        onClick={onClick}
        aria-label={n.title}
        className="absolute inset-0 rounded-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-black/30"
        tabIndex={-1}
        aria-hidden="true"
      />
    </article>
  );
}

// ---------------------------------------------------------------------------
// Empty states
// ---------------------------------------------------------------------------

function AllEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-black/[0.06]">
        <Bell className="size-7 text-black/40" />
      </div>
      <h2 className="font-bricolage mt-6 text-2xl font-medium">
        You&apos;re all caught up
      </h2>
      <p className="text-carbon-500 mt-3 max-w-xs text-sm leading-6">
        Important updates about your HauxHunt activity will appear here.
      </p>
      <Link
        href="/renter-dashboard/properties"
        className="mt-7 inline-flex h-11 items-center rounded-full bg-black px-6 text-sm font-medium text-white"
      >
        Browse Homes
      </Link>
    </div>
  );
}

function UnreadEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-black/[0.06]">
        <Bell className="size-7 text-black/40" />
      </div>
      <h2 className="font-bricolage mt-6 text-2xl font-medium">
        No unread notifications
      </h2>
      <p className="text-carbon-500 mt-3 max-w-xs text-sm leading-6">
        You&apos;ve seen all your latest updates.
      </p>
    </div>
  );
}

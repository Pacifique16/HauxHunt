"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check, Settings, X } from "lucide-react";
import { createPortal } from "react-dom";

import emptyIllustration from "@/assets/images/empty.png";

export type DashboardNotification = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
  urgentLabel?: string;
};

type Group = "Today" | "Yesterday" | "Earlier";

function notificationGroup(timestamp: number): Group {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (timestamp >= today.getTime()) return "Today";
  if (timestamp >= today.getTime() - 86_400_000) return "Yesterday";
  return "Earlier";
}

function notificationTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Kigali",
  }).format(timestamp);
}

export function DashboardNotificationsDrawer({
  open,
  onClose,
  notifications,
  settingsHref,
  onMarkRead,
  onMarkAllRead,
  onClear,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  notifications: DashboardNotification[];
  settingsHref: string;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}) {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [filter, setFilter] = useState<"all" | "unread">("all");
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;
  const unreadCount = notifications.filter((item) => !item.read).length;
  const shown =
    filter === "unread"
      ? notifications.filter((item) => !item.read)
      : notifications;
  const grouped = (["Today", "Yesterday", "Earlier"] as Group[])
    .map((group) => ({
      group,
      items: shown.filter(
        (item) => notificationGroup(item.timestamp) === group,
      ),
    }))
    .filter(({ items }) => items.length);

  return createPortal(
    <>
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.18)] transition-transform duration-300 sm:w-1/2 sm:min-w-[420px] ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ borderRadius: "3rem 0 0 0" }}
      >
        <header className="flex items-center justify-between border-b border-black/8 px-8 pt-6 pb-3 sm:px-10">
          <h2 className="font-bricolage text-xl font-medium">Notifications</h2>
          <div className="flex gap-2">
            <Link
              href={settingsHref}
              onClick={onClose}
              aria-label="Notification settings"
              className="text-carbon-400 flex size-9 items-center justify-center rounded-full hover:bg-black/5 hover:text-black"
            >
              <Settings className="size-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="flex size-9 items-center justify-center rounded-full hover:bg-black/5"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>
        <div className="flex items-center justify-between gap-4 px-8 py-3 sm:px-10">
          <div className="flex gap-1">
            {(["all", "unread"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`h-8 rounded-full px-3.5 text-xs font-medium ${filter === item ? "bg-black text-white" : "bg-black/5"}`}
              >
                {item === "all" ? "All" : "Unread"}
                {item === "unread" && unreadCount ? ` ${unreadCount}` : ""}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {unreadCount ? (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-carbon-500 text-xs font-medium underline underline-offset-4"
              >
                Mark all as read
              </button>
            ) : null}
            {notifications.length ? (
              <button
                type="button"
                onClick={onClearAll}
                className="text-carbon-500 text-xs font-medium underline underline-offset-4"
              >
                Clear all
              </button>
            ) : null}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-8 sm:px-10">
          {grouped.length ? (
            grouped.map(({ group, items }) => (
              <section key={group} className="mb-6">
                <h3 className="mb-2 text-[0.65rem] font-semibold tracking-wider text-black/35 uppercase">
                  {group}
                </h3>
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <NotificationCard
                      key={item.id}
                      notification={item}
                      onMarkRead={() => onMarkRead(item.id)}
                      onClear={() => onClear(item.id)}
                      onOpen={() => {
                        onMarkRead(item.id);
                        onClose();
                        if (item.actionHref) router.push(item.actionHref);
                      }}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Image
                src={emptyIllustration}
                alt=""
                className="h-36 w-auto object-contain"
              />
              <h3 className="font-bricolage mt-5 text-xl font-medium">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </h3>
              <p className="text-carbon-500 mt-2 max-w-xs text-sm">
                Updates that need your attention will appear here.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}

function NotificationCard({
  notification,
  onMarkRead,
  onClear,
  onOpen,
}: {
  notification: DashboardNotification;
  onMarkRead: () => void;
  onClear: () => void;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex gap-3 rounded-2xl px-4 py-3.5 transition-colors ${
        notification.read
          ? "bg-zinc-50 hover:bg-zinc-100"
          : "bg-zinc-100 ring-1 ring-black hover:bg-zinc-200/70"
      }`}
      style={{
        borderTopLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      }}
    >
      {hovered ? (
        <div className="absolute top-1/2 -left-2 z-10 flex -translate-y-1/2 flex-col gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClear();
            }}
            aria-label="Clear notification"
            className="flex size-4 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black"
          >
            <X className="size-2" />
          </button>
          {!notification.read ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onMarkRead();
              }}
              aria-label="Mark as read"
              className="flex size-4 items-center justify-center rounded-full bg-black/80 text-white hover:bg-black"
            >
              <Check className="size-2" />
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        {notification.urgentLabel ? (
          <p className="mb-1 text-[0.6rem] font-semibold tracking-wide text-black/40 uppercase">
            {notification.urgentLabel}
          </p>
        ) : null}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug font-semibold text-black">
            {notification.title}
          </p>
          <span className="shrink-0 text-[0.7rem] text-black/40">
            {notificationTime(notification.timestamp)}
          </span>
        </div>
        <div className="mt-2 flex items-start justify-between gap-2">
          <p className="text-xs leading-relaxed text-black/50">
            {notification.body}
          </p>
          {notification.actionLabel && notification.actionHref ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpen();
              }}
              className="inline-flex shrink-0 items-center gap-0.5 text-[0.7rem] font-medium underline underline-offset-4 hover:text-black/60"
            >
              {notification.actionLabel} <ArrowUpRight className="size-3" />
            </button>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-label={notification.title}
        tabIndex={-1}
        className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-black/30"
      />
    </article>
  );
}

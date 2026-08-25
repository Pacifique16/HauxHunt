"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  BadgeCheck,
  ChevronLeft,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  X,
} from "lucide-react";

import { VoiceInputButton } from "@/components/listings/voice-input-button";
import { DashboardShell } from "@/components/partner/dashboard-shell";
import { useDemoProfessional } from "@/components/partner/use-demo-professional";
import { resolveAnyPropertyTitle } from "@/lib/professional-properties";
import { type ProfessionalRole } from "@/lib/team-data";
import {
  getConversationsFor,
  getParticipant,
  markConversationReadFor,
  sendMessageAs,
  subscribeToMessages,
  type Conversation,
  type ConversationContext,
  type Participant,
} from "@/lib/messages-data";

const TABS = ["All", "Unread", "Read"] as const;
type Tab = (typeof TABS)[number];

export function AgentMessagesWorkspace() {
  return (
    <Suspense>
      <MessagesWorkspace role="agent" />
    </Suspense>
  );
}

export function PmMessagesWorkspace() {
  return (
    <Suspense>
      <MessagesWorkspace role="property_manager" />
    </Suspense>
  );
}

function contextTitle(context?: ConversationContext) {
  if (!context) return "";
  return context.propertyId
    ? `${resolveAnyPropertyTitle(context.propertyId)} · ${context.label}`
    : context.label;
}

function contextLink(context?: ConversationContext) {
  if (!context) return null;
  if (context.type === "maintenance" && context.maintenanceRequestId)
    return {
      label: "View Request",
      href: `/partner-dashboard/maintenance?open=${context.maintenanceRequestId}`,
    };
  if (context.type === "application" && context.applicationId)
    return {
      label: "View Application",
      href: `/partner-dashboard/applications?open=${context.applicationId}`,
    };
  if (context.type === "rental" && context.rentalId)
    return {
      label: "View Rental",
      href: `/partner-dashboard/rentals/${context.rentalId}`,
    };
  if (context.type === "rental-setup" && context.applicationId)
    return {
      label: "View Rental Setup",
      href: `/partner-dashboard/rentals/setup/${context.applicationId}`,
    };
  if (context.type === "property" && context.propertyId)
    return {
      label: "View Property",
      href: `/partner-dashboard/properties/${context.propertyId}`,
    };
  return null;
}

function unread(conversation: Conversation, viewerId: string) {
  const lastRead = conversation.lastReadTs[viewerId] ?? 0;
  return conversation.messages.some(
    (message) => message.senderId !== viewerId && message.ts > lastRead,
  );
}

function activity(conversation: Conversation) {
  return conversation.messages.reduce(
    (latest, message) => Math.max(latest, message.ts),
    0,
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Kigali",
});
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Kigali",
});

function Avatar({
  participant,
  className,
}: {
  participant: Participant;
  className: string;
}) {
  if (participant.avatar) {
    return (
      <span
        className={`relative overflow-hidden rounded-full bg-black ${className}`}
      >
        <Image
          src={participant.avatar}
          alt={participant.name}
          fill
          className="object-cover"
        />
      </span>
    );
  }
  return (
    <span
      className={`font-bricolage flex items-center justify-center rounded-full bg-black font-bold text-white ${className}`}
    >
      {participant.name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

function MessagesWorkspace({ role }: { role: ProfessionalRole }) {
  const params = useSearchParams();
  const [, refresh] = useReducer((value: number) => value + 1, 0);
  useEffect(() => subscribeToMessages(refresh), []);
  const professional = useDemoProfessional(role);
  const viewerId = professional?.id ?? "";
  const conversations = useMemo(
    () => (viewerId ? getConversationsFor(viewerId) : []),
    [viewerId],
  );
  const openId = params.get("open");
  const initialId =
    openId && conversations.some((item) => item.id === openId) ? openId : null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [threadQuery, setThreadQuery] = useState("");
  const [threadSearch, setThreadSearch] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "thread">(
    initialId ? "thread" : "list",
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((item) => item.id === selectedId) ?? null;
  const other = selected
    ? getParticipant(
        selected.participantIds.find((id) => id !== viewerId) ?? "",
      )
    : undefined;
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return conversations
      .filter((item) => {
        const person = getParticipant(
          item.participantIds.find((id) => id !== viewerId) ?? "",
        );
        const matchesQuery =
          !term ||
          person?.name.toLowerCase().includes(term) ||
          contextTitle(item.context).toLowerCase().includes(term);
        const isUnread = unread(item, viewerId);
        return (
          matchesQuery &&
          (tab === "All" || (tab === "Unread" ? isUnread : !isUnread))
        );
      })
      .sort((a, b) => activity(b) - activity(a));
  }, [conversations, query, tab, viewerId]);
  const shownMessages =
    selected?.messages.filter((item) =>
      item.text.toLowerCase().includes(threadQuery.trim().toLowerCase()),
    ) ?? [];
  const action = contextLink(selected?.context);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [selectedId, shownMessages.length]);

  function choose(id: string) {
    setSelectedId(id);
    setMobileView("thread");
    setThreadSearch(false);
    setThreadQuery("");
    markConversationReadFor(id, viewerId);
  }

  function send() {
    if (!selected || !message.trim()) return;
    sendMessageAs(selected.id, viewerId, message.trim());
    setMessage("");
  }

  if (!professional) {
    return (
      <DashboardShell initialSection="messages">
        <p className="text-carbon-500 p-8 text-sm">
          We couldn&apos;t determine your professional identity.
        </p>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell initialSection="messages">
      <section className="bg-white lg:h-[calc(100svh-5rem)] lg:overflow-hidden">
        <div className="flex min-h-[calc(100svh-4rem)] lg:h-full lg:min-h-0">
          <aside
            className={`${mobileView === "thread" ? "hidden" : "flex"} w-full shrink-0 flex-col md:flex md:w-90`}
          >
            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
              <Link
                href="/partner-dashboard"
                aria-label="Back to overview"
                className="text-black/50 hover:text-black"
              >
                <ChevronLeft className="size-5" />
              </Link>
              <h1 className="font-bricolage text-2xl font-bold tracking-tight">
                Messages
              </h1>
            </div>
            <div className="px-5 pb-4">
              <label className="catalogue-location-filter flex items-center gap-2 px-4">
                <Search className="text-carbon-500 size-4 shrink-0" />
                <span className="sr-only">Search messages</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </label>
            </div>
            <div className="flex gap-1.5 px-5 pb-4">
              {TABS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`h-9 rounded-full border px-3 text-sm font-medium ${tab === item ? "border-black bg-black text-white" : "border-black/15 text-black/70 hover:border-black/30"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="border-t border-black/10" />
            <div className="flex-1 overflow-y-auto p-2.5">
              {filtered.length ? (
                <div className="space-y-1.5">
                  {filtered.map((item) => {
                    const person = getParticipant(
                      item.participantIds.find((id) => id !== viewerId) ?? "",
                    );
                    if (!person) return null;
                    const last = item.messages.at(-1);
                    const isUnread = unread(item, viewerId);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => choose(item.id)}
                        className={`flex w-full gap-3.5 rounded-2xl p-3.5 text-left transition-colors ${selectedId === item.id ? "bg-black/5" : "hover:bg-black/3"}`}
                      >
                        <Avatar
                          participant={person}
                          className="size-11 shrink-0 border border-neutral-100 text-base"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <strong className="flex min-w-0 items-center gap-1 text-sm">
                              <span className="truncate">{person.name}</span>
                              {person.verified ? (
                                <BadgeCheck className="size-3.5 shrink-0 fill-black text-white" />
                              ) : null}
                            </strong>
                            <span className="shrink-0 text-[9px] font-medium text-neutral-400">
                              {last ? dateFormatter.format(last.ts) : ""}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-[10px] font-medium text-neutral-500">
                            {contextTitle(item.context) || person.role}
                          </span>
                          <span className="mt-2 flex items-center gap-2">
                            <span className="flex-1 truncate text-xs text-neutral-600">
                              {last?.text ?? "Start a conversation"}
                            </span>
                            {isUnread ? (
                              <span
                                aria-label="Unread"
                                className="size-2 shrink-0 rounded-full bg-black"
                              />
                            ) : null}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center px-6 py-16 text-center">
                  {query.trim() ? (
                    <Search className="mb-3 size-8 text-black/20" />
                  ) : null}
                  <h2 className="font-bricolage text-lg font-bold">
                    {query.trim()
                      ? `No results found for “${query.trim()}”`
                      : tab === "Unread"
                        ? "No Unread Messages"
                        : "No messages yet"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-black/50">
                    {query.trim()
                      ? "Try a different name or property."
                      : "Your conversations will appear here."}
                  </p>
                </div>
              )}
            </div>
          </aside>

          <div className="hidden w-px shrink-0 border-r border-black/10 md:block" />
          <section
            className={`${mobileView === "list" ? "hidden" : "flex"} min-w-0 flex-1 flex-col md:flex`}
          >
            {selected && other ? (
              <div className="flex h-16 shrink-0 items-center gap-3 border-b border-black/10 px-4 md:px-6">
                {threadSearch ? (
                  <>
                    <label className="catalogue-location-filter flex min-w-0 flex-1 items-center gap-2 px-4">
                      <Search className="text-carbon-500 size-4" />
                      <input
                        autoFocus
                        value={threadQuery}
                        onChange={(event) => setThreadQuery(event.target.value)}
                        placeholder={`Search in conversation with ${other.name}`}
                        className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                      />
                    </label>
                    <button
                      type="button"
                      aria-label="Close search"
                      onClick={() => {
                        setThreadSearch(false);
                        setThreadQuery("");
                      }}
                      className="flex size-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
                    >
                      <X className="size-4.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileView("list")}
                      aria-label="Back to conversations"
                      className="flex size-9 items-center justify-center rounded-full text-black/60 md:hidden"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <Avatar participant={other} className="size-10 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 truncate text-sm font-semibold">
                        <span className="truncate">{other.name}</span>
                        {other.verified ? (
                          <BadgeCheck className="size-3.5 fill-black text-white" />
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-black/50">
                        {other.role}
                        {selected.context?.propertyId
                          ? ` · ${resolveAnyPropertyTitle(selected.context.propertyId)}`
                          : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Search in conversation"
                      onClick={() => setThreadSearch(true)}
                      className="flex size-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
                    >
                      <Search className="size-4.5" />
                    </button>
                    {action ? (
                      <div ref={menuRef} className="relative">
                        <button
                          type="button"
                          aria-label="More options"
                          onClick={() => setMenuOpen((value) => !value)}
                          className="flex size-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
                        >
                          <MoreVertical className="size-4.5" />
                        </button>
                        {menuOpen ? (
                          <div className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                            <Link
                              href={action.href}
                              className="block rounded-xl px-3.5 py-2.5 text-sm font-medium hover:bg-black/5"
                            >
                              {action.label}
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}

            {selected && other ? (
              shownMessages.length ? (
                <div className="flex-1 overflow-y-auto bg-neutral-100 px-4 py-3">
                  {shownMessages.map((item, index) => {
                    const previous = shownMessages[index - 1];
                    const date = dateFormatter.format(item.ts);
                    const self = item.senderId === viewerId;
                    return (
                      <div key={item.id}>
                        {!previous ||
                        dateFormatter.format(previous.ts) !== date ? (
                          <div className="flex justify-center py-2">
                            <span className="text-[10px] font-semibold tracking-wide text-black/40 uppercase">
                              {date}
                            </span>
                          </div>
                        ) : null}
                        <div
                          className={`flex py-0.5 ${self ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[65%] rounded-lg px-2.5 py-1.5 text-sm ${self ? "rounded-tr-none bg-black text-white" : "rounded-tl-none bg-white text-neutral-900"}`}
                          >
                            <span className="leading-snug wrap-break-word">
                              {item.text}
                            </span>
                            <span
                              className={`float-right mt-1 ml-2 text-[10px] ${self ? "text-white/60" : "text-neutral-400"}`}
                            >
                              {timeFormatter.format(item.ts)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <h2 className="font-bricolage text-lg font-bold">
                    {threadQuery ? "No messages found" : "Start a conversation"}
                  </h2>
                  <p className="text-sm text-black/50">
                    {threadQuery
                      ? `Nothing matches “${threadQuery}”.`
                      : `Send ${other.name.split(" ")[0]} a message below.`}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <MessageCircle className="size-14" strokeWidth={1.5} />
                <h2 className="font-bricolage text-xl font-bold">
                  Select a conversation
                </h2>
                <p className="text-sm text-black/50">
                  Choose a conversation from the list to view messages.
                </p>
              </div>
            )}

            {selected && other ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
                className="flex items-center gap-3 bg-neutral-100 p-4"
              >
                <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-black/15 bg-white px-4 focus-within:border-black">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={`Message ${other.name.split(" ")[0]}`}
                    className="message-composer-control min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
                  />
                  <VoiceInputButton
                    onTranscript={(text) =>
                      setMessage((current) =>
                        current ? `${current} ${text}` : text,
                      )
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  aria-label="Send message"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white disabled:opacity-30"
                >
                  <Send className="size-4" />
                </button>
              </form>
            ) : null}
          </section>
        </div>
      </section>
    </DashboardShell>
  );
}

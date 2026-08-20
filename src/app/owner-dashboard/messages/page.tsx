"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  FileText,
  ImagePlus,
  MessageCircle,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
} from "lucide-react";

import { OwnerDashboardShell } from "@/components/owner/owner-dashboard-shell";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import jeanPortrait from "@/assets/images/flatmate-joseph.jpg";
import patrickPortrait from "@/assets/images/flatmate-patrick.png";
import alinePortrait from "@/assets/images/flatmate-aline.png";
import sarahPortrait from "@/assets/images/flatmate-queen.jpg";
import kevinPortrait from "@/assets/images/flatmate-jackson.jpg";
import julienPortrait from "@/assets/images/julien.jpg";
import hauxhuntWhiteLogo from "@/assets/images/HauxHunt_white.png";

// Visually matches the renter Messages inbox (renter-dashboard/messages) —
// same list-row layout, chat header, bubble style, date separators,
// attach menu, and composer — so every messaging surface in the product
// reads as one system. Scoped down for the owner's simpler needs: no live
// camera capture, no resizable sidebar, session-only conversation state.

type Attachment = { kind: "image" | "document"; name: string; url: string };
type Message = { sender: "owner" | "them"; text: string; timestamp: string; ts: number; attachment?: Attachment };

type Conversation = {
  id: string;
  name: string;
  role: string;
  verified: boolean;
  avatar?: StaticImageData;
  subtitle: string;
  phone: string;
  showPhone: boolean;
  unreadCount: number;
  contextLabel?: string;
  contextHref?: string;
  messages: Message[];
};

const now = Date.now();
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "jean-mugisha",
    name: "Jean Mugisha",
    role: "Property Manager",
    verified: true,
    avatar: jeanPortrait,
    subtitle: "Kacyiru Residence · Maintenance",
    phone: "+250 788 204 118",
    showPhone: true,
    unreadCount: 0,
    contextLabel: "View Request",
    contextHref: "/owner-dashboard/maintenance?open=HH-MNT-1042",
    messages: [
      { sender: "them", text: "The kitchen tap leak at Kacyiru Residence is scheduled for a visit tomorrow at 10 AM.", timestamp: "5 hr ago", ts: now - 5 * HOUR },
      { sender: "owner", text: "Thanks Jean, please keep me posted once it's resolved.", timestamp: "4 hr ago", ts: now - 4 * HOUR },
    ],
  },
  {
    id: "patrick",
    name: "Patrick",
    role: "Property Manager",
    verified: false,
    avatar: patrickPortrait,
    subtitle: "Modern Family Home · Application",
    phone: "+250 783 552 906",
    showPhone: true,
    unreadCount: 1,
    contextLabel: "View Application",
    contextHref: "/owner-dashboard/applications?open=HH-APP-0239",
    messages: [
      { sender: "them", text: "A new application came in for Modern Family Home from Divine Keza. I'll begin review shortly.", timestamp: "Yesterday", ts: now - DAY },
    ],
  },
  {
    id: "aline-uwase",
    name: "Aline Uwase",
    role: "Agent",
    verified: true,
    avatar: alinePortrait,
    subtitle: "Nyarutarama Garden Apartment · Rental Setup",
    phone: "+250 788 611 274",
    showPhone: true,
    unreadCount: 0,
    contextLabel: "View Rental Setup",
    contextHref: "/owner-dashboard/properties/nyarutarama-2br?tab=rental",
    messages: [
      { sender: "them", text: "The agreement for Nyarutarama Garden Apartment is ready. It needs your approval before I request the deposit.", timestamp: "Yesterday", ts: now - DAY + 2 * HOUR },
      { sender: "owner", text: "Reviewing it now, thank you.", timestamp: "Yesterday", ts: now - DAY + 3 * HOUR },
    ],
  },
  {
    id: "sarah-uwase",
    name: "Sarah Uwase",
    role: "Agent",
    verified: true,
    avatar: sarahPortrait,
    subtitle: "Remera Family House · Renewal",
    phone: "+250 790 442 815",
    showPhone: true,
    unreadCount: 2,
    contextLabel: "View Application",
    contextHref: "/owner-dashboard/applications?open=HH-APP-0250",
    messages: [
      { sender: "them", text: "Julien would like to renew at Remera Family House. I'd recommend approving — he's been a reliable tenant.", timestamp: "3 hr ago", ts: now - 3 * HOUR },
      { sender: "them", text: "Also flagging that August rent is a few days overdue.", timestamp: "2 hr ago", ts: now - 2 * HOUR },
    ],
  },
  {
    id: "kevin-nshuti",
    name: "Kevin Nshuti",
    role: "Agent",
    verified: true,
    avatar: kevinPortrait,
    subtitle: "Modern Family Home · Listing",
    phone: "+250 785 903 361",
    showPhone: true,
    unreadCount: 0,
    contextLabel: "View Listing",
    contextHref: "/owner-dashboard/properties/kibagabaga-modern-family-home?tab=listing",
    messages: [
      { sender: "them", text: "Modern Family Home is now live. I've already had a few enquiries come in.", timestamp: "3 days ago", ts: now - 3 * DAY },
    ],
  },
  {
    id: "julien-mugisha",
    name: "Julien Mugisha",
    role: "Renter",
    verified: true,
    avatar: julienPortrait,
    subtitle: "Kacyiru Residence · Active Rental",
    phone: "+250 788 340 527",
    showPhone: true,
    unreadCount: 0,
    contextLabel: "View Rental",
    contextHref: "/owner-dashboard/rentals?open=HH-RENT-104",
    messages: [
      { sender: "them", text: "Hi, just confirming rent for September will go out on the 1st as usual.", timestamp: "6 days ago", ts: now - 6 * DAY },
      { sender: "owner", text: "Sounds good, thanks for the update.", timestamp: "6 days ago", ts: now - 6 * DAY + HOUR },
    ],
  },
  {
    id: "hauxhunt-support",
    name: "HauxHunt",
    role: "Support",
    verified: true,
    avatar: hauxhuntWhiteLogo,
    subtitle: "Owner Support",
    phone: "",
    showPhone: false,
    unreadCount: 0,
    messages: [
      { sender: "them", text: "Hi Pacifique, let us know if you need help assigning a Property Manager or Agent, or anything else on your dashboard.", timestamp: "4 days ago", ts: now - 4 * DAY },
    ],
  },
];

const INBOX_TABS = [
  { key: "inbox", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
] as const;
type InboxTab = (typeof INBOX_TABS)[number]["key"];

function ConversationAvatar({ avatar, name, className }: { avatar?: StaticImageData; name: string; className: string }) {
  if (avatar) {
    return (
      <div className={`relative overflow-hidden rounded-full bg-black ${className}`}>
        <Image src={avatar} alt={name} fill className="object-cover" />
      </div>
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div aria-hidden="true" className={`flex items-center justify-center rounded-full bg-black font-bricolage font-bold text-white ${className}`}>
      {initial}
    </div>
  );
}

function lastActivity(conversation: Conversation) {
  return conversation.messages.reduce((latest, m) => Math.max(latest, m.ts || 0), 0);
}

function messagePreview(message?: Message) {
  if (!message) return "No messages yet";
  if (message.text) return message.text;
  if (message.attachment?.kind === "image") return "📷 Photo";
  if (message.attachment?.kind === "document") return `📄 ${message.attachment.name}`;
  return "No messages yet";
}

function dateLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function OwnerMessagesPage() {
  return (
    <Suspense>
      <OwnerMessagesPageInner />
    </Suspense>
  );
}

function OwnerMessagesPageInner() {
  const searchParams = useSearchParams();
  const contextParam = searchParams.get("context")?.toLowerCase() ?? "";

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const preselected = useMemo(
    () => (contextParam ? INITIAL_CONVERSATIONS.find((c) => c.name.toLowerCase().includes(contextParam) || c.subtitle.toLowerCase().includes(contextParam)) : undefined),
    [contextParam],
  );
  const [activeChatId, setActiveChatId] = useState<string>(preselected?.id ?? "");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [threadSearchOpen, setThreadSearchOpen] = useState(false);
  const [threadSearchQuery, setThreadSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<InboxTab>("inbox");
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mobileView, setMobileView] = useState<"list" | "thread">(preselected ? "thread" : "list");
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!attachMenuRef.current?.contains(event.target as Node)) setAttachMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!chatMenuRef.current?.contains(event.target as Node)) setChatMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const selectChat = (id: string) => {
    setActiveChatId(id);
    setThreadSearchOpen(false);
    setThreadSearchQuery("");
    setChatMenuOpen(false);
    setMobileView("thread");
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
  };

  const backToList = () => setMobileView("list");

  const searchedConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(query) || c.subtitle.toLowerCase().includes(query));
  }, [conversations, searchQuery]);

  const visibleConversations = useMemo(() => {
    return searchedConversations
      .filter((c) => {
        if (activeTab === "unread") return c.unreadCount > 0;
        if (activeTab === "read") return c.unreadCount === 0;
        return true;
      })
      .sort((a, b) => lastActivity(b) - lastActivity(a));
  }, [searchedConversations, activeTab]);

  const threadQuery = threadSearchQuery.trim();
  const threadMessages = useMemo(() => {
    if (!activeChat) return [];
    if (!threadQuery) return activeChat.messages;
    return activeChat.messages.filter((m) => m.text.toLowerCase().includes(threadQuery.toLowerCase()));
  }, [activeChat, threadQuery]);

  const threadRenderItems = useMemo(() => {
    const items: Array<{ message: Message; showDate: boolean; dateLabel: string }> = [];
    let lastDateLabel: string | null = null;
    threadMessages.forEach((message) => {
      const label = dateLabel(message.ts);
      items.push({ message, showDate: label !== lastDateLabel, dateLabel: label });
      lastDateLabel = label;
    });
    return items;
  }, [threadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeChatId, threadMessages.length]);

  function appendMessage(chatId: string, message: Omit<Message, "timestamp" | "ts">) {
    setConversations((current) =>
      current.map((c) =>
        c.id === chatId ? { ...c, messages: [...c.messages, { ...message, timestamp: "Just now", ts: Date.now() }] } : c,
      ),
    );
  }

  function send() {
    if (!newMessage.trim() || !activeChat) return;
    appendMessage(activeChat.id, { sender: "owner", text: newMessage.trim() });
    setNewMessage("");
  }

  function handleFileSelected(kind: Attachment["kind"]) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !activeChat) return;
      appendMessage(activeChat.id, { sender: "owner", text: "", attachment: { kind, name: file.name, url: URL.createObjectURL(file) } });
    };
  }

  return (
    <OwnerDashboardShell>
      <section className="px-0 pb-0 lg:h-[calc(100svh-5rem)] lg:overflow-hidden">
        <div className="flex h-full min-h-160 flex-col bg-white lg:flex-1">
          <div className="flex min-h-0 flex-1">
            {/* Conversations list ------------------------------------------------ */}
            <aside className={`${mobileView === "thread" ? "hidden" : "flex"} w-full shrink-0 flex-col md:flex md:w-90`}>
              <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
                <Link href="/owner-dashboard" aria-label="Back to Overview" className="text-black/50 transition-colors hover:text-black">
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </Link>
                <h1 className="font-bricolage flex-1 text-2xl font-bold tracking-tight">Messages</h1>
              </div>

              <div className="px-5 pb-4">
                <label className="catalogue-location-filter flex items-center gap-2 px-4">
                  <span className="sr-only">Search messages</span>
                  <Search aria-hidden="true" className="text-carbon-500 size-4 shrink-0" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </label>
              </div>

              <div className="flex items-center gap-1.5 px-5 pb-4">
                {INBOX_TABS.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`h-9 shrink-0 rounded-full border px-3 text-sm font-medium transition-colors ${
                        isActive ? "border-black bg-black text-white" : "border-black/15 bg-white text-black/70 hover:border-black/30 hover:text-black"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-black/10" />

              <div className="flex-1 overflow-y-auto p-2.5">
                {visibleConversations.length === 0 ? (
                  <div className="flex flex-col items-center px-6 py-16 text-center">
                    {searchQuery.trim() ? <Search aria-hidden="true" className="mb-3 size-8 text-black/20" /> : null}
                    <h3 className="font-bricolage text-lg font-bold text-black">
                      {searchQuery.trim() ? `No results found for "${searchQuery.trim()}"` : activeTab === "unread" ? "No Unread Messages" : "No Messages"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/50">
                      {searchQuery.trim()
                        ? "Try a different name or property, or clear your search."
                        : activeTab === "unread"
                          ? "You're all caught up. New messages will appear here."
                          : "Messages you've opened will appear here."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {visibleConversations.map((convo) => {
                      const isActive = convo.id === activeChatId;
                      const lastMsg = convo.messages[convo.messages.length - 1];
                      return (
                        <button
                          key={convo.id}
                          onClick={() => selectChat(convo.id)}
                          className={`flex w-full gap-3.5 rounded-2xl border border-transparent p-3.5 text-left transition-all duration-150 ${
                            isActive ? "bg-black/5" : "bg-transparent hover:bg-black/3"
                          }`}
                        >
                          <div className="relative size-11 shrink-0">
                            <ConversationAvatar avatar={convo.avatar} name={convo.name} className="size-11 border border-neutral-100 text-base" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className={`flex min-w-0 items-center gap-1 text-sm font-semibold ${convo.unreadCount > 0 ? "text-black" : "text-neutral-900"}`}>
                                <span className="truncate">{convo.name}</span>
                                {convo.verified ? <BadgeCheck aria-label="Verified" className="size-3.5 shrink-0 fill-black text-white" /> : null}
                              </h3>
                              <span className="shrink-0 text-[9px] font-medium text-neutral-400">{lastMsg?.timestamp ?? ""}</span>
                            </div>
                            <p className="mt-0.5 truncate text-[10px] font-medium text-neutral-500">{convo.subtitle}</p>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <p className={`flex-1 truncate text-xs ${convo.unreadCount > 0 ? "text-black" : "text-neutral-600"}`}>{messagePreview(lastMsg)}</p>
                              {convo.unreadCount > 0 ? (
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                  {convo.unreadCount}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            <div className="hidden w-px shrink-0 border-r border-black/10 md:block" />

            {/* Active thread ------------------------------------------------------ */}
            <section className={`${mobileView === "list" ? "hidden" : "flex"} min-w-0 flex-1 flex-col md:flex`}>
              {activeChat ? (
                <div className="flex h-16 shrink-0 items-center gap-3 border-b border-black/10 px-4 md:px-6">
                  {threadSearchOpen ? (
                    <>
                      <span className="catalogue-location-filter flex min-w-0 flex-1 items-center gap-2 px-4">
                        <Search aria-hidden="true" className="text-carbon-500 size-4 shrink-0" />
                        <input
                          autoFocus
                          value={threadSearchQuery}
                          onChange={(e) => setThreadSearchQuery(e.target.value)}
                          placeholder={`Search in conversation with ${activeChat.name}`}
                          className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                        />
                      </span>
                      <button
                        type="button"
                        aria-label="Close search"
                        onClick={() => {
                          setThreadSearchOpen(false);
                          setThreadSearchQuery("");
                        }}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                      >
                        <ChevronDown aria-hidden="true" className="size-4.5 rotate-45" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={backToList}
                        aria-label="Back to conversations"
                        className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black md:hidden"
                      >
                        <ChevronLeft aria-hidden="true" className="size-5" />
                      </button>
                      <ConversationAvatar avatar={activeChat.avatar} name={activeChat.name} className="size-10" />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1 truncate text-sm font-semibold text-black">
                          <span className="truncate">{activeChat.name}</span>
                          {activeChat.verified ? <BadgeCheck aria-label="Verified" className="size-3.5 shrink-0 fill-black text-white" /> : null}
                        </p>
                        <p className="truncate text-xs text-black/50">{activeChat.role}</p>
                      </div>
                      {activeChat.showPhone ? (
                        <a
                          href={`tel:${activeChat.phone.replace(/\s+/g, "")}`}
                          aria-label={`Call ${activeChat.name}`}
                          title={activeChat.phone}
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                        >
                          <Phone aria-hidden="true" className="size-4.5" />
                        </a>
                      ) : null}
                      <button
                        type="button"
                        aria-label="Search in conversation"
                        onClick={() => setThreadSearchOpen(true)}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                      >
                        <Search aria-hidden="true" className="size-4.5" />
                      </button>
                      {activeChat.contextLabel && activeChat.contextHref ? (
                        <div ref={chatMenuRef} className="relative shrink-0">
                          <button
                            type="button"
                            aria-label="More options"
                            onClick={() => setChatMenuOpen((open) => !open)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                          >
                            <MoreVertical aria-hidden="true" className="size-4.5" />
                          </button>
                          {chatMenuOpen ? (
                            <div className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                              <Link
                                href={activeChat.contextHref}
                                onClick={() => setChatMenuOpen(false)}
                                className="block w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-black/75 transition-colors hover:bg-black/5"
                              >
                                {activeChat.contextLabel}
                              </Link>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}

              {activeChat ? (
                threadQuery && threadMessages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                    <p className="font-bricolage text-lg font-bold text-black">No messages found</p>
                    <p className="text-sm text-black/50">Nothing matches &quot;{threadQuery}&quot; in this conversation.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto bg-neutral-100 px-4 py-3">
                    {threadRenderItems.map((item, index) => {
                      const isOwner = item.message.sender === "owner";
                      return (
                        <div key={index}>
                          {item.showDate ? (
                            <div className="flex justify-center py-2">
                              <span className="text-[10px] font-semibold tracking-wide text-black/40 uppercase">{item.dateLabel}</span>
                            </div>
                          ) : null}
                          <div className={`flex py-0.5 ${isOwner ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[65%] rounded-lg px-2.5 py-1.5 text-sm ${
                                isOwner ? "rounded-tr-none bg-black text-white" : "rounded-tl-none bg-white text-neutral-900"
                              }`}
                            >
                              {item.message.attachment?.kind === "image" ? (
                                /* eslint-disable-next-line @next/next/no-img-element -- object URL, not eligible for next/image optimization */
                                <img src={item.message.attachment.url} alt={item.message.attachment.name} className="mb-1 max-h-64 w-full rounded-md object-cover" />
                              ) : null}
                              {item.message.attachment?.kind === "document" ? (
                                <a
                                  href={item.message.attachment.url}
                                  download={item.message.attachment.name}
                                  className={`mb-1 flex items-center gap-2 rounded-md p-2 transition-colors ${isOwner ? "bg-white/10 hover:bg-white/15" : "bg-neutral-100 hover:bg-neutral-200"}`}
                                >
                                  <FileText aria-hidden="true" className="size-5 shrink-0" />
                                  <span className="truncate text-xs font-medium">{item.message.attachment.name}</span>
                                </a>
                              ) : null}
                              {item.message.text ? <span className="leading-snug wrap-break-word">{item.message.text}</span> : null}
                              <span className={`float-right mt-1 ml-2 text-[10px] font-medium ${isOwner ? "text-white/60" : "text-neutral-400"}`}>
                                {timeLabel(item.message.ts)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                  <MessageCircle aria-hidden="true" className="size-14 text-black" strokeWidth={1.5} />
                  <h2 className="font-bricolage text-xl font-bold text-black">Select a conversation</h2>
                  <p className="text-sm text-black/50">Choose a conversation from the list to view messages.</p>
                </div>
              )}

              {activeChat ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="flex items-center gap-3 bg-neutral-100 p-4"
                >
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelected("image")} />
                  <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    className="hidden"
                    onChange={handleFileSelected("document")}
                  />
                  <div ref={attachMenuRef} className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="Attach"
                      onClick={() => setAttachMenuOpen((open) => !open)}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors hover:border-black/30 hover:text-black"
                    >
                      <Plus aria-hidden="true" className="size-5" />
                    </button>
                    {attachMenuOpen ? (
                      <div className="absolute bottom-[calc(100%+0.5rem)] left-0 z-20 w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                        <button
                          type="button"
                          onClick={() => {
                            setAttachMenuOpen(false);
                            photoInputRef.current?.click();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-black/75 transition-colors hover:bg-black/5"
                        >
                          <ImagePlus aria-hidden="true" className="size-4.5 text-black/60" />
                          Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachMenuOpen(false);
                            documentInputRef.current?.click();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-black/75 transition-colors hover:bg-black/5"
                        >
                          <FileText aria-hidden="true" className="size-4.5 text-black/60" />
                          Document
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-black/15 bg-white px-4 transition-colors focus-within:border-black">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${activeChat.name.split(" ")[0]}`}
                      className="message-composer-control min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-black/40"
                    />
                    <VoiceInputButton onTranscript={(t) => setNewMessage((prev) => (prev ? `${prev} ${t}` : t))} />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    aria-label="Send message"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              ) : null}
            </section>
          </div>
        </div>
      </section>
    </OwnerDashboardShell>
  );
}

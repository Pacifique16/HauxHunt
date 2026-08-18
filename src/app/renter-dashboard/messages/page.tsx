"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Send,
  User,
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  Search,
  Pencil,
  Plus,
} from "lucide-react";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import { PUBLIC_FLATMATES, formatRwf } from "@/data/public-flatmates";

type Message = {
  sender: "user" | "them";
  text: string;
  timestamp: string;
};

type ConversationType = "flatmate" | "landlord" | "manager";

type Conversation = {
  id: string;
  name: string;
  avatar?: any;
  type: ConversationType;
  subtitle: string;
  metaContext: string;
  unread: boolean;
  messages: Message[];
  flatmateDetails?: {
    budget: string;
    areas: string;
    situation: string;
  };
};

const INBOX_TABS = [
  { key: "inbox", label: "Inbox" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
] as const;

type InboxTab = (typeof INBOX_TABS)[number]["key"];

const MORE_FILTERS: Array<[ConversationType, string]> = [
  ["flatmate", "Flatmate Matches"],
  ["manager", "Listing Enquiries"],
  ["landlord", "Application Reviews"],
];

export default function RenterDashboardMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<InboxTab>("inbox");
  const [typeFilter, setTypeFilter] = useState<ConversationType | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [composeMode, setComposeMode] = useState(false);
  const [composeQuery, setComposeQuery] = useState("");
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // Load and sync co-living matches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const interestsStr = window.sessionStorage.getItem("hauxhunt-flatmate-interests") || "[]";
      const receivedStr = window.sessionStorage.getItem("hauxhunt-flatmate-received-interests") || "[]";
      try {
        const interests = JSON.parse(interestsStr) as string[];
        const received = JSON.parse(receivedStr) as string[];
        const matchesIds = interests.filter(id => received.includes(id));

        // Build list of matched flatmates
        const matchedProfiles = PUBLIC_FLATMATES.filter(f => matchesIds.includes(f.id));

        // Create mock conversations
        const chats: Conversation[] = [];

        // 1. Add matched flatmates first
        matchedProfiles.forEach(flatmate => {
          chats.push({
            id: flatmate.id,
            name: flatmate.firstName,
            avatar: flatmate.portrait,
            type: "flatmate",
            subtitle: `${flatmate.age} · ${flatmate.occupation}`,
            metaContext: "Flatmate Match",
            unread: true,
            flatmateDetails: {
              budget: flatmate.situation === "looking"
                ? `${formatRwf(flatmate.budgetMin)}–${formatRwf(flatmate.budgetMax)}`
                : `${formatRwf(flatmate.budgetMin)} / month`,
              areas: flatmate.areas.join(", "),
              situation: flatmate.situation === "looking" ? "Looking for a place" : "Already has a place"
            },
            messages: [
              {
                sender: "them",
                text: `Hi Julien! I saw you expressed interest in being flatmates. I think our routines and budget align perfectly. Let me know when you'd love to chat!`,
                timestamp: "2:40 PM"
              }
            ]
          });
        });

        // 2. Add static property manager enquiries
        chats.push({
          id: "patrick-manager",
          name: "Patrick (Manager)",
          type: "manager",
          subtitle: "Modern villa in Kibagabaga",
          metaContext: "Listing Enquiry",
          unread: true,
          messages: [
            {
              sender: "them",
              text: "Hello Julien, your viewing request for Saturday at 10:00 AM has been confirmed. See you there!",
              timestamp: "Yesterday"
            }
          ]
        });

        chats.push({
          id: "kacyiru-owner",
          name: "Jean (Owner)",
          type: "landlord",
          subtitle: "Cozy 2BR in Kacyiru",
          metaContext: "Application Review",
          unread: true,
          messages: [
            {
              sender: "them",
              text: "Hi Julien, thanks for submitting your application. We are currently verifying references and will get back to you by Friday.",
              timestamp: "3 days ago"
            }
          ]
        });

        // Read active chat parameter from URL (e.g. ?chat=aline)
        const urlParams = new URLSearchParams(window.location.search);
        const chatParam = urlParams.get("chat");
        const initialId = chatParam && chats.some(c => c.id === chatParam)
          ? chatParam
          : chats[0]?.id ?? "";

        // The chat we're opening on load starts out read.
        const chatsWithInitialRead = chats.map(c =>
          c.id === initialId ? { ...c, unread: false } : c
        );

        setConversations(chatsWithInitialRead);
        setActiveChatId(initialId);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Close the "More..." dropdown on outside click
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const selectChat = (id: string) => {
    setActiveChatId(id);
    setComposeMode(false);
    setConversations(prev => prev.map(c => (c.id === id ? { ...c, unread: false } : c)));
  };

  const startNewMessage = () => {
    setComposeMode(true);
    setComposeQuery("");
    setActiveChatId("");
    requestAnimationFrame(() => toInputRef.current?.focus());
  };

  const searchedConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.subtitle.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const visibleConversations = useMemo(() => {
    return searchedConversations.filter(c => {
      if (typeFilter) return c.type === typeFilter;
      if (activeTab === "unread") return c.unread;
      if (activeTab === "read") return !c.unread;
      return true;
    });
  }, [searchedConversations, activeTab, typeFilter]);

  const composeMatches = useMemo(() => {
    const query = composeQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(c => c.name.toLowerCase().includes(query));
  }, [conversations, composeQuery]);

  const emptyStateCopy = (() => {
    if (searchQuery.trim()) {
      return {
        title: "No Messages Found",
        body: `Nothing matches "${searchQuery.trim()}". Try a different name or property.`,
      };
    }
    if (typeFilter) {
      return {
        title: "No Messages",
        body: `No conversations under ${MORE_FILTERS.find(([t]) => t === typeFilter)?.[1]} yet.`,
      };
    }
    if (activeTab === "unread") {
      return { title: "No Unread Messages", body: "You're all caught up. New messages will appear here." };
    }
    if (activeTab === "read") {
      return { title: "No Read Messages", body: "Messages you've opened will appear here." };
    }
    return {
      title: "No Messages",
      body: "You don't have any messages yet. When you receive a message, it will appear here.",
    };
  })();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const updated = conversations.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [
            ...c.messages,
            {
              sender: "user" as const,
              text: newMessage.trim(),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return c;
    });

    setConversations(updated);
    setNewMessage("");
  };

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="flex h-svh flex-col bg-white pt-16 text-black">
        <div className="flex min-h-0 flex-1">
          {/* Conversations List Panel */}
          <aside className="flex w-full max-w-[360px] shrink-0 flex-col border-r border-black/10">
            <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
              <Link
                href="/flatmates?from=renter"
                aria-label="Back to Flatmates"
                className="text-black/50 transition-colors hover:text-black"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </Link>
              <h1 className="font-bricolage flex-1 text-2xl font-bold tracking-tight">
                Messages
              </h1>
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
                <VoiceInputButton onTranscript={(t) => setSearchQuery(t)} />
              </label>
            </div>

            <div className="flex items-center gap-2 px-5 pb-4">
              {INBOX_TABS.map((tab) => {
                const isActive = !typeFilter && activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.key);
                      setTypeFilter(null);
                    }}
                    className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-black/15 bg-white text-black/70 hover:border-black/30 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
              <div ref={moreMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen((open) => !open)}
                  className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-4 text-sm font-medium transition-colors ${
                    typeFilter
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-black/70 hover:border-black/30 hover:text-black"
                  }`}
                >
                  {typeFilter ? MORE_FILTERS.find(([t]) => t === typeFilter)?.[1] : "More..."}
                  <ChevronDown aria-hidden="true" className="size-3.5" />
                </button>
                {moreOpen && (
                  <div className="absolute top-[calc(100%+0.5rem)] left-0 z-20 w-56 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
                    {MORE_FILTERS.map(([type, label]) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setTypeFilter(type);
                          setMoreOpen(false);
                        }}
                        className={`block w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                          typeFilter === type ? "bg-black text-white" : "text-black/75 hover:bg-black/5"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                    {typeFilter && (
                      <button
                        type="button"
                        onClick={() => {
                          setTypeFilter(null);
                          setMoreOpen(false);
                        }}
                        className="mt-1 block w-full rounded-xl border-t border-black/5 px-3.5 py-2.5 text-left text-sm font-medium text-black/50 hover:bg-black/5"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-black/10" />

            <div className="flex-1 overflow-y-auto p-2.5">
              {visibleConversations.length === 0 ? (
                <div className="flex flex-col items-center px-6 py-16 text-center">
                  <h3 className="font-bricolage text-lg font-bold text-black">
                    {emptyStateCopy.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/50">
                    {emptyStateCopy.body}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {visibleConversations.map((convo) => {
                    const isActive = convo.id === activeChatId && !composeMode;
                    const lastMsg = convo.messages[convo.messages.length - 1];
                    return (
                      <button
                        key={convo.id}
                        onClick={() => selectChat(convo.id)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all duration-150 flex gap-3.5 border ${
                          isActive
                            ? "bg-black/5 border-black/10"
                            : "bg-transparent border-transparent hover:bg-black/[0.03]"
                        }`}
                      >
                        <div className="relative size-11 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-100 flex items-center justify-center">
                          {convo.avatar ? (
                            <Image
                              src={convo.avatar}
                              alt={convo.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="size-5 text-neutral-500" />
                          )}
                          {convo.unread && (
                            <span className="absolute top-0 right-0 size-2.5 rounded-full bg-black ring-2 ring-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className={`text-sm truncate ${convo.unread ? "font-bold text-black" : "font-semibold text-neutral-900"}`}>
                              {convo.name}
                            </h3>
                            <span className="text-[9px] text-neutral-400 shrink-0 font-medium">
                              {lastMsg?.timestamp || ""}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500 truncate mt-0.5 font-medium">
                            {convo.subtitle}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <p className={`text-xs truncate flex-1 ${convo.unread ? "text-black font-semibold" : "text-neutral-600"}`}>
                              {lastMsg?.text || "No messages yet"}
                            </p>
                            <span className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 shrink-0 ${
                              convo.type === "flatmate"
                                ? "bg-black text-white"
                                : "bg-neutral-150 text-neutral-600"
                            }`}>
                              {convo.metaContext}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4">
              <button
                type="button"
                onClick={startNewMessage}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                <Pencil aria-hidden="true" className="size-4" />
                New Message
              </button>
            </div>
          </aside>

          {/* Active Chat Panel */}
          <section className="flex min-w-0 flex-1 flex-col">
            {/* To: bar */}
            <div className="relative border-b border-black/10 px-6">
              <div className="flex h-16 items-center gap-3">
                <span className="shrink-0 text-sm text-black/40">To:</span>
                {composeMode ? (
                  <span className="catalogue-location-filter flex min-w-0 flex-1 items-center gap-2 px-4">
                    <Search aria-hidden="true" className="text-carbon-500 size-4 shrink-0" />
                    <input
                      ref={toInputRef}
                      value={composeQuery}
                      onChange={(e) => setComposeQuery(e.target.value)}
                      placeholder="Search people or properties…"
                      className="catalogue-filter-control min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={startNewMessage}
                    className="min-w-0 flex-1 truncate text-left text-sm font-medium text-black/85"
                  >
                    {activeChat ? activeChat.name : ""}
                  </button>
                )}
              </div>
              {composeMode && (
                <div className="absolute inset-x-0 top-full z-20 max-h-72 overflow-y-auto rounded-b-2xl border-x border-b border-black/10 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                  {composeMatches.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-black/40">No matches found.</p>
                  ) : (
                    composeMatches.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectChat(c.id)}
                        className="flex w-full items-center gap-3 px-6 py-3 text-left transition-colors hover:bg-black/5"
                      >
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                          {c.avatar ? (
                            <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                          ) : (
                            <User className="size-4 text-neutral-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-black">{c.name}</p>
                          <p className="truncate text-xs text-black/50">{c.subtitle}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Flatmate Match Context Sub-Banner */}
            {!composeMode && activeChat?.type === "flatmate" && activeChat.flatmateDetails && (
              <div className="px-6 py-3.5 border-b border-black/10 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <span className="font-semibold text-black/50 uppercase text-[9px] tracking-wider">Situation:</span>
                  <span className="font-semibold text-neutral-800">{activeChat.flatmateDetails.situation}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <span className="font-semibold text-black/50 uppercase text-[9px] tracking-wider">Budget:</span>
                  <span className="font-semibold text-neutral-800">{activeChat.flatmateDetails.budget}</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <span className="font-semibold text-black/50 uppercase text-[9px] tracking-wider">Preferred Areas:</span>
                  <span className="font-semibold text-neutral-800 truncate max-w-[200px]" title={activeChat.flatmateDetails.areas}>
                    {activeChat.flatmateDetails.areas}
                  </span>
                </div>
              </div>
            )}

            {/* Messages Body */}
            {!composeMode && activeChat ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeChat.messages.map((msg, index) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={index}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] rounded-2xl p-4 text-sm shadow-sm ${
                        isUser
                          ? "bg-black text-white rounded-br-none"
                          : "bg-neutral-50 border border-neutral-100 text-neutral-900 rounded-bl-none"
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className={`text-[9px] mt-1.5 block text-right font-medium ${
                          isUser ? "text-white/60" : "text-neutral-400"
                        }`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <MessageCircle aria-hidden="true" className="size-14 text-black" strokeWidth={1.5} />
                <h2 className="font-bricolage text-xl font-bold text-black">Start a conversation</h2>
                <p className="text-sm text-black/50">Type your first message below.</p>
              </div>
            )}

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 border-t border-black/10 p-4">
              <button
                type="button"
                aria-label="Attach"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-black/15 text-black/60 transition-colors hover:border-black/30 hover:text-black"
              >
                <Plus aria-hidden="true" className="size-5" />
              </button>
              <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-black/15 bg-white px-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  disabled={!activeChat}
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed"
                />
                <VoiceInputButton onTranscript={(t) => setNewMessage((prev) => (prev ? `${prev} ${t}` : t))} />
              </div>
              <button
                type="submit"
                disabled={!activeChat || !newMessage.trim()}
                aria-label="Send message"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send className="size-4" />
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

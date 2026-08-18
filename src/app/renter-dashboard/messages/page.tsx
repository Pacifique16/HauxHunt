"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Send,
  ChevronLeft,
  ChevronDown,
  MessageCircle,
  Search,
  Phone,
  Plus,
  X,
  ImagePlus,
  FileText,
  Camera,
} from "lucide-react";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { VoiceInputButton } from "@/components/listings/voice-input-button";
import { PUBLIC_FLATMATES, formatRwf } from "@/data/public-flatmates";
import { getStoredThreads, recordSentMessage, slugify } from "@/lib/message-threads";
import patrickManagerPortrait from "@/assets/images/flatmate-patrick.png";
import jeanOwnerPortrait from "@/assets/images/flatmate-joseph.jpg";

type Attachment = {
  kind: "image" | "document";
  name: string;
  url: string;
};

type Message = {
  sender: "user" | "them";
  text: string;
  timestamp: string;
  // Real epoch time, used only to sort the conversation list by most recent
  // activity — `timestamp` above is the display label ("Yesterday", "2:40 PM").
  ts: number;
  attachment?: Attachment;
};

type ConversationType = "flatmate" | "landlord" | "manager" | "support";

type Conversation = {
  id: string;
  name: string;
  avatar?: any;
  type: ConversationType;
  subtitle: string;
  metaContext: string;
  unread: boolean;
  phone: string;
  messages: Message[];
  flatmateDetails?: {
    budget: string;
    areas: string;
    situation: string;
  };
};

const COUNTRY_CALLING_CODES: Record<string, string> = {
  Rwanda: "+250",
  Kenya: "+254",
  Nigeria: "+234",
  Uganda: "+256",
};

// Demo data has no real phone numbers on file, so derive a stable, plausible-looking
// one per conversation (same id always produces the same number).
function demoPhoneNumber(seed: string, countryCode: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const local = String(700000000 + (hash % 99999999)).padStart(9, "0").slice(0, 9);
  return `${countryCode} ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 9)}`;
}

const INBOX_TABS = [
  { key: "inbox", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
] as const;

type InboxTab = (typeof INBOX_TABS)[number]["key"];

const MORE_FILTERS: Array<[ConversationType, string]> = [
  ["flatmate", "Flatmate Matches"],
  ["manager", "Listing Enquiries"],
  ["landlord", "My Rental"],
  ["support", "Property Search"],
];

const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 560;
const SIDEBAR_DEFAULT_WIDTH = 400;

function ConversationAvatar({
  avatar,
  name,
  className,
}: {
  avatar?: any;
  name: string;
  className: string;
}) {
  if (avatar) {
    return (
      <div className={`relative overflow-hidden rounded-full bg-neutral-200 ${className}`}>
        <Image src={avatar} alt={name} fill className="object-cover" />
      </div>
    );
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full bg-black font-bricolage font-bold text-white ${className}`}
    >
      {initial}
    </div>
  );
}

function messagePreview(message?: Message) {
  if (!message) return "No messages yet";
  if (message.text) return message.text;
  if (message.attachment?.kind === "image") return "📷 Photo";
  if (message.attachment?.kind === "document") return `📄 ${message.attachment.name}`;
  return "No messages yet";
}

// Most recent message in the thread, sent or received — used to sort the
// conversation list so active conversations rise to the top.
function lastActivity(conversation: Conversation) {
  // `|| 0` guards against messages persisted before `ts` existed (older
  // sessionStorage data) — without it, one legacy message with a missing/NaN
  // `ts` would poison Math.max for the whole conversation, silently freezing
  // its position instead of letting it jump to the top after a new send.
  return conversation.messages.reduce((latest, m) => Math.max(latest, m.ts || 0), 0);
}

// Wraps every case-insensitive occurrence of `query` in `text` with an underlined,
// bolded span — kept monochrome (no highlight color) so it reads on both bubble colors.

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-transparent font-bold underline decoration-2 underline-offset-2">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export default function RenterDashboardMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [threadSearchOpen, setThreadSearchOpen] = useState(false);
  const [threadSearchQuery, setThreadSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<InboxTab>("inbox");
  const [typeFilter, setTypeFilter] = useState<ConversationType | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Live-stream the device camera into the <video> element while the camera
  // dialog is open, and always release it again on close/unmount.
  useEffect(() => {
    if (!cameraOpen) return;
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        cameraStreamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        if (!cancelled) {
          setCameraError("Couldn't access your camera. Check your browser's camera permission and try again.");
        }
      });

    return () => {
      cancelled = true;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    };
  }, [cameraOpen]);

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

        // Real epoch offsets behind each display timestamp above, purely so
        // the sidebar can be sorted by most-recent activity.
        const now = Date.now();
        const HOUR = 3_600_000;
        const DAY = 24 * HOUR;

        // Create mock conversations
        const chats: Conversation[] = [];

        // 1. Add matched flatmates first
        matchedProfiles.forEach((flatmate, index) => {
          chats.push({
            id: flatmate.id,
            name: flatmate.firstName,
            avatar: flatmate.portrait,
            type: "flatmate",
            subtitle: `${flatmate.age} · ${flatmate.occupation}`,
            metaContext: "Flatmate Match",
            unread: true,
            phone: demoPhoneNumber(flatmate.id, COUNTRY_CALLING_CODES[flatmate.country] ?? "+250"),
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
                timestamp: "2:40 PM",
                ts: now - 2 * HOUR - index * 300_000
              }
            ]
          });
        });

        // 2. Add static property manager enquiries
        chats.push({
          id: "patrick-manager",
          name: "Patrick",
          avatar: patrickManagerPortrait,
          type: "manager",
          subtitle: "Modern villa in Kibagabaga · Property Manager",
          metaContext: "Listing Enquiry",
          unread: true,
          phone: demoPhoneNumber("patrick-manager", "+250"),
          messages: [
            {
              sender: "them",
              text: "Hello Julien, your viewing request for Saturday at 10:00 AM has been confirmed. See you there!",
              timestamp: "Yesterday",
              ts: now - DAY
            }
          ]
        });

        // Jean Mugisha is the property manager for Kacyiru Residence — the
        // same character referenced across My Rentals, Payments, Maintenance
        // and Rental Setup — so this thread carries the whole relationship,
        // from viewing through to an active tenancy.
        chats.push({
          id: "kacyiru-owner",
          name: "Jean Mugisha",
          avatar: jeanOwnerPortrait,
          type: "landlord",
          subtitle: "Kacyiru Residence · Property Manager",
          metaContext: "Property Manager",
          unread: true,
          phone: demoPhoneNumber("kacyiru-owner", "+250"),
          messages: [
            {
              sender: "them",
              text: "Hi Julien, your viewing for Kacyiru Residence is confirmed for Saturday at 10:00 AM. Looking forward to showing you around!",
              timestamp: "5 days ago",
              ts: now - 5 * DAY
            },
            {
              sender: "them",
              text: "Hi Julien, thanks for submitting your application. We are currently verifying references and will get back to you by Friday.",
              timestamp: "3 days ago",
              ts: now - 3 * DAY
            },
            {
              sender: "them",
              text: "Just a reminder that rent for Kacyiru Residence is due on the 1st. Let me know if you have any questions about your payment.",
              timestamp: "Yesterday",
              ts: now - DAY + 2 * HOUR
            }
          ]
        });

        // 3. Maintenance updates come from the technician assigned to the
        // ticket, not the property manager — matches the scheduledVisit
        // contact on the leaking-tap request in lib/maintenance-data.ts.
        chats.push({
          id: "eric-maintenance",
          name: "Eric N.",
          type: "landlord",
          subtitle: "Kacyiru Residence · Maintenance Technician",
          metaContext: "Maintenance Update",
          unread: true,
          phone: demoPhoneNumber("eric-maintenance", "+250"),
          messages: [
            {
              sender: "them",
              text: "Hi Julien, I'm scheduled to fix the leaking kitchen tap tomorrow at 10:00–11:00 AM. See you then!",
              timestamp: "Today",
              ts: now - 3 * HOUR
            }
          ]
        });

        // 4. The HauxHunt concierge follows up on open "Property search"
        // support requests (see renter-dashboard/requests).
        chats.push({
          id: "hauxhunt-concierge",
          name: "HauxHunt Concierge",
          type: "support",
          subtitle: "Property Search",
          metaContext: "Property Search",
          unread: true,
          phone: demoPhoneNumber("hauxhunt-concierge", "+250"),
          messages: [
            {
              sender: "them",
              text: "Hi Julien, we found 3 homes matching your search for a two-bedroom apartment in Kacyiru or Nyarutarama, USD 500–800/month. Check them out in your dashboard!",
              timestamp: "Today",
              ts: now - 5 * HOUR
            }
          ]
        });

        // 5. Merge in any messages the renter sent from elsewhere in the app
        // (a property enquiry, "Message Property Manager" on a rental, a
        // maintenance update, etc.) — so wherever a message was sent from,
        // it shows up here too, and keeps showing up on later visits.
        getStoredThreads().forEach((thread) => {
          const existingIndex = chats.findIndex(c => c.id === thread.id);
          if (existingIndex >= 0) {
            chats[existingIndex] = {
              ...chats[existingIndex],
              messages: [...chats[existingIndex].messages, ...thread.messages],
            };
          } else {
            chats.push({
              ...thread,
              unread: false,
              phone: demoPhoneNumber(thread.id, "+250"),
            });
          }
        });

        // Resolve which chat to open from the URL. `?chat=<id>` (used by
        // flatmate links) takes priority; failing that, `?host=`/`?property=`
        // (used by "Message Property Manager" / "Contact Landlord" links
        // across rentals, payments, maintenance, applications and visits)
        // opens the matching thread — creating an empty one, ready to type
        // into, if this recipient hasn't been messaged yet.
        const urlParams = new URLSearchParams(window.location.search);
        const chatParam = urlParams.get("chat");
        const hostParam = urlParams.get("host");
        const propertyParam = urlParams.get("property");
        const maintenanceParam = urlParams.get("maintenance");
        const applicationParam = urlParams.get("application");
        const viewingParam = urlParams.get("viewing");

        let initialId = "";

        if (chatParam && chats.some(c => c.id === chatParam)) {
          initialId = chatParam;
        } else if (maintenanceParam && chats.some(c => c.metaContext === "Maintenance Update")) {
          initialId = chats.find(c => c.metaContext === "Maintenance Update")!.id;
        } else if (hostParam) {
          const existing = chats.find(c => c.name.toLowerCase() === hostParam.toLowerCase());
          if (existing) {
            initialId = existing.id;
          } else {
            const id = `landlord-${slugify(hostParam)}`;
            chats.push({
              id,
              name: hostParam,
              type: applicationParam || viewingParam ? "landlord" : "manager",
              subtitle: propertyParam ? `${propertyParam} · Property Manager` : "Property Manager",
              metaContext: applicationParam ? "Application Update" : viewingParam ? "Viewing" : "Listing Enquiry",
              unread: false,
              phone: demoPhoneNumber(id, "+250"),
              messages: [],
            });
            initialId = id;
          }
        } else if (propertyParam) {
          const id = `landlord-${slugify(propertyParam)}`;
          const existing = chats.find(c => c.id === id);
          if (existing) {
            initialId = id;
          } else {
            chats.push({
              id,
              name: "Property Manager",
              type: "manager",
              subtitle: propertyParam,
              metaContext: applicationParam ? "Application Update" : "Listing Enquiry",
              unread: false,
              phone: demoPhoneNumber(id, "+250"),
              messages: [],
            });
            initialId = id;
          }
        } else {
          // No chat/host/property param — e.g. arriving from the top nav's
          // plain "Messages" link — land on the inbox with nothing open,
          // instead of auto-selecting the first conversation.
          initialId = "";
        }

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

  // Close the attach ("+") dropdown on outside click
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!attachMenuRef.current?.contains(event.target as Node)) {
        setAttachMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const activeChat = conversations.find(c => c.id === activeChatId);

  const selectChat = (id: string) => {
    setActiveChatId(id);
    setThreadSearchOpen(false);
    setThreadSearchQuery("");
    setConversations(prev => prev.map(c => (c.id === id ? { ...c, unread: false } : c)));
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
    return searchedConversations
      .filter(c => {
        if (typeFilter) return c.type === typeFilter;
        if (activeTab === "unread") return c.unread;
        if (activeTab === "read") return !c.unread;
        return true;
      })
      .sort((a, b) => lastActivity(b) - lastActivity(a));
  }, [searchedConversations, activeTab, typeFilter]);

  const threadQuery = threadSearchQuery.trim();
  const threadMessages = useMemo(() => {
    if (!activeChat) return [];
    if (!threadQuery) return activeChat.messages;
    return activeChat.messages.filter((m) =>
      m.text.toLowerCase().includes(threadQuery.toLowerCase())
    );
  }, [activeChat, threadQuery]);

  // Jump to the latest message whenever a chat is opened or a new message
  // arrives — same as WhatsApp, the most recent message sits just above the
  // composer instead of leaving the thread scrolled to the top.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeChatId, threadMessages.length]);

  const emptyStateCopy = (() => {
    if (searchQuery.trim()) {
      return {
        title: `No results found for "${searchQuery.trim()}"`,
        body: "Try a different name or property, or clear your search.",
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

  const appendMessage = (chatId: string, message: Omit<Message, "timestamp" | "ts">) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  ...message,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  ts: Date.now(),
                },
              ],
            }
          : c
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const text = newMessage.trim();
    appendMessage(activeChat.id, { sender: "user", text });
    recordSentMessage(
      {
        id: activeChat.id,
        name: activeChat.name,
        subtitle: activeChat.subtitle,
        metaContext: activeChat.metaContext,
        type: activeChat.type,
      },
      text
    );
    setNewMessage("");
  };

  const handleFileSelected =
    (kind: Attachment["kind"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !activeChat) return;
      appendMessage(activeChat.id, {
        sender: "user",
        text: "",
        attachment: { kind, name: file.name, url: URL.createObjectURL(file) },
      });
    };

  // Drag the divider between the conversation list and the chat panel to
  // resize the sidebar, clamped to [SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH].
  const startSidebarResize = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const next = startWidth + (moveEvent.clientX - startX);
      setSidebarWidth(Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, next)));
    };
    const handlePointerUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const openCamera = () => {
    setAttachMenuOpen(false);
    setCameraError(null);
    setCameraOpen(true);
  };

  const closeCamera = () => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !activeChat) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      appendMessage(activeChat.id, {
        sender: "user",
        text: "",
        attachment: { kind: "image", name: `Photo ${Date.now()}.jpg`, url: URL.createObjectURL(blob) },
      });
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="flex h-svh flex-col bg-white pt-16 text-black">
        <div className="flex min-h-0 flex-1">
          {/* Conversations List Panel */}
          <aside className="flex shrink-0 flex-col" style={{ width: sidebarWidth }}>
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
              </label>
            </div>

            <div className="flex items-center gap-1.5 px-5 pb-4">
              <div
                className="flex min-w-0 items-center gap-1.5 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
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
                      className={`h-9 shrink-0 rounded-full border px-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-black bg-black text-white"
                          : "border-black/15 bg-white text-black/70 hover:border-black/30 hover:text-black"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              {/* Kept outside the scrollable strip above so its dropdown never gets clipped by that container's overflow. */}
              <div ref={moreMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setMoreOpen((open) => !open)}
                  className={`inline-flex h-9 shrink-0 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors ${
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
                  {searchQuery.trim() && (
                    <Search aria-hidden="true" className="mb-3 size-8 text-black/20" />
                  )}
                  <h3 className="font-bricolage text-lg font-bold text-black">
                    {emptyStateCopy.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/50">
                    {emptyStateCopy.body}
                  </p>
                  {searchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-4 rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:border-black/30 hover:text-black"
                    >
                      Clear search
                    </button>
                  )}
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
                        className={`w-full text-left p-3.5 rounded-2xl transition-all duration-150 flex gap-3.5 border border-transparent ${
                          isActive
                            ? "bg-black/5"
                            : "bg-transparent hover:bg-black/3"
                        }`}
                      >
                        <div className="relative size-11 shrink-0">
                          <ConversationAvatar
                            avatar={convo.avatar}
                            name={convo.name}
                            className="size-11 border border-neutral-100 text-base"
                          />
                          {convo.unread && (
                            <span className="absolute top-0 right-0 size-2.5 rounded-full bg-black ring-2 ring-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className={`text-sm font-semibold truncate ${convo.unread ? "text-black" : "text-neutral-900"}`}>
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
                            <p className={`text-xs truncate flex-1 ${convo.unread ? "text-black" : "text-neutral-600"}`}>
                              {messagePreview(lastMsg)}
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
          </aside>

          {/* Drag to resize the conversation list, clamped between
              SIDEBAR_MIN_WIDTH and SIDEBAR_MAX_WIDTH. */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize conversation list"
            aria-valuenow={sidebarWidth}
            aria-valuemin={SIDEBAR_MIN_WIDTH}
            aria-valuemax={SIDEBAR_MAX_WIDTH}
            tabIndex={0}
            onPointerDown={startSidebarResize}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                setSidebarWidth((w) => Math.max(SIDEBAR_MIN_WIDTH, w - 16));
              } else if (e.key === "ArrowRight") {
                setSidebarWidth((w) => Math.min(SIDEBAR_MAX_WIDTH, w + 16));
              }
            }}
            className="w-1.5 shrink-0 cursor-col-resize border-r border-black/10 bg-transparent transition-colors hover:border-black/25 hover:bg-black/5 focus-visible:bg-black/10"
          />

          {/* Active Chat Panel */}
          <section className="flex min-w-0 flex-1 flex-col">
            {/* Chat header */}
            {activeChat && (
              <div className="flex h-16 shrink-0 items-center gap-3 border-b border-black/10 px-6">
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
                      <X aria-hidden="true" className="size-4.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <ConversationAvatar avatar={activeChat.avatar} name={activeChat.name} className="size-10" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-black">{activeChat.name}</p>
                      <p className="truncate text-xs text-black/50">{activeChat.subtitle}</p>
                    </div>
                    <a
                      href={`tel:${activeChat.phone.replace(/\s+/g, "")}`}
                      aria-label={`Call ${activeChat.name}`}
                      title={activeChat.phone}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                    >
                      <Phone aria-hidden="true" className="size-4.5" />
                    </a>
                    <button
                      type="button"
                      aria-label="Search in conversation"
                      onClick={() => setThreadSearchOpen(true)}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                    >
                      <Search aria-hidden="true" className="size-4.5" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Flatmate Match Context Sub-Banner */}
            {activeChat?.type === "flatmate" && activeChat.flatmateDetails && (
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
            {activeChat ? (
              threadQuery && threadMessages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <p className="font-bricolage text-lg font-bold text-black">No messages found</p>
                  <p className="text-sm text-black/50">
                    Nothing matches &quot;{threadQuery}&quot; in this conversation.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto bg-neutral-100 px-4 py-3 space-y-1">
                  {threadMessages.map((msg, index) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div
                        key={index}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[65%] rounded-lg px-2.5 py-1.5 text-sm ${
                          isUser
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-white text-neutral-900 rounded-tl-none"
                        }`}>
                          {msg.attachment?.kind === "image" && (
                            /* eslint-disable-next-line @next/next/no-img-element -- object URL, not eligible for next/image optimization */
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              className="mb-1 max-h-64 w-full rounded-md object-cover"
                            />
                          )}
                          {msg.attachment?.kind === "document" && (
                            <a
                              href={msg.attachment.url}
                              download={msg.attachment.name}
                              className={`mb-1 flex items-center gap-2 rounded-md p-2 transition-colors ${
                                isUser ? "bg-white/10 hover:bg-white/15" : "bg-neutral-100 hover:bg-neutral-200"
                              }`}
                            >
                              <FileText aria-hidden="true" className="size-5 shrink-0" />
                              <span className="truncate text-xs font-medium">{msg.attachment.name}</span>
                            </a>
                          )}
                          {msg.text && (
                            <span className="leading-snug wrap-break-word">
                              {threadQuery ? highlightMatch(msg.text, threadQuery) : msg.text}
                            </span>
                          )}
                          <span className={`float-right mt-1 ml-2 text-[10px] font-medium ${
                            isUser ? "text-white/60" : "text-neutral-400"
                          }`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )
            ) : conversations.length > 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <MessageCircle aria-hidden="true" className="size-14 text-black" strokeWidth={1.5} />
                <h2 className="font-bricolage text-xl font-bold text-black">Select a conversation</h2>
                <p className="text-sm text-black/50">Choose a conversation from the list to view messages.</p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <MessageCircle aria-hidden="true" className="size-14 text-black/30" strokeWidth={1.5} />
                <h2 className="font-bricolage text-xl font-bold text-black">No Messages</h2>
                <p className="text-sm text-black/50">
                  You don&apos;t have any messages yet. When you receive a message, it will appear here.
                </p>
              </div>
            )}

            {/* Message Input Box — only shown once a conversation is open */}
            {activeChat && (
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-neutral-100 p-4">
              {/* Hidden file inputs, triggered from the attach dropdown below */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected("image")}
              />
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
                  disabled={!activeChat}
                  onClick={() => setAttachMenuOpen((open) => !open)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus aria-hidden="true" className="size-5" />
                </button>
                {attachMenuOpen && (
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
                    <button
                      type="button"
                      onClick={openCamera}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-black/75 transition-colors hover:bg-black/5"
                    >
                      <Camera aria-hidden="true" className="size-4.5 text-black/60" />
                      Camera
                    </button>
                  </div>
                )}
              </div>
              <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-black/15 bg-white px-4 transition-colors focus-within:border-black">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                  disabled={!activeChat}
                  className="message-composer-control min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed"
                />
                <VoiceInputButton onTranscript={(t) => setNewMessage((prev) => (prev ? `${prev} ${t}` : t))} />
              </div>
              <button
                type="submit"
                disabled={!activeChat || !newMessage.trim()}
                aria-label="Send message"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all hover:bg-neutral-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send className="size-4" />
              </button>
            </form>
            )}
          </section>
        </div>
      </main>

      {cameraOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Take a photo"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black"
        >
          <button
            type="button"
            onClick={closeCamera}
            aria-label="Close camera"
            autoFocus
            className="absolute top-4 right-4 z-20 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <X aria-hidden="true" className="size-5" />
          </button>

          {cameraError ? (
            <div className="flex max-w-sm flex-col items-center gap-4 px-6 text-center text-white">
              <Camera aria-hidden="true" className="size-10 text-white/50" />
              <p className="text-sm text-white/80">{cameraError}</p>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-full max-w-full"
              />
              <button
                type="button"
                onClick={capturePhoto}
                aria-label="Take photo"
                className="absolute bottom-8 flex size-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white/10 transition-transform active:scale-90"
              >
                <span className="size-12 rounded-full bg-white" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, MapPin, Briefcase, Building, Check, User, ChevronLeft, MessageSquare } from "lucide-react";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { PUBLIC_FLATMATES, type PublicFlatmate, formatRwf } from "@/data/public-flatmates";

type Message = {
  sender: "user" | "them";
  text: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  name: string;
  avatar?: any;
  type: "flatmate" | "landlord" | "manager";
  subtitle: string;
  metaContext: string;
  messages: Message[];
  flatmateDetails?: {
    budget: string;
    areas: string;
    situation: string;
  };
};

export default function RenterDashboardMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("aline");
  const [newMessage, setNewMessage] = useState("");

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
          messages: [
            {
              sender: "them",
              text: "Hi Julien, thanks for submitting your application. We are currently verifying references and will get back to you by Friday.",
              timestamp: "3 days ago"
            }
          ]
        });

        setConversations(chats);

        // Read active chat parameter from URL (e.g. ?chat=aline)
        const urlParams = new URLSearchParams(window.location.search);
        const chatParam = urlParams.get("chat");
        if (chatParam && chats.some(c => c.id === chatParam)) {
          setActiveChatId(chatParam);
        } else if (chats.length > 0) {
          setActiveChatId(chats[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const activeChat = conversations.find(c => c.id === activeChatId);

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
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <section className="bg-carbon-50 px-5 pt-9 pb-14 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1280px]">
            <Link
              href="/flatmates?from=renter"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-black/65 transition-colors hover:text-black font-semibold"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Back to Flatmates
            </Link>

            <div className="rounded-3xl border border-black/5 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.06)] overflow-hidden grid md:grid-cols-[340px_1fr] h-[720px] max-h-[80vh]">
              {/* Conversations List Panel */}
              <div className="border-r border-black/5 flex flex-col h-full bg-neutral-50/50">
                <div className="p-5 border-b border-black/5">
                  <h1 className="font-bricolage text-xl font-bold tracking-tight">
                    Inbox
                  </h1>
                </div>

                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {conversations.length === 0 ? (
                    <div className="text-center py-10 px-4 text-xs text-neutral-400">
                      No conversations yet. Match with flatmates or inquire about properties to get started.
                    </div>
                  ) : (
                    conversations.map((convo) => {
                      const isActive = convo.id === activeChatId;
                      const lastMsg = convo.messages[convo.messages.length - 1];
                      return (
                        <button
                          key={convo.id}
                          onClick={() => setActiveChatId(convo.id)}
                          className={`w-full text-left p-3.5 rounded-2xl transition-all duration-150 flex gap-3.5 border ${
                            isActive
                              ? "bg-white border-black/5 shadow-sm"
                              : "bg-transparent border-transparent hover:bg-neutral-100"
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
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="text-sm font-bold text-neutral-900 truncate">
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
                              <p className="text-xs text-neutral-600 truncate flex-1">
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
                    })
                  )}
                </div>
              </div>

              {/* Active Chat Panel */}
              <div className="flex flex-col h-full bg-white">
                {activeChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-5 border-b border-black/5 flex items-center justify-between gap-4 bg-neutral-50/25">
                      <div className="flex items-center gap-3.5">
                        <div className="relative size-10 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                          {activeChat.avatar ? (
                            <Image
                              src={activeChat.avatar}
                              alt={activeChat.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="size-5 text-neutral-500" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-neutral-900">
                            {activeChat.name}
                          </h2>
                          <p className="text-xs text-neutral-500">
                            {activeChat.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Header context tag */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border ${
                        activeChat.type === "flatmate"
                          ? "bg-black text-white border-black"
                          : "bg-neutral-50 text-neutral-600 border-black/5"
                      }`}>
                        {activeChat.metaContext}
                      </span>
                    </div>

                    {/* Flatmate Match Context Sub-Banner */}
                    {activeChat.type === "flatmate" && activeChat.flatmateDetails && (
                      <div className="px-5 py-3.5 border-b border-black/5 bg-neutral-50/50 flex flex-wrap gap-x-6 gap-y-2 text-xs">
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
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
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

                    {/* Messages Input Box */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-black/5 flex gap-3.5 bg-neutral-50/25">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${activeChat.name}...`}
                        className="flex-1 h-11 border border-black/10 rounded-xl px-4 text-sm bg-white outline-none focus:border-black transition-colors"
                      />
                      <button
                        type="submit"
                        className="size-11 bg-black hover:bg-neutral-800 active:scale-95 transition-all text-white rounded-xl flex items-center justify-center shrink-0 shadow-md"
                      >
                        <Send className="size-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-400">
                    <MessageSquare className="size-12 text-neutral-300" />
                    <h3 className="font-bricolage text-lg font-bold text-neutral-800 mt-4">
                      No Chat Selected
                    </h3>
                    <p className="text-sm mt-1">
                      Choose a conversation from the sidebar inbox to read and send messages.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

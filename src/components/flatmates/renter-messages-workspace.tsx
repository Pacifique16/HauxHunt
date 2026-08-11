"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { ConnectionState, FlatmateProfile } from "@/types";
import { cn } from "@/lib/utils";
import { FLATMATE_PROFILES } from "@/data/flatmates-demo";
import { useFlatmateConnections } from "@/lib/flatmate-connections";
import { PrivacyAwareAvatar } from "@/components/flatmates/privacy-aware-avatar";
import { PrivacyAwareChatHeader } from "@/components/flatmates/flatmate-chat-header";
import { ConnectionButton } from "@/components/flatmates/connection-button";
import {
  FlatmateMessageThread,
  type ChatMessage,
} from "@/components/flatmates/flatmate-message-thread";

const LIST_ORDER: ConnectionState[] = ["pending_received", "accepted", "pending_sent"];

const SECTION_LABEL: Partial<Record<ConnectionState, string>> = {
  pending_received: "Wants to connect",
  accepted: "Connected",
  pending_sent: "Pending",
};

const STARTER_MESSAGES: Record<string, ChatMessage[]> = {
  "sam-m": [
    {
      id: "starter-1",
      sender: "them",
      text: "Hey! Saw we're both looking at the Kacyiru place — still interested in splitting it?",
      time: "10:14 AM",
    },
  ],
};

/**
 * Renter-side "Messages" — fills the header/profile-menu link that already
 * pointed here with nothing behind it. Combines FlatMat connection
 * requests with the conversation list, per src/Flatmate.md §15's mapping
 * (Existing conversations → FlatMat connection requests → pending/active
 * conversations) rather than adding a separate destination.
 */
export function RenterMessagesWorkspace() {
  const { connections, isSaved } = useFlatmateConnections();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesByProfile, setMessagesByProfile] = useState(STARTER_MESSAGES);

  const items = useMemo(() => {
    return FLATMATE_PROFILES.filter((profile) => LIST_ORDER.includes(connections[profile.id]))
      .sort(
        (a, b) =>
          LIST_ORDER.indexOf(connections[a.id]) - LIST_ORDER.indexOf(connections[b.id]),
      );
  }, [connections]);

  const selected: FlatmateProfile | undefined =
    items.find((profile) => profile.id === selectedId) ?? items[0];
  const selectedState: ConnectionState = selected ? connections[selected.id] : "locked";

  function handleSend(text: string) {
    if (!selected) return;
    setMessagesByProfile((current) => ({
      ...current,
      [selected.id]: [
        ...(current[selected.id] ?? []),
        {
          id: `${Date.now()}`,
          sender: "me",
          text,
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ],
    }));
  }

  if (items.length === 0) {
    return (
      <div className="border-border-default flex flex-col items-center gap-3 rounded-3xl border bg-white p-14 text-center">
        <p className="font-bricolage text-carbon-900 text-lg font-medium">
          No flatmate activity yet
        </p>
        <p className="text-carbon-500 max-w-[46ch] text-sm">
          Visit a property you&apos;re interested in to see who else is looking, and send
          a connection request.
        </p>
        <Link
          href="/renter-dashboard/properties"
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition-opacity hover:opacity-75"
        >
          Browse properties
        </Link>
      </div>
    );
  }

  return (
    <div className="border-border-default grid overflow-hidden rounded-3xl border bg-white lg:grid-cols-[300px_1fr]">
      <aside className="border-border-default max-h-[640px] overflow-y-auto border-b lg:border-r lg:border-b-0">
        {LIST_ORDER.map((state) => {
          const groupItems = items.filter((profile) => connections[profile.id] === state);
          if (groupItems.length === 0) return null;
          return (
            <div key={state}>
              <p className="text-carbon-400 px-4 pt-4 pb-2 text-xs font-medium tracking-wide uppercase">
                {SECTION_LABEL[state]}
              </p>
              {groupItems.map((profile) => {
                const locked = state !== "accepted";
                const isActive = selected?.id === profile.id;
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedId(profile.id)}
                    className={cn(
                      "flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors",
                      isActive
                        ? "border-l-black bg-black/[0.035]"
                        : "border-l-transparent hover:bg-black/[0.02]",
                    )}
                  >
                    <PrivacyAwareAvatar
                      locked={locked}
                      realName={profile.realName}
                      realAvatarSrc={profile.realAvatarSrc}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="font-bricolage truncate text-sm font-medium">
                        {locked ? profile.anonymizedName : profile.realName}
                      </p>
                      <p className="text-carbon-500 truncate text-xs">
                        {state === "pending_received"
                          ? "Wants to connect"
                          : state === "pending_sent"
                            ? "Request pending"
                            : (messagesByProfile[profile.id]?.at(-1)?.text ?? "Say hello")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </aside>

      {selected ? (
        <div className="flex h-[640px] flex-col">
          <div className="border-border-default flex items-center justify-between gap-4 border-b p-4">
            <PrivacyAwareChatHeader
              profile={selected}
              state={selectedState}
              online={selectedState === "accepted"}
            />
            {selectedState === "pending_received" ? (
              <ConnectionButton
                flatmateId={selected.id}
                displayName={selected.anonymizedName}
                state={selectedState}
                saved={isSaved(selected.id)}
                size="sm"
              />
            ) : null}
          </div>
          <div className="min-h-0 flex-1">
            <FlatmateMessageThread
              messages={messagesByProfile[selected.id] ?? []}
              onSend={handleSend}
              disabled={selectedState !== "accepted"}
              disabledPlaceholder={
                selectedState === "pending_received"
                  ? "Accept the request to start chatting"
                  : "Waiting for them to accept your request"
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

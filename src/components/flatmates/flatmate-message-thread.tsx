"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { cn } from "@/lib/utils";

export type ChatMessage = {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
};

export type FlatmateMessageThreadProps = {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  /** True while the chat is still locked (pending approval). */
  disabled?: boolean;
  disabledPlaceholder?: string;
};

/**
 * Message list + composer, matching the bubble/composer visual pattern
 * already used in the partner dashboard's MessagesWorkspace
 * (src/components/partner/enquiries-calendar-dashboard.tsx) — rebuilt here
 * for the renter side since no shared chat component exists yet and that
 * file is partner-only. Locking it via `disabled` is the FlatMat-specific
 * extension (src/Flatmate.md §12).
 */
export function FlatmateMessageThread({
  messages,
  onSend,
  disabled,
  disabledPlaceholder = "Locked until the connection is accepted",
}: FlatmateMessageThreadProps) {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                message.sender === "me"
                  ? "bg-black text-white"
                  : "border-border-default border bg-white",
              )}
            >
              {message.text}
              <div
                className={cn(
                  "mt-1 text-[0.65rem]",
                  message.sender === "me" ? "text-white/50" : "text-carbon-400",
                )}
              >
                {message.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (disabled || !draft.trim()) return;
          onSend(draft.trim());
          setDraft("");
        }}
        className="border-border-default flex items-center gap-2 border-t p-3"
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={disabled}
          placeholder={disabled ? disabledPlaceholder : "Write a message…"}
          rows={1}
          aria-label="Message"
          className="min-w-0 flex-1 resize-none rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/25 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled}
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-75 disabled:opacity-40"
        >
          <Send aria-hidden="true" className="size-4" />
        </button>
      </form>
    </div>
  );
}

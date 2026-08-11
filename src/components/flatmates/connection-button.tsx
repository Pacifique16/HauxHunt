"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Heart, MessageCircle, X } from "lucide-react";

import type { ConnectionState } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  acceptConnection,
  declineConnection,
  requestConnection,
  toggleSavedFlatmate,
} from "@/lib/flatmate-connections";

export type ConnectionButtonProps = {
  flatmateId: string;
  /** Anonymized name, for the "Send a request to ___?" confirmation copy. */
  displayName: string;
  state: ConnectionState;
  saved: boolean;
  /** Discovery-card-only "pass" action — omit to hide the pass control. */
  onPass?: () => void;
  /** Shown for the "accepted" state instead of a static "Connected" badge. */
  chatHref?: string;
  size?: "sm" | "default";
  className?: string;
};

/**
 * The single control for every FlatMat connection state (src/Flatmate.md
 * §8): locked/declined → Pass · Save · Connect, pending sent → Pending,
 * pending received → Accept · Decline, accepted → Message. "Connect" opens
 * a confirmation first, since it's a real notification sent to another
 * person, not a reversible local toggle like Save.
 */
export function ConnectionButton({
  flatmateId,
  displayName,
  state,
  saved,
  onPass,
  chatHref,
  size = "default",
  className,
}: ConnectionButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const buttonSize = size === "sm" ? "sm" : "pill";
  const iconSize = size === "sm" ? "icon-sm" : "icon-lg";

  if (state === "pending_received") {
    return (
      <div className={className ? className : "flex items-center gap-2"}>
        <Button
          type="button"
          variant="outline-solid"
          size={buttonSize}
          onClick={() => declineConnection(flatmateId)}
        >
          <X aria-hidden="true" className="size-4" /> Decline
        </Button>
        <Button
          type="button"
          variant="solid"
          size={buttonSize}
          onClick={() => acceptConnection(flatmateId)}
        >
          <Check aria-hidden="true" className="size-4" /> Accept
        </Button>
      </div>
    );
  }

  if (state === "pending_sent") {
    return (
      <Button type="button" variant="outline-solid" size={buttonSize} disabled className={className}>
        Pending
      </Button>
    );
  }

  if (state === "accepted") {
    return chatHref ? (
      <Button asChild variant="solid" size={buttonSize} className={className}>
        <Link href={chatHref}>
          <MessageCircle aria-hidden="true" className="size-4" /> Message
        </Link>
      </Button>
    ) : (
      <Button type="button" variant="outline-solid" size={buttonSize} disabled className={className}>
        <Check aria-hidden="true" className="size-4" /> Connected
      </Button>
    );
  }

  // "locked" or "declined" — the privacy-safe default state.
  return (
    <div className={className ? className : "flex items-center gap-2"}>
      {onPass ? (
        <Button
          type="button"
          variant="outline-solid"
          size={iconSize}
          aria-label="Pass"
          onClick={onPass}
        >
          <X aria-hidden="true" className="size-4" />
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline-solid"
        size={iconSize}
        aria-label={saved ? "Unsave" : "Save"}
        aria-pressed={saved}
        onClick={() => toggleSavedFlatmate(flatmateId)}
      >
        <Heart aria-hidden="true" className="size-4" fill={saved ? "currentColor" : "none"} />
      </Button>
      <Button type="button" variant="solid" size={buttonSize} onClick={() => setConfirmOpen(true)}>
        Connect
      </Button>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        labelledBy="connect-confirm-title"
      >
        <div className="p-7 sm:p-9">
          <h2
            id="connect-confirm-title"
            className="font-bricolage text-2xl leading-tight font-medium tracking-[-0.03em]"
          >
            Send a connection request to {displayName}?
          </h2>
          <p className="text-carbon-600 mt-3 text-sm leading-6">
            They&apos;ll be notified and can accept or decline. Your name and photo stay
            hidden until you both agree to connect.
          </p>
          <div className="mt-7 flex gap-3">
            <Button
              type="button"
              variant="outline-solid"
              size="pill"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="solid"
              size="pill"
              className="flex-1"
              onClick={() => {
                requestConnection(flatmateId);
                setConfirmOpen(false);
              }}
            >
              Send request
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

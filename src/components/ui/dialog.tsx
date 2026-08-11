"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** id of the element inside `children` that labels the dialog. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

/**
 * Shared modal primitive — consolidates the `role="dialog"` + manual portal +
 * manual Escape-key handling pattern that was previously copy-pasted
 * (near-identically) across listing-card.tsx, save-property-button.tsx, and
 * public-listing-gate.tsx. Those three are left as-is to avoid regressions;
 * new dialogs (including FlatMat's connect/accept-decline sheets) should use
 * this instead of adding a fourth copy.
 */
export function Dialog({ open, onClose, labelledBy, children, className }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // No portal target during SSR — renders nothing server-side (matching
  // `open`'s initial-false content anyway) and portals for real once
  // hydrated in the browser, without needing a mount-detection effect.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/30 p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className={cn(
              "relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)]",
              className,
            )}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 flex size-9 items-center justify-center rounded-full border border-black/15 bg-white/80"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

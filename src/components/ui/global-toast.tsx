"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { TOAST_EVENT, type ToastDetail, type ToastTone } from "@/lib/toast";

type ActiveToast = ToastDetail & { id: number };
const subscribeToHydration = () => () => {};

const ICONS: Record<ToastTone, typeof Check> = {
  success: Check,
  info: Info,
  error: TriangleAlert,
};

export function GlobalToast() {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const portal = mounted
    ? (document.getElementById("toast-portal") ?? document.body)
    : null;

  useEffect(() => {
    function receiveToast(event: Event) {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      if (!detail?.message) return;
      setToast({ ...detail, id: Date.now() });
    }

    window.addEventListener(TOAST_EVENT, receiveToast);
    return () => window.removeEventListener(TOAST_EVENT, receiveToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!portal) return null;

  const tone = toast?.tone ?? "success";
  const Icon = ICONS[tone];

  return createPortal(
    <AnimatePresence mode="wait">
      {toast ? (
        <motion.div
          key={toast.id}
          role={tone === "error" ? "alert" : "status"}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="fixed right-5 bottom-5 z-[300] flex w-[min(390px,calc(100vw-2.5rem))] items-center gap-3 rounded-2xl bg-black px-4 py-3.5 text-white shadow-[0_20px_55px_rgba(0,0,0,0.28)]"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <p className="min-w-0 flex-1 text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    portal,
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import loginIllustration from "@/assets/images/login.png";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function FlatmateAuthAction({
  label,
  returnTo,
  className,
  title = "Sign in to connect",
}: {
  label: string;
  returnTo: string;
  className: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();
  const role = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem("hauxhunt-authenticated-role"),
    () => null,
  );
  const encodedReturnTo = encodeURIComponent(returnTo);

  useEffect(() => {
    setMounted(true);
  }, []);

  function activate() {
    if (role) {
      if (label === "Create Flatmate Profile") {
        router.push(returnTo);
        return;
      }
      setFeedback("Interest recorded for this preview");
      window.setTimeout(() => setFeedback(""), 3000);
      return;
    }
    setOpen(true);
  }

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="flatmate-auth-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/35 p-5"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative flex h-48 items-center justify-center bg-black/[0.045] px-8 pt-3">
              <Image
                src={loginIllustration}
                alt=""
                className="h-full w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full border border-black/15 bg-white/80"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="p-7 sm:p-9">
              <h2
                id="flatmate-auth-title"
                className="font-bricolage text-3xl leading-tight font-medium tracking-[-0.035em]"
              >
                {title}
              </h2>
              <p className="text-carbon-600 mt-3 text-sm leading-6">
                Create an account or sign in to express interest and connect
                with potential flatmates.
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <Link
                  href={`/register?returnTo=${encodedReturnTo}`}
                  className="font-bricolage flex h-12 items-center justify-center rounded-full border border-black/20 px-5 font-medium"
                >
                  Create Account
                </Link>
                <Link
                  href={`/login?returnTo=${encodedReturnTo}`}
                  className="font-bricolage flex h-12 items-center justify-center rounded-full bg-black px-5 font-medium text-white"
                >
                  Log In
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button type="button" onClick={activate} className={className}>
        {label}
      </button>
      {feedback ? <div className="feedback-toast">{feedback}</div> : null}
      {mounted && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}

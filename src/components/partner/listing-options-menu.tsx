"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Archive,
  Eye,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";

import archivingIllustration from "../../../archiving.png";
import deletingIllustration from "../../../deleting.png";

export function ListingOptionsMenu({
  title,
  status,
  onView,
  onDelete,
  onUnarchive,
  onArchive,
}: {
  title: string;
  status: string;
  onView?: () => void;
  onDelete?: () => void;
  onUnarchive?: () => void;
  onArchive?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const listingPath = `/partner-dashboard/listings?listing=${encodeURIComponent(title)}`;
  const archiveAction =
    onArchive ??
    (() =>
      router.push(
        `/partner-dashboard/listings?listing=${encodeURIComponent(title)}&action=archive`,
      ));
  const deleteAction =
    onDelete ??
    (() =>
      router.push(
        `/partner-dashboard/listings?listing=${encodeURIComponent(title)}&action=delete`,
      ));

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <div
      ref={menuRef}
      className={`relative justify-self-end ${open ? "z-[60]" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Options for ${title}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className="text-carbon-500 hover:text-carbon-900 flex size-9 items-center justify-center rounded-full hover:bg-black/5"
      >
        <MoreHorizontal aria-hidden="true" className="size-5" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.4rem)] right-0 z-40 w-48 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
        >
          {status === "Draft" ? (
            <MenuLink
              href="/partner-dashboard/listings/new"
              icon={Pencil}
              label="Continue editing"
            />
          ) : onView ? (
            <MenuButton
              icon={Eye}
              label="View listing"
              onClick={() => {
                setOpen(false);
                onView();
              }}
            />
          ) : (
            <MenuLink
              href={`${listingPath}&mode=view`}
              icon={Eye}
              label="View listing"
            />
          )}
          {status !== "Draft" ? (
            <MenuLink
              href={`/partner-dashboard/listings/edit?listing=${encodeURIComponent(title)}`}
              icon={Pencil}
              label="Edit listing"
            />
          ) : null}
          <div className="my-1 border-t border-black/8" />
          {status === "Archived" && onUnarchive ? (
            <MenuButton
              icon={RotateCcw}
              label="Unarchive listing"
              onClick={() => {
                setOpen(false);
                onUnarchive();
              }}
            />
          ) : (
            <MenuButton
              icon={Archive}
              label="Archive listing"
              onClick={() => {
                setOpen(false);
                setConfirmArchive(true);
              }}
            />
          )}
          <MenuButton
            icon={Trash2}
            label="Delete listing"
            danger
            onClick={() => {
              setOpen(false);
              setConfirmDelete(true);
            }}
          />
        </div>
      ) : null}
      {confirmDelete
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-listing-title"
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-5"
            >
              <div className="grid w-full max-w-xl overflow-hidden bg-white text-left shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
                <div className="relative flex min-h-48 items-center justify-center bg-black/[0.06] p-6">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    aria-label="Close delete dialog"
                    className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-black/20 text-black/55 hover:border-black/40 hover:text-black"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </button>
                  <Image
                    src={deletingIllustration}
                    alt="Empty property records illustration"
                    className="h-40 w-auto object-contain"
                  />
                </div>
                <div className="relative p-6 sm:p-8">
                  <h2
                    id="delete-listing-title"
                    className="font-bricolage text-carbon-900 pr-8 text-2xl font-medium"
                  >
                    Delete this listing permanently?
                  </h2>
                  <p className="text-carbon-600 mt-4 text-sm leading-6">
                    {status === "Archived" ? (
                      <>
                        “{title}” is already archived and hidden from renters.
                        Keep it archived if you may want to restore and resubmit
                        it later. Deleting it now permanently removes its
                        information, performance, enquiries, and history and
                        cannot be undone.
                      </>
                    ) : status === "Draft" ? (
                      <>
                        “{title}” has not been submitted or published yet.
                        Deleting this draft permanently removes all property
                        details, photos, amenities, pricing, and location
                        information you have added. Keep the draft if you may
                        want to finish the listing later. This action cannot be
                        undone.
                      </>
                    ) : status === "In review" ? (
                      <>
                        “{title}” is currently being reviewed and is not visible
                        to renters yet. Deleting it cancels the review and
                        permanently removes its submitted details, photos, and
                        review history. Archive it instead if you want to
                        withdraw it while keeping the listing available for
                        future updates and resubmission. This action cannot be
                        undone.
                      </>
                    ) : (
                      <>
                        Deleting “{title}” permanently removes the listing and
                        its history and cannot be undone. Archiving is safer: it
                        hides the property from renters while preserving its
                        information, performance, and enquiries so you can
                        restore and resubmit it later.
                      </>
                    )}
                  </p>
                  <div className="mt-7 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDelete(false);
                        deleteAction();
                      }}
                      className="font-bricolage h-11 px-2 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Delete permanently
                    </button>
                    {status !== "Archived" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDelete(false);
                          archiveAction();
                        }}
                        className="font-bricolage h-11 rounded-full bg-black px-5 text-sm font-medium text-white hover:bg-black/80"
                      >
                        Archive instead
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
      {confirmArchive
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="archive-listing-title"
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/25 p-5"
            >
              <div className="grid w-full max-w-xl overflow-hidden bg-white text-left shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
                <div className="relative flex min-h-48 items-center justify-center bg-black/[0.06] p-6">
                  <button
                    type="button"
                    onClick={() => setConfirmArchive(false)}
                    aria-label="Close archive dialog"
                    className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-black/20 text-black/55 hover:border-black/40 hover:text-black"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </button>
                  <Image
                    src={archivingIllustration}
                    alt="Archived property illustration"
                    className="h-40 w-auto object-contain"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <h2
                    id="archive-listing-title"
                    className="font-bricolage text-carbon-900 text-2xl font-medium"
                  >
                    Archive this listing?
                  </h2>
                  <p className="text-carbon-600 mt-4 text-sm leading-6">
                    {status === "In review" ? (
                      <>
                        “{title}” is not visible to renters yet. Archiving it
                        will withdraw the listing from the current review while
                        preserving its details, photos, and review history. You
                        can update it, unarchive it, and submit it for review
                        again later.
                      </>
                    ) : status === "Draft" ? (
                      <>
                        “{title}” is an unfinished draft and is not visible to
                        renters. Archiving it will remove it from your active
                        drafts while preserving every detail, photo, amenity,
                        and price you have added. You can unarchive it and
                        continue editing whenever you are ready.
                      </>
                    ) : status === "Live" ? (
                      <>
                        “{title}” is currently visible to renters. Archiving it
                        will remove it from public search and stop new renter
                        activity while preserving its information, performance,
                        enquiries, and history. You can restore and resubmit it
                        later.
                      </>
                    ) : (
                      <>
                        “{title}” will be hidden from renters, but its
                        information, performance, enquiries, and history will be
                        preserved. You can unarchive it later and submit it for
                        review again.
                      </>
                    )}
                  </p>
                  <div className="mt-7 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmArchive(false);
                        archiveAction();
                      }}
                      className="font-bricolage h-11 rounded-full bg-black px-6 text-sm font-medium text-white hover:bg-black/80"
                    >
                      Archive listing
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-colors hover:bg-black/[0.045]"
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </Link>
  );
}

function MenuButton({
  icon: Icon,
  label,
  danger = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors hover:bg-black/[0.045] ${danger ? "text-red-600" : ""}`}
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </button>
  );
}

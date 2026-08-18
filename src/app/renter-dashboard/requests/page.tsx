"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  CircleEllipsis,
  Droplets,
  Home,
  Plus,
  Search,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";

type RequestCategory = "Property search" | "Maintenance" | "Utility support";
type RequestStatus =
  "Finding matches" | "Scheduled" | "In progress" | "Resolved";
type RequestItem = {
  id: number;
  category: RequestCategory;
  title: string;
  property: string;
  details: string;
  priority: "Normal" | "Urgent";
  status: RequestStatus;
  update: string;
  submitted: string;
};

const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 1,
    category: "Maintenance",
    title: "Kitchen sink is leaking",
    property: "Modern family home · Kibagabaga",
    details: "Water is collecting under the sink whenever the tap is used.",
    priority: "Urgent",
    status: "Scheduled",
    update: "Plumber visit · Tomorrow, 10:30 AM",
    submitted: "Today, 9:12 AM",
  },
  {
    id: 2,
    category: "Property search",
    title: "Two-bedroom apartment in Kigali",
    property: "Kigali · Kacyiru or Nyarutarama",
    details: "USD 500–800/month · Furnished · Move-in September",
    priority: "Normal",
    status: "Finding matches",
    update: "3 matching homes received",
    submitted: "Yesterday",
  },
  {
    id: 3,
    category: "Utility support",
    title: "Electricity meter not updating",
    property: "Garden-level apartment · Kacyiru",
    details: "The meter balance has not changed after the latest top-up.",
    priority: "Normal",
    status: "In progress",
    update: "Property manager contacted the utility provider",
    submitted: "08 Aug 2026",
  },
  {
    id: 4,
    category: "Maintenance",
    title: "Bedroom window lock replaced",
    property: "Garden-level apartment · Kacyiru",
    details: "The damaged lock was replaced and tested.",
    priority: "Normal",
    status: "Resolved",
    update: "Resolved on 05 Aug 2026",
    submitted: "03 Aug 2026",
  },
];

const CATEGORY_OPTIONS = [
  "All",
  "Property search",
  "Maintenance",
  "Utility support",
] as const;
const STATUS_OPTIONS = [
  "All statuses",
  "Finding matches",
  "Scheduled",
  "In progress",
  "Resolved",
] as const;

export default function RequestsPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [category, setCategory] =
    useState<(typeof CATEGORY_OPTIONS)[number]>("All");
  const [status, setStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>("All statuses");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdMessage, setCreatedMessage] = useState("");

  const visibleRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          (category === "All" || request.category === category) &&
          (status === "All statuses" || request.status === status),
      ),
    [category, requests, status],
  );

  function addRequest(request: RequestItem) {
    setRequests((current) => [request, ...current]);
    setDialogOpen(false);
    setCreatedMessage("Your request has been submitted");
    window.setTimeout(() => setCreatedMessage(""), 3000);
  }

  return (
    <>
      {createdMessage ? <Toast>{createdMessage}</Toast> : null}
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16">
        <section className="border-border-subtle border-b bg-white px-5 py-10 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto flex max-w-[1562px] flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="dashboard-page-title text-carbon-900">
                My requests
              </h1>
              <p className="text-carbon-500 mt-3 text-sm">
                Track property searches, repairs, utilities, and support in one
                place.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="font-bricolage inline-flex h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white"
            >
              <Plus aria-hidden="true" className="size-4" /> Create request
            </button>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-6 lg:px-11 xl:px-[52px]">
          <div className="mx-auto max-w-[1562px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Request category"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={`h-10 rounded-full px-4 text-sm transition-colors ${category === option ? "bg-black text-white" : "border border-black/15 bg-white hover:border-black/40"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <label className="relative block">
                <span className="sr-only">Filter by status</span>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as typeof status)
                  }
                  className="catalogue-filter-control h-11 appearance-none rounded-full border-0 bg-white pr-10 pl-4 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-0 outline-none focus:ring-0"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-black/55"
                />
              </label>
            </div>

            {visibleRequests.length ? (
              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                {visibleRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-3xl bg-white px-6 py-20 text-center">
                <CircleEllipsis
                  aria-hidden="true"
                  className="mx-auto size-8 text-black/30"
                />
                <h2 className="font-bricolage mt-4 text-2xl font-medium">
                  No requests match these filters
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setCategory("All");
                    setStatus("All statuses");
                  }}
                  className="mt-5 text-sm font-medium underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      {dialogOpen ? (
        <CreateRequestDialog
          onClose={() => setDialogOpen(false)}
          onCreate={addRequest}
        />
      ) : null}
    </>
  );
}

function RequestCard({ request }: { request: RequestItem }) {
  const Icon =
    request.category === "Maintenance"
      ? Wrench
      : request.category === "Utility support"
        ? Zap
        : Search;
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.045)] sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-carbon-500 text-xs font-medium tracking-[0.08em] uppercase">
              {request.category}
            </p>
            <h2 className="font-bricolage mt-1 text-xl font-medium">
              {request.title}
            </h2>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${request.priority === "Urgent" ? "bg-red-50 text-red-700" : "bg-black/[0.055]"}`}
        >
          {request.priority}
        </span>
      </div>
      <div className="mt-6 space-y-3 border-t border-black/10 pt-5 text-sm">
        <p className="flex items-start gap-2">
          <Home
            aria-hidden="true"
            className="text-carbon-500 mt-0.5 size-4 shrink-0"
          />
          <span>{request.property}</span>
        </p>
        <p className="text-carbon-600 leading-6">{request.details}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-black/[0.035] p-4">
        <div>
          <StatusBadge status={request.status} />
          <p className="text-carbon-500 mt-2 text-xs">{request.update}</p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-full border border-black/15 bg-white px-4 text-sm font-medium"
        >
          Message
        </button>
      </div>
      <p className="text-carbon-400 mt-4 text-xs">
        Submitted {request.submitted}
      </p>
    </article>
  );
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const resolved = status === "Resolved";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${resolved ? "text-green-700" : "text-black"}`}
    >
      {resolved ? (
        <Check className="size-4" />
      ) : (
        <CalendarDays className="size-4" />
      )}
      {status}
    </span>
  );
}

function CreateRequestDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (request: RequestItem) => void;
}) {
  const [category, setCategory] = useState<RequestCategory>("Maintenance");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const urgent = data.get("priority") === "Urgent";
    onCreate({
      id: Date.now(),
      category,
      title: String(data.get("title")),
      property: String(data.get("property")),
      details: String(data.get("details")),
      priority: urgent ? "Urgent" : "Normal",
      status:
        category === "Property search" ? "Finding matches" : "In progress",
      update:
        category === "Property search"
          ? "We are finding suitable homes"
          : "Waiting for assignment",
      submitted: "just now",
    });
  }
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-request-title"
      className="fixed inset-0 z-[160] flex items-center justify-center bg-black/35 p-5"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_28px_90px_rgba(0,0,0,0.24)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="create-request-title"
              className="font-bricolage text-3xl font-medium"
            >
              Create a request
            </h2>
            <p className="text-carbon-500 mt-2 text-sm">
              Tell us what you need and we’ll route it appropriately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full border border-black/15"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2">
          {(
            [
              "Property search",
              "Maintenance",
              "Utility support",
            ] as RequestCategory[]
          ).map((option) => {
            const Icon =
              option === "Property search"
                ? Search
                : option === "Maintenance"
                  ? Wrench
                  : Droplets;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-2 text-center text-xs font-medium sm:text-sm ${category === option ? "border-black bg-black text-white" : "border-black/15"}`}
              >
                <Icon className="size-5" />
                {option}
              </button>
            );
          })}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            label={
              category === "Property search"
                ? "Request title"
                : "What needs attention?"
            }
            name="title"
            placeholder={
              category === "Property search"
                ? "Two-bedroom home in Kigali"
                : "Kitchen sink is leaking"
            }
          />
          <Field
            label={
              category === "Property search"
                ? "Preferred area"
                : "Related property"
            }
            name="property"
            placeholder={
              category === "Property search"
                ? "Kacyiru or Nyarutarama"
                : "Modern family home"
            }
          />
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium">Details</span>
            <textarea
              name="details"
              required
              rows={4}
              placeholder={
                category === "Property search"
                  ? "Budget, bedrooms, move-in date, and preferences…"
                  : "Describe the issue and when it started…"
              }
              className="w-full resize-none rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium">Priority</span>
            <span className="relative block">
              <select
                name="priority"
                className="h-12 w-full appearance-none rounded-xl border border-black/20 bg-white px-4 text-sm font-normal"
              >
                <option>Normal</option>
                <option>Urgent</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
            </span>
          </label>
          <label>
            <span className="mb-2 block text-sm font-medium">
              Preferred date
            </span>
            <input
              type="date"
              name="date"
              className="h-12 w-full rounded-xl border border-black/20 px-4 text-sm"
            />
          </label>
        </div>
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>
            For immediate danger, fire, gas leaks, or serious flooding, contact
            local emergency services first.
          </p>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-black/15 px-5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-full bg-black px-6 text-sm font-medium text-white"
          >
            Submit request
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        name={name}
        required
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-black/20 px-4 text-sm outline-none focus:border-black"
      />
    </label>
  );
}
function Toast({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="feedback-toast">
      {children}
    </div>
  );
}

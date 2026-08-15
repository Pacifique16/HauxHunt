"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, FileUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import applicationReceivedIllustration from "../../../../../application-received.png";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
import { DEMO_LISTINGS } from "@/data/hero-search-demo";
import { RENTER_APPLICATIONS } from "@/data/renter-applications";

const steps = [
  "About you",
  "Rental needs",
  "Employment",
  "Household",
  "References",
  "Documents",
  "Review",
];

const fields: Record<number, Array<[string, string, string]>> = {
  0: [
    ["Full name", "fullName", "Julien Mugisha"],
    ["Email", "email", "renter@gmail.com"],
    ["Phone number", "phone", "+250 788 000 000"],
  ],
  1: [
    ["Preferred move-in date", "moveIn", "2026-09-01"],
    ["Lease length", "lease", "12 months"],
    ["Reason for moving", "reason", "Closer to work"],
  ],
  2: [
    ["Employment status", "employment", "Employed"],
    ["Employer", "employer", "e.g. Kigali Innovation City"],
    ["Role", "role", "e.g. Accountant"],
    ["Monthly income", "income", "RWF 1,500,000"],
  ],
  3: [
    ["Number of occupants", "occupants", "2"],
    ["Pets", "pets", "No pets"],
    ["Co-applicant", "coApplicant", "None"],
  ],
  4: [
    ["Reference name", "reference", "Claire Uwase"],
    ["Relationship", "relationship", "e.g. Former landlord or supervisor"],
    ["Reference phone", "referencePhone", "+250 788 111 111"],
  ],
};

export default function NewApplicationPage() {
  const params = useSearchParams();
  const router = useRouter();
  const propertyId = params.get("property") ?? "kacyiru-2br";
  const draftId = params.get("draft");
  const property =
    DEMO_LISTINGS.find((item) => item.id === propertyId) ?? DEMO_LISTINGS[0];
  const existing = RENTER_APPLICATIONS.find(
    (item) =>
      item.propertyId === propertyId &&
      item.status !== "Draft" &&
      item.status !== "Withdrawn",
  );
  const [step, setStep] = useState(draftId ? 3 : 0);
  const [values, setValues] = useState<Record<string, string>>({
    fullName: "Julien Mugisha",
    email: "renter@gmail.com",
    phone: "+250 788 000 000",
    employment: "Employed",
  });
  const [documents, setDocuments] = useState<string[]>(
    draftId ? ["Identity document"] : [],
  );
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [documentTypes, setDocumentTypes] = useState<Record<string, string>>(
    {},
  );
  const [consented, setConsented] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const applicationId = "HH-APP-0261";

  useEffect(() => {
    const rawDraft = localStorage.getItem(
      `hauxhunt-application-${property.id}`,
    );
    if (!rawDraft) return;
    try {
      const draft = JSON.parse(rawDraft) as {
        step?: number;
        values?: Record<string, string>;
        documents?: string[];
      };
      const restoreDraft = window.setTimeout(() => {
        if (draft.values) {
          setValues((current) => ({ ...current, ...draft.values }));
        }
        if (draft.documents) setDocuments(draft.documents);
        if (typeof draft.step === "number") {
          setStep(Math.min(Math.max(draft.step, 0), steps.length - 1));
        }
      }, 0);
      return () => window.clearTimeout(restoreDraft);
    } catch {
      localStorage.removeItem(`hauxhunt-application-${property.id}`);
    }
  }, [property.id]);

  function saveDraft() {
    localStorage.setItem(
      `hauxhunt-application-${property.id}`,
      JSON.stringify({
        step,
        values,
        documents,
        propertyId: property.id,
        title: property.title,
        location: property.location,
        savedAt: new Date().toISOString(),
      }),
    );
    setSaved(true);
    window.setTimeout(
      () => router.push("/renter-dashboard/applications?tab=drafts"),
      900,
    );
  }

  function continueForm() {
    if (!formRef.current?.reportValidity()) return;
    setStep((current) => current + 1);
  }

  function submitApplication() {
    sessionStorage.setItem(
      `hauxhunt-submission-${applicationId}`,
      JSON.stringify({
        propertyId: property.id,
        title: property.title,
        location: property.location,
        values,
        documents: documents.map((name) => ({
          name,
          url: documentUrls[name],
          type: documentTypes[name],
        })),
      }),
    );
    localStorage.removeItem(`hauxhunt-application-${property.id}`);
    setSubmitted(true);
  }

  if (existing && !draftId) {
    return (
      <>
        <RenterCatalogueTopBar />
        <main className="bg-carbon-50 flex min-h-svh items-center justify-center px-5 pt-16">
          <section className="w-full max-w-xl bg-white p-8 text-center shadow-[0_3px_14px_rgba(0,0,0,0.04)]">
            <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-black text-white">
              <Check className="size-5" />
            </span>
            <h1 className="font-bricolage mt-5 text-3xl font-medium">
              You already applied
            </h1>
            <p className="text-carbon-500 mt-3 text-sm leading-6">
              An active application for {existing.title} already exists. Open it
              to check its progress instead of submitting a duplicate.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link
                href="/renter-dashboard/applications"
                className="h-10 rounded-full border border-black/15 px-5 py-2.5 text-sm"
              >
                All Applications
              </Link>
              <Link
                href={`/renter-dashboard/applications/${existing.id}`}
                className="h-10 rounded-full bg-black px-5 py-2.5 text-sm text-white"
              >
                View Application
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <RenterCatalogueTopBar />
        <main className="bg-carbon-50 flex min-h-svh items-center justify-center px-5 pt-16">
          <section className="w-full max-w-2xl bg-white p-8 text-center shadow-[0_3px_14px_rgba(0,0,0,0.04)]">
            <Image
              src={applicationReceivedIllustration}
              alt="Application received illustration"
              className="mx-auto h-40 w-auto object-contain"
              priority
            />
            <h1 className="font-bricolage mt-5 text-3xl font-medium">
              Application submitted
            </h1>
            <p className="text-carbon-500 mt-2">
              Your application for {property.title} has been sent.
            </p>
            <div className="mx-auto mt-7 grid max-w-md grid-cols-2 divide-x divide-black/10 border-y border-black/10 py-4 text-left text-sm">
              <div className="pr-5">
                <p className="text-carbon-500 text-xs">Application ID</p>
                <p className="mt-1 font-medium">{applicationId}</p>
              </div>
              <div className="pl-5">
                <p className="text-carbon-500 text-xs">Status</p>
                <p className="mt-1 font-medium">Submitted</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/renter-dashboard/applications"
                className="h-10 rounded-full border border-black/15 px-5 py-2.5 text-sm"
              >
                Applications
              </Link>
              <Link
                href={`/renter-dashboard/messages?property=${encodeURIComponent(property.title)}`}
                className="h-10 rounded-full border border-black/15 px-5 py-2.5 text-sm"
              >
                Message
              </Link>
              <Link
                href={`/renter-dashboard/applications/${applicationId}?property=${encodeURIComponent(property.id)}&title=${encodeURIComponent(property.title)}&location=${encodeURIComponent(property.location)}`}
                className="h-10 rounded-full bg-black px-5 py-2.5 text-sm text-white"
              >
                View Application
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <div className="mx-auto max-w-[1120px] px-5 py-8 sm:px-6 lg:py-10">
          <Link
            href="/renter-dashboard/applications"
            className="inline-flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="size-4" />
            Applications
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[250px_1fr]">
            <aside className="h-fit bg-white p-5">
              <p className="text-carbon-500 text-xs tracking-[0.12em] uppercase">
                Applying for
              </p>
              <h1 className="font-bricolage mt-2 text-xl font-medium">
                {property.title}
              </h1>
              <p className="text-carbon-500 mt-1 text-sm">
                {property.location}
              </p>
              <div className="mt-6 space-y-1">
                {steps.map((label, index) => (
                  <button
                    key={label}
                    onClick={() => index <= step && setStep(index)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${index === step ? "bg-black text-white" : "text-carbon-500"}`}
                  >
                    <span
                      className={`flex size-5 items-center justify-center rounded-full text-[11px] ${index < step ? "bg-black text-white" : "border border-current"}`}
                    >
                      {index < step ? <Check className="size-3" /> : index + 1}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </aside>
            <form
              ref={formRef}
              onSubmit={(event) => event.preventDefault()}
              className="bg-white p-6 shadow-[0_3px_14px_rgba(0,0,0,0.03)] sm:p-8"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-carbon-500 text-sm">
                    Step {step + 1} of {steps.length}
                  </p>
                  <h2 className="font-bricolage mt-1 text-3xl font-medium">
                    {steps[step]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="h-10 shrink-0 rounded-full border border-black/15 px-4 text-sm"
                >
                  Save draft
                </button>
              </div>
              <div className="mt-5 h-1 bg-black/10">
                <div
                  className="h-full bg-black transition-all"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="mt-8 min-h-[310px]">
                {step <= 4 ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields[step].map(([label, name, placeholder]) => (
                      <label key={name} className="block">
                        <span className="mb-2 block text-sm font-medium">
                          {label} <span className="text-red-600">*</span>
                        </span>
                        {name === "employment" ? (
                          <select
                            required
                            value={values[name] ?? ""}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [name]: event.target.value,
                              }))
                            }
                            className="application-form-input h-11 w-full border-0 border-b border-black/20 bg-transparent px-1 text-sm outline-none focus:border-black focus:ring-0"
                          >
                            <option value="">Select employment status</option>
                            <option>Employed</option>
                            <option>Self-employed</option>
                            <option>Student</option>
                            <option>Retired</option>
                            <option>Other</option>
                          </select>
                        ) : (
                          <input
                            required
                            type={
                              name === "moveIn"
                                ? "date"
                                : name === "email"
                                  ? "email"
                                  : name === "occupants"
                                    ? "number"
                                    : "text"
                            }
                            min={
                              name === "moveIn"
                                ? "2026-08-15"
                                : name === "occupants"
                                  ? "1"
                                  : undefined
                            }
                            value={values[name] ?? ""}
                            onChange={(event) =>
                              setValues((current) => ({
                                ...current,
                                [name]: event.target.value,
                              }))
                            }
                            placeholder={
                              name === "moveIn" ? undefined : placeholder
                            }
                            className="application-form-input h-11 w-full border-0 border-b border-black/20 bg-transparent px-1 text-sm outline-none focus:border-black focus:ring-0"
                          />
                        )}
                        {name === "occupants" ? (
                          <span className="text-carbon-500 mt-2 block text-xs leading-5">
                            Include everyone who will live in the home,
                            including you.
                          </span>
                        ) : null}
                        {name === "coApplicant" ? (
                          <span className="text-carbon-500 mt-2 block text-xs leading-5">
                            A co-applicant shares responsibility for the lease
                            and provides their own details.
                          </span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                ) : null}
                {step === 5 ? (
                  <Documents
                    documents={documents}
                    onAdd={(name, file) => {
                      setDocuments((current) =>
                        current.includes(name) ? current : [...current, name],
                      );
                      setDocumentUrls((current) => ({
                        ...current,
                        [name]: URL.createObjectURL(file),
                      }));
                      setDocumentTypes((current) => ({
                        ...current,
                        [name]: file.type,
                      }));
                    }}
                  />
                ) : null}
                {step === 6 ? (
                  <Review
                    property={property}
                    values={values}
                    documents={documents}
                    consented={consented}
                    onConsent={setConsented}
                  />
                ) : null}
              </div>
              <div
                className={`flex items-center justify-between pt-5 ${step === 6 ? "" : "border-t border-black/10"}`}
              >
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0}
                  className="inline-flex h-10 items-center gap-1 rounded-full px-4 text-sm disabled:opacity-30"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" /> Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={continueForm}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-5 text-sm text-white"
                  >
                    Continue <ChevronRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!consented}
                    onClick={submitApplication}
                    className="h-10 rounded-full bg-black px-5 text-sm text-white disabled:opacity-35"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {saved ? (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black px-5 py-3 text-sm text-white shadow-xl">
            Application saved to drafts
          </div>
        ) : null}
      </main>
    </>
  );
}

function Documents({
  documents,
  onAdd,
}: {
  documents: string[];
  onAdd: (name: string, file: File) => void;
}) {
  return (
    <div>
      <p className="text-carbon-500 mb-5 text-sm">
        Identity document and proof of income are required. PDF, JPG or PNG.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          "Identity document",
          "Proof of income",
          "Employment letter",
          "Reference document",
        ].map((name) => (
          <label
            key={name}
            className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center transition-colors ${documents.includes(name) ? "border-black bg-black/[0.035]" : "border-black/25 hover:border-black"}`}
          >
            <input
              type="file"
              required={
                (name === "Identity document" || name === "Proof of income") &&
                !documents.includes(name)
              }
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onAdd(name, file);
              }}
            />
            <span
              className={`flex size-10 items-center justify-center rounded-full ${documents.includes(name) ? "bg-black text-white" : "bg-black/[0.06]"}`}
            >
              {documents.includes(name) ? (
                <Check className="size-4" />
              ) : (
                <FileUp className="size-4" />
              )}
            </span>
            <p className="mt-3 text-sm font-medium">{name}</p>
            <p className="text-carbon-500 mt-1 text-xs">
              {documents.includes(name)
                ? "Added · Click to replace"
                : "Choose file"}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
}

function Review({
  property,
  values,
  documents,
  consented,
  onConsent,
}: {
  property: (typeof DEMO_LISTINGS)[number];
  values: Record<string, string>;
  documents: string[];
  consented: boolean;
  onConsent: (checked: boolean) => void;
}) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <ReviewBlock
          title="Property"
          rows={[property.title, property.location]}
        />
        <ReviewBlock
          title="Rental details"
          rows={[
            `Move-in: ${formatDate(values.moveIn)}`,
            `Lease: ${values.lease}`,
            `Occupants: ${values.occupants}`,
          ]}
        />
        <ReviewBlock
          title="Applicant"
          rows={[values.fullName, values.email, values.employment]}
        />
        <ReviewBlock
          title="Documents"
          rows={[
            `${documents.length} document${documents.length === 1 ? "" : "s"} attached`,
          ]}
          showBorder={false}
        />
      </div>
      <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          checked={consented}
          onChange={(event) => onConsent(event.target.checked)}
          className="mt-1 size-4 accent-black"
        />
        <span>
          I confirm that the information provided is accurate and I consent to
          it being shared with the property representative.
        </span>
      </label>
    </div>
  );
}

function ReviewBlock({
  title,
  rows,
  showBorder = true,
}: {
  title: string;
  rows: string[];
  showBorder?: boolean;
}) {
  return (
    <div className={showBorder ? "border-b border-black/10 pb-5" : "pb-5"}>
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="text-carbon-500 mt-2 space-y-1 text-sm leading-6">
        {rows.map((row) => (
          <p key={row}>{row || "Not provided"}</p>
        ))}
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

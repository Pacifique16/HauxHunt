"use client";

import { useState } from "react";
import { BadgeCheck, Check, ChevronLeft, X } from "lucide-react";

import {
  AVAILABLE_PROPERTY_MANAGERS,
  PM_RESPONSIBILITIES,
  assignPropertyManager,
  getOwnerProperties,
} from "@/lib/owner-data";

// Communicates the intended delegation flow -- select a Property Manager,
// choose which property (skipped when launched from that property's own
// detail page), decide what they can do, then confirm. Assignment is local
// session state (lib/owner-data.ts); there is no real permission backend
// behind this.

type Step = "manager" | "property" | "responsibilities" | "confirm";

export function AssignPropertyManagerDialog({
  open,
  onClose,
  propertyId,
  onAssigned,
}: {
  open: boolean;
  onClose: () => void;
  propertyId?: string;
  onAssigned?: (propertyId: string) => void;
}) {
  const [managerName, setManagerName] = useState<string | null>(null);
  const [targetPropertyId, setTargetPropertyId] = useState<string | null>(propertyId ?? null);
  const [responsibilities, setResponsibilities] = useState<string[]>([...PM_RESPONSIBILITIES]);
  const [step, setStep] = useState<Step>("manager");

  if (!open) return null;

  const manager = AVAILABLE_PROPERTY_MANAGERS.find((m) => m.name === managerName) ?? null;
  const properties = getOwnerProperties();
  const targetProperty = properties.find((p) => p.id === targetPropertyId) ?? null;
  const needsPropertyStep = !propertyId;

  function goNext() {
    if (step === "manager") setStep(needsPropertyStep ? "property" : "responsibilities");
    else if (step === "property") setStep("responsibilities");
    else if (step === "responsibilities") setStep("confirm");
  }

  function goBack() {
    if (step === "confirm") setStep("responsibilities");
    else if (step === "responsibilities") setStep(needsPropertyStep ? "property" : "manager");
    else if (step === "property") setStep("manager");
  }

  function reset() {
    setManagerName(null);
    setTargetPropertyId(propertyId ?? null);
    setResponsibilities([...PM_RESPONSIBILITIES]);
    setStep("manager");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function confirm() {
    if (!manager || !targetPropertyId) return;
    assignPropertyManager(targetPropertyId, {
      name: manager.name,
      verified: manager.verified,
      responsibilities,
    });
    onAssigned?.(targetPropertyId);
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 p-4" onMouseDown={handleClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-pm-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden bg-white text-black shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div className="flex items-center gap-2">
            {step !== "manager" ? (
              <button type="button" onClick={goBack} aria-label="Back" className="flex size-8 items-center justify-center rounded-full hover:bg-black/5">
                <ChevronLeft className="size-4" />
              </button>
            ) : null}
            <h2 id="assign-pm-title" className="font-bricolage text-lg font-medium">
              Assign Property Manager
            </h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-full hover:bg-black/5">
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {step === "manager" ? (
            <fieldset>
              <legend className="text-carbon-500 text-xs font-medium tracking-widest uppercase">Step 1 of {needsPropertyStep ? 3 : 2} · Select a Property Manager</legend>
              <div className="mt-4 space-y-2">
                {AVAILABLE_PROPERTY_MANAGERS.map((m) => (
                  <label
                    key={m.name}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${managerName === m.name ? "border-black bg-black text-white" : "border-black/12 hover:border-black/30"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex size-10 items-center justify-center rounded-full text-sm font-medium ${managerName === m.name ? "bg-white text-black" : "bg-black text-white"}`}>
                        {m.name.slice(0, 1)}
                      </span>
                      <span>
                        <span className="flex items-center gap-1.5 font-medium">
                          {m.name}
                          {m.verified ? <BadgeCheck aria-label="Verified" className="size-4 fill-current text-inherit" /> : null}
                        </span>
                        <span className={`block text-xs ${managerName === m.name ? "text-white/70" : "text-carbon-500"}`}>{m.blurb}</span>
                      </span>
                    </span>
                    <input type="radio" name="manager" className="sr-only" checked={managerName === m.name} onChange={() => setManagerName(m.name)} />
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === "property" ? (
            <fieldset>
              <legend className="text-carbon-500 text-xs font-medium tracking-widest uppercase">Step 2 of 3 · Choose a property</legend>
              <div className="mt-4 space-y-2">
                {properties.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${targetPropertyId === p.id ? "border-black bg-black text-white" : "border-black/12 hover:border-black/30"}`}
                  >
                    <span>
                      <span className="block font-medium">{p.title}</span>
                      <span className={`block text-xs ${targetPropertyId === p.id ? "text-white/70" : "text-carbon-500"}`}>{p.location}</span>
                    </span>
                    <input type="radio" name="property" className="sr-only" checked={targetPropertyId === p.id} onChange={() => setTargetPropertyId(p.id)} />
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          {step === "responsibilities" ? (
            <fieldset>
              <legend className="text-carbon-500 text-xs font-medium tracking-widest uppercase">
                Step {needsPropertyStep ? 3 : 2} of {needsPropertyStep ? 3 : 2} · Responsibilities
              </legend>
              <p className="text-carbon-500 mt-2 text-sm">What can {manager?.name ?? "this Property Manager"} do for {targetProperty?.title ?? "this property"}?</p>
              <div className="mt-4 space-y-2">
                {PM_RESPONSIBILITIES.map((item) => {
                  const checked = responsibilities.includes(item);
                  return (
                    <label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 p-3.5 hover:bg-black/2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setResponsibilities((current) =>
                            checked ? current.filter((r) => r !== item) : [...current, item],
                          )
                        }
                        className="size-4 accent-black"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          {step === "confirm" ? (
            <div>
              <p className="text-carbon-500 text-xs font-medium tracking-widest uppercase">Review</p>
              <p className="font-bricolage mt-3 text-xl font-medium">
                Assign {manager?.name} to {targetProperty?.title}
              </p>
              <p className="text-carbon-500 mt-1 text-sm">{targetProperty?.location}</p>
              <div className="mt-5 rounded-2xl border border-black/10 p-4">
                <p className="text-xs font-medium tracking-wider text-black/40 uppercase">Responsibilities</p>
                <ul className="mt-3 space-y-2">
                  {responsibilities.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0" />
                      {item}
                    </li>
                  ))}
                  {responsibilities.length === 0 ? <li className="text-carbon-500 text-sm">No responsibilities selected.</li> : null}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-black/10 px-6 py-4">
          {step !== "confirm" ? (
            <button
              type="button"
              onClick={goNext}
              disabled={(step === "manager" && !managerName) || (step === "property" && !targetPropertyId)}
              className="font-bricolage inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={confirm}
              className="font-bricolage inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white"
            >
              Confirm Assignment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

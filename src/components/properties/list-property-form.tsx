"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ImagePlus,
  KeyRound,
  UserRound,
} from "lucide-react";

const STEPS = [
  { label: "About you", icon: UserRound },
  { label: "Property", icon: Building2 },
  { label: "Pricing", icon: KeyRound },
  { label: "Photos", icon: ImagePlus },
  { label: "Review", icon: Check },
] as const;

export function ListPropertyForm() {
  const [step, setStep] = useState(0);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function nextStep() {
    const panel = formRef.current?.querySelector<HTMLElement>(
      `[data-step="${step}"]`,
    );
    const fields = Array.from(
      panel?.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea") ?? [],
    );
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      invalid.focus();
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white px-6 py-20 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:px-12">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-black text-white">
          <Check aria-hidden="true" className="size-7" />
        </span>
        <h2 className="font-bricolage text-carbon-900 mt-7 text-4xl font-medium tracking-[-0.04em]">
          Your property draft is ready
        </h2>
        <p className="text-carbon-600 mx-auto mt-4 max-w-xl leading-7">
          The listing information has been captured for review. Once account
          verification and publishing are connected, this is where the property
          will be submitted to the HauxHunt team.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setStep(0);
            setPhotoNames([]);
            requestAnimationFrame(() => formRef.current?.reset());
          }}
          className="font-bricolage mt-8 h-12 rounded-full bg-black px-7 font-medium text-white transition-colors hover:bg-black/80"
        >
          List another property
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <ol aria-label="Listing progress" className="mb-6 grid grid-cols-5 gap-2">
        {STEPS.map(({ label, icon: Icon }, index) => {
          const complete = index < step;
          const active = index === step;
          return (
            <li key={label} aria-current={active ? "step" : undefined}>
              <button
                type="button"
                onClick={() => index <= step && setStep(index)}
                disabled={index > step}
                className="group flex w-full flex-col items-center gap-2 text-center disabled:cursor-default"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
                    active || complete
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-black/40"
                  }`}
                >
                  {complete ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    <Icon aria-hidden="true" className="size-4" />
                  )}
                </span>
                <span
                  className={`hidden text-xs sm:block ${active ? "font-medium text-black" : "text-black/45"}`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-10 lg:p-12">
        <StepPanel step={0} currentStep={step} title="Tell us who is listing">
          <p className="text-carbon-600 -mt-4 mb-8 max-w-xl">
            We verify every representative before a property goes live.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="fullName" required />
            <SelectField
              label="I am a"
              name="representativeType"
              options={["Landlord", "Broker", "Real estate agency"]}
              required
            />
            <Field label="Email address" name="email" type="email" required />
            <Field label="Phone number" name="phone" type="tel" required />
            <Field
              label="Agency name"
              name="agencyName"
              hint="Optional for landlords and independent brokers"
              className="sm:col-span-2"
            />
          </div>
        </StepPanel>

        <StepPanel step={1} currentStep={step} title="Describe the property">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Listing title"
              name="title"
              placeholder="Modern 3-bedroom family home"
              className="sm:col-span-2"
              required
            />
            <SelectField
              label="Property type"
              name="propertyType"
              options={[
                "House",
                "Apartment",
                "Duplex",
                "Studio apartment",
                "Penthouse",
                "Villa",
                "Mansion",
                "Shared apartment",
              ]}
              required
            />
            <SelectField
              label="Country"
              name="country"
              options={["Rwanda", "Nigeria"]}
              required
            />
            <Field label="City" name="city" required />
            <Field label="Neighbourhood" name="neighbourhood" required />
            <Field
              label="Bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              required
            />
            <Field
              label="Bathrooms"
              name="bathrooms"
              type="number"
              min="1"
              required
            />
            <Field label="Floor area (m²)" name="area" type="number" min="1" />
            <SelectField
              label="Furnishing"
              name="furnishing"
              options={["Furnished", "Unfurnished", "Partly furnished"]}
              required
            />
            <label className="sm:col-span-2">
              <span className="text-carbon-900 mb-2 block text-sm font-medium">
                Property description
              </span>
              <textarea
                name="description"
                rows={5}
                required
                placeholder="Describe the rooms, condition, surroundings, and what makes the property a good home."
                className="w-full resize-y rounded-xl border border-black/20 bg-white px-4 py-3 transition-colors outline-none focus:border-black"
              />
            </label>
          </div>
        </StepPanel>

        <StepPanel
          step={2}
          currentStep={step}
          title="Set pricing and availability"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Listing purpose"
              name="purpose"
              options={["For rent", "For sale"]}
              required
            />
            <SelectField
              label="Currency"
              name="currency"
              options={["USD"]}
              required
            />
            <Field label="Price" name="price" type="number" min="1" required />
            <SelectField
              label="Payment period"
              name="paymentPeriod"
              options={["Per month", "Per year", "Total sale price"]}
              required
            />
            <Field
              label="Available from"
              name="availableFrom"
              type="date"
              required
            />
            <Field
              label="Minimum stay (months)"
              name="minimumStay"
              type="number"
              min="1"
              hint="For rental properties"
            />
          </div>
        </StepPanel>

        <StepPanel step={3} currentStep={step} title="Add property photos">
          <p className="text-carbon-600 -mt-4 mb-7 max-w-xl">
            Add clear, recent photos of the exterior, living areas, bedrooms,
            bathrooms, and kitchen. You can select multiple images.
          </p>
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/30 bg-black/[0.025] px-6 text-center transition-colors hover:border-black hover:bg-black/[0.045]">
            <ImagePlus aria-hidden="true" className="size-8" />
            <span className="font-bricolage mt-4 text-lg font-medium">
              Choose property photos
            </span>
            <span className="text-carbon-500 mt-1 text-sm">
              JPG, PNG or WebP · up to 10 images
            </span>
            <input
              type="file"
              name="photos"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              className="sr-only"
              onChange={(event) =>
                setPhotoNames(
                  Array.from(event.target.files ?? [])
                    .slice(0, 10)
                    .map((file) => file.name),
                )
              }
            />
          </label>
          {photoNames.length > 0 && (
            <div className="mt-5 rounded-xl border border-black/10 bg-black/[0.025] p-4">
              <p className="text-sm font-medium">
                {photoNames.length} photo{photoNames.length === 1 ? "" : "s"}{" "}
                selected
              </p>
              <ul className="text-carbon-600 mt-2 grid gap-1 text-sm sm:grid-cols-2">
                {photoNames.map((name) => (
                  <li key={name} className="truncate">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </StepPanel>

        <StepPanel step={4} currentStep={step} title="Review and submit">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Identity", "Your representative details will be reviewed."],
              ["Property", "Property information and pricing will be checked."],
              ["Photos", `${photoNames.length} photos are ready for review.`],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-black/10 p-5"
              >
                <Check aria-hidden="true" className="size-5" />
                <h3 className="font-bricolage mt-5 text-lg font-medium">
                  {title}
                </h3>
                <p className="text-carbon-600 mt-2 text-sm leading-6">{body}</p>
              </div>
            ))}
          </div>
          <label className="mt-7 flex items-start gap-3 rounded-xl bg-black/[0.035] p-4 text-sm leading-6">
            <input
              type="checkbox"
              name="confirmation"
              required
              className="mt-1 size-4 accent-black"
            />
            <span>
              I confirm that the property information is accurate and that I am
              authorized to list this property on HauxHunt.
            </span>
          </label>
        </StepPanel>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-black/10 pt-6">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="font-bricolage inline-flex h-12 items-center gap-2 rounded-full border border-black/20 px-6 font-medium transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-0"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="font-bricolage inline-flex h-12 items-center gap-2 rounded-full bg-black px-7 font-medium text-white transition-colors hover:bg-black/80"
            >
              Continue
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="font-bricolage inline-flex h-12 items-center gap-2 rounded-full bg-black px-7 font-medium text-white transition-colors hover:bg-black/80"
            >
              Submit property
              <ArrowRight aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

type StepPanelProps = {
  step: number;
  currentStep: number;
  title: string;
  children: React.ReactNode;
};

function StepPanel({ step, currentStep, title, children }: StepPanelProps) {
  return (
    <section data-step={step} hidden={step !== currentStep}>
      <p className="text-carbon-500 mb-3 text-sm">Step {step + 1} of 5</p>
      <h2 className="font-bricolage text-carbon-900 mb-7 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  className?: string;
  required?: boolean;
  min?: string;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  hint,
  className,
  required,
  min,
}: FieldProps) {
  return (
    <label className={className}>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        min={min}
        className="h-12 w-full rounded-xl border border-black/20 bg-white px-4 transition-colors outline-none focus:border-black"
      />
      {hint && (
        <span className="text-carbon-500 mt-1.5 block text-xs">{hint}</span>
      )}
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
};

function SelectField({ label, name, options, required }: SelectFieldProps) {
  return (
    <label>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="h-12 w-full rounded-xl border border-black/20 bg-white px-4 transition-colors outline-none focus:border-black"
      >
        <option value="" disabled>
          Choose {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

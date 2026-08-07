"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  UserRound,
} from "lucide-react";

type AuthenticationFormProps = {
  mode: "login" | "register";
};

const ACCOUNT_TYPES = [
  {
    value: "renter",
    label: "Renter",
    description: "Search, save, and request houses.",
    icon: Home,
  },
  {
    value: "landlord",
    label: "Landlord",
    description: "List and manage your own properties.",
    icon: KeyRound,
  },
  {
    value: "broker",
    label: "Broker",
    description: "Represent clients and publish listings.",
    icon: UserRound,
  },
  {
    value: "agency",
    label: "Agency",
    description: "Manage a team and property portfolio.",
    icon: Building2,
  },
] as const;

export function AuthenticationForm({ mode }: AuthenticationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("renter");
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (isRegister) {
      const data = new FormData(form);
      if (data.get("password") !== data.get("confirmPassword")) {
        setError("The passwords do not match.");
        return;
      }
    }

    setComplete(true);
  }

  if (complete) {
    return (
      <div className="py-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-black text-white">
          <Check aria-hidden="true" className="size-7" />
        </span>
        <h2 className="font-bricolage text-carbon-900 mt-7 text-4xl font-medium tracking-[-0.04em]">
          {isRegister ? "Your account is ready" : "Login details received"}
        </h2>
        <p className="text-carbon-600 mx-auto mt-4 max-w-md leading-7">
          {isRegister
            ? "Your account information has been captured. Account creation will complete once authentication services are connected."
            : "This login interface is ready to connect to the HauxHunt authentication service."}
        </p>
        <button
          type="button"
          onClick={() => setComplete(false)}
          className="font-bricolage mt-8 h-12 rounded-full bg-black px-7 font-medium text-white transition-colors hover:bg-black/80"
        >
          Back to {isRegister ? "registration" : "login"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isRegister && (
        <fieldset>
          <legend className="font-bricolage text-carbon-900 text-xl font-medium">
            Choose your account type
          </legend>
          <p className="text-carbon-500 mt-1 text-sm">
            This helps us prepare the right tools for your account.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {ACCOUNT_TYPES.map(({ value, label, description, icon: Icon }) => (
              <label
                key={value}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors ${
                  accountType === value
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-white hover:border-black/40"
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={value}
                  checked={accountType === value}
                  onChange={() => setAccountType(value)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="font-bricolage block font-medium">
                      {label}
                    </span>
                    <span
                      className={`mt-1 block text-xs leading-5 ${accountType === value ? "text-white/65" : "text-carbon-500"}`}
                    >
                      {description}
                    </span>
                  </span>
                  <Icon aria-hidden="true" className="size-5 shrink-0" />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className={`grid gap-5 ${isRegister ? "mt-8 sm:grid-cols-2" : ""}`}>
        {isRegister && (
          <>
            <Field label="Full name" name="fullName" required />
            {(accountType === "agency" || accountType === "broker") && (
              <Field
                label={
                  accountType === "agency" ? "Agency name" : "Business name"
                }
                name="businessName"
                required={accountType === "agency"}
              />
            )}
          </>
        )}

        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          className={isRegister ? "sm:col-span-2" : undefined}
          required
        />

        {isRegister && (
          <>
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
            />
            <SelectField
              label="Country"
              name="country"
              options={["Rwanda", "Nigeria"]}
              required
            />
          </>
        )}

        <PasswordField
          label="Password"
          name="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          required
        />

        {isRegister && (
          <PasswordField
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            visible={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
            required
          />
        )}
      </div>

      {!isRegister && (
        <div className="mt-4 flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              className="size-4 accent-black"
            />
            Remember me
          </label>
          <button
            type="button"
            className="font-medium underline underline-offset-4"
          >
            Forgot password?
          </button>
        </div>
      )}

      {isRegister && (
        <label className="mt-6 flex items-start gap-3 rounded-xl bg-black/[0.035] p-4 text-sm leading-6">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-1 size-4 accent-black"
          />
          <span>
            I agree to the HauxHunt terms and confirm that the information I
            provide is accurate.
          </span>
        </label>
      )}

      {error && (
        <p role="alert" className="mt-5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="font-bricolage mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-7 font-medium text-white transition-colors hover:bg-black/80"
      >
        {isRegister ? "Create account" : "Login"}
        <ArrowRight aria-hidden="true" className="size-4" />
      </button>

      <p className="text-carbon-600 mt-6 text-center text-sm">
        {isRegister ? "Already have an account?" : "New to HauxHunt?"}{" "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium text-black underline underline-offset-4"
        >
          {isRegister ? "Login" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  className,
}: FieldProps) {
  return (
    <label className={className}>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className="contact-field-control h-12 w-full rounded-xl border border-black/20 px-4 transition-colors outline-none focus:border-black"
      />
    </label>
  );
}

type PasswordFieldProps = {
  label: string;
  name: string;
  autoComplete: string;
  visible: boolean;
  onToggle: () => void;
  required?: boolean;
};

function PasswordField({
  label,
  name,
  autoComplete,
  visible,
  onToggle,
  required,
}: PasswordFieldProps) {
  return (
    <label>
      <span className="text-carbon-900 mb-2 block text-sm font-medium">
        {label}
      </span>
      <span className="flex h-12 items-center rounded-xl border border-black/20 px-4 transition-colors focus-within:border-black">
        <input
          type={visible ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          minLength={8}
          required={required}
          className="contact-field-control min-w-0 flex-1 bg-transparent outline-none"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-carbon-500 hover:text-carbon-900 -mr-1 flex size-8 items-center justify-center rounded-full"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </span>
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
      <span className="relative block">
        <select
          name={name}
          defaultValue=""
          required={required}
          className="contact-field-control h-12 w-full appearance-none rounded-xl border border-black/20 bg-white pr-11 pl-4 transition-colors outline-none focus:border-black"
        >
          <option value="" disabled>
            Choose country
          </option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="text-carbon-500 pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
        />
      </span>
    </label>
  );
}

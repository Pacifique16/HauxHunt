"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, FileText, X } from "lucide-react";
import { useState } from "react";
import agreedIllustration from "@/assets/images/agreed.png";
import managerAvatar from "@/assets/images/julien.jpg";
import { RenterCatalogueTopBar } from "@/components/renter/renter-catalogue-top-bar";
const steps = [
  "Rental Details",
  "Rental Agreement",
  "Payments",
  "Move-in",
  "Complete",
];
type Modal =
  "question" | "agreement" | "sign" | "payment" | "receipt" | "decline" | null;
export default function RentalSetupPage() {
  const [step, setStep] = useState(0);
  const [reviewed, setReviewed] = useState(false);
  const [read, setRead] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signedAt, setSignedAt] = useState("");
  const [paid, setPaid] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [signature, setSignature] = useState("");
  const [declined, setDeclined] = useState(false);
  function save(next = step) {
    setStep(next);
  }
  if (declined)
    return (
      <State
        title="Invitation declined"
        text="You chose not to continue the rental setup for Nyarutarama Garden Apartment."
        href="/renter-dashboard/applications"
        action="View Application"
      />
    );
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 min-h-svh pt-16 text-black">
        <header className="border-b border-black/10 bg-white px-5 py-7 sm:px-6 lg:px-11">
          <div className="mx-auto max-w-[1120px]">
            <Link
              href="/renter-dashboard/applications"
              className="inline-flex items-center gap-1 text-sm text-black/60"
            >
              <ChevronLeft className="size-4" />
              Applications
            </Link>
            <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
              <div>
                <h1 className="font-bricolage text-3xl font-medium">
                  Nyarutarama Garden Apartment
                </h1>
                <p className="text-carbon-500 mt-1">Nyarutarama, Kigali</p>
              </div>
              <span className="rounded-full bg-black px-3 py-1.5 text-xs text-white">
                {step === 4 ? "Ready for Move-in" : "Setup in progress"}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Image
                src={managerAvatar}
                alt="Jean Mugisha"
                className="size-9 rounded-full object-cover"
              />
              <p className="text-sm">
                <span className="text-carbon-500">Invited by </span>
                <strong>Jean Mugisha</strong> · Verified Property Manager
              </p>
              <button
                type="button"
                onClick={() => setModal("decline")}
                className="ml-auto text-xs text-black/55 underline underline-offset-4"
              >
                Decline Invitation
              </button>
            </div>
          </div>
        </header>
        <div className="mx-auto grid max-w-[1120px] gap-6 px-5 py-8 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit bg-white p-5">
            <p className="text-sm font-medium">
              {Math.min(step, 4)} of 4 requirements complete
            </p>
            <div className="mt-4 h-1 bg-black/10">
              <div
                className="h-full bg-black"
                style={{ width: `${step * 25}%` }}
              />
            </div>
            <nav className="mt-5 space-y-1">
              {steps.map((s, i) => (
                <button
                  key={s}
                  onClick={() => i <= step && setStep(i)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${i === step ? "bg-black text-white" : "text-black/55"}`}
                >
                  <span className="flex size-5 items-center justify-center rounded-full border border-current text-[10px]">
                    {i < step ? <Check className="size-3" /> : i + 1}
                  </span>
                  {s}
                </button>
              ))}
            </nav>
          </aside>
          <section className="bg-white p-6 shadow-[0_3px_14px_rgba(0,0,0,.03)] sm:p-8">
            {step === 0 ? (
              <Details
                reviewed={reviewed}
                setReviewed={setReviewed}
                question={() => setModal("question")}
                next={() => save(1)}
              />
            ) : null}
            {step === 1 ? (
              <Agreement
                read={read}
                understood={understood}
                setRead={setRead}
                setUnderstood={setUnderstood}
                signed={signed}
                signedAt={signedAt}
                preview={() => setModal("agreement")}
                sign={() => setModal("sign")}
                next={() => save(2)}
              />
            ) : null}
            {step === 2 ? (
              <Payments
                paid={paid}
                pay={() => setModal("payment")}
                receipt={() => setModal("receipt")}
                next={() => save(3)}
              />
            ) : null}
            {step === 3 ? <MoveIn next={() => save(4)} /> : null}
            {step === 4 ? <Complete /> : null}
          </section>
        </div>
      </main>
      {modal ? (
        <SetupModal
          type={modal}
          close={() => setModal(null)}
          signature={signature}
          setSignature={setSignature}
          confirm={() => {
            if (modal === "sign") {
              const signatureDate = new Date().toISOString();
              setSigned(true);
              setSignedAt(signatureDate);
            }
            if (modal === "payment") {
              setPaid(true);
            }
            if (modal === "decline") {
              setDeclined(true);
            }
            setModal(null);
          }}
        />
      ) : null}
    </>
  );
}
const Row = ({ a, b }: { a: string; b: string }) => (
  <div className="flex justify-between gap-5 border-b border-black/10 py-3 text-sm">
    <span className="text-carbon-500">{a}</span>
    <strong className="text-right">{b}</strong>
  </div>
);
function formatSignedDate(value: string) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
function Details({
  reviewed,
  setReviewed,
  question,
  next,
}: {
  reviewed: boolean;
  setReviewed: (v: boolean) => void;
  question: () => void;
  next: () => void;
}) {
  return (
    <>
      <h2 className="font-bricolage text-3xl font-medium">Rental Details</h2>
      <p className="text-carbon-500 mt-2 text-sm">
        Review the terms provided by the verified property representative.
      </p>
      <div className="mt-6 grid gap-x-7 sm:grid-cols-2">
        <Row a="Property" b="Nyarutarama Garden Apartment" />
        <Row a="Monthly Rent" b="RWF 850,000" />
        <Row a="Security Deposit" b="RWF 850,000" />
        <Row a="Rental Start" b="1 September 2026" />
        <Row a="Rental End" b="31 August 2027" />
        <Row a="Rental Term" b="12 months" />
        <Row a="Payment Frequency" b="Monthly" />
        <Row a="Rent Due" b="1st of every month" />
        <Row a="Occupants" b="2 occupants" />
        <Row a="Managed By" b="Jean Mugisha" />
      </div>
      <div className="mt-6 flex gap-3">
        <Link
          href="/properties/nyarutarama-2br?from=renter"
          className="rounded-full border border-black/15 px-4 py-2.5 text-sm"
        >
          View Property
        </Link>
        <Link
          href="/renter-dashboard/messages?host=Jean%20Mugisha"
          className="rounded-full border border-black/15 px-4 py-2.5 text-sm"
        >
          Message Manager
        </Link>
      </div>
      <label className="mt-7 flex gap-3 text-sm">
        <input
          type="checkbox"
          checked={reviewed}
          onChange={(e) => setReviewed(e.target.checked)}
          className="size-4 accent-black"
        />
        I have reviewed the rental details above.
      </label>
      <Footer
        back={question}
        backLabel="Something doesn't look right"
        next={next}
        disabled={!reviewed}
        nextLabel="Continue to Agreement"
      />
    </>
  );
}
function Agreement({
  read,
  understood,
  setRead,
  setUnderstood,
  signed,
  signedAt,
  preview,
  sign,
  next,
}: {
  read: boolean;
  understood: boolean;
  setRead: (v: boolean) => void;
  setUnderstood: (v: boolean) => void;
  signed: boolean;
  signedAt: string;
  preview: () => void;
  sign: () => void;
  next: () => void;
}) {
  return (
    <>
      <h2 className="font-bricolage text-3xl font-medium">Rental Agreement</h2>
      <p className="text-carbon-500 mt-2 text-sm">
        Review your rental agreement carefully before signing.
      </p>
      <div className="mt-6 border border-black/10 p-5">
        <p className="flex items-center gap-2 font-medium">
          <FileText className="size-5" />
          Nyarutarama Garden Apartment Rental Agreement
        </p>
        <p className="text-carbon-500 mt-3 text-sm leading-6">
          Pacifique Harerimana and Jean Mugisha
          <br />1 Sep 2026 – 31 Aug 2027
        </p>
        <button onClick={preview} className="mt-4 text-sm underline">
          View Full Agreement
        </button>
      </div>
      <h3 className="font-bricolage mt-7 text-xl font-medium">Key Terms</h3>
      <div className="grid gap-x-8 sm:grid-cols-2">
        <Row a="Monthly rent" b="RWF 850,000" />
        <Row a="Deposit" b="RWF 850,000" />
        <Row a="Notice period" b="30 days" />
        <Row a="Rent due" b="1st monthly" />
      </div>
      {!signed ? (
        <div className="mt-6 space-y-3">
          <label className="flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={read}
              onChange={(e) => setRead(e.target.checked)}
              className="size-4 accent-black"
            />
            I have read and reviewed the rental agreement.
          </label>
          <label className="flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="size-4 accent-black"
            />
            I understand the rental terms and obligations.
          </label>
          <button
            disabled={!read || !understood}
            onClick={sign}
            className="mt-3 h-11 rounded-full bg-black px-5 text-sm text-white disabled:opacity-30"
          >
            Sign Agreement
          </button>
        </div>
      ) : (
        <p className="mt-6 flex items-center gap-2 text-sm font-medium">
          <Check className="size-5" />
          Agreement Signed · {formatSignedDate(signedAt)}
        </p>
      )}
      <Footer next={next} disabled={!signed} nextLabel="Continue to Payments" />
    </>
  );
}
function Payments({
  paid,
  pay,
  receipt,
  next,
}: {
  paid: boolean;
  pay: () => void;
  receipt: () => void;
  next: () => void;
}) {
  return (
    <>
      <h2 className="font-bricolage text-3xl font-medium">Required Payments</h2>
      <div className="mt-6">
        <Row a="Security Deposit" b={paid ? "Paid" : "RWF 850,000 · Pending"} />
        <Row
          a="First Month's Rent"
          b={paid ? "Paid" : "RWF 850,000 · Pending"}
        />
        <Row a="Total Due Now" b={paid ? "RWF 0" : "RWF 1,700,000"} />
      </div>
      {paid ? (
        <div className="mt-6">
          <p className="flex items-center gap-2 font-medium">
            <Check className="size-5" />
            Payment Successful
          </p>
          <p className="text-carbon-500 mt-2 text-sm">
            Reference HH-PAY-20481 · 28 August 2026
          </p>
          <button onClick={receipt} className="mt-3 text-sm underline">
            View Receipt
          </button>
        </div>
      ) : (
        <button
          onClick={pay}
          className="mt-6 h-11 rounded-full bg-black px-5 text-sm text-white"
        >
          Make Payment
        </button>
      )}
      <Footer next={next} disabled={!paid} nextLabel="Continue to Move-in" />
    </>
  );
}
function MoveIn({ next }: { next: () => void }) {
  return (
    <>
      <h2 className="font-bricolage text-3xl font-medium">Move-in Details</h2>
      <div className="mt-6">
        <Row a="Move-in Date" b="1 September 2026" />
        <Row a="Key Handover" b="At the property · 10:00 AM" />
        <Row a="Contact" b="Jean Mugisha" />
        <Row a="Move-in Inspection" b="Not Started" />
      </div>
      <h3 className="font-bricolage mt-7 text-xl font-medium">Instructions</h3>
      <ul className="text-carbon-500 mt-3 list-disc space-y-2 pl-5 text-sm">
        <li>Bring identification.</li>
        <li>Meet Jean at the property.</li>
        <li>Complete the inspection before accepting keys.</li>
      </ul>
      <div className="mt-7 space-y-2">
        {[
          "Rental details confirmed",
          "Rental agreement signed",
          "Required payment completed",
          "Move-in inspection pending",
          "Keys pending",
        ].map((x, i) => (
          <p key={x} className="flex gap-2 text-sm">
            <Check className={`size-4 ${i < 3 ? "" : "text-black/25"}`} />
            {x}
          </p>
        ))}
      </div>
      <Footer next={next} nextLabel="Complete Setup" />
    </>
  );
}
function Complete() {
  return (
    <div className="py-8 text-center">
      <Image
        src={agreedIllustration}
        alt="Rental agreement completed"
        className="mx-auto h-40 w-auto object-contain"
        priority
      />
      <h2 className="font-bricolage mt-5 text-3xl font-medium">
        Your Rental Is Ready
      </h2>
      <p className="text-carbon-500 mt-3">
        Your setup for Nyarutarama Garden Apartment is complete. Your rental
        begins 1 September 2026.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Link
          href="/renter-dashboard/messages?host=Jean%20Mugisha"
          className="rounded-full border border-black/15 px-5 py-3 text-sm"
        >
          Message Manager
        </Link>
        <Link
          href="/renter-dashboard/rentals"
          className="rounded-full bg-black px-5 py-3 text-sm text-white"
        >
          Go to My Rentals
        </Link>
      </div>
    </div>
  );
}
function Footer({
  back,
  backLabel,
  next,
  disabled,
  nextLabel,
}: {
  back?: () => void;
  backLabel?: string;
  next: () => void;
  disabled?: boolean;
  nextLabel: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5">
      {back ? (
        <button onClick={back} className="text-sm underline">
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        disabled={disabled}
        onClick={next}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm text-white disabled:opacity-30"
      >
        {nextLabel}
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
function SetupModal({
  type,
  close,
  signature,
  setSignature,
  confirm,
}: {
  type: Exclude<Modal, null>;
  close: () => void;
  signature: string;
  setSignature: (v: string) => void;
  confirm: () => void;
}) {
  const title = {
    question: "Question these rental details?",
    agreement: "Nyarutarama Garden Apartment Rental Agreement",
    sign: "Sign Rental Agreement",
    payment: "Make Required Payment",
    receipt: "Payment Receipt",
    decline: "Decline this rental invitation?",
  }[type];
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-5"
      onMouseDown={close}
    >
      <div
        role="dialog"
        onMouseDown={(e) => e.stopPropagation()}
        className={`relative max-h-[90svh] w-full overflow-y-auto bg-white p-7 shadow-2xl ${type === "agreement" ? "max-w-3xl" : "max-w-lg"}`}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full"
        >
          <X className="size-4" />
        </button>
        <h2 className="font-bricolage text-2xl font-medium">{title}</h2>
        {type === "agreement" ? (
          <AgreementDocument />
        ) : (
          <p className="text-carbon-500 mt-3 text-sm leading-6">
            {type === "question"
              ? "Contact the property representative before continuing if the rent, dates, deposit, or terms are incorrect."
              : type === "payment"
                ? "Payment of RWF 1,700,000 using Mobile Money, Card, or Bank Transfer. No real payment will be processed."
                : type === "receipt"
                  ? "RWF 1,700,000 · Rental setup · HH-PAY-20481 · 28 August 2026 · Pacifique Harerimana"
                  : "Type your full name to confirm your signature."}
          </p>
        )}
        {type === "sign" ? (
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Pacifique Harerimana"
            className="mt-5 h-11 w-full border-b border-black/20 outline-none"
          />
        ) : null}
        {["sign", "payment", "decline"].includes(type) ? (
          <button
            disabled={type === "sign" && !signature.trim()}
            onClick={confirm}
            className="mt-6 h-11 rounded-full bg-black px-5 text-sm text-white disabled:opacity-30"
          >
            {type === "sign"
              ? "Confirm & Sign"
              : type === "payment"
                ? "Confirm Mock Payment"
                : "Decline Invitation"}
          </button>
        ) : (
          <button
            onClick={close}
            className="mt-6 h-11 rounded-full bg-black px-5 text-sm text-white"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
function AgreementDocument() {
  return (
    <div className="mt-5 bg-black/[0.035] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl bg-white px-6 py-8 shadow-sm sm:px-10">
        <div className="border-b border-black/15 pb-5 text-center">
          <p className="text-carbon-500 text-xs tracking-[0.12em] uppercase">
            Uploaded by Jean Mugisha · 27 August 2026
          </p>
          <h3 className="font-bricolage mt-3 text-2xl font-medium">
            Residential Rental Agreement
          </h3>
          <p className="text-carbon-500 mt-2 text-sm">
            Nyarutarama Garden Apartment · Nyarutarama, Kigali
          </p>
        </div>
        <div className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <p className="text-carbon-500 text-xs">Renter</p>
            <p className="mt-1 font-medium">Pacifique Harerimana</p>
          </div>
          <div>
            <p className="text-carbon-500 text-xs">Property Representative</p>
            <p className="mt-1 font-medium">Jean Mugisha</p>
          </div>
          <div>
            <p className="text-carbon-500 text-xs">Rental period</p>
            <p className="mt-1 font-medium">1 Sep 2026 – 31 Aug 2027</p>
          </div>
          <div>
            <p className="text-carbon-500 text-xs">Monthly rent</p>
            <p className="mt-1 font-medium">RWF 850,000</p>
          </div>
        </div>
        <div className="mt-7 space-y-6 text-sm leading-6">
          <section>
            <h4 className="font-medium">1. Rental term</h4>
            <p className="text-carbon-600 mt-2">
              The property is rented for twelve months beginning 1 September
              2026 and ending 31 August 2027.
            </p>
          </section>
          <section>
            <h4 className="font-medium">2. Rent and deposit</h4>
            <p className="text-carbon-600 mt-2">
              Monthly rent of RWF 850,000 is due on the first day of each month.
              A security deposit of RWF 850,000 is required before move-in.
            </p>
          </section>
          <section>
            <h4 className="font-medium">3. Care of the property</h4>
            <p className="text-carbon-600 mt-2">
              The renter agrees to keep the home in reasonable condition and
              report maintenance issues promptly.
            </p>
          </section>
          <section>
            <h4 className="font-medium">4. Notice</h4>
            <p className="text-carbon-600 mt-2">
              Either party should provide at least 30 days&apos; notice where
              notice is permitted by the agreement.
            </p>
          </section>
        </div>
        <div className="mt-8 grid gap-6 border-t border-black/15 pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-carbon-500 text-xs">Renter signature</p>
            <p className="mt-3 border-b border-black/30 pb-2">
              Awaiting signature
            </p>
          </div>
          <div>
            <p className="text-carbon-500 text-xs">Property representative</p>
            <p className="mt-3 border-b border-black/30 pb-2">
              Jean Mugisha · Signed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function State({
  title,
  text,
  href,
  action,
}: {
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <>
      <RenterCatalogueTopBar />
      <main className="bg-carbon-50 flex min-h-svh items-center justify-center px-5 pt-16">
        <div className="bg-white p-8 text-center">
          <h1 className="font-bricolage text-3xl font-medium">{title}</h1>
          <p className="text-carbon-500 mt-3">{text}</p>
          <Link
            href={href}
            className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm text-white"
          >
            {action}
          </Link>
        </div>
      </main>
    </>
  );
}

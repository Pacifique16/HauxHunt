"use client";

import { Check, MapPinned, MessageCircleMore, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setTenantPlan, useTenantPlan } from "@/components/renter/use-tenant-plan";

const FREE_FEATURES = [
  "Access to all property listings",
  "Contact up to 3 agents or landlords per month",
  "Standard market-rate viewing fees",
];

const PAID_FEATURES = [
  "Unlimited messaging & instant WhatsApp alerts",
  "Interactive map view, direct location links & house reviews",
  "In-app maintenance requests & priority red alerts",
  "Viewing fees strictly capped at RWF 5,000",
];

/**
 * Tenant-side pricing UI (Free vs. Paid). There is no billing backend yet,
 * so "Upgrade Now" / "Continue with Free" simulate the plan switch the same
 * way `setPartnerPlan` does for owners (src/components/partner/*plan*) —
 * instant local state, no checkout redirect.
 */
export function TenantPricingPlans() {
  const plan = useTenantPlan();
  const [toast, setToast] = useState("");

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  return (
    <div>
      <div className="grid items-start gap-6 sm:grid-cols-2">
        <PlanCard
          badgeLabel="Free"
          title="Free"
          price="RWF 0"
          priceNote="No card required"
          features={FREE_FEATURES}
          highlighted={false}
        >
          <Button
            type="button"
            variant="outline-solid"
            size="pill-lg"
            disabled={plan === "free"}
            onClick={() => {
              setTenantPlan("free");
              showToast("You're back on the Free plan");
            }}
            className="mt-7 w-full disabled:opacity-40"
          >
            {plan === "free" ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                Current Plan
              </>
            ) : (
              "Continue with Free"
            )}
          </Button>
        </PlanCard>

        <PlanCard
          badgeLabel="Most Popular"
          title="Paid"
          price="RWF 5,000"
          priceNote="Viewing fee cap · billed per active search"
          features={PAID_FEATURES}
          highlighted
        >
          <Button
            type="button"
            variant="outline-solid"
            size="pill-lg"
            disabled={plan === "paid"}
            onClick={() => {
              setTenantPlan("paid");
              showToast("You've upgraded to the Paid plan");
            }}
            className="mt-7 w-full disabled:opacity-60"
          >
            {plan === "paid" ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                Current Plan
              </>
            ) : (
              "Upgrade Now"
            )}
          </Button>
        </PlanCard>
      </div>

      {toast ? (
        <div role="status" className="feedback-toast">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

const FEATURE_ICONS = [ShieldCheck, MessageCircleMore, MapPinned, Sparkles];

function PlanCard({
  badgeLabel,
  title,
  price,
  priceNote,
  features,
  highlighted,
  children,
}: {
  badgeLabel: string;
  title: string;
  price: string;
  priceNote: string;
  features: string[];
  highlighted: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`plan-${title.toLowerCase()}-title`}
      className={
        highlighted
          ? "relative rounded-2xl bg-black p-7 text-white shadow-[0_28px_70px_rgba(0,0,0,0.25)] sm:p-8"
          : "rounded-2xl border border-black/10 bg-white p-7 sm:p-8"
      }
    >
      <Badge variant={highlighted ? "solid" : "neutral"} className={highlighted ? "bg-white text-black" : undefined}>
        {highlighted ? <Sparkles aria-hidden="true" className="size-3" /> : null}
        {badgeLabel}
      </Badge>

      <h3
        id={`plan-${title.toLowerCase()}-title`}
        className="font-bricolage mt-4 text-2xl font-medium tracking-[-0.02em]"
      >
        {title} Plan
      </h3>

      <p className="mt-4">
        <span className="font-bricolage text-3xl font-medium">{price}</span>
        <span className={highlighted ? "ml-2 text-sm text-white/60" : "text-carbon-500 ml-2 text-sm"}>
          {priceNote}
        </span>
      </p>

      <ul className={`mt-6 space-y-3.5 border-t pt-6 text-sm ${highlighted ? "border-white/15" : "border-black/10"}`}>
        {features.map((feature, index) => {
          const Icon = highlighted ? (FEATURE_ICONS[index] ?? Sparkles) : Check;
          return (
            <li key={feature} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  highlighted ? "bg-white/15" : "bg-black/[0.055]"
                }`}
              >
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
              <span className={highlighted ? "text-white/90" : "text-carbon-700"}>
                {feature}
              </span>
            </li>
          );
        })}
      </ul>

      {children}
    </section>
  );
}

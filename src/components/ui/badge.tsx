import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-black/[0.055] text-black/70",
        solid: "bg-black text-white",
        success: "border border-success-border bg-success-bg text-success",
        warning: "border border-warning-border bg-warning-bg text-warning",
        danger: "border border-danger-border bg-danger-bg text-danger",
        info: "border border-info-border bg-info-bg text-info",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

/**
 * Generic status pill. Nothing like this existed before FlatMat — the app's
 * only badge-shaped UI was a private, non-exported `VerifiedBadge` function
 * inside partner-verification-form.tsx. This is the shared base; see
 * `VerifiedBadge` (src/components/ui/verified-badge.tsx) and
 * `LockedProfileBadge` (src/components/flatmates) for the concrete uses.
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { badgeVariants };

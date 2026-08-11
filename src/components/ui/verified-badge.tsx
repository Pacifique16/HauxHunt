import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Shared "Verified" pill — generalized from the private, non-exported
 * `VerifiedBadge` function in partner-verification-form.tsx (same look:
 * solid black pill, `Check` icon). That copy is left in place to avoid
 * touching working partner-dashboard code; new code (including FlatMat's
 * unlocked profiles) should import this one instead of writing a fourth
 * near-identical badge.
 */
export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Badge variant="solid" className={cn("py-2", className)}>
      <Check aria-hidden="true" className="size-3" /> Verified
    </Badge>
  );
}

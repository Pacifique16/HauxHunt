import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function LockedProfileBadge({ className }: { className?: string }) {
  return (
    <Badge variant="neutral" className={className}>
      <Lock aria-hidden="true" className="size-3" /> Locked Profile
    </Badge>
  );
}

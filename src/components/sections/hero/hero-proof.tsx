import { KeyRound, ReceiptText, ShieldCheck } from "lucide-react";

const PROOF_POINTS = [
  { icon: ShieldCheck, label: "Every listing verified" },
  { icon: ReceiptText, label: "True move-in cost upfront" },
  { icon: KeyRound, label: "Landlords identity-checked" },
] as const;

/**
 * Three quiet proof points closing the composition.
 *
 * Deliberately the lowest-contrast text in the hero and set at Label size:
 * these are reassurance the eye collects on its way out, not a claim competing
 * with the statement above. Each pairs an icon with words — never a bare
 * coloured dot, which would carry meaning in colour alone.
 */
export function HeroProof() {
  return (
    <ul className="flex flex-col gap-x-10 gap-y-3 sm:flex-row sm:flex-wrap">
      {PROOF_POINTS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="text-label text-fg-muted flex items-center gap-2.5"
        >
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {label}
        </li>
      ))}
    </ul>
  );
}

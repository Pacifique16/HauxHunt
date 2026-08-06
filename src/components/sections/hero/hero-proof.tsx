import { KeyRound, ReceiptText, ShieldCheck } from "lucide-react";

const PROOF_POINTS = [
  { icon: ShieldCheck, label: "Verified homes" },
  { icon: KeyRound, label: "Checked landlords" },
  { icon: ReceiptText, label: "Clear move-in costs" },
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
    <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
      {PROOF_POINTS.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="text-caption text-fg-tertiary flex items-center gap-2"
        >
          <Icon aria-hidden="true" className="text-fg-brand size-4 shrink-0" />
          {label}
        </li>
      ))}
    </ul>
  );
}
